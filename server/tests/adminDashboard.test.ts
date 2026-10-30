import request from 'supertest';
import app from '../src/index';
import { setupDb, User, UserSession, ModuleProgress, LessonProgress, Certificate } from '../src/models/index';
import { createSession } from '../src/services/authService';

describe('Admin Dashboard API Endpoints', () => {
  let adminToken: string;
  let learnerToken: string;
  let adminUser: User;
  let learnerUser: User;

  beforeAll(async () => {
    await setupDb();

    // Clean test tables
    await UserSession.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create Admin user
    adminUser = await User.create({
      email: 'admin.unit.test@climatejustice.ke',
      name: 'Admin Test Lead',
      role: 'admin',
      authProvider: 'email'
    });
    adminToken = await createSession(adminUser.id);

    // Create Learner user
    learnerUser = await User.create({
      email: 'learner.unit.test@climatejustice.ke',
      name: 'Learner Test Candidate',
      role: 'learner',
      authProvider: 'email'
    });
    learnerToken = await createSession(learnerUser.id);

    // Create sample lesson progress
    await LessonProgress.create({
      userId: learnerUser.id,
      moduleId: 'm1',
      lessonId: 'm1-l1',
      completed: true,
      playbackSeconds: 120
    });

    // Create sample certificate
    await Certificate.create({
      id: 'CJN-TEST-100',
      userId: learnerUser.id,
      learnerName: 'Learner Test Candidate',
      courseTitle: 'Climate Justice Fundamentals',
      pathwayId: 'pathway-fundamentals',
      verificationUrl: '/verify/CJN-TEST-100'
    });
  });

  afterAll(async () => {
    await UserSession.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('GET /api/v1/admin/dashboard', () => {
    it('rejects unauthenticated requests with 401 Unauthorized', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Unauthorized');
    });

    it('rejects learner accounts with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('Forbidden');
    });

    it('allows admin accounts to retrieve real dashboard data', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      if (res.status !== 200) {
        console.error('Admin dashboard failed with:', res.body);
      }
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify stats structure
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.totalUsers).toBeGreaterThanOrEqual(2);
      expect(res.body.stats.rolesCount.admin).toBeGreaterThanOrEqual(1);
      expect(res.body.stats.rolesCount.learner).toBeGreaterThanOrEqual(1);

      // Verify database metadata
      expect(res.body.database.dialect).toBe('sqlite');
      expect(res.body.database.storage).toBe('server/database.sqlite');
      expect(res.body.database.connected).toBe(true);

      // Verify real records are returned
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(Array.isArray(res.body.recentActivity)).toBe(true);
      expect(Array.isArray(res.body.lessonProgresses)).toBe(true);
      expect(Array.isArray(res.body.certificates)).toBe(true);

      // Verify sensitive security information is NEVER exposed
      const returnedUsers = res.body.users;
      for (const user of returnedUsers) {
        expect(user.passwordHash).toBeUndefined();
        expect(user.passwordSalt).toBeUndefined();
        expect(user.recoveryCodeHash).toBeUndefined();
        expect(user.recoveryCodeSalt).toBeUndefined();
      }
    });
  });

  describe('PATCH /api/v1/admin/users/:id/role', () => {
    it('allows admin to update user role', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${learnerUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'instructor' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.role).toBe('instructor');

      const updated = await User.findByPk(learnerUser.id);
      expect(updated?.role).toBe('instructor');
    });

    it('rejects invalid roles', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${learnerUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'super-hacker' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid role');
    });

    it('prevents self-demotion lockout for active admin', async () => {
      const res = await request(app)
        .patch(`/api/v1/admin/users/${adminUser.id}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'learner' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Cannot remove admin role');
    });
  });

  describe('GET /api/v1/admin/export with session token', () => {
    it('allows admin with session token to access research export', async () => {
      const res = await request(app)
        .get('/api/v1/admin/export')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.exportedAt).toBeDefined();
    });
  });
});
