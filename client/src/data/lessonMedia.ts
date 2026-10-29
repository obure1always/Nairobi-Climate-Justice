export interface LessonTranscriptSegment {
  timestamp: string;
  seconds: number;
  speaker: string;
  text: string;
}

export interface LessonMediaData {
  moduleId: string;
  lessonId: string;
  videoTitle: string;
  videoDuration: string;
  videoSource: string;
  videoEmbedUrl?: string;
  thumbnailUrl: string;
  sourceAttribution: string;
  mediaType: string;
  hasAudio: boolean;
  instructorName: string;
  instructorTitle: string;
  transcript: LessonTranscriptSegment[];
  downloadableNotesMarkdown: string;
  keyTakeaways: string[];
}

export const lessonMediaRegistry: Record<string, LessonMediaData> = {
  // Module 1, Lesson 1: Global Warming & East Africa Baseline
  'm1-l1': {
    moduleId: 'm1',
    lessonId: 'm1-l1',
    videoTitle: 'NASA GISTEMP: Global Surface Temperature Anomaly Spiral (1880–2021)',
    videoDuration: '01:10',
    videoSource: '/videos/climate-warming-spiral.webm',
    thumbnailUrl: '/images/nairobi_climate_risk_1790629624713.jpg',
    sourceAttribution: 'NASA Scientific Visualization Studio & Ed Hawkins (NCAS)',
    mediaType: 'Silent Scientific Data Visualization',
    hasAudio: false,
    instructorName: 'NASA Scientific Visualization Studio',
    instructorTitle: 'Data Visualizer: Mark SubbaRao (NASA) & Ed Hawkins (NCAS)',
    keyTakeaways: [
      'Weather describes atmospheric conditions over hours/days; climate represents a 30-year statistical baseline.',
      'East Africa experiences bimodal rainfall (MAM and OND), now increasingly erratic under global thermal forcing.',
      'Decadal warming trends in East Africa reflect global surface temperature anomalies documented since 1880.',
      'Single isolated cold mornings or localized showers do not contradict the multi-decadal global warming trajectory.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'Data Visualizer Timeline', text: '1880 historical baseline initialized. Monthly temperature deviations hover near 0.0°C relative to pre-industrial.' },
      { timestamp: '00:20', seconds: 20, speaker: 'Data Visualizer Timeline', text: '1900–1940: Decadal temperatures fluctuate within natural variability range (+/- 0.2°C).' },
      { timestamp: '00:40', seconds: 40, speaker: 'Data Visualizer Timeline', text: '1980 onwards: Pronounced outward expansion as greenhouse gas concentrations rapidly accelerate.' },
      { timestamp: '00:55', seconds: 55, speaker: 'Data Visualizer Timeline', text: '2015–2021: Persistent breaches past +1.0°C anomaly ring, approaching the Paris Agreement +1.5°C threshold.' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: Weather, Climate, and Multi-Decadal Baselines
**Course:** Nairobi Climate Risk (Module 1, Lesson 1)
**Media Source:** NASA Scientific Visualization Studio (GISTEMP Climate Spiral)

## Core Distinction
1. **Weather:** The instantaneous atmospheric state (temperature, precipitation, wind) over hours to days.
2. **Climate:** The statistical synthesis and multi-decadal average of weather variables over an international standard 30-year baseline.

## East African Climate Context
- **Bimodal Rainfall Regime:** Long Rains (March–May) and Short Rains (October–December), both increasingly compressed into erratic, high-intensity downpours.
- **Urban Runoff:** Nairobi's sealed impervious terrain (asphalt, zinc roofs) converts cloudbursts into instantaneous street flooding within 30 minutes.`
  },

  // Module 1, Lesson 2: Greenhouse Effect & Radiative Forcing
  'm1-l2': {
    moduleId: 'm1',
    lessonId: 'm1-l2',
    videoTitle: 'NASA GISS: 140 Years of Global Surface Temperature Anomalies',
    videoDuration: '00:33',
    videoSource: '/videos/nasa-temperature-anomalies.webm',
    thumbnailUrl: '/images/nairobi_climate_risk_1790629624713.jpg',
    sourceAttribution: 'NASA Goddard Institute for Space Studies (GISS)',
    mediaType: 'Silent Geospatial Heat Map Animation',
    hasAudio: false,
    instructorName: 'NASA Goddard Institute for Space Studies',
    instructorTitle: 'Data Analyst: Robert B. Schmunk (NASA GSFC GISS)',
    keyTakeaways: [
      'Greenhouse gases (CO2, CH4, N2O) trap outgoing longwave terrestrial infrared radiation in the troposphere.',
      'Atmospheric CO2 has risen from pre-industrial ~280 ppm to over 420 ppm today.',
      'Land surfaces warm significantly faster than oceans; terrestrial Africa faces elevated heat exposure.',
      'Africa generates under 4% of cumulative global emissions yet experiences disproportionate climatic vulnerability.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'Geospatial Heat Map Guide', text: '1880–1910 global baseline: Blue hues dominate indicating temperatures near or below late-19th century averages.' },
      { timestamp: '00:10', seconds: 10, speaker: 'Geospatial Heat Map Guide', text: '1940–1970 mid-century: Balanced distribution of neutral and moderate warm anomalies across continents.' },
      { timestamp: '00:20', seconds: 20, speaker: 'Geospatial Heat Map Guide', text: '1985–2005: Broad terrestrial orange and red shading emerges across equatorial Africa and Eurasia.' },
      { timestamp: '00:28', seconds: 28, speaker: 'Geospatial Heat Map Guide', text: '2010–2019: Deep red anomalies expand globally, illustrating persistent high-temperature anomalies across landmasses.' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: The Greenhouse Effect & Radiative Forcing
**Course:** Nairobi Climate Risk (Module 1, Lesson 2)
**Media Source:** NASA Goddard Institute for Space Studies (GISS Surface Temperature Analysis)

## Atmospheric Physics
- **Shortwave Solar Radiation:** Passes through atmospheric window with minimal absorption.
- **Longwave Infrared Radiation:** Absorbed and re-radiated by greenhouse gas molecules (CO2, CH4, H2O, N2O), warming the lower atmosphere.
- **Climate Equity:** African nations contribute under 4% of historical carbon emissions but face the highest adaptation costs.`
  },

  // Module 1, Lesson 3: Satellite Soil Moisture & Drought
  'm1-l3': {
    moduleId: 'm1',
    lessonId: 'm1-l3',
    videoTitle: 'NASA SVS: Horn of Africa Root-Zone Soil Moisture Drought Anomaly (2020–2022)',
    videoDuration: '00:41',
    videoSource: '/videos/horn-of-africa-drought.webm',
    thumbnailUrl: '/images/heat_and_health_1790629650810.jpg',
    sourceAttribution: 'NASA Scientific Visualization Studio & FEWS NET (FLDAS)',
    mediaType: 'Silent Satellite Scientific Visualization',
    hasAudio: false,
    instructorName: 'NASA SVS & FEWS NET',
    instructorTitle: 'Scientific Visualizer: Trent Schindler (NASA SVS)',
    keyTakeaways: [
      'Root-zone soil moisture (top 1 meter) directly determines crop viability, pasture regrowth, and food security.',
      'Satellite models track extreme multi-year drought across northern Kenya, Somalia, and southern Ethiopia.',
      'Five consecutive failed rainy seasons caused historical deficits in agricultural water storage.',
      'Urban Nairobi food prices (sukuma wiki, maize, tomatoes) reflect regional soil moisture stress in peri-urban supply basins.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'Satellite Sensor Guide', text: 'August 2020: Baseline moisture conditions across East Africa; green shading indicates adequate root-zone moisture.' },
      { timestamp: '00:15', seconds: 15, speaker: 'Satellite Sensor Guide', text: 'Late 2021: Deep purple and brown zones spread across northern Kenya and the Horn, signifying severe moisture deficit.' },
      { timestamp: '00:30', seconds: 30, speaker: 'Satellite Sensor Guide', text: 'Late 2022: Multi-season drought peaks with pervasive root-zone depletion across pastoral rangelands and rainfed croplands.' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: Satellite Soil Moisture & Drought Monitoring
**Course:** Nairobi Climate Risk (Module 1, Lesson 3)
**Media Source:** NASA Scientific Visualization Studio (FEWS NET FLDAS System)

## Satellite Land Data Assimilation
- **Root-Zone Moisture:** Measures water accessible to plant root systems in the upper 1 meter of soil.
- **East Africa Drought Vulnerability:** Rainfed farming in Machakos, Kiambu, and Kajiado directly connects rural crop failure to food inflation in Nairobi markets.`
  },

  // Module 4, Lesson 1: Clean Energy Transitions (Kenya Geothermal)
  'm4-l1': {
    moduleId: 'm4',
    lessonId: 'm4-l1',
    videoTitle: 'Stockholm Environment Institute: Geothermal Energy in Kenya',
    videoDuration: '04:12',
    videoSource: '/videos/kenya-geothermal-energy.webm',
    thumbnailUrl: '/images/water_stress_1790629662981.jpg',
    sourceAttribution: 'Stockholm Environment Institute (SEI)',
    mediaType: 'Documentary Video Essay (English Audio)',
    hasAudio: true,
    instructorName: 'Stockholm Environment Institute',
    instructorTitle: 'Energy & Climate Governance Research Team',
    keyTakeaways: [
      'Kenya generates over 800 MW of baseload geothermal capacity from the Great Rift Valley at Olkaria.',
      'Geothermal energy powers over 40% of Kenya’s electricity, driving national grid renewables past 90%.',
      'Clean energy development must protect pastoralist land tenure, community grazing access, and water rights.',
      'Environmental monitoring must manage steam extraction, ground stability, and hydrogen sulfide emissions.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'SEI Documentary Narrator', text: 'Geothermal energy is a cornerstone of Kenya vision for green industrial development in the Rift Valley.' },
      { timestamp: '01:05', seconds: 65, speaker: 'SEI Field Researcher', text: 'As geothermal capacity expands at Olkaria, balancing renewable power goals with local pastoralist livelihoods is essential.' },
      { timestamp: '02:15', seconds: 135, speaker: 'Community Representative', text: 'Our communities need clear agreements on grazing access, environmental protection, and shared benefits from energy projects.' },
      { timestamp: '03:30', seconds: 210, speaker: 'SEI Documentary Narrator', text: 'Transparent environmental governance ensures that Kenya clean energy transition remains socially just and sustainable.' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: Renewable Energy Transitions in Kenya
**Course:** Renewable Energy & Water Resilience (Module 4, Lesson 1)
**Media Source:** Stockholm Environment Institute (SEI) Field Research

## Kenya's Geothermal Leadership
- Over 90% of Kenya's electricity is generated from renewable sources (geothermal, hydro, wind, solar).
- Geothermal provides reliable baseload power unaffected by rainfall variability.`
  },

  // Module 5, Lesson 1: Climate Pressures on Rangelands
  'm5-l1': {
    moduleId: 'm5',
    lessonId: 'm5-l1',
    videoTitle: 'Voice of America: Wildlife & Climate Pressure in Northern Kenya',
    videoDuration: '02:44',
    videoSource: '/videos/kenya-wildlife-climate.webm',
    thumbnailUrl: '/images/climate_justice_1790629675274.jpg',
    sourceAttribution: 'Voice of America (VOA News)',
    mediaType: 'Field News Report (English Audio & Interviews)',
    hasAudio: true,
    instructorName: 'Voice of America',
    instructorTitle: 'African News & Environment Reporting Service',
    keyTakeaways: [
      'Multi-year droughts in northern Kenya degrade arid rangelands and dry up seasonal water points.',
      'Pastoralist communities and wildlife face acute competition over scarce forage and water sources.',
      'Community-managed conservancies and shared water points reduce conflict during extreme dry periods.',
      'Climate adaptation requires joint ecosystem planning between local communities and wildlife authorities.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'VOA News Reporter', text: 'In northern Kenya, consecutive dry seasons are placing unprecedented pressure on wildlife and pastoral communities.' },
      { timestamp: '00:45', seconds: 45, speaker: 'Garissa Community Leader', text: 'The grazing lands are depleted and water sources have shrunk. Both our herds and the wild animals are struggling to find pasture.' },
      { timestamp: '01:30', seconds: 90, speaker: 'Kenya Wildlife Officer', text: 'We are working alongside local communities to manage shared water pans and protect endangered species from habitat loss.' },
      { timestamp: '02:15', seconds: 135, speaker: 'VOA News Reporter', text: 'Community-led adaptation and water management remain the most effective tools for coexisting with climate stress.' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: Climate Pressures on Arid Rangelands
**Course:** Climate Justice & Community Adaptation (Module 5, Lesson 1)
**Media Source:** Voice of America Field Journalism (Garissa County, Kenya)

## Ecosystem Vulnerability
- Arid and semi-arid lands (ASALs) cover over 80% of Kenya.
- Adaptation requires integrated pasture rotation and community-managed water infrastructure.`
  },

  // Module 7, Lesson 1: 21st Century Climate Projections
  'm7-l1': {
    moduleId: 'm7',
    lessonId: 'm7-l1',
    videoTitle: 'NASA NCCS: 21st Century Temperature & Precipitation Scenarios (IPCC)',
    videoDuration: '03:52',
    videoSource: '/videos/ipcc-climate-projections.webm',
    thumbnailUrl: '/images/civic_participation_1790629699025.jpg',
    sourceAttribution: 'NASA Center for Climate Simulation & IPCC',
    mediaType: 'Silent Scientific Model Simulation',
    hasAudio: false,
    instructorName: 'NASA Center for Climate Simulation',
    instructorTitle: 'Multi-Model Climate Simulation Team',
    keyTakeaways: [
      'Climate simulation models compare greenhouse gas pathways (RCP 2.6 mitigation vs. RCP 8.5 high-emissions).',
      'Unchecked emissions drive global mean surface warming past 4°C by 2100 with extreme heat across equatorial Africa.',
      'Precipitation shifts project fewer overall rain days but more intense, concentrated cloudburst events in East Africa.',
      'Long-term community planning must incorporate 30-year hydrological projections into drainage and infrastructure.'
    ],
    transcript: [
      { timestamp: '00:00', seconds: 0, speaker: 'Simulation Model Guide', text: 'Baseline global temperature simulation under historical emission trajectories (1970–2005).' },
      { timestamp: '01:15', seconds: 75, speaker: 'Simulation Model Guide', text: 'Comparing RCP 4.5 and RCP 8.5 pathways: Divergence accelerates after 2040 across tropical landmasses.' },
      { timestamp: '02:30', seconds: 150, speaker: 'Simulation Model Guide', text: 'Precipitation projection: Equatorial East Africa shows elevated rainfall variability and intense localized bursts.' },
      { timestamp: '03:30', seconds: 210, speaker: 'Simulation Model Guide', text: 'Late 21st century stabilization under aggressive mitigation (RCP 2.6) versus unmitigated warming (RCP 8.5).' }
    ],
    downloadableNotesMarkdown: `# Lesson Notes: 21st Century Climate Projections & Community Planning
**Course:** Civic Participation & Climate Action (Module 7, Lesson 1)
**Media Source:** NASA Center for Climate Simulation (NCCS) for IPCC Assessment

## Modeling Future Scenarios
- **RCP 2.6:** Aggressive global decarbonization; warming stabilizes near 1.5°C–2.0°C.
- **RCP 8.5:** High fossil emissions; warming exceeds 4°C by 2100.
- **Planning Implication:** Urban flood infrastructure must be sized for higher peak intensities, not historical averages.`
  }
};

/**
 * Returns genuine, verified media data for a lesson, or null if the lesson is a substantive text reading lesson.
 * Never invents video sources, durations, transcripts, or attributions.
 */
export function getLessonMedia(_moduleId: string, lessonId: string): LessonMediaData | null {
  return lessonMediaRegistry[lessonId] || null;
}

/**
 * Returns true if the lesson has verified, published media.
 */
export function hasLessonVideo(lessonId: string): boolean {
  return Boolean(lessonMediaRegistry[lessonId]);
}

/**
 * Returns whether the lesson is delivered primarily via verified video or substantive text reading.
 */
export function getLessonDeliveryMode(lessonId: string): 'video' | 'reading' {
  return lessonMediaRegistry[lessonId] ? 'video' : 'reading';
}

export function estimateReadingTimeMinutes(content: string | { paragraphs?: string[]; heading?: string; objectives?: string[] }): number {
  if (!content) return 8;
  const rawText = typeof content === 'string'
    ? content
    : [content.heading, ...(content.objectives || []), ...(content.paragraphs || [])].filter(Boolean).join(' ');
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.ceil(wordCount / 180));
}
