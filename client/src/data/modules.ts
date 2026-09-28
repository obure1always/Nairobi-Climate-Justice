export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModuleData {
  id: string;
  title: string;
  description: string;
  image: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
  quiz: QuizQuestion[];
}

export const modules_en: ModuleData[] = [
  {
    id: 'm1',
    title: 'Nairobi Climate Risk',
    description: 'Understand the unique climate challenges facing our city.',
    image: '/images/nairobi_climate_risk_1790629624713.jpg',
    content: [
      {
        heading: 'The Urban Heat Island Effect',
        paragraphs: [
          'Nairobi is experiencing a phenomenon known as the Urban Heat Island (UHI) effect. Concrete and asphalt absorb heat, making the city significantly warmer than surrounding rural areas.',
          'This affects marginalized communities most, as informal settlements often lack green spaces and use heat-absorbing materials like corrugated iron sheets.'
        ]
      },
      {
        heading: 'Changing Weather Patterns',
        paragraphs: [
          'We are seeing more erratic rainfall. The "long rains" (March-May) are becoming less predictable, while extreme rainfall events are increasing in intensity.',
          'These rapid changes strain our city\'s infrastructure and threaten food security in local markets.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'What is the Urban Heat Island effect?',
        options: [
          'When an island gets too hot',
          'When urban areas are warmer than surrounding rural areas due to human activities and infrastructure',
          'A new weather system in Nairobi',
          'When cities plant too many trees'
        ],
        correctAnswer: 1,
        explanation: 'The UHI effect happens because concrete and asphalt absorb and retain heat more than natural landscapes.'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Urban Flooding',
    description: 'Learn how to navigate and mitigate flooding risks in informal settlements.',
    image: '/images/urban_flooding_1790629636632.jpg',
    content: [
      {
        heading: 'Why Does Nairobi Flood?',
        paragraphs: [
          'Rapid urbanization without adequate drainage infrastructure leads to severe urban flooding during heavy rains.',
          'Blocked drainage systems, often clogged with solid waste, exacerbate the problem, causing water to back up into residential areas.'
        ]
      },
      {
        heading: 'Community Resilience',
        paragraphs: [
          'Communities can build resilience by organizing neighborhood clean-ups to clear drainage ditches before the rainy season.',
          'Raising floor levels and creating safe community evacuation plans are critical steps for protecting lives and property.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q2',
        question: 'What is a major cause of exacerbated urban flooding in Nairobi?',
        options: [
          'Too many green spaces',
          'Blocked drainage systems due to solid waste',
          'High altitude',
          'Underground springs'
        ],
        correctAnswer: 1,
        explanation: 'Solid waste often blocks drainage channels, preventing water from flowing away during heavy rains.'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Heat & Health',
    description: 'Protecting your community from extreme heat.',
    image: '/images/heat_and_health_1790629650810.jpg',
    content: [
      {
        heading: 'Health Impacts of Extreme Heat',
        paragraphs: [
          'Prolonged exposure to extreme heat can cause heat exhaustion, dehydration, and heatstroke. Vulnerable populations like the elderly and young children are at the highest risk.',
          'Metal-roofed homes in informal settlements can reach dangerous indoor temperatures.'
        ]
      },
      {
        heading: 'Mitigation Strategies',
        paragraphs: [
          'Painting roofs white can reflect sunlight and reduce indoor temperatures significantly.',
          'Ensuring adequate ventilation and organizing community cooling centers can save lives during heatwaves.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'What is a simple community strategy to reduce indoor heat?',
        options: [
          'Painting metal roofs white to reflect sunlight',
          'Closing all windows permanently',
          'Using dark colored curtains',
          'Removing the roof'
        ],
        correctAnswer: 0,
        explanation: 'White paint reflects sunlight (high albedo), significantly reducing the heat absorbed by the roof.'
      }
    ]
  },
  {
    id: 'm4',
    title: 'Water Stress & Disease Prevention',
    description: 'Managing safe water access during climate shocks.',
    image: '/images/water_stress_1790629662981.jpg',
    content: [
      {
        heading: 'The Climate-Water Connection',
        paragraphs: [
          'Droughts reduce water availability, forcing communities to rely on unsafe water sources, which increases the risk of waterborne diseases like cholera.',
          'Conversely, flooding can contaminate clean water supplies with sewage.'
        ]
      },
      {
        heading: 'Safe Water Practices',
        paragraphs: [
          'Always boil or treat water with chlorine before drinking, especially during and after floods.',
          'Community-managed water kiosks help ensure equitable access to safe water during periods of stress.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'Why do floods increase the risk of waterborne diseases?',
        options: [
          'The water is too cold',
          'Floods can mix sewage with clean drinking water supplies',
          'People drink more water during floods',
          'Floods wash away soap'
        ],
        correctAnswer: 1,
        explanation: 'Floodwaters often overwhelm sanitation systems, carrying raw sewage into drinking water sources.'
      }
    ]
  },
  {
    id: 'm5',
    title: 'Climate Justice',
    description: 'Advocating for fair climate policies for all.',
    image: '/images/climate_justice_1790629675274.jpg',
    content: [
      {
        heading: 'What is Climate Justice?',
        paragraphs: [
          'Climate justice acknowledges that climate change has differing social, economic, and public health impacts on underprivileged populations.',
          'Those who contribute the least to greenhouse gas emissions often suffer the most severe consequences.'
        ]
      },
      {
        heading: 'The Right to Participate',
        paragraphs: [
          'Every community has a right to participate in urban planning and climate adaptation policies.',
          'Equitable distribution of resources, such as green infrastructure, is a fundamental human right.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q5',
        question: 'What is the core principle of Climate Justice?',
        options: [
          'Everyone should experience exactly the same weather',
          'Acknowledging and addressing the unequal impacts of climate change on vulnerable populations',
          'Taking polluters to court only',
          'Ignoring social inequalities'
        ],
        correctAnswer: 1,
        explanation: 'Climate justice focuses on the social and human rights aspects of climate change, ensuring vulnerable groups are protected and heard.'
      }
    ]
  },
  {
    id: 'm6',
    title: 'Green Claims',
    description: 'Identifying greenwashing and false environmental promises.',
    image: '/images/green_claims_1790629686768.jpg',
    content: [
      {
        heading: 'Understanding Greenwashing',
        paragraphs: [
          'Greenwashing is when a company or organization spends more time and money claiming to be "green" through advertising than actually implementing business practices that minimize environmental impact.',
          'Look out for vague terms like "eco-friendly" or "all-natural" without clear, verifiable evidence.'
        ]
      },
      {
        heading: 'Holding Actors Accountable',
        paragraphs: [
          'Demand transparency. Real climate action involves verifiable data, transparent supply chains, and significant reduction in emissions, not just offsetting.',
          'Community awareness is the first defense against false green claims.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q6',
        question: 'Which of the following is a sign of greenwashing?',
        options: [
          'Detailed public sustainability reports',
          'Vague claims like "100% natural" without any certification or proof',
          'Companies reducing their carbon footprint',
          'Community-led environmental reviews'
        ],
        correctAnswer: 1,
        explanation: 'Vague, unverified buzzwords are a classic sign of greenwashing meant to deceive consumers.'
      }
    ]
  },
  {
    id: 'm7',
    title: 'Safe Civic Participation',
    description: 'Engaging in climate action effectively and safely.',
    image: '/images/civic_participation_1790629699025.jpg',
    content: [
      {
        heading: 'The Power of Community Action',
        paragraphs: [
          'Civic participation is vital for pushing local governments to prioritize climate resilience.',
          'Working through established community groups (CBOs) amplifies your voice and provides a safe structure for advocacy.'
        ]
      },
      {
        heading: 'Safe Engagement',
        paragraphs: [
          'Understand your rights. Participate in legal public forums and budget hearings to demand climate action.',
          'Focus on constructive dialogues, coalition building, and evidence-based demands to ensure your community\'s needs are met peacefully and effectively.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q7',
        question: 'What is an effective way to safely participate in civic climate action?',
        options: [
          'Acting completely alone without talking to neighbors',
          'Working through Community Based Organizations (CBOs) and attending local budget hearings',
          'Only posting on social media',
          'Ignoring local government completely'
        ],
        correctAnswer: 1,
        explanation: 'CBOs provide organized, safe, and effective platforms to collectively advocate for community needs at government forums.'
      }
    ]
  }
];

export const modules_sw: ModuleData[] = [
  {
    id: 'm1',
    title: 'Hatari ya Hali ya Hewa Nairobi',
    description: 'Kuelewa changamoto za kipekee za hali ya hewa zinazokabili jiji letu.',
    image: '/images/nairobi_climate_risk_1790629624713.jpg',
    content: [
      {
        heading: 'Athari ya Kisiwa cha Joto Mjini',
        paragraphs: [
          'Nairobi inakabiliwa na hali inayojulikana kama Athari ya Kisiwa cha Joto Mjini (UHI). Saruji na lami hufyonza joto, na kufanya jiji kuwa na joto zaidi kuliko maeneo ya vijijini yanayozunguka.',
          'Hii inaathiri zaidi jamii zilizotengwa, kwani makazi yasiyo rasmi mara nyingi hukosa maeneo ya kijani na kutumia vifaa vinavyofyonza joto kama mabati.'
        ]
      },
      {
        heading: 'Kubadilika kwa Mifumo ya Hali ya Hewa',
        paragraphs: [
          'Tunaona mvua zisizotabirika. "Mvua ndefu" (Machi-Mei) hazitabiriki sana, wakati matukio ya mvua kubwa yanaongezeka.',
          'Mabadiliko haya ya haraka yanatia mkazo miundombinu ya jiji letu na kutishia usalama wa chakula.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Je, athari ya Kisiwa cha Joto Mjini ni nini?',
        options: [
          'Wakati kisiwa kinakuwa na joto sana',
          'Wakati maeneo ya mijini yana joto zaidi kuliko maeneo ya vijijini kutokana na shughuli za binadamu',
          'Mfumo mpya wa hali ya hewa Nairobi',
          'Wakati miji inapanda miti mingi'
        ],
        correctAnswer: 1,
        explanation: 'Athari ya UHI hutokea kwa sababu saruji na lami hufyonza na kuhifadhi joto zaidi kuliko mandhari ya asili.'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Mafuriko Mjini',
    description: 'Jifunze jinsi ya kukabiliana na hatari za mafuriko.',
    image: '/images/urban_flooding_1790629636632.jpg',
    content: [
      {
        heading: 'Kwa Nini Nairobi Inafurika?',
        paragraphs: [
          'Ukuaji wa miji bila miundombinu ya kutosha ya mifereji husababisha mafuriko makubwa wakati wa mvua kubwa.',
          'Mifumo iliyoziba ya maji, mara nyingi inatokana na taka ngumu, inazidisha tatizo na kusababisha maji kujaa katika maeneo ya makazi.'
        ]
      },
      {
        heading: 'Uthabiti wa Jamii',
        paragraphs: [
          'Jamii zinaweza kujenga uthabiti kwa kupanga usafishaji wa mitaa ili kuzibua mifereji kabla ya msimu wa mvua.',
          'Kuinua viwango vya sakafu na kuunda mipango salama ya uokoaji wa jamii ni hatua muhimu za kulinda maisha na mali.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q2',
        question: 'Ni nini chanzo kikuu cha kuongezeka kwa mafuriko mjini Nairobi?',
        options: [
          'Maeneo mengi ya kijani kibichi',
          'Mifumo iliyoziba ya mifereji kutokana na taka ngumu',
          'Muinuko mkubwa',
          'Chemchemi za chini ya ardhi'
        ],
        correctAnswer: 1,
        explanation: 'Taka ngumu mara nyingi huziba mikondo ya mifereji, na kuzuia maji kutiririka wakati wa mvua kubwa.'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Joto na Afya',
    description: 'Kulinda jamii yako kutokana na joto kali.',
    image: '/images/heat_and_health_1790629650810.jpg',
    content: [
      {
        heading: 'Athari za Afya za Joto Kali',
        paragraphs: [
          'Kukaa kwenye joto kali kwa muda mrefu kunaweza kusababisha uchovu wa joto, upungufu wa maji mwilini, na kiharusi cha joto. Watu walio hatarini kama wazee na watoto wadogo wako kwenye hatari kubwa zaidi.',
          'Nyumba za mabati katika makazi yasiyo rasmi zinaweza kufikia viwango vya joto hatari ndani.'
        ]
      },
      {
        heading: 'Mbinu za Kupunguza Athari',
        paragraphs: [
          'Kupaka paa rangi nyeupe kunaweza kuakisi mwanga wa jua na kupunguza joto la ndani kwa kiasi kikubwa.',
          'Kuhakikisha uingizaji hewa wa kutosha na kupanga vituo vya kupooza vya jamii kunaweza kuokoa maisha wakati wa mawimbi ya joto.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q3',
        question: 'Ni mbinu gani rahisi ya kijamii inayoweza kupunguza joto la ndani?',
        options: [
          'Kupaka paa za mabati rangi nyeupe kuakisi mwanga wa jua',
          'Kufunga madirisha yote kabisa',
          'Kutumia mapazia ya rangi nyeusi',
          'Kuondoa paa'
        ],
        correctAnswer: 0,
        explanation: 'Rangi nyeupe huakisi mwanga wa jua (albedo kubwa), ikipunguza kwa kiasi kikubwa joto linalofyonzwa na paa.'
      }
    ]
  },
  {
    id: 'm4',
    title: 'Uhaba wa Maji na Kuzuia Magonjwa',
    description: 'Kusimamia upatikanaji wa maji salama wakati wa majanga.',
    image: '/images/water_stress_1790629662981.jpg',
    content: [
      {
        heading: 'Uhusiano wa Hali ya Hewa na Maji',
        paragraphs: [
          'Ukame hupunguza upatikanaji wa maji, na kulazimisha jamii kutegemea vyanzo vya maji visivyo salama, jambo ambalo huongeza hatari ya magonjwa yanayosambazwa na maji kama kipindupindu.',
          'Kwa upande mwingine, mafuriko yanaweza kuchafua vyanzo safi vya maji kwa maji taka.'
        ]
      },
      {
        heading: 'Mbinu Salama za Maji',
        paragraphs: [
          'Daima chemsha au tibu maji kwa klorini kabla ya kunywa, haswa wakati na baada ya mafuriko.',
          'Vioski vya maji vinavyosimamiwa na jamii husaidia kuhakikisha upatikanaji sawa wa maji salama wakati wa shida.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q4',
        question: 'Kwa nini mafuriko yanaongeza hatari ya magonjwa yanayosambazwa na maji?',
        options: [
          'Maji yanakuwa baridi sana',
          'Mafuriko yanaweza kuchanganya maji taka na vyanzo vya maji safi ya kunywa',
          'Watu wanakunywa maji mengi zaidi wakati wa mafuriko',
          'Mafuriko yanaosha sabuni'
        ],
        correctAnswer: 1,
        explanation: 'Maji ya mafuriko mara nyingi hulemea mifumo ya usafi wa mazingira, yakibeba maji taka ghafi kwenye vyanzo vya maji ya kunywa.'
      }
    ]
  },
  {
    id: 'm5',
    title: 'Haki ya Hali ya Hewa',
    description: 'Kutetea sera za haki za hali ya hewa kwa wote.',
    image: '/images/climate_justice_1790629675274.jpg',
    content: [
      {
        heading: 'Haki ya Hali ya Hewa ni nini?',
        paragraphs: [
          'Haki ya hali ya hewa inatambua kuwa mabadiliko ya tabianchi yana athari tofauti za kijamii, kiuchumi, na afya ya umma kwa makundi yasiyojiweza.',
          'Wale wanaochangia kiasi kidogo zaidi cha uzalishaji wa gesi chafu mara nyingi huteseka kutokana na matokeo mabaya zaidi.'
        ]
      },
      {
        heading: 'Haki ya Kushiriki',
        paragraphs: [
          'Kila jamii ina haki ya kushiriki katika mipango miji na sera za kukabiliana na mabadiliko ya hali ya hewa.',
          'Usambazaji sawa wa rasilimali, kama vile miundombinu ya kijani, ni haki ya kimsingi ya binadamu.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q5',
        question: 'Ni kanuni gani kuu ya Haki ya Hali ya Hewa?',
        options: [
          'Kila mtu anapaswa kupata hali ya hewa sawa kabisa',
          'Kutambua na kushughulikia athari zisizo sawa za mabadiliko ya hali ya hewa kwa makundi yaliyo hatarini',
          'Kuwapeleka wachafuzi mahakamani pekee',
          'Kupuuza ukosefu wa usawa wa kijamii'
        ],
        correctAnswer: 1,
        explanation: 'Haki ya hali ya hewa inaangazia mambo ya kijamii na haki za binadamu za mabadiliko ya tabianchi, kuhakikisha vikundi vilivyo hatarini vinalindwa na kusikilizwa.'
      }
    ]
  },
  {
    id: 'm6',
    title: 'Madai ya Kijani (Greenwashing)',
    description: 'Kutambua uongo wa kimazingira.',
    image: '/images/green_claims_1790629686768.jpg',
    content: [
      {
        heading: 'Kuelewa Uongo wa Kimazingira',
        paragraphs: [
          'Uongo wa kimazingira (Greenwashing) ni wakati kampuni au shirika linatumia muda na pesa nyingi kudai kuwa "linajali mazingira" kupitia matangazo badala ya kutekeleza mazoea ya biashara yanayopunguza athari za mazingira.',
          'Jihadhari na maneno yasiyoeleweka kama "rafiki kwa mazingira" au "asilimia 100 asilia" bila ushahidi wazi, unaoweza kuthibitishwa.'
        ]
      },
      {
        heading: 'Kuwawajibisha Wadau',
        paragraphs: [
          'Dai uwazi. Hatua halisi za hali ya hewa zinahusisha data inayoweza kuthibitishwa, minyororo ya ugavi ya wazi, na kupunguza kwa kiasi kikubwa uzalishaji wa gesi chafu, si tu kulipia uchafuzi (offsetting).',
          'Uelewa wa jamii ni ulinzi wa kwanza dhidi ya madai ya uongo ya kimazingira.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q6',
        question: 'Ni kipi kati ya yafuatayo ni dalili ya greenwashing?',
        options: [
          'Ripoti za kina za uendelevu za umma',
          'Madai yasiyoeleweka kama "asilimia 100 asilia" bila udhibitisho au uthibitisho wowote',
          'Kampuni zinazopunguza alama yao ya kaboni',
          'Ukaguzi wa mazingira unaoongozwa na jamii'
        ],
        correctAnswer: 1,
        explanation: 'Maneno yasiyothibitishwa ni dalili ya kawaida ya greenwashing inayokusudiwa kuwadanganya wateja.'
      }
    ]
  },
  {
    id: 'm7',
    title: 'Ushiriki Salama wa Kiraia',
    description: 'Kushiriki katika hatua za hali ya hewa kwa ufanisi.',
    image: '/images/civic_participation_1790629699025.jpg',
    content: [
      {
        heading: 'Nguvu ya Vitendo vya Jamii',
        paragraphs: [
          'Ushiriki wa raia ni muhimu kwa kusukuma serikali za mitaa kutoa kipaumbele kwa uthabiti wa hali ya hewa.',
          'Kufanya kazi kupitia vikundi vya kijamii (CBOs) kunaimarisha sauti yako na kutoa muundo salama wa utetezi.'
        ]
      },
      {
        heading: 'Ushiriki Salama',
        paragraphs: [
          'Elewa haki zako. Shiriki katika majukwaa halali ya umma na vikao vya bajeti kudai hatua za hali ya hewa.',
          'Zingatia mazungumzo yenye kujenga, kujenga ushirikiano, na madai yanayotegemea ushahidi ili kuhakikisha mahitaji ya jamii yako yanatimizwa kwa amani na ufanisi.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q7',
        question: 'Ni ipi njia bora ya kushiriki kwa usalama katika hatua za kiraia za hali ya hewa?',
        options: [
          'Kutenda peke yako kabisa bila kuzungumza na majirani',
          'Kufanya kazi kupitia Mashirika ya Kijamii (CBOs) na kuhudhuria vikao vya bajeti vya mitaa',
          'Kuchapisha kwenye mitandao ya kijamii pekee',
          'Kupuuza serikali ya mtaa kabisa'
        ],
        correctAnswer: 1,
        explanation: 'CBOs hutoa majukwaa yaliyopangwa, salama, na yenye ufanisi kwa kutetea kwa pamoja mahitaji ya jamii katika mikutano ya serikali.'
      }
    ]
  }
];

export const modules: Record<'en' | 'sw', ModuleData[]> = {
  en: modules_en,
  sw: modules_sw
};
