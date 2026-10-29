import { describe, it, expect, beforeEach } from 'vitest';
import { audioCoordinator } from './audioCoordinator';
import { humanizeSpeechText, splitIntoSpeechChunks, getRankedVoices } from './speech';

describe('Speech & Audio Engine Improvements', () => {
  beforeEach(() => {
    audioCoordinator.stopAll();
  });

  describe('AudioCoordinator (Anti-Overlap Guarantee)', () => {
    it('should manage exclusive playback and preempt prior sources', () => {
      let stateLog: any[] = [];
      const unsub = audioCoordinator.subscribe((state) => stateLog.push({ ...state }));

      audioCoordinator.requestPlayback('buddy-msg-1', 'speech');
      expect(audioCoordinator.isPlayingSource('buddy-msg-1')).toBe(true);

      // Preempt with video
      audioCoordinator.requestPlayback('video-123', 'video');
      expect(audioCoordinator.isPlayingSource('buddy-msg-1')).toBe(false);
      expect(audioCoordinator.isPlayingSource('video-123')).toBe(true);

      audioCoordinator.releasePlayback('video-123');
      expect(audioCoordinator.getState().isPlaying).toBe(false);

      unsub();
    });
  });

  describe('humanizeSpeechText (Acronym Expansion & Clean Diction)', () => {
    it('should expand climate acronyms for natural phonetic articulation', () => {
      const input = 'We must follow UNFCCC guidelines and NEMA requirements for the CIDP.';
      const output = humanizeSpeechText(input, 'en');

      expect(output).toContain('U-N-F-C-C-C');
      expect(output).toContain('Nema');
      expect(output).toContain('C-I-D-P');
    });

    it('should expand CO2 to carbon dioxide in English and hewa ya ukaa in Swahili', () => {
      expect(humanizeSpeechText('Reduces CO2 levels', 'en')).toContain('carbon dioxide');
      expect(humanizeSpeechText('Hupunguza CO2 hewani', 'sw')).toContain('hewa ya ukaa');
    });

    it('should strip markdown formatting characters', () => {
      const input = 'Here is **bold** and *italic* text with `code` and [link](http://example.com)';
      const output = humanizeSpeechText(input, 'en');
      expect(output).not.toContain('**');
      expect(output).not.toContain('`');
      expect(output).not.toContain('http://example.com');
      expect(output).toContain('bold');
    });
  });

  describe('splitIntoSpeechChunks (15-Second Chromium Freeze Fix)', () => {
    it('should split multi-sentence text into clean chunked utterances', () => {
      const text = 'First sentence is clear. Second sentence explains adaptation! Third asks a question?';
      const chunks = splitIntoSpeechChunks(text);

      expect(chunks.length).toBeGreaterThanOrEqual(1);
      chunks.forEach((chunk) => {
        expect(chunk.length).toBeLessThan(200);
      });
    });
  });

  describe('Voice Ranking and Natural Scoring', () => {
    it('should rank Natural/Neural voices above legacy robotic voices', () => {
      const mockVoices = [
        { name: 'Alex', lang: 'en-US', localService: true, default: false, voiceURI: 'alex' } as SpeechSynthesisVoice,
        { name: 'Fred', lang: 'en-US', localService: true, default: false, voiceURI: 'fred' } as SpeechSynthesisVoice,
        { name: 'Google US English (Natural)', lang: 'en-US', localService: false, default: false, voiceURI: 'google-natural' } as SpeechSynthesisVoice,
        { name: 'Samantha (Enhanced)', lang: 'en-US', localService: false, default: false, voiceURI: 'samantha-enhanced' } as SpeechSynthesisVoice,
      ];

      const ranked = getRankedVoices('en', mockVoices);
      expect(ranked.length).toBeGreaterThanOrEqual(2);
      expect(ranked[0].voice.name).toMatch(/Natural|Enhanced/i);
      expect(ranked[0].isNatural).toBe(true);
    });
  });
});
