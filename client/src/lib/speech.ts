import { audioCoordinator } from './audioCoordinator';

export interface SpeechVoiceMatch {
  voice: SpeechSynthesisVoice | null;
  exactMatch: boolean;
  isNeuralOrNatural: boolean;
  notice: string | null;
}

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  isNatural: boolean;
  displayName: string;
}

const STORAGE_KEY_VOICE = 'climate_buddy_preferred_voice';
const STORAGE_KEY_RATE = 'climate_buddy_speech_rate';

// Keywords that indicate modern, lifelike, neural/natural voices
const NATURAL_VOICE_KEYWORDS = [
  'natural',
  'neural',
  'premium',
  'enhanced',
  'studio',
  'online',
  'google',
  'siri',
  'samantha (enhanced)',
  'karen (enhanced)',
  'daniel (enhanced)',
  'ava',
  'jenny',
  'guy',
  'aria'
];

// Robotic, legacy voices to heavily deprioritize
const ROBOTIC_LEGACY_VOICES = [
  'alex',
  'fred',
  'victoria',
  'zarvox',
  'trinoids',
  'deranged',
  'cellos',
  'bad news',
  'whisper',
  'albert',
  'junior',
  'ralph',
  'kathy',
  'agnes',
  'bruce',
  'espeak'
];

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Loads available browser voices, handling asynchronous loading across Chrome, Safari, Edge and Firefox.
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSupported()) return Promise.resolve([]);

  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const handler = () => {
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Fallback timeout in case voiceschanged event doesn't fire
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 700);
  });
}

/**
 * Clean text and humanize climate acronyms and terminology for natural spoken diction.
 * Removes markdown formatting, table syntax, links, and code markers so voice synthesis
 * sounds natural and does not announce formatting symbols.
 */
export function humanizeSpeechText(rawText: string, lang: 'en' | 'sw'): string {
  let text = rawText
    // Remove markdown code blocks and inline code
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    // Convert links [Label](url) to just Label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove standalone URLs
    .replace(/https?:\/\/\S+/g, ' ')
    // Clean table rows: convert pipes to natural pauses
    .replace(/^\s*\|[-:\s|]+\|\s*$/gm, ' ') // divider rows like |---|---|
    .replace(/\|/g, ', ') // convert column separators to comma pauses
    // Remove heading markers
    .replace(/^#+\s+/gm, '')
    // Remove blockquote markers
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove bold/italic and other markdown characters
    .replace(/[*_#~[\]()]/g, ' ')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Acronym humanization for natural pronunciation
  const replacements: Record<string, string> = {
    'UNFCCC': 'U-N-F-C-C-C',
    'NEMA': 'Nema',
    'CIDP': 'C-I-D-P',
    'ADP': 'A-D-P',
    'CBO': 'C-B-O',
    'CBOs': 'C-B-Os',
    'MCA': 'M-C-A',
    'MCAs': 'M-C-As',
    'Go-Bag': 'Go Bag',
    'UHI': 'Urban Heat Island',
    'CO2': lang === 'sw' ? 'hewa ya ukaa' : 'carbon dioxide',
    'WRUA': 'W-R-U-A'
  };

  for (const [key, val] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    text = text.replace(regex, val);
  }

  return text;
}

export const cleanTextForSpeech = humanizeSpeechText;

/**
 * Split text into distinct sentences or manageable clauses to prevent
 * the Chromium 15-second speech synthesis cutoff bug.
 */
export function splitIntoSpeechChunks(text: string): string[] {
  const rawChunks = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
  const result: string[] = [];
  let current = '';

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    if ((current + ' ' + trimmed).length < 180) {
      current = current ? `${current} ${trimmed}` : trimmed;
    } else {
      if (current) result.push(current);
      current = trimmed;
    }
  }

  if (current) result.push(current);
  return result.length > 0 ? result : [text];
}

/**
 * Calculates a naturalness quality score for a voice based on language and naming traits.
 */
function scoreVoice(voice: SpeechSynthesisVoice, lang: 'en' | 'sw'): number {
  let score = 0;
  const nameLower = voice.name.toLowerCase();
  const langLower = voice.lang.toLowerCase();

  // Heavily penalize obsolete robotic voices
  for (const robotic of ROBOTIC_LEGACY_VOICES) {
    if (nameLower.includes(robotic)) {
      return -100;
    }
  }

  // Language match scoring
  if (lang === 'sw') {
    if (langLower.startsWith('sw')) {
      score += 150;
    } else if (langLower === 'en-ke' || nameLower.includes('kenya')) {
      score += 60;
    } else if (langLower.startsWith('en')) {
      score += 20;
    }
  } else {
    // English
    if (langLower === 'en-ke' || nameLower.includes('kenya')) {
      score += 70;
    } else if (langLower.startsWith('en')) {
      score += 40;
    }
  }

  // Natural / Neural keyword bonus
  for (const keyword of NATURAL_VOICE_KEYWORDS) {
    if (nameLower.includes(keyword)) {
      score += 80;
      break;
    }
  }

  // Web / remote high-def voices are typically much higher quality than 1990s local synthetics
  if (!voice.localService) {
    score += 40;
  }

  // Default system voice gets modest bump if no other preference exists
  if (voice.default) {
    score += 10;
  }

  return score;
}

/**
 * Retrieves voices formatted and sorted from highest naturalness to lowest.
 */
export function getRankedVoices(lang: 'en' | 'sw', voices: SpeechSynthesisVoice[]): VoiceOption[] {
  return voices
    .map((voice) => {
      const score = scoreVoice(voice, lang);
      const isNatural = NATURAL_VOICE_KEYWORDS.some(k => voice.name.toLowerCase().includes(k)) || !voice.localService;
      let displayName = voice.name;
      
      // Clean up overly long technical identifiers
      displayName = displayName.replace(/\s*\(.*?\)\s*/g, ' ').trim();
      if (isNatural && !displayName.toLowerCase().includes('natural') && !displayName.toLowerCase().includes('neural')) {
        displayName += ' (Natural)';
      }

      return {
        voice,
        score,
        isNatural,
        displayName: `${displayName} (${voice.lang})`
      };
    })
    .filter(item => item.score > -50)
    .sort((a, b) => b.score - a.score)
    .map(({ voice, isNatural, displayName }) => ({ voice, isNatural, displayName }));
}

/**
 * Finds the highest quality, most natural voice available for the selected language.
 */
export function findBestVoiceForLanguage(
  lang: 'en' | 'sw',
  voices: SpeechSynthesisVoice[]
): SpeechVoiceMatch {
  if (voices.length === 0) {
    return {
      voice: null,
      exactMatch: false,
      isNeuralOrNatural: false,
      notice: lang === 'sw'
        ? 'Sauti za kifaa hazijapatikana bado. Unaweza kusoma maandishi kamili hapa chini.'
        : 'No device voices detected yet. Text display is active.'
    };
  }

  // 1. Check user-selected preferred voice
  const preferredURI = getPreferredVoiceURI();
  if (preferredURI) {
    const userVoice = voices.find(v => v.voiceURI === preferredURI);
    if (userVoice) {
      const isNatural = NATURAL_VOICE_KEYWORDS.some(k => userVoice.name.toLowerCase().includes(k)) || !userVoice.localService;
      return {
        voice: userVoice,
        exactMatch: true,
        isNeuralOrNatural: isNatural,
        notice: null
      };
    }
  }

  // 2. Rank voices by quality score
  const ranked = getRankedVoices(lang, voices);
  if (ranked.length > 0) {
    const best = ranked[0];
    const isSwahiliMatch = lang === 'sw' && best.voice.lang.toLowerCase().startsWith('sw');
    
    let notice: string | null = null;
    if (lang === 'sw' && !isSwahiliMatch) {
      notice = best.voice.lang.toLowerCase().startsWith('en')
        ? 'Inatumia sauti ya Kiswahili/Afrika Mashariki kwa uwazi zaidi.'
        : 'Sauti asili ya Kiswahili inaweza kuwezeshwa kwenye Settings > Text-to-Speech.';
    }

    return {
      voice: best.voice,
      exactMatch: lang === 'sw' ? isSwahiliMatch : best.voice.lang.toLowerCase().startsWith('en'),
      isNeuralOrNatural: best.isNatural,
      notice
    };
  }

  // Fallback to first available voice
  return {
    voice: voices[0] || null,
    exactMatch: false,
    isNeuralOrNatural: false,
    notice: 'Using standard system voice.'
  };
}

export function getPreferredVoiceURI(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_VOICE);
}

export function setPreferredVoiceURI(uri: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_VOICE, uri);
  }
}

export function getSpeechRate(): number {
  if (typeof window === 'undefined') return 0.93;
  const saved = localStorage.getItem(STORAGE_KEY_RATE);
  if (saved) {
    const parsed = parseFloat(saved);
    if (!isNaN(parsed) && parsed >= 0.7 && parsed <= 1.5) {
      return parsed;
    }
  }
  // 0.93 gives human-paced clarity rather than rushed synthetic delivery
  return 0.93;
}

export function setSpeechRate(rate: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_RATE, rate.toString());
  }
}

export function stopSpeech(): void {
  audioCoordinator.stopAll();
}

export function pauseSpeech(): void {
  if (isSpeechSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if (isSpeechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

interface SpeakCallbacks {
  sourceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onVoiceNotice?: (notice: string | null) => void;
}

/**
 * Speaks text using natural voice selection, sentence chunking,
 * and unified audio coordination to prevent overlapping playback.
 */
export function speakText(
  text: string,
  lang: 'en' | 'sw',
  customRate?: number,
  callbacks?: SpeakCallbacks
): void {
  if (!isSpeechSupported()) {
    callbacks?.onError?.('Speech synthesis is not supported in this browser.');
    return;
  }

  const sourceId = callbacks?.sourceId || `speech-${Date.now()}`;

  // Request exclusive audio playback from coordinator
  audioCoordinator.requestPlayback(sourceId, 'speech');

  // Resume synthesis engine in case the browser suspended it
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const effectiveRate = customRate ?? getSpeechRate();
  const humanized = humanizeSpeechText(text, lang);
  const chunks = splitIntoSpeechChunks(humanized);

  getAvailableVoices().then((voices) => {
    const match = findBestVoiceForLanguage(lang, voices);
    if (match.notice) {
      callbacks?.onVoiceNotice?.(match.notice);
    }

    let chunkIndex = 0;

    const playNextChunk = () => {
      // Check if another audio source preempted us
      if (!audioCoordinator.isPlayingSource(sourceId)) {
        return;
      }

      if (chunkIndex >= chunks.length) {
        audioCoordinator.releasePlayback(sourceId);
        callbacks?.onEnd?.();
        return;
      }

      const chunkText = chunks[chunkIndex];
      chunkIndex++;

      const utterance = new SpeechSynthesisUtterance(chunkText);
      if (match.voice) {
        utterance.voice = match.voice;
        utterance.lang = match.voice.lang;
      } else {
        utterance.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
      }

      utterance.rate = Math.max(0.75, Math.min(1.4, effectiveRate));
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (chunkIndex === 1) {
          callbacks?.onStart?.();
        }
      };

      utterance.onend = () => {
        playNextChunk();
      };

      utterance.onerror = (e) => {
        audioCoordinator.releasePlayback(sourceId);
        callbacks?.onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextChunk();
  });
}
