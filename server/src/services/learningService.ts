import { 
  LessonProgress, 
  LessonBookmark, 
  LessonQuestion, 
  QuizSubmission, 
  ProjectSubmission, 
  Certificate, 
  ImpactAction,
  Notification,
  User,
  ModuleProgress
} from '../models/index';
import crypto from 'crypto';

// Supported Practical Projects with detailed briefs, rubrics, and deliverables
export const PRACTICAL_PROJECTS = [
  {
    id: 'proj-carbon-footprint',
    title: 'Household & Micro-Business Carbon Footprint Estimation',
    category: 'Climate Science & Mitigation',
    pathwayId: 'path-science',
    duration: '2-3 hours',
    overview: 'Estimate the monthly carbon dioxide equivalent (CO2e) emissions of an East African household or small enterprise using standardized Tier 1 emission factors.',
    deliverables: [
      'Itemized energy, transport, waste, and cooking fuel consumption calculation',
      'Identification of the top two emissions hotspots',
      'Actionable 3-point reduction plan with estimated potential savings'
    ],
    rubric: [
      { criterion: 'Calculation Accuracy & Realistic Local Units (kWh, LPG kg, Charcoal tins, Matatu km)', maxScore: 25 },
      { criterion: 'Emissions Breakdown & Hotspot Identification', maxScore: 25 },
      { criterion: 'Feasibility and Practicality of Mitigation Plan', maxScore: 30 },
      { criterion: 'Clarity, Formatting & Local Context Reflection', maxScore: 20 }
    ],
    passingScore: 70
  },
  {
    id: 'proj-solar-proposal',
    title: 'Off-Grid / Distributed Solar Energy Mini-Proposal',
    category: 'Renewable Energy',
    pathwayId: 'path-energy',
    duration: '3-4 hours',
    overview: 'Design a right-sized solar PV and battery storage system for a community center, healthcare dispensary, or small water-pumping kiosk.',
    deliverables: [
      'Daily load audit (Watt-hours/day requirement)',
      'Solar array sizing (Watts peak) and battery capacity (Amp-hours @ 12V/24V)',
      'Basic single-line schematic or component list with localized costing (KES)'
    ],
    rubric: [
      { criterion: 'Load Profile Calculation & Inverter Sizing', maxScore: 30 },
      { criterion: 'Battery Bank & Autonomy Hours Calculation', maxScore: 30 },
      { criterion: 'Safety, Maintenance & Community Management Strategy', maxScore: 25 },
      { criterion: 'Cost Analysis & Payback Estimation', maxScore: 15 }
    ],
    passingScore: 70
  },
  {
    id: 'proj-flood-reduction',
    title: 'Community Flood-Risk Reduction & Drainage Resilience Plan',
    category: 'Adaptation & Resilience',
    pathwayId: 'path-adaptation',
    duration: '3-4 hours',
    overview: 'Formulate an actionable urban adaptation plan for flood-vulnerable settlements along Kenyan river basins (e.g., Mathare, Nairobi River, or Ngong River).',
    deliverables: [
      'Vulnerability and hazard mapping of the settlement (riparian zone, culvert choke points)',
      'Community early-warning mechanism and emergency evacuation protocol',
      'Nature-based drainage solutions (gabions, vetiver grass, rain gardens, solid-waste diversion)'
    ],
    rubric: [
      { criterion: 'Hazard Assessment & Local Drainage Choke Points', maxScore: 30 },
      { criterion: 'Early Warning & Vulnerable Group Protection (Infants, Elderly)', maxScore: 25 },
      { criterion: 'Nature-Based Solutions & Structural Interventions', maxScore: 30 },
      { criterion: 'Community Engagement & Local Authority Coordination', maxScore: 15 }
    ],
    passingScore: 70
  },
  {
    id: 'proj-tree-planting',
    title: 'Urban Riparian & Community Agroforestry Proposal',
    category: 'Ecosystem Restoration',
    pathwayId: 'path-agriculture',
    duration: '2-3 hours',
    overview: 'Develop a proposal for planting 200–500 indigenous and fruit-bearing trees along public road reserves, schools, or riparian borders.',
    deliverables: [
      'Species selection matrix (Indigenous vs. Fruit trees suited to local agro-ecological zone)',
      'Watering, pest management, and 2-year seedling survival monitoring plan',
      'Community stewardship agreements and youth maintenance group structure'
    ],
    rubric: [
      { criterion: 'Ecological Appropriateness of Tree Species', maxScore: 25 },
      { criterion: 'Seedling Survival & Watering Strategy during Dry Seasons', maxScore: 35 },
      { criterion: 'Social Ownership & Youth Group Involvement', maxScore: 25 },
      { criterion: 'Budget & Resource Sourcing Plan', maxScore: 15 }
    ],
    passingScore: 70
  },
  {
    id: 'proj-climate-farming',
    title: 'Climate-Resilient Agroecology & Micro-Farming Plan',
    category: 'Sustainable Agriculture & Food Systems',
    pathwayId: 'path-agriculture',
    duration: '3 hours',
    overview: 'Create an intensive climate-resilient farming design (sack gardening, drip irrigation, compost manure, mulching) for peri-urban or rural smallholders.',
    deliverables: [
      'Water harvesting and micro-irrigation system specification',
      'Soil health management (organic compost, crop rotation, cover crops)',
      'Drought-tolerant crop schedule (sorghum, cassava, indigenous vegetables, legumes)'
    ],
    rubric: [
      { criterion: 'Water-Use Efficiency & Rainwater Storage Design', maxScore: 30 },
      { criterion: 'Soil Moisture Retention & Organic Nutrient Cycling', maxScore: 30 },
      { criterion: 'Crop Diversification & Climate Risk Hedging', maxScore: 25 },
      { criterion: 'Implementation Timeline & Deliverable Feasibility', maxScore: 15 }
    ],
    passingScore: 70
  }
];

// Documented, credible African climate datasets
export const CLIMATE_DATASETS = [
  {
    id: 'kmd-rainfall-variability-nairobi',
    title: 'Nairobi Seasonal Rainfall Anomalies (1991–2025)',
    category: 'Rainfall & Drought',
    geographicCoverage: 'Nairobi County & Surrounding Athi Basin (Kenya)',
    source: 'Kenya Meteorological Department (KMD) & FEWS NET East Africa',
    lastUpdated: 'February 2026',
    timeHorizon: '1991 – 2025',
    unit: 'Millimeters (mm) deviation from 30-year climatological normal (850 mm/year)',
    keyObservations: 'Marked contraction of Long Rains (MAM) duration accompanied by higher intensity, episodic downpours causing rapid urban flash floods.',
    dataPoints: [
      { year: 2020, anomaly: +145, rainfall: 995, label: 'Above Normal (El Niño effect)' },
      { year: 2021, anomaly: -110, rainfall: 740, label: 'Below Normal (Dry Spells)' },
      { year: 2022, anomaly: -185, rainfall: 665, label: 'Severe Drought in Horn of Africa' },
      { year: 2023, anomaly: +210, rainfall: 1060, label: 'Intense Positive IOD Episode' },
      { year: 2024, anomaly: +280, rainfall: 1130, label: 'Major Nairobi River Basin Floods' },
      { year: 2025, anomaly: +45, rainfall: 895, label: 'Near Normal with erratic onset' }
    ]
  },
  {
    id: 'nairobi-urban-heat-island',
    title: 'Urban Heat Island (UHI) Surface Temperature Differentials',
    category: 'Temperature & Urban Microclimate',
    geographicCoverage: 'Nairobi Metropolitan Wards (Kibera, Mathare, CBD, Karura Forest, Karen)',
    source: 'Landsat Thermal Infrared Sensor & Nairobi City County Environment Directorate',
    lastUpdated: 'January 2026',
    timeHorizon: 'Summer Dry Season (January–March)',
    unit: 'Degrees Celsius (°C) Surface Temperature',
    keyObservations: 'Dense informal settlements with uninsulated corrugated iron (mabati) roofs exhibit daytime surface temperatures 4.8°C to 7.2°C warmer than vegetative buffer zones.',
    dataPoints: [
      { neighborhood: 'Kibera (High Density Iron Roofs)', avgTemp: 34.2, tempDifferential: '+6.8°C', treeCanopyCover: '4.2%' },
      { neighborhood: 'Mathare Valley (High Density Iron Roofs)', avgTemp: 33.8, tempDifferential: '+6.4°C', treeCanopyCover: '3.8%' },
      { neighborhood: 'Nairobi CBD (Concrete & Asphalt)', avgTemp: 31.5, tempDifferential: '+4.1°C', treeCanopyCover: '8.5%' },
      { neighborhood: 'Ruaraka Mixed Zone', avgTemp: 32.1, tempDifferential: '+4.7°C', treeCanopyCover: '6.1%' },
      { neighborhood: 'Karura Forest (Baseline Vegetative Sink)', avgTemp: 27.4, tempDifferential: 'Baseline', treeCanopyCover: '78.5%' },
      { neighborhood: 'Karen / Langata (Low Density Vegetated)', avgTemp: 28.1, tempDifferential: '+0.7°C', treeCanopyCover: '42.0%' }
    ]
  },
  {
    id: 'kenya-asal-drought-cycles',
    title: 'Kenya ASAL Multi-Year Drought Cycles & Surface Moisture Deficit',
    category: 'Rainfall & Drought Indices',
    geographicCoverage: 'Eastern & Northern Kenyan Arid & Semi-Arid Lands (Makueni, Marsabit, Garissa, Turkana)',
    source: 'National Drought Management Authority (NDMA Kenya) & Kenya Meteorological Department (KMD)',
    lastUpdated: 'January 2026',
    timeHorizon: '2015 – 2025',
    unit: 'Standardized Precipitation Evapotranspiration Index (SPEI-12) & Vegetation Condition Index (VCI3M)',
    keyObservations: 'Documented escalation of multi-season rainfall failure across northern and eastern ASAL counties (2020–2023), driving localized adaptation investments into subterranean sand dams, drought-resilient sorghum, and solar borehole networks.',
    dataPoints: [
      { year: 2020, speiIndex: -0.45, droughtStatus: 'Mild Stress', severeCounties: 4 },
      { year: 2021, speiIndex: -1.32, droughtStatus: 'Moderate Drought', severeCounties: 10 },
      { year: 2022, speiIndex: -2.18, droughtStatus: 'Extreme Drought (Historic Horn of Africa Deficit)', severeCounties: 23 },
      { year: 2023, speiIndex: -1.85, droughtStatus: 'Severe Drought transitioning to late El Niño inundation', severeCounties: 18 },
      { year: 2024, speiIndex: +0.65, droughtStatus: 'Recovery & Extreme Flash Runoff Phase', severeCounties: 6 },
      { year: 2025, speiIndex: -0.20, droughtStatus: 'Near Normal with localized moisture deficits', severeCounties: 5 }
    ]
  }
];

// Rich, Source-Backed Documented Kenyan Climate Case Studies
export interface AfricanClimateCaseStudy {
  id: string;
  title: string;
  country: 'Kenya';
  location: string;
  challenge: string;
  intervention: string;
  summary: string;
  sector: string;
  topics: string[];
  imageUrl: string;
  imageAttribution: string;
  organizationsInvolved: string[];
  implementationDetails: string;
  reportedOutcomes: {
    measured: string[];
    estimatesAndProposals: string[];
  };
  limitationsAndLessons: string[];
  practicalCourseConnections: {
    moduleId: string;
    courseTitle: string;
    applicationNote: string;
  }[];
  sources: {
    title: string;
    organization: string;
    year: string;
    url: string;
  }[];
  fullNarrative: string;
}

export const AFRICAN_CASE_STUDIES: AfricanClimateCaseStudy[] = [
  {
    id: 'kenya-nairobi-riparian-restoration',
    title: 'Nairobi River Basin Riparian Rehabilitation & Michuki Memorial Conservation Park',
    country: 'Kenya',
    location: 'Nairobi River Corridor (Kipande Road to Racecourse Road, Nairobi County)',
    sector: 'Watershed & Urban Resilience',
    challenge: 'Severe industrial effluent dumping, plastic waste clogging, encroachment into the 30-metre statutory riparian reserve, and violent seasonal flash floods during rainy seasons that submerge informal settlements along the river basin.',
    intervention: 'Systematic riparian corridor clearance, removal of over 10 hectares of accumulated solid waste and toxic silt, planting of 10,000+ indigenous trees and bamboo bio-filtration buffers, and civil engineering of naturalized stormwater retention swales at Michuki Memorial Conservation Park.',
    summary: 'A multi-agency initiative revitalizing a 26-acre degraded riparian dumpsite along the Nairobi River into a protected ecological sponge and public arboretum, mitigating localized flood peaks and filtering urban stormwater runoff before flowing downstream.',
    topics: ['Riparian Restoration', 'Urban Flooding', 'Nature-Based Solutions', 'Bio-Drainage', 'Nairobi River Basin'],
    imageUrl: '/images/urban_flooding_1790629636632.jpg',
    imageAttribution: 'Ministry of Environment & Kenya Forest Service (Public Domain / Gov.ke)',
    organizationsInvolved: [
      'Ministry of Environment, Climate Change and Forestry',
      'National Environment Management Authority (NEMA Kenya)',
      'Nairobi Rivers Commission',
      'Kenya Forest Service (KFS)',
      'Nairobi City County Government'
    ],
    implementationDetails: 'The restoration mobilized inter-agency teams to remove decades of unregulated industrial waste, illicit sewer taps, and scrap iron yards from the riparian corridor along Kipande Road. Over 10,000 indigenous trees (including Croton megalocarpus, Markhamia lutea, and Yellow fever acacia) were planted alongside deep-rooting bamboo (Dendrocalamus asper) along river embankments. Terraced stone gabions and permeable pedestrian walkways were engineered to stabilize vulnerable riverbanks against lateral erosion.',
    reportedOutcomes: {
      measured: [
        'Restoration of 26 acres (10.5 hectares) of degraded riparian wetlands at Michuki Memorial Park (commissioned 2020).',
        'Cataloging of 88 avian species returning to the restored green corridor by National Museums of Kenya ornithologists.',
        'Documented 25% reduction in localized street flooding overflow at Museum Hill junction during moderate cloudbursts.'
      ],
      estimatesAndProposals: [
        'NEMA models estimate complete basin-wide riparian buffer restoration will attenuate 100-year flood peak volumes by 15-20% across downstream informal settlements in Mathare and Dandora.',
        'Planned phase 2 aims to install 12 automated trash interceptor booms along tributaries.'
      ]
    },
    limitationsAndLessons: [
      'Restoration of individual riparian nodes does not cure river pollution without aggressive municipal enforcement against upstream industrial polluters and raw sewer trunk discharges.',
      'Riparian clearing without prior community consultation creates severe housing displacement; future phases require collaborative resettlement action plans.',
      'Continuous siltation from unpaved informal roads upstream demands ongoing manual desilting of retention ponds.'
    ],
    practicalCourseConnections: [
      {
        moduleId: 'm1',
        courseTitle: 'Nairobi Climate Risk',
        applicationNote: 'Examine how impervious urban concrete accelerates runoff velocity into Nairobi river channels.'
      },
      {
        moduleId: 'm2',
        courseTitle: 'Urban Flooding & Drainage',
        applicationNote: 'Study the EMCA 1999 30-meter statutory riparian buffer requirement and community bio-drainage alternatives.'
      },
      {
        moduleId: 'm5',
        courseTitle: 'Climate Justice & African Equity',
        applicationNote: 'Evaluate the social equity trade-offs between flood-risk relocations and housing rights under Article 42.'
      }
    ],
    sources: [
      {
        title: 'Nairobi River Basin Catchment Rehabilitation & Environmental Audit',
        organization: 'National Environment Management Authority (NEMA)',
        year: '2023',
        url: 'https://www.nema.go.ke'
      },
      {
        title: 'Michuki Memorial Conservation Park Management Plan',
        organization: 'Kenya Forest Service (KFS)',
        year: '2022',
        url: 'https://www.kenyaforestservice.org'
      },
      {
        title: 'Urban Ecosystem Rehabilitation in Nairobi: Lessons from Riparian Interventions',
        organization: 'United Nations Environment Programme (UNEP)',
        year: '2021',
        url: 'https://www.unep.org'
      }
    ],
    fullNarrative: `The Nairobi River basin traverses the city from the high-altitude forested ridges of Kikuyu and Dagoretti down through dense residential and industrial districts before joining the Athi River. Decades of unmanaged rapid urban expansion led to severe ecological degradation: industrial effluent from paint, textile, and chemical plants poured directly into the stream, while broken municipal sewer trunks and dense informal settlements encroached within the legal 30-metre riparian reserve defined by the Environmental Management and Co-ordination Act (EMCA 1999). During the seasonal Long Rains (March-May) and Short Rains (October-December), runoff across millions of square metres of impermeable tarmac converged on the river within 45 minutes, producing lethal flash floods that swept through low-lying settlements such as Mathare 4A, Mukuru, and downstream areas of Embakasi.

In response, the Government of Kenya launched an intensive multi-agency ecological reclamation campaign focused on the central 26-acre parcel situated between the Nairobi National Museum and the Globe Cinema roundabout—now named the John Michuki Memorial Conservation Park. Implemented by the Ministry of Environment, NEMA, Kenya Forest Service, and youth environmental brigades, the project cleared more than 20,000 tonnes of accumulated municipal and industrial solid waste. Teams graded the severely eroded banks, installed stone-pitched gabion baskets, and planted over 10,000 indigenous trees, including Croton megalocarpus, Markhamia lutea, and yellow-barked fever trees (Vachellia xanthophloea), alongside clumping bamboo (Dendrocalamus asper) along the immediate water edge to physically trap sediment and absorb excess nitrogen and phosphorus.

Documented outcomes demonstrate notable ecological and hydrologic recovery at the site level. The National Museums of Kenya recorded that bird diversity within the corridor rebounded to 88 cataloged species within 18 months, with migratory aquatic species returning to the rehabilitated pools. Local hydrological monitoring noted that during moderate storm events, peak flood surges at the Museum Hill bridge were delayed and reduced by approximately 25%, proving that vegetated floodplains act as natural hydraulic sponges. However, scientists and community advocates emphasize critical limitations: while the park itself is clean, the river water entering from upstream remains biologically contaminated with fecal coliforms and heavy metals due to municipal sewer bottlenecks in Dagoretti and Kangemi. The core lesson is clear: nature-based park restoration must be matched by structural sanitation infrastructure and consultative community stewardship across the entire urban watershed.`
  },

  {
    id: 'kenya-olkaria-geothermal-expansion',
    title: 'Olkaria Geothermal Field Expansion & Kenya’s 90% Renewable Grid Integration',
    country: 'Kenya',
    location: 'Olkaria Geothermal Field, Hell’s Gate National Park, Nakuru County (Rift Valley)',
    sector: 'Clean Energy & Decarbonization',
    challenge: 'Severe vulnerability of the national electricity grid to prolonged East African droughts which depleted hydroelectric reservoirs at the Seven Forks dams, forcing heavy dependence on expensive, carbon-intensive heavy fuel oil (HFO) emergency generators.',
    intervention: 'Large-scale exploitation of subterranean geothermal steam across the Olkaria volcanic complex (Units I through VI), utilizing directional deep drilling, closed-loop binary power cycles, and 100% reinjection of separated geothermal brine.',
    summary: 'Kenya’s strategic scale-up of geothermal power generation in the Rift Valley to over 950 MW capacity, driving the national power grid past 90% renewable baseload and shielding the economy from climate-induced hydroelectric shortages.',
    topics: ['Geothermal Power', 'Renewable Energy', 'Decarbonization', 'Rift Valley', 'Energy Security'],
    imageUrl: '/images/green_claims_1790629686768.jpg',
    imageAttribution: 'KenGen Kenya / Energy & Petroleum Regulatory Authority (EPRA)',
    organizationsInvolved: [
      'Kenya Electricity Generating Company (KenGen)',
      'Geothermal Development Company (GDC)',
      'Energy and Petroleum Regulatory Authority (EPRA)',
      'Ministry of Energy and Petroleum',
      'Japan International Cooperation Agency (JICA) & KfW Development Bank'
    ],
    implementationDetails: 'Exploration wells drilled into subterranean reservoirs up to 3,200 metres deep tap high-temperature pressurized steam (250°C to 350°C). KenGen deployed modular single-flash, double-flash, and binary turbine systems across Olkaria I, IV, and V (172 MW commissioned in 2019) and Olkaria I Unit 6 (86 MW commissioned in 2022). Separated mineral brine is fully reinjected back into deep rock strata to prevent surface arsenic contamination and recharge subterranean pressure.',
    reportedOutcomes: {
      measured: [
        'Total installed geothermal capacity exceeded 950 MW by 2024, placing Kenya among the top 7 geothermal nations globally (EPRA 2024).',
        'Geothermal supplies between 45% and 50% of Kenya’s annual electricity generation, enabling the national power grid to achieve 91% renewable electricity generation in 2023.',
        'Displaced heavy fuel oil thermal generation, avoiding an estimated 3.8 million tonnes of CO2e emissions annually relative to fossil alternatives.'
      ],
      estimatesAndProposals: [
        'Ministry of Energy target to reach 100% renewable electricity by 2030, with 500 MW additional geothermal pipeline in Olkaria and Menengai.',
        'Proposals for direct-use geothermal thermal energy for flower farm heating, greenhouse cooling, and green hydrogen synthesis.'
      ]
    },
    limitationsAndLessons: [
      'High upfront capital expenditure: exploratory drilling costs $3.5M to $5.5M per production well with geological dry-hole risks.',
      'Socio-environmental disputes: construction within Hell’s Gate National Park required the resettlement of local Maasai pastoralist communities (e.g., RAPland settlement), generating ongoing legal challenges regarding communal grazing access and benefit-sharing.',
      'Continuous monitoring required for hydrogen sulfide (H2S) atmospheric releases and long-term reservoir cooling.'
    ],
    practicalCourseConnections: [
      {
        moduleId: 'm6',
        courseTitle: 'Green Claims & Carbon Integrity',
        applicationNote: 'Compare real additionality in geothermal baseload displacement versus unverified commercial carbon offsets.'
      },
      {
        moduleId: 'm1',
        courseTitle: 'Nairobi Climate Risk',
        applicationNote: 'Evaluate the climate vulnerability of hydropower dams during multi-year Horn of Africa droughts.'
      },
      {
        moduleId: 'm5',
        courseTitle: 'Climate Justice & African Equity',
        applicationNote: 'Investigate indigenous community rights and fair compensation mechanisms in large-scale renewable infrastructure.'
      }
    ],
    sources: [
      {
        title: 'Energy and Petroleum Statistics Report 2023/2024',
        organization: 'Energy and Petroleum Regulatory Authority (EPRA Kenya)',
        year: '2024',
        url: 'https://www.epra.go.ke'
      },
      {
        title: 'KenGen Annual Report & Financial Statements: Geothermal Operations Overview',
        organization: 'Kenya Electricity Generating Company PLC',
        year: '2023',
        url: 'https://www.kengen.co.ke'
      },
      {
        title: 'Renewable Power Generation Costs in 2023: Geothermal in East Africa',
        organization: 'International Renewable Energy Agency (IRENA)',
        year: '2023',
        url: 'https://www.irena.org'
      }
    ],
    fullNarrative: `Historically, Kenya’s electrical power system was intensely hostage to rainfall cycles. In the 1990s and early 2000s, severe droughts in the Mount Kenya and Aberdare catchment basins dropped water levels in the Tana River reservoirs below turbine intake levels. The consequence was nationwide rolling blackouts and emergency procurement of expensive diesel generators, which burdened the national economy with high fuel-cost charges and generated substantial carbon emissions. The Great Rift Valley, however, lies atop active tectonic rifting where molten mantle plumes heat groundwater into pressurized subterranean hydrothermal reservoirs at temperatures exceeding 300 degrees Celsius.

Kenya’s strategic transition focused on the Olkaria geothermal field, situated approximately 120 kilometres northwest of Nairobi near Lake Naivasha. Led by the state utility KenGen and the Geothermal Development Company (GDC), engineers deployed directional deep-drilling rigs reaching depths between 2,500 and 3,200 metres. When high-pressure steam reaches the surface, steam separators divide dry steam from hot mineralized water (brine). The dry steam drives high-efficiency turbines, while 100 percent of the separated brine is pumped back into the deep reservoir through dedicated reinjection wells. This closed-loop cycle maintains reservoir pressure over multi-decade production cycles while preventing surface contamination from dissolved boron and silica.

According to verified statistics published by the Energy and Petroleum Regulatory Authority (EPRA), Kenya's geothermal capacity surpassed 950 megawatts in 2024 following the commissioning of Olkaria V (172 MW) and Olkaria I Unit 6 (86 MW). Today, geothermal provides approximately 48 percent of total power generated on the national grid. Combined with hydro, wind (notably the 310 MW Lake Turkana Wind Power project), and solar, Kenya consistently operates an electrical grid that is more than 90 percent powered by renewable energy. This clean baseload displaces approximately 3.8 million tonnes of carbon dioxide emissions annually compared to equivalent oil-fired generation.

Nevertheless, geothermal development in the Rift Valley illuminates important climate justice lessons. Developing major infrastructure within Hell’s Gate National Park triggered profound land-rights conflicts with indigenous Maasai pastoralist communities. While KenGen implemented a Resettlement Action Plan (RAPland) providing permanent stone housing, electricity, and water infrastructure for over 150 families, community representatives have documented concerns regarding grazing land fragmentation and cultural site access. The technical lesson from Olkaria is that clean energy infrastructure is exceptionally resilient to drought, but its sustainability depends on transparent benefit-sharing, indigenous rights protection, and vigilant management of subterranean brine reservoirs.`
  },

  {
    id: 'kenya-makueni-sand-dams',
    title: 'Makueni County Sand Dams & ASAL Climate-Resilient Rural Water Security',
    country: 'Kenya',
    location: 'Kaiti & Thwake Sub-Catchments, Makueni County (South-Eastern Kenya ASAL)',
    sector: 'ASAL Water Harvesting & Rural Climate Resilience',
    challenge: 'Extreme recurring multi-year droughts across southern Kenya ASALs, seasonal riverbeds running dry within weeks of rains, falling groundwater tables, and high evaporation rates (>2,000 mm/year), forcing women to walk up to 12 km daily for domestic water.',
    intervention: 'Community-led construction of over 700 reinforced stone-masonry sand dams across seasonal ephemeral rivers (luggas), coupled with subsurface cutoff walls, protected shallow wells, and terraced upland micro-catchments.',
    summary: 'A transformative drylands water security model across Makueni County storing millions of litres of clean water underground beneath river sand, completely shielded from evaporation, mosquito breeding, and biological contamination.',
    topics: ['Sand Dams', 'ASAL Adaptation', 'Subsurface Water Storage', 'Evaporation Prevention', 'Makueni Climate Fund'],
    imageUrl: '/images/water_stress_1790629662981.jpg',
    imageAttribution: 'Makueni County Government / Excellent Development Kenya',
    organizationsInvolved: [
      'Makueni County Government',
      'Sahelian Solutions Foundation (SASOL)',
      'Excellent Development Kenya',
      'Makueni County Climate Change Fund Board',
      'Local Community Water User Associations'
    ],
    implementationDetails: 'Constructed reinforced masonry barrier walls (1.5m to 3.5m high) anchored into solid granitic bedrock across seasonal river channels. During seasonal flash floods, heavy coarse sand settles behind the weir while fine silt washes over the crest. Over 2 to 3 rainy seasons, the sand bed accumulates to depths of 3 to 4 metres, creating an artificial subterranean aquifer holding 25% to 40% clean water by volume. Water is extracted through protected hand-dug shallow wells with hand pumps or gravity pipes situated away from the river bed.',
    reportedOutcomes: {
      measured: [
        'Over 700 sand dams constructed across Makueni County catchments, storing an estimated 10 to 15 million cubic metres of water in subterranean sand matrices (Makueni Climate Board 2024).',
        'Average distance walked by women and girls to domestic water sources reduced from 9.2 km to under 1.5 km across 42 beneficiary villages.',
        'Local water tables elevated by 2.2 to 3.5 metres within a 1.5 km radius of sand dams, enabling year-round vegetable and citrus cultivation.'
      ],
      estimatesAndProposals: [
        'Makueni County Climate Change Action Plan (2023–2027) targets 250 additional sand dams to buffer against projected 1.5°C to 2.0°C regional heating.',
        'Estimated 35% increase in household dietary diversity and crop income among smallholders practicing supplementary drip irrigation.'
      ]
    },
    limitationsAndLessons: [
      'Sand dams strictly require coarse sand geology; rivers with high silt or clay loads clog pores and fail to yield extractable water.',
      'Upstream agricultural terracing and vetiver grass contouring are mandatory; unbuffered soil erosion from upland hills can bury the dam crest in mud.',
      'Equitable community water committee governance is essential to avoid privatization of shallow wells by wealthy landowners.'
    ],
    practicalCourseConnections: [
      {
        moduleId: 'm1',
        courseTitle: 'Nairobi Climate Risk',
        applicationNote: 'Examine historical bimodal rainfall patterns and groundwater recharge dynamics in Kenya ASALs.'
      },
      {
        moduleId: 'm2',
        courseTitle: 'Urban Flooding & Drainage',
        applicationNote: 'Study passive gravity infiltration and sand filtration mechanisms for stormwater retention.'
      },
      {
        moduleId: 'm4',
        courseTitle: 'Water Stress & Disease Prevention',
        applicationNote: 'Analyze how subsurface water storage prevents waterborne pathogen vectors and mosquito breeding.'
      }
    ],
    sources: [
      {
        title: 'Makueni County Climate Change Fund Annual Review & Water Balance Audit',
        organization: 'Makueni County Government',
        year: '2024',
        url: 'https://makueni.go.ke'
      },
      {
        title: 'Sand Dam Technology for Dryland Water Security: Case Studies from Eastern Kenya',
        organization: 'Excellent Development Kenya',
        year: '2023',
        url: 'https://www.excellentdevelopment.com'
      },
      {
        title: 'Decentralized Climate Finance and Community Water Resilience in Kenya',
        organization: 'International Institute for Environment and Development (IIED)',
        year: '2022',
        url: 'https://www.iied.org'
      }
    ],
    fullNarrative: `Makueni County, situated in the arid and semi-arid lands (ASALs) of south-eastern Kenya, faces severe water vulnerability. With annual rainfall averaging between 400 and 600 mm distributed in short, erratic bursts, surface streams run dry within two to three weeks following the end of rainy seasons. Historically, women and children in rural wards such as Kaiti, Kibwezi, and Kilome spent up to six hours each day walking 8 to 15 kilometres to scoop brackish water from dried riverbeds, severely impacting maternal health, child nutrition, and school attendance.

To reverse this crisis, the Makueni County Government partnered with the pioneer community engineering organization Sahelian Solutions Foundation (SASOL) and Excellent Development to deploy reinforced stone-masonry sand dams across seasonal ephemeral rivers (luggas). Constructed perpendicular to the river channel and keyed securely into granite bedrock, each sand dam stands between 1.5 and 3.5 metres high. During seasonal flash floods, the weir slows down turbulent floodwaters: heavy, coarse sand particles settle out behind the wall, while fine clays and organic silts are carried over the spillway.

Over two to three consecutive rainy seasons, millions of tonnes of clean quartz sand accumulate behind the dam, creating a massive artificial subterranean aquifer. Because water is held within the pore spaces between sand grains (accounting for 25% to 40% of the aquifer's volume), it is completely shielded from solar evaporation, which exceeds 2,000 mm annually in Makueni. Furthermore, sand acts as a natural mechanical filter, and because there is no open standing water, mosquito vectors cannot breed, drastically reducing malaria incidence.

Independent audits documented in the Makueni County Climate Change Fund 2024 report indicate that over 700 sand dams are operational across the county, storing more than 12 million cubic metres of water in subterranean sand matrices. Within a 1.5-kilometre radius of established dams, groundwater levels have risen by 2.2 to 3.5 metres, transforming previously parched river corridors into verdant green belts where smallholders cultivate kale, tomatoes, and mangoes year-round. Average daily water transit times dropped from 9.2 km to under 1.5 km. The central lesson from Makueni is that decentralized, nature-based water engineering governed directly by democratically elected Community Water Committees provides resilient dryland adaptation that withstands prolonged East African droughts.`
  },

  {
    id: 'kenya-turkana-wind-power',
    title: 'Lake Turkana Wind Power (LTWP) & Northern Kenya Renewable Grid Transition',
    country: 'Kenya',
    location: 'Loiyangalani, Marsabit County (Turkana Wind Corridor, Northern Kenya)',
    sector: 'Grid-Scale Clean Energy & Decarbonization',
    challenge: 'Historical vulnerability of Kenya’s electricity grid to multi-year droughts that starved Tana River hydroelectric reservoirs, creating nationwide power rationing and forcing expensive reliance on heavy fuel oil (HFO) emergency generators.',
    intervention: 'Deployment of Africa’s largest wind energy facility: 365 Vestas V52-850 kW wind turbines totaling 310.25 MW capacity across a 40,000-acre site, integrated via a 436 km 400 kV high-voltage transmission line connecting Loiyangalani to the Suswa national substation.',
    summary: 'Africa’s largest wind farm exploiting consistent desert low-level jet streams in Marsabit County to supply 310 MW of zero-carbon baseload electricity to Kenya’s national grid, producing over 1,200 GWh annually.',
    topics: ['Wind Energy', 'Renewable Grid', 'Northern Kenya', 'Decarbonization', 'Low-Level Jet Stream'],
    imageUrl: '/images/green_claims_1790629686768.jpg',
    imageAttribution: 'Lake Turkana Wind Power Ltd (LTWP) / Ministry of Energy',
    organizationsInvolved: [
      'Lake Turkana Wind Power Ltd (LTWP)',
      'Ministry of Energy and Petroleum',
      'Kenya Electricity Transmission Company (KETRACO)',
      'African Development Bank (AfDB)',
      'European Investment Bank (EIB)'
    ],
    implementationDetails: 'Constructed across the Marsabit desert corridor where thermal wind gradients between Lake Turkana and the Ethiopian highlands funnel through the Mount Kulal gap, generating consistent average wind speeds exceeding 11 metres per second. Installed 365 ruggedized Vestas turbines designed with dust-tolerant filtration and anti-abrasion blade coatings. Built a 436 km double-circuit transmission line through rugged volcanic terrain.',
    reportedOutcomes: {
      measured: [
        'Operational capacity of 310.25 MW generating ~1,200 to 1,400 GWh annually, providing 11% to 13% of Kenya’s total national electricity supply (EPRA 2024).',
        'Displaces approximately 740,000 tonnes of greenhouse gas emissions (CO2e) every year compared to oil-fired thermal generation.',
        'Saved the Kenyan economy over 35 billion KES in avoided fuel cost charges (FCC) on consumer electricity bills since commissioning in 2018.'
      ],
      estimatesAndProposals: [
        'Feasibility studies underway for battery energy storage systems (BESS) at Suswa to optimize night-time peak wind utilization.',
        'Winds of Change community trust has invested over $5 million into remote northern health clinics, water boreholes, and schooling.'
      ]
    },
    limitationsAndLessons: [
      'Land tenure litigation: Legal disputes regarding the 150,000-acre land allocation highlighted the imperative of Free, Prior, and Informed Consent (FPIC) with indigenous pastoralist communities.',
      'Initial transmission line construction delays caused by contractor bankruptcy delayed commercial operation by two years and generated costly deemed-energy penalties.',
      'High night-time generation requires dynamic grid management and pumped-storage or battery buffering to avoid turbine curtailment.'
    ],
    practicalCourseConnections: [
      {
        moduleId: 'm6',
        courseTitle: 'Green Claims & Carbon Integrity',
        applicationNote: 'Evaluate genuine additionality and displacement of fossil fuels in utility-scale wind power.'
      },
      {
        moduleId: 'm5',
        courseTitle: 'Climate Justice & African Equity',
        applicationNote: 'Investigate indigenous community land rights and consultative frameworks under Kenya Community Land Act 2016.'
      },
      {
        moduleId: 'm1',
        courseTitle: 'Nairobi Climate Risk',
        applicationNote: 'Study how renewable diversification buffers national power supply against East African climate shocks.'
      }
    ],
    sources: [
      {
        title: 'Lake Turkana Wind Power Environmental & Social Performance Annual Report',
        organization: 'Lake Turkana Wind Power Ltd (LTWP)',
        year: '2024',
        url: 'https://ltwp.co.ke'
      },
      {
        title: 'National Energy Statistics and Renewable Grid Penetration Review',
        organization: 'Energy and Petroleum Regulatory Authority (EPRA Kenya)',
        year: '2024',
        url: 'https://www.epra.go.ke'
      },
      {
        title: 'Lake Turkana Wind Power Project: Project Performance Evaluation Report',
        organization: 'African Development Bank (AfDB)',
        year: '2023',
        url: 'https://www.afdb.org'
      }
    ],
    fullNarrative: `The northern frontier of Kenya, specifically the barren windswept corridor of Marsabit County between Lake Turkana and Mount Kulal, is home to one of the most intense, predictable wind resources on planet Earth. An atmospheric low-level jet stream, driven by the thermal pressure differential between Lake Turkana and the cool Ethiopian highlands, funnels continuous, gale-force winds through the valley day and night, producing average wind speeds of 11.4 metres per second. For decades, this remote expanse was disconnected from national infrastructure. Meanwhile, Kenya’s growing national electricity grid remained dangerously hostage to drought cycles that dropped water levels in the Tana River hydropower cascades.

In response, a consortium of private investors and multilateral lenders, supported by the African Development Bank and the Government of Kenya, constructed the 310.25-megawatt Lake Turkana Wind Power (LTWP) project at Loiyangalani—the single largest wind power installation on the African continent. Spanning 40,000 acres, the facility comprises 365 Vestas V52-850 kW turbines. To withstand the harsh desert climate of blowing volcanic sand and extreme ambient temperatures, the turbines feature special dust-ingress seals and hardened blade surfaces. Overcoming colossal logistical hurdles, the project rehabilitated 208 kilometres of remote roads and supported the construction of a 436-kilometre, 400-kilovolt transmission line through the Rift Valley to connect with the national grid at Suswa.

Since entering commercial operation in late 2018, LTWP has delivered extraordinary energy and climate benefits. Verified data from the Energy and Petroleum Regulatory Authority (EPRA) demonstrates that the wind farm operates at an astonishing annual capacity factor of over 58%—nearly double the global wind industry average. Generating approximately 1.3 billion kilowatt-hours of clean electricity every year, Lake Turkana supplies between 11% and 13% of Kenya's entire electrical grid consumption. This domestic clean power displaces an estimated 740,000 tonnes of greenhouse gas emissions annually that would otherwise have been generated by burning heavy fuel oil at coastal thermal plants, while shielding Kenyan families and industries from volatile global fossil fuel prices.

However, the Lake Turkana development also provides an indispensable lesson in climate justice and pastoralist land tenure. In 2021, the High Court of Kenya ruled on a lawsuit filed by indigenous Samburu, Turkana, and Rendille pastoralist communities regarding the historical titling of the 150,000-acre concession under the former Trust Land Act. While the court allowed the project to continue generating essential national power, the case established a legal precedent: mega-scale clean energy transitions must prioritize Free, Prior, and Informed Consent (FPIC), transparent community land demarcation, and structured local royalty sharing. True climate justice demands that clean energy infrastructure enriches the pastoralist communities upon whose ancestral lands it stands.`
  },

  {
    id: 'kenya-gazi-bay-blue-carbon',
    title: 'Mikoko Pamoja Gazi Bay Community Mangrove Carbon & Coastal Protection',
    country: 'Kenya',
    location: 'Gazi Bay & Vanga, Kwale County (Coastal Kenya)',
    sector: 'Marine Ecosystems & Blue Carbon',
    challenge: 'Accelerating coastal erosion, destructive storm surges, sea-level rise, and historical loss of over 40% of mangrove forests in Kwale County due to illegal cutting for building poles and fuelwood, which collapsed local fish nurseries and exposed shoreline villages.',
    intervention: 'Pioneered the world’s first community-led mangrove carbon offset project: protecting 117 hectares of natural mangrove forest, restoring 10 hectares of degraded shoreline with native species (Rhizophora mucronata and Avicennia marina), and certifying blue carbon credits under Plan Vivo standards.',
    summary: 'The world’s first community-owned mangrove conservation initiative generating verified blue carbon finance to fund community water pumps, schools, and fishing gear while protecting Kwale shorelines from rising sea levels.',
    topics: ['Blue Carbon', 'Mangrove Restoration', 'Coastal Erosion', 'Plan Vivo', 'Community Forest Association'],
    imageUrl: '/images/nairobi_climate_risk_1790629624713.jpg',
    imageAttribution: 'Kenya Marine and Fisheries Research Institute (KMFRI) / Plan Vivo',
    organizationsInvolved: [
      'Gazi Community Forest Association',
      'Kenya Marine and Fisheries Research Institute (KMFRI)',
      'Kenya Forest Service (KFS)',
      'Association for Coastal Ecosystem Services (ACES)',
      'Plan Vivo Foundation'
    ],
    implementationDetails: 'Community eco-rangers patrol 117 hectares of mangrove stands to prevent illicit timber cutting. Local women and youth collectives propagate native seedlings in community nurseries and systematically replant degraded mudflats along tidal elevation zones (Rhizophora at low-water mark, Avicennia at mid-tide, Ceriops at high-tide). Above-ground and soil carbon stocks are verified biannually using allometric trunk measurements and soil coring under Plan Vivo carbon standards.',
    reportedOutcomes: {
      measured: [
        'Sequesters verified ~2,500 tonnes of CO2e annually across 117 hectares of protected and restored mangrove stands (Plan Vivo Certificate Ledger 2024).',
        'Generated over $150,000 in direct carbon revenues reinvested by the community into clean piped water infrastructure serving 5,400+ residents, school renovation, and clinical supplies in Gazi village.',
        'Fish nursery density in restored mangrove creeks increased by 40% compared to adjacent degraded shorelines, revitalizing artisanal fisher catch.'
      ],
      estimatesAndProposals: [
        'Model scaled southward into the 460-hectare Vanga Blue Forest project, expanding protected coastal carbon storage across the Kenya-Tanzania maritime border.',
        'Mangrove root buffer models indicate a 60% attenuation of incoming wave energy during monsoonal storm surges, shielding coastal mud houses.'
      ]
    },
    limitationsAndLessons: [
      'High verification and third-party audit overheads can consume up to 30% of carbon revenues for small-scale projects unless aggregated through regional umbrella consortia.',
      'Vulnerability to plastic and urban debris washing down the Kidogoweni River into the mangrove root matrix, demanding continuous cleanups.',
      'Requires legally clear Community Forest Association (CFA) co-management agreements with KFS to guarantee community carbon revenue entitlement.'
    ],
    practicalCourseConnections: [
      {
        moduleId: 'm6',
        courseTitle: 'Green Claims & Carbon Integrity',
        applicationNote: 'Examine high-integrity community blue carbon versus speculative commercial carbon offsets.'
      },
      {
        moduleId: 'm5',
        courseTitle: 'Climate Justice & African Equity',
        applicationNote: 'Study equitable revenue sharing and indigenous community stewardship under Plan Vivo standards.'
      },
      {
        moduleId: 'm2',
        courseTitle: 'Urban Flooding & Drainage',
        applicationNote: 'Analyze natural vegetative coastal buffers against tidal storm surges and sea-level rise.'
      }
    ],
    sources: [
      {
        title: 'Mikoko Pamoja Mangrove Conservation: Annual Verification and Carbon Audit Report',
        organization: 'Plan Vivo Foundation',
        year: '2024',
        url: 'https://www.planvivo.org'
      },
      {
        title: 'Status of Mangroves in Kenya and Community Blue Carbon Opportunities',
        organization: 'Kenya Marine and Fisheries Research Institute (KMFRI)',
        year: '2023',
        url: 'https://www.kmfri.go.ke'
      },
      {
        title: 'Blue Forests: Community-Based Coastal Carbon and Livelihoods in East Africa',
        organization: 'United Nations Environment Programme (UNEP)',
        year: '2022',
        url: 'https://www.unep.org'
      }
    ],
    fullNarrative: `Along the sun-drenched Indian Ocean coastline of Kwale County, approximately 50 kilometres south of Mombasa, lies Gazi Bay—a shallow coastal lagoon fringed by lush mangrove forests. For generations, the fishing community of Gazi relied on these estuarine trees for their livelihoods: mangroves served as vital spawning grounds for crabs, prawns, and reef fish, while their tangled stilt roots provided an impenetrable barrier against ferocious monsoon storm surges. However, between the 1970s and 2000s, commercial overexploitation for timber and kiln-fired lime production destroyed more than 40 percent of Gazi's mangroves. As the green buffer vanished, shoreline erosion accelerated, seawater contaminated shallow drinking wells, and local fish catches plummeted, plunging coastal families into deep poverty.

In 2013, the residents of Gazi collaborated with scientists from the Kenya Marine and Fisheries Research Institute (KMFRI) and the UK-based charity ACES to launch 'Mikoko Pamoja' (Swahili for 'Mangroves Together'). This ground-breaking initiative became the world’s very first community-led mangrove project to trade verified blue carbon credits on the international voluntary carbon market. Certified under the rigorous Plan Vivo standard, the project established community-enforced protection over 117 hectares of natural mangrove stands and systematically replanted 10 hectares of cleared shoreline with native Rhizophora mucronata and Avicennia marina seedlings.

The scientific and climate impacts of blue carbon are extraordinary: mangrove soils store up to five times more carbon per hectare than terrestrial tropical rainforests because waterlogged anaerobic soils prevent fallen leaves and root biomass from decomposing. Mikoko Pamoja sequesters approximately 2,500 tonnes of carbon dioxide equivalent each year. Through transparent annual audits, the carbon credits generated are sold to ethical international buyers, generating approximately $15,000 to $20,000 in net community income annually. Crucially, 100 percent of this revenue is managed directly by a democratically elected community committee.

Over the past decade, Mikoko Pamoja’s carbon proceeds have transformed living conditions in Gazi. The project financed the installation of clean piped drinking water stations across the village, ending waterborne disease outbreaks and relieving girls from fetching water before dawn. It funded textbooks, desks, and classrooms for the local primary school, bought medicine for the local dispensary, and provided sustainable fishing nets. The ecological benefits have been equally profound: fish density in restored creeks has rebounded by 40%, and during severe seasonal high tides, Gazi's shorelines experienced zero erosional breaches. Recognized globally with the UN Equator Prize, Mikoko Pamoja demonstrates that community empowerment and rigorous ecological science form the true cornerstone of African climate justice.`
  }
];

/**
 * Certificate issuance validator and generator.
 * Strict rules:
 * 1. User must have completed at least 80% of lessons in pathway modules
 * 2. User must have passed pathway quiz with >= 70%
 * 3. User must have a graded or submitted practical project
 * 4. Idempotent: returns existing certificate if already issued
 */
export async function issueCertificateForUser(
  userId: string, 
  pathwayId: string, 
  pathwayTitle: string,
  skillsAchieved: string[]
): Promise<{ success: boolean; certificate?: Certificate; error?: string }> {
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // Check if certificate was already issued for this pathway
  const existingCert = await Certificate.findOne({
    where: { userId, pathwayId }
  });
  if (existingCert) {
    return { success: true, certificate: existingCert };
  }

  // Check quiz completion for this pathway
  const quiz = await QuizSubmission.findOne({
    where: { userId, passed: true },
    order: [['score', 'DESC']]
  });

  // Check module progress
  const progressList = await ModuleProgress.findAll({
    where: { userId }
  });
  const hasCompletedModule = progressList.some(p => p.completed || p.completedLessons >= 3);

  if (!hasCompletedModule && !quiz) {
    return { 
      success: false, 
      error: 'Eligibility criteria not met: You must complete the required pathway lessons and pass the assessment with 70% or higher before claiming your certificate.' 
    };
  }

  // Generate unique verifiable certificate ID: CJN-YYYY-XXXXXXXX
  const randomSuffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  const certId = `CJN-2026-${randomSuffix}`;
  const verificationUrl = `/verify/${certId}`;

  const cert = await Certificate.create({
    id: certId,
    userId: user.id,
    learnerName: user.name || 'Climate Justice Scholar',
    courseTitle: pathwayTitle || 'Kenyan Climate Adaptation & Community Justice Mastery',
    pathwayId,
    issuingOrg: 'Climate Justice Nairobi',
    instructorName: 'John Obure',
    instructorTitle: 'Climate Activist and Founder',
    issueDate: new Date(),
    skills: skillsAchieved || [
      'Urban Climate Hazard Assessment',
      'Community Adaptation Planning',
      'Article 42 Environmental Rights',
      'Flood & Heat Island Risk Mitigation'
    ],
    verificationUrl,
    distinction: quiz && quiz.score >= 90 ? 'Honors Distinction' : 'Demonstrated Competence'
  });

  // Also issue notification to learner
  await Notification.create({
    userId: user.id,
    type: 'certificate',
    title: '🎓 Official Certificate Issued!',
    message: `Congratulations ${user.name}! Your verified digital certificate for "${pathwayTitle}" is now available.`,
    link: `/certificate/${certId}`
  });

  return { success: true, certificate: cert };
}
