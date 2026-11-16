import type { IncomingMessage, ServerResponse } from 'node:http';

const DEFAULT_ADMIN_PASSCODE = 'royal_wedding_2026';

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return {
    url: url.replace(/\/+$/, ''),
    key,
  };
}

export type BlessingStatus = 'pending' | 'approved' | 'rejected';

export type Blessing = {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: BlessingStatus;
};

function sendJson(response: ServerResponse, status: number, body: Record<string, unknown>): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.end(JSON.stringify(body));
}

async function getJsonBody(request: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (typeof request.body === 'object' && request.body !== null) {
    return request.body as Record<string, unknown>;
  }
  if (typeof request.body === 'string') {
    try {
      const parsed = JSON.parse(request.body);
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch {}
  }
  return new Promise((resolve) => {
    let raw = '';
    request.on('data', (chunk) => { raw += chunk; });
    request.on('end', () => {
      try {
        const parsed = JSON.parse(raw);
        resolve(typeof parsed === 'object' && parsed !== null ? parsed : {});
      } catch {
        resolve({});
      }
    });
    request.on('error', () => resolve({}));
  });
}

function toCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export default async function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse
) {
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.end();
  }

  const { url, key } = getSupabaseConfig();
  const adminPasscode = process.env.ADMIN_PASSCODE || DEFAULT_ADMIN_PASSCODE;

  const reqUrl = new URL(request.url || '/', 'http://localhost');
  const route = reqUrl.pathname.replace(/^\/api\/admin\/?/, '').split('/').filter(Boolean);

  // POST /api/admin/login
  if (route[0] === 'login' && request.method === 'POST') {
    const body = await getJsonBody(request);
    if (body.passcode === adminPasscode) {
      return sendJson(response, 200, { success: true, token: adminPasscode });
    }
    return sendJson(response, 401, { success: false, error: 'Incorrect passcode.' });
  }

  // Verify auth header or query token
  const authHeader = request.headers.authorization;
  const token =
    (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : '') ||
    reqUrl.searchParams.get('token') ||
    '';

  if (!token || token !== adminPasscode) {
    return sendJson(response, 401, { success: false, error: 'Unauthorized admin access.' });
  }

  try {
    if (route[0] !== 'blessings') {
      return sendJson(response, 404, { success: false, error: 'Admin endpoint not found.' });
    }

    // GET /api/admin/blessings
    if (route.length === 1 && request.method === 'GET') {
      const res = await fetch(`${url}/rest/v1/blessings?select=id,guest_name,message,created_at,status&order=created_at.desc`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const err = await res.text();
        return sendJson(response, 200, { success: true, blessings: [] });
      }

      const rows = (await res.json()) as Array<{
        id: string;
        guest_name: string;
        message: string;
        created_at: string;
        status: string;
      }>;
      const blessings: Blessing[] = rows.map((r) => ({
        id: r.id,
        guestName: r.guest_name,
        message: r.message,
        createdAt: r.created_at,
        status: (r.status as BlessingStatus) || 'approved',
      }));
      return sendJson(response, 200, { success: true, blessings });
    }

    // GET /api/admin/blessings/export
    if (route[1] === 'export' && request.method === 'GET') {
      const res = await fetch(`${url}/rest/v1/blessings?select=id,guest_name,message,created_at,status&order=created_at.desc`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      const rows = res.ok ? ((await res.json()) as Array<any>) : [];
      const header = ['ID', 'Date', 'Guest Name', 'Status', 'Message'];
      const csvRows = rows.map((r) => [
        r.id,
        new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        r.guest_name,
        r.status,
        r.message,
      ]);
      const csv = [header, ...csvRows]
        .map((row) => row.map((val) => toCsvValue(String(val || ''))).join(','))
        .join('\r\n');

      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/csv; charset=utf-8');
      response.setHeader('Content-Disposition', 'attachment; filename="vignesh-pavithra-blessings.csv"');
      return response.end(csv);
    }

    const id = route[1];
    if (!id) return sendJson(response, 404, { success: false, error: 'Blessing not found.' });

    // POST /api/admin/blessings/:id/approve or reject
    if (route[2] === 'approve' || route[2] === 'reject') {
      const status: BlessingStatus = route[2] === 'approve' ? 'approved' : 'rejected';
      const res = await fetch(`${url}/rest/v1/blessings?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        return sendJson(response, 500, { success: false, error: 'Failed to update blessing status.' });
      }
      const data = await res.json();
      return sendJson(response, 200, { success: true, blessing: data[0] });
    }

    // DELETE /api/admin/blessings/:id
    if (request.method === 'DELETE') {
      const res = await fetch(`${url}/rest/v1/blessings?id=eq.${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'return=representation',
        },
      });

      if (!res.ok) {
        return sendJson(response, 500, { success: false, error: 'Failed to delete blessing.' });
      }
      return sendJson(response, 200, { success: true, message: 'Blessing removed.' });
    }

    response.setHeader('Allow', 'GET, POST, DELETE');
    return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
  } catch (error) {
    console.error('Admin API error:', error);
    return sendJson(response, 500, {
      success: false,
      error: error instanceof Error ? error.message : 'Admin operation failed.',
    });
  }
}
