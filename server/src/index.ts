import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { 
  sequelize, 
  sqliteDatabasePath,
  setupDb, 
  Participant, 
  Module, 
  ModuleProgress, 
  SyncRecord, 
  AssessmentResponse, 
  User, 
  UserSession,
  PhoneVerification,
  LessonProgress,
  LessonBookmark,
  LessonQuestion,
  QuizSubmission,
  ProjectSubmission,
  Certificate,
  CertificateDelivery,
  ImpactAction,
  Notification,
  SupportTicket
} from './models/index';
import { processAssistantChat, getActiveProvider, getActiveModel, GROQ_MODEL } from './services/aiAssistant';
import { 
  hashPassword, 
  verifyPassword, 
  generateRecoveryCode, 
  verifyRecoveryCode, 
  createSession, 
  validateSession, 
  verifyGoogleToken 
} from './services/authService';
import { getTtsStatus, synthesizeCloudSpeech } from './services/ttsService';
import { 
  registerWithPhone, 
  loginWithPhone, 
  normalizePhoneNumber,
  isValidPhoneNumber,
  SUPPORTED_COUNTRY_CODES 
} from './services/phoneAuthService';
import { 
  PRACTICAL_PROJECTS, 
  CLIMATE_DATASETS, 
  AFRICAN_CASE_STUDIES
} from './services/learningService';
import {
  COURSE_ID,
  findCourseModule,
  gradeCourseQuiz,
  issueCourseCertificateIfComplete,
  updateModuleCompletion
} from './services/courseProgress';
import { COURSE_MODULES } from './services/courseCatalog';
import { createCertificatePdf } from './services/certificatePdf';
import { attemptCertificateEmail, attemptPendingCertificateEmails } from './services/certificateEmail';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Detect client production build directory for unified full-stack hosting
const potentialDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'dist')
];
const clientDistPath = potentialDistPaths.find(p => fs.existsSync(p));

if (clientDistPath) {
  app.use(express.static(clientDistPath));
}

// Extend express Request for authenticated user data
interface AuthenticatedRequest extends Request {
  participantId?: string;
  user?: User;
}

// Registered User Authentication Middleware
const requireUserAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed Bearer token' });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty authorization token' });
  }

  const user = await validateSession(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
  }

  req.user = user;
  next();
};

// Role-Based Authorization Middleware (Learner, Instructor, Admin)
const requireRoles = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    await requireUserAuth(req, res, () => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: Authentication required' });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: `Forbidden: Access requires role [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
        });
      }
      next();
    });
  };
};

// Health and Root Endpoint (No hardcoded credentials exposed)
app.get('/', (_req: Request, res: Response) => {
  if (clientDistPath) {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Climate Justice Nairobi API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 650px; margin: 40px auto; line-height: 1.6; padding: 0 20px; color: #1f2937; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; background: #dcfce7; color: #166534; }
          .card { margin-top: 24px; padding: 20px; background: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
        </style>
      </head>
      <body>
        <span class="badge">Operational</span>
        <h1>Climate Justice Nairobi API</h1>
        <p>Offline-First Progressive Web Application API Backend for Youth Climate Literacy.</p>
        <div class="card">
          <h3>API Information</h3>
          <p>Endpoints are available under <code>/api/v1</code>:</p>
          <ul>
            <li><code>GET /api/v1/health</code> - Server health check</li>
            <li><code>POST /api/v1/auth/register</code> - Pseudonymized participant registration</li>
            <li><code>GET /api/v1/modules</code> - Climate curriculum modules</li>
            <li><code>POST /api/v1/sync</code> - Idempotent offline record synchronization</li>
            <li><code>GET /api/v1/admin/export</code> - Authorized research dataset export</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Report online availability only after a real provider response.
let assistantStatusCache: {
  checkedAt: number;
  onlineAvailable: boolean;
  provider: string;
  model: string;
} | null = null;
app.get('/api/v1/assistant/status', async (_req: Request, res: Response) => {
  if (!assistantStatusCache || Date.now() - assistantStatusCache.checkedAt > 60_000) {
    try {
      const result = await processAssistantChat({
        message: 'Reply with the single word OK.',
        language: 'en'
      });
      assistantStatusCache = {
        checkedAt: Date.now(),
        onlineAvailable: result.mode === 'online' && !result.fallbackToOffline && Boolean(result.answer.trim()),
        provider: getActiveProvider(),
        model: result.model || getActiveModel()
      };
    } catch (error) {
      console.warn('Climate Buddy provider health check failed.');
      assistantStatusCache = {
        checkedAt: Date.now(),
        onlineAvailable: false,
        provider: getActiveProvider(),
        model: getActiveModel()
      };
    }
  }
  return res.json({
    onlineAvailable: assistantStatusCache.onlineAvailable,
    provider: assistantStatusCache.provider,
    model: assistantStatusCache.model,
    freeTier: assistantStatusCache.provider === 'free-online'
  });
});

// Climate Buddy Text-to-Speech Status Endpoint
app.get('/api/v1/assistant/tts/status', (_req: Request, res: Response) => {
  res.json(getTtsStatus());
});

// Climate Buddy Text-to-Speech Generation Endpoint
app.post('/api/v1/assistant/tts', async (req: Request, res: Response) => {
  try {
    const { text, language } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing text to synthesize' });
    }
    const result = await synthesizeCloudSpeech(text, language || 'en');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Climate Buddy Conversational Endpoint (General AI + Local Hybrid Grounding)
app.post('/api/v1/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, language, history } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const result = await processAssistantChat({ message, language, history }, clientIp);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      answer: 'An unexpected server error occurred. Local offline assistant is available.',
      mode: 'offline',
      fallbackToOffline: true,
      error: err.message
    });
  }
});

// User and Participant Registration Endpoint
app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword, privacyConsent, name, displayName } = req.body;

    // A. Registered User Account Creation (Email + Password)
    if (email && password) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email).trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      if (String(password).length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }

      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (privacyConsent === false) {
        return res.status(400).json({ error: 'You must agree to the privacy notice and terms' });
      }

      const existingUser = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email address already exists' });
      }

      const { hash, salt } = hashPassword(password);
      const recovery = generateRecoveryCode();

      const user = await User.create({
        email: String(email).trim().toLowerCase(),
        name: (name || displayName) ? String(name || displayName).trim() : null,
        passwordHash: hash,
        passwordSalt: salt,
        recoveryCodeHash: recovery.hash,
        recoveryCodeSalt: recovery.salt,
        authProvider: 'email',
        role: 'learner'
      });

      const token = await createSession(user.id);

      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name,
          displayName: user.name,
          role: user.role,
          authProvider: user.authProvider
        },
        token,
        recoveryCode: recovery.code
      });
    }

    // B. Anonymous Research Participant Registration (Backwards compatible)
    const { ageGroup, location, educationStatus, gender } = req.body;
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = `KIB-${randomSuffix}`;
    
    const participant = await Participant.create({ 
      id, 
      ageGroup: ageGroup || '15-24', 
      location: location || 'Nairobi', 
      educationStatus: educationStatus || 'Secondary', 
      gender: gender || 'Undisclosed' 
    });

    return res.json({ participantId: participant.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// User Login Endpoint (Email + Password)
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    if (!user) {
      console.warn('[auth.login] account_not_found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.authProvider !== 'email' || !user.passwordHash || !user.passwordSalt) {
      console.warn('[auth.login] different_sign_in_method');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      console.warn('[auth.login] password_check_failed');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await createSession(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        displayName: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        authProvider: user.authProvider
      },
      token
    });
  } catch (err: any) {
    console.error('[auth.login] authentication service error', err);
    return res.status(500).json({ error: 'Authentication failed' });
  }
});

// Google Identity Services Sign-In Endpoint
app.post('/api/v1/auth/google', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    const payload = await verifyGoogleToken(idToken);
    if (!payload || !payload.sub) {
      return res.status(401).json({ error: 'Invalid or expired Google identity token' });
    }

    let user = await User.findOne({ where: { googleSubjectId: payload.sub } });
    if (!user && payload.email) {
      const emailAccount = await User.findOne({ where: { email: payload.email.toLowerCase() } });
      if (emailAccount && !payload.email_verified) {
        return res.status(403).json({ error: 'Google must verify this email address before it can be linked.' });
      }
      user = emailAccount;
      if (user) {
        user.googleSubjectId = payload.sub;
        user.emailVerified = true;
      }
    }

    if (user && payload.email_verified) {
      user.emailVerified = true;
      if (!user.email && payload.email) user.email = payload.email.toLowerCase();
      if (payload.picture && !user.avatarUrl) user.avatarUrl = payload.picture;
      await user.save();
    }

    if (!user) {
      user = await User.create({
        email: payload.email ? payload.email.toLowerCase() : null,
        emailVerified: Boolean(payload.email_verified),
        googleSubjectId: payload.sub,
        name: payload.name || 'Google Learner',
        avatarUrl: payload.picture || null,
        authProvider: 'google',
        role: 'learner'
      });
    }

    const token = await createSession(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        displayName: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        authProvider: 'google'
      },
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// User Logout Endpoint
app.post('/api/v1/auth/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      await UserSession.destroy({ where: { token } });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Current User Profile Endpoint
app.get('/api/v1/auth/me', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      phoneVerified: Boolean(user.phoneVerified),
      name: user.name,
      displayName: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      title: user.title,
      bio: user.bio,
      expertise: user.expertise,
      institution: user.institution,
      authProvider: user.authProvider
    }
  });
});

// Update Current User Profile Endpoint
app.patch(['/api/v1/auth/profile', '/api/v1/user/profile'], requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { name, displayName, avatarUrl, bio, title, institution, expertise } = req.body;

    if (name !== undefined) user.name = name?.trim() || null;
    if (displayName !== undefined && !name) user.name = displayName?.trim() || null;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl?.trim() || null;
    if (bio !== undefined) user.bio = bio?.trim() || null;
    if (title !== undefined) user.title = title?.trim() || null;
    if (institution !== undefined) user.institution = institution?.trim() || null;
    if (expertise !== undefined) user.expertise = expertise?.trim() || null;

    await user.save();

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        phoneVerified: Boolean(user.phoneVerified),
        name: user.name,
        displayName: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        title: user.title,
        bio: user.bio,
        expertise: user.expertise,
        institution: user.institution,
        authProvider: user.authProvider
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Phone & Password Account Registration (Zero SMS dependencies)
app.post('/api/v1/auth/phone/register', async (req: Request, res: Response) => {
  try {
    const { countryCode, nationalNumber, password, name, recoveryEmail } = req.body;
    const result = await registerWithPhone(countryCode, nationalNumber, password, name, recoveryEmail);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Phone & Password Account Login
app.post('/api/v1/auth/phone/login', async (req: Request, res: Response) => {
  try {
    const { countryCode, nationalNumber, password } = req.body;
    const result = await loginWithPhone(countryCode, nationalNumber, password);
    if (!result.success) {
      const statusCode = result.cooldownSeconds ? 429 : 401;
      return res.status(statusCode).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get Supported Country Codes
app.get('/api/v1/auth/phone/countries', (_req: Request, res: Response) => {
  return res.json(SUPPORTED_COUNTRY_CODES);
});

// Reset Password with Recovery Code (Zero-Cost Email/Phone Recovery)
// Requires the 16-character cryptographic recovery code. Never resets by phone number alone.
app.post('/api/v1/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, phone, countryCode, nationalNumber, recoveryCode, newPassword } = req.body;
    
    // Determine identifier (email or phone)
    let user: User | null = null;

    if (email && String(email).trim().length > 0) {
      user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    } else if (phone || (countryCode && nationalNumber)) {
      const targetPhone = phone || normalizePhoneNumber(countryCode || '+254', nationalNumber);
      user = await User.findOne({ where: { phone: targetPhone } });
    }

    if (!user || !recoveryCode || !newPassword) {
      return res.status(400).json({ error: 'Valid account identifier (email or phone), 16-character recovery code, and new password are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    if (!user.recoveryCodeHash || !user.recoveryCodeSalt) {
      return res.status(400).json({ error: 'Invalid account identifier or recovery code' });
    }

    const isValid = verifyRecoveryCode(recoveryCode, user.recoveryCodeHash, user.recoveryCodeSalt);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid account identifier or recovery code' });
    }

    const { hash, salt } = hashPassword(newPassword);
    const newRecovery = generateRecoveryCode();

    user.passwordHash = hash;
    user.passwordSalt = salt;
    user.recoveryCodeHash = newRecovery.hash;
    user.recoveryCodeSalt = newRecovery.salt;
    await user.save();

    // Invalidate existing sessions upon password reset
    await UserSession.destroy({ where: { userId: user.id } });

    return res.json({
      success: true,
      message: 'Password reset successfully',
      newRecoveryCode: newRecovery.code
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Regenerate Recovery Code (Authenticated)
app.post('/api/v1/auth/regenerate-recovery-code', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.authProvider !== 'email') {
      return res.status(400).json({ error: 'Recovery codes are only available for email accounts' });
    }

    const newRecovery = generateRecoveryCode();
    user.recoveryCodeHash = newRecovery.hash;
    user.recoveryCodeSalt = newRecovery.salt;
    await user.save();

    return res.json({ success: true, recoveryCode: newRecovery.code });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Change Password (Authenticated)
app.post('/api/v1/auth/change-password', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { currentPassword, newPassword } = req.body;

    if (user.authProvider !== 'email' || !user.passwordHash || !user.passwordSalt) {
      return res.status(400).json({ error: 'Password change is only available for email accounts' });
    }

    if (!currentPassword || !newPassword || String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const isValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete Account (Authenticated)
app.delete('/api/v1/auth/account', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await UserSession.destroy({ where: { userId } });
    await ModuleProgress.destroy({ where: { userId } });
    await req.user!.destroy();

    return res.json({ success: true, message: 'Account and associated learning progress deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Transfer Guest Progress to User Account
app.post('/api/v1/auth/transfer-guest-progress', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const records = req.body.progressRecords || req.body.progressList;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'progressRecords or progressList must be an array' });
    }

    let transferredCount = 0;
    for (const record of records) {
      if (!record || !record.moduleId) continue;

      const completedCount = Array.isArray(record.completedLessons)
        ? record.completedLessons.length
        : Number(record.completedLessons) || 0;

      const [modProgress] = await ModuleProgress.findOrCreate({
        where: { userId, moduleId: String(record.moduleId) },
        defaults: {
          userId,
          participantId: `USER-${userId.substring(0, 8)}`,
          moduleId: String(record.moduleId),
          completedLessons: completedCount,
          completed: Boolean(record.completed),
          lastAccessed: new Date()
        }
      });

      if (completedCount > modProgress.completedLessons) {
        modProgress.completedLessons = Math.max(modProgress.completedLessons || 0, completedCount);
      }
      if (record.completed) {
        modProgress.completed = true;
      }
      modProgress.lastAccessed = new Date();
      await modProgress.save();
      transferredCount++;
    }

    return res.json({ success: true, transferredCount, importedCount: transferredCount });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get modules
app.get('/api/v1/modules', async (_req: Request, res: Response) => {
  try {
    const modules = await Module.findAll({ order: [['order', 'ASC']] });
    res.json(modules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Synchronize offline progress and assessments (Idempotent, transactional)
app.post('/api/v1/sync', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { records } = req.body;
  const userId = req.user!.id;
  const participantId = req.user!.participantId || `USER-${userId.substring(0, 8)}`;

  if (!Array.isArray(records) || records.length > 500) {
    return res.status(400).json({ error: 'Bad Request: "records" must be an array of at most 500 events' });
  }

  const processedIds: string[] = [];
  const failedIds: string[] = [];

  for (const record of records) {
    const clientEventId = typeof record?.clientEventId === 'string' ? record.clientEventId : '';
    if (
      !clientEventId
      || record.ownerId !== userId
      || !record.entityData
      || !['PROGRESS', 'ASSESSMENT', 'QUIZ_ATTEMPT'].includes(record.entityType)
    ) {
      if (clientEventId) failedIds.push(clientEventId);
      continue;
    }

    const existing = await SyncRecord.findOne({ where: { clientEventId } });
    if (existing) {
      (existing.userId === userId ? processedIds : failedIds).push(clientEventId);
      continue;
    }

    const transaction = await sequelize.transaction();
    let issuedCertificate: Certificate | null = null;
    try {
      const { entityType, entityData } = record;
      if (entityType === 'PROGRESS') {
        const moduleId = typeof entityData.moduleId === 'string' ? entityData.moduleId : '';
        const courseModule = findCourseModule(moduleId);
        if (!courseModule || !Array.isArray(entityData.completedLessons)) throw new Error('Invalid progress module');
        for (const lessonIndex of entityData.completedLessons) {
          if (!Number.isInteger(lessonIndex) || lessonIndex < 0 || lessonIndex >= courseModule.lessons.length) {
            throw new Error('Invalid completed lesson index');
          }
          const lessonId = courseModule.lessons[lessonIndex];
          const [lessonProgress] = await LessonProgress.findOrCreate({
            where: { userId, moduleId, lessonId },
            defaults: {
              userId,
              moduleId,
              lessonId,
              completed: true,
              playbackSeconds: 0,
              notes: null,
              lastAccessedAt: new Date()
            },
            transaction
          });
          if (!lessonProgress.completed) {
            lessonProgress.completed = true;
            lessonProgress.lastAccessedAt = new Date();
            await lessonProgress.save({ transaction });
          }
        }
        await updateModuleCompletion(userId, moduleId, transaction);
        issuedCertificate = await issueCourseCertificateIfComplete(userId, transaction);
      } else if (entityType === 'QUIZ_ATTEMPT') {
        const moduleId = typeof entityData.moduleId === 'string' ? entityData.moduleId : '';
        const answers = entityData.answers;
        const grade = gradeCourseQuiz(moduleId, answers);
        if (!grade) throw new Error('Invalid quiz attempt');
        const [submission] = await QuizSubmission.findOrCreate({
          where: { userId, clientEventId },
          defaults: {
            userId,
            moduleId,
            clientEventId,
            pathwayId: COURSE_ID,
            score: grade.score,
            passed: grade.passed,
            totalQuestions: grade.totalQuestions,
            answers
          },
          transaction
        });
        await updateModuleCompletion(userId, submission.moduleId, transaction);
        issuedCertificate = await issueCourseCertificateIfComplete(userId, transaction);
      } else {
        const questionId = typeof entityData.questionId === 'string' ? entityData.questionId : '';
        if (!questionId || entityData.answer === undefined) throw new Error('Invalid assessment event');
        await AssessmentResponse.create({
          participantId,
          questionId,
          answer: String(entityData.answer)
        }, { transaction });
      }

      await SyncRecord.create({
        participantId,
        userId,
        clientEventId,
        entityType: record.entityType,
        entityData: record.entityData,
        status: 'processed'
      }, { transaction });
      await transaction.commit();
    } catch {
      await transaction.rollback();
      console.error('[sync] event_save_failed', { userId, clientEventId });
      const savedRetry = await SyncRecord.findOne({ where: { clientEventId } });
      (savedRetry?.userId === userId ? processedIds : failedIds).push(clientEventId);
      continue;
    }

    processedIds.push(clientEventId);
    if (issuedCertificate) {
      await attemptCertificateEmail(issuedCertificate.id).catch(error => {
        console.error('[certificate.email] post_sync_attempt_failed', error);
      });
    }
  }
  res.json({ processedIds, failedIds });
});

// Research export requires the same administrator role as the dashboard.
app.get('/api/v1/admin/export', requireRoles(['admin']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const participants = await Participant.findAll({
      attributes: ['id', 'ageGroup', 'location', 'educationStatus', 'gender', 'createdAt']
    });
    const progress = await ModuleProgress.findAll();
    const assessments = await AssessmentResponse.findAll();
    
    res.json({
      exportedAt: new Date().toISOString(),
      participants,
      progress,
      assessments
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Dashboard Summary & Live Dataset (Protected strictly for role: admin)
app.get('/api/v1/admin/dashboard', requireRoles(['admin']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      users,
      participants,
      moduleProgresses,
      lessonProgresses,
      certificates,
      projectSubmissions,
      quizSubmissions,
      userSessionsCount
    ] = await Promise.all([
      User.findAll({
        attributes: [
          'id', 'name', 'email', 'phone', 'phoneVerified',
          'role', 'authProvider', 'title', 'institution', 'createdAt', 'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      }),
      Participant.findAll({ order: [['createdAt', 'DESC']] }),
      ModuleProgress.findAll({ order: [['lastAccessed', 'DESC']] }),
      LessonProgress.findAll({ order: [['lastAccessedAt', 'DESC']] }),
      Certificate.findAll({ order: [['createdAt', 'DESC']] }),
      ProjectSubmission.findAll({ order: [['createdAt', 'DESC']] }),
      QuizSubmission.findAll({ order: [['createdAt', 'DESC']] }),
      UserSession.count()
    ]);

    // Roles distribution
    const rolesCount = {
      learner: users.filter(u => u.role === 'learner').length,
      instructor: users.filter(u => u.role === 'instructor').length,
      admin: users.filter(u => u.role === 'admin').length,
      researcher: users.filter(u => u.role === 'researcher').length
    };

    // User lookup map for enriched display
    const userMap = new Map<string, { name: string; email: string }>();
    users.forEach(u => {
      userMap.set(u.id, {
        name: u.name || u.email || 'Learner',
        email: u.email || (u.phone ? `Phone: ${u.phone}` : 'Unlinked')
      });
    });

    // Synthesize real-time activity events from authentic database records
    const activity: Array<{
      id: string;
      type: 'registration' | 'lesson_completed' | 'certificate_earned' | 'project_submitted';
      title: string;
      description: string;
      userName: string;
      userEmail: string;
      timestamp: Date;
    }> = [];

    // Add recent user registrations
    users.slice(0, 15).forEach(u => {
      activity.push({
        id: `reg-${u.id}`,
        type: 'registration',
        title: 'New Account Registered',
        description: `Registered with ${u.authProvider} provider as ${u.role}`,
        userName: u.name || u.email || 'New User',
        userEmail: u.email || (u.phone ? `Phone: ${u.phone}` : 'Unlinked'),
        timestamp: u.createdAt
      });
    });

    // Add recent completed lessons
    lessonProgresses.filter(lp => lp.completed).slice(0, 20).forEach(lp => {
      const uInfo = userMap.get(lp.userId) || { name: 'Enrolled Learner', email: '' };
      activity.push({
        id: `lp-${lp.id}`,
        type: 'lesson_completed',
        title: 'Lesson Completed',
        description: `Completed lesson ${lp.lessonId} in module ${lp.moduleId}`,
        userName: uInfo.name,
        userEmail: uInfo.email,
        timestamp: lp.lastAccessedAt || lp.updatedAt
      });
    });

    // Add certificates
    certificates.forEach(c => {
      activity.push({
        id: `cert-${c.id}`,
        type: 'certificate_earned',
        title: 'Certificate Awarded',
        description: `Earned ${c.courseTitle} (${c.distinction || 'Honors'})`,
        userName: c.learnerName,
        userEmail: userMap.get(c.userId)?.email || '',
        timestamp: c.issueDate || c.createdAt
      });
    });

    // Add project submissions
    projectSubmissions.forEach(ps => {
      const uInfo = userMap.get(ps.userId) || { name: 'Learner', email: '' };
      activity.push({
        id: `proj-${ps.id}`,
        type: 'project_submitted',
        title: 'Applied Project Submitted',
        description: `Submitted "${ps.title}" (${ps.projectType}) - Status: ${ps.status}`,
        userName: uInfo.name,
        userEmail: uInfo.email,
        timestamp: ps.createdAt
      });
    });

    // Sort combined activity descending
    activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const totalLessonCompletions = Math.max(
      lessonProgresses.filter(lp => lp.completed).length,
      moduleProgresses.reduce((total, record) => total + (Number(record.completedLessons) || 0), 0)
    );

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalParticipants: participants.length,
        totalLessonCompletions,
        totalCertificates: certificates.length,
        totalProjectSubmissions: projectSubmissions.length,
        totalActiveSessions: userSessionsCount,
        rolesCount
      },
      database: {
        dialect: 'sqlite',
        storage: sqliteDatabasePath,
        connected: true,
        tableCount: 21
      },
      users,
      modules: COURSE_MODULES.map((module, index) => ({
        id: module.id,
        order: index + 1,
        title: module.title,
        description: `${module.lessons.length} required lessons and ${module.questions.length} quiz questions`
      })),
      moduleProgresses,
      lessonProgresses,
      certificates,
      projectSubmissions,
      quizSubmissions,
      recentActivity: activity.slice(0, 30)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Role Management Endpoint (Protected strictly for role: admin)
app.patch('/api/v1/admin/users/:id/role', requireRoles(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ['learner', 'instructor', 'admin', 'researcher'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Allowed roles: ${validRoles.join(', ')}` });
    }

    const targetUser = await User.findByPk(id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Protect against self-demotion lockout
    if (req.user?.id === id && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot remove admin role from your own active account' });
    }

    await targetUser.update({ role });

    res.json({
      success: true,
      message: `User role successfully updated to ${role}`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CORE LEARNING SYSTEM & ENHANCED WORKFLOWS ---

// 1. Learner Overview & Progress
app.get('/api/v1/learning/progress', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const moduleProgress = await ModuleProgress.findAll({ where: { userId } });
    const lessonProgress = await LessonProgress.findAll({ where: { userId } });
    const quizzes = await QuizSubmission.findAll({ where: { userId } });
    const certificates = await Certificate.findAll({ where: { userId } });
    const projects = await ProjectSubmission.findAll({ where: { userId } });

    return res.json({
      moduleProgress,
      lessonProgress,
      quizzes,
      certificates,
      projects
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/learning/progress', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { moduleId, lessonId, completed, playbackSeconds, notes } = req.body;

    if (!moduleId || !lessonId) {
      return res.status(400).json({ error: 'moduleId and lessonId are required' });
    }
    const courseModule = findCourseModule(String(moduleId));
    if (!courseModule || !courseModule.lessons.includes(String(lessonId))) {
      return res.status(400).json({ error: 'Unknown course module or lesson' });
    }

    const result = await sequelize.transaction(async transaction => {
      const [lessonProgress] = await LessonProgress.findOrCreate({
        where: { userId, moduleId: String(moduleId), lessonId: String(lessonId) },
        defaults: {
          userId,
          moduleId: String(moduleId),
          lessonId: String(lessonId),
          completed: Boolean(completed),
          playbackSeconds: Number(playbackSeconds) || 0,
          notes: notes || null,
          lastAccessedAt: new Date()
        },
        transaction
      });

      if (completed !== undefined) lessonProgress.completed = Boolean(completed);
      if (playbackSeconds !== undefined) lessonProgress.playbackSeconds = Number(playbackSeconds);
      if (notes !== undefined) lessonProgress.notes = notes;
      lessonProgress.lastAccessedAt = new Date();
      await lessonProgress.save({ transaction });

      const moduleProgress = await updateModuleCompletion(userId, String(moduleId), transaction);
      const certificate = await issueCourseCertificateIfComplete(userId, transaction);
      return { lessonProgress, moduleProgress, certificate };
    });

    if (result.certificate) await attemptCertificateEmail(result.certificate.id);
    return res.json({
      success: true,
      lessonProgress: result.lessonProgress,
      moduleProgress: result.moduleProgress,
      certificate: result.certificate
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. Bookmarks
app.get('/api/v1/learning/bookmarks', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const bookmarks = await LessonBookmark.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
    return res.json(bookmarks);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/learning/bookmarks', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { moduleId, lessonId, timestampSeconds, note } = req.body;
    const bookmark = await LessonBookmark.create({
      userId,
      moduleId,
      lessonId,
      timestampSeconds: Number(timestampSeconds) || 0,
      note: note || null
    });
    return res.status(201).json(bookmark);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/v1/learning/bookmarks/:id', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await LessonBookmark.destroy({ where: { id: req.params.id, userId } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Lesson Questions & Answers (Supervisor Must-Have #4)
app.get('/api/v1/learning/questions/:moduleId/:lessonId', async (req: Request, res: Response) => {
  try {
    const { moduleId, lessonId } = req.params;
    const questions = await LessonQuestion.findAll({
      where: { moduleId, lessonId },
      order: [['createdAt', 'DESC']]
    });
    return res.json(questions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/learning/questions', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userName = req.user!.name || 'Learner';
    const { moduleId, lessonId, question } = req.body;

    if (!question || !String(question).trim()) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    const newQuestion = await LessonQuestion.create({
      userId,
      userName,
      moduleId,
      lessonId,
      question: String(question).trim()
    });

    return res.status(201).json(newQuestion);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/learning/questions/:id/answer', requireRoles(['instructor', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { answer } = req.body;
    if (!answer || !String(answer).trim()) {
      return res.status(400).json({ error: 'Answer content is required' });
    }

    const question = await LessonQuestion.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.isAnswered = true;
    question.answer = String(answer).trim();
    question.answeredBy = `${user.name || 'Instructor'} (${user.title || 'Faculty Reviewer'})`;
    question.answeredAt = new Date();
    await question.save();

    await Notification.create({
      userId: question.userId,
      type: 'qa_answer',
      title: '💬 Instructor Answered Your Question',
      message: `${user.name || 'An instructor'} answered your question on ${question.moduleId}.`,
      link: `/module/${question.moduleId}`
    });

    return res.json(question);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 4. Interactive Assessments & Quizzes
app.post('/api/v1/assessments/submit', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { moduleId, answers, clientEventId } = req.body;
    if (typeof moduleId !== 'string' || typeof clientEventId !== 'string' || !clientEventId.trim()) {
      return res.status(400).json({ error: 'moduleId and clientEventId are required' });
    }
    const grade = gradeCourseQuiz(moduleId, answers);
    if (!grade) {
      return res.status(400).json({ error: 'Quiz answers are invalid for this course module' });
    }

    const result = await sequelize.transaction(async transaction => {
      const existing = await QuizSubmission.findOne({
        where: { userId, clientEventId },
        transaction
      });
      if (existing) {
        const existingCertificate = await Certificate.findOne({
          where: { userId, pathwayId: COURSE_ID },
          transaction
        });
        return { submission: existing, certificate: existingCertificate, duplicate: true, moduleProgress: null };
      }

      const submission = await QuizSubmission.create({
        userId,
        moduleId,
        clientEventId,
        pathwayId: COURSE_ID,
        score: grade.score,
        passed: grade.passed,
        totalQuestions: grade.totalQuestions,
        answers
      }, { transaction });
      const moduleProgress = await updateModuleCompletion(userId, moduleId, transaction);
      const certificate = await issueCourseCertificateIfComplete(userId, transaction);
      return { submission, certificate, moduleProgress, duplicate: false };
    });

    if (result.certificate && !result.duplicate) {
      await attemptCertificateEmail(result.certificate.id);
    }

    return res.status(201).json({
      success: true,
      submissionId: result.submission.id,
      score: result.submission.score,
      totalQuestions: result.submission.totalQuestions,
      percentage: Math.round((result.submission.score / result.submission.totalQuestions) * 100),
      passed: result.submission.passed,
      duplicate: result.duplicate,
      moduleProgress: result.moduleProgress,
      certificate: result.certificate
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/assessments/my-results', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const submissions = await QuizSubmission.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return res.json(submissions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 5. Practical Projects & Submissions
app.get('/api/v1/projects', (_req: Request, res: Response) => {
  return res.json(PRACTICAL_PROJECTS);
});

app.post('/api/v1/projects/submit', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { 
      projectId, 
      projectType, 
      title, 
      summary, 
      fileUrl, 
      fileAttachmentUrl,
      fileName, 
      fileType, 
      fileSize, 
      calculatorData 
    } = req.body;

    if (!projectId || !title || !summary) {
      return res.status(400).json({ error: 'projectId, title, and summary are required' });
    }

    const resolvedFileUrl = (fileUrl || fileAttachmentUrl)?.trim() || null;

    const submission = await ProjectSubmission.create({
      userId,
      projectId,
      projectType: projectType || 'practical_project',
      title,
      summary,
      fileUrl: resolvedFileUrl,
      fileName: fileName || null,
      fileType: fileType || null,
      fileSize: fileSize || null,
      calculatorData: calculatorData || null,
      status: 'submitted'
    });

    return res.status(201).json({
      success: true,
      submission,
      message: 'Project successfully submitted for instructor rubric evaluation.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/projects/my-submissions', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const submissions = await ProjectSubmission.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    return res.json(submissions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/instructor/projects', requireRoles(['instructor', 'admin']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const submissions = await ProjectSubmission.findAll({
      order: [['createdAt', 'DESC']]
    });

    const userIds = [...new Set(submissions.map(s => s.userId))];
    const users = await User.findAll({ where: { id: userIds }, attributes: ['id', 'name', 'email', 'phone'] });
    const userMap = new Map(users.map(u => [u.id, u]));

    const enriched = submissions.map(s => ({
      ...s.toJSON(),
      learner: userMap.get(s.userId) || { name: 'Unknown Learner' }
    }));

    return res.json(enriched);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/instructor/projects/:id/grade', requireRoles(['instructor', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { score, rubricScores, instructorFeedback, status } = req.body;
    const submission = await ProjectSubmission.findByPk(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Project submission not found' });
    }

    submission.score = Number(score);
    submission.rubricScores = rubricScores;
    submission.instructorFeedback = instructorFeedback;
    submission.status = status || (Number(score) >= 70 ? 'graded' : 'needs_revision');
    submission.gradedBy = `${user.name || 'Instructor'} (${user.title || 'Faculty Reviewer'})`;
    submission.gradedAt = new Date();
    await submission.save();

    await Notification.create({
      userId: submission.userId,
      type: 'project_graded',
      title: '📋 Project Evaluation Complete',
      message: `Your project "${submission.title}" was evaluated. Score: ${submission.score}/100. Status: ${submission.status}.`,
      link: '/projects'
    });

    return res.json({ success: true, submission });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. Verifiable Digital Certificates (Supervisor Must-Have #6)
app.post('/api/v1/certificates/issue', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const certificate = await sequelize.transaction(transaction =>
      issueCourseCertificateIfComplete(userId, transaction)
    );
    if (!certificate) {
      return res.status(409).json({
        success: false,
        error: 'Complete every required lesson and pass every module quiz before issuing a certificate.'
      });
    }
    const delivery = await attemptCertificateEmail(certificate.id);
    return res.json({
      success: true,
      certificate,
      emailDeliveryStatus: delivery?.status || 'not_sent'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/certificates/my-certificates', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const certificates = await Certificate.findAll({
      where: { userId },
      order: [['issueDate', 'DESC']]
    });
    for (const certificate of certificates) {
      if (certificate.pathwayId === COURSE_ID) {
        await issueCourseCertificateIfComplete(userId);
      }
      await attemptCertificateEmail(certificate.id);
    }
    const deliveries = await CertificateDelivery.findAll({
      where: { userId }
    });
    const statusByCertificateId = new Map(
      deliveries.map(delivery => [delivery.certificateId, delivery.status])
    );
    return res.json(certificates.map(certificate => ({
      ...certificate.toJSON(),
      emailDeliveryStatus: statusByCertificateId.get(certificate.id) || 'not_sent'
    })));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/certificates/:certId/pdf', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const certificate = await Certificate.findOne({
      where: { id: req.params.certId, userId: req.user!.id }
    });
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    const pdf = await createCertificatePdf(certificate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificate.id}.pdf"`);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.send(pdf);
  } catch (error) {
    console.error('[certificate.pdf] generation_failed', {
      certificateId: req.params.certId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return res.status(503).json({
      error: 'Certificate PDF generation is unavailable. Check the private certificate signature and font assets.'
    });
  }
});

app.post(
  '/api/v1/certificates/:certId/email/retry',
  requireUserAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    const certificate = await Certificate.findOne({
      where: { id: req.params.certId, userId: req.user!.id }
    });
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    const delivery = await CertificateDelivery.findOne({
      where: { certificateId: certificate.id, userId: req.user!.id }
    });
    if (!delivery) return res.status(404).json({ error: 'Certificate email delivery record not found' });
    if (delivery.status !== 'failed') {
      return res.status(409).json({
        error: 'Only failed certificate email deliveries can be retried.',
        emailDeliveryStatus: delivery.status
      });
    }

    const result = await attemptCertificateEmail(certificate.id, undefined, true);
    if (!result || result.status === 'failed') {
      return res.status(502).json({
        success: false,
        error: 'Certificate email delivery failed. The certificate remains available to download.',
        emailDeliveryStatus: result?.status || 'failed'
      });
    }
    return res.json({ success: true, emailDeliveryStatus: result.status });
  }
);

// Public certificate verification endpoint (Unprotected for QR codes and employer/academic verification)
app.get('/api/v1/certificates/verify/:certId', async (req: Request, res: Response) => {
  try {
    const { certId } = req.params;
    const cert = await Certificate.findOne({ where: { id: certId } });
    if (!cert) {
      return res.status(404).json({ 
        verified: false, 
        error: 'Certificate not found or invalid certificate identifier.' 
      });
    }

    return res.json({
      verified: true,
      certificateId: cert.id,
      learnerName: cert.learnerName,
      courseTitle: cert.courseTitle,
      pathwayId: cert.pathwayId,
      issuingOrganization: cert.issuingOrg,
      instructor: cert.instructorName,
      instructorTitle: cert.instructorTitle,
      issueDate: cert.issueDate,
      distinction: cert.distinction,
      skillsVerified: cert.skills,
      verifiedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 7. Interactive Climate Data & African Case Studies
app.get('/api/v1/climate/datasets', (_req: Request, res: Response) => {
  return res.json(CLIMATE_DATASETS);
});

app.get('/api/v1/climate/nairobi-power', async (_req: Request, res: Response) => {
  const sourceUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M&community=AG&longitude=36.8219&latitude=-1.2921&start=20250101&end=20250107&format=JSON';
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return res.status(502).json({ error: `NASA POWER returned HTTP ${response.status}` });
    }
    const data = await response.json() as {
      geometry?: { coordinates?: number[] };
      header?: { sources?: string[]; start?: string; end?: string };
      parameters?: Record<string, { units?: string; longname?: string }>;
      properties?: { parameter?: Record<string, Record<string, number>> };
    };
    const rainfall = data.properties?.parameter?.PRECTOTCORR;
    const temperature = data.properties?.parameter?.T2M;
    if (!rainfall || !temperature || !data.geometry?.coordinates) {
      return res.status(502).json({ error: 'NASA POWER response did not contain the requested Nairobi parameters' });
    }
    const records = Object.keys(rainfall).flatMap(date => {
      const precipitation = rainfall[date];
      const temperatureC = temperature[date];
      if (precipitation === undefined || temperatureC === undefined ||
          precipitation === -999 || temperatureC === -999) return [];
      return [{ date, precipitation, temperatureC }];
    });
    return res.json({
      sourceUrl,
      dataset: data.header?.sources?.join(', ') || 'NASA POWER',
      location: {
        name: 'Nairobi, Kenya (POWER point)',
        longitude: data.geometry.coordinates[0],
        latitude: data.geometry.coordinates[1],
        elevationMeters: data.geometry.coordinates[2]
      },
      dates: { start: data.header?.start || '20250101', end: data.header?.end || '20250107' },
      parameters: {
        precipitation: data.parameters?.PRECTOTCORR,
        temperature: data.parameters?.T2M
      },
      records
    });
  } catch (error) {
    console.error('Could not retrieve the NASA POWER Nairobi dataset', error);
    return res.status(502).json({ error: 'NASA POWER data is currently unavailable. Try again later.' });
  }
});

app.get('/api/v1/climate/case-studies', (_req: Request, res: Response) => {
  return res.json(AFRICAN_CASE_STUDIES);
});

// 8. Real-World Impact Tracking
app.get('/api/v1/impact/actions', async (_req: Request, res: Response) => {
  try {
    const actions = await ImpactAction.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(actions);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/impact/actions', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userName = req.user!.name || 'Community Leader';
    const { actionType, title, description, quantity, unit, methodology, assumptions, evidenceUrl } = req.body;

    if (!actionType || !title || quantity === undefined) {
      return res.status(400).json({ error: 'actionType, title, and quantity are required' });
    }

    const action = await ImpactAction.create({
      userId,
      userName,
      actionType,
      title,
      description: description || '',
      quantity: Number(quantity) || 0,
      unit: unit || 'units',
      methodology: methodology || 'Self-reported community monitoring log',
      assumptions: assumptions || 'Empirical local calculation',
      evidenceUrl: evidenceUrl || null,
      status: 'self_reported'
    });

    return res.status(201).json({ success: true, action });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/instructor/impact/:id/verify', requireRoles(['instructor', 'admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { status } = req.body;
    const action = await ImpactAction.findByPk(req.params.id);
    if (!action) {
      return res.status(404).json({ error: 'Action record not found' });
    }

    action.status = status === 'verified' ? 'verified' : 'rejected';
    action.verifiedBy = `${user.name || 'Instructor'} (${user.title || 'Reviewer'})`;
    action.verifiedAt = new Date();
    await action.save();

    return res.json({ success: true, action });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 9. Institutional Analytics & Cohort Export
app.get('/api/v1/instructor/analytics', requireRoles(['instructor', 'admin']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const totalLearners = await User.count({ where: { role: 'learner' } });
    const totalCompletions = await ModuleProgress.count({ where: { completed: true } });
    const totalCertificates = await Certificate.count();
    const totalQuizzes = await QuizSubmission.count();
    const passedQuizzes = await QuizSubmission.count({ where: { passed: true } });
    const pendingProjects = await ProjectSubmission.count({ where: { status: 'submitted' } });
    const totalImpactActions = await ImpactAction.count();

    return res.json({
      totalLearners,
      totalCompletions,
      totalCertificates,
      totalQuizzes,
      quizPassRate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0,
      pendingProjects,
      totalImpactActions
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/instructor/cohort-export', requireRoles(['instructor', 'admin']), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const learners = await User.findAll({
      where: { role: 'learner' },
      attributes: ['id', 'name', 'email', 'phone', 'createdAt']
    });
    const progress = await ModuleProgress.findAll();
    const certificates = await Certificate.findAll();
    const projects = await ProjectSubmission.findAll();

    return res.json({
      exportedAt: new Date().toISOString(),
      institution: 'Climate Justice Nairobi - Learning Cohort',
      totalCohortSize: learners.length,
      learners,
      progress,
      certificates,
      projects
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 10. Notifications
app.get('/api/v1/notifications', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    return res.json(notifications);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.patch('/api/v1/notifications/:id/read', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await Notification.update({ read: true }, { where: { id: req.params.id, userId } });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 11. AI Error Report
app.post('/api/v1/assistant/report-error', requireUserAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, aiResponse, userCorrection, lessonRef } = req.body;
    console.warn('[AI-ERROR-REPORT]', {
      reportedBy: req.user!.id,
      query,
      aiResponse,
      userCorrection,
      lessonRef,
      timestamp: new Date().toISOString()
    });
    return res.json({
      success: true,
      message: 'Thank you. Your report has been recorded for curriculum refinement and grounding verification.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 12. Support & Help Center Inquiries
app.post(['/api/v1/support/tickets', '/api/v1/support/inquiries'], async (req: Request, res: Response) => {
  try {
    const { name, email, category, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long' });
    }

    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const user = await validateSession(token);
      if (user) {
        userId = user.id;
      }
    }

    const ticketId = `CJN-TICK-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const ticket = await SupportTicket.create({
      id: ticketId,
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category?.trim() || 'general',
      subject: subject.trim(),
      message: message.trim(),
      status: 'open'
    });

    return res.status(201).json({
      success: true,
      ticketId: ticket.id,
      message: `Your inquiry has been logged with reference ${ticket.id}. Our academic and technical support team will reply to ${ticket.email}.`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/support/tickets', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const token = authHeader.substring(7).trim();
    const user = await validateSession(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }

    const where = user.role === 'admin' || user.role === 'instructor' ? {} : { userId: user.id };
    const tickets = await SupportTicket.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    return res.json({ success: true, tickets });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

const setupFirstAdmin = async () => {
  const existingAdmin = await User.findOne({ where: { role: 'admin' } });
  if (existingAdmin) return;
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('No administrator exists. Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD for first-admin setup.');
    return;
  }
  if (password.length < 14) {
    throw new Error('INITIAL_ADMIN_PASSWORD must be at least 14 characters');
  }
  const { hash, salt } = hashPassword(password);
  await User.create({
    email,
    name: 'Platform Administrator',
    passwordHash: hash,
    passwordSalt: salt,
    authProvider: 'email',
    role: 'admin',
    institution: 'Climate Justice Nairobi'
  });
  console.log('Initial administrator account created from environment configuration.');
};

const seedModules = async () => {
  const count = await Module.count();
  if (count === 0) {
    await Module.bulkCreate([
      { order: 1, title: 'Nairobi Climate Risk', description: 'Understand the climate risks affecting Nairobi' },
      { order: 2, title: 'Urban Flooding', description: 'How flooding impacts our communities and how to prepare' },
      { order: 3, title: 'Heat & Health', description: 'The effects of extreme heat on health and what to do' },
      { order: 4, title: 'Water Stress & Disease Prevention', description: 'Managing water shortages and preventing diseases' },
      { order: 5, title: 'Climate Justice', description: 'Understanding unequal impacts and responsibilities' },
      { order: 6, title: 'Green Claims', description: 'How to evaluate environmental claims and information' },
      { order: 7, title: 'Safe Civic Participation', description: 'Safe and lawful ways to participate in civic action' },
    ]);
  }
};

// SPA client-side routing fallback (serve index.html for non-API GET requests)
if (clientDistPath) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    if (req.path.startsWith('/api')) {
      return next();
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

const PORT = process.env.PORT || 3001;

export const startServer = async () => {
  await setupDb();
  await seedModules();
  if (process.env.NODE_ENV !== 'test') {
    await setupFirstAdmin();
    app.listen(PORT, () => {
      console.log(`SQLite database: ${sqliteDatabasePath}`);
      console.log(`Server listening on port ${PORT}`);
      void attemptPendingCertificateEmails().catch(error => {
        console.error('[certificate.email] startup_retry_failed', error);
      });
    });
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(console.error);
}

export default app;
