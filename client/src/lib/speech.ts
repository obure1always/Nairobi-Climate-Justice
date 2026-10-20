export interface SpeechVoiceMatch {
  voice: SpeechSynthesisVoice | null;
  exactMatch: boolean;
  notice: string | null;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!isSpeechSupported()) return Promise.resolve([]);

  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Voices load asynchronously in many browsers (e.g. Chrome)
    const handler = () => {
      voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(voices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);

    // Fallback timeout in case event doesn't fire
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices());
    }, 800);
  });
}

export function findBestVoiceForLanguage(
  lang: 'en' | 'sw',
  voices: SpeechSynthesisVoice[]
): SpeechVoiceMatch {
  if (voices.length === 0) {
    return {
      voice: null,
      exactMatch: false,
      notice: lang === 'sw'
        ? 'Sauti za kifaa hazijapatikana bado au kifaa chako hakiauni sauti za Kiswahili. Unaweza kusoma maandishi kamili hapa chini.'
        : 'No device voices found yet. Full text transcript is available below.'
    };
  }

  if (lang === 'sw') {
    // 1. Look for native Swahili voices (sw-KE, sw, sw-TZ)
    const swVoice = voices.find(v => v.lang.toLowerCase().startsWith('sw'));
    if (swVoice) {
      return {
        voice: swVoice,
        exactMatch: true,
        notice: null
      };
    }

    // 2. Look for Kenyan English voice (articulates East African phonetics naturally)
    const enKe = voices.find(v => v.lang.toLowerCase() === 'en-ke');
    if (enKe) {
      return {
        voice: enKe,
        exactMatch: false,
        notice: 'Inasoma kwa sauti ya Kenya (en-KE).'
      };
    }

    // 3. Fallback to default system voice so audio is always spoken
    return {
      voice: voices[0] || null,
      exactMatch: false,
      notice: 'Inatumia sauti ya mfumo (Sauti maalum ya Kiswahili inaweza kusakinishwa kwenye Device Settings > Text-to-Speech).'
    };
  }

  // English: prefer local/en-KE, then en-GB, en-US
  const enKe = voices.find(v => v.lang.toLowerCase() === 'en-ke');
  if (enKe) {
    return { voice: enKe, exactMatch: true, notice: null };
  }

  const enAny = voices.find(v => v.lang.toLowerCase().startsWith('en') && v.localService) ||
                 voices.find(v => v.lang.toLowerCase().startsWith('en'));
  if (enAny) {
    return { voice: enAny, exactMatch: true, notice: null };
  }

  return {
    voice: voices[0] || null,
    exactMatch: false,
    notice: 'Using default system voice.'
  };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function getActiveUtterance(): SpeechSynthesisUtterance | null {
  return activeUtterance;
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
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

export function speakText(
  text: string,
  lang: 'en' | 'sw',
  rate: number = 1.0,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
    onVoiceNotice?: (notice: string | null) => void;
  }
): void {
  if (!isSpeechSupported()) {
    callbacks?.onError?.('Speech synthesis is not supported on this browser.');
    return;
  }

  stopSpeech();

  // Resume synthesis engine in case the browser suspended it
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  getAvailableVoices().then((voices) => {
    const match = findBestVoiceForLanguage(lang, voices);
    if (match.notice) {
      callbacks?.onVoiceNotice?.(match.notice);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (match.voice) {
      utterance.voice = match.voice;
      utterance.lang = match.voice.lang;
    } else {
      utterance.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
    }

    utterance.rate = Math.max(0.7, Math.min(1.5, rate));
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      callbacks?.onError?.(e);
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}
