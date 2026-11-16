/**
 * Unified Wedding Audio Manager
 * Plays the supplied wedding track and resumes on the first user gesture if autoplay is blocked.
 */

class WeddingAudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isStarting = false;
  private isUserMuted = false;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private hasSetupAutoPlay = false;
  private playbackRequest = 0;

  private init(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audio) {
      let el = document.getElementById('wedding-bg-audio') as HTMLAudioElement | null;
      if (!el) {
        el = document.createElement('audio');
        el.id = 'wedding-bg-audio';
        el.src = '/assets/audio/wedding-music.mp3';
        el.autoplay = true;
        el.loop = true;
        el.preload = 'auto';
        el.setAttribute('playsinline', 'true');
        el.setAttribute('webkit-playsinline', 'true');
        el.volume = 0.55;
        document.body.appendChild(el);
      }
      this.audio = el;

      this.audio.addEventListener('play', () => {
        if (this.isUserMuted) {
          this.audio?.pause();
          return;
        }
        this.isStarting = false;
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isStarting = false;
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('error', () => {
        this.isStarting = false;
        this.isPlaying = false;
        this.notify();
        console.error('Wedding background music failed to load.', this.audio?.error);
      });
    }

    return this.audio;
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

  public async play(): Promise<boolean> {
    const el = this.init();
    if (!el) return false;
    this.isUserMuted = false;
    this.isStarting = true;
    const request = ++this.playbackRequest;
    try {
      await el.play();
      if (request !== this.playbackRequest || this.isUserMuted) {
        if (this.isUserMuted) el.pause();
        return false;
      }
      this.isStarting = false;
      this.isPlaying = true;
      this.notify();
      return true;
    } catch {
      if (request === this.playbackRequest) {
        this.isStarting = false;
        this.isPlaying = false;
        this.notify();
      }
      return false;
    }
  }

  public pause(): void {
    this.playbackRequest += 1;
    this.isUserMuted = true;
    this.isStarting = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(): boolean {
    const el = this.init();
    if (this.isPlaying || this.isStarting || (el !== null && !el.paused)) {
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
    const el = this.init();
    if (!el) return;

    const startOnInteraction = (event: Event) => {
      const target = event.target;
      if (
        this.isUserMuted ||
        this.isPlaying ||
        this.isStarting ||
        (target instanceof Element && target.closest('[data-audio-toggle]'))
      ) {
        return;
      }

      void this.play().then((started) => {
        if (started) cleanup();
      });
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', startOnInteraction, true);
      window.removeEventListener('keydown', startOnInteraction, true);
    };

    window.addEventListener('pointerdown', startOnInteraction, true);
    window.addEventListener('keydown', startOnInteraction, true);

    void this.play().then((started) => {
      if (started) cleanup();
    });
  }
}

export const weddingAudio = new WeddingAudioManager();
