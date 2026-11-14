import { env } from 'node:process';
import type { IncomingMessage, ServerResponse } from 'node:http';

export type BlessingStatus = 'pending' | 'approved' | 'rejected';

export interface Blessing {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: BlessingStatus;
}

interface DatabaseBlessing {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
  status: BlessingStatus;
}

export type ApiRequest = IncomingMessage & { body?: unknown };

export function sendJson(
  response: ServerResponse,
  status: number,
  body: Record<string, unknown>
): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

export function getBody(request: ApiRequest): Record<string, unknown> {
  if (typeof request.body === 'object' && request.body !== null) {
    return request.body as Record<string, unknown>;
  }
  if (typeof request.body === 'string') {
    const body: unknown = JSON.parse(request.body);
    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      return body as Record<string, unknown>;
    }
  }
  return {};
}

export function getAdminPasscode(): string | undefined {
  return env.ADMIN_PASSCODE;
}

export function isValidAdminToken(request: ApiRequest, passcode: string): boolean {
  const authorization = request.headers.authorization;
  const headerToken =
    typeof authorization === 'string' && authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : '';
  const url = new URL(request.url || '/', 'http://localhost');
  const token = headerToken || url.searchParams.get('token') || '';
  return token.length === passcode.length && token === passcode;
}

export function requireSupabaseConfig(): { url: string; key: string } {
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Blessings database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  return { url: url.replace(/\/+$/, ''), key };
}

export function isSupabaseConfigurationError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith('Blessings database is not configured.');
}

async function databaseRequest<T>(resource: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = requireSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${resource}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const responseText = await response.text();
  if (!response.ok) {
    let detail = responseText;
    try {
      const errorBody: unknown = JSON.parse(responseText);
      if (typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody) {
        detail = String(errorBody.message);
      }
    } catch {
      // Keep the response text when Supabase does not return JSON.
    }
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }
  return (responseText ? JSON.parse(responseText) : null) as T;
}

function mapBlessing(row: DatabaseBlessing): Blessing {
  return {
    id: row.id,
    guestName: row.guest_name,
    message: row.message,
    createdAt: row.created_at,
    status: row.status,
  };
}

export async function listBlessings(status?: BlessingStatus): Promise<Blessing[]> {
  const query = new URLSearchParams({
    select: 'id,guest_name,message,created_at,status',
    order: 'created_at.desc',
  });
  if (status) query.set('status', `eq.${status}`);
  const rows = await databaseRequest<DatabaseBlessing[]>(`blessings?${query.toString()}`);
  return rows.map(mapBlessing);
}

export async function insertBlessing(guestName: string, message: string): Promise<Blessing> {
  const rows = await databaseRequest<DatabaseBlessing[]>('blessings', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ guest_name: guestName, message, status: 'approved' }),
  });
  if (!rows[0]) throw new Error('Supabase did not return the saved blessing.');
  return mapBlessing(rows[0]);
}

export async function updateBlessingStatus(
  id: string,
  status: BlessingStatus
): Promise<Blessing | null> {
  const rows = await databaseRequest<DatabaseBlessing[]>(
    `blessings?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ status }),
    }
  );
  return rows[0] ? mapBlessing(rows[0]) : null;
}

export async function deleteBlessing(id: string): Promise<Blessing | null> {
  const rows = await databaseRequest<DatabaseBlessing[]>(
    `blessings?id=eq.${encodeURIComponent(id)}&select=id,guest_name,message,created_at,status`,
    {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    }
  );
  return rows[0] ? mapBlessing(rows[0]) : null;
}
