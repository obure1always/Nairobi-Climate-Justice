import { describe, it, expect } from 'vitest';
import { modules_en } from './modules.en';
import { modules_sw } from './modules.sw';
import { scenarios } from './scenarios';
import { faqs } from './faqs';
import { glossaryTerms } from './glossary';
import { actionGuides } from './actionGuides';
import { resources, resourceCategories } from './resources';

describe('Comprehensive Content Validation Suite', () => {
  const REQUIRED_MODULE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];

  // 1. Modules and Lessons Count & Structure
  describe('Curriculum Modules & Lessons Integrity', () => {
    it('should have all 7 required modules in both English and Kiswahili', () => {
      expect(modules_en.length).toBe(7);
      expect(modules_sw.length).toBe(7);

      const enIds = modules_en.map(m => m.id);
      const swIds = modules_sw.map(m => m.id);

      expect(enIds).toEqual(REQUIRED_MODULE_IDS);
      expect(swIds).toEqual(REQUIRED_MODULE_IDS);
    });

    it('each module must have at least 6 substantive lessons (total >= 42 lessons)', () => {
      let totalEnLessons = 0;
      let totalSwLessons = 0;

      for (const mod of modules_en) {
        expect(mod.content.length).toBeGreaterThanOrEqual(6);
        totalEnLessons += mod.content.length;
      }

      for (const mod of modules_sw) {
        expect(mod.content.length).toBeGreaterThanOrEqual(6);
        totalSwLessons += mod.content.length;
      }

      expect(totalEnLessons).toBeGreaterThanOrEqual(42);
      expect(totalSwLessons).toBeGreaterThanOrEqual(42);
      expect(totalEnLessons).toBe(totalSwLessons);
    });

    it('every lesson must have complete structural metadata and bilingual parity', () => {
      for (let m = 0; m < modules_en.length; m++) {
        const enMod = modules_en[m];
        const swMod = modules_sw[m];

        expect(enMod.id).toBe(swMod.id);
        expect(enMod.title.length).toBeGreaterThan(3);
        expect(swMod.title.length).toBeGreaterThan(3);
        expect(enMod.description.length).toBeGreaterThan(20);
        expect(swMod.description.length).toBeGreaterThan(20);

        for (let l = 0; l < enMod.content.length; l++) {
          const enLesson = enMod.content[l];
          const swLesson = swMod.content[l];

          expect(enLesson.id).toBe(swLesson.id);
          expect(enLesson.heading.length).toBeGreaterThan(5);
          expect(swLesson.heading.length).toBeGreaterThan(5);

          // Objectives
          expect(enLesson.objectives?.length).toBeGreaterThanOrEqual(2);
          expect(swLesson.objectives?.length).toBeGreaterThanOrEqual(2);

          // Substantive Paragraphs
          expect(enLesson.paragraphs.length).toBeGreaterThanOrEqual(2);
          expect(swLesson.paragraphs.length).toBeGreaterThanOrEqual(2);
          const enWordCount = enLesson.paragraphs.join(' ').split(/\s+/).length;
          const swWordCount = swLesson.paragraphs.join(' ').split(/\s+/).length;
          expect(enWordCount).toBeGreaterThanOrEqual(150);
          expect(swWordCount).toBeGreaterThanOrEqual(150);

          // Practical Nairobi Example
          expect(enLesson.nairobiExample?.length).toBeGreaterThan(15);
          expect(swLesson.nairobiExample?.length).toBeGreaterThan(15);

          // Key Terms
          expect(enLesson.keyTerms?.length).toBeGreaterThanOrEqual(2);
          expect(swLesson.keyTerms?.length).toBeGreaterThanOrEqual(2);

          // Important Takeaways
          expect(enLesson.takeaways?.length).toBeGreaterThanOrEqual(3);
          expect(swLesson.takeaways?.length).toBeGreaterThanOrEqual(3);

          // Practical Reflection Prompt
          expect(enLesson.reflectionQuestion?.length).toBeGreaterThan(15);
          expect(swLesson.reflectionQuestion?.length).toBeGreaterThan(15);

          // Realistic Activity
          expect(enLesson.activity?.length).toBeGreaterThan(15);
          expect(swLesson.activity?.length).toBeGreaterThan(15);

          // Common Misconceptions
          expect(enLesson.misconceptions?.length).toBeGreaterThanOrEqual(1);
          expect(swLesson.misconceptions?.length).toBeGreaterThanOrEqual(1);

          // Verified Sources
          expect(enLesson.sources?.length).toBeGreaterThanOrEqual(1);
        }
      }
    });
  });

  // 2. Quizzes Validation
  describe('Module Quizzes Integrity', () => {
    it('each module must have at least 8 substantive quiz questions (total >= 56 questions)', () => {
      let totalEnQuizzes = 0;
      let totalSwQuizzes = 0;

      for (const mod of modules_en) {
        expect(mod.quiz.length).toBeGreaterThanOrEqual(8);
        totalEnQuizzes += mod.quiz.length;
      }

      for (const mod of modules_sw) {
        expect(mod.quiz.length).toBeGreaterThanOrEqual(8);
        totalSwQuizzes += mod.quiz.length;
      }

      expect(totalEnQuizzes).toBeGreaterThanOrEqual(56);
      expect(totalSwQuizzes).toBeGreaterThanOrEqual(56);
      expect(totalEnQuizzes).toBe(totalSwQuizzes);
    });

    it('every quiz question must have 4 valid answer options and a correct answer in bounds', () => {
      for (let m = 0; m < modules_en.length; m++) {
        const enMod = modules_en[m];
        const swMod = modules_sw[m];

        for (let q = 0; q < enMod.quiz.length; q++) {
          const enQ = enMod.quiz[q];
          const swQ = swMod.quiz[q];

          expect(enQ.id).toBe(swQ.id);
          expect(enQ.question.length).toBeGreaterThan(10);
          expect(swQ.question.length).toBeGreaterThan(10);

          // Exactly 4 plausible options
          expect(enQ.options.length).toBe(4);
          expect(swQ.options.length).toBe(4);

          // Correct answer index in bounds
          expect(enQ.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(enQ.correctAnswer).toBeLessThan(4);
          expect(enQ.correctAnswer).toBe(swQ.correctAnswer);

          // Substantive explanation
          expect(enQ.explanation.length).toBeGreaterThan(15);
          expect(swQ.explanation.length).toBeGreaterThan(15);

          // Lesson and Source reference
          expect(enQ.lessonRef).toBeDefined();
          expect(enQ.source).toBeDefined();
        }
      }
    });
  });

  // 3. Scenario-Based Learning
  describe('Interactive Scenarios Integrity', () => {
    it('must have at least 14 scenario activities across all 7 modules (>= 2 per module)', () => {
      expect(scenarios.length).toBeGreaterThanOrEqual(14);

      for (const modId of REQUIRED_MODULE_IDS) {
        const modScenarios = scenarios.filter(s => s.moduleId === modId);
        expect(modScenarios.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('every scenario must have complete bilingual content, consequences, and reasoning', () => {
      for (const s of scenarios) {
        expect(s.title.en.length).toBeGreaterThan(5);
        expect(s.title.sw.length).toBeGreaterThan(5);
        expect(s.context.en.length).toBeGreaterThan(10);
        expect(s.context.sw.length).toBeGreaterThan(10);
        expect(s.situation.en.length).toBeGreaterThan(30);
        expect(s.situation.sw.length).toBeGreaterThan(30);

        expect(s.options.length).toBeGreaterThanOrEqual(2);
        const hasRecommended = s.options.some(o => o.isRecommended === true);
        expect(hasRecommended).toBe(true);

        for (const opt of s.options) {
          expect(opt.text.en.length).toBeGreaterThan(5);
          expect(opt.text.sw.length).toBeGreaterThan(5);
          expect(opt.consequence.en.length).toBeGreaterThan(15);
          expect(opt.consequence.sw.length).toBeGreaterThan(15);
          expect(opt.reasoning.en.length).toBeGreaterThan(15);
          expect(opt.reasoning.sw.length).toBeGreaterThan(15);
        }

        expect(s.reflection.en.length).toBeGreaterThan(10);
        expect(s.reflection.sw.length).toBeGreaterThan(10);
        expect(s.takeaway.en.length).toBeGreaterThan(10);
        expect(s.takeaway.sw.length).toBeGreaterThan(10);
      }
    });
  });

  // 4. Bilingual FAQ Knowledge Base
  describe('Bilingual FAQ Knowledge Base Integrity', () => {
    it('must contain at least 70 substantive FAQ entries (>= 10 per module)', () => {
      expect(faqs.length).toBeGreaterThanOrEqual(70);

      for (const modId of REQUIRED_MODULE_IDS) {
        const modFaqs = faqs.filter(f => f.moduleId === modId);
        expect(modFaqs.length).toBeGreaterThanOrEqual(10);
      }
    });

    it('every FAQ entry must have complete bilingual question, answer, and search keywords', () => {
      const seenIds = new Set<string>();

      for (const faq of faqs) {
        expect(seenIds.has(faq.id)).toBe(false);
        seenIds.add(faq.id);

        expect(faq.question.en.length).toBeGreaterThan(10);
        expect(faq.question.sw.length).toBeGreaterThan(10);
        expect(faq.answer.en.length).toBeGreaterThan(50);
        expect(faq.answer.sw.length).toBeGreaterThan(50);

        expect(faq.keywords.length).toBeGreaterThanOrEqual(4);
        expect(faq.source.length).toBeGreaterThan(3);
        expect(REQUIRED_MODULE_IDS).toContain(faq.moduleId);
      }
    });
  });

  // 5. Bilingual Climate Glossary
  describe('Bilingual Climate Glossary Integrity', () => {
    it('must contain at least 70 distinct terms across the curriculum', () => {
      expect(glossaryTerms.length).toBeGreaterThanOrEqual(70);
    });

    it('every glossary entry must have bilingual term, definition, and practical example', () => {
      const seenIds = new Set<string>();

      for (const term of glossaryTerms) {
        expect(seenIds.has(term.id)).toBe(false);
        seenIds.add(term.id);

        expect(term.term.en.length).toBeGreaterThan(1);
        expect(term.term.sw.length).toBeGreaterThan(1);
        expect(term.definition.en.length).toBeGreaterThan(20);
        expect(term.definition.sw.length).toBeGreaterThan(20);
        expect(term.example.en.length).toBeGreaterThan(10);
        expect(term.example.sw.length).toBeGreaterThan(10);
        expect(REQUIRED_MODULE_IDS).toContain(term.moduleId);
      }
    });
  });

  // 6. Community Action Guides
  describe('Community Action Guides Integrity', () => {
    it('must have at least 7 practical action guides (1 per module)', () => {
      expect(actionGuides.length).toBeGreaterThanOrEqual(7);

      for (const modId of REQUIRED_MODULE_IDS) {
        const guide = actionGuides.find(g => g.moduleId === modId);
        expect(guide).toBeDefined();
      }
    });

    it('every action guide must have step-by-step procedures and materials', () => {
      for (const guide of actionGuides) {
        expect(guide.title.en.length).toBeGreaterThan(5);
        expect(guide.title.sw.length).toBeGreaterThan(5);
        expect(guide.purpose.en.length).toBeGreaterThan(20);
        expect(guide.disclaimer.en.length).toBeGreaterThan(20);
        expect(guide.materialsNeeded.en.length).toBeGreaterThanOrEqual(2);
        expect(guide.materialsNeeded.sw.length).toBeGreaterThanOrEqual(2);
        expect(guide.steps.length).toBeGreaterThanOrEqual(4);

        for (const step of guide.steps) {
          expect(step.stepNumber).toBeGreaterThan(0);
          expect(step.title.en.length).toBeGreaterThan(3);
          expect(step.title.sw.length).toBeGreaterThan(3);
          expect(step.action.en.length).toBeGreaterThan(15);
          expect(step.action.sw.length).toBeGreaterThan(15);
          expect(step.tips.en.length).toBeGreaterThan(10);
          expect(step.tips.sw.length).toBeGreaterThan(10);
        }
      }
    });
  });

  // 7. Verified Resource Directory
  describe('Verified Resource Directory Integrity', () => {
    it('must have at least 15 verified, distinct resources across 9 categories', () => {
      expect(resources.length).toBeGreaterThanOrEqual(15);
      expect(resourceCategories.length).toBe(9);
    });

    it('every resource must have a genuine, non-placeholder destination URL and metadata', () => {
      for (const res of resources) {
        expect(res.title.length).toBeGreaterThan(5);
        expect(res.description.length).toBeGreaterThan(20);
        expect(res.source.length).toBeGreaterThan(2);

        // No placeholder URLs
        expect(res.url).toMatch(/^https:\/\//);
        expect(res.url).not.toContain('localhost');
        expect(res.url).not.toContain('#');
        expect(res.url).not.toContain('example.com');

        expect(res.whyUseful.en.length).toBeGreaterThan(15);
        expect(res.whyUseful.sw.length).toBeGreaterThan(15);
        expect(res.dateOrVersion.length).toBeGreaterThan(3);
      }
    });
  });

  // 8. Quality & Anti-Placeholder Guardrails
  describe('Anti-Placeholder & Integrity Checks', () => {
    it('curriculum content must contain no TODO, Lorem Ipsum, or generic repeated text', () => {
      const checkForPlaceholders = (text: string, context: string) => {
        const forbidden = ['TODO', 'Lorem ipsum', 'placeholder', 'TBD', 'coming soon', 'asdf'];
        for (const f of forbidden) {
          expect(text.toLowerCase().includes(f.toLowerCase()), `Found forbidden string "${f}" in ${context}`).toBe(false);
        }
      };

      // Check all lessons
      for (const mod of modules_en) {
        for (const l of mod.content) {
          checkForPlaceholders(l.heading, `EN lesson heading ${l.id}`);
          checkForPlaceholders(l.paragraphs.join(' '), `EN lesson paragraphs ${l.id}`);
        }
      }

      for (const mod of modules_sw) {
        for (const l of mod.content) {
          checkForPlaceholders(l.heading, `SW lesson heading ${l.id}`);
          checkForPlaceholders(l.paragraphs.join(' '), `SW lesson paragraphs ${l.id}`);
        }
      }

      // Check all FAQs
      for (const faq of faqs) {
        checkForPlaceholders(faq.answer.en, `EN FAQ ${faq.id}`);
        checkForPlaceholders(faq.answer.sw, `SW FAQ ${faq.id}`);
      }

      // Check all Glossary
      for (const term of glossaryTerms) {
        checkForPlaceholders(term.definition.en, `EN term ${term.id}`);
        checkForPlaceholders(term.definition.sw, `SW term ${term.id}`);
      }
    });
  });
});
