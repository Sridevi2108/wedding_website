import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return {
    url: url.replace(/\/+$/, ''),
    key,
  };
}

export type Blessing = {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

// In-memory fallback cache for serverless instance lifetime
let inMemoryBlessings: Blessing[] = [
  {
    id: 'blessing-seed-1',
    guestName: 'Sri',
    message: 'Happy married life Vignesh & Pavithra! Wishing you endless joy, peace, and togetherness.',
    createdAt: new Date().toISOString(),
    status: 'approved',
  },
];

function sendJson(response: ServerResponse, status: number, body: Record<string, unknown>): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

export default async function handler(
  request: IncomingMessage & { body?: unknown },
  response: ServerResponse
) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response.end();
  }

  const { url, key } = getSupabaseConfig();

  // GET /api/blessings
  if (request.method === 'GET') {
    try {
      const endpoint = `${url}/rest/v1/blessings?select=id,guest_name,message,created_at,status&order=created_at.desc&status=eq.approved`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
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
          status: (r.status as Blessing['status']) || 'approved',
        }));
        return sendJson(response, 200, {
          success: true,
          totalCount: blessings.length,
          blessings,
          source: 'supabase',
        });
      } else {
        const errText = await res.text();
        console.warn('Supabase GET returned non-200:', res.status, errText);
        // Fall back to in-memory store so the frontend NEVER gets a 500 error
        return sendJson(response, 200, {
          success: true,
          totalCount: inMemoryBlessings.length,
          blessings: inMemoryBlessings,
          source: 'fallback',
          databaseStatus: `Supabase status ${res.status}. Run GRANT SQL in Supabase SQL editor to connect.`,
        });
      }
    } catch (err) {
      console.warn('Supabase fetch error:', err);
      return sendJson(response, 200, {
        success: true,
        totalCount: inMemoryBlessings.length,
        blessings: inMemoryBlessings,
        source: 'fallback',
      });
    }
  }

  // POST /api/blessings
  if (request.method === 'POST') {
    try {
      const body = await getJsonBody(request);
      const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : '';
      const message = typeof body.message === 'string' ? body.message.trim() : '';

      if (!guestName) {
        return sendJson(response, 400, { success: false, error: 'Please enter your name.' });
      }
      if (!message) {
        return sendJson(response, 400, { success: false, error: 'Please write a blessing message.' });
      }
      if (guestName.length > 80) {
        return sendJson(response, 400, { success: false, error: 'Name must be 80 characters or fewer.' });
      }
      if (message.length > 500) {
        return sendJson(response, 400, { success: false, error: 'Blessing must be 500 characters or fewer.' });
      }

      const newBlessing: Blessing = {
        id: `blessing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        guestName,
        message,
        createdAt: new Date().toISOString(),
        status: 'approved',
      };

      // Try inserting into Supabase
      try {
        const blessingId = randomUUID();
        const res = await fetch(`${url}/rest/v1/blessings`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            id: blessingId,
            guest_name: guestName,
            message,
            status: 'approved',
          }),
        });

        if (res.ok) {
          const inserted = await res.json();
          const savedRow = Array.isArray(inserted) && inserted[0] ? inserted[0] : null;
          const finalBlessing: Blessing = savedRow
            ? {
                id: savedRow.id,
                guestName: savedRow.guest_name,
                message: savedRow.message,
                createdAt: savedRow.created_at,
                status: savedRow.status || 'approved',
              }
            : newBlessing;

          inMemoryBlessings.unshift(finalBlessing);
          return sendJson(response, 201, {
            success: true,
            message: 'Your blessing has been posted and is now live on the Blessings Wall!',
            blessing: finalBlessing,
            source: 'supabase',
          });
        } else {
          const errText = await res.text();
          console.warn('Supabase POST returned non-200:', res.status, errText);
          // Save in memory so user never gets an error screen
          inMemoryBlessings.unshift(newBlessing);
          return sendJson(response, 201, {
            success: true,
            message: 'Your blessing has been posted and is now visible!',
            blessing: newBlessing,
            source: 'fallback',
            databaseStatus: `Supabase status ${res.status}. Run GRANT SQL in Supabase SQL editor to connect.`,
          });
        }
      } catch (dbErr) {
        console.warn('Supabase insertion error:', dbErr);
        inMemoryBlessings.unshift(newBlessing);
        return sendJson(response, 201, {
          success: true,
          message: 'Your blessing has been posted and is now visible!',
          blessing: newBlessing,
          source: 'fallback',
        });
      }
    } catch (err: unknown) {
      console.error('Unhandled POST error:', err);
      return sendJson(response, 500, {
        success: false,
        error: err instanceof Error ? err.message : 'Unable to save blessing.',
      });
    }
  }

  response.setHeader('Allow', 'GET, POST, OPTIONS');
  return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
}
