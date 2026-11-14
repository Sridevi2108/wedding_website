import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  deleteBlessing,
  insertBlessing,
  listBlessings,
  updateBlessingStatus,
} from './api/_lib/blessings';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE;

app.use(express.json({ limit: '1mb' }));

function reportStorageError(res: Response, action: string, error: unknown) {
  console.error(`${action}:`, error);
  const message = error instanceof Error ? error.message : 'Unexpected Supabase error.';
  const isConfigurationError = message.startsWith('Blessings database is not configured');
  return res.status(isConfigurationError ? 503 : 502).json({
    success: false,
    error: isConfigurationError ? message : 'Blessings could not be loaded from Supabase. Check the server logs and database configuration.',
  });
}

// Rate limiting in memory (basic protection)
const ipSubmissionTimestamps = new Map<string, number>();

// --- Public API ---

// GET /api/blessings - approved blessings only for public viewing
app.get('/api/blessings', async (_req: Request, res: Response) => {
  try {
    const approved = await listBlessings('approved');
    return res.json({
      success: true,
      totalCount: approved.length,
      blessings: approved,
    });
  } catch (error) {
    return reportStorageError(res, 'Failed to read public blessings from Supabase', error);
  }
});

// POST /api/blessings - submit new blessing
app.post('/api/blessings', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const lastTime = ipSubmissionTimestamps.get(clientIp) || 0;

  // Rate limit: 1 blessing every 8 seconds per IP
  if (now - lastTime < 8000) {
    return res.status(429).json({
      success: false,
      error: 'Please wait a moment before sending another blessing.',
    });
  }

  const { guestName, message } = req.body;

  if (!guestName || typeof guestName !== 'string' || guestName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your name.',
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a heartfelt blessing message.',
    });
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 500) {
    return res.status(400).json({
      success: false,
      error: 'Blessing message is too long (maximum 500 characters).',
    });
  }

  if (guestName.trim().length > 80) {
    return res.status(400).json({
      success: false,
      error: 'Your name is too long (maximum 80 characters).',
    });
  }

  try {
    const blessing = await insertBlessing(guestName.trim(), trimmedMessage);
    ipSubmissionTimestamps.set(clientIp, now);
    return res.status(201).json({
      success: true,
      message: 'Your blessing has been posted and is now visible.',
      blessing,
    });
  } catch (error) {
    return reportStorageError(res, 'Failed to persist submitted blessing in Supabase', error);
  }
});

// --- Admin API ---

function verifyAdmin(req: Request, res: Response, next: () => void) {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({
      success: false,
      error: 'Admin access is not configured. Set ADMIN_PASSCODE in the environment.',
    });
  }
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || (req.query.token as string);

  if (token === ADMIN_PASSCODE) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized. Incorrect passcode.' });
}

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  if (!ADMIN_PASSCODE) {
    return res.status(503).json({
      success: false,
      error: 'Admin access is not configured. Set ADMIN_PASSCODE in the environment.',
    });
  }
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    return res.json({ success: true, token: ADMIN_PASSCODE });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin passcode.' });
});

// GET /api/admin/blessings
app.get('/api/admin/blessings', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const blessings = await listBlessings();
    return res.json({
      success: true,
      counts: {
        total: blessings.length,
        pending: blessings.filter((blessing) => blessing.status === 'pending').length,
        approved: blessings.filter((blessing) => blessing.status === 'approved').length,
        rejected: blessings.filter((blessing) => blessing.status === 'rejected').length,
      },
      blessings,
    });
  } catch (error) {
    return reportStorageError(res, 'Failed to read admin blessings from Supabase', error);
  }
});

// POST /api/admin/blessings/:id/approve
app.post('/api/admin/blessings/:id/approve', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await updateBlessingStatus(id, 'approved');
    if (!item) {
      return res.status(404).json({ success: false, error: 'Blessing not found.' });
    }
    return res.json({ success: true, message: 'Blessing approved and added to the 3D Tree.', blessing: item });
  } catch (error) {
    return reportStorageError(res, 'Failed to approve blessing in Supabase', error);
  }
});

// POST /api/admin/blessings/:id/reject
app.post('/api/admin/blessings/:id/reject', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const item = await updateBlessingStatus(id, 'rejected');
    if (!item) {
      return res.status(404).json({ success: false, error: 'Blessing not found.' });
    }
    return res.json({ success: true, message: 'Blessing rejected.', blessing: item });
  } catch (error) {
    return reportStorageError(res, 'Failed to reject blessing in Supabase', error);
  }
});

// DELETE /api/admin/blessings/:id
app.delete('/api/admin/blessings/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const removed = await deleteBlessing(id);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Blessing not found.' });
    }
    return res.json({ success: true, message: 'Blessing removed permanently.', removed });
  } catch (error) {
    return reportStorageError(res, 'Failed to delete blessing from Supabase', error);
  }
});

// GET /api/admin/blessings/export - CSV download
app.get('/api/admin/blessings/export', verifyAdmin, async (_req: Request, res: Response) => {
  try {
    const blessings = await listBlessings();
    const header = ['ID', 'Date', 'Guest Name', 'Status', 'Message'];
    const rows = blessings.map((blessing) => [
      blessing.id,
      new Date(blessing.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      `"${(blessing.guestName || '').replace(/"/g, '""')}"`,
      blessing.status,
      `"${(blessing.message || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="vignesh-pavithra-blessings.csv"');
    return res.send(csv);
  } catch (error) {
    return reportStorageError(res, 'Failed to export blessings from Supabase', error);
  }
});

// Vite or Static file serving
async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Wedding website server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
