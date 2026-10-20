import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { sequelize, setupDb, Participant, Module, ModuleProgress, SyncRecord, AssessmentResponse, User, UserSession } from './models/index';
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

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

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

// Admin Authorization Middleware for research dataset export
const requireAdminAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authorization required' });
  }

  const token = authHeader.substring(7).trim();
  const configuredAdminKey = process.env.ADMIN_EXPORT_SECRET || process.env.ADMIN_SECRET_KEY || (process.env.NODE_ENV === 'test' ? 'ADMIN-TEST' : null);

  if (!configuredAdminKey) {
    console.error('Security alert: Admin export key is not configured in server environment.');
    return res.status(503).json({ error: 'Service Unavailable: Server-side admin authorization is not configured' });
  }

  if (token !== configuredAdminKey) {
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
      name: user.name,
      displayName: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      authProvider: user.authProvider
    }
  });
});

// Reset Password with Recovery Code (Zero-Cost Email-Free Recovery)
app.post('/api/v1/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, recoveryCode, newPassword } = req.body;
    if (!email || !recoveryCode || !newPassword) {
      return res.status(400).json({ error: 'Email, recovery code, and new password are required' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const user = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    if (!user || !user.recoveryCodeHash || !user.recoveryCodeSalt) {
      return res.status(400).json({ error: 'Invalid email or recovery code' });
    }

    const isValid = verifyRecoveryCode(recoveryCode, user.recoveryCodeHash, user.recoveryCodeSalt);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid email or recovery code' });
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
