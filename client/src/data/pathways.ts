export interface LearningPathway {
  id: string;
  slug: string;
  title: string;
  swTitle: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  prerequisites: string[];
  learningOutcomes: string[];
  associatedModuleIds: string[];
  finalProjectId: string;
  finalProjectTitle: string;
  finalProjectBrief: string;
  badge: string;
  accentColor: string;
  description: string;
  swDescription: string;
}

export const climateLearningPathways: LearningPathway[] = [
  {
    id: 'path-science',
    slug: 'climate-science-fundamentals',
    title: 'Climate Science Fundamentals',
    swTitle: 'Misingi ya Sayansi ya Tabianchi',
    category: 'Core Science',
    level: 'beginner',
    durationHours: 12,
    prerequisites: ['Basic secondary-level science or introductory literacy'],
    learningOutcomes: [
      'Differentiate between daily atmospheric weather and 30-year decadal climate trajectories in East Africa.',
      'Explain the atmospheric greenhouse effect, radiative forcing, and heat-trapping mechanisms.',
      'Analyze the Nairobi Urban Heat Island (UHI) effect across informal settlements versus leafy suburbs.',
      'Calculate personal and household greenhouse gas emissions using local East African emission factors.'
    ],
    associatedModuleIds: ['m1'],
    finalProjectId: 'proj-carbon-footprint',
    finalProjectTitle: 'Household & Micro-Enterprise Carbon Footprint Assessment',
    finalProjectBrief: 'Conduct a quantitative carbon audit for a Nairobi household or small vendor. Calculate emissions across cooking fuel (charcoal/LPG), electricity, and matatu transport, and formulate a 3-point reduction roadmap.',
    badge: '🌿 Science Foundation',
    accentColor: '#1b4332',
    description: 'Master the physical mechanics of global warming, tropical climate variability (IOD and ENSO), and East African meteorological records from the Kenya Meteorological Department (KMD).',
    swDescription: 'Jifunze kuhusu misingi ya sayansi ya tabianchi, mabadiliko ya vipindi vya mvua Afrika Mashariki, na athari za joto jijini Nairobi.'
  },
  {
    id: 'path-adaptation',
    slug: 'climate-adaptation-resilience',
    title: 'Climate Change Adaptation & Resilience',
    swTitle: 'Kukabiliana na Ustahimilivu wa Tabianchi',
    category: 'Resilience Engineering',
    level: 'intermediate',
    durationHours: 18,
    prerequisites: ['Climate Science Fundamentals or equivalent community experience'],
    learningOutcomes: [
      'Assess compound flood hazards across the Nairobi River and Mathare riparian basins.',
      'Evaluate extreme heat stress on vulnerable informal settlement dwellers and public health.',
      'Design nature-based flood retention, bioswales, and permeable drainage interventions.',
      'Develop community evacuation early-warning SOPs and localized flood-risk reduction plans.'
    ],
    associatedModuleIds: ['m2', 'm3'],
    finalProjectId: 'proj-flood-reduction',
    finalProjectTitle: 'Community Riparian Flood-Risk Reduction Plan',
    finalProjectBrief: 'Develop an actionable flood-mitigation proposal for an informal settlement along the Nairobi River basin (e.g. Mathare 4A or Mukuru kwa Njenga), incorporating drainage clearing, bioswales, and early-warning alerts.',
    badge: '🛡️ Adaptation Specialist',
    accentColor: '#005f73',
    description: 'Learn practical resilience strategies to protect vulnerable urban and peri-urban African communities against torrential downpours, river overflows, and deadly thermal extremes.',
    swDescription: 'Buni mikakati thabiti ya kulinda jamii zetu dhidi ya mafuriko ya ghafla na mawimbi makali ya joto mijini na vijijini.'
  },
  {
    id: 'path-renewables',
    slug: 'renewable-energy-efficiency',
    title: 'Renewable Energy & Energy Efficiency',
    swTitle: 'Nishati Jadidifu na Matumizi Endelevu',
    category: 'Clean Technology',
    level: 'intermediate',
    durationHours: 15,
    prerequisites: ['Basic numeracy and energy concepts'],
    learningOutcomes: [
      'Evaluate solar photovoltaic (PV) generation potential across equatorial East Africa using peak sun hours (PSH).',
      'Size stand-alone off-grid solar and battery storage systems for health clinics, schools, and agribusinesses.',
      'Analyze clean cooking transitions from biomass charcoal to tier-4 electric induction and biogas.',
      'Develop bankable technical and economic proposals for mini-grids and commercial rooftop solar.'
    ],
    associatedModuleIds: ['m6'],
    finalProjectId: 'proj-solar-proposal',
    finalProjectTitle: 'Community Health Clinic / School Solar-Energy Proposal',
    finalProjectBrief: 'Design a 5kWp off-grid or hybrid solar PV system for an off-grid clinic in peri-urban Nairobi or rural Kenya, including daily load calculation, inverter/battery sizing, and lifecycle cost comparison against diesel generators.',
    badge: '⚡ Clean Energy Lead',
    accentColor: '#e09f3e',
    description: 'Explore the clean energy leapfrog across Africa, featuring geothermal, off-grid solar pay-as-you-go (PAYGO) technology, and the transition to clean cooking.',
    swDescription: 'Gundua fursa za umeme wa jua, nishati safi ya kupikia, na ufanisi wa matumizi ya nishati kote Afrika.'
  },
  {
    id: 'path-agriculture',
    slug: 'sustainable-agriculture-food-systems',
    title: 'Sustainable Agriculture & Food Systems',
    swTitle: 'Kilimo Endelevu na Usalama wa Chakula',
    category: 'Agronomy & Food Security',
    level: 'advanced',
    durationHours: 20,
    prerequisites: ['Climate Change Adaptation or rural agricultural background'],
    learningOutcomes: [
      'Formulate drought-tolerant cropping calendars responding to bimodal rainfall shifts.',
      'Apply soil conservation, agroforestry, rainwater harvesting (zaï pits and half-moons), and drip irrigation.',
      'Implement biological pest management strategies against climate-exacerbated crop diseases.',
      'Structure cooperative post-harvest cold storage powered by off-grid solar to prevent market spoilage.'
    ],
    associatedModuleIds: ['m4'],
    finalProjectId: 'proj-farming-plan',
    finalProjectTitle: 'Climate-Resilient Agroforestry & Watershed Plan (Kenya ASALs)',
    finalProjectBrief: 'Draft a comprehensive farm adaptation plan for a 2-hectare mixed farm in Eastern Kenya (Makueni or Machakos County) facing erratic rainfall, incorporating drought-resistant crops, zaï pits, contour stone bunds, and solar drip irrigation.',
    badge: '🌾 Resilient Agronomist',
    accentColor: '#2d6a4f',
    description: 'Equip African smallholder farmers and food entrepreneurs with regenerative, water-wise practices that boost crop yields while sequestering carbon in living soils.',
    swDescription: 'Mbinu za kisasa za kilimo kinachostahimili ukame, uvunaji wa maji ya mvua, na utunzaji wa ardhi kwa wakulima wadogo.'
  },
  {
    id: 'path-finance',
    slug: 'climate-finance-green-entrepreneurship',
    title: 'Climate Finance & Green Entrepreneurship',
    swTitle: 'Fedha za Tabianchi na Ujasiriamali wa Kijani',
    category: 'Green Economics',
    level: 'intermediate',
    durationHours: 16,
    prerequisites: ['Basic accounting or business development basics'],
    learningOutcomes: [
      'Critically analyze African carbon markets, Article 6 of the Paris Agreement, and voluntary carbon credits.',
      'Detect greenwashing, unverified tree-planting claims, and carbon piracy on indigenous lands.',
      'Navigate multilateral climate funds (Green Climate Fund, Adaptation Fund, Loss and Damage Facility).',
      'Pitch sustainable circular economy business models to impact investors and blended finance facilities.'
    ],
    associatedModuleIds: ['m6'],
    finalProjectId: 'proj-tree-planting',
    finalProjectTitle: 'Community Tree-Planting & Carbon Integrity Proposal',
    finalProjectBrief: 'Structure a verifiable community agroforestry project in Karura/Ngong or rural East Africa. Formulate survival rate monitoring protocols, community revenue sharing (minimum 60%), and third-party audit methodologies.',
    badge: '💼 Green Enterprise Fellow',
    accentColor: '#588157',
    description: 'Demystify international climate finance, Loss and Damage, carbon offset credibility, and how African startups can access patient capital for ecological innovation.',
    swDescription: 'Jifunze kuhusu soko la kaboni, kuepuka ulaghai wa kijani (greenwashing), na kupata mitaji ya kuanzisha biashara za mazingira.'
  },
  {
    id: 'path-policy',
    slug: 'climate-policy-environmental-justice',
    title: 'Climate Policy, Environmental Justice & Community Action',
    swTitle: 'Sera za Tabianchi, Haki za Mazingira na Hatua za Jamii',
    category: 'Governance & Civic Power',
    level: 'advanced',
    durationHours: 18,
    prerequisites: ['Civic participation basics or local community organizing background'],
    learningOutcomes: [
      'Examine Kenya’s Climate Change Act (Amended 2023), Article 42 of the Constitution, and County Climate Action Plans.',
      'Analyze the historical responsibility and unequal burden of climate disaster on the Global South.',
      'Apply public participation frameworks to municipal environmental impact assessments (EIAs).',
      'Organize peaceful, legally protected civic mobilizations advocating for urban climate justice.'
    ],
    associatedModuleIds: ['m5', 'm7'],
    finalProjectId: 'proj-policy-advocacy',
    finalProjectTitle: 'County Climate Justice Policy & Civic Advocacy Plan',
    finalProjectBrief: 'Draft a municipal advocacy brief for Nairobi City County Government demanding budget allocation for stormwater infrastructure in informal settlements, citing constitutional environmental rights and public health data.',
    badge: '⚖️ Climate Justice Advocate',
    accentColor: '#6b2d5c',
    description: 'Harness the law, human rights frameworks, African Union Agenda 2063, and grassroot community organizing to hold leaders accountable for climate action.',
    swDescription: 'Kuelewa sheria za mazingira za Kenya, Katiba ya 2010, na jinsi ya kushiriki katika maamuzi ya serikali ya kaunti kulinda haki za raia.'
  }
];
