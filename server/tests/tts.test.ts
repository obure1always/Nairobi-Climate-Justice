import request from 'supertest';
import app, { startServer } from '../src/index';
import { getTtsStatus, synthesizeCloudSpeech } from '../src/services/ttsService';

beforeAll(async () => {
  await startServer();
});

describe('Text-to-Speech (TTS) Service & Status API', () => {
  it('should return TTS configuration status', async () => {
    const res = await request(app).get('/api/v1/assistant/tts/status');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('available');
    expect(res.body).toHaveProperty('provider');
    expect(res.body).toHaveProperty('configuredVoice');
    expect(res.body).toHaveProperty('instructions');
  });

  it('getTtsStatus should report available=false gracefully when no cloud key is provided', () => {
    const originalOpenAi = process.env.OPENAI_API_KEY;
    const originalEleven = process.env.ELEVENLABS_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.ELEVENLABS_API_KEY;

    const status = getTtsStatus();
    expect(status.available).toBe(false);
    expect(status.provider).toContain('Web Speech API');

    process.env.OPENAI_API_KEY = originalOpenAi;
    process.env.ELEVENLABS_API_KEY = originalEleven;
  });

  it('should reject TTS generation if text is missing', async () => {
    const res = await request(app)
      .post('/api/v1/assistant/tts')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing text');
  });

  it('synthesizeCloudSpeech should handle missing key gracefully', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const res = await synthesizeCloudSpeech('Habari za Nairobi', 'sw');
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();

    process.env.OPENAI_API_KEY = originalKey;
  });
});
