import type { ServerResponse } from 'node:http';
import {
  getBody,
  insertBlessing,
  listBlessings,
  requireSupabaseConfig,
  sendJson,
  type ApiRequest,
} from './_lib/blessings';

const recentSubmissions = new Map<string, number>();

export default async function handler(request: ApiRequest, response: ServerResponse) {
  if (request.method === 'GET') {
    try {
      requireSupabaseConfig();
      const blessings = await listBlessings('approved');
      return sendJson(response, 200, { success: true, totalCount: blessings.length, blessings });
    } catch (error) {
      console.error('Unable to load public blessings:', error);
      return sendJson(response, 500, {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to load blessings.',
      });
    }
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { success: false, error: 'Method not allowed.' });
  }

  try {
    requireSupabaseConfig();
    const body = getBody(request);
    const guestName = typeof body.guestName === 'string' ? body.guestName.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!guestName || !message) {
      return sendJson(response, 400, {
        success: false,
        error: 'Both guest name and blessing message are required.',
      });
    }
    if (guestName.length > 80 || message.length > 500) {
      return sendJson(response, 400, {
        success: false,
        error: 'Name must be 80 characters or fewer and message must be 500 characters or fewer.',
      });
    }

    const forwardedFor = request.headers['x-forwarded-for'];
    const clientIp =
      (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : '') ||
      request.socket.remoteAddress ||
      'unknown';
    const now = Date.now();
    const previousSubmission = recentSubmissions.get(clientIp);
    if (previousSubmission && now - previousSubmission < 30_000) {
      return sendJson(response, 429, {
        success: false,
        error: 'Please wait a moment before submitting another blessing.',
      });
    }

    const blessing = await insertBlessing(guestName, message);
    recentSubmissions.set(clientIp, now);
    return sendJson(response, 201, {
      success: true,
      message: 'Your blessing has been posted and is now visible.',
      blessing,
    });
  } catch (error) {
    console.error('Unable to save submitted blessing:', error);
    return sendJson(response, 500, {
      success: false,
      error: error instanceof Error ? error.message : 'Your blessing could not be saved.',
    });
  }
}
