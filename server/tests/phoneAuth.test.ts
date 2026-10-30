import { 
  normalizePhoneNumber, 
  isValidPhoneNumber, 
  registerWithPhone, 
  loginWithPhone,
  clearLoginFailure,
  SUPPORTED_COUNTRY_CODES 
} from '../src/services/phoneAuthService';
import { setupDb, User, UserSession } from '../src/models/index';
import { validateSession } from '../src/services/authService';

describe('Phone & Password Authentication Service', () => {
  beforeAll(async () => {
    await setupDb();
  });

  beforeEach(async () => {
    await UserSession.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('Phone Validation and Normalization', () => {
    it('normalizes Kenya phone numbers into standard +254 international format', () => {
      expect(normalizePhoneNumber('+254', '0712345678')).toBe('+254712345678');
      expect(normalizePhoneNumber('+254', '712 345 678')).toBe('+254712345678');
      expect(normalizePhoneNumber('254', '712-345-678')).toBe('+254712345678');
      expect(normalizePhoneNumber('+254', '0112345678')).toBe('+254112345678');
      expect(normalizePhoneNumber('+254', '+254712345678')).toBe('+254712345678');
    });

    it('normalizes East Africa regional phone numbers correctly', () => {
      expect(normalizePhoneNumber('+256', '0772123456')).toBe('+256772123456');
      expect(normalizePhoneNumber('+256', '772123456')).toBe('+256772123456');
    });

    it('validates supported country codes and phone lengths', () => {
      expect(isValidPhoneNumber('+254', '0712345678')).toBe(true);
      expect(isValidPhoneNumber('+254', '712345678')).toBe(true);
      expect(isValidPhoneNumber('+254', '0112345678')).toBe(true);
      expect(isValidPhoneNumber('+254', '123')).toBe(false); // too short
      expect(isValidPhoneNumber('+254', '07123456789')).toBe(false); // too long
      expect(isValidPhoneNumber('+256', '0772123456')).toBe(true);
      expect(isValidPhoneNumber('+256', '772123456')).toBe(true);
      expect(isValidPhoneNumber('+256', '7721234')).toBe(false);
    });
  });

  describe('Account Registration Flow', () => {
    it('registers a new user with name, phone, and password, keeping phoneVerified: false without SMS code', async () => {
      const regRes = await registerWithPhone(
        '+254',
        '0712345678',
        'StrongPassword123!',
        'Amina Wanjiku',
        'backup.amina@example.org'
      );

      expect(regRes.success).toBe(true);
      expect(regRes.token).toBeDefined();
      expect(regRes.recoveryCode).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
      expect(regRes.user.phone).toBe('+254712345678');
      expect(regRes.user.name).toBe('Amina Wanjiku');
      expect(regRes.user.email).toBe('backup.amina@example.org');
      expect(regRes.user.phoneVerified).toBe(false);

      // Verify database persistence
      const dbUser = await User.findOne({ where: { phone: '+254712345678' } });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.phoneVerified).toBe(false);
      expect(dbUser?.authProvider).toBe('phone');
      expect(dbUser?.passwordHash).toBeDefined();
      expect(dbUser?.passwordSalt).toBeDefined();

      // Verify authenticated session is active
      const validatedUser = await validateSession(regRes.token!);
      expect(validatedUser).not.toBeNull();
      expect(validatedUser?.id).toBe(dbUser?.id);
    });

    it('rejects duplicate phone registrations with clear error', async () => {
      const firstRes = await registerWithPhone('+254', '0712345678', 'Password123!', 'User One');
      expect(firstRes.success).toBe(true);

      // Attempting to register again with same normalized number (different input formatting)
      const secondRes = await registerWithPhone('+254', '712 345 678', 'DifferentPassword123!', 'User Two');
      expect(secondRes.success).toBe(false);
      expect(secondRes.error).toContain('already exists');
    });

    it('enforces minimum password length of 8 characters', async () => {
      const shortRes = await registerWithPhone('+254', '0712345678', '12345', 'Short Pass');
      expect(shortRes.success).toBe(false);
      expect(shortRes.error).toContain('at least 8 characters');
    });

    it('rejects duplicate recovery email if already used by another account', async () => {
      await registerWithPhone('+254', '0711111111', 'Password123!', 'User A', 'shared@example.org');
      const dupeEmailRes = await registerWithPhone('+254', '0722222222', 'Password123!', 'User B', 'shared@example.org');
      expect(dupeEmailRes.success).toBe(false);
      expect(dupeEmailRes.error).toContain('already associated');
    });
  });

  describe('Account Sign-In Flow', () => {
    beforeEach(async () => {
      clearLoginFailure('+254712345678');
      await registerWithPhone('+254', '0712345678', 'CorrectPassword123!', 'Learner Test');
    });

    it('successfully logs in with valid phone and password, establishing real authenticated session', async () => {
      const loginRes = await loginWithPhone('+254', '0712345678', 'CorrectPassword123!');
      expect(loginRes.success).toBe(true);
      expect(loginRes.token).toBeDefined();
      expect(loginRes.user.phone).toBe('+254712345678');
      expect(loginRes.user.phoneVerified).toBe(false);

      // Session is valid
      const sessionUser = await validateSession(loginRes.token!);
      expect(sessionUser).not.toBeNull();
      expect(sessionUser?.name).toBe('Learner Test');
    });

    it('rejects incorrect password with 401 equivalent message', async () => {
      const loginRes = await loginWithPhone('+254', '0712345678', 'WrongPassword!');
      expect(loginRes.success).toBe(false);
      expect(loginRes.error).toBe('Invalid phone number or password.');
      expect(loginRes.token).toBeUndefined();
    });

    it('rejects nonexistent phone number', async () => {
      const loginRes = await loginWithPhone('+254', '0799999999', 'AnyPassword123!');
      expect(loginRes.success).toBe(false);
      expect(loginRes.error).toBe('Invalid phone number or password.');
    });

    it('enforces brute force rate limiting after 5 consecutive failed attempts', async () => {
      for (let i = 0; i < 4; i++) {
        const fail = await loginWithPhone('+254', '0712345678', 'WrongPass!');
        expect(fail.success).toBe(false);
      }

      // 5th failed attempt triggers lockout
      const fifthFail = await loginWithPhone('+254', '0712345678', 'WrongPass!');
      expect(fifthFail.success).toBe(false);
      expect(fifthFail.error).toContain('locked for 15 minutes');
      expect(fifthFail.cooldownSeconds).toBeGreaterThan(0);

      // Subsequent attempt even with correct password is blocked during lockout
      const blockedLogin = await loginWithPhone('+254', '0712345678', 'CorrectPassword123!');
      expect(blockedLogin.success).toBe(false);
      expect(blockedLogin.error).toContain('Too many failed login attempts');
    });
  });
});
