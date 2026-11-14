import type { ServerResponse } from 'node:http';
import {
  deleteBlessing,
  getAdminPasscode,
  getBody,
  isSupabaseConfigurationError,
  isValidAdminToken,
  listBlessings,
  sendJson,
  updateBlessingStatus,
  type ApiRequest,
  type Blessing,
  type BlessingStatus,
} from '../_lib/blessings';

function toCsvValue(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function sendFailure(response: ServerResponse, error: unknown): void {
  console.error('Admin blessing API request failed:', error);
  sendJson(response, isSupabaseConfigurationError(error) ? 503 : 500, {
    success: false,
    error: error instanceof Error ? error.message : 'The admin request failed.',
  });
}

export default async function handler(request: ApiRequest, response: ServerResponse) {
  const url = new URL(request.url || '/', 'http://localhost');
  const route = url.pathname.replace(/^\/api\/admin\/?/, '').split('/').filter(Boolean);

  if (route[0] === 'login' && request.method === 'POST') {
    const passcode = getAdminPasscode();
    if (!passcode) {
      return sendJson(response, 503, {
        success: false,
        error: 'Admin access is not configured. Set ADMIN_PASSCODE in the deployment environment.',
      });
    }
    if (getBody(request).passcode !== passcode) {
      return sendJson(response, 401, { success: false, error: 'Incorrect passcode.' });
    }
    return sendJson(response, 200, { success: true, token: passcode });
  }

  const passcode = getAdminPasscode();
  if (!passcode) {
    return sendJson(response, 503, {
      success: false,
      error: 'Admin access is not configured. Set ADMIN_PASSCODE in the deployment environment.',
    });
  }
  if (!isValidAdminToken(request, passcode)) {
    return sendJson(response, 401, { success: false, error: 'Unauthorized.' });
  }

  try {
    if (route[0] !== 'blessings') {
      return sendJson(response, 404, { success: false, error: 'Admin endpoint not found.' });
    }
    if (route.length === 1 && request.method === 'GET') {
      const blessings = await listBlessings();
      return sendJson(response, 200, { success: true, blessings });
    }
    if (route[1] === 'export' && request.method === 'GET') {
      const blessings = await listBlessings();
      const header = ['ID', 'Date', 'Guest Name', 'Status', 'Message'];
      const rows = blessings.map((blessing: Blessing) => [
        blessing.id,
        new Date(blessing.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        blessing.guestName,
        blessing.status,
        blessing.message,
      ]);
      const csv = [header, ...rows]
        .map((row) => row.map((value) => toCsvValue(String(value))).join(','))
        .join('\r\n');
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/csv; charset=utf-8');
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="vignesh-pavithra-blessings.csv"'
      );
      return response.end(csv);
    }

    const id = route[1];
    if (!id || id === 'export') {
      return sendJson(response, 404, { success: false, error: 'Blessing not found.' });
    }
    if (route[2] === 'approve' || route[2] === 'reject') {
      if (request.method !== 'POST' || route.length !== 3) {
        response.setHeader('Allow', 'POST');
        return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
      }
      const status: BlessingStatus = route[2] === 'approve' ? 'approved' : 'rejected';
      const blessing = await updateBlessingStatus(id, status);
      if (!blessing) return sendJson(response, 404, { success: false, error: 'Blessing not found.' });
      return sendJson(response, 200, { success: true, blessing });
    }
    if (request.method === 'DELETE' && route.length === 2) {
      const blessing = await deleteBlessing(id);
      if (!blessing) return sendJson(response, 404, { success: false, error: 'Blessing not found.' });
      return sendJson(response, 200, {
        success: true,
        message: 'Blessing removed permanently.',
        removed: blessing,
      });
    }

    response.setHeader('Allow', 'GET, POST, DELETE');
    return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
  } catch (error) {
    sendFailure(response, error);
  }
}
