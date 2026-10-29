import { User } from '../models/index';
import { hashPassword, verifyPassword, generateRecoveryCode, createSession } from './authService';

export interface PhoneAuthResult {
  success: boolean;
  user?: any;
  token?: string;
  recoveryCode?: string;
  error?: string;
  cooldownSeconds?: number;
}

export const SUPPORTED_COUNTRY_CODES = [
  { code: '+254', country: 'Kenya', minDigits: 9, maxDigits: 9, placeholder: '712 345 678' },
  { code: '+256', country: 'Uganda', minDigits: 9, maxDigits: 9, placeholder: '772 123 456' },
  { code: '+255', country: 'Tanzania', minDigits: 9, maxDigits: 9, placeholder: '712 345 678' },
  { code: '+251', country: 'Ethiopia', minDigits: 9, maxDigits: 9, placeholder: '911 234 567' },
];

/**
 * In-memory brute-force protection rate limiter for phone login.
 * Locks an account for 15 minutes after 5 consecutive failed attempts.
 */
interface RateLimitInfo {
  attempts: number;
  lockoutUntil?: number;
}
const loginRateLimits = new Map<string, RateLimitInfo>();

export function checkLoginRateLimit(phone: string): { allowed: boolean; waitSeconds?: number } {
  const info = loginRateLimits.get(phone);
  if (!info) return { allowed: true };
  if (info.lockoutUntil && Date.now() < info.lockoutUntil) {
    const waitSeconds = Math.ceil((info.lockoutUntil - Date.now()) / 1000);
    return { allowed: false, waitSeconds };
  }
  if (info.lockoutUntil && Date.now() >= info.lockoutUntil) {
    loginRateLimits.delete(phone);
    return { allowed: true };
  }
  return { allowed: true };
}

export function recordLoginFailure(phone: string): { lockedOut: boolean; waitSeconds?: number } {
  const info = loginRateLimits.get(phone) || { attempts: 0 };
  info.attempts += 1;
  if (info.attempts >= 5) {
    info.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
    loginRateLimits.set(phone, info);
    return { lockedOut: true, waitSeconds: 15 * 60 };
  }
  loginRateLimits.set(phone, info);
  return { lockedOut: false };
}

export function clearLoginFailure(phone: string): void {
  loginRateLimits.delete(phone);
}

/**
 * Normalizes phone number into international standard E.164 format.
 * E.g., country code '+254' and local number '0712345678' -> '+254712345678'
 */
export function normalizePhoneNumber(countryCode: string, nationalNumber: string): string {
  let cleanCode = (countryCode || '+254').trim();
  if (!cleanCode.startsWith('+')) {
    cleanCode = `+${cleanCode}`;
  }
  let cleanNumber = (nationalNumber || '').replace(/[\s\-\(\)\.]/g, '');

  const bareCode = cleanCode.replace('+', '');
  if (cleanNumber.startsWith(`+${bareCode}`)) {
    cleanNumber = cleanNumber.substring(bareCode.length + 1);
  } else if (cleanNumber.startsWith(bareCode)) {
    cleanNumber = cleanNumber.substring(bareCode.length);
  }

  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }

  return `${cleanCode}${cleanNumber}`;
}

export function isValidPhoneNumber(countryCode: string, nationalNumber: string): boolean {
  let cleanCode = (countryCode || '+254').trim();
  if (!cleanCode.startsWith('+')) {
    cleanCode = `+${cleanCode}`;
  }
  let cleanNumber = (nationalNumber || '').replace(/[\s\-\(\)\.]/g, '');

  const bareCode = cleanCode.replace('+', '');
  if (cleanNumber.startsWith(`+${bareCode}`)) {
    cleanNumber = cleanNumber.substring(bareCode.length + 1);
  } else if (cleanNumber.startsWith(bareCode)) {
    cleanNumber = cleanNumber.substring(bareCode.length);
  }

  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }

  if (!/^\d+$/.test(cleanNumber)) return false;

  if (cleanCode === '+254') {
    return cleanNumber.length === 9 && /^[17]\d{8}$/.test(cleanNumber);
  }

  const match = SUPPORTED_COUNTRY_CODES.find(c => c.code === cleanCode);
  if (match) {
    return cleanNumber.length >= match.minDigits && cleanNumber.length <= match.maxDigits;
  }
  return cleanNumber.length >= 7 && cleanNumber.length <= 15;
}

/**
 * Registers a new user account with phone number, password, and name.
 * Phone ownership is stored as unverified. No SMS codes are sent.
 */
export async function registerWithPhone(
  countryCode: string,
  nationalNumber: string,
  password: string,
  name: string,
  recoveryEmail?: string
): Promise<PhoneAuthResult> {
  if (!countryCode || !nationalNumber) {
    return { success: false, error: 'Country code and phone number are required.' };
  }

  if (!isValidPhoneNumber(countryCode, nationalNumber)) {
    return {
      success: false,
      error: countryCode === '+254'
        ? 'Please enter a valid 9-digit Kenyan phone number (e.g. 712 345 678 or 112 345 678).'
        : 'Please enter a valid phone number for the selected country.'
    };
  }

  if (!name || name.trim().length === 0) {
    return { success: false, error: 'Full name or learner name is required.' };
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const phone = normalizePhoneNumber(countryCode, nationalNumber);

  // Check unique phone number constraint
  const existingUser = await User.findOne({ where: { phone } });
  if (existingUser) {
    return {
      success: false,
      error: 'An account with this phone number already exists. Please sign in instead.'
    };
  }

  // Validate optional recovery email
  let cleanRecoveryEmail: string | null = null;
  if (recoveryEmail && recoveryEmail.trim().length > 0) {
    const emailCandidate = recoveryEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailCandidate)) {
      return { success: false, error: 'Please enter a valid recovery email address or leave it blank.' };
    }
    const existingEmailUser = await User.findOne({ where: { email: emailCandidate } });
    if (existingEmailUser) {
      return { success: false, error: 'This recovery email is already associated with another account.' };
    }
    cleanRecoveryEmail = emailCandidate;
  }

  // Cryptographic password hash (scrypt) & 16-character recovery code
  const { hash: passwordHash, salt: passwordSalt } = hashPassword(password);
  const { code: recoveryCode, hash: recoveryCodeHash, salt: recoveryCodeSalt } = generateRecoveryCode();

  // Create persistent user record with phoneVerified explicitly false
  const user = await User.create({
    phone,
    phoneVerified: false, // Explicitly false: phone ownership is unverified
    email: cleanRecoveryEmail,
    name: name.trim(),
    passwordHash,
    passwordSalt,
    recoveryCodeHash,
    recoveryCodeSalt,
    authProvider: 'phone',
    role: 'learner'
  });

  // Create session
  const token = await createSession(user.id);

  return {
    success: true,
    user: {
      id: user.id,
      phone: user.phone,
      phoneVerified: false,
      email: user.email,
      name: user.name,
      displayName: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      authProvider: user.authProvider
    },
    token,
    recoveryCode
  };
}

/**
 * Authenticates an existing user via phone number and password.
 * Enforces rate limiting on consecutive failures.
 */
export async function loginWithPhone(
  countryCode: string,
  nationalNumber: string,
  password: string
): Promise<PhoneAuthResult> {
  if (!countryCode || !nationalNumber || !password) {
    return { success: false, error: 'Phone number and password are required.' };
  }

  if (!isValidPhoneNumber(countryCode, nationalNumber)) {
    return { success: false, error: 'Please enter a valid phone number.' };
  }

  const phone = normalizePhoneNumber(countryCode, nationalNumber);

  // Check rate limiting lockout
  const rateLimit = checkLoginRateLimit(phone);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many failed login attempts. Please wait ${rateLimit.waitSeconds} seconds before trying again.`,
      cooldownSeconds: rateLimit.waitSeconds
    };
  }

  const user = await User.findOne({ where: { phone } });
  if (!user || !user.passwordHash || !user.passwordSalt) {
    recordLoginFailure(phone);
    return { success: false, error: 'Invalid phone number or password.' };
  }

  // Constant-time password verification
  const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    const failure = recordLoginFailure(phone);
    if (failure.lockedOut) {
      return {
        success: false,
        error: 'Too many failed login attempts. This account is locked for 15 minutes to prevent unauthorized access.',
        cooldownSeconds: failure.waitSeconds
      };
    }
    return { success: false, error: 'Invalid phone number or password.' };
  }

  // Reset failure tracker upon successful login
  clearLoginFailure(phone);

  const token = await createSession(user.id);

  return {
    success: true,
    user: {
      id: user.id,
      phone: user.phone,
      phoneVerified: false,
      email: user.email,
      name: user.name,
      displayName: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      authProvider: user.authProvider
    },
    token
  };
}
