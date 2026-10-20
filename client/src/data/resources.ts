import { 
  Scale, 
  Building2, 
  CloudRain, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Users, 
  ShieldCheck, 
  Megaphone 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ResourceCategory =
  | 'kenyan-law-policy'
  | 'nairobi-plans-adaptation'
  | 'official-climate-forecasts'
  | 'flood-emergency'
  | 'heat-health'
  | 'water-safety'
  | 'climate-justice-education'
  | 'green-claims-literacy'
  | 'youth-civic-participation';

export interface ResourceData {
  id: string;
  category: ResourceCategory;
  title: string;
  titleSw: string;
  description: string;
  descriptionSw: string;
  source: string;
  url: string;
  whyUseful: { en: string; sw: string };
  sourceType: 'official-legal' | 'official-policy' | 'official-forecast' | 'public-health-guidance' | 'emergency-operations' | 'educational-publication';
  dateOrVersion: string;
}

export const resourceCategories: { id: ResourceCategory; titleEn: string; titleSw: string; icon: LucideIcon }[] = [
  {
    id: 'kenyan-law-policy',
    titleEn: 'Kenyan Climate Law & Policy',
    titleSw: 'Sheria na Sera za Tabianchi Kenya',
    icon: Scale
  },
  {
    id: 'nairobi-plans-adaptation',
    titleEn: 'Nairobi Climate Plans & Urban Adaptation',
    titleSw: 'Mipango ya Tabianchi na Makazi ya Nairobi',
    icon: Building2
  },
  {
    id: 'official-climate-forecasts',
    titleEn: 'Official Climate Info & Seasonal Forecasts',
    titleSw: 'Taarifa Rasmi za Hali ya Hewa na Misimu',
    icon: CloudRain
  },
  {
    id: 'flood-emergency',
    titleEn: 'Flood Preparedness & Emergency Resources',
    titleSw: 'Maandalizi ya Mafuriko na Dharura',
    icon: AlertTriangle
  },
  {
    id: 'heat-health',
    titleEn: 'Heat & Public Health Guidance',
    titleSw: 'Mwongozo wa Joto na Afya ya Umma',
    icon: Thermometer
  },
  {
    id: 'water-safety',
    titleEn: 'Water Safety & Disease Prevention',
    titleSw: 'Usalama wa Maji na Kuzuia Magonjwa',
    icon: Droplets
  },
  {
    id: 'climate-justice-education',
    titleEn: 'Climate Justice & Locally Led Adaptation',
    titleSw: 'Haki ya Tabianchi na Uongozi wa Jamii',
    icon: Users
  },
  {
    id: 'green-claims-literacy',
    titleEn: 'Environmental Claims & Consumer Protection',
    titleSw: 'Madai ya Mazingira na Ulinzi wa Mlaji',
    icon: ShieldCheck
  },
  {
    id: 'youth-civic-participation',
    titleEn: 'Youth Civic Participation & Public Action',
    titleSw: 'Ushiriki wa Vijana na Hatua za Umma',
    icon: Megaphone
  }
];

export const resources: ResourceData[] = [
  // 1. Kenyan climate law and policy
  {
    id: 'climate-change-act-2016',
    category: 'kenyan-law-policy',
    title: 'Kenya Climate Change Act 2016 (Amended 2023)',
    titleSw: 'Sheria ya Mabadiliko ya Tabianchi ya Kenya ya 2016 (Iliyofanyiwa Marekebisho 2023)',
    description: 'The principal statutory framework guiding national and county government climate actions, institutional mechanisms, carbon markets, and climate finance.',
    descriptionSw: 'Sheria kuu inayoongoza mipango ya mazingira ya serikali ya kitaifa na kaunti, mifumo ya fedha za tabianchi, na masoko ya kaboni.',
    source: 'National Council for Law Reporting (Kenya Law)',
    url: 'https://new.kenyalaw.org/akn/ke/act/2016/11/eng%402022-12-31',
    whyUseful: {
      en: 'Provides the formal legal basis for citizen participation, County Climate Change Funds, and local climate mainstreaming.',
      sw: 'Inatoa msingi rasmi wa kisheria wa ushiriki wa wananchi, Mifuko ya Tabianchi ya Kaunti, na mipango ya mitaa.'
    },
    sourceType: 'official-legal',
    dateOrVersion: 'Act No. 11 of 2016 (Rev. 2023)'
  },
  {
    id: 'constitution-of-kenya-2010',
    category: 'kenyan-law-policy',
    title: 'Constitution of Kenya (2010) - Articles 10, 42, 69, 70',
    titleSw: 'Katiba ya Kenya (2010) - Vifungu vya 10, 42, 69, 70',
    description: 'The supreme law of Kenya establishing sovereign power of the people, mandatory public participation, and the fundamental right to a clean and healthy environment.',
    descriptionSw: 'Sheria kuu ya nchi inayoweka mamlaka mikononi mwa wananchi, ushiriki wa umma wa lazima, na haki ya kuishi katika mazingira safi na salama.',
    source: 'Republic of Kenya / Kenya Law',
    url: 'https://new.kenyalaw.org/akn/ke/act/2010/constitution/eng%402010-08-27',
    whyUseful: {
      en: 'Essential legal foundation for holding authorities accountable for pollution, blocked drainage, and unconstitutional evictions.',
      sw: 'Msingi muhimu wa kisheria wa kuwawajibisha viongozi kwa uchafuzi, mitaro iliyoziba, na ubomoaji usio wa haki.'
    },
    sourceType: 'official-legal',
    dateOrVersion: 'Enacted 27 August 2010'
  },

  // 2. Nairobi climate plans and urban adaptation
  {
    id: 'nairobi-climate-action-plan',
    category: 'nairobi-plans-adaptation',
    title: 'Nairobi City County Climate Action Plan 2020–2050',
    titleSw: 'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050',
    description: 'Strategic roadmap outlining Nairobi’s decarbonization targets, urban heat island mitigation, stormwater management, and green mobility priorities.',
    descriptionSw: 'Mwongozo mkakati unaoainisha malengo ya Nairobi ya kupunguza hewa chafu, kuzuia joto mijini, kusimamia maji ya dhoruba, na usafiri safi.',
    source: 'Nairobi City County Government (NCCG)',
    url: 'https://nairobi.go.ke/climate-action-plan-2020-2050',
    whyUseful: {
      en: 'Identifies official county priorities, municipal budgets, and planned infrastructure interventions across all seventeen sub-counties.',
      sw: 'Inaainisha vipaumbele rasmi vya kaunti, bajeti za manispaa, na miundombinu iliyopangwa katika kaunti ndogo zote 17.'
    },
    sourceType: 'official-policy',
    dateOrVersion: 'Published 2020 (Operational to 2050)'
  },
  {
    id: 'kippra-nairobi-climate-plan',
    category: 'nairobi-plans-adaptation',
    title: 'KIPPRA Repository - Nairobi Climate Action Plan Full Analysis',
    titleSw: 'Hifadhi ya KIPPRA - Uchambuzi Kamili wa Mpango wa Tabianchi wa Nairobi',
    description: 'Public policy repository access to the comprehensive scientific baselines, greenhouse gas inventory, and vulnerability assessments of Nairobi County.',
    descriptionSw: 'Hifadhi ya sera za umma inayotoa uchambuzi kamili wa kisayansi wa viwango vya hewa chafu na maeneo hatarishi ya Kaunti ya Nairobi.',
    source: 'Kenya Institute for Public Policy Research and Analysis (KIPPRA)',
    url: 'https://repository.kippra.or.ke/items/8f93f334-1dcc-4bfc-8615-b357180fe067',
    whyUseful: {
      en: 'Provides empirical data on flood risk in informal settlements and municipal solid waste generation.',
      sw: 'Inatoa takwimu za kweli kuhusu hatari ya mafuriko kwenye makazi duni na kiasi cha taka ngumu kinachozalishwa.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'Document Ref: KIPPRA-NCC-2021'
  },

  // 3. Official climate information and seasonal forecasts
  {
    id: 'kmd-seasonal-forecasts',
    category: 'official-climate-forecasts',
    title: 'Kenya Meteorological Department - Official Seasonal Weather Forecasts',
    titleSw: 'Idara ya Hali ya Hewa ya Kenya - Utabiri Rasmi wa Misimu ya Mvua',
    description: 'Official authoritative seasonal weather outlooks for the March-April-May (MAM) and October-November-December (OND) rains in Kenya.',
    descriptionSw: 'Utabiri rasmi wa hali ya hewa wa msimu wa Mvua Ndefu (Machi-Mei) na Mvua Fupi (Oktoba-Desemba) kote nchini Kenya.',
    source: 'Kenya Meteorological Department (KMD)',
    url: 'https://meteo.go.ke/our-products/seasonal-forecast/',
    whyUseful: {
      en: 'Primary authentic source for early seasonal warnings, rainfall distribution forecasts, and flood advisories in Nairobi County.',
      sw: 'Chanzo kikuu cha kuaminika cha tahadhari za mapema za hali ya hewa, mtawanyiko wa mvua, na hatari za mafuriko Nairobi.'
    },
    sourceType: 'official-forecast',
    dateOrVersion: 'Updated Seasonally (Continuous)'
  },
  {
    id: 'kmd-nairobi-county-weather',
    category: 'official-climate-forecasts',
    title: 'KMD Nairobi County Daily and Seven-Day Weather Bulletins',
    titleSw: 'KMD Taarifa za Kila Siku na Siku Saba za Hali ya Hewa Nairobi',
    description: 'High-resolution localized weekly weather alerts and expected temperature and precipitation peaks across Nairobi sub-counties.',
    descriptionSw: 'Tahadhari za kila wiki za hali ya hewa, viwango vya joto, na mvua inayotarajiwa katika maeneo mbalimbali ya Nairobi.',
    source: 'Kenya Meteorological Department - County Director of Meteorology',
    url: 'https://meteo.go.ke/index.php/county-forecasts/',
    whyUseful: {
      en: 'Enables neighborhood youth groups and vendors to anticipate extreme rain or heat days 7 days in advance.',
      sw: 'Inawawezesha vijana na wafanyabiashara wa mitaani kujiandaa na siku za mvua kubwa au joto kali siku 7 kabla.'
    },
    sourceType: 'official-forecast',
    dateOrVersion: 'Updated Daily/Weekly'
  },

  // 4. Flood preparedness and emergency resources
  {
    id: 'kenya-red-cross-floods',
    category: 'flood-emergency',
    title: 'Kenya Red Cross Society - National Flood Operations & Safety Guide',
    titleSw: 'Shirika la Msalaba Mwekundu Kenya - Shughuli za Mafuriko na Mwongozo wa Usalama',
    description: 'National humanitarian disaster response protocols, flood warning dissemination, tracing services, and safe evacuation guidelines.',
    descriptionSw: 'Miongozo ya kitaifa ya uokoaji wa majanga, utoaji wa tahadhari za mafuriko, na usaidizi wa dharura wa kibinadamu.',
    source: 'Kenya Red Cross Society (KRCS)',
    url: 'https://redcross.or.ke/floods/',
    whyUseful: {
      en: 'Authoritative life-safety guidance on what to do during urban flash floods and how to contact regional emergency response teams.',
      sw: 'Mwongozo rasmi wa kulinda maisha wakati wa mafuriko ya ghafla na nambari za simu za kupata timu za uokoaji.'
    },
    sourceType: 'emergency-operations',
    dateOrVersion: 'Updated Annually during Rainy Seasons'
  },
  {
    id: 'nema-riparian-guidelines',
    category: 'flood-emergency',
    title: 'NEMA - Riparian Reserve and Wetland Protection Guidelines',
    titleSw: 'NEMA - Miongozo ya Ukanda wa Hifadhi ya Mito na Ardhi Oevu',
    description: 'National regulations defining statutory river reserve buffers, restrictions on dumping solid waste in watercourses, and EIA requirements.',
    descriptionSw: 'Kanuni za kitaifa zinazoeleza ukanda wa hifadhi ya kingo za mito, makatazo ya kutupa taka mitoni, na tathmini ya mazingira ya EIA.',
    source: 'National Environment Management Authority (NEMA Kenya)',
    url: 'https://www.nema.go.ke/',
    whyUseful: {
      en: 'Empowers communities to stop unauthorized building in natural waterways and demand enforcement against illegal waste dumping.',
      sw: 'Inaiwezesha jamii kuzuia ujenzi haramu kwenye mikondo ya maji na kudai hatua dhidi ya wanaotupa taka mitoni.'
    },
    sourceType: 'official-legal',
    dateOrVersion: 'EMCA Regulations on Wetlands & Riverbanks'
  },

  // 5. Heat and public-health guidance
  {
    id: 'who-heat-and-health',
    category: 'heat-health',
    title: 'WHO Fact Sheet: Climate Change, Heat and Health',
    titleSw: 'Ukweli Kuhusu Mabadiliko ya Tabianchi, Joto na Afya wa WHO',
    description: 'Global medical guidance on physiological mechanisms of heat exhaustion and heatstroke, vulnerable demographics, and public health cooling interventions.',
    descriptionSw: 'Mwongozo wa kitabibu wa dunia kuhusu jinsi joto linavyoathiri mwili wa binadamu, dalili za kiharusi cha joto, na njia za kujipoza.',
    source: 'World Health Organization (WHO)',
    url: 'https://www.who.int/en/news-room/fact-sheets/detail/climate-change-heat-and-health',
    whyUseful: {
      en: 'Gold standard clinical advice for identifying heat emergencies, hydrating correctly, and protecting infants, elderly, and outdoor workers.',
      sw: 'Mwongozo bora wa kisayansi wa kutambua dharura za joto kali, kunywa maji vizuri, na kulinda watoto na wazee.'
    },
    sourceType: 'public-health-guidance',
    dateOrVersion: 'Fact Sheet (Updated 2024)'
  },
  {
    id: 'who-climate-and-health-hub',
    category: 'heat-health',
    title: 'WHO Global Climate Change and Health Knowledge Hub',
    titleSw: 'Kituo Kikuu cha WHO cha Mabadiliko ya Tabianchi na Afya Duniani',
    description: 'Comprehensive research and policy publications on the intersection of urban warming, air pollution, vector-borne infections, and mental health.',
    descriptionSw: 'Tafiti kamili za kisayansi na sera kuhusu jinsi ongezeko la joto linavyochangia uchafuzi wa hewa na magonjwa ya kuambukiza.',
    source: 'World Health Organization (WHO)',
    url: 'https://www.who.int/teams/environment-climate-change-and-health/climate-change-and-health',
    whyUseful: {
      en: 'Clear scientific summaries of the health co-benefits of urban tree planting, passive ventilation, and active transit.',
      sw: 'Ushahidi thabiti wa kisayansi unaothibitisha faida za kiafya za kupanda miti na kuboresha madirisha ya nyumba.'
    },
    sourceType: 'public-health-guidance',
    dateOrVersion: 'Continuous Global Health Portal'
  },

  // 6. Water safety and disease prevention
  {
    id: 'ministry-of-health-kenya',
    category: 'water-safety',
    title: 'Ministry of Health Kenya - Waterborne Disease Prevention & Hygiene',
    titleSw: 'Wizara ya Afya Kenya - Kuzuia Magonjwa ya Maji na Usafi wa Mazingira',
    description: 'Official national protocols on household water chlorination dosage, cholera emergency preparedness, and Community Health Promoter (CHP) guidelines.',
    descriptionSw: 'Miongozo rasmi ya serikali kuhusu vipimo vya kutibu maji kwa klorini, kujiandaa na kipindupindu, na majukumu ya wahudumu wa afya wa jamii.',
    source: 'Ministry of Health (MoH Kenya)',
    url: 'https://health.go.ke/',
    whyUseful: {
      en: 'Official public-health standard for certified water treatment dosages, preventing toxic over-dosing, and safe hydration with ORS.',
      sw: 'Kiwango rasmi cha kitaifa cha vipimo salama vya dawa za maji na namna sahihi ya kutumia chumvi ya ORS kuzuia vifo vya kuhara.'
    },
    sourceType: 'public-health-guidance',
    dateOrVersion: 'Kenya National Cholera Elimination Plan'
  },
  {
    id: 'sustainable-waste-management-act',
    category: 'water-safety',
    title: 'Kenya Sustainable Waste Management Act 2022',
    titleSw: 'Sheria ya Usimamizi Endelevu wa Taka ya Kenya ya 2022',
    description: 'Groundbreaking statute mandating segregation of waste at source, closing open dumpsites, and holding producers responsible for packaging lifecycle.',
    descriptionSw: 'Sheria inayolazimisha kuchambua taka kwenye chanzo, kufunga majalala haramu, na kuwawajibisha wenye viwanda kusafisha taka za vifungashio.',
    source: 'Republic of Kenya / Kenya Law',
    url: 'https://new.kenyalaw.org/akn/ke/act/2022/31/eng%402022-07-12',
    whyUseful: {
      en: 'Provides the legal foundation for youth waste-segregation enterprises and demands county provision of waste collection skips.',
      sw: 'Inatoa msingi wa kisheria kwa vijana kuanzisha biashara za taka na kudai serikali ya kaunti ilete mapipa ya taka mitaani.'
    },
    sourceType: 'official-legal',
    dateOrVersion: 'Act No. 31 of 2022'
  },

  // 7. Climate justice and adaptation education
  {
    id: 'unfccc-adaptation-education',
    category: 'climate-justice-education',
    title: 'UNFCCC - Enhancing Adaptation Action Through Education and Public Participation',
    titleSw: 'UNFCCC - Kuimarisha Hatua za Kukabiliana Kupitia Elimu na Ushiriki wa Umma',
    description: 'Technical guidance paper examining best practices for youth engagement, community empowerment, and equity in adaptation planning.',
    descriptionSw: 'Ripoti ya kiufundi ya Umoja wa Mataifa inayochunguza mbinu bora za kushirikisha vijana na jamii katika mipango ya tabianchi.',
    source: 'United Nations Framework Convention on Climate Change (UNFCCC)',
    url: 'https://unfccc.int/topics/adaptation-and-resilience/resources/publications/opportunities-and-options-for-enhancing-adaptation-action-through-education-and-training-and-public',
    whyUseful: {
      en: 'Connects grassroots youth adaptation efforts with Article 6 (Action for Climate Empowerment) of the international climate convention.',
      sw: 'Inaunganisha juhudi za vijana wa mitaani na Kifungu cha 6 cha mikataba ya kimataifa ya elimu ya tabianchi.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'UNFCCC Technical Paper FCCC/TP/2014/3'
  },
  {
    id: 'wri-principles-lla',
    category: 'climate-justice-education',
    title: 'WRI - Principles for Locally Led Adaptation (LLA)',
    titleSw: 'WRI - Misingi ya Kukabiliana Kunakoongozwa na Jamii (LLA)',
    description: 'The internationally endorsed framework of eight principles ensuring grassroots communities have decision-making power and direct finance.',
    descriptionSw: 'Misingi minane inayotambulika duniani inayohakikisha jamii za mashinani zina mamlaka ya kuamua na kupokea fedha za tabianchi.',
    source: 'World Resources Institute (WRI) & Global Commission on Adaptation',
    url: 'https://www.wri.org/initiatives/locally-led-adaptation',
    whyUseful: {
      en: 'Provides criteria for assessing whether donor and municipal adaptation projects are genuinely community-led or merely cosmetic.',
      sw: 'Inatoa vigezo vya kupima kama miradi ya kaunti au ya wafadhili inaongozwa na wananchi kweli au ni ya kujionyesha tu.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'Published 2021'
  },
  {
    id: 'muungano-wa-wanavijiji',
    category: 'climate-justice-education',
    title: 'Muungano wa Wanavijiji - Grassroots Federation of Slum Dwellers',
    titleSw: 'Muungano wa Wanavijiji - Shirikisho la Mashinani la Wakaazi wa Makazi Duni',
    description: 'Kenyan federation documentation of community profiling, participatory planning, tenure security, and river rehabilitation along Nairobi rivers.',
    descriptionSw: 'Uzoefu na nyaraka za shirikisho la Kenya la wakaazi wa makazi duni kuhusu uchoraji ramani za mitaa na ukarabati wa mito ya Nairobi.',
    source: 'Muungano wa Wanavijiji Kenya',
    url: 'https://www.muungano.net/',
    whyUseful: {
      en: 'Real-world Nairobi case studies of how informal settlement residents successfully organized to shape city planning and flood protection.',
      sw: 'Mifano halisi ya Nairobi ya jinsi wakaazi wa mitaa ya mabanda walivyojiunga pamoja kushawishi mipango ya jiji na kuzuia mafuriko.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'Continuous Grassroots Resource'
  },

  // 8. Environmental-claims literacy
  {
    id: 'competition-authority-kenya',
    category: 'green-claims-literacy',
    title: 'Competition Authority of Kenya - Consumer Protection Guidelines',
    titleSw: 'Mamlaka ya Ushindani ya Kenya - Miongozo ya Ulinzi wa Mlaji',
    description: 'Statutory consumer rights framework prohibiting false representations, misleading advertisements, and deceptive trade practices in Kenya.',
    descriptionSw: 'Mwongozo wa kisheria unaolinda haki za walaji dhidi ya matangazo ya uongo, udanganyifu, na upotoshaji wa kibiashara nchini Kenya.',
    source: 'Competition Authority of Kenya (CAK)',
    url: 'https://cak.go.ke/consumer-protection/',
    whyUseful: {
      en: 'Explains how citizens can report greenwashing companies that advertise fake environmental benefits or unverified recycling claims.',
      sw: 'Inaeleza jinsi wananchi wanavyoweza kuripoti makampuni yanayodanganya umma kwa matangazo ya uongo ya mazingira.'
    },
    sourceType: 'official-legal',
    dateOrVersion: 'Competition Act (No. 12 of 2010)'
  },
  {
    id: 'unep-product-sustainability-guidelines',
    category: 'green-claims-literacy',
    title: 'UNEP - Guidelines for Providing Product Sustainability Information',
    titleSw: 'Miongozo ya UNEP ya Kutoa Taarifa za Uendelevu wa Bidhaa',
    description: 'Global United Nations standard establishing fundamental criteria for clear, reliable, and substantiated environmental marketing claims.',
    descriptionSw: 'Kiwango cha Umoja wa Mataifa kinachoweka misingi ya kutoa madai ya mazingira yaliyo wazi, yenye kuaminika, na yenye ushahidi.',
    source: 'United Nations Environment Programme (UNEP)',
    url: 'https://www.unep.org/resources/publication/guidelines-providing-product-sustainability-information',
    whyUseful: {
      en: 'Defines the five fundamental principles: Reliability, Relevance, Clarity, Transparency, and Accessibility required of all green claims.',
      sw: 'Inafafanua misingi mitano ya kimataifa: Uaminifu, Umuhimu, Uwazi, Ufikiaji, na Ushahidi unaotakiwa kwenye matangazo yote ya kijani.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'UNEP Publication ISBN: 978-92-807-3667-0'
  },

  // 9. Youth engagement and public participation
  {
    id: 'kenya-policy-on-public-participation',
    category: 'youth-civic-participation',
    title: 'Kenya Policy on Public Participation - Sessional Paper No. 3 of 2023',
    titleSw: 'Sera ya Kenya ya Ushiriki wa Umma - Karatasi ya Bunge Na. 3 ya 2023',
    description: 'National government policy outlining standards for qualitative, meaningful citizen consultation across national and county organs.',
    descriptionSw: 'Sera ya kitaifa ya serikali inayoweka viwango vya ushiriki wa kweli na wenye uzito wa wananchi katika vyombo vyote vya serikali.',
    source: 'Kenya Law Reform Commission / Office of the Attorney-General',
    url: 'https://www.klrc.go.ke/index.php/reports-and-publications/752-kenya-policy-on-public-participation-sessional-paper-no-3-of-2023',
    whyUseful: {
      en: 'Sets the official legal threshold for what constitutes valid public consultation, giving youth tools to challenge cosmetic hearings.',
      sw: 'Inaweka viwango vya kisheria vya ushiriki halali wa umma, ikiwapa vijana nguvu ya kupinga mikutano feki ya wanasiasa.'
    },
    sourceType: 'official-policy',
    dateOrVersion: 'Sessional Paper No. 3 of 2023'
  },
  {
    id: 'county-public-participation-guidelines',
    category: 'youth-civic-participation',
    title: 'County Public Participation Guidelines (Ministry of Devolution)',
    titleSw: 'Miongozo ya Ushiriki wa Umma ya Serikali za Kaunti',
    description: 'Operational handbook for devolution stakeholders detailing how county assemblies must notice, conduct, and report public input on CIDPs and budgets.',
    descriptionSw: 'Kitabu cha mwongozo kinachoeleza jinsi mabunge ya kaunti yanavyopaswa kutoa taarifa, kuendesha, na kurekodi maoni ya umma ya bajeti na CIDP.',
    source: 'Ministry of Devolution and Planning / Council of Governors',
    url: 'https://knowledgehub.devolution.go.ke/wp-content/uploads/2022/05/county-public-participation_january-2016.pdf',
    whyUseful: {
      en: 'Provides exact statutory timelines for submission of memoranda and petitioning county assembly committees.',
      sw: 'Inatoa ratiba kamili za kisheria za kuwasilisha memoranda na maombi kwa kamati za bunge la kaunti.'
    },
    sourceType: 'official-policy',
    dateOrVersion: 'Official Guidelines (Devolution Hub)'
  },
  {
    id: 'africa-check-kenya-fact-checking',
    category: 'youth-civic-participation',
    title: 'Africa Check - Fact-Checking and Verification Guide for Kenya',
    titleSw: 'Africa Check - Mwongozo wa Uhakiki wa Taarifa na Ukweli nchini Kenya',
    description: 'Practical training tools for youth to verify online news, detect doctored flood footage, and reverse-search weather rumors.',
    descriptionSw: 'Zana za mafunzo ya vitendo kwa vijana kuhakiki habari mtandaoni, kutambua picha feki za mafuriko, na kuzuia uzushi wa hali ya hewa.',
    source: 'Africa Check (africacheck.org)',
    url: 'https://africacheck.org/fact-checks/reports',
    whyUseful: {
      en: 'Essential digital safety and media literacy skills to stop panic-inducing weather misinformation on community WhatsApp groups.',
      sw: 'Ujuzi muhimu wa usalama wa kidijitali wa kuzuia kusambaza habari za uongo zinazoleta hofu kwenye makundi ya WhatsApp ya mtaa.'
    },
    sourceType: 'educational-publication',
    dateOrVersion: 'Continuous Fact-Checking Database'
  }
];
