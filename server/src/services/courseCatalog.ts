export interface CourseQuestionRule {
  id: string;
  correctAnswer: number;
  optionCount: number;
}

export interface CourseModuleRule {
  id: string;
  title: string;
  lessons: string[];
  questions: CourseQuestionRule[];
}

const moduleTitles = [
  'Nairobi Climate Risk',
  'Urban Flooding',
  'Heat & Health',
  'Water Stress & Disease Prevention',
  'Climate Justice',
  'Green Claims',
  'Safe Civic Participation'
];

const questionKeys = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1]
];

export const COURSE_MODULES: CourseModuleRule[] = moduleTitles.map((title, moduleIndex) => {
  const moduleNumber = moduleIndex + 1;
  return {
    id: `m${moduleNumber}`,
    title,
    lessons: Array.from({ length: 6 }, (_value, lessonIndex) => `m${moduleNumber}-l${lessonIndex + 1}`),
    questions: questionKeys[moduleIndex].map((correctAnswer, questionIndex) => ({
      id: `m${moduleNumber}-q${questionIndex + 1}`,
      correctAnswer,
      optionCount: 4
    }))
  };
});
