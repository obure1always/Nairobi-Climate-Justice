export type VideoCategory = 'all' | 'kenya-impacts' | 'global-impacts' | 'community-action';

export interface AwarenessVideo {
  id: string;
  category: 'kenya-impacts' | 'global-impacts' | 'community-action';
  title: {
    en: string;
    sw: string;
  };
  publisher: string;
  publisherBadge: string;
  duration: string;
  durationSeconds: number;
  year: number;
  videoSource: string;
  sourceUrl: string;
  license: string;
  hasAudio: boolean;
  mediaType: string;
  description: {
    en: string;
    sw: string;
  };
  keyTakeaways: {
    en: string[];
    sw: string[];
  };
  communityAction: {
    en: string;
    sw: string;
  };
}

export const awarenessVideos: AwarenessVideo[] = [
  {
    id: 'vid-kenya-geothermal',
    category: 'community-action',
    title: {
      en: "Geothermal Landscapes: Powering Kenya's Clean Energy Transition",
      sw: 'Mandhari ya Nishati ya Jotoardhi: Kuendesha Mpito wa Nishati Safi Kenya'
    },
    publisher: 'Stockholm Environment Institute (SEI)',
    publisherBadge: 'Research Institute (CC BY 3.0)',
    duration: '4:12',
    durationSeconds: 252,
    year: 2021,
    videoSource: '/videos/kenya-geothermal-energy.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Geothermal_landscapes_-_powering_Kenya%E2%80%99s_future.webm',
    license: 'Creative Commons Attribution 3.0 (CC BY 3.0)',
    hasAudio: true,
    mediaType: 'Documentary Video Essay (Spoken English Audio)',
    description: {
      en: "Documentary examining the expansion of geothermal power generation in Kenya's Rift Valley (Olkaria), exploring how Kenya achieved over 90% renewable electricity on its grid while addressing community land rights, pastoralist livelihoods, and environmental risk management.",
      sw: 'Makala ya video inayochunguza upanuzi wa uzalishaji wa nishati ya jotoardhi katika Bonde la Ufa la Kenya (Olkaria), ikieleza jinsi Kenya ilivyofikia zaidi ya 90% ya umeme safi sambamba na haki za ardhi za jamii za wafugaji na usimamizi wa mazingira.'
    },
    keyTakeaways: {
      en: [
        "Kenya generates over 800 MW of baseload geothermal capacity from the Great Rift Valley, anchoring its clean national grid.",
        "Major clean energy infrastructure requires transparent community consultation regarding pastoralist grazing access and land boundaries.",
        "Steam extraction operations require rigorous continuous monitoring of hydrogen sulfide emissions and local watershed safety."
      ],
      sw: [
        'Kenya inazalisha zaidi ya megawati 800 za nishati ya jotoardhi kutoka Bonde la Ufa, ikiongoza gridi ya taifa ya nishati safi.',
        'Miradi mikubwa ya nishati safi inahitaji mashauriano ya uwazi na jamii za wafugaji kuhusu haki za ardhi na malisho.',
        'Uchimbaji wa mvuke unahitaji ufuatiliaji thabiti wa hewa ya hydrogen sulfide na kulinda vyanzo vya maji vya eneo hilo.'
      ]
    },
    communityAction: {
      en: 'Participate in local county renewable energy forums and advocate for community benefit-sharing agreements on clean energy projects.',
      sw: 'Shiriki katika mijadala ya nishati safi ya kaunti na tetea makubaliano ya kugawana faida za miradi ya kijamii.'
    }
  },
  {
    id: 'vid-kenya-wildlife-drought',
    category: 'kenya-impacts',
    title: {
      en: 'Kenya Wildlife & Climate Pressure: Drought in Northern Rangelands',
      sw: 'Wanyamapori na Tabianchi Kenya: Ukame kwenye Maeneo ya Kaskazini'
    },
    publisher: 'Voice of America (VOA News)',
    publisherBadge: 'International News (Public Domain)',
    duration: '2:44',
    durationSeconds: 164,
    year: 2020,
    videoSource: '/videos/kenya-wildlife-climate.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rare_Giraffe_in_Kenya_Faces_Extinction_Threat_Because_of_Poaching%2C_Climate_Change.webm',
    license: 'Public Domain (US Government Work)',
    hasAudio: true,
    mediaType: 'Field News Report (Spoken Narration & Interviews)',
    description: {
      en: 'Field news report documenting how severe multi-season droughts in northern Kenya degrade arid rangelands, shrink surface water holes, and intensify human-wildlife competition for grazing resources in Garissa County.',
      sw: 'Ripoti ya habari ya nyanjani ikionyesha jinsi ukame mkali wa misimu mingi kaskazini mwa Kenya unavyoharibu maeneo ya malisho, kukausha vyanzo vya maji, na kuongeza ushindani wa rasilimali kati ya jamii na wanyamapori.'
    },
    keyTakeaways: {
      en: [
        'Prolonged drought periods severely deplete seasonal forage and drying water reservoirs across northern Kenyan rangelands.',
        'Pastoralists and wildlife increasingly converge on the few remaining watering points along seasonal riverbeds.',
        'Community-led conservancies and managed water points are essential to mitigate human-wildlife conflict during dry spells.'
      ],
      sw: [
        'Ukame wa muda mrefu unamaliza malisho ya misimu na kukausha mabwawa ya maji kaskazini mwa Kenya.',
        'Wafugaji na wanyamapori wanakutana kwenye vyanzo vichache vya maji vilivyobaki kando ya mito.',
        'Hifadhi za kijamii na vituo vilivyosimamiwa vya maji ni muhimu kupunguza migogoro wakati wa ukame.'
      ]
    },
    communityAction: {
      en: 'Support community wildlife conservancies and practice managed rotation of shared rangeland watering troughs.',
      sw: 'Unga mkono hifadhi za kijamii za wanyamapori na tumia zamu zilizopangwa za kunywesha mifugo kwenye vyanzo vya pamoja vya maji.'
    }
  },
  {
    id: 'vid-horn-of-africa-drought',
    category: 'kenya-impacts',
    title: {
      en: 'Horn of Africa Root-Zone Soil Moisture Drought Anomaly (2020–2022)',
      sw: 'Ramani ya Ukame wa Unyevu wa Udongo: Pembe ya Afrika (2020–2022)'
    },
    publisher: 'NASA Scientific Visualization Studio & FEWS NET',
    publisherBadge: 'Satellite Science (Public Domain)',
    duration: '0:41',
    durationSeconds: 41,
    year: 2023,
    videoSource: '/videos/horn-of-africa-drought.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Soil_moisture_root_zone_Horn_of_Africa_2022.webm',
    license: 'Public Domain (NASA / US Government)',
    hasAudio: false,
    mediaType: 'Silent Satellite Scientific Visualization',
    description: {
      en: "Satellite scientific visualization produced by NASA's FEWS NET Land Data Assimilation System (FLDAS), mapping the progression of extreme root-zone soil moisture deficit across Kenya, Ethiopia, and Somalia across five consecutive failed rainy seasons.",
      sw: 'Uchambuzi wa kisayansi wa satelaiti kutoka mfumo wa NASA FEWS NET FLDAS, ukionyesha kuenea kwa ukosefu mkubwa wa unyevu wa udongo nchini Kenya, Ethiopia, na Somalia baada ya misimu mitano mfululizo ya mvua kufeli.'
    },
    keyTakeaways: {
      en: [
        'Root-zone soil moisture (top 1 meter) directly determines crop germination, pasture regeneration, and groundwater recharge.',
        'Deep purple and brown shading visualizes historical soil moisture deficits exceeding standard drought thresholds.',
        'Satellite observations confirm the multi-year drought was East Africa\'s most extensive dry episode in four decades.'
      ],
      sw: [
        'Unyevu wa udongo katika mita ya kwanza huamua moja kwa moja uotaji wa mazao, kuota kwa nyasi, na ujazaji wa maji ya ardhini.',
        'Rangi za zambarau na kahawia zinaonyesha upungufu mkubwa wa unyevu wa udongo unaozidi viwango vya kawaida vya ukame.',
        'Uchunguzi wa satelaiti unathibitisha ukame huu wa miaka mingi ulikuwa mbaya zaidi Afrika Mashariki katika miongo minne.'
      ]
    },
    communityAction: {
      en: 'Construct rainwater harvesting swales and mulch cultivated soil to retain moisture during erratic rainfall seasons.',
      sw: 'Tengeneza mifereji ya kukinga maji ya mvua (swales) na tandaza majani makavu shambani (mulching) ili kuhifadhi unyevu.'
    }
  },
  {
    id: 'vid-climate-warming-spiral',
    category: 'global-impacts',
    title: {
      en: 'GISTEMP Global Climate Spiral (1880–2021)',
      sw: 'Onyesho la Mzunguko wa Ongezeko la Joto Duniani (1880–2021)'
    },
    publisher: 'NASA Scientific Visualization Studio / Ed Hawkins (NCAS)',
    publisherBadge: 'Climate Data Visualization (Public Domain)',
    duration: '1:10',
    durationSeconds: 70,
    year: 2022,
    videoSource: '/videos/climate-warming-spiral.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:1880-_Global_warming_climate_spiral_-_NASA_GISTEMP.webm',
    license: 'Public Domain (NASA / NCAS)',
    hasAudio: false,
    mediaType: 'Silent Scientific Data Visualization',
    description: {
      en: 'Visual representation created by Dr. Ed Hawkins and NASA GSFC mapping monthly global surface temperature anomalies from 1880 through 2021. The outward-spiraling line demonstrates accelerating global warming as temperatures approach and breach 1.0°C and 1.5°C thresholds.',
      sw: 'Mchoro wa kisayansi ulioundwa na Dkt. Ed Hawkins na NASA GSFC ukionyesha ongezeko la joto la kila mwezi duniani kuanzia 1880 hadi 2021. Mistari inayotanuka inaonyesha kasi ya ongezeko la joto linapokaribia na kuvuka viwango vya 1.0°C na 1.5°C.'
    },
    keyTakeaways: {
      en: [
        'Global surface temperatures have steadily diverged from the late 19th-century baseline, with sharp acceleration after 1980.',
        'Each loop of the spiral tracks 12 calendar months, illustrating that warming affects all seasons, not just summers.',
        'Recent years persistently occupy the outer bands approaching the Paris Agreement 1.5°C aspirational limit.'
      ],
      sw: [
        'Joto la uso wa dunia limekuwa likiongezeka mfululizo kutoka kiwango cha karne ya 19, kwa kasi kubwa baada ya 1980.',
        'Kila mzunguko unawakilisha miezi 12 ya mwaka, kuonyesha ongezeko linaathiri misimu yote.',
        'Miaka ya hivi karibuni inakaribia sana kiwango cha juu cha makubaliano ya Paris cha 1.5°C.'
      ]
    },
    communityAction: {
      en: 'Audit your household and community energy footprint and join local tree canopy restoration campaigns.',
      sw: 'Kagua matumizi yako ya nishati nyumbani na jiunge na kampeni za kupanda miti mtaani kwako.'
    }
  },
  {
    id: 'vid-nasa-temperature-anomalies',
    category: 'global-impacts',
    title: {
      en: 'NASA GISS: 140 Years of Global Surface Temperature Anomalies',
      sw: 'NASA GISS: Miaka 140 ya Mabadiliko ya Joto Ulimwenguni'
    },
    publisher: 'NASA Goddard Institute for Space Studies',
    publisherBadge: 'Earth Observation (Public Domain)',
    duration: '0:33',
    durationSeconds: 33,
    year: 2020,
    videoSource: '/videos/nasa-temperature-anomalies.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Global_Temperature_Anomalies_from_1880_to_2019_-_2.webm',
    license: 'Public Domain (NASA / GSFC GISS)',
    hasAudio: false,
    mediaType: 'Silent Geospatial Heat Map',
    description: {
      en: 'Geospatial heat-map animation displaying 5-year running average global surface temperature anomalies relative to the 1951–1980 baseline. Color progression from blue to deep red illustrates pervasive warming across terrestrial landmasses and oceans.',
      sw: 'Ramani ya satelaiti inayoonyesha wastani wa mabadiliko ya joto duniani kwa vipindi vya miaka 5 ikilinganishwa na miaka ya 1951–1980. Mabadiliko ya rangi kutoka bluu hadi nyekundu yanaonyesha ongezeko kubwa la joto katika mabara na bahari.'
    },
    keyTakeaways: {
      en: [
        'Land surfaces warm significantly faster than oceanic waters due to differing specific heat capacities.',
        'The Arctic and Northern Hemisphere show polar amplification, warming at more than twice the global average rate.',
        'Tropical equatorial regions, including East Africa, experience less temperature variance but higher vulnerability due to baseline heat and agricultural sensitivity.'
      ],
      sw: [
        'Ardhi inapata joto haraka zaidi kuliko bahari kutokana na uwezo wa kushikilia joto.',
        'Kanda za ncha za kaskazini zinapata joto kwa kasi mara mbili zaidi ya wastani wa dunia.',
        'Kanda za kitropiki ikiwemo Afrika Mashariki ziko hatarini zaidi kwa sababu ya unyeti wa kilimo cha kutegemea mvua.'
      ]
    },
    communityAction: {
      en: 'Implement cool roof practices (high-albedo reflective coatings) to reduce indoor temperatures during urban heatwaves.',
      sw: 'Paka rangi nyeupe au zenye kuakisi jua kwenye mabati (cool roofs) ili kupunguza joto ndani ya nyumba.'
    }
  },
  {
    id: 'vid-ipcc-climate-projections',
    category: 'global-impacts',
    title: {
      en: 'IPCC: 21st Century Temperature & Precipitation Projections',
      sw: 'IPCC: Makadirio ya Joto na Mvua katika Karne ya 21'
    },
    publisher: 'NASA Center for Climate Simulation & IPCC',
    publisherBadge: 'Climate Modeling (Public Domain)',
    duration: '3:52',
    durationSeconds: 232,
    year: 2013,
    videoSource: '/videos/ipcc-climate-projections.webm',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:IPCC_Projections_of_Temperature_and_Precipitation_in_the_21st_Century.webm',
    license: 'Public Domain (NASA NCCS / IPCC)',
    hasAudio: false,
    mediaType: 'Silent Scientific Model Simulation',
    description: {
      en: 'Computer climate model simulations from the NASA Center for Climate Simulation comparing greenhouse gas concentration pathways. Visualizes projected multi-decadal temperature increases and shifts in equatorial precipitation regimes through 2100.',
      sw: 'Makadirio ya mifumo ya kompyuta ya hali ya hewa kutoka NASA Center for Climate Simulation yakilinganisha viwango tofauti vya gesi chafuzi. Inaonyesha makadirio ya ongezeko la joto na mabadiliko ya mwelekeo wa mvua hadi mwaka 2100.'
    },
    keyTakeaways: {
      en: [
        'Unmitigated emission scenarios (RCP 8.5) lead to global temperature rise exceeding 4°C above pre-industrial levels by 2100.',
        'Aggressive mitigation (RCP 2.6) stabilizes warming closer to 1.5°C–2.0°C, drastically reducing extreme weather risks.',
        'Precipitation patterns shift toward more extreme torrential bursts alternating with extended dry intervals.'
      ],
      sw: [
        'Bila kupunguza uzalishaji wa gesi chafuzi (RCP 8.5), joto linaweza kuongezeka kwa zaidi ya 4°C kufikia 2100.',
        'Kupunguza kwa haraka uzalishaji wa gesi chafuzi (RCP 2.6) kunaimarisha joto karibu na 1.5°C–2.0°C na kupunguza majanga makubwa.',
        'Mwelekeo wa mvua unabadilika kuelekea mvua kubwa za ghafla zikifuatiwa na vipindi virefu vya ukame.'
      ]
    },
    communityAction: {
      en: 'Advocate for municipal urban drainage investments and flood buffer zones aligned with 50-year climate projections.',
      sw: 'Tetea uwekezaji wa serikali za mitaa katika mifereji ya maji ya dharura na maeneo ya kuzuia mafuriko kulingana na makadirio ya miaka 50.'
    }
  }
];
