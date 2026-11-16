/**
 * Unified Wedding Audio Manager
 * Plays user-selected traditional wedding music (/assets/audio/wedding_music.mp4).
 * Single shared instance for desktop and mobile navigation controls.
 */

class WeddingAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private hasSetupAutoPlay = false;

  private init() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio('/assets/audio/wedding_music.mp4');
      this.audio.loop = true;
      this.audio.volume = 0.55;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(): Promise<void> {
    this.init();
    if (!this.audio) return;
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.notify();
    } catch {
      // Browser blocked autoplay
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setupAutoPlay(): void {
    if (this.hasSetupAutoPlay || typeof window === 'undefined') return;
    this.hasSetupAutoPlay = true;
    this.init();

    const startAudio = () => {
      this.play().then(() => {
        cleanup();
      });
    };

    const cleanup = () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('scroll', startAudio);
      window.removeEventListener('touchstart', startAudio);
      window.removeEventListener('keydown', startAudio);
    };

    // 1. Try immediate autoplay
    this.play().catch(() => {
      // 2. Fallback to first user interaction
      window.addEventListener('click', startAudio, { once: true });
      window.addEventListener('scroll', startAudio, { once: true });
      window.addEventListener('touchstart', startAudio, { once: true });
      window.addEventListener('keydown', startAudio, { once: true });
    });
  }
}

export const weddingAudio = new WeddingAudioManager();
