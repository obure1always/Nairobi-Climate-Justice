export interface FAQItem {
  id: string;
  moduleId: string;
  lessonId?: string;
  question: { en: string; sw: string };
  answer: { en: string; sw: string };
  keywords: string[];
  source: string;
  relatedQuestionIds?: string[];
  actionGuideRef?: string;
}

export const faqs: FAQItem[] = [
  // ==========================================
  // Module 1: Nairobi Climate Risk (FAQs 1–10)
  // ==========================================
  {
    id: 'faq-1',
    moduleId: 'm1',
    lessonId: 'm1-l1',
    question: {
      en: 'What is the exact difference between weather and climate in Nairobi?',
      sw: 'Ni ipi tofauti kamili kati ya hali ya hewa na tabianchi Nairobi?'
    },
    answer: {
      en: 'Weather describes day-to-day atmospheric conditions (such as a 3-hour thunderstorm in Westlands or a chilly morning). Climate represents the 30-year statistical average of those weather conditions, like Nairobi’s historical bimodal rainfall pattern (March–May and October–December).',
      sw: 'Hali ya hewa inaeleza matukio ya angahewa ya kila siku (kama mvua ya saa 3 Westlands au asubuhi yenye baridi). Tabianchi inawakilisha wastani wa takwimu wa miaka 30 ya mifumo hiyo, kama misimu miwili ya mvua ya Nairobi (Machi–Mei na Oktoba–Desemba).'
    },
    keywords: ['weather', 'climate', 'difference', 'hali ya hewa', 'tabianchi', 'tofauti', 'seasons', 'misimu', 'definition'],
    source: 'Kenya Meteorological Department / WMO Climate Guidelines',
    relatedQuestionIds: ['faq-2', 'faq-3']
  },
  {
    id: 'faq-2',
    moduleId: 'm1',
    lessonId: 'm1-l1',
    question: {
      en: 'Does a cold week in July disprove global warming?',
      sw: 'Je, wiki yenye baridi kali mwezi Julai inathibitisha ongezeko la joto duniani halipo?'
    },
    answer: {
      en: 'No. Individual cold days or weeks are natural short-term weather variability. Climate change is verified by multi-decade global and regional temperature datasets showing an unmistakable upward warming trend since pre-industrial times.',
      sw: 'Hapana. Siku au wiki za baridi ni mabadiliko ya kawaida ya muda mfupi ya hali ya hewa. Mabadiliko ya tabianchi yanathibitishwa na rekodi za miongo kadhaa zinazoonyesha ongezeko thabiti la joto duniani tangu mapinduzi ya viwanda.'
    },
    keywords: ['cold', 'july', 'baridi', 'disprove', 'global warming', 'ongezeko la joto', 'myth', 'misconception'],
    source: 'IPCC Sixth Assessment Report (AR6)',
    relatedQuestionIds: ['faq-1', 'faq-4']
  },
  {
    id: 'faq-3',
    moduleId: 'm1',
    lessonId: 'm1-l2',
    question: {
      en: 'What is the Greenhouse Effect and why is human activity enhancing it?',
      sw: 'Athari ya chafu (Greenhouse Effect) ni nini na kwa nini binadamu anaziongeza?'
    },
    answer: {
      en: 'The natural greenhouse effect traps infrared heat to keep Earth warm enough for life (averaging 15°C). However, human burning of fossil fuels (coal, oil, gas) and deforestation have dumped billions of tonnes of carbon dioxide and methane into the atmosphere, creating an enhanced blanket that traps dangerous excess heat.',
      sw: 'Athari ya asili ya chafu inabakisha joto la mionzi ya jua ili kuwezesha maisha duniani (wastani wa 15°C). Hata hivyo, uchomaji wa mafuta ya kisukuku na ukataji miti umeongeza mabilioni ya tani za kaboni na methane, na kutengeneza blanketi zito linalozuia joto kutoka angani.'
    },
    keywords: ['greenhouse effect', 'athari ya chafu', 'fossil fuels', 'carbon', 'kaboni', 'methane', 'co2'],
    source: 'UNFCCC Climate Science Reference Guide',
    relatedQuestionIds: ['faq-1', 'faq-4']
  },
  {
    id: 'faq-4',
    moduleId: 'm1',
    lessonId: 'm1-l3',
    question: {
      en: 'Why is Nairobi hotter in the CBD and informal settlements than in surrounding hills?',
      sw: 'Kwa nini Nairobi ina joto kali katikati ya jiji na mitaa ya mabanda kuliko vilimani?'
    },
    answer: {
      en: 'This is the Urban Heat Island (UHI) effect. Dense dark asphalt, stone structures, and unpainted corrugated iron roofs absorb solar radiation and release heat slowly at night. In contrast, rural or vegetated areas like Tigoni or Karura Forest cool down rapidly through plant transpiration and shade.',
      sw: 'Hii ni athari ya Kisiwa cha Joto Mjini (UHI). Lami nyeusi, majengo ya mawe, na mabati ya nyumba yananyonya joto la jua mchana na kulitoa polepole usiku. Kinyume chake, maeneo yenye miti kama Msitu wa Karura hupoa haraka kupitia kivuli na mvuke wa mimea.'
    },
    keywords: ['urban heat island', 'kisiwa cha joto', 'uhi', 'concrete', 'asphalt', 'mabati', 'roofs', 'karura'],
    source: 'UN-Habitat Urban Climate Resilient Cities Report',
    relatedQuestionIds: ['faq-5', 'faq-21']
  },
  {
    id: 'faq-5',
    moduleId: 'm1',
    lessonId: 'm1-l4',
    question: {
      en: 'Why do rainfall patterns feel so erratic across Nairobi neighborhoods?',
      sw: 'Kwa nini mifumo ya mvua inaonekana kutotabirika katika mitaa ya Nairobi?'
    },
    answer: {
      en: 'Climate warming increases atmospheric moisture capacity by about 7% per degree Celsius. This causes fewer, lighter drizzle days and more sudden, intense convective thunderstorms that dump heavy rain over localized pockets of the city in minutes.',
      sw: 'Ongezeko la joto linakuza uwezo wa angahewa kushikilia unyevu kwa takriban 7% kwa kila nyuzi ya joto. Hii inasababisha kupungua kwa manyunyu ya kawaida na kuongezeka kwa dhoruba kali za ghafla zinazomwaga maji mengi kwenye maeneo maalum ya jiji kwa dakika chache.'
    },
    keywords: ['rainfall', 'mvua', 'erratic', 'storm', 'dhoruba', 'convective', 'kmd', 'unpredictable'],
    source: 'Kenya Meteorological Department Seasonal Analysis',
    relatedQuestionIds: ['faq-6', 'faq-11']
  },
  {
    id: 'faq-6',
    moduleId: 'm1',
    lessonId: 'm1-l5',
    question: {
      en: 'How do Hazard, Exposure, and Vulnerability combine to produce climate risk?',
      sw: 'Hatari (Hazard), Mfiduo (Exposure), na Udhaifu (Vulnerability) vinaungana vipi kuunda hatari ya tabianchi?'
    },
    answer: {
      en: 'Risk is the product of three elements: Hazard (the physical storm or heat wave), Exposure (people and assets located in that hazard’s path), and Vulnerability (lack of drainage, flimsy housing, poverty, or lack of early warning). Reducing any one component reduces the overall disaster risk.',
      sw: 'Hatari ya tabianchi ni matokeo ya vipengele vitatu: Hatari ya Asili (dhoruba au joto), Mfiduo (watu na mali zilizopo njia ya hatari), na Udhaifu (ukosefu wa mifereji, nyumba duni, umaskini). Kupunguza kipengele chochote kunapunguza uwezekano wa maafa.'
    },
    keywords: ['hazard', 'exposure', 'vulnerability', 'risk', 'udhaifu', 'mfiduo', 'formula', 'capacity'],
    source: 'UNDRR Disaster Risk Reduction Terminology',
    relatedQuestionIds: ['faq-7', 'faq-18']
  },
  {
    id: 'faq-7',
    moduleId: 'm1',
    lessonId: 'm1-l5',
    question: {
      en: 'Why do low-income neighborhoods suffer worse damage from the same storm than Karen or Runda?',
      sw: 'Kwa nini mitaa ya mapato ya chini inapata hasara kubwa zaidi kutokana na dhoruba ile ile kuliko Karen au Runda?'
    },
    answer: {
      en: 'While the hazard (the rain volume) may fall equally, low-income informal settlements face severe structural inequality: 60% of people occupy 6% of land, living in sheet-metal houses along river reserves without municipal storm sewers, flood insurance, or emergency savings buffers.',
      sw: 'Ingawa mvua inanyesha kwa kiasi kile kile, mitaa duni inakabiliwa na ukosefu mkubwa wa usawa: 60% ya wakaazi wanaishi kwenye 6% ya ardhi, kwenye nyumba za mabati kando ya mito bila mifereji ya serikali wala bima ya majanga.'
    },
    keywords: ['inequality', 'slums', 'informal settlements', 'karen', 'runda', 'kibera', 'mathare', 'drainage'],
    source: 'UN-Habitat Nairobi Urban Profile',
    relatedQuestionIds: ['faq-41', 'faq-42']
  },
  {
    id: 'faq-8',
    moduleId: 'm1',
    lessonId: 'm1-l6',
    question: {
      en: 'Where can I find official verified seasonal weather forecasts for Kenya?',
      sw: 'Ninaweza kupata wapi utabiri rasmi na uliothibitishwa wa hali ya hewa nchini Kenya?'
    },
    answer: {
      en: 'Always consult the Kenya Meteorological Department (KMD) official portal at meteo.go.ke, county director of meteorology bulletins, or verified radio updates. Never rely on viral unverified WhatsApp voice notes claiming imminent cataclysms.',
      sw: 'Kila wakati tembelea tovuti rasmi ya Idara ya Hali ya Hewa ya Kenya (KMD) katika meteo.go.ke au taarifa za wakurugenzi wa kaunti wa hali ya hewa. Usiamini jumbe za sauti za uzushi za WhatsApp zisizo na chanzo.'
    },
    keywords: ['kmd', 'meteo.go.ke', 'forecast', 'utabiri', 'official', 'verified', 'seasonal'],
    source: 'Kenya Meteorological Department Public Service Portal',
    relatedQuestionIds: ['faq-68', 'faq-69']
  },
  {
    id: 'faq-9',
    moduleId: 'm1',
    lessonId: 'm1-l3',
    question: {
      en: 'What are low-cost ways to reduce heat inside a corrugated iron room?',
      sw: 'Ni njia gani za bei nafuu za kupunguza joto ndani ya chumba cha mabati?'
    },
    answer: {
      en: 'Paint the exterior roof white using low-cost lime wash (chokaa), create high ridge ventilation openings beneath eaves for cross-breeze, hang wet cotton curtains during peak sun, and store water in porous traditional clay pots.',
      sw: 'Paka paa chokaa nyeupe ya bei nafuu juu ya mabati, tengeneza nafasi za wazi chini ya paa kupitisha upepo, ning’iniza vitambaa vilivyoloa maji madirishani, na hifadhi maji kwenye vyungu vya udongo.'
    },
    keywords: ['chokaa', 'lime wash', 'cool roof', 'tin roof', 'mabati', 'ventilation', 'clay pots', 'joto'],
    source: 'WHO Urban Health Guidance / Practical Action',
    relatedQuestionIds: ['faq-25', 'faq-26'],
    actionGuideRef: 'ag-m3'
  },
  {
    id: 'faq-10',
    moduleId: 'm1',
    lessonId: 'm1-l6',
    question: {
      en: 'Can young people conduct their own neighborhood climate risk mapping?',
      sw: 'Je, vijana wanaweza kufanya tathmini na kuchora ramani ya hatari za mazingira ya mtaa wao?'
    },
    answer: {
      en: 'Yes. Youth groups can walk neighborhood boundaries, mark blocked culverts, note heat traps, list vulnerable elders, and draft a community hazard map to present to ward administrators and MCAs for public budget allocation.',
      sw: 'Ndio. Vikundi vya vijana vinaweza kutembea mtaani, kuweka alama za mitaro iliyoziba, kubaini maeneo ya joto kali, kuorodhesha wazee walio hatarini, na kuwasilisha ramani ya hatari kwa Msimamizi wa Wadi na Diwani (MCA).'
    },
    keywords: ['mapping', 'ramani', 'youth', 'vijana', 'community mapping', 'hazard map'],
    source: 'UNFCCC Action for Climate Empowerment (ACE)',
    relatedQuestionIds: ['faq-61', 'faq-70'],
    actionGuideRef: 'ag-m1'
  },

  // ==========================================
  // Module 2: Urban Flooding (FAQs 11–20)
  // ==========================================
  {
    id: 'faq-11',
    moduleId: 'm2',
    lessonId: 'm2-l1',
    question: {
      en: 'How does urban flooding differ from natural river flooding?',
      sw: 'Mafuriko ya mjini yanatofautianaje na mafuriko ya asili ya mito?'
    },
    answer: {
      en: 'Natural river flooding happens gradually as water rises over soft river floodplains. Urban flooding happens almost instantly because impermeable concrete, asphalt, and metal roofs prevent rain from soaking into soil, generating massive surface runoff that overwhelms undersized or trash-blocked drains.',
      sw: 'Mafuriko ya asili ya mito hutokea polepole maji yakifurika kwenye mabonde ya udongo. Mafuriko ya mjini hutokea ghafla kwa sababu zege, lami, na mabati vinazuia maji kuingia ardhini, na kutengeneza mikondo mikubwa ya maji inayozidi uwezo wa mitaro.'
    },
    keywords: ['urban flooding', 'mafuriko ya mjini', 'impervious', 'runoff', 'drainage', 'surface runoff'],
    source: 'UN-Habitat Urban Flooding Technical Papers',
    relatedQuestionIds: ['faq-12', 'faq-13']
  },
  {
    id: 'faq-12',
    moduleId: 'm2',
    lessonId: 'm2-l2',
    question: {
      en: 'Why does uncollected solid waste make flooding so much worse in informal settlements?',
      sw: 'Kwa nini taka ngumu zisizokusanywa zinazidisha mafuriko kwenye makazi duni?'
    },
    answer: {
      en: 'Plastic bags, bottles, and car tires dumped into open drainage channels form solid dams inside culverts. When heavy rain hits, water cannot escape into rivers and instead backs up, flooding homes, latrines, and small businesses with sewage-contaminated sludge.',
      sw: 'Mifuko ya plastiki, chupa, na magurudumu yanayotupwa kwenye mitaro yanatengeneza vizuizi vikubwa. Mvua ikinyesha, maji yanakosa njia ya kuelekea mtoni na kurudi nyuma kufurika ndani ya nyumba na vyoo vya shimo.'
    },
    keywords: ['solid waste', 'taka', 'plastic', 'bottles', 'culverts', 'mitaro', 'choked', 'sewage'],
    source: 'Kenya Sustainable Waste Management Act 2022',
    relatedQuestionIds: ['faq-13', 'faq-17'],
    actionGuideRef: 'ag-m2'
  },
  {
    id: 'faq-13',
    moduleId: 'm2',
    lessonId: 'm2-l3',
    question: {
      en: 'What should be inside a family emergency flood "Go-Bag"?',
      sw: 'Ni vitu gani vinavyopaswa kuwa ndani ya mfuko wa dharura wa "Go-Bag" wa mafuriko?'
    },
    answer: {
      en: 'A waterproof bag should contain national identity cards, birth certificates, title/rent documents, essential daily medicines, a flashlight with extra batteries, an emergency whistle, a phone with offline contacts, and a 24-hour supply of drinking water.',
      sw: 'Mfuko usiopitisha maji unapaswa kuwa na vitambulisho vya kitaifa, vyeti vya kuzaliwa, mikataba ya kodi, dawa za kila siku, tochi yenye betri, filimbi ya dharura, na maji salama ya kunywa ya siku moja.'
    },
    keywords: ['go-bag', 'emergency kit', 'mfuko wa dharura', 'documents', 'vitambulisho', 'flashlight', 'whistle'],
    source: 'Kenya Red Cross Flood Safety Standards',
    relatedQuestionIds: ['faq-14', 'faq-15'],
    actionGuideRef: 'ag-m2'
  },
  {
    id: 'faq-14',
    moduleId: 'm2',
    lessonId: 'm2-l4',
    question: {
      en: 'Is it ever safe to walk or drive through floodwater?',
      sw: 'Je, kuna wakati wowote ambapo ni salama kutembea au kuendesha gari ndani ya maji ya mafuriko?'
    },
    answer: {
      en: 'Never. Just 15cm of rushing floodwater can knock an adult off their feet, and 30cm can float a vehicle. Floodwater conceals missing manhole covers, live electrical wires, sharp rusty debris, and lethal raw sewage.',
      sw: 'Kamwe si salama. Kina cha sentimita 15 tu cha maji yanayotiririka kinaweza kumwangusha mtu mzima, na sentimita 30 kinaweza kusomba gari. Maji ya mafuriko huficha mashimo ya mitaro wazi, nyaya za umma za umeme, na kinyesi hatari.'
    },
    keywords: ['safety', 'floodwater', 'turn around', 'kutembea', 'driving', 'drowning', 'danger', 'hatari'],
    source: 'WHO / Kenya Red Cross Emergency Guidelines',
    relatedQuestionIds: ['faq-15', 'faq-16']
  },
  {
    id: 'faq-15',
    moduleId: 'm2',
    lessonId: 'm2-l4',
    question: {
      en: 'What should a household do immediately if floodwaters start rising inside the house at night?',
      sw: 'Familia inapaswa kufanya nini mara moja maji ya mafuriko yakianza kuingia ndani ya nyumba usiku?'
    },
    answer: {
      en: 'Switch off the main electricity breaker, grab your prepared Go-Bag, wake and assist vulnerable family members (infants, elderly, persons with disabilities), sound an emergency whistle, and evacuate immediately along predetermined high-ground paths. Never delay to save furniture.',
      sw: 'Zima swichi kuu ya umeme, chukua mfuko wa Go-Bag, waamshe na kuwasaidia watoto, wazee, na walemavu, piga filimbi ya tahadhari, na kuelekea sehemu za juu zilizopangwa. Usichelewe ili kuokoa vyombo au mali.'
    },
    keywords: ['rising water', 'night', 'usiku', 'evacuation', 'uokoaji', 'whistle', 'electricity', 'go-bag'],
    source: 'Kenya Red Cross Emergency Protocols',
    relatedQuestionIds: ['faq-13', 'faq-16'],
    actionGuideRef: 'ag-m2'
  },
  {
    id: 'faq-16',
    moduleId: 'm2',
    lessonId: 'm2-l5',
    question: {
      en: 'How can we clean and sanitize a home safely after floodwaters recede?',
      sw: 'Tunawezaje kusafisha na kuua viini vya nyumba kwa usalama baada ya maji ya mafuriko kupungua?'
    },
    answer: {
      en: 'Wear gumboots and rubber gloves to protect against cuts and sewage pathogens. Discard any contaminated food. Scrub floors and walls with dilute household bleach (1 cup bleach per 10 litres water), open all windows for thorough drying, and treat all drinking water with chlorine.',
      sw: 'Vaa buti na glavu za mipira kujikinga na misumari na vijidudu. Tupa chakula chote kilichoguswa na mafuriko. Osha sakafu na kuta kwa maji ya jiki (kikombe 1 kwa lita 10 za maji), fungua madirisha yote yakauke, na tibu maji yote ya kunywa kwa klorini.'
    },
    keywords: ['cleaning', 'kusafisha', 'bleach', 'jiki', 'post-flood', 'disinfection', 'gumboots', 'gloves'],
    source: 'Ministry of Health Kenya Environmental Sanitation Guidelines',
    relatedQuestionIds: ['faq-33', 'faq-34']
  },
  {
    id: 'faq-17',
    moduleId: 'm2',
    lessonId: 'm2-l2',
    question: {
      en: 'Should communities burn plastic waste inside drainage ditches to clear them?',
      sw: 'Je, jamii inapaswa kuchoma taka za plastiki ndani ya mitaro ya maji ili kuisafisha?'
    },
    answer: {
      en: 'No, absolutely not. Burning plastic in ditches releases cancer-causing dioxins and toxic fumes that cause severe asthma in children, damages concrete culvert linings, and melts plastics into rock-solid obstructions that block drainage even worse.',
      sw: 'Hapana, kamwe haifai. Kuchoma plastiki kwenye mitaro kunatoa moshi wa sumu ya dioxin unaosababisha saratani na pumu kwa watoto, kuharibu kuta za zege, na plastiki iliyoyeyuka huganda kama mwamba na kuziba mtaro zaidi.'
    },
    keywords: ['burning', 'plastic', 'kuchoma taka', 'toxic', 'smoke', 'culverts', 'damage'],
    source: 'NEMA Waste Regulations / UNEP Air Quality Guidelines',
    relatedQuestionIds: ['faq-12', 'faq-56']
  },
  {
    id: 'faq-18',
    moduleId: 'm2',
    lessonId: 'm2-l3',
    question: {
      en: 'How can emergency evacuation plans include persons with physical or sensory disabilities?',
      sw: 'Mipango ya dharura ya uokoaji inawezaje kuwajumuisha watu wanaoishi na ulemavu?'
    },
    answer: {
      en: 'Pair every disabled resident with two designated youth evacuation buddies; establish tactile and visual signals (flags, vibrating alerts) for deaf residents; maintain ramped, unblocked alleyways; and ensure emergency relief shelters have accessible sanitation facilities.',
      sw: 'Unganisha kila mlemavu na vijana wawili wa kujitolea wa kumsaidia; tumia alama za kuona na za mtetemo kwa wasiosikia; hakikisha njia hazina vizuizi; na kumbi za hifadhi za dharura ziwe na vyoo vinavyoweza kutumiwa na walemavu.'
    },
    keywords: ['disability', 'ulemavu', 'inclusion', 'accessible', 'deaf', 'wheelchair', 'evacuation buddy'],
    source: 'National Council for Persons with Disabilities (NCPWD) Kenya',
    relatedQuestionIds: ['faq-46', 'faq-47']
  },
  {
    id: 'faq-19',
    moduleId: 'm2',
    lessonId: 'm2-l6',
    question: {
      en: 'What are Nature-Based Solutions for urban flooding in Nairobi?',
      sw: 'Ni nini Suluhu Zinazotegemea Asili (NbS) za kuzuia mafuriko ya mijini Nairobi?'
    },
    answer: {
      en: 'Nature-based solutions use restored natural ecosystems: planting deep-rooted vetiver grass and bamboo to anchor riverbanks, restoring urban wetlands to soak up peak storm runoff, and installing permeable vegetated swales rather than building only concrete walls.',
      sw: 'Suluhu za asili zinatumia mifumo ya kimazingira: kupanda nyasi za vetiver na mianzi kutuliza kingo za mito, kulinda ardhi oevu kufyonza maji ya dhoruba, na kutengeneza mifereji ya nyasi badala ya kuta za zege pekee.'
    },
    keywords: ['nature-based', 'nbs', 'vetiver', 'bamboo', 'wetlands', 'riparian', 'swales', 'asili'],
    source: 'IUCN Nature-Based Solutions Framework',
    relatedQuestionIds: ['faq-20', 'faq-47']
  },
  {
    id: 'faq-20',
    moduleId: 'm2',
    lessonId: 'm2-l6',
    question: {
      en: 'What is the statutory riparian reserve width along Nairobi rivers under Kenya law?',
      sw: 'Ukanda wa kisheria wa hifadhi ya mto una upana gani kando ya mito ya Nairobi chini ya sheria za Kenya?'
    },
    answer: {
      en: 'Under the Environmental Management and Co-ordination Act (EMCA) Regulations and the Survey Act, the riparian reserve along major rivers extends between 6 to 30 metres from the highest watermark, where permanent buildings are restricted to allow natural flood conveyance.',
      sw: 'Chini ya Sheria ya EMCA na Sheria ya Upimaji Ardhi, ukanda wa hifadhi ya kingo za mito una upana wa kati ya mita 6 hadi 30 kutoka usawa wa juu wa maji, ambapo ujenzi wa kudumu umekatazwa ili kuruhusu maji ya mafuriko kupita.'
    },
    keywords: ['riparian', 'buffer', 'emca', 'nema', '30 metres', 'hifadhi ya mto', 'watercourse'],
    source: 'Kenya EMCA (Wetlands, Riverbanks and Lake Shores) Regulations',
    relatedQuestionIds: ['faq-14', 'faq-48']
  },

  // ==========================================
  // Module 3: Heat and Health (FAQs 21–30)
  // ==========================================
  {
    id: 'faq-21',
    moduleId: 'm3',
    lessonId: 'm3-l1',
    question: {
      en: 'What is the physiological difference between heat exhaustion and heatstroke?',
      sw: 'Ni ipi tofauti ya kitabibu kati ya uchovu wa joto (heat exhaustion) na kiharusi cha joto (heatstroke)?'
    },
    answer: {
      en: 'Heat exhaustion is caused by dehydration and salt loss: skin is pale, cool, and clammy with heavy sweating, nausea, and dizziness. Heatstroke is a life-threatening medical emergency: thermoregulation fails, body core temperature spikes above 40°C, skin is hot and dry (no sweat), and the victim becomes confused or unconscious.',
      sw: 'Uchovu wa joto unatokana na upungufu wa maji na chumvi: ngozi huwa na jasho jingi, ubaridi, kichefuchefu, na kizunguzungu. Kiharusi cha joto ni dharura ya kifo: mwili unashindwa kujipoza, joto linapanda zaidi ya 40°C, ngozi inakuwa kavu ya moto bila jasho, na mgonjwa anachanganyikiwa akili.'
    },
    keywords: ['heat exhaustion', 'heatstroke', 'kiharusi cha joto', 'uchovu wa joto', 'symptoms', 'temperature', 'sweating'],
    source: 'WHO Fact Sheet: Climate Change, Heat and Health',
    relatedQuestionIds: ['faq-22', 'faq-23']
  },
  {
    id: 'faq-22',
    moduleId: 'm3',
    lessonId: 'm3-l2',
    question: {
      en: 'What first aid must be given immediately to someone suspected of heatstroke?',
      sw: 'Ni huduma gani ya kwanza ya dharura inayopaswa kutolewa mara moja kwa anayedhaniwa kupata kiharusi cha joto?'
    },
    answer: {
      en: 'Call for emergency medical transport immediately. Move the person to deep shade or a cool room, loosen clothing, douse the body with cool water or wrap in wet sheets, and fan vigorously to accelerate cooling. Never give oral fluids to an unconscious or delirious person.',
      sw: 'Piga simu ya dharura ya ambulensi/usafiri mara moja. Mpeleke mgonjwa kivulini, legeza nguo, mwagie maji baridi au mfunike kwa mashuka yaliyoloa maji, na mpepee kwa nguvu. Kamwe usimpe vinywaji mtu aliyepoteza fahamu au anayeweweseka.'
    },
    keywords: ['first aid', 'huduma ya kwanza', 'heatstroke', 'emergency', 'cooling', 'dharura'],
    source: 'Kenya Red Cross First Aid Manual / WHO Clinical Guidance',
    relatedQuestionIds: ['faq-21', 'faq-23'],
    actionGuideRef: 'ag-m3'
  },
  {
    id: 'faq-23',
    moduleId: 'm3',
    lessonId: 'm3-l3',
    question: {
      en: 'Why are infants and children under five at greater risk during extreme heat waves?',
      sw: 'Kwa nini watoto wachanga na walio chini ya miaka mitano wapo kwenye hatari kubwa zaidi wakati wa joto kali?'
    },
    answer: {
      en: 'Children have a higher surface-area-to-body-mass ratio, produce more metabolic heat relative to size, have underdeveloped sweating mechanisms, and cannot independently communicate thirst or remove heavy clothing.',
      sw: 'Watoto wana uwiano mkubwa wa eneo la ngozi kulingana na uzito wao, wanazalisha joto jingi ndani ya miili yao, tezi zao za jasho hazijakomaa, na hawawezi kujieleza kiu au kuvua nguo nzito wenyewe.'
    },
    keywords: ['children', 'watoto', 'infants', 'dehydration', 'heat vulnerability', 'under five'],
    source: 'UNICEF / WHO Child Health in a Changing Climate',
    relatedQuestionIds: ['faq-21', 'faq-24']
  },
  {
    id: 'faq-24',
    moduleId: 'm3',
    lessonId: 'm3-l3',
    question: {
      en: 'How should outdoor informal workers (handcart pullers, fundis, vendors) adapt to high midday heat?',
      sw: 'Wafanyabiashara wa nje (wazi, mafundi, wabebezi) wanapaswa kukabiliana vipi na joto kali la mchana?'
    },
    answer: {
      en: 'Shift heavy physical exertion to 6–10 AM and after 4 PM; wear wide-brimmed hats and light-colored cotton clothing; drink clean water every 30 minutes before thirst begins; and establish shared shaded rest stations with fellow workers.',
      sw: 'Fanya kazi nzito asubuhi (saa 12-4 asubuhi) na jioni baada ya saa 10; vaa kofia na nguo nyepesi za pamba; kunywa maji kila baada ya dakika 30 kabla ya kiu; na kuweka vivuli vya kupumzika na wafanyakazi wenzako.'
    },
    keywords: ['workers', 'fundis', 'vendors', 'handcart', 'mkokoteni', 'hydration', 'shade', 'breaks'],
    source: 'ILO Occupational Safety and Health in Extreme Temperatures',
    relatedQuestionIds: ['faq-21', 'faq-25']
  },
  {
    id: 'faq-25',
    moduleId: 'm3',
    lessonId: 'm3-l4',
    question: {
      en: 'What is a "Cool Roof" and how does agricultural lime wash work?',
      sw: 'Paa linaloakisi joto (Cool Roof) ni nini na chokaa ya kilimo inafanya kazi vipi?'
    },
    answer: {
      en: 'A Cool Roof reflects solar radiation back into space rather than absorbing it. Mixing agricultural lime (chokaa) with water and salt creates a low-cost, reflective white wash. Painting rusty corrugated metal sheets can lower ceiling temperatures by 5–8°C without electricity.',
      sw: 'Paa linaloakisi joto huakisi mionzi ya jua angani badala ya kuinyonya. Kuchanganya chokaa ya kilimo na maji na chumvi kunatengeneza rangi nyeupe ya bei nafuu. Kupaka juu ya mabati kunaweza kupunguza joto la ndani kwa nyuzi 5 hadi 8°C bila umeme.'
    },
    keywords: ['cool roof', 'lime wash', 'chokaa', 'albedo', 'reflection', 'mabati', 'joto', 'ceiling'],
    source: 'Global Cool Cities Alliance / Practical Action',
    relatedQuestionIds: ['faq-9', 'faq-26'],
    actionGuideRef: 'ag-m3'
  },
  {
    id: 'faq-26',
    moduleId: 'm3',
    lessonId: 'm3-l4',
    question: {
      en: 'How does cross-ventilation work in small single-room dwellings?',
      sw: 'Mzunguko wa upepo (cross-ventilation) unafanya kazi vipi kwenye vyumba vidogo vya makazi?'
    },
    answer: {
      en: 'Cross-ventilation occurs when air enters through an opening on one side and exits through an opposite side, creating a continuous cooling breeze. Adding small, wire-meshed vent slits directly beneath the roof eaves lets rising hot air escape and pulls cooler air in through lower door vents.',
      sw: 'Mzunguko wa upepo hutokea hewa inapoingia upande mmoja wa chumba na kutoka upande wa pili, ikitengeneza upepo mwanana unaopoza. Kuweka matundu yenye wavu chini ya paa huacha hewa ya moto kupanda na kutoa fursa kwa hewa baridi kuingia kupitia chini.'
    },
    keywords: ['cross ventilation', 'breeze', 'eaves', 'air flow', 'thermal chimney', 'madirisha', 'upepo'],
    source: 'UN-Habitat Sustainable Building Design Guidelines',
    relatedQuestionIds: ['faq-25', 'faq-27']
  },
  {
    id: 'faq-27',
    moduleId: 'm3',
    lessonId: 'm3-l5',
    question: {
      en: 'How do urban trees cool city neighborhoods compared to artificial shade structures?',
      sw: 'Miti ya mijini inavyopoza mitaa ikilinganishwaje na vivuli vya bandia vya mabati?'
    },
    answer: {
      en: 'While tin sheets block direct sun but radiate intense heat downward, trees provide shade while actively cooling air through evapotranspiration—pulling soil moisture through roots and releasing water vapor through leaves, which chills the surrounding air by 2–4°C.',
      sw: 'Wakati mabati yanazuia jua lakini yanatoa joto kali kuelekea chini, miti inatoa kivuli huku ikipoza hewa kiasili kupitia kutoa mvuke wa maji (evapotranspiration) kutoka kwenye majani yake, na kushusha joto la hewa kwa nyuzi 2 hadi 4°C.'
    },
    keywords: ['trees', 'miti', 'evapotranspiration', 'shade', 'urban cooling', 'kivuli', 'leaves'],
    source: 'UNEP Urban Greening and Climate Resilience Papers',
    relatedQuestionIds: ['faq-4', 'faq-28']
  },
  {
    id: 'faq-28',
    moduleId: 'm3',
    lessonId: 'm3-l5',
    question: {
      en: 'Which indigenous tree species are best suited for planting in Nairobi neighborhoods?',
      sw: 'Ni aina gani za miti ya asili inayofaa zaidi kupandwa katika mitaa ya Nairobi?'
    },
    answer: {
      en: 'Indigenous species like Acacia xanthophloea (Yellow Fever Tree), Markhamia lutea (Muu), Croton megalocarpus (Mukinduri), and Warburgia ugandensis (Muthiga). They tolerate erratic rainfall, support local biodiversity, provide deep shade, and do not crack building foundations like invasive eucalyptus.',
      sw: 'Aina za asili kama Muu (Markhamia lutea), Mukinduri (Croton megalocarpus), na Muthiga (Warburgia ugandensis). Inastahimili ukame, inalinda vyanzo vya maji, inatoa kivuli kizuri, na haipasui misingi ya nyumba kama mikaratusi ya kigeni.'
    },
    keywords: ['indigenous trees', 'miti ya asili', 'croton', 'markhamia', 'acacia', 'shade', 'greening'],
    source: 'Kenya Forestry Research Institute (KEFRI)',
    relatedQuestionIds: ['faq-27', 'faq-29']
  },
  {
    id: 'faq-29',
    moduleId: 'm3',
    lessonId: 'm3-l6',
    question: {
      en: 'What are the symptoms of chronic dehydration in warm urban climates?',
      sw: 'Ni zipi dalili za upungufu sugu wa maji mwilini katika mazingira ya joto mjini?'
    },
    answer: {
      en: 'Persistent dark amber urine, frequent afternoon tension headaches, dry sticky mouth, fatigue, constipation, dizziness upon standing, and reduced concentration. Drink at least 2.5 to 3 litres of clean water daily in hot weather.',
      sw: 'Mkojo wa rangi ya kahawia iliyoiva, maumivu ya kichwa ya kila alasiri, kukausha mdomo, uchovu sugu, choo kigumu, na kizunguzungu unaposimama. Kunywa angalau lita 2.5 hadi 3 za maji safi kila siku wakati wa joto.'
    },
    keywords: ['dehydration', 'upungufu wa maji', 'urine color', 'headache', 'fatigue', 'water intake'],
    source: 'WHO Guidelines on Drinking-Water Quality and Hydration',
    relatedQuestionIds: ['faq-21', 'faq-31']
  },
  {
    id: 'faq-30',
    moduleId: 'm3',
    lessonId: 'm3-l6',
    question: {
      en: 'Why is individual adaptation not a substitute for municipal infrastructure upgrades?',
      sw: 'Kwa nini hatua za mtu binafsi haziwezi kuchukua nafasi ya uboreshaji wa miundombinu ya serikali?'
    },
    answer: {
      en: 'Individual behaviors like drinking water or opening windows cannot fix overcrowded settlements built from cheap metal sheets with no trees, electricity, or water pipes. Real climate justice requires government public investments in paved storm drainage, piped clean water, and green public parks.',
      sw: 'Hatua za kibinafsi kama kunywa maji au kufungua madirisha haziwezi kurekebisha msongamano wa nyumba za mabati zisizo na miti, umeme, wala mabomba ya maji. Haki halisi inahitaji serikali kuwekeza kwenye mifereji mikubwa, maji safi ya bomba, na bustani za umma.'
    },
    keywords: ['limits of adaptation', 'infrastructure', 'justice', 'miundombinu', 'serikali', 'systemic'],
    source: 'IPCC AR6 Working Group II Chapter 6 (Cities and Infrastructure)',
    relatedQuestionIds: ['faq-7', 'faq-41']
  },

  // ==========================================
  // Module 4: Water Stress & Disease Prevention (FAQs 31–40)
  // ==========================================
  {
    id: 'faq-31',
    moduleId: 'm4',
    lessonId: 'm4-l1',
    question: {
      en: 'Why does Nairobi experience severe water rationing even during rainy seasons?',
      sw: 'Kwa nini Nairobi inapata mgao mkali wa maji hata wakati wa misimu ya mvua?'
    },
    answer: {
      en: 'Nairobi gets over 80% of its water from the Ndakaini Dam in Murang’a County. The city’s treatment and transmission pipeline infrastructure was built decades ago for 1.5 million people, while Nairobi’s population now exceeds 4.5 million. Furthermore, heavy rains increase sediment turbidity, forcing treatment plants to slow production.',
      sw: 'Nairobi inapata zaidi ya 80% ya maji yake kutoka Bwawa la Ndakaini kaunti ya Murang’a. Mabomba na mitambo ya kusafisha maji ilijengwa miongo iliyopita kwa watu milioni 1.5, huku idadi ya watu sasa ikizidi milioni 4.5. Mvua nyingi pia zinaleta matope mengi yanayolazimisha mitambo kupunguza kazi ya kusafisha maji.'
    },
    keywords: ['water rationing', 'mgao wa maji', 'ndakaini', 'ncwsc', 'infrastructure', 'turbidity', 'shortage'],
    source: 'Nairobi City Water and Sewerage Company (NCWSC) Strategic Plan',
    relatedQuestionIds: ['faq-32', 'faq-33']
  },
  {
    id: 'faq-32',
    moduleId: 'm4',
    lessonId: 'm4-l2',
    question: {
      en: 'How does flooding contaminate municipal drinking water networks?',
      sw: 'Mafuriko yanachafua vipi mabomba ya maji ya kunywa ya jiji?'
    },
    answer: {
      en: 'Informal settlement water pipes often run directly through unlined drainage channels and past pit latrines. During floods, water pressure drops in intermittent pipes, creating suction (negative pressure) that draws sewage and flood sludge into cracks in the drinking water distribution pipes.',
      sw: 'Mabomba ya maji mara nyingi yanapita ndani ya mitaro ya maji machafu karibu na vyoo vya shimo. Wakati wa mafuriko, shinikizo la maji linaposhuka mabombani, linavuta kinyesi na matope machafu kupitia nyufa za mabomba na kuingia kwenye maji ya kunywa.'
    },
    keywords: ['contamination', 'uchafuzi wa maji', 'pipes', 'sewage', 'latrines', 'suction', 'negative pressure'],
    source: 'WHO Guidelines on Drinking-Water Quality',
    relatedQuestionIds: ['faq-33', 'faq-35']
  },
  {
    id: 'faq-33',
    moduleId: 'm4',
    lessonId: 'm4-l3',
    question: {
      en: 'What is the correct household dosage for certified water chlorination products?',
      sw: 'Ni kipi kipimo sahihi cha nyumbani cha kutibu maji kwa dawa ya klorini?'
    },
    answer: {
      en: 'For clear water in a standard 20-litre jerrycan, add exactly one bottle cap (5ml) of certified household sodium hypochlorite (e.g., WaterGuard). If the water is cloudy after settling and straining, use two caps as directed on official labels. Shake well and wait 30 minutes before drinking.',
      sw: 'Kwa maji masafi ya mtungi wa kawaida wa lita 20, weka kifuniko kimoja kamili (5ml) cha dawa iliyoidhinishwa ya klorini (k.m., WaterGuard). Maji yakiwa na ukungu hata baada ya kuchujwa, weka vifuniko viwili kulingana na maagizo ya chupa. Tikisa vizuri na usubiri dakika 30 kabla ya kunywa.'
    },
    keywords: ['chlorine', 'waterguard', 'dosage', 'kipimo', 'jerrycan', '20 litres', 'minutes', 'kutibu maji'],
    source: 'Ministry of Health Kenya Water Treatment Guidelines',
    relatedQuestionIds: ['faq-34', 'faq-35'],
    actionGuideRef: 'ag-m4'
  },
  {
    id: 'faq-34',
    moduleId: 'm4',
    lessonId: 'm4-l3',
    question: {
      en: 'Why is it mandatory to wait a full 30 minutes after adding chlorine before drinking?',
      sw: 'Kwa nini ni lazima kusubiri dakika 30 kamili baada ya kuweka klorini kabla ya kunywa maji?'
    },
    answer: {
      en: 'Chlorine does not kill pathogens instantaneously; it requires a minimum contact time to penetrate and rupture bacterial cell membranes and neutralize viruses. Drinking water before 30 minutes risks consuming live pathogenic bacteria.',
      sw: 'Klorini haiui vijidudu papo hapo; inahitaji muda wa kutosha kupenya na kuangamiza kuta za seli za bakteria na virusi. Kunywa maji kabla ya dakika 30 kunaweka hatari ya kumeza bakteria hai za magonjwa.'
    },
    keywords: ['30 minutes', 'dakika 30', 'contact time', 'chlorine', 'bacterial membrane', 'pathogens'],
    source: 'CDC Drinking Water Disinfection Fact Sheets',
    relatedQuestionIds: ['faq-33', 'faq-35']
  },
  {
    id: 'faq-35',
    moduleId: 'm4',
    lessonId: 'm4-l4',
    question: {
      en: 'What is the difference between clarifying murky water and disinfecting it?',
      sw: 'Kuna tofauti gani kati ya kuchuja ukungu wa maji na kuua viini (kutibu)?'
    },
    answer: {
      en: 'Clarifying removes physical dirt, mud, and suspended particles through settling or cotton cloth filtration, but does NOT kill microscopic bacteria. Disinfection (chlorine or boiling) kills bacteria and viruses. Both steps are needed: clarify first, then disinfect.',
      sw: 'Kuchuja kunaondoa mchanga, matope, na uchafu unaoonekana kupitia kutuliza au kitambaa, lakini HAKUUI bakteria ndogo za maradhi. Kuua viini (klorini au kuchemsha) kunaua bakteria na virusi. Hatua zote zinahitajika: chuja kwanza, kisha tibu.'
    },
    keywords: ['clarification', 'filtration', 'disinfection', 'boiling', 'kuchemsha', 'uchafu', 'vijidudu'],
    source: 'WHO Household Water Treatment Manual',
    relatedQuestionIds: ['faq-33', 'faq-36']
  },
  {
    id: 'faq-36',
    moduleId: 'm4',
    lessonId: 'm4-l5',
    question: {
      en: 'What are the classic symptoms of Cholera and what should be done immediately?',
      sw: 'Ni zipi dalili kuu za Kipindupindu na nini kifanyike mara moja?'
    },
    answer: {
      en: 'Sudden onset of profuse painless watery diarrhea ("rice-water stools") and vomiting, leading to rapid severe dehydration. Immediate action: start administering Oral Rehydration Salts (ORS) dissolved in clean water continuously and transport the patient urgently to the nearest health facility. Cholera can kill within hours if untreated.',
      sw: 'Kuhara kwa ghafla kwa wingi maji meupe kama maji ya kuoshea mchele bila maumivu, pamoja na kutapika, kunakoleta upungufu mkubwa wa maji. Hatua ya haraka: mpe mgonjwa chumvi ya ORS iliyochanganywa na maji safi mfululizo na umpeleke hospitali mara moja. Kipindupindu huua ndani ya saa chache kisipotibiwa.'
    },
    keywords: ['cholera', 'kipindupindu', 'rice-water', 'ors', 'diarrhea', 'kuhara', 'emergency', 'dehydration'],
    source: 'Ministry of Health Kenya Cholera Outbreak Guidelines',
    relatedQuestionIds: ['faq-37', 'faq-38']
  },
  {
    id: 'faq-37',
    moduleId: 'm4',
    lessonId: 'm4-l5',
    question: {
      en: 'How do you prepare Oral Rehydration Salts (ORS) accurately at home?',
      sw: 'Unatayarishaje chumvi ya ORS ya kuongeza maji mwilini kwa usahihi nyumbani?'
    },
    answer: {
      en: 'Wash hands with soap. Pour one full sachet of official WHO-standard ORS into exactly one litre of safe drinking water (five 200ml cups). Stir until completely dissolved. Give frequent sips after each loose stool. Discard leftover solution after 24 hours.',
      sw: 'Nawa mikono kwa sabuni. Mimina pakiti nzima ya chumvi ya ORS kwenye lita moja kamili ya maji salama ya kunywa (vikombe 5 vya 200ml). Koroga hadi iyeyuke kabisa. Mnyweshe mgonjwa mara kwa mara baada ya kila kuhara. Tupa maji yaliyobaki baada ya saa 24.'
    },
    keywords: ['ors', 'preparation', '1 litre', 'lita moja', 'chumvi ya sukari', 'rehydration'],
    source: 'WHO / UNICEF Clinical Management of Acute Diarrhea',
    relatedQuestionIds: ['faq-36', 'faq-38']
  },
  {
    id: 'faq-38',
    moduleId: 'm4',
    lessonId: 'm4-l4',
    question: {
      en: 'Why is an open bucket dangerous for storing household drinking water?',
      sw: 'Kwa nini ndoo wazi ni hatari kwa kuhifadhi maji ya kunywa ya nyumbani?'
    },
    answer: {
      en: 'In open buckets, every time someone dips a cup, mug, or unwashed fingers to scoop water, fecal pathogens and bacteria from hands enter the water, contaminating the entire supply. Always use narrow-neck jerrycans with tight lids and taps.',
      sw: 'Kwenye ndoo wazi, kila mtu anapotumbukiza kikombe au vidole kuchota maji, vijidudu vya kinyesi kutoka mikononi vinaingia majini na kuchafua ndoo nzima. Daima tumia mitungi yenye midomo myembamba, vifuniko, au mifereji.'
    },
    keywords: ['bucket', 'ndoo', 'storage', 'dipping', 'contamination', 'jerrycan', 'narrow neck'],
    source: 'CDC Safe Water System Project',
    relatedQuestionIds: ['faq-33', 'faq-39']
  },
  {
    id: 'faq-39',
    moduleId: 'm4',
    lessonId: 'm4-l6',
    question: {
      en: 'How does a rainwater harvesting first-flush diverter work?',
      sw: 'Kichungi cha maji ya kwanza (first-flush diverter) ya mvua kinafanya kazi vipi?'
    },
    answer: {
      en: 'When rain begins, the initial runoff washes away accumulating bird droppings, dust, and rust from the tin roof. A first-flush diverter is a vertical pipe that traps and discards this dirty initial water (approx. 10–20 litres) before directing clean, clear rain into the main storage tank.',
      sw: 'Mvua inapoanza, maji ya kwanza huosha kinyesi cha ndege, vumbi, na kutu ya mabati. Kichungi cha maji ya kwanza ni bomba la wima linalotenga na kumwaga maji hayo machafu ya mwanzo (lita 10-20) kabla maji masafi hayajaanza kuingia ndani ya tanki kuu.'
    },
    keywords: ['rainwater', 'first flush', 'diverter', 'roof', 'kuvuna maji', 'gutters', 'clean water'],
    source: 'Kenya Rainwater Harvesting Association Technical Manual',
    relatedQuestionIds: ['faq-35', 'faq-40']
  },
  {
    id: 'faq-40',
    moduleId: 'm4',
    lessonId: 'm4-l6',
    question: {
      en: 'How can community youth build an ultra-low-cost "Tippy-Tap" handwashing station?',
      sw: 'Vijana wa mtaa wanawezaje kutengeneza kituo cha bei nafuu cha kunawa mikono cha "Tippy-Tap"?'
    },
    answer: {
      en: 'Suspend a 5-litre plastic cooking oil jerrycan from two wooden stakes with string attached to a foot pedal stick. Stepping on the pedal tilts the jug to pour water hands-free. Hang soap inside a perforated tin on a string. It uses only 40ml of water per wash.',
      sw: 'Tundika kibuyu cha lita 5 cha mafuta kwenye nguzo mbili za mti kikiwa na kamba inayoelekea kwenye kijiti cha kukanyaga kwa mguu. Kukanyaga kijiti kunainamisha kibuyu kumwaga maji bila kugusa kwa mikono. Tundika sabuni pembeni. Kinatumia 40ml tu za maji kwa kila unawaji.'
    },
    keywords: ['tippy tap', 'handwashing', 'soap', 'kunawa mikono', 'sabuni', 'hygiene', 'cheap'],
    source: 'UNICEF Water, Sanitation and Hygiene (WASH) in Communities',
    relatedQuestionIds: ['faq-36', 'faq-38'],
    actionGuideRef: 'ag-m4'
  },

  // ==========================================
  // Module 5: Climate Justice (FAQs 41–50)
  // ==========================================
  {
    id: 'faq-41',
    moduleId: 'm5',
    lessonId: 'm5-l1',
    question: {
      en: 'What is the core ethical principle of Climate Justice?',
      sw: 'Ni nini msingi mkuu wa kimaadili wa Haki ya Hali ya Hewa (Climate Justice)?'
    },
    answer: {
      en: 'Climate Justice recognizes that climate change is an ethical and human rights crisis where those who contributed least to greenhouse gas emissions (including African nations and low-income urban residents) suffer the most devastating and immediate impacts, while historical polluters have the resources to insulate themselves.',
      sw: 'Haki ya Tabianchi inatambua kuwa mabadiliko ya tabianchi ni mgogoro wa kimaadili na haki za kibinadamu ambapo wale waliochafua kidogo (wakiwemo nchi za Afrika na wakaazi wa mabanda) ndio wanaopata maumivu na hasara kubwa, huku wachafuzi wakubwa wakiwa na fedha za kujikinga.'
    },
    keywords: ['climate justice', 'haki ya tabianchi', 'ethics', 'human rights', 'equity', 'usawa', 'polluters'],
    source: 'Mary Robinson Foundation Principles of Climate Justice',
    relatedQuestionIds: ['faq-42', 'faq-43']
  },
  {
    id: 'faq-42',
    moduleId: 'm5',
    lessonId: 'm5-l1',
    question: {
      en: 'What does CBDR-RC mean in international climate treaties?',
      sw: 'CBDR-RC inamaanisha nini katika mikataba ya kimataifa ya tabianchi?'
    },
    answer: {
      en: 'Common But Differentiated Responsibilities and Respective Capabilities. It establishes that while all nations share responsibility to protect Earth’s atmosphere, developed nations must provide financing and technology to developing nations because they produced the vast majority of historical emissions and possess greater financial capacity.',
      sw: 'Wajibu wa Pamoja Lakini Uliotofautishwa kulingana na Uwezo. Inasisitiza kuwa nchi zote zina wajibu wa kutunza dunia, lakini nchi tajiri lazima zitoe fedha na teknolojia kwa nchi zinazoendelea kwa sababu ndizo zilizochafua hewa kihistoria na zina utajiri mkubwa.'
    },
    keywords: ['cbdr-rc', 'paris agreement', 'mkataba wa paris', 'differentiated', 'responsibilities', 'finance'],
    source: 'UNFCCC Paris Agreement Article 2',
    relatedQuestionIds: ['faq-41', 'faq-43']
  },
  {
    id: 'faq-43',
    moduleId: 'm5',
    lessonId: 'm5-l2',
    question: {
      en: 'What is the "Adaptation Gap" in low-income African urban areas?',
      sw: 'Pengo la Kukabiliana (Adaptation Gap) ni nini katika maeneo ya miji duni ya Afrika?'
    },
    answer: {
      en: 'The Adaptation Gap is the vast deficit between the actual adaptation measures and financing provided to vulnerable communities and the actual protective infrastructure (culverts, safe housing, clinics) urgently needed to save lives from ongoing climate impacts.',
      sw: 'Pengo la Kukabiliana ni tofauti kubwa kati ya hatua halisi na fedha zinazotolewa kusaidia jamii zilizo hatarini na miundombinu halisi ya ulinzi (mitaro mikubwa, makazi imara, zahanati) inayohitajika haraka kuokoa maisha.'
    },
    keywords: ['adaptation gap', 'pengo la kukabiliana', 'finance', 'infrastructure', 'deficit'],
    source: 'UNEP Adaptation Gap Report',
    relatedQuestionIds: ['faq-44', 'faq-49']
  },
  {
    id: 'faq-44',
    moduleId: 'm5',
    lessonId: 'm5-l3',
    question: {
      en: 'Why do climate justice advocates demand equal funding for adaptation alongside mitigation?',
      sw: 'Kwa nini watetezi wa haki ya tabianchi wanadai mgao sawa wa fedha za kukabiliana (adaptation) na kupunguza hewa chafu (mitigation)?'
    },
    answer: {
      en: 'Historically, over 80% of global climate finance was poured into mitigation (wind/solar projects in wealthy countries). Frontline African communities emit virtually no carbon but face life-threatening floods and droughts right now; they desperately need adaptation funding to survive.',
      sw: 'Kihistoria, zaidi ya 80% ya fedha za kimataifa ilienda kwenye kupunguza hewa chafu (miradi ya sola kwenye nchi tajiri). Jamii za Afrika hazichafui hewa lakini zinakabiliwa na mafuriko na ukame sasa hivi; zinahitaji fedha za kukabiliana ili kuishi.'
    },
    keywords: ['mitigation', 'adaptation', 'parity', '50%', 'climate finance', 'fedha za tabianchi'],
    source: 'African Development Bank African Climate Finance Landscape',
    relatedQuestionIds: ['faq-41', 'faq-45']
  },
  {
    id: 'faq-45',
    moduleId: 'm5',
    lessonId: 'm5-l3',
    question: {
      en: 'What is "Loss and Damage" and how does it relate to climate justice?',
      sw: 'Hasara na Uharibifu (Loss and Damage) ni nini na inahusiana vipi na haki ya tabianchi?'
    },
    answer: {
      en: 'Loss and Damage refers to the unavoidable, permanent destruction caused by climate change that goes beyond human capacity to adapt—such as lost lives, ancestral lands swallowed by rivers, or permanent community displacement. Justice requires that historical polluters compensate victims for these irreparable harms.',
      sw: 'Hasara na Uharibifu inarejelea maangamizi ya kudumu na yasiyoepukika yanayozidi uwezo wa binadamu kujikinga—kama vifo vya watu, ardhi iliyosombwa kabisa na mto, au uharibifu wa kudumu. Haki inadai kuwa wachafuzi wakubwa walipe fidia kwa madhara haya.'
    },
    keywords: ['loss and damage', 'hasara na uharibifu', 'compensation', 'fidia', 'cop27', 'unfccc'],
    source: 'UNFCCC Loss and Damage Fund Framework',
    relatedQuestionIds: ['faq-41', 'faq-42']
  },
  {
    id: 'faq-46',
    moduleId: 'm5',
    lessonId: 'm5-l4',
    question: {
      en: 'How does intersectionality explain different climate vulnerabilities in the same neighborhood?',
      sw: 'Makutano ya kijamii (intersectionality) yanaeleza vipi tofauti za hatari ndani ya mtaa mmoja?'
    },
    answer: {
      en: 'Intersectionality shows that climate hazards do not hit people uniformly. Gender roles force women to queue for water at night and scrub flood sewage; physical disability traps people in narrow alleys; and youth unemployment excludes young voices from municipal decisions. Multiple social identities compound vulnerability.',
      sw: 'Makutano ya kijamii yanaonyesha kuwa majanga hayawapigi watu kwa usawa. Majukumu ya kijinsia yanawalazimu wanawake kupanga foleni za maji usiku na kusafisha kinyesi cha mafuriko; ulemavu unawafungia watu kwenye njia nyembamba; na ukosefu wa ajira unawatenga vijana kwenye maamuzi.'
    },
    keywords: ['intersectionality', 'gender', 'disability', 'ulemavu', 'jinsia', 'youth', 'compound vulnerability'],
    source: 'UN Women Climate and Gender Action Guidelines',
    relatedQuestionIds: ['faq-18', 'faq-47']
  },
  {
    id: 'faq-47',
    moduleId: 'm5',
    lessonId: 'm5-l5',
    question: {
      en: 'What is Locally Led Adaptation (LLA)?',
      sw: 'Kukabiliana Kunakoongozwa na Jamii (Locally Led Adaptation - LLA) ni nini?'
    },
    answer: {
      en: 'Locally Led Adaptation is an equity principle ensuring that grassroots communities, youth groups, and women federations have direct authority, resources, and decision-making power over the design, budget, and implementation of climate actions, drawing on their deep local experiential knowledge.',
      sw: 'Kukabiliana Kunakoongozwa na Jamii ni kanuni ya usawa inayohakikisha jamii za mashinani, vikundi vya vijana, na mashirikisho ya wanawake vina mamlaka ya moja kwa moja, fedha, na uamuzi wa kupanga, kubuni, na kutekeleza miradi ya tabianchi kwa kutumia maarifa yao ya mtaa.'
    },
    keywords: ['locally led adaptation', 'lla', 'grassroots', 'mashinani', 'wri', 'principles', 'community'],
    source: 'World Resources Institute (WRI) Principles for Locally Led Adaptation',
    relatedQuestionIds: ['faq-48', 'faq-49']
  },
  {
    id: 'faq-48',
    moduleId: 'm5',
    lessonId: 'm5-l6',
    question: {
      en: 'What is "Maladaptation" and how can communities identify it?',
      sw: 'Makosa ya kukabiliana (Maladaptation) ni nini na jamii inawezaje kuyatambua?'
    },
    answer: {
      en: 'Maladaptation occurs when a project marketed as climate adaptation inadvertently increases vulnerability, locks in unsustainable concrete, or shifts hazards onto poorer neighbors. Example: building an industrial flood barrier that protects a wealthy warehouse while deflecting surging storm waters directly into a neighboring informal village.',
      sw: 'Maladaptation hutokea pale ambapo mradi unaoitwa wa mazingira unazidisha udhaifu bila kukusudia au unahamishia majanga kwa majirani maskini. Mfano: kujenga ukuta unaolinda ghala la tajiri lakini unaoelekeza mafuriko yote kwenye vibanda vya mabanda vya jirani.'
    },
    keywords: ['maladaptation', 'bad adaptation', 'makosa ya kukabiliana', 'unjust', 'deflection', 'floodwall'],
    source: 'IPCC AR6 Working Group II Chapter 17',
    relatedQuestionIds: ['faq-47', 'faq-49'],
    actionGuideRef: 'ag-m5'
  },
  {
    id: 'faq-49',
    moduleId: 'm5',
    lessonId: 'm5-l6',
    question: {
      en: 'What questions are on the Four-Pillar Climate Justice Project Checklist?',
      sw: 'Ni maswali gani yaliyo kwenye Orodha ya Nguzo Nne ya Haki ya Tabianchi?'
    },
    answer: {
      en: '1. Who Decided? (Was there genuine community co-design?); 2. Who Benefits? (Do gains flow to the most vulnerable households?); 3. Who Bears the Burden? (Are there forced evictions or displaced hazards?); 4. Is it Transparent? (Are budgets and contracts publicly posted under Article 35?).',
      sw: '1. Nani Aliamua? (Je, kulikuwa na ushiriki wa kweli wa jamii?); 2. Nani Ananufaika? (Je, faida inawafikia watu walio hatarini?); 3. Nani Anabeba Mzigo? (Je, kuna kubomoa nyumba au kuhamishia mafuriko kwingine?); 4. Je, Kuna Uwazi? (Je, bajeti na mikataba zimewekwa wazi?).'
    },
    keywords: ['checklist', 'four pillars', 'nguzo nne', 'evaluation', 'tathmini', 'transparency'],
    source: 'Constitution of Kenya Article 35 / WRI LLA Framework',
    relatedQuestionIds: ['faq-47', 'faq-48'],
    actionGuideRef: 'ag-m5'
  },
  {
    id: 'faq-50',
    moduleId: 'm5',
    lessonId: 'm5-l2',
    question: {
      en: 'Does Muungano wa Wanavijiji show that informal settlement residents can drive city planning?',
      sw: 'Je, Muungano wa Wanavijiji unaonyesha kuwa wakaazi wa makazi duni wanaweza kuongoza mipango ya jiji?'
    },
    answer: {
      en: 'Yes. Muungano wa Wanavijiji (the Kenyan federation of slum dwellers) has led participatory mapping, community enumerations, and settlement upgrading in Mukuru and Kibera, proving that organized residents can successfully negotiate roads, water kiosks, and flood protections with county authorities.',
      sw: 'Ndio. Muungano wa Wanavijiji umeongoza uchoraji wa ramani shirikishi, sensa za mitaa, na uboreshaji wa makazi Mukuru na Kibera, ukithibitisha kuwa wakaazi waliojipanga wanaweza kujadiliana na serikali ya kaunti na kupata barabara, maji, na mifereji.'
    },
    keywords: ['muungano wa wanavijiji', 'grassroots', 'slum dwellers', 'participatory mapping', 'mukuru', 'kibera'],
    source: 'Muungano wa Wanavijiji Kenya Official Reports',
    relatedQuestionIds: ['faq-10', 'faq-47']
  },

  // ==========================================
  // Module 6: Green Claims and Greenwashing (FAQs 51–60)
  // ==========================================
  {
    id: 'faq-51',
    moduleId: 'm6',
    lessonId: 'm6-l1',
    question: {
      en: 'What is an Environmental Claim and when is it legally substantiated?',
      sw: 'Dai la Kimazingira ni nini na ni lini linapokuwa na uthibitisho wa kisheria?'
    },
    answer: {
      en: 'An environmental claim is any marketing statement, symbol, or badge asserting that a product has positive or reduced negative impacts on nature. It is legally substantiated only when supported by objective, independent scientific testing, verified data, and accredited third-party certification.',
      sw: 'Dai la kimazingira ni kauli, alama, au nembo ya kibiashara inayodai bidhaa ina manufaa au madhara yaliyopunguzwa ya mazingira. Linathibitishwa kisheria pale tu linapoungwa mkono na vipimo huru vya kisayansi na vyeti vya taasisi zilizoidhinishwa za viwango.'
    },
    keywords: ['environmental claim', 'dai la kimazingira', 'substantiated', 'ushahidi', 'marketing', 'standards'],
    source: 'UNEP Product Sustainability Guidelines / ISO 14020',
    relatedQuestionIds: ['faq-52', 'faq-57']
  },
  {
    id: 'faq-52',
    moduleId: 'm6',
    lessonId: 'm6-l2',
    question: {
      en: 'What is Greenwashing in commercial advertising?',
      sw: 'Upotoshaji wa Mazingira (Greenwashing) ni nini katika matangazo ya biashara?'
    },
    answer: {
      en: 'Greenwashing is the deceptive commercial practice of exaggerating, fabricating, or using vague assertions about environmental friendliness to mislead consumers, while continuing polluting or destructive business operations unchanged.',
      sw: 'Greenwashing ni ulaghai wa kibiashara wa kukuza, kutunga, au kutumia maneno yasiyo wazi ya mazingira kuwapotosha wanunuzi, huku kampuni ikiendelea na uchafuzi wake bila kubadilisha uzalishaji.'
    },
    keywords: ['greenwashing', 'upotoshaji wa mazingira', 'deception', 'ulaghai', 'advertising', 'fake green'],
    source: 'Terrachoice Sins of Greenwashing Report',
    relatedQuestionIds: ['faq-51', 'faq-53']
  },
  {
    id: 'faq-53',
    moduleId: 'm6',
    lessonId: 'm6-l2',
    question: {
      en: 'Why are buzzwords like "Eco-Friendly", "Natural", or "Green Choice" considered red flags?',
      sw: 'Kwa nini maneno kama "Eco-Friendly", "Asilia", au "Chaguo la Kijani" yanachukuliwa kama viashiria vya upotoshaji?'
    },
    answer: {
      en: 'Because these words have no standardized legal definition or testing criteria. A company can label a detergent "all-natural" while it contains petroleum-derived surfactants that cause massive fish die-offs in rivers, because petroleum is technically found in nature.',
      sw: 'Kwa sababu maneno hayo hayana fasili sanifu ya kisheria wala vipimo vya maabara. Kampuni inaweza kuita sabuni "asilia" huku ikiwa na kemikali za mafuta ya petroli zinazoua samaki mitoni, kwa sababu petroli inapatikana ardhini kiasili.'
    },
    keywords: ['buzzwords', 'eco-friendly', 'natural', 'green choice', 'red flags', 'maneno yasiyo wazi'],
    source: 'European Commission Guidance on Unfair Commercial Practices',
    relatedQuestionIds: ['faq-52', 'faq-54']
  },
  {
    id: 'faq-54',
    moduleId: 'm6',
    lessonId: 'm6-l2',
    question: {
      en: 'What is a "Hidden Trade-Off" in environmental claims?',
      sw: 'Ni nini "Mabadilishano Yaliyofichwa" (Hidden Trade-Off) katika madai ya mazingira?'
    },
    answer: {
      en: 'A hidden trade-off occurs when a marketer loudly promotes one minor green feature (such as a bottle cap using 5% less plastic) while concealing catastrophic environmental damage across the rest of the product lifecycle (such as pumping millions of unrecyclable plastic bottles into waterways).',
      sw: 'Hutokea pale ambapo mtangazaji anapigia kelele sifa moja ndogo nzuri (kama kizibo kinachotumia 5% plastiki kidogo) huku akificha uharibifu mkubwa unaofanywa na sehemu nyingine za bidhaa (kama kumwaga mamilioni ya chupa zisizooza mitoni).'
    },
    keywords: ['hidden trade-off', 'mabadilishano yaliyofichwa', 'trade-off', 'distraction', 'lifecycle'],
    source: 'Terrachoice Seven Sins of Greenwashing',
    relatedQuestionIds: ['faq-52', 'faq-55']
  },
  {
    id: 'faq-55',
    moduleId: 'm6',
    lessonId: 'm6-l3',
    question: {
      en: 'Why do Carbon Offsets not equal real greenhouse gas emissions reductions?',
      sw: 'Kwa nini Fidia ya Kaboni (Carbon Offsets) si sawa na upunguzaji halisi wa hewa chafu?'
    },
    answer: {
      en: 'A carbon offset is a paper certificate paying for estimated future carbon avoidance or tree planting elsewhere, while the polluter continues burning fossil fuels immediately into the atmosphere. Saplings face risks of fire, drought, and death (permanence risk), while fossil carbon remains warming the climate for centuries.',
      sw: 'Fidia ya kaboni ni cheti cha karatasi kinacholipia makadirio ya miti au miradi ya nje, huku mchafuzi akiendelea kuchoma mafuta angani leo. Miche ya miti inakabiliwa na moto na ukame, wakati hewa chafu ya mafuta inabaki angani ikipasha joto dunia kwa mamia ya miaka.'
    },
    keywords: ['carbon offsets', 'fidia ya kaboni', 'carbon neutral', 'net zero', 'permanence', 'tree planting'],
    source: 'Oxford Principles for Net Zero Aligned Carbon Offsetting',
    relatedQuestionIds: ['faq-43', 'faq-52']
  },
  {
    id: 'faq-56',
    moduleId: 'm6',
    lessonId: 'm6-l4',
    question: {
      en: 'Why is printing "100% Recyclable" on single-use plastics often misleading in Nairobi?',
      sw: 'Kwa nini kuchapisha "100% Inaweza Kurejelezwa" kwenye plastiki za mara moja mara nyingi huwapotosha wanunuzi Nairobi?'
    },
    answer: {
      en: 'Because technical recyclability in an advanced laboratory is meaningless without the practical municipal collection systems in real neighborhoods. In Kibera or Mathare where no separated recycling bins or collection services exist, that "recyclable" bottle inevitably ends up burned in trash piles or washing into the Nairobi River.',
      sw: 'Kwa sababu uwezekano wa kurejeleza kimaabara hauna maana bila mifumo halisi ya manispaa ya kukusanya taka mitaani. Mitaani ambapo hakuna mapipa ya kuchambua taka, chupa hiyo huishia kuchomwa moto au kusombwa na maji kuingia Mto Nairobi.'
    },
    keywords: ['recyclable', 'kurejeleza', 'plastic', 'single-use', 'nairobi river', 'waste management', 'epr'],
    source: 'Kenya Sustainable Waste Management Act 2022',
    relatedQuestionIds: ['faq-12', 'faq-55']
  },
  {
    id: 'faq-57',
    moduleId: 'm6',
    lessonId: 'm6-l5',
    question: {
      en: 'How can you distinguish an authentic eco-label from a fake corporate green seal?',
      sw: 'Unawezaje kutofautisha lebo halisi ya viwango na nembo ya uongo ya kampuni?'
    },
    answer: {
      en: 'Check for accredited independent third-party standards with searchable license registries—such as the Kenya Bureau of Standards (KEBS) Diamond Mark, Forest Stewardship Council (FSC), or Fairtrade. Fake seals are self-created drawings with vague slogans ("Earth Approved", "Green Choice") with zero public audit registries.',
      sw: 'Tafuta alama za taasisi huru za kimataifa au kitaifa zenye nambari za leseni zinazoweza kutafutwa mtandaoni—kama KEBS Diamond Mark, FSC, au Fairtrade. Nembo feki ni michoro ya kampuni yenyewe isiyo na ukaguzi wowote wa maabara.'
    },
    keywords: ['eco-label', 'lebo', 'certification', 'kebs', 'fsc', 'third-party', 'shirika huru'],
    source: 'ISO 14024 Type I Environmental Labelling Standards',
    relatedQuestionIds: ['faq-51', 'faq-58'],
    actionGuideRef: 'ag-m6'
  },
  {
    id: 'faq-58',
    moduleId: 'm6',
    lessonId: 'm6-l5',
    question: {
      en: 'What are the five steps on the Green Claims Verification Checklist?',
      sw: 'Ni zipi hatua tano kwenye Orodha ya Uhakiki wa Madai ya Mazingira?'
    },
    answer: {
      en: '1. Specificity (Reject vague buzzwords; demand exact numbers); 2. Accessible Evidence (Is there a working QR code or public audit?); 3. Third-Party Certification (Who verified it?); 4. Full Life-Cycle (Are there hidden trade-offs?); 5. Local Reality (Does the recycling/disposal system actually exist in Nairobi?).',
      sw: '1. Umaalumu (Kataa maneno yasiyo wazi; dai nambari kamili); 2. Ushahidi Unaofikika (Kuna QR kodi au ripoti ya wazi?); 3. Uthibitisho Huru (Nani aliyekagua?); 4. Mzunguko Mzima wa Maisha (Kuna madhara yaliyofichwa?); 5. Uhalisia wa Mtaa (Je, mfumo upo Nairobi?).'
    },
    keywords: ['checklist', 'five steps', 'hatua tano', 'verification', 'uhakiki', 'greenwashing'],
    source: 'UNEP Product Sustainability Information Guidelines',
    relatedQuestionIds: ['faq-52', 'faq-57'],
    actionGuideRef: 'ag-m6'
  },
  {
    id: 'faq-59',
    moduleId: 'm6',
    lessonId: 'm6-l6',
    question: {
      en: 'Which Kenyan authority investigates and prosecutes misleading environmental advertising?',
      sw: 'Ni mamlaka gani ya Kenya inayochunguza na kuadhibu matangazo ya uongo ya mazingira?'
    },
    answer: {
      en: 'The Competition Authority of Kenya (CAK) under Sections 55 and 56 of the Competition Act (No. 12 of 2010). CAK enforces consumer protection against false representations and misleading claims, and can impose substantial financial penalties on deceptive companies.',
      sw: 'Mamlaka ya Ushindani ya Kenya (CAK) chini ya Vifungu vya 55 na 56 vya Sheria ya Ushindani ya 2010. CAK inalinda walaji dhidi ya maelezo ya uongo na inaweza kutoza faini kubwa makampuni yanayodanganya umma.'
    },
    keywords: ['competition authority of kenya', 'cak', 'consumer protection', 'ulinzi wa mlaji', 'penalties', 'faini'],
    source: 'Competition Authority of Kenya Act (No. 12 of 2010)',
    relatedQuestionIds: ['faq-51', 'faq-60']
  },
  {
    id: 'faq-60',
    moduleId: 'm6',
    lessonId: 'm6-l4',
    question: {
      en: 'What is Extended Producer Responsibility (EPR) under Kenya law?',
      sw: 'Wajibu Ulioongezwa wa Mzalishaji (EPR) ni nini chini ya sheria za Kenya?'
    },
    answer: {
      en: 'Under Kenya’s Sustainable Waste Management Act 2022, Extended Producer Responsibility legally obligates manufacturers and brand owners to establish and finance collection, take-back, and recycling systems for their products and packaging across their post-consumer lifespan.',
      sw: 'Chini ya Sheria ya Taka ya Kenya ya 2022, EPR inawalazimisha wazalishaji na wenye viwanda kisheria kuweka na kugharamia mifumo ya kuokota na kurejeleza taka za vifungashio vya bidhaa zao baada ya wananchi kuzitumia.'
    },
    keywords: ['epr', 'extended producer responsibility', 'waste management act 2022', 'manufacturers', 'recycling'],
    source: 'Kenya Sustainable Waste Management Act 2022 Section 13',
    relatedQuestionIds: ['faq-12', 'faq-56']
  },

  // ==========================================
  // Module 7: Safe Civic Participation (FAQs 61–70)
  // ==========================================
  {
    id: 'faq-61',
    moduleId: 'm7',
    lessonId: 'm7-l1',
    question: {
      en: 'Is public participation in Kenya a constitutional right or just a government courtesy?',
      sw: 'Je, ushiriki wa umma nchini Kenya ni haki ya kikatiba au ni hisani tu ya serikali?'
    },
    answer: {
      en: 'It is a mandatory, legally binding constitutional right. Under Article 10 of the Constitution of Kenya (2010), public participation is a mandatory national value that binds all state organs and public officers. Courts have repeatedly struck down laws and county budgets passed without meaningful citizen consultation.',
      sw: 'Ni haki ya lazima ya kikatiba inayofunga kisheria. Chini ya Kifungu cha 10 cha Katiba ya Kenya, ushiriki wa umma ni thamani ya lazima ya kitaifa. Mahakama Kuu imefutilia mbali sheria na bajeti nyingi zilizopitishwa bila ushiriki halisi wa wananchi.'
    },
    keywords: ['public participation', 'ushiriki wa umma', 'article 10', 'kifungu cha 10', 'constitution', 'katiba', 'right'],
    source: 'Constitution of Kenya (2010) Articles 10, 118, 174',
    relatedQuestionIds: ['faq-62', 'faq-63']
  },
  {
    id: 'faq-62',
    moduleId: 'm7',
    lessonId: 'm7-l1',
    question: {
      en: 'What does Article 42 of the Kenyan Constitution guarantee every citizen?',
      sw: 'Kifungu cha 42 cha Katiba ya Kenya kinampa kila raia uhakika gani?'
    },
    answer: {
      en: 'Article 42 guarantees every person the fundamental right to a clean and healthy environment, which includes the right to have the environment protected for the benefit of present and future generations through legislative and other measures.',
      sw: 'Kifungu cha 42 kinampa kila mtu haki ya msingi ya kuishi katika mazingira safi na yenye afya, ikijumuisha haki ya mazingira kulindwa kwa manufaa ya vizazi vya sasa na vijavyo kupitia sheria na hatua zingine.'
    },
    keywords: ['article 42', 'kifungu cha 42', 'clean and healthy environment', 'mazingira safi', 'environmental rights'],
    source: 'Constitution of Kenya (2010) Article 42',
    relatedQuestionIds: ['faq-61', 'faq-64']
  },
  {
    id: 'faq-63',
    moduleId: 'm7',
    lessonId: 'm7-l2',
    question: {
      en: 'Which level of government is legally responsible for local storm drainage and solid waste in Nairobi?',
      sw: 'Ni ngazi ipi ya serikali inayowajibika kisheria kwa mifereji ya dhoruba na taka ngumu Nairobi?'
    },
    answer: {
      en: 'The Nairobi City County Government (NCCG). Under the Fourth Schedule of the Constitution, storm drainage, refuse collection, solid waste dumpsites, local health clinics, and ward spatial planning are devolved county government functions, not national government responsibilities.',
      sw: 'Serikali ya Kaunti ya Jiji la Nairobi (NCCG). Chini ya Ratiba ya Nne ya Katiba, mifereji ya dhoruba, ukusanyaji wa taka, majalala, zahanati za afya, na mipango ya wadi ni majukumu ya ugatuzi ya kaunti, si ya serikali ya kitaifa.'
    },
    keywords: ['devolution', 'ugatuzi', 'county government', 'nccg', 'storm drainage', 'mifereji', 'solid waste', 'fourth schedule'],
    source: 'Constitution of Kenya Fourth Schedule (Distribution of Functions)',
    relatedQuestionIds: ['faq-64', 'faq-65']
  },
  {
    id: 'faq-64',
    moduleId: 'm7',
    lessonId: 'm7-l2',
    question: {
      en: 'What is the role of a Member of the County Assembly (MCA) in local climate adaptation?',
      sw: 'Ni nini jukumu la Diwani wa Bunge la Kaunti (MCA) katika kukabiliana na tabianchi mtaani?'
    },
    answer: {
      en: 'Your Ward MCA represents your specific ward in the County Assembly, introduces county bills, debates and approves the County Annual Development Plan and Budget, allocates ward development funds for culverts and bridges, and conducts legislative oversight of county projects.',
      sw: 'Diwani wako (MCA) anawakilisha wadi yako katika Bunge la Kaunti, anatunga sheria, anapitisha Mpango wa Maendeleo na Bajeti ya Kaunti, anatenga fedha za mifereji na madaraja ya wadi, na kusimamia ubora wa miradi ya kaunti.'
    },
    keywords: ['mca', 'diwani', 'county assembly', 'bunge la kaunti', 'ward', 'budget', 'oversight'],
    source: 'County Governments Act (No. 17 of 2012)',
    relatedQuestionIds: ['faq-63', 'faq-65']
  },
  {
    id: 'faq-65',
    moduleId: 'm7',
    lessonId: 'm7-l3',
    question: {
      en: 'What is the County Integrated Development Plan (CIDP) and when can citizens shape it?',
      sw: 'Mpango Jumuishi wa Maendeleo wa Kaunti (CIDP) ni nini na lini wananchi wanapoweza kuushawishi?'
    },
    answer: {
      en: 'The CIDP is a mandatory 5-year strategic blueprint guiding all county infrastructure, climate actions, and budgets. Citizens participate during public barazas and town halls convened by the County Executive and Assembly when the draft CIDP is published every five years, and during annual reviews (ADP) every September.',
      sw: 'CIDP ni mpango mkakati wa miaka 5 unaoongoza miundombinu, hatua za mazingira, na bajeti zote za kaunti. Wananchi wanashiriki wakati wa mabaraza ya umma rasimu ya CIDP inapotolewa kila baada ya miaka mitano, na kwenye mapitio ya kila mwaka (ADP) kila mwezi wa Septemba.'
    },
    keywords: ['cidp', 'adp', 'budget cycle', 'mzunguko wa bajeti', 'public baraza', 'town hall'],
    source: 'Public Finance Management Act (2012) Section 125',
    relatedQuestionIds: ['faq-64', 'faq-66']
  },
  {
    id: 'faq-66',
    moduleId: 'm7',
    lessonId: 'm7-l4',
    question: {
      en: 'What is a Written Memorandum and what are its four essential sections?',
      sw: 'Memorandum ya Maandishi ni nini na ina sehemu gani nne kuu za lazima?'
    },
    answer: {
      en: 'A written memorandum is a structured formal submission presented to a government committee. Its four sections are: 1. Introduction (Who you are and community represented); 2. Context & Evidence (Localized problem with photos/data); 3. Concrete Recommendations (Specific, budgeted policy solutions); 4. Constitutional Grounding (Articles 10, 42).',
      sw: 'Memorandum ya maandishi ni nyaraka rasmi inayowasilishwa kwa kamati ya bunge au serikali. Sehemu zake nne ni: 1. Utambulisho (Ninyi ni nani); 2. Changamoto yenye Ushahidi (Picha na maelezo ya mtaa); 3. Mapendekezo Maalum (Kiasi cha bajeti kinachotakiwa); 4. Msingi wa Katiba (Vifungu vya 10 na 42).'
    },
    keywords: ['memorandum', 'written submission', 'bunge la kaunti', 'structure', 'evidence', 'recommendations'],
    source: 'Nairobi County Assembly Standing Orders / KLRC Public Participation Handbook',
    relatedQuestionIds: ['faq-61', 'faq-67'],
    actionGuideRef: 'ag-m7'
  },
  {
    id: 'faq-67',
    moduleId: 'm7',
    lessonId: 'm7-l5',
    question: {
      en: 'How should youth organizers protect their personal digital security during civic campaigns?',
      sw: 'Vijana viongozi wanapaswa kulinda vipi usalama wao wa kidijitali wakati wa kampeni za kiraia?'
    },
    answer: {
      en: 'Enable Two-Factor Authentication (2FA) with an authenticator app (not SMS); use end-to-end encrypted messaging apps (Signal, WhatsApp) with disappearing messages for sensitive logistics; never broadcast home addresses or travel routes; and protect personal data under the Kenya Data Protection Act 2019.',
      sw: 'Washa Uthibitishaji wa Hatua Mbili (2FA) kwa programu ya simu; tumia programu salama za ujumbe (Signal, WhatsApp) zenye jumbe zinazojifuta; kamwe usitangaze anwani ya nyumbani au ratiba za safari; na kulinda taarifa binafsi chini ya Sheria ya Ulinzi wa Data ya 2019.'
    },
    keywords: ['digital security', 'usalama wa kidijitali', '2fa', 'authenticator', 'privacy', 'faragha', 'encryption'],
    source: 'Kenya Data Protection Act (2019) / Digital Rights Africa',
    relatedQuestionIds: ['faq-68', 'faq-69'],
    actionGuideRef: 'ag-m7'
  },
  {
    id: 'faq-68',
    moduleId: 'm7',
    lessonId: 'm7-l5',
    question: {
      en: 'How do you verify whether a dramatic weather alert or flood video on WhatsApp is authentic?',
      sw: 'Unahakiki vipi iwapo video ya kutisha ya mafuriko au tahadhari kwenye WhatsApp ni ya kweli?'
    },
    answer: {
      en: 'Apply the three Ws: Who posted it (check for an official verified account like @KenyaRedCross or @MeteoKenya); When was it recorded (run a Google Reverse Image Search on a screenshot to detect old recycled footage); and Where is official corroboration (check official news portals before forwarding).',
      sw: 'Tumia maswali matatu: Nani aliyeituma (kagua akaunti rasmi za @KenyaRedCross au @MeteoKenya); Lini ilipochukuliwa (tafuta picha kwenye Google Reverse Image Search kugundua video za zamani); na Wapi uthibitisho rasmi ulipo kabla ya kusambaza.'
    },
    keywords: ['fact checking', 'uhakiki', 'misinformation', 'uzushi', 'whatsapp', 'reverse image search', 'red cross'],
    source: 'Africa Check Fact-Checking Guide for Kenya (africacheck.org)',
    relatedQuestionIds: ['faq-8', 'faq-67']
  },
  {
    id: 'faq-69',
    moduleId: 'm7',
    lessonId: 'm7-l6',
    question: {
      en: 'Why is it critical for community climate action plans to remain strictly non-partisan?',
      sw: 'Kwa nini ni muhimu kwa mipango ya mazingira ya jamii kubaki bila kuegemea upande wa kisiasa?'
    },
    answer: {
      en: 'Because flash floods, cholera outbreaks, and extreme heat affect every single neighbor equally, regardless of political party, ethnicity, or voting preferences. Partisan politics divides communities; non-partisan initiatives unite elders, youth, business owners, and faith leaders around shared survival.',
      sw: 'Kwa sababu mafuriko, mlipuko wa kipindupindu, na joto kali humuathiri kila jirani sawa bila kujali chama cha siasa au kabila. Siasa za vyama hugawanya jamii; mipango isiyo ya kisiasa huwaunganisha wazee, vijana, wafanyabiashara, na viongozi wa dini kulinda maisha ya wote.'
    },
    keywords: ['non-partisan', 'isiyoegemea siasa', 'unity', 'umoja', 'community action', 'neutrality'],
    source: 'Constitution of Kenya Preamble and National Cohesion Guidelines',
    relatedQuestionIds: ['faq-61', 'faq-70'],
    actionGuideRef: 'ag-m7'
  },
  {
    id: 'faq-70',
    moduleId: 'm7',
    lessonId: 'm7-l6',
    question: {
      en: 'How can youth combine direct self-help environmental action with formal government advocacy?',
      sw: 'Vijana wanawezaje kuunganisha vitendo vya kujitolea vya mazingira na utetezi rasmi wa kiserikali?'
    },
    answer: {
      en: 'Use a twin-track approach: Take immediate self-reliant action (clearing neighborhood drains, planting trees, installing Tippy-Taps, educating families), while simultaneously documenting evidence and submitting written memoranda to the Ward Administrator and MCA demanding municipal budgets for permanent concrete infrastructure.',
      sw: 'Tumia njia mbili kwa pamoja: Chukua hatua za haraka za kujitolea (kusafisha mitaro, kupanda miti, kuweka vibuyu vya kunawa, kuelimisha familia), huku wakati huo huo ukikusanya ushahidi na kuwasilisha memoranda kwa Msimamizi wa Wadi na Diwani kudai bajeti ya miundombinu ya kudumu ya zege.'
    },
    keywords: ['twin-track', 'self-help', 'advocacy', 'kujitolea', 'utetezi', 'action plan', 'vijana'],
    source: 'UNFCCC Action for Climate Empowerment (ACE) Guidelines',
    relatedQuestionIds: ['faq-10', 'faq-66'],
    actionGuideRef: 'ag-m7'
  }
];
