import crypto from 'crypto';
import { PhoneVerification, User } from '../models/index';
import { createSession } from './authService';

export interface SendOtpResult {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  devOtp?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
  isNewUser?: boolean;
}

export const SUPPORTED_COUNTRY_CODES = [
  { code: '+254', country: 'Kenya', minDigits: 9, maxDigits: 10, placeholder: '712 345 678' },
  { code: '+256', country: 'Uganda', minDigits: 9, maxDigits: 9, placeholder: '772 123 456' },
  { code: '+255', country: 'Tanzania', minDigits: 9, maxDigits: 9, placeholder: '712 345 678' },
  { code: '+251', country: 'Ethiopia', minDigits: 9, maxDigits: 9, placeholder: '911 234 567' },
];

/**
 * Normalizes phone number into standard E.164 format.
 * E.g., country code '+254' and local number '0712345678' -> '+254712345678'
 */
export function normalizePhoneNumber(countryCode: string, nationalNumber: string): string {
  const cleanCode = countryCode.trim().startsWith('+') ? countryCode.trim() : `+${countryCode.trim()}`;
  let cleanNumber = nationalNumber.replace(/[\s\-\(\)\.]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  return `${cleanCode}${cleanNumber}`;
}

export function isValidPhoneNumber(countryCode: string, nationalNumber: string): boolean {
  const match = SUPPORTED_COUNTRY_CODES.find(c => c.code === countryCode);
  let cleanNumber = nationalNumber.replace(/[\s\-\(\)\.]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  if (!/^\d+$/.test(cleanNumber)) return false;

  if (match) {
    return cleanNumber.length >= match.minDigits && cleanNumber.length <= match.maxDigits;
  }
  return cleanNumber.length >= 7 && cleanNumber.length <= 15;
}

function hashOtp(code: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(code).digest('hex');
}

export function isSmsProviderConfigured(): boolean {
  const atConfigured = Boolean(process.env.AFRICASTALKING_API_KEY && process.env.AFRICASTALKING_USERNAME);
  const twilioConfigured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);
  return atConfigured || twilioConfigured;
}

/**
 * Dispatches SMS through Africa's Talking, Twilio, or test runner
 */
async function dispatchSms(phone: string, code: string): Promise<{ dispatched: boolean; provider: string; error?: string }> {
  const atApiKey = process.env.AFRICASTALKING_API_KEY;
  const atUsername = process.env.AFRICASTALKING_USERNAME;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

  const smsText = `Your Climate Justice Nairobi verification code is: ${code}. Valid for 10 minutes. Do not share this code.`;

  // 1. Africa's Talking SMS Gateway
  if (atApiKey && atUsername) {
    try {
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'apiKey': atApiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username: atUsername,
          to: phone,
          message: smsText
        })
      });
      if (response.ok) {
        return { dispatched: true, provider: 'africas_talking' };
      }
      const errText = await response.text().catch(() => '');
      return { dispatched: false, provider: 'africas_talking', error: `Africa's Talking error: ${response.status} ${errText}` };
    } catch (err: any) {
      return { dispatched: false, provider: 'africas_talking', error: err?.message || 'Network error' };
    }
  }

  // 2. Twilio SMS Gateway
  if (twilioSid && twilioToken && twilioFrom) {
    try {
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: twilioFrom,
          To: phone,
          Body: smsText
        })
      });
      if (response.ok) {
        return { dispatched: true, provider: 'twilio' };
      }
      const errText = await response.text().catch(() => '');
      return { dispatched: false, provider: 'twilio', error: `Twilio error: ${response.status} ${errText}` };
    } catch (err: any) {
      return { dispatched: false, provider: 'twilio', error: err?.message || 'Network error' };
    }
  }

  // 3. Test Runner Environment Only
  if (process.env.NODE_ENV === 'test') {
    return { dispatched: true, provider: 'test_runner' };
  }

  // 4. Live Environment Without SMS Credentials
  return { dispatched: false, provider: 'none', error: 'No SMS gateway provider is configured in environment.' };
}

/**
 * Initiates phone verification by generating and sending a 6-digit code.
 */
export async function sendPhoneVerificationCode(
  countryCode: string, 
  nationalNumber: string
): Promise<SendOtpResult> {
  if (!countryCode || !nationalNumber) {
    return { success: false, message: 'Country code and phone number are required.' };
  }

  if (!isValidPhoneNumber(countryCode, nationalNumber)) {
    return { success: false, message: 'Please enter a valid phone number for the selected country.' };
  }

  const phone = normalizePhoneNumber(countryCode, nationalNumber);

  // Check rate limiting / cooldown (60 seconds)
  const existing = await PhoneVerification.findOne({
    where: { phone, verified: false },
    order: [['lastSentAt', 'DESC']]
  });

  if (existing) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existing.lastSentAt).getTime()) / 1000);
    if (elapsedSeconds < 60) {
      const remaining = 60 - elapsedSeconds;
      return {
        success: false,
        message: `Please wait ${remaining} seconds before requesting a new code.`,
        cooldownSeconds: remaining
      };
    }
  }

  // Generate 6-digit OTP
  const rawCode = crypto.randomInt(100000, 999999).toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const codeHash = hashOtp(rawCode, salt);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Record verification in database
  await PhoneVerification.create({
    phone,
    codeHash,
    codeSalt: salt,
    expiresAt,
    attempts: 0,
    lastSentAt: new Date(),
    verified: false
  });

  // Dispatch SMS
  const dispatchRes = await dispatchSms(phone, rawCode);

  if (!dispatchRes.dispatched) {
    return {
      success: false,
      message: 'SMS verification is temporarily unavailable because an SMS gateway provider is not configured. Please sign in with Email and Password or continue as a Guest.',
      error: dispatchRes.error || 'SMS_PROVIDER_NOT_CONFIGURED'
    };
  }

  return {
    success: true,
    message: `Verification code dispatched to ${phone}. Valid for 10 minutes.`,
    cooldownSeconds: 60,
    devOtp: process.env.NODE_ENV === 'test' ? rawCode : undefined
  };
}

/**
 * Verifies the 6-digit code, creates/fetches user, and returns user & session token.
 */
export async function verifyPhoneCode(
  countryCode: string,
  nationalNumber: string,
  code: string,
  displayName?: string
): Promise<VerifyOtpResult> {
  if (!countryCode || !nationalNumber || !code) {
    return { success: false, error: 'Phone number and verification code are required.' };
  }

  const phone = normalizePhoneNumber(countryCode, nationalNumber);
  const cleanCode = code.trim();

  const record = await PhoneVerification.findOne({
    where: { phone, verified: false },
    order: [['lastSentAt', 'DESC']]
  });

  if (!record) {
    return { success: false, error: 'No active verification code found for this number. Please request a new code.' };
  }

  // Check expiry
  if (new Date() > new Date(record.expiresAt)) {
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  // Check max attempts
  if (record.attempts >= 5) {
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  // Verify hash
  const computedHash = hashOtp(cleanCode, record.codeSalt);
  if (computedHash !== record.codeHash) {
    record.attempts += 1;
    await record.save();
    const remaining = 5 - record.attempts;
    return {
      success: false,
      error: `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // Code is valid! Mark verified
  record.verified = true;
  await record.save();

  // Find or create user
  let user = await User.findOne({ where: { phone } });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = await User.create({
      phone,
      phoneVerified: true,
      name: displayName ? displayName.trim() : `Learner (${phone.slice(-4)})`,
      authProvider: 'phone',
      role: 'learner'
    });
  } else {
    if (!user.phoneVerified) {
      user.phoneVerified = true;
      await user.save();
    }
  }

  const token = await createSession(user.id);

  return {
    success: true,
    isNewUser,
    user: {
      id: user.id,
      phone: user.phone,
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
