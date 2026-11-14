/**
 * Procedural Web Audio synthesizer for traditional temple ambiance
 * Plays a peaceful Sa-Pa-Sa Tanpura drone with gentle flute/nadaswaram notes.
 * 100% self-contained, zero external audio files.
 */

class TempleAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;

    // Tanpura Drone (Tonic C# / 138.59 Hz, Fifth G# / 207.65 Hz)
    this.startDrone();

    // Occasional gentle temple bell and swara note
    const notes = [277.18, 311.13, 349.23, 415.3, 466.16, 554.37]; // Kalyani / Mohanam scale in C#
    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const note = notes[Math.floor(Math.random() * notes.length)];
      this.playSwara(note);
    }, 4500);
  }

  private startDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Sa (C#3: 138.59 Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(138.59, this.ctx.currentTime);
    gain1.gain.setValueAtTime(0.04, this.ctx.currentTime);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start();

    // Pa (G#3: 207.65 Hz)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(207.65, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.03, this.ctx.currentTime);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start();

    // Higher Sa (C#4: 277.18 Hz)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(277.18, this.ctx.currentTime);
    gain3.gain.setValueAtTime(0.02, this.ctx.currentTime);
    osc3.connect(gain3);
    gain3.connect(this.masterGain);
    osc3.start();
  }

  private playSwara(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    // Soft subtle vibrato
    osc.frequency.setTargetAtTime(freq * 1.004, this.ctx.currentTime + 0.3, 0.4);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 3.5);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

export const templeAudio = new TempleAudioPlayer();
