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
  declare passwordHash: string | null;
  declare passwordSalt: string | null;
  declare recoveryCodeHash: string | null;
  declare recoveryCodeSalt: string | null;
  declare authProvider: 'email' | 'google';
  declare googleSubjectId: string | null;
  declare role: 'learner' | 'researcher' | 'admin';
  declare name: string | null;
  declare avatarUrl: string | null;
  declare participantId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: true },
  passwordHash: { type: DataTypes.STRING, allowNull: true },
  passwordSalt: { type: DataTypes.STRING, allowNull: true },
  recoveryCodeHash: { type: DataTypes.STRING, allowNull: true },
  recoveryCodeSalt: { type: DataTypes.STRING, allowNull: true },
  authProvider: { type: DataTypes.STRING, defaultValue: 'email' },
  googleSubjectId: { type: DataTypes.STRING, unique: true, allowNull: true },
  role: { type: DataTypes.STRING, defaultValue: 'learner' },
  name: { type: DataTypes.STRING, allowNull: true },
  avatarUrl: { type: DataTypes.STRING, allowNull: true },
  participantId: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'user' });

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

export const setupDb = async () => {
  await sequelize.sync();
};
