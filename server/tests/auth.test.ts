import request from 'supertest';
import app, { startServer } from '../src/index';
import * as authService from '../src/services/authService';

beforeAll(async () => {
  await startServer();
});

describe('Authentication & User Management Suite', () => {
  const testUser = {
    email: 'learner.test@nairobi.org',
    password: 'SecurePassword123!',
    displayName: 'Amina Kibera'
  };

  let sessionToken: string;
  let recoveryCode: string;

  it('should register a new learner account and return a one-time recovery code', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.user.displayName).toBe(testUser.displayName);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('recoveryCode');
    expect(typeof res.body.recoveryCode).toBe('string');
    expect(res.body.recoveryCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);

    sessionToken = res.body.token;
    recoveryCode = res.body.recoveryCode;
  });

  it('should reject duplicate email registration with a 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already exists');
  });

  it('should reject registration with a weak/short password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'short@nairobi.org',
        password: '123'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('at least 8 characters');
  });

  it('should get authenticated profile with session token on GET /api/v1/auth/me', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${sessionToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.user.role).toBe('learner');
  });

  it('should reject unauthenticated access on GET /api/v1/auth/me', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me');

    expect(res.status).toBe(401);
  });

  it('should successfully log in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
  });

  it('should reject login with wrong password using generic error message', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'IncorrectPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should transfer guest progress into the authenticated account', async () => {
    const guestProgress = [
      {
        moduleId: 'm1',
        completedLessons: [0, 1, 2],
        completed: false,
        score: 85
      },
      {
        moduleId: 'm2',
        completedLessons: [0],
        completed: false,
        score: 100
      }
    ];

    const res = await request(app)
      .post('/api/v1/auth/transfer-guest-progress')
      .set('Authorization', `Bearer ${sessionToken}`)
      .send({ progressList: guestProgress });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.importedCount).toBe(2);
  });

  it('should reset password using the one-time recovery code and issue a new recovery code', async () => {
    const newPassword = 'BrandNewPassword2026!';
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: testUser.email,
        recoveryCode: recoveryCode,
        newPassword: newPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('newRecoveryCode');
    expect(res.body.newRecoveryCode).not.toBe(recoveryCode);

    // Old recovery code must now be invalid
    const invalidRes = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        email: testUser.email,
        recoveryCode: recoveryCode,
        newPassword: 'AnotherPassword!'
      });
    expect(invalidRes.status).toBe(400);

    // Must be able to log in with new password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: newPassword
      });
    expect(loginRes.status).toBe(200);
    sessionToken = loginRes.body.token;
  });

  it('should regenerate recovery code for authenticated user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/regenerate-recovery-code')
      .set('Authorization', `Bearer ${sessionToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('recoveryCode');
  });

  it('should change password for authenticated user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${sessionToken}`)
      .send({
        currentPassword: 'BrandNewPassword2026!',
        newPassword: 'FinalPassword2026!'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject Google login when given an invalid ID token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({ idToken: 'invalid.jwt.token' });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid or expired Google');
  });

  it('should authenticate via Google login with verified mock token payload', async () => {
    const res = await request(app)
      .post('/api/v1/auth/google')
      .send({ idToken: 'mock_google_id_token_test_123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('amina.google@nairobi.org');
    expect(res.body.user.authProvider).toBe('google');
    expect(res.body).toHaveProperty('token');
  });

  it('should log out and invalidate session', async () => {
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${sessionToken}`);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);

    // Profile check with invalidated token should fail
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${sessionToken}`);

    expect(meRes.status).toBe(401);
  });

  it('should delete account and cleanup sessions', async () => {
    // Re-login with the changed password
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'FinalPassword2026!'
      });
    expect(loginRes.status).toBe(200);
    const activeToken = loginRes.body.token;

    const delRes = await request(app)
      .delete('/api/v1/auth/account')
      .set('Authorization', `Bearer ${activeToken}`);

    expect(delRes.status).toBe(200);
    expect(delRes.body.success).toBe(true);

    // Verify user no longer exists
    const checkRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'FinalPassword2026!'
      });
    expect(checkRes.status).toBe(401);
  });
});
