// Web Audio API synthesizer for futuristic camera shutter, scanner chirps, and completion cues
class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Camera mechanical aperture shutter click
  public playShutter() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // High frequency mechanical click 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.06);

      // Secondary aperture bounce click
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.1);

      gain2.gain.setValueAtTime(0.08, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.11);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Radar / Scanner pulse chirp
  public playScanPing() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // Verification completed chord
  public playVerdictChime(status: 'verified' | 'uncertain' | 'suspicious' | 'ai_generated') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freqs = status === 'verified'
        ? [523.25, 659.25, 1046.5] // C Major chord (bright)
        : status === 'uncertain'
        ? [440.0, 554.37, 659.25] // Suspended
        : [392.0, 466.16, 587.33]; // Diminished/minor (alert)

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.06, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + idx * 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 0.5 + idx * 0.05);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundFx = new SoundEngine();
