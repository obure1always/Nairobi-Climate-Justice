import request from 'supertest';
import app, { startServer } from '../src/index';

beforeAll(async () => {
  // Ensure DB is setup before tests
  await startServer();
});

describe('Backend API', () => {
  let participantId: string;

  it('should register a new participant', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ageGroup: '18-24',
        location: 'Nairobi',
        educationStatus: 'University',
        gender: 'Female'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('participantId');
    participantId = res.body.participantId;
  });

  it('should sync offline records', async () => {
    const res = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${participantId}`)
      .send({
        records: [
          {
            clientEventId: 'test-event-1',
            entityType: 'PROGRESS',
            entityData: { moduleId: '1', completedLessons: [0, 1], completed: true }
          },
          {
            clientEventId: 'test-event-2',
            entityType: 'ASSESSMENT',
            entityData: { questionId: 'q1', answer: '4' }
          }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.processedIds).toContain('test-event-1');
    expect(res.body.processedIds).toContain('test-event-2');
  });

  it('should export data for admins', async () => {
    const res = await request(app)
      .get('/api/v1/admin/export')
      .set('Authorization', 'Bearer ADMIN-TEST');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.participants)).toBe(true);
    expect(Array.isArray(res.body.progress)).toBe(true);
    expect(Array.isArray(res.body.assessments)).toBe(true);
  });
});
