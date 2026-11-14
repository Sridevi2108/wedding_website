import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

type LegacyBlessing = {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'rejected';
};

function stableUuid(sourceId: string): string {
  const bytes = createHash('sha256').update(`legacy-blessing:${sourceId}`).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isLegacyBlessing(value: unknown): value is LegacyBlessing {
  if (typeof value !== 'object' || value === null) return false;
  const blessing = value as Record<string, unknown>;
  return (
    typeof blessing.id === 'string' &&
    typeof blessing.guestName === 'string' &&
    typeof blessing.message === 'string' &&
    typeof blessing.createdAt === 'string' &&
    Number.isFinite(Date.parse(blessing.createdAt)) &&
    (blessing.status === 'approved' || blessing.status === 'pending' || blessing.status === 'rejected')
  );
}

async function main() {
  const projectUrl = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!projectUrl || !serviceKey) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the project-root .env file first.');
  }

  const source = await readFile(path.resolve('data', 'blessings.json'), 'utf8');
  const legacyData: unknown = JSON.parse(source);
  if (!Array.isArray(legacyData) || !legacyData.every(isLegacyBlessing)) {
    throw new Error('data/blessings.json has an unexpected format; no records were imported.');
  }

  const blessings = legacyData.map((blessing) => {
    if (!blessing.guestName.trim() || blessing.guestName.length > 80) {
      throw new Error(`Legacy blessing "${blessing.id}" has an invalid guest name.`);
    }
    if (!blessing.message.trim() || blessing.message.length > 500) {
      throw new Error(`Legacy blessing "${blessing.id}" has an invalid message.`);
    }
    return {
      id: stableUuid(blessing.id),
      guest_name: blessing.guestName,
      message: blessing.message,
      created_at: blessing.createdAt,
      status: blessing.status,
    };
  });

  if (blessings.length === 0) {
    console.log('No legacy blessings to import.');
    return;
  }

  const endpoint = new URL(`${projectUrl.replace(/\/+$/, '')}/rest/v1/blessings`);
  endpoint.searchParams.set('on_conflict', 'id');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify(blessings),
  });
  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase import failed (${response.status}): ${responseText || 'no error details returned'}`);
  }

  const inserted: unknown = responseText ? JSON.parse(responseText) : [];
  const importedCount = Array.isArray(inserted) ? inserted.length : 0;
  console.log(`Imported ${importedCount} of ${blessings.length} legacy blessings. Already-imported records were skipped.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Legacy blessing import failed.');
  process.exitCode = 1;
});
