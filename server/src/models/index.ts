import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite',
  logging: false,
});

export class Participant extends Model {
  declare id: string; // Coded identifier
  declare ageGroup: string;
  declare location: string;
  declare educationStatus: string;
  declare gender: string;
  declare createdAt: Date;
}
Participant.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  ageGroup: DataTypes.STRING,
  location: DataTypes.STRING,
  educationStatus: DataTypes.STRING,
  gender: DataTypes.STRING,
}, { sequelize, modelName: 'participant' });

export class Consent extends Model {}
Consent.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  participantId: { type: DataTypes.STRING, allowNull: false },
  consentedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  guardianConsent: { type: DataTypes.BOOLEAN, defaultValue: false }, // For minors
}, { sequelize, modelName: 'consent' });

export class Module extends Model {
  declare id: string;
  declare order: number;
  declare title: string;
  declare description: string;
}
Module.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  order: DataTypes.INTEGER,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
}, { sequelize, modelName: 'module' });

export class Lesson extends Model {}
Lesson.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  order: DataTypes.INTEGER,
  title: DataTypes.STRING,
  content: DataTypes.TEXT, // Placeholder for rich content or JSON
}, { sequelize, modelName: 'lesson' });

export class ModuleProgress extends Model {
  declare id: string;
  declare participantId: string;
  declare moduleId: string;
  declare completedLessons: number;
  declare completed: boolean;
  declare lastAccessed: Date;
}
ModuleProgress.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  participantId: { type: DataTypes.STRING, allowNull: false },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  completedLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  lastAccessed: DataTypes.DATE,
}, { sequelize, modelName: 'module_progress' });

export class Assessment extends Model {}
Assessment.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  type: DataTypes.ENUM('baseline', 'endline', 'sus'),
}, { sequelize, modelName: 'assessment' });

export class Question extends Model {}
Question.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  assessmentId: { type: DataTypes.STRING },
  type: DataTypes.STRING, // adaptation, justice, efficacy, sus
  text: DataTypes.TEXT,
  options: DataTypes.JSONB,
}, { sequelize, modelName: 'question' });

export class AssessmentResponse extends Model {
  declare id: string;
  declare participantId: string;
  declare questionId: string;
  declare answer: string;
}
AssessmentResponse.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  participantId: { type: DataTypes.STRING, allowNull: false },
  questionId: { type: DataTypes.STRING, allowNull: false },
  answer: DataTypes.STRING,
}, { sequelize, modelName: 'assessment_response' });

export class SyncRecord extends Model {
  declare id: string;
  declare participantId: string;
  declare clientEventId: string;
  declare entityType: string;
  declare entityData: any;
  declare status: string;
}
SyncRecord.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  participantId: { type: DataTypes.STRING, allowNull: false },
  clientEventId: { type: DataTypes.STRING, unique: true }, // Idempotency
  entityType: DataTypes.STRING,
  entityData: DataTypes.JSONB,
  status: DataTypes.STRING, // 'pending', 'processed', 'failed'
}, { sequelize, modelName: 'sync_record' });

export class User extends Model {
  declare id: string;
  declare email: string | null;
  declare phone: string | null;
  declare phoneVerified: boolean;
  declare passwordHash: string | null;
  declare passwordSalt: string | null;
  declare recoveryCodeHash: string | null;
  declare recoveryCodeSalt: string | null;
  declare authProvider: 'email' | 'google' | 'phone';
  declare googleSubjectId: string | null;
  declare role: 'learner' | 'instructor' | 'admin' | 'researcher';
  declare name: string | null;
  declare avatarUrl: string | null;
  declare title: string | null;
  declare bio: string | null;
  declare expertise: string | null;
  declare institution: string | null;
  declare participantId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
  phone: { type: DataTypes.STRING, unique: true, allowNull: true },
  phoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  passwordHash: { type: DataTypes.STRING, allowNull: true },
  passwordSalt: { type: DataTypes.STRING, allowNull: true },
  recoveryCodeHash: { type: DataTypes.STRING, allowNull: true },
  recoveryCodeSalt: { type: DataTypes.STRING, allowNull: true },
  authProvider: { type: DataTypes.STRING, defaultValue: 'email' },
  googleSubjectId: { type: DataTypes.STRING, unique: true, allowNull: true },
  role: { type: DataTypes.STRING, defaultValue: 'learner' },
  name: { type: DataTypes.STRING, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  expertise: { type: DataTypes.STRING, allowNull: true },
  institution: { type: DataTypes.STRING, allowNull: true },
  participantId: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'user' });

export class PhoneVerification extends Model {
  declare id: string;
  declare phone: string;
  declare codeHash: string;
  declare codeSalt: string;
  declare expiresAt: Date;
  declare attempts: number;
  declare lastSentAt: Date;
  declare verified: boolean;
}
PhoneVerification.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  codeHash: { type: DataTypes.STRING, allowNull: false },
  codeSalt: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastSentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'phone_verification' });

export class LessonProgress extends Model {
  declare id: string;
  declare userId: string;
  declare moduleId: string;
  declare lessonId: string;
  declare completed: boolean;
  declare playbackSeconds: number;
  declare notes: string | null;
  declare lastAccessedAt: Date;
}
LessonProgress.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  lessonId: { type: DataTypes.STRING, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  playbackSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  notes: { type: DataTypes.TEXT, allowNull: true },
  lastAccessedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'lesson_progress' });

export class LessonBookmark extends Model {
  declare id: string;
  declare userId: string;
  declare moduleId: string;
  declare lessonId: string;
  declare timestampSeconds: number;
  declare note: string | null;
}
LessonBookmark.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  lessonId: { type: DataTypes.STRING, allowNull: false },
  timestampSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  note: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'lesson_bookmark' });

export class LessonQuestion extends Model {
  declare id: string;
  declare userId: string;
  declare userName: string;
  declare moduleId: string;
  declare lessonId: string;
  declare question: string;
  declare isAnswered: boolean;
  declare answer: string | null;
  declare answeredBy: string | null;
  declare answeredAt: Date | null;
  declare createdAt: Date;
}
LessonQuestion.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  lessonId: { type: DataTypes.STRING, allowNull: false },
  question: { type: DataTypes.TEXT, allowNull: false },
  isAnswered: { type: DataTypes.BOOLEAN, defaultValue: false },
  answer: { type: DataTypes.TEXT, allowNull: true },
  answeredBy: { type: DataTypes.STRING, allowNull: true },
  answeredAt: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: 'lesson_question' });

export class QuizSubmission extends Model {
  declare id: string;
  declare userId: string;
  declare moduleId: string;
  declare pathwayId: string | null;
  declare score: number;
  declare passed: boolean;
  declare totalQuestions: number;
  declare answers: any;
  declare feedback: any;
  declare createdAt: Date;
}
QuizSubmission.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  moduleId: { type: DataTypes.STRING, allowNull: false },
  pathwayId: { type: DataTypes.STRING, allowNull: true },
  score: { type: DataTypes.INTEGER, allowNull: false },
  passed: { type: DataTypes.BOOLEAN, defaultValue: false },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 5 },
  answers: { type: DataTypes.JSON, allowNull: true },
  feedback: { type: DataTypes.JSON, allowNull: true },
}, { sequelize, modelName: 'quiz_submission' });

export class ProjectSubmission extends Model {
  declare id: string;
  declare userId: string;
  declare projectId: string;
  declare projectType: string;
  declare title: string;
  declare summary: string;
  declare fileUrl: string | null;
  declare fileName: string | null;
  declare fileType: string | null;
  declare fileSize: number | null;
  declare calculatorData: any;
  declare status: 'submitted' | 'under_review' | 'graded' | 'needs_revision';
  declare score: number | null;
  declare rubricScores: any;
  declare instructorFeedback: string | null;
  declare gradedBy: string | null;
  declare gradedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
ProjectSubmission.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  projectId: { type: DataTypes.STRING, allowNull: false },
  projectType: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: true },
  fileName: { type: DataTypes.STRING, allowNull: true },
  fileType: { type: DataTypes.STRING, allowNull: true },
  fileSize: { type: DataTypes.INTEGER, allowNull: true },
  calculatorData: { type: DataTypes.JSON, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'submitted' },
  score: { type: DataTypes.INTEGER, allowNull: true },
  rubricScores: { type: DataTypes.JSON, allowNull: true },
  instructorFeedback: { type: DataTypes.TEXT, allowNull: true },
  gradedBy: { type: DataTypes.STRING, allowNull: true },
  gradedAt: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: 'project_submission' });

export class Certificate extends Model {
  declare id: string;
  declare userId: string;
  declare learnerName: string;
  declare courseTitle: string;
  declare pathwayId: string;
  declare issuingOrg: string;
  declare instructorName: string;
  declare instructorTitle: string;
  declare issueDate: Date;
  declare skills: any;
  declare verificationUrl: string;
  declare distinction: string | null;
  declare createdAt: Date;
}
Certificate.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  learnerName: { type: DataTypes.STRING, allowNull: false },
  courseTitle: { type: DataTypes.STRING, allowNull: false },
  pathwayId: { type: DataTypes.STRING, allowNull: false },
  issuingOrg: { type: DataTypes.STRING, defaultValue: 'Climate Justice Nairobi' },
  instructorName: { type: DataTypes.STRING, defaultValue: 'John Obure' },
  instructorTitle: { type: DataTypes.STRING, defaultValue: 'Climate Activist and Founder' },
  issueDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  skills: { type: DataTypes.JSON, allowNull: true },
  verificationUrl: { type: DataTypes.STRING, allowNull: false },
  distinction: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'certificate' });

export class ImpactAction extends Model {
  declare id: string;
  declare userId: string;
  declare userName: string;
  declare actionType: string;
  declare title: string;
  declare description: string;
  declare quantity: number;
  declare unit: string;
  declare methodology: string;
  declare assumptions: string;
  declare evidenceUrl: string | null;
  declare status: 'self_reported' | 'estimated' | 'verified' | 'rejected';
  declare verifiedBy: string | null;
  declare verifiedAt: Date | null;
  declare createdAt: Date;
}
ImpactAction.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  actionType: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false },
  methodology: { type: DataTypes.TEXT, allowNull: false },
  assumptions: { type: DataTypes.TEXT, allowNull: false },
  evidenceUrl: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'self_reported' },
  verifiedBy: { type: DataTypes.STRING, allowNull: true },
  verifiedAt: { type: DataTypes.DATE, allowNull: true },
}, { sequelize, modelName: 'impact_action' });

export class Notification extends Model {
  declare id: string;
  declare userId: string;
  declare type: string;
  declare title: string;
  declare message: string;
  declare link: string | null;
  declare read: boolean;
  declare createdAt: Date;
}
Notification.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'info' },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: true },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'notification' });

export class SupportTicket extends Model {
  declare id: string;
  declare userId: string | null;
  declare name: string;
  declare email: string;
  declare category: string;
  declare subject: string;
  declare message: string;
  declare status: 'open' | 'in_progress' | 'resolved';
  declare createdAt: Date;
}
SupportTicket.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'general' },
  subject: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'open' },
}, { sequelize, modelName: 'support_ticket' });

export class UserSession extends Model {
  declare token: string;
  declare userId: string;
  declare expiresAt: Date;
  declare lastActive: Date;
}
UserSession.init({
  token: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  lastActive: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { sequelize, modelName: 'user_session' });

// Associations
Participant.hasMany(Consent, { foreignKey: 'participantId', constraints: false });
Participant.hasMany(ModuleProgress, { foreignKey: 'participantId', constraints: false });
Module.hasMany(Lesson, { foreignKey: 'moduleId', constraints: false });
Module.hasMany(ModuleProgress, { foreignKey: 'moduleId', constraints: false });
Assessment.hasMany(Question, { foreignKey: 'assessmentId', constraints: false });
Participant.hasMany(AssessmentResponse, { foreignKey: 'participantId', constraints: false });
Question.hasMany(AssessmentResponse, { foreignKey: 'questionId', constraints: false });
User.hasMany(UserSession, { foreignKey: 'userId', constraints: false });
User.hasMany(ModuleProgress, { foreignKey: 'userId', constraints: false });
User.hasMany(LessonProgress, { foreignKey: 'userId', constraints: false });
User.hasMany(LessonBookmark, { foreignKey: 'userId', constraints: false });
User.hasMany(LessonQuestion, { foreignKey: 'userId', constraints: false });
User.hasMany(QuizSubmission, { foreignKey: 'userId', constraints: false });
User.hasMany(ProjectSubmission, { foreignKey: 'userId', constraints: false });
User.hasMany(Certificate, { foreignKey: 'userId', constraints: false });
User.hasMany(ImpactAction, { foreignKey: 'userId', constraints: false });
User.hasMany(Notification, { foreignKey: 'userId', constraints: false });
User.hasMany(SupportTicket, { foreignKey: 'userId', constraints: false });

export const setupDb = async () => {
  await sequelize.sync();

  // Automatic SQLite column migration if database was created with older schema
  try {
    const [cols] = await sequelize.query('PRAGMA table_info(users);') as [any[], any];
    const colNames = (cols || []).map((c: any) => c.name);

    if (!colNames.includes('phone')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN phone VARCHAR(255);');
    }
    if (!colNames.includes('phoneVerified')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN phoneVerified TINYINT(1) DEFAULT 0;');
    }
    if (!colNames.includes('role')) {
      await sequelize.query("ALTER TABLE users ADD COLUMN role VARCHAR(255) DEFAULT 'learner';");
    }
    if (!colNames.includes('title')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN title VARCHAR(255);');
    }
    if (!colNames.includes('bio')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN bio TEXT;');
    }
    if (!colNames.includes('expertise')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN expertise VARCHAR(255);');
    }
    if (!colNames.includes('institution')) {
      await sequelize.query('ALTER TABLE users ADD COLUMN institution VARCHAR(255);');
    }
  } catch (err) {
    // Non-blocking in test environment
  }
};
