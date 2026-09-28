export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'likert';
  options?: string[];
}

export interface AssessmentData {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export const assessments_en: Record<string, AssessmentData> = {
  baseline: {
    id: 'baseline',
    title: 'Baseline Assessment',
    description: 'Please answer these questions honestly so we can understand your current knowledge before starting the modules.',
    questions: [
      {
        id: 'b1',
        text: 'How would you rate your current understanding of Climate Justice?',
        type: 'likert'
      },
      {
        id: 'b2',
        text: 'Which of the following best describes the Urban Heat Island effect?',
        type: 'multiple-choice',
        options: [
          'Rural areas being hotter than cities',
          'Cities retaining more heat due to concrete and lack of vegetation',
          'A new type of solar panel',
          'I don\'t know'
        ]
      },
      {
        id: 'b3',
        text: 'What is the most common cause of localized flooding in informal settlements?',
        type: 'multiple-choice',
        options: [
          'Rising sea levels',
          'Blocked drainage channels due to solid waste',
          'Melting glaciers',
          'I don\'t know'
        ]
      },
      {
        id: 'b4',
        text: 'I feel confident in my ability to participate in local government climate decisions.',
        type: 'likert'
      }
    ]
  },
  endline: {
    id: 'endline',
    title: 'Endline Assessment',
    description: 'Thank you for completing the curriculum! Please answer these questions to help us measure your learning progress.',
    questions: [
      {
        id: 'e1',
        text: 'How would you rate your current understanding of Climate Justice?',
        type: 'likert'
      },
      {
        id: 'e2',
        text: 'Which of the following best describes the Urban Heat Island effect?',
        type: 'multiple-choice',
        options: [
          'Rural areas being hotter than cities',
          'Cities retaining more heat due to concrete and lack of vegetation',
          'A new type of solar panel',
          'I don\'t know'
        ]
      },
      {
        id: 'e3',
        text: 'What is the most common cause of localized flooding in informal settlements?',
        type: 'multiple-choice',
        options: [
          'Rising sea levels',
          'Blocked drainage channels due to solid waste',
          'Melting glaciers',
          'I don\'t know'
        ]
      },
      {
        id: 'e4',
        text: 'I feel confident in my ability to participate in local government climate decisions.',
        type: 'likert'
      }
    ]
  }
};

export const assessments_sw: Record<string, AssessmentData> = {
  baseline: {
    id: 'baseline',
    title: 'Tathmini ya Awali (Baseline)',
    description: 'Tafadhali jibu maswali haya kwa uaminifu ili tuweze kuelewa uelewa wako wa sasa kabla ya kuanza moduli.',
    questions: [
      {
        id: 'b1',
        text: 'Ungekadiaje uelewa wako wa sasa wa Haki ya Hali ya Hewa?',
        type: 'likert'
      },
      {
        id: 'b2',
        text: 'Ni kipi kati ya vifuatavyo kinaelezea vyema athari ya Kisiwa cha Joto Mjini (Urban Heat Island)?',
        type: 'multiple-choice',
        options: [
          'Maeneo ya vijijini kuwa na joto kuliko miji',
          'Miji kuhifadhi joto zaidi kutokana na saruji na ukosefu wa uoto wa asili',
          'Aina mpya ya paneli ya jua',
          'Sijui'
        ]
      },
      {
        id: 'b3',
        text: 'Ni nini chanzo cha kawaida cha mafuriko ya ndani katika makazi yasiyo rasmi?',
        type: 'multiple-choice',
        options: [
          'Kupanda kwa viwango vya bahari',
          'Mifereji iliyoziba kutokana na taka ngumu',
          'Kuyeyuka kwa theluji',
          'Sijui'
        ]
      },
      {
        id: 'b4',
        text: 'Ninajiamini katika uwezo wangu wa kushiriki katika maamuzi ya hali ya hewa ya serikali ya mitaa.',
        type: 'likert'
      }
    ]
  },
  endline: {
    id: 'endline',
    title: 'Tathmini ya Mwisho (Endline)',
    description: 'Asante kwa kukamilisha mtaala huu! Tafadhali jibu maswali haya ili kutusaidia kupima maendeleo yako ya kujifunza.',
    questions: [
      {
        id: 'e1',
        text: 'Ungekadiaje uelewa wako wa sasa wa Haki ya Hali ya Hewa?',
        type: 'likert'
      },
      {
        id: 'e2',
        text: 'Ni kipi kati ya vifuatavyo kinaelezea vyema athari ya Kisiwa cha Joto Mjini?',
        type: 'multiple-choice',
        options: [
          'Maeneo ya vijijini kuwa na joto kuliko miji',
          'Miji kuhifadhi joto zaidi kutokana na saruji na ukosefu wa uoto wa asili',
          'Aina mpya ya paneli ya jua',
          'Sijui'
        ]
      },
      {
        id: 'e3',
        text: 'Ni nini chanzo cha kawaida cha mafuriko ya ndani katika makazi yasiyo rasmi?',
        type: 'multiple-choice',
        options: [
          'Kupanda kwa viwango vya bahari',
          'Mifereji iliyoziba kutokana na taka ngumu',
          'Kuyeyuka kwa theluji',
          'Sijui'
        ]
      },
      {
        id: 'e4',
        text: 'Ninajiamini katika uwezo wangu wa kushiriki katika maamuzi ya hali ya hewa ya serikali ya mitaa.',
        type: 'likert'
      }
    ]
  }
};

export const assessments = {
  en: assessments_en,
  sw: assessments_sw
};
