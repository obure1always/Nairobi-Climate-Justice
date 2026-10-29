import { 
  normalizePhoneNumber, 
  isValidPhoneNumber, 
  sendPhoneVerificationCode, 
  verifyPhoneCode,
  SUPPORTED_COUNTRY_CODES 
} from '../src/services/phoneAuthService';
import { setupDb, User, PhoneVerification } from '../src/models/index';

describe('Phone Authentication Service', () => {
  beforeAll(async () => {
    await setupDb();
  });

  beforeEach(async () => {
    await PhoneVerification.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  describe('Phone Validation and Normalization', () => {
    it('normalizes Kenya phone number correctly', () => {
      expect(normalizePhoneNumber('+254', '0712345678')).toBe('+254712345678');
      expect(normalizePhoneNumber('+254', '712 345 678')).toBe('+254712345678');
      expect(normalizePhoneNumber('254', '712-345-678')).toBe('+254712345678');
    });

    it('normalizes East Africa regional phone numbers correctly', () => {
      expect(normalizePhoneNumber('+256', '0772123456')).toBe('+256772123456');
      expect(normalizePhoneNumber('+256', '772123456')).toBe('+256772123456');
    });

    it('validates supported country codes and length', () => {
      expect(isValidPhoneNumber('+254', '0712345678')).toBe(true);
      expect(isValidPhoneNumber('+254', '712345678')).toBe(true);
      expect(isValidPhoneNumber('+254', '123')).toBe(false); // too short
      expect(isValidPhoneNumber('+256', '0772123456')).toBe(true);
      expect(isValidPhoneNumber('+256', '772123456')).toBe(true);
      expect(isValidPhoneNumber('+256', '7721234')).toBe(false); // too short for Uganda
    });
  });

  describe('OTP Generation and Verification Flow', () => {
    it('sends OTP code and enforces rate limit cooldown', async () => {
      const result1 = await sendPhoneVerificationCode('+254', '0712345678');
      expect(result1.success).toBe(true);
      expect(result1.devOtp).toBeDefined();
      expect(result1.devOtp).toMatch(/^\d{6}$/);

      // Attempting to send immediately should trigger cooldown
      const result2 = await sendPhoneVerificationCode('+254', '0712345678');
      expect(result2.success).toBe(false);
      expect(result2.message).toContain('Please wait');
      expect(result2.cooldownSeconds).toBeGreaterThan(0);
    });

    it('fails on wrong OTP and tracks attempts', async () => {
      const sendRes = await sendPhoneVerificationCode('+254', '0722000000');
      expect(sendRes.success).toBe(true);

      const verifyRes = await verifyPhoneCode('+254', '0722000000', '000000');
      expect(verifyRes.success).toBe(false);
      expect(verifyRes.error).toContain('Invalid code');
    });

    it('successfully verifies correct OTP, creates new user, and returns session token', async () => {
      const sendRes = await sendPhoneVerificationCode('+254', '0799111222');
      expect(sendRes.success).toBe(true);
      const otp = sendRes.devOtp!;

      const verifyRes = await verifyPhoneCode('+254', '0799111222', otp, 'Amina Wanjiku');
      expect(verifyRes.success).toBe(true);
      expect(verifyRes.isNewUser).toBe(true);
      expect(verifyRes.user.phone).toBe('+254799111222');
      expect(verifyRes.user.name).toBe('Amina Wanjiku');
      expect(verifyRes.token).toBeDefined();

      // Subsequent login with new code logs in existing user
      // Fast forward by clearing verification record to simulate subsequent login
      await PhoneVerification.destroy({ where: {} });
      const sendRes2 = await sendPhoneVerificationCode('+254', '0799111222');
      const verifyRes2 = await verifyPhoneCode('+254', '0799111222', sendRes2.devOtp!);
      expect(verifyRes2.success).toBe(true);
      expect(verifyRes2.isNewUser).toBe(false);
      expect(verifyRes2.user.id).toBe(verifyRes.user.id);
    });
  });
});
