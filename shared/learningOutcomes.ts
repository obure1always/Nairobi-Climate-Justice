// Versioned wording shared by the form and the server. Correct answers stay on the server.
export const OUTCOMES_VERSION = 'ncj-outcomes-1';
export type OutcomeLanguage = 'en' | 'sw';
export type OutcomePhase = 'baseline' | 'endline';
export interface OutcomeQuestion {
  id: string;
  domain: 'adaptation' | 'justice' | 'information';
  text: Record<OutcomeLanguage, string>;
  options: Record<OutcomeLanguage, string[]>;
}

export const KNOWLEDGE_QUESTIONS: OutcomeQuestion[] = [
  {
    id: 'heat', domain: 'adaptation',
    text: { en: 'Why can a neighbourhood with many concrete surfaces and few trees become hotter?', sw: 'Kwa nini eneo lenye saruji nyingi na miti michache linaweza kuwa na joto zaidi?' },
    options: {
      en: ['Concrete always cools the air.', 'Trees are the main source of heat.', 'Built surfaces retain heat, and there is less shade and cooling from plants.', 'I do not know.'],
      sw: ['Saruji hupunguza joto la hewa kila wakati.', 'Miti ndiyo chanzo kikuu cha joto.', 'Majengo na barabara huhifadhi joto, na kuna kivuli na ubaridi kidogo kutoka kwa mimea.', 'Sijui.']
    }
  },
  {
    id: 'drainage', domain: 'adaptation',
    text: { en: 'During heavy rain, what can waste blocking a drainage channel do?', sw: 'Wakati wa mvua kubwa, taka zinazoziba mfereji zinaweza kufanya nini?' },
    options: {
      en: ['Prevent all flooding nearby.', 'Slow water flow and increase local flooding.', 'Stop rain from falling.', 'I do not know.'],
      sw: ['Kuzuia mafuriko yote karibu.', 'Kupunguza mtiririko wa maji na kuongeza mafuriko katika eneo hilo.', 'Kuzuia mvua isinyeshe.', 'Sijui.']
    }
  },
  {
    id: 'adaptation', domain: 'adaptation',
    text: { en: 'Which action is mainly climate adaptation: preparing for climate impacts?', sw: 'Ni hatua ipi hasa ni ya kukabiliana na athari za mabadiliko ya tabianchi?' },
    options: {
      en: ['Preparing a household flood-response plan.', 'Reducing emissions from electricity generation.', 'Measuring a company’s carbon emissions.', 'I do not know.'],
      sw: ['Kuandaa mpango wa kaya wa kukabiliana na mafuriko.', 'Kupunguza uzalishaji wa gesi chafu katika kuzalisha umeme.', 'Kupima gesi chafu zinazotolewa na kampuni.', 'Sijui.']
    }
  },
  {
    id: 'preparedness', domain: 'adaptation',
    text: { en: 'Before seasonal flooding, which is the most useful preparedness step?', sw: 'Kabla ya msimu wa mafuriko, ni hatua ipi ya maandalizi yenye manufaa zaidi?' },
    options: {
      en: ['Wait until floodwater enters the home before planning.', 'Assume that every social-media warning is accurate.', 'Identify safer routes, trusted warnings and a household contact plan.', 'I do not know.'],
      sw: ['Kusubiri maji ya mafuriko yaingie nyumbani kabla ya kupanga.', 'Kudhani kila onyo kwenye mitandao ya kijamii ni sahihi.', 'Kutambua njia salama, maonyo ya kuaminika na mpango wa kuwasiliana wa kaya.', 'Sijui.']
    }
  },
  {
    id: 'fairness', domain: 'justice',
    text: { en: 'A flood-protection project can serve only part of a community. What should guide a fair decision?', sw: 'Mradi wa kinga dhidi ya mafuriko unaweza kuhudumia sehemu tu ya jamii. Ni nini kinapaswa kuongoza uamuzi wa haki?' },
    options: {
      en: ['Serve only people with the most political influence.', 'Consider who faces the greatest risk and involve affected groups.', 'Exclude residents who cannot pay.', 'I do not know.'],
      sw: ['Kuhudumia tu walio na ushawishi mkubwa wa kisiasa.', 'Kuzingatia walio katika hatari zaidi na kuwashirikisha walioathiriwa.', 'Kuwatenga wakazi wasioweza kulipa.', 'Sijui.']
    }
  },
  {
    id: 'participation', domain: 'justice',
    text: { en: 'What is a responsible way for young people to raise a local climate concern?', sw: 'Ni njia ipi ya kuwajibika kwa vijana kuwasilisha tatizo la tabianchi katika eneo lao?' },
    options: {
      en: ['Gather accurate evidence and use an appropriate community or official channel.', 'Publish neighbours’ private details to attract attention.', 'Share an unverified accusation as a fact.', 'I do not know.'],
      sw: ['Kukusanya ushahidi sahihi na kutumia njia inayofaa ya jamii au mamlaka.', 'Kuchapisha taarifa binafsi za majirani ili kuvutia watu.', 'Kusambaza tuhuma ambazo hazijahakikiwa kama ukweli.', 'Sijui.']
    }
  },
  {
    id: 'evidence', domain: 'information',
    text: { en: 'A company says its product is “climate friendly”. Which information best helps you assess the claim?', sw: 'Kampuni inasema bidhaa yake ni “rafiki kwa tabianchi”. Ni taarifa ipi inayosaidia zaidi kutathmini dai hilo?' },
    options: {
      en: ['A green label without an explanation.', 'The number of times the advert was shared.', 'Dated, checkable evidence explaining what was measured and compared.', 'I do not know.'],
      sw: ['Lebo ya kijani isiyo na maelezo.', 'Idadi ya mara tangazo liliposambazwa.', 'Ushahidi wenye tarehe unaoweza kuhakikiwa, ukieleza kilichopimwa na kulinganishwa.', 'Sijui.']
    }
  },
  {
    id: 'maladaptation', domain: 'information',
    text: { en: 'A drainage project protects one street but sends more floodwater towards another vulnerable neighbourhood. What is the main concern?', sw: 'Mradi wa mifereji unalinda barabara moja lakini unaelekeza maji mengi zaidi ya mafuriko kwenye eneo jingine lililo hatarini. Tatizo kuu ni lipi?' },
    options: {
      en: ['Any project protecting one street is automatically fair.', 'The project may transfer risk and increase other people’s vulnerability.', 'The project has eliminated climate risk everywhere.', 'I do not know.'],
      sw: ['Mradi wowote unaolinda barabara moja una haki moja kwa moja.', 'Mradi unaweza kuhamisha hatari na kuongeza udhaifu wa watu wengine.', 'Mradi umeondoa hatari ya tabianchi kila mahali.', 'Sijui.']
    }
  }
];

export const CONFIDENCE_ITEMS = [
  { id: 'respond', en: 'Identify a local climate risk and choose a suitable response.', sw: 'Kutambua hatari ya tabianchi katika eneo langu na kuchagua hatua inayofaa.' },
  { id: 'verify', en: 'Check whether a climate claim is supported by reliable evidence.', sw: 'Kuhakiki kama dai kuhusu tabianchi linaungwa mkono na ushahidi wa kuaminika.' },
  { id: 'explain', en: 'Explain how a climate decision may affect different groups fairly or unfairly.', sw: 'Kueleza jinsi uamuzi kuhusu tabianchi unavyoweza kuathiri makundi mbalimbali kwa haki au bila haki.' },
  { id: 'raise', en: 'Raise a climate concern through a safe, appropriate community or official channel.', sw: 'Kuwasilisha tatizo la tabianchi kwa njia salama na inayofaa ya jamii au mamlaka.' }
];

export const CONFIDENCE_LABELS = {
  en: ['Not at all confident', 'Slightly confident', 'Moderately confident', 'Very confident', 'Completely confident'],
  sw: ['Sina ujasiri kabisa', 'Nina ujasiri kidogo', 'Nina ujasiri wa wastani', 'Nina ujasiri mkubwa', 'Nina ujasiri kamili']
};
export const INTENTION_LABELS = {
  en: ['Very unlikely', 'Unlikely', 'Neither likely nor unlikely', 'Likely', 'Very likely'],
  sw: ['Haiwezekani kabisa', 'Haiwezekani', 'Sina uhakika', 'Inawezekana', 'Inawezekana sana']
};
export const INTENTION_TEXT = {
  en: 'How likely are you to take one safe, practical climate action in the next 30 days, such as joining a community activity or raising a local concern?',
  sw: 'Kuna uwezekano gani wa kuchukua hatua moja salama ya vitendo kuhusu tabianchi katika siku 30 zijazo, kama kushiriki shughuli ya jamii au kuwasilisha tatizo la eneo lako?'
};

export interface OutcomeSubmission {
  instrumentVersion: typeof OUTCOMES_VERSION;
  clientSubmissionId: string;
  phase: OutcomePhase;
  language: OutcomeLanguage;
  consent: true;
  notStarted?: true;
  knowledge: Record<string, number>;
  confidence: number[];
  intention: number;
  recalledConfidence?: number[];
  recalledIntention?: number;
  comment?: string;
}
export interface OutcomeScores {
  knowledgeCorrect: number;
  knowledgePercent: number;
  justicePercent: number;
  confidenceMean: number;
  intention: number;
}
export interface OutcomeStatus {
  instrumentVersion: string;
  status: 'baseline_available' | 'learning_in_progress' | 'baseline_saved' | 'endline_available' | 'submitted';
  hasBaseline: boolean;
  courseComplete: boolean;
  baseline: OutcomeScores | null;
  endline: OutcomeScores | null;
}

export interface OutcomeMetric {
  id: 'knowledge' | 'justice' | 'confidence' | 'intention';
  label: string;
  scale: string;
  before: number | null;
  after: number | null;
  change: number | null;
  n: number;
}
export interface OutcomeSummary {
  instrumentVersion: string;
  generatedAt: string;
  counts: {
    learnersResponded: number;
    baselineResponses: number;
    endlineResponses: number;
    matchedPairs: number;
    baselineOnly: number;
    endlineOnly: number;
    languageChangedPairs: number;
    recalledResponses: number;
  };
  metrics: OutcomeMetric[];
  knowledgeChange: { improved: number; unchanged: number; lower: number };
  endlineOnly: { knowledgePercent: number | null; confidenceMean: number | null; intention: number | null };
  recalled: { confidenceBefore: number | null; confidenceAfter: number | null; confidenceChange: number | null; intentionBefore: number | null; intentionAfter: number | null; intentionChange: number | null };
  itemResults: { id: string; label: string; before: number | null; after: number | null; change: number | null; scale: string; n: number }[];
  notes: string[];
}
