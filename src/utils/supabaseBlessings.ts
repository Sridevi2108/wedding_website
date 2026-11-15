export interface BlessingItem {
  id: string;
  guestName: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function fetchLiveBlessings(): Promise<BlessingItem[]> {
  try {
    const res = await fetch('/api/blessings', { cache: 'no-store' });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.blessings)) {
        return data.blessings.map((b: any) => ({
          id: String(b.id),
          guestName: String(b.guestName || b.guest_name || 'Well-wisher'),
          message: String(b.message || ''),
          createdAt: String(b.createdAt || b.created_at || new Date().toISOString()),
          status: (b.status as BlessingItem['status']) || 'approved',
        }));
      }
    }
  } catch (err) {
    console.warn('Live blessings fetch notice:', err);
  }
  return [];
}

export async function submitLiveBlessing(guestName: string, message: string): Promise<BlessingItem> {
  const localBlessing: BlessingItem = {
    id: generateUuid(),
    guestName,
    message,
    createdAt: new Date().toISOString(),
    status: 'approved',
  };

  try {
    const res = await fetch('/api/blessings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName, message }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && data.success && data.blessing) {
        return {
          id: String(data.blessing.id || localBlessing.id),
          guestName: String(data.blessing.guestName || data.blessing.guest_name || guestName),
          message: String(data.blessing.message || message),
          createdAt: String(data.blessing.createdAt || data.blessing.created_at || localBlessing.createdAt),
          status: (data.blessing.status as BlessingItem['status']) || 'approved',
        };
      }
    }
  } catch (err) {
    console.warn('Blessing server submit notice:', err);
  }

  return localBlessing;
}
