/**
 * Global Audio Coordinator for Climate Justice Nairobi
 * 
 * Ensures that only one audio source (Web Speech synthesis, HTML5 audio,
 * or video playback) plays at any given time, preventing overlapping voices
 * and audio collisions across components.
 */

type AudioSourceType = 'speech' | 'cloud-tts' | 'video' | 'media';

interface ActiveAudioState {
  sourceId: string | null;
  sourceType: AudioSourceType | null;
  isPlaying: boolean;
}

type AudioStateListener = (state: ActiveAudioState) => void;

class AudioCoordinator {
  private activeSourceId: string | null = null;
  private activeSourceType: AudioSourceType | null = null;
  private activeAudioElement: HTMLAudioElement | null = null;
  private listeners: Set<AudioStateListener> = new Set();

  /**
   * Register a listener for audio state transitions.
   */
  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get the current global audio state.
   */
  public getState(): ActiveAudioState {
    return {
      sourceId: this.activeSourceId,
      sourceType: this.activeSourceType,
      isPlaying: Boolean(this.activeSourceId)
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('AudioCoordinator listener error:', err);
      }
    });
  }

  /**
   * Signals that an audio playback is starting. Halts any existing
   * speech synthesis or HTML audio element immediately.
   */
  public requestPlayback(sourceId: string, sourceType: AudioSourceType): boolean {
    // If another source is active, halt it first
    if (this.activeSourceId && this.activeSourceId !== sourceId) {
      this.stopAll();
    }

    this.activeSourceId = sourceId;
    this.activeSourceType = sourceType;
    this.notify();
    return true;
  }

  /**
   * Attach an HTMLAudioElement currently playing so it can be automatically stopped
   * if another audio source preempts it.
   */
  public registerAudioElement(audio: HTMLAudioElement): void {
    this.activeAudioElement = audio;
  }

  /**
   * Signals that playback for a specific source has completed or stopped.
   */
  public releasePlayback(sourceId: string): void {
    if (this.activeSourceId === sourceId) {
      if (this.activeAudioElement) {
        try {
          this.activeAudioElement.pause();
          this.activeAudioElement.currentTime = 0;
        } catch {
          // Ignore
        }
        this.activeAudioElement = null;
      }

      this.activeSourceId = null;
      this.activeSourceType = null;
      this.notify();
    }
  }

  /**
   * Immediately stops all active speech synthesis and HTML5 audio elements.
   */
  public stopAll(): void {
    // 1. Cancel browser Web Speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }

    // 2. Stop HTML audio element if playing
    if (this.activeAudioElement) {
      try {
        this.activeAudioElement.pause();
        this.activeAudioElement.currentTime = 0;
      } catch {
        // Ignore
      }
      this.activeAudioElement = null;
    }

    this.activeSourceId = null;
    this.activeSourceType = null;
    this.notify();
  }

  /**
   * Check if a specific source is currently playing.
   */
  public isPlayingSource(sourceId: string): boolean {
    return this.activeSourceId === sourceId;
  }
}

export const audioCoordinator = new AudioCoordinator();
