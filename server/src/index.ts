import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { 
  sequelize, 
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
  ImpactAction,
  Notification,
  SupportTicket
} from './models/index';
import { processAssistantChat, isOnlineAiConfigured, getActiveProvider, getActiveModel, GROQ_MODEL } from './services/aiAssistant';
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
  AFRICAN_CASE_STUDIES, 
  issueCertificateForUser 
} from './services/learningService';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Extend express Request for participantId, user & admin validation
interface AuthenticatedRequest extends Request {
  participantId?: string;
  isAdmin?: boolean;
  user?: User;
}

// Participant Authentication Middleware
const requireParticipantAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed Bearer token' });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty authorization token' });
  }

  req.participantId = token;
  next();
};

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

// Admin Authorization Middleware for research dataset export
const requireAdminAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authorization required' });
  }

  const token = authHeader.substring(7).trim();

  // Check if token belongs to an authentic user session with admin role
  const user = await validateSession(token);
  if (user && user.role === 'admin') {
    req.isAdmin = true;
    req.user = user;
    return next();
  }

  // Check if token matches server-configured admin export key
  const configuredAdminKey = process.env.ADMIN_EXPORT_SECRET || process.env.ADMIN_SECRET_KEY;
  const isTest = process.env.NODE_ENV === 'test';

  if (!configuredAdminKey && !isTest) {
    console.error('Security alert: Admin export key is not configured in server environment.');
    return res.status(503).json({ error: 'Service Unavailable: Server-side admin authorization is not configured' });
  }

  const isValidToken = (isTest && token === 'ADMIN-TEST') || token === configuredAdminKey;
  if (!isValidToken) {
    return res.status(403).json({ error: 'Forbidden: Invalid administrator credentials' });
  }

  req.isAdmin = true;
  next();
};

// Health and Root Endpoint (No hardcoded credentials exposed)
app.get('/', (_req: Request, res: Response) => {
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

// Climate Buddy Online AI Status Endpoint
app.get('/api/v1/assistant/status', (_req: Request, res: Response) => {
  res.json({
    onlineAvailable: isOnlineAiConfigured(),
    provider: getActiveProvider(),
    model: getActiveModel(),
    freeTier: true
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
    if (!user || user.authProvider !== 'email' || !user.passwordHash || !user.passwordSalt) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await createSession(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        authProvider: user.authProvider
      },
      token
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
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
      user = await User.findOne({ where: { email: payload.email.toLowerCase() } });
      if (user) {
        user.googleSubjectId = payload.sub;
        if (payload.picture && !user.avatarUrl) user.avatarUrl = payload.picture;
        await user.save();
      }
    }

    if (!user) {
      user = await User.create({
        email: payload.email ? payload.email.toLowerCase() : null,
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
      emailVerified: user.authProvider === 'google',
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
        emailVerified: user.authProvider === 'google',
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
        modProgress.completedLessons = completedCount;
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
app.post('/api/v1/sync', requireParticipantAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { records } = req.body;
  const participantId = req.participantId;

  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'Bad Request: "records" must be an array' });
  }

  const processedIds: string[] = [];
  const failedIds: string[] = [];

  const transaction = await sequelize.transaction();
  try {
    for (const record of records) {
      if (!record || !record.clientEventId || !record.entityType || !record.entityData) {
        if (record?.clientEventId) failedIds.push(record.clientEventId);
        continue;
      }

      const { clientEventId, entityType, entityData } = record;
      
      // Idempotency check: avoid double-processing identical offline events
      const existing = await SyncRecord.findOne({ where: { clientEventId }, transaction });
      if (existing) {
        processedIds.push(clientEventId);
        continue;
      }

      await SyncRecord.create({
        participantId: participantId!,
        clientEventId,
        entityType,
        entityData,
        status: 'processed'
      }, { transaction });

      // Process specific entity changes safely
      if (entityType === 'PROGRESS') {
        const { moduleId, completedLessons, completed } = entityData;
        const [progress] = await ModuleProgress.findOrCreate({
          where: { participantId: participantId!, moduleId: String(moduleId) },
          defaults: { 
            completedLessons: Array.isArray(completedLessons) ? completedLessons.length : Number(completedLessons) || 0, 
            completed: Boolean(completed), 
            lastAccessed: new Date(), 
            participantId: participantId!, 
            moduleId: String(moduleId) 
          },
          transaction
        });

        const newLessonsCount = Array.isArray(completedLessons) ? completedLessons.length : Number(completedLessons) || 0;
        if (newLessonsCount > progress.completedLessons) {
          progress.completedLessons = newLessonsCount;
        }
        if (completed) progress.completed = true;
        progress.lastAccessed = new Date();
        await progress.save({ transaction });
      } else if (entityType === 'ASSESSMENT') {
        const { questionId, answer } = entityData;
        await AssessmentResponse.create({
          participantId: participantId!,
          questionId: String(questionId),
          answer: String(answer)
        }, { transaction });
      }

      processedIds.push(clientEventId);
    }
    
    await transaction.commit();
    res.json({ processedIds, failedIds });
  } catch (err: any) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

// Admin export endpoint (Protected by requireAdminAuth, de-identified dataset)
app.get('/api/v1/admin/export', requireAdminAuth, async (_req: AuthenticatedRequest, res: Response) => {
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
      modules,
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
      Module.findAll({ order: [['order', 'ASC']] }),
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

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalParticipants: participants.length,
        totalLessonCompletions: lessonProgresses.filter(lp => lp.completed).length,
        totalCertificates: certificates.length,
        totalProjectSubmissions: projectSubmissions.length,
        totalActiveSessions: userSessionsCount,
        rolesCount
      },
      database: {
        dialect: 'sqlite',
        storage: 'server/database.sqlite',
        connected: true,
        tableCount: 21
      },
      users,
      modules,
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

    const [lp] = await LessonProgress.findOrCreate({
      where: { userId, moduleId: String(moduleId), lessonId: String(lessonId) },
      defaults: {
        userId,
        moduleId: String(moduleId),
        lessonId: String(lessonId),
        completed: Boolean(completed),
        playbackSeconds: Number(playbackSeconds) || 0,
        notes: notes || null,
        lastAccessedAt: new Date()
      }
    });

    if (completed !== undefined) lp.completed = Boolean(completed);
    if (playbackSeconds !== undefined) lp.playbackSeconds = Number(playbackSeconds);
    if (notes !== undefined) lp.notes = notes;
    lp.lastAccessedAt = new Date();
    await lp.save();

    // Aggregate into ModuleProgress
    const completedCount = await LessonProgress.count({
      where: { userId, moduleId: String(moduleId), completed: true }
    });

    const [modProgress] = await ModuleProgress.findOrCreate({
      where: { userId, moduleId: String(moduleId) },
      defaults: {
        userId,
        participantId: `USER-${userId.substring(0, 8)}`,
        moduleId: String(moduleId),
        completedLessons: completedCount,
        completed: completedCount >= 3,
        lastAccessed: new Date()
      }
    });

    modProgress.completedLessons = completedCount;
    if (completedCount >= 3) modProgress.completed = true;
    modProgress.lastAccessed = new Date();
    await modProgress.save();

    return res.json({ success: true, lessonProgress: lp, moduleProgress: modProgress });
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
    const { moduleId, pathwayId, answers, score, totalQuestions, feedback } = req.body;

    if (!moduleId || score === undefined) {
      return res.status(400).json({ error: 'moduleId and score are required' });
    }

    const finalScore = Number(score);
    const total = Number(totalQuestions) || 5;
    const passed = (finalScore / total) >= 0.70;

    const submission = await QuizSubmission.create({
      userId,
      moduleId,
      pathwayId: pathwayId || null,
      score: finalScore,
      passed,
      totalQuestions: total,
      answers,
      feedback
    });

    return res.status(201).json({
      success: true,
      submissionId: submission.id,
      score: finalScore,
      totalQuestions: total,
      percentage: Math.round((finalScore / total) * 100),
      passed,
      feedback
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
    const { pathwayId, pathwayTitle, skills } = req.body;
    const result = await issueCertificateForUser(userId, pathwayId, pathwayTitle, skills);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
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
    return res.json(certificates);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

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

const seedDemoAccounts = async () => {
  const adminEmail = 'admin@climatejustice.ke';
  const instructorEmail = 'instructor@climatejustice.ke';
  const learnerEmail = 'learner@climatejustice.ke';

  const defaultPassword = 'Password123!';
  const { hash, salt } = hashPassword(defaultPassword);

  // Admin
  const admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    await User.create({
      email: adminEmail,
      name: 'Dr. John Obure (Admin)',
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: 'email',
      role: 'admin',
      title: 'Platform Director & Curriculum Lead',
      institution: 'Climate Justice Nairobi'
    });
  }

  // Instructor
  const instructor = await User.findOne({ where: { email: instructorEmail } });
  if (!instructor) {
    await User.create({
      email: instructorEmail,
      name: 'Dr. Wanjiku Muthoni (Instructor)',
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: 'email',
      role: 'instructor',
      title: 'Senior Climatologist & Lead Instructor',
      institution: 'Climate Justice Nairobi',
      expertise: 'Climate Adaptation, Spatial Modeling & Urban Resiliency'
    });
  }

  // Learner
  const learner = await User.findOne({ where: { email: learnerEmail } });
  let aminaId: string;
  if (!learner) {
    const created = await User.create({
      email: learnerEmail,
      phone: '+254712345678',
      phoneVerified: true,
      name: 'Amina Wanjiku (Learner)',
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: 'email',
      role: 'learner',
      institution: 'Nairobi Community Climate Action Network'
    });
    aminaId = created.id;
  } else {
    aminaId = learner.id;
  }

  // Seed Verified Demo Certificate for public URL verification
  const demoCert = await Certificate.findByPk('CJN-2026-DEMO');
  if (!demoCert) {
    await Certificate.create({
      id: 'CJN-2026-DEMO',
      userId: aminaId,
      learnerName: 'Amina Wanjiku',
      courseTitle: 'Climate Science Fundamentals & Nairobi Adaptation',
      pathwayId: 'pathway-fundamentals',
      issuingOrg: 'Climate Justice Nairobi',
      instructorName: 'John Obure',
      instructorTitle: 'Climate Activist and Founder',
      issueDate: new Date('2026-10-28'),
      skills: [
        'Decadal Climate Trajectory Analysis (KMD)',
        'Nairobi Urban Heat Island Mapping',
        'Community Flood Hazard Assessment',
        'IPCC Tier-1 Carbon Footprint Estimation'
      ],
      verificationUrl: '/verify/CJN-2026-DEMO',
      distinction: 'Honors Distinction'
    });
  } else {
    demoCert.instructorName = 'John Obure';
    demoCert.instructorTitle = 'Climate Activist and Founder';
    await demoCert.save();
  }

  // Seed sample graded project submission
  const demoSub = await ProjectSubmission.findOne({ where: { projectId: 'proj-carbon-footprint', userId: aminaId } });
  if (!demoSub) {
    await ProjectSubmission.create({
      userId: aminaId,
      projectId: 'proj-carbon-footprint',
      projectType: 'carbon-audit',
      title: 'Household & Micro-Enterprise Carbon Footprint Assessment in Mathare',
      summary: 'A localized carbon audit assessing household LPG, matatu commuting, and organic waste diversion in Mathare 4A.',
      fileUrl: 'https://climatejustice.ke/submissions/mathare-carbon-audit.pdf',
      status: 'graded',
      score: 92,
      rubricScores: { methodology: 28, calculations: 27, impact: 19, feasibility: 18 },
      instructorFeedback: 'Outstanding application of local Kenyan emission factors. Clear and realistic household waste diversion plan. Meets all evaluation criteria for environmental certification.',
      gradedBy: 'Dr. Wanjiku Muthoni',
      gradedAt: new Date()
    });
  }
};

const seedModules = async () => {
  await seedDemoAccounts();
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

const PORT = process.env.PORT || 3001;

export const startServer = async () => {
  await setupDb();
  await seedModules();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(console.error);
}

export default app;
