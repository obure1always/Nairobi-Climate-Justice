import dotenv from 'dotenv';

dotenv.config();

export interface TtsStatusResponse {
  available: boolean;
  provider: string;
  configuredVoice: string;
  instructions: string;
}

export function getTtsStatus(): TtsStatusResponse {
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '');
  const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== '');

  if (hasOpenAi) {
    return {
      available: true,
      provider: 'OpenAI Neural TTS (tts-1)',
      configuredVoice: process.env.OPENAI_TTS_VOICE || 'nova',
      instructions: 'Active and generating neural audio.'
    };
  }

  if (hasElevenLabs) {
    return {
      available: true,
      provider: 'ElevenLabs Neural Audio',
      configuredVoice: process.env.ELEVENLABS_VOICE_ID || 'Rachel',
      instructions: 'Active and generating neural audio.'
    };
  }

  return {
    available: false,
    provider: 'Local Enhanced Web Speech API (Client-side Zero Cost)',
    configuredVoice: 'Auto-detected natural/neural browser voice',
    instructions: 'To enable studio cloud voice, add OPENAI_API_KEY or ELEVENLABS_API_KEY to server/.env. Otherwise, the app uses modern high-definition client browser speech.'
  };
}

/**
 * Synthesizes text to speech using OpenAI API if credentials are provided.
 * Returns base64 encoded MP3 audio or null if not configured.
 */
export async function synthesizeCloudSpeech(
  text: string,
  lang: 'en' | 'sw'
): Promise<{ success: boolean; audioBase64?: string; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      error: 'Cloud TTS is not configured. Falling back to client-side natural speech synthesis.'
    };
  }

  try {
    const voice = process.env.OPENAI_TTS_VOICE || (lang === 'sw' ? 'alloy' : 'nova');
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text.slice(0, 1500),
        voice: voice,
        response_format: 'mp3',
        speed: 0.95
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return { success: false, error: `Cloud TTS provider responded with ${response.status}: ${errText}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const audioBase64 = buffer.toString('base64');

    return {
      success: true,
      audioBase64
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Cloud TTS generation failed: ${err.message || err}`
    };
  }
}
