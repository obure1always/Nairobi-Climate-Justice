import { faqs, type FAQItem } from '../data/faqs';
import { modules_en } from '../data/modules.en';
import { modules_sw } from '../data/modules.sw';
import { glossaryTerms } from '../data/glossary';

export interface AssistantQueryResult {
  found: boolean;
  type: 'faq' | 'lesson' | 'glossary' | 'fallback';
  question?: string;
  answer: string;
  moduleId?: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonHeading?: string;
  source?: string;
  relatedSuggestions: string[];
  actionGuideRef?: string;
  confidence: 'high' | 'medium' | 'low';
}

// Stopwords in English and Kiswahili to remove noise
const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'about',
  'what', 'how', 'why', 'when', 'where', 'which', 'who', 'can', 'does', 'do', 'i', 'my', 'you', 'your', 'we', 'our',
  'ya', 'wa', 'kwa', 'na', 'au', 'ni', 'la', 'cha', 'vya', 'za', 'katika', 'nini', 'vipi', 'kwa nini', 'lini', 'wapi',
  'gani', 'je', 'mimi', 'yangu', 'yake', 'yetu', 'hali', 'kitu'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

export function searchClimateBuddy(query: string, lang: 'en' | 'sw' = 'en'): AssistantQueryResult {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return {
      found: false,
      type: 'fallback',
      answer: lang === 'sw'
        ? 'Tafadhali andika swali kuhusu tabianchi, mafuriko, joto kali, usalama wa maji, haki ya hali ya hewa, au ushiriki wa umma.'
        : 'Please ask a question about climate risk, flooding, heat, water safety, climate justice, green claims, or public participation.',
      relatedSuggestions: lang === 'sw'
        ? [
            'Mafuriko ya mjini yanatokeaje?',
            'Kipimo sahihi cha kutibu maji kwa klorini?',
            'Ni nini upotoshaji wa mazingira (greenwashing)?',
            'Haki zangu chini ya Kifungu cha 42 cha Katiba?'
          ]
        : [
            'How does urban flooding happen in Nairobi?',
            'What is the correct chlorine dosage for water?',
            'How can I spot greenwashing in advertisements?',
            'What are my rights under Article 42 of the Constitution?'
          ],
      confidence: 'low'
    };
  }

  const queryTokens = tokenize(cleanQuery);
  const activeModules = lang === 'sw' ? modules_sw : modules_en;

  // 1. Search FAQs
  let bestFaq: FAQItem | null = null;
  let bestFaqScore = 0;

  for (const faq of faqs) {
    let score = 0;
    const qText = (faq.question[lang] || '').toLowerCase();
    const ansText = (faq.answer[lang] || '').toLowerCase();

    // Exact phrase match
    if (qText.includes(cleanQuery)) {
      score += 40;
    }

    // Keyword match
    for (const kw of faq.keywords) {
      const kwLower = kw.toLowerCase();
      if (cleanQuery.includes(kwLower)) {
        score += 15;
      }
      for (const token of queryTokens) {
        if (kwLower.includes(token) || token.includes(kwLower)) {
          score += 10;
        }
      }
    }

    // Question token overlap
    for (const token of queryTokens) {
      if (qText.includes(token)) score += 6;
      if (ansText.includes(token)) score += 2;
    }

    if (score > bestFaqScore) {
      bestFaqScore = score;
      bestFaq = faq;
    }
  }

  // 2. Search Glossary
  let bestGlossaryTerm: typeof glossaryTerms[0] | null = null;
  let bestGlossaryScore = 0;

  for (const term of glossaryTerms) {
    let score = 0;
    const termText = (term.term[lang] || '').toLowerCase();
    const defText = (term.definition[lang] || '').toLowerCase();

    if (cleanQuery === termText || cleanQuery.includes(termText) || termText.includes(cleanQuery)) {
      score += 35;
    }

    for (const token of queryTokens) {
      if (termText.includes(token)) score += 8;
      if (defText.includes(token)) score += 2;
    }

    if (score > bestGlossaryScore) {
      bestGlossaryScore = score;
      bestGlossaryTerm = term;
    }
  }

  // 3. Search Curriculum Lessons
  let bestLesson: {
    moduleId: string;
    moduleTitle: string;
    lessonId: string;
    heading: string;
    matchedParagraph: string;
    source?: string;
  } | null = null;
  let bestLessonScore = 0;

  for (const mod of activeModules) {
    for (const lesson of mod.content) {
      let score = 0;
      const headingText = (lesson.heading || '').toLowerCase();

      if (headingText.includes(cleanQuery)) {
        score += 25;
      }

      for (const token of queryTokens) {
        if (headingText.includes(token)) score += 5;
      }

      let bestPara = lesson.paragraphs[0] || '';
      for (const para of lesson.paragraphs) {
        let paraScore = 0;
        const pLower = para.toLowerCase();
        for (const token of queryTokens) {
          if (pLower.includes(token)) paraScore += 3;
        }
        if (paraScore > 0 && paraScore > score) {
          score += paraScore;
          bestPara = para;
        }
      }

      if (score > bestLessonScore) {
        bestLessonScore = score;
        bestLesson = {
          moduleId: mod.id,
          moduleTitle: mod.title,
          lessonId: lesson.id,
          heading: lesson.heading,
          matchedParagraph: bestPara,
          source: lesson.sources?.[0]
        };
      }
    }
  }

  // Determine Best Result
  if (bestFaq && bestFaqScore >= 18) {
    const matchedModule = activeModules.find(m => m.id === bestFaq!.moduleId);
    const relatedSuggestions = (bestFaq.relatedQuestionIds || [])
      .map(id => faqs.find(f => f.id === id))
      .filter((f): f is FAQItem => !!f)
      .map(f => f.question[lang]);

    return {
      found: true,
      type: 'faq',
      question: bestFaq.question[lang],
      answer: bestFaq.answer[lang],
      moduleId: bestFaq.moduleId,
      moduleTitle: matchedModule?.title,
      lessonId: bestFaq.lessonId,
      source: bestFaq.source,
      actionGuideRef: bestFaq.actionGuideRef,
      relatedSuggestions: relatedSuggestions.length > 0
        ? relatedSuggestions
        : [
            lang === 'sw' ? 'Mbinu za kupunguza joto nyumbani?' : 'Low-cost household heat reduction?',
            lang === 'sw' ? 'Jinsi ya kuandaa mfuko wa dharura wa Go-Bag?' : 'How to pack an emergency Go-Bag?'
          ],
      confidence: bestFaqScore >= 35 ? 'high' : 'medium'
    };
  }

  if (bestGlossaryTerm && bestGlossaryScore >= 20) {
    const matchedModule = activeModules.find(m => m.id === bestGlossaryTerm!.moduleId);
    const relatedFaqs = faqs.filter(f => f.moduleId === bestGlossaryTerm!.moduleId).slice(0, 2);

    return {
      found: true,
      type: 'glossary',
      question: bestGlossaryTerm.term[lang],
      answer: `${bestGlossaryTerm.definition[lang]} (Mfano/Example: ${bestGlossaryTerm.example[lang]})`,
      moduleId: bestGlossaryTerm.moduleId,
      moduleTitle: matchedModule?.title,
      source: 'Climate Justice Nairobi Glossary',
      relatedSuggestions: relatedFaqs.map(f => f.question[lang]),
      confidence: bestGlossaryScore >= 30 ? 'high' : 'medium'
    };
  }

  if (bestLesson && bestLessonScore >= 15) {
    return {
      found: true,
      type: 'lesson',
      question: bestLesson.heading,
      answer: bestLesson.matchedParagraph,
      moduleId: bestLesson.moduleId,
      moduleTitle: bestLesson.moduleTitle,
      lessonId: bestLesson.lessonId,
      lessonHeading: bestLesson.heading,
      source: bestLesson.source || 'Curriculum Lesson',
      relatedSuggestions: [
        lang === 'sw' ? 'Soma somo kamili kwenye mtaala' : 'Read full curriculum lesson',
        lang === 'sw' ? 'Kagua vitendo vya jamii' : 'Explore action guides'
      ],
      confidence: 'medium'
    };
  }

  // Honest Fallback (No hallucination, fully grounded)
  return {
    found: false,
    type: 'fallback',
    answer: lang === 'sw'
      ? `Sikupata jibu la moja kwa moja la kifungu hicho kwenye mtaala wa ndani. Ukiwa nje ya mtandao (offline), Climate Buddy anatafuta ndani ya moduli 7 za Haki ya Tabianchi, kamusi, na miongozo ya vitendo. Ukiwa mtandaoni, anaunganishwa na akili bandia ya mtandaoni kwa majadiliano ya kina! Jaribu kuuliza kuhusu mafuriko, joto la mabati, kutibu maji, Kifungu cha 42, au upotoshaji wa mazingira.`
      : `I could not find an exact match for that phrase in the local offline curriculum. In offline mode, Climate Buddy retrieves verified facts directly from the 7 Nairobi Climate Justice modules, glossary, and community action guides. When online, Climate Buddy connects to the online AI engine for deeper exploration! Try searching for specific topics like flooding, mabati heat, water chlorination, Article 42, or greenwashing.`,
    relatedSuggestions: lang === 'sw'
      ? [
          'Hatari ya hali ya hewa Nairobi (Moduli 1)',
          'Kujiandaa na mafuriko ya ghafla (Moduli 2)',
          'Joto na afya mitaani (Moduli 3)',
          'Kutibu maji na kuzuia magonjwa (Moduli 4)',
          'Haki ya hali ya hewa na usawa (Moduli 5)',
          'Kugundua matangazo ya greenwashing (Moduli 6)',
          'Ushiriki salama wa kiraia (Moduli 7)'
        ]
      : [
          'Nairobi climate risk and heat islands (Module 1)',
          'Urban flood readiness and Go-Bags (Module 2)',
          'Heat exhaustion and passive cooling (Module 3)',
          'Water chlorination and cholera prevention (Module 4)',
          'Climate justice and locally led adaptation (Module 5)',
          'Greenwashing and eco-labels (Module 6)',
          'Constitutional rights and memorandums (Module 7)'
        ],
    confidence: 'low'
  };
}
