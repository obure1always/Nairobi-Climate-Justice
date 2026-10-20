import request from 'supertest';
import app from '../src/index';
import { hasClimateIntent, checkRateLimit } from '../src/services/aiAssistant';

describe('AI Assistant Service & API', () => {
  it('should return assistant status with provider and model info', async () => {
    const res = await request(app).get('/api/v1/assistant/status');
    expect(res.status).toBe(200);
    expect(['groq', 'free-online']).toContain(res.body.provider);
    expect(typeof res.body.model).toBe('string');
    expect(res.body.freeTier).toBe(true);
    expect(typeof res.body.onlineAvailable).toBe('boolean');
  });

  it('should fallback to offline gracefully when FORCE_OFFLINE is set', async () => {
    process.env.FORCE_OFFLINE = 'true';

    const res = await request(app)
      .post('/api/v1/assistant/chat')
      .send({
        message: 'What is Article 42 of the Constitution?',
        language: 'en'
      });

    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('offline');
    expect(res.body.fallbackToOffline).toBe(true);
    expect(res.body.answer).toContain('offline');

    delete process.env.FORCE_OFFLINE;
  });

  it('should reject messages exceeding 1000 characters with an error', async () => {
    const longMessage = 'A'.repeat(1005);
    const res = await request(app)
      .post('/api/v1/assistant/chat')
      .send({
        message: longMessage,
        language: 'en'
      });

    expect(res.status).toBe(200);
    expect(res.body.fallbackToOffline).toBe(true);
    expect(res.body.error).toBe('Message too long');
  });

  it('should detect climate justice intent accurately in both English and Kiswahili', () => {
    expect(hasClimateIntent('Why does Kibera experience flash floods?')).toBe(true);
    expect(hasClimateIntent('Jinsi ya kupunguza joto ndani ya nyumba ya mabati?')).toBe(true);
    expect(hasClimateIntent('Maji safi na klorini')).toBe(true);
    expect(hasClimateIntent('What are youth rights under Article 42 of the Constitution?')).toBe(true);
    expect(hasClimateIntent('Haki ya tabianchi na ushiriki wa umma')).toBe(true);
    expect(hasClimateIntent('How can youth submit a memorandum to the County Assembly?')).toBe(true);
    expect(hasClimateIntent('Explain binary search trees.')).toBe(false);
  });

  it('should enforce rate limiting per client IP', () => {
    const testIp = '192.0.2.1';
    let allowed = true;
    for (let i = 0; i < 25; i++) {
      allowed = checkRateLimit(testIp);
    }
    expect(allowed).toBe(false);
  });
});
