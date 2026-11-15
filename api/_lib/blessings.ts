import { env } from 'node:process';
import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Automatically load environment variables from multiple possible files
dotenv.config();
dotenv.config({ path: '.env.txt' });
dotenv.config({ path: '.env.local' });

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
    try {
      const body: unknown = JSON.parse(request.body);
      if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
        return body as Record<string, unknown>;
      }
    } catch {
      // Ignore JSON parse failure
    }
  }
  return {};
}

export function getAdminPasscode(): string | undefined {
  return env.ADMIN_PASSCODE || process.env.ADMIN_PASSCODE || 'royal_wedding_2026';
}

export function isValidAdminToken(request: ApiRequest, passcode: string): boolean {
  const authorization = request.headers.authorization;
  const headerToken =
    typeof authorization === 'string' && authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : '';
  const url = new URL(request.url || '/', 'http://localhost');
  const token = headerToken || url.searchParams.get('token') || '';
  return Boolean(passcode && token === passcode);
}

// --- Local File Storage Fallback ---
const LOCAL_JSON_PATH = path.resolve(process.cwd(), 'data', 'blessings.json');

function readLocalBlessings(): Blessing[] {
  try {
    if (fs.existsSync(LOCAL_JSON_PATH)) {
      const raw = fs.readFileSync(LOCAL_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Unable to read data/blessings.json:', err);
  }
  return [];
}

function writeLocalBlessings(blessings: Blessing[]): void {
  try {
    const dir = path.dirname(LOCAL_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_JSON_PATH, JSON.stringify(blessings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Unable to write data/blessings.json:', err);
  }
}

// --- Supabase Config & Integration ---
export function hasSupabaseConfig(): boolean {
  const url = env.SUPABASE_URL || process.env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key);
}

export function requireSupabaseConfig(): { url: string; key: string } {
  const url = env.SUPABASE_URL || process.env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
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
      // Keep response text
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
  if (hasSupabaseConfig()) {
    try {
      const query = new URLSearchParams({
        select: 'id,guest_name,message,created_at,status',
        order: 'created_at.desc',
      });
      if (status) query.set('status', `eq.${status}`);
      const rows = await databaseRequest<DatabaseBlessing[]>(`blessings?${query.toString()}`);
      return rows.map(mapBlessing);
    } catch (error) {
      console.warn('Supabase listBlessings failed, falling back to local file storage:', error);
    }
  }
  const local = readLocalBlessings();
  return status ? local.filter((b) => b.status === status) : local;
}

export async function insertBlessing(guestName: string, message: string): Promise<Blessing> {
  const newBlessing: Blessing = {
    id: `blessing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    guestName,
    message,
    createdAt: new Date().toISOString(),
    status: 'approved',
  };

  if (hasSupabaseConfig()) {
    try {
      const rows = await databaseRequest<DatabaseBlessing[]>('blessings', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ guest_name: guestName, message, status: 'approved' }),
      });
      if (rows && rows[0]) {
        const saved = mapBlessing(rows[0]);
        // Also sync into local storage backup
        const local = readLocalBlessings();
        local.unshift(saved);
        writeLocalBlessings(local);
        return saved;
      }
    } catch (error) {
      console.warn('Supabase insertBlessing failed, falling back to local file storage:', error);
    }
  }

  // Fallback to local JSON storage
  const local = readLocalBlessings();
  local.unshift(newBlessing);
  writeLocalBlessings(local);
  return newBlessing;
}

export async function updateBlessingStatus(
  id: string,
  status: BlessingStatus
): Promise<Blessing | null> {
  if (hasSupabaseConfig()) {
    try {
      const rows = await databaseRequest<DatabaseBlessing[]>(
        `blessings?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ status }),
        }
      );
      if (rows && rows[0]) {
        const updated = mapBlessing(rows[0]);
        const local = readLocalBlessings();
        const idx = local.findIndex((b) => b.id === id);
        if (idx !== -1) {
          local[idx].status = status;
          writeLocalBlessings(local);
        }
        return updated;
      }
    } catch (error) {
      console.warn('Supabase updateBlessingStatus failed, falling back to local file storage:', error);
    }
  }

  const local = readLocalBlessings();
  const idx = local.findIndex((b) => b.id === id);
  if (idx !== -1) {
    local[idx].status = status;
    writeLocalBlessings(local);
    return local[idx];
  }
  return null;
}

export async function deleteBlessing(id: string): Promise<Blessing | null> {
  if (hasSupabaseConfig()) {
    try {
      const rows = await databaseRequest<DatabaseBlessing[]>(
        `blessings?id=eq.${encodeURIComponent(id)}&select=id,guest_name,message,created_at,status`,
        {
          method: 'DELETE',
          headers: { Prefer: 'return=representation' },
        }
      );
      if (rows && rows[0]) {
        const removed = mapBlessing(rows[0]);
        const local = readLocalBlessings().filter((b) => b.id !== id);
        writeLocalBlessings(local);
        return removed;
      }
    } catch (error) {
      console.warn('Supabase deleteBlessing failed, falling back to local file storage:', error);
    }
  }

  const local = readLocalBlessings();
  const idx = local.findIndex((b) => b.id === id);
  if (idx !== -1) {
    const removed = local.splice(idx, 1)[0];
    writeLocalBlessings(local);
    return removed;
  }
  return null;
}
