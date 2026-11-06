import crypto from 'crypto';
import { Transaction } from 'sequelize';
import {
  Certificate,
  CertificateDelivery,
  LessonProgress,
  ModuleProgress,
  QuizSubmission,
  User
} from '../models/index';
import { COURSE_MODULES } from './courseCatalog';

export const COURSE_ID = 'nairobi-climate-justice';
export const COURSE_TITLE = 'Nairobi Climate Justice';
export const REQUIRED_QUIZ_PERCENTAGE = 70;

export const findCourseModule = (moduleId: string) =>
  COURSE_MODULES.find(module => module.id === moduleId);

export const gradeCourseQuiz = (
  moduleId: string,
  answers: unknown
): { score: number; totalQuestions: number; passed: boolean } | null => {
  const module = findCourseModule(moduleId);
  if (!module || !module.questions.length ||
      !answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return null;
  }

  const answerMap = answers as Record<string, unknown>;
  const questionIds = new Set(module.questions.map(question => question.id));
  if (Object.keys(answerMap).length !== questionIds.size ||
      Object.keys(answerMap).some(id => !questionIds.has(id))) {
    return null;
  }

  let score = 0;
  for (const question of module.questions) {
    const answer = answerMap[question.id];
    if (!Number.isInteger(answer) || Number(answer) < 0 || Number(answer) >= question.optionCount) {
      return null;
    }
    if (Number(answer) === question.correctAnswer) score++;
  }

  const passed = score / module.questions.length >= REQUIRED_QUIZ_PERCENTAGE / 100;
  return { score, totalQuestions: module.questions.length, passed };
};

export const updateModuleCompletion = async (
  userId: string,
  moduleId: string,
  transaction?: Transaction
) => {
  const module = findCourseModule(moduleId);
  if (!module) return null;
  const completedLessons = await LessonProgress.count({
    where: { userId, moduleId, completed: true },
    transaction
  });
  const passedQuiz = await QuizSubmission.count({
    where: { userId, moduleId, passed: true },
    transaction
  });
  const complete = completedLessons >= module.lessons.length && passedQuiz > 0;
  const [record] = await ModuleProgress.findOrCreate({
    where: { userId, moduleId },
    defaults: {
      userId,
      participantId: `USER-${userId.substring(0, 8)}`,
      moduleId,
      completedLessons,
      completed: complete,
      lastAccessed: new Date()
    },
    transaction
  });
  record.completedLessons = completedLessons;
  record.completed = complete;
  record.lastAccessed = new Date();
  await record.save({ transaction });
  return record;
};

const ensureCertificateDelivery = async (
  certificate: Certificate,
  user: User,
  transaction?: Transaction
) => {
  const verifiedEmail = user.emailVerified && user.email ? user.email : null;
  const [delivery, created] = await CertificateDelivery.findOrCreate({
    where: { certificateId: certificate.id },
    defaults: {
      certificateId: certificate.id,
      userId: user.id,
      recipientEmail: verifiedEmail,
      status: verifiedEmail ? 'pending' : 'blocked',
      attemptCount: 0,
      lastAttemptAt: null,
      sentAt: null,
      lastError: verifiedEmail ? null : 'A verified account email address is required.'
    },
    transaction
  });

  if (!created && delivery.status === 'blocked' && verifiedEmail) {
    delivery.recipientEmail = verifiedEmail;
    delivery.status = 'pending';
    delivery.lastError = null;
    await delivery.save({ transaction });
  }
  return delivery;
};

export const issueCourseCertificateIfComplete = async (
  userId: string,
  transaction?: Transaction
) => {
  const user = await User.findByPk(userId, { transaction });
  if (!user) throw new Error('Cannot issue a course certificate for an unknown learner');

  const existing = await Certificate.findOne({
    where: { userId, pathwayId: COURSE_ID },
    transaction
  });
  if (existing) {
    await ensureCertificateDelivery(existing, user, transaction);
    return existing;
  }

  for (const module of COURSE_MODULES) {
    const completedLessons = await LessonProgress.count({
      where: { userId, moduleId: module.id, completed: true },
      transaction
    });
    const passedQuiz = await QuizSubmission.count({
      where: { userId, moduleId: module.id, passed: true },
      transaction
    });
    if (completedLessons < module.lessons.length || passedQuiz === 0) return null;
  }

  const id = `CJN-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  const certificate = await Certificate.create({
    id,
    userId,
    learnerName: user.name,
    courseTitle: COURSE_TITLE,
    pathwayId: COURSE_ID,
    issuingOrg: 'Climate Justice Nairobi',
    instructorName: 'John Obure',
    instructorTitle: 'Climate Activist and Founder',
    issueDate: new Date(),
    skills: COURSE_MODULES.map(module => module.title),
    verificationUrl: `/api/v1/certificates/verify/${id}`
  }, { transaction });
  await ensureCertificateDelivery(certificate, user, transaction);
  return certificate;
};
