import { randomUUID } from 'crypto';
import request from 'supertest';
import app, { startServer } from '../src/index';
import { ModuleProgress, SyncRecord } from '../src/models/index';

beforeAll(async () => {
  await startServer();
});

describe('Backend API', () => {
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
  });

  it('requires an authenticated account to sync and rejects participant IDs as tokens', async () => {
    const res = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', 'Bearer KIB-UNVERIFIED')
      .send({ records: [] });

    expect(res.status).toBe(401);
  });

  it('isolates sync ownership and acknowledges only saved events across retries and partial failures', async () => {
    const firstRegistration = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: `sync-${randomUUID()}@example.test`, password: 'LocalTestPass123!' });
    const secondRegistration = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: `sync-${randomUUID()}@example.test`, password: 'LocalTestPass123!' });

    const firstUserId = firstRegistration.body.user.id;
    const firstToken = firstRegistration.body.token;
    const secondToken = secondRegistration.body.token;
    const eventId = randomUUID();
    const validEvent = {
      clientEventId: eventId,
      ownerId: firstUserId,
      entityType: 'PROGRESS',
      entityData: { moduleId: 'm1', completedLessons: [0, 1], completed: false }
    };

    const onlineProgress = await request(app)
      .post('/api/v1/learning/progress')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({ moduleId: 'm1', lessonId: 'm1-l1', completed: true });
    expect(onlineProgress.status).toBe(200);

    const partial = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({
        records: [
          validEvent,
          {
            clientEventId: randomUUID(),
            ownerId: firstUserId,
            entityType: 'UNSUPPORTED',
            entityData: { moduleId: 'must-not-save' }
          }
        ]
      });

    expect(partial.status).toBe(200);
    expect(partial.body.processedIds).toEqual([eventId]);
    expect(partial.body.failedIds).toHaveLength(1);

    const retry = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${firstToken}`)
      .send({ records: [validEvent] });
    expect(retry.body.processedIds).toContain(eventId);
    expect(await SyncRecord.count({ where: { clientEventId: eventId } })).toBe(1);

    const crossAccountReplay = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${secondToken}`)
      .send({ records: [{ ...validEvent, ownerId: secondRegistration.body.user.id }] });
    expect(crossAccountReplay.status).toBe(200);
    expect(crossAccountReplay.body.processedIds).not.toContain(eventId);
    expect(crossAccountReplay.body.failedIds).toContain(eventId);

    const aliceProgress = await ModuleProgress.findOne({
      where: { userId: firstUserId, moduleId: 'm1' }
    });
    const bobProgress = await ModuleProgress.findOne({
      where: { userId: secondRegistration.body.user.id, moduleId: 'm1' }
    });
    expect(aliceProgress?.completedLessons).toBe(2);
    expect(bobProgress).toBeNull();
    expect(await ModuleProgress.count({
      where: { userId: firstUserId, moduleId: 'm1' }
    })).toBe(1);

    const learnerView = await request(app)
      .get('/api/v1/learning/progress')
      .set('Authorization', `Bearer ${firstToken}`);
    expect(learnerView.body.moduleProgress[0].completedLessons).toBe(2);
  });

  it('rejects a shared export key without an admin session', async () => {
    const exportKey = randomUUID();
    const env = jest.replaceProperty(process, 'env', { ...process.env, ADMIN_EXPORT_SECRET: exportKey });
    try {
      const res = await request(app)
        .get('/api/v1/admin/export')
        .set('Authorization', `Bearer ${exportKey}`);

      expect(res.status).toBe(401);
    } finally {
      env.restore();
    }
  });
});
