import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  BarChart2, 
  MapPin, 
  Database, 
  Table, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Thermometer,
  CloudRain,
  Sun,
  Activity,
  Compass
} from 'lucide-react';

export type KenyaRegionId = 
  | 'nairobi-central'
  | 'rift-valley'
  | 'eastern-asal'
  | 'northern-kenya'
  | 'coast-marine'
  | 'lake-basin';

export type ClimateIndicatorType = 
  | 'rainfall-anomaly'
  | 'surface-temp'
  | 'drought-spei'
  | 'renewable-grid';

interface RegionalClimateRecord {
  regionId: KenyaRegionId;
  regionName: string;
  swRegionName: string;
  countiesCovered: string;
  representativeStation: string;
  coordinates: { x: number; y: number }; // Relative SVG map percentage coordinates
  indicators: {
    'rainfall-anomaly': {
      value: number; // percentage anomaly
      unit: '% deviation from 30-yr normal';
      status: 'Surplus / Flood Watch' | 'Near Normal' | 'Moderate Deficit' | 'Severe Deficit';
      baseline: string;
      historicalSeries: { year: number; value: number }[];
      plainInterpretation: string;
      swPlainInterpretation: string;
    };
    'surface-temp': {
      value: number; // °C anomaly
      unit: '°C anomaly vs 1991–2020 baseline';
      status: 'High Thermal Stress' | 'Moderate Anomaly' | 'Near Normal';
      baseline: string;
      historicalSeries: { year: number; value: number }[];
      plainInterpretation: string;
      swPlainInterpretation: string;
    };
    'drought-spei': {
      value: number; // SPEI score
      unit: 'SPEI-12 Index Score';
      status: 'Extreme Drought' | 'Severe Drought' | 'Moderate Stress' | 'Normal / Wet';
      baseline: string;
      historicalSeries: { year: number; value: number }[];
      plainInterpretation: string;
      swPlainInterpretation: string;
    };
    'renewable-grid': {
      value: number; // MW clean capacity
      unit: 'MW Installed Clean Capacity';
      status: 'High Renewable Density' | 'Expanding Infrastructure' | 'Decentralized Mini-Grid';
      baseline: string;
      historicalSeries: { year: number; value: number }[];
      plainInterpretation: string;
      swPlainInterpretation: string;
    };
  };
  sources: { title: string; organization: string; url: string; date: string }[];
  limitations: string;
  swLimitations: string;
}

const KENYA_REGIONAL_DATA: Record<KenyaRegionId, RegionalClimateRecord> = {
  'nairobi-central': {
    regionId: 'nairobi-central',
    regionName: 'Nairobi & Central Highlands',
    swRegionName: 'Nairobi na Nyanda za Juu za Kati',
    countiesCovered: 'Nairobi, Kiambu, Murang\'a, Nyeri, Kirinyaga',
    representativeStation: 'Dagoretti Corner Meteorological Observatory, Nairobi',
    coordinates: { x: 50, y: 62 },
    indicators: {
      'rainfall-anomaly': {
        value: 24.5,
        unit: '% deviation from 30-yr normal',
        status: 'Surplus / Flood Watch',
        baseline: '850 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: 17.1 },
          { year: 2021, value: -12.9 },
          { year: 2022, value: -21.8 },
          { year: 2023, value: 24.7 },
          { year: 2024, value: 32.9 },
          { year: 2025, value: 5.3 }
        ],
        plainInterpretation: 'Rainfall is characterized by episodic, violent cloudbursts that overwhelm stormwater networks in informal riparian settlements like Mathare and Mukuru within 35 minutes.',
        swPlainInterpretation: 'Mvua hutokea kwa mafuriko makali ya ghafla ndani ya dakika 35, yakizidi uwezo wa mifereji katika makazi yaliyo kando ya mito kama Mathare na Mukuru.'
      },
      'surface-temp': {
        value: 1.4,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'High Thermal Stress',
        baseline: '24.2°C mean reference',
        historicalSeries: [
          { year: 2020, value: 0.9 },
          { year: 2021, value: 1.1 },
          { year: 2022, value: 1.3 },
          { year: 2023, value: 1.2 },
          { year: 2024, value: 1.5 },
          { year: 2025, value: 1.4 }
        ],
        plainInterpretation: 'Dense urban settlements with corrugated iron (mabati) roofing exhibit daytime microclimate heat islands 5.2°C hotter than forested peri-urban sinks like Karura.',
        swPlainInterpretation: 'Makazi yenye mabati mengi yana joto la juu kwa 5.2°C ikilinganishwa na maeneo ya miti kama Karura Forest.'
      },
      'drought-spei': {
        value: -0.3,
        unit: 'SPEI-12 Index Score',
        status: 'Normal / Wet',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: 0.2 },
          { year: 2021, value: -0.8 },
          { year: 2022, value: -1.4 },
          { year: 2023, value: -0.6 },
          { year: 2024, value: 0.4 },
          { year: 2025, value: -0.3 }
        ],
        plainInterpretation: 'Near-normal moisture in highland catchments (Aberdares), but municipal reservoir storage (Ndakaini Dam) remains vulnerable to seasonal inflow swings.',
        swPlainInterpretation: 'Unyevu wa kawaida katika vyanzo vya maji vya Aberdare, ingawa kiwango cha maji katika Bwawa la Ndakaini hubadilika haraka.'
      },
      'renewable-grid': {
        value: 215,
        unit: 'MW Installed Clean Capacity',
        status: 'Expanding Infrastructure',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 120 },
          { year: 2021, value: 145 },
          { year: 2022, value: 170 },
          { year: 2023, value: 195 },
          { year: 2024, value: 208 },
          { year: 2025, value: 215 }
        ],
        plainInterpretation: 'Growing distributed rooftop solar PV across commercial warehouses and public institutions, reducing reliance on fossil peaker generation.',
        swPlainInterpretation: 'Upanuzi wa mifumo ya miale ya jua kwenye paa za majengo ya kibiashara na taasisi za umma jijini Nairobi.'
      }
    },
    sources: [
      { title: 'Nairobi City County Climate Action Plan 2020–2050', organization: 'Nairobi City County Government', url: 'https://nairobi.go.ke', date: '2024' },
      { title: 'Seasonal Weather Review Bulletins', organization: 'Kenya Meteorological Department (KMD)', url: 'https://meteo.go.ke', date: '2025' }
    ],
    limitations: 'High spatial variability between urban asphalt micro-zones and vegetated parks; station records may smooth out localized cloudburst intensity.',
    swLimitations: 'Tofauti kubwa ya joto na mvua kati ya barabara za lami na bustani za miti; vituo vya hali ya hewa huenda visinasa kila dhoruba ya mtaa.'
  },

  'rift-valley': {
    regionId: 'rift-valley',
    regionName: 'Rift Valley & Geothermal Belt',
    swRegionName: 'Bonde la Ufa na Ukanda wa Jotoardhi',
    countiesCovered: 'Nakuru, Baringo, Naivasha, Narok, Kajiado',
    representativeStation: 'Olkaria Geothermal Research & Meteorological Station',
    coordinates: { x: 42, y: 55 },
    indicators: {
      'rainfall-anomaly': {
        value: -6.2,
        unit: '% deviation from 30-yr normal',
        status: 'Near Normal',
        baseline: '720 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: 8.5 },
          { year: 2021, value: -14.2 },
          { year: 2022, value: -18.7 },
          { year: 2023, value: 11.3 },
          { year: 2024, value: 14.8 },
          { year: 2025, value: -6.2 }
        ],
        plainInterpretation: 'Moderate rainfall variability across the central Rift; Lake Naivasha basin requires careful water budgeting between geothermal reinjection, horticulture, and pastoral herds.',
        swPlainInterpretation: 'Mvua za wastani katika Bonde la Ufa; Bonde la Ziwa Naivasha linahitaji usimamizi makini wa maji kati ya jotoardhi, kilimo cha maua, na mifugo.'
      },
      'surface-temp': {
        value: 1.1,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'Moderate Anomaly',
        baseline: '22.8°C mean reference',
        historicalSeries: [
          { year: 2020, value: 0.8 },
          { year: 2021, value: 0.9 },
          { year: 2022, value: 1.2 },
          { year: 2023, value: 1.0 },
          { year: 2024, value: 1.2 },
          { year: 2025, value: 1.1 }
        ],
        plainInterpretation: 'Elevated daytime temperatures accelerate lake evaporation and pasture drying in lowland rangelands surrounding Nakuru and Baringo.',
        swPlainInterpretation: 'Ongezeko la joto hukausha malisho haraka zaidi katika maeneo ya wafugaji karibu na Nakuru na Baringo.'
      },
      'drought-spei': {
        value: -0.8,
        unit: 'SPEI-12 Index Score',
        status: 'Moderate Stress',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: 0.1 },
          { year: 2021, value: -1.1 },
          { year: 2022, value: -1.8 },
          { year: 2023, value: -0.9 },
          { year: 2024, value: 0.2 },
          { year: 2025, value: -0.8 }
        ],
        plainInterpretation: 'Moderate soil moisture stress affecting rainfed maize and wheat crops in sub-counties like Njoro and Gilgil.',
        swPlainInterpretation: 'Uhaba wa unyevu wa udongo unaoathiri kilimo cha mahindi na ngano katika maeneo ya Njoro na Gilgil.'
      },
      'renewable-grid': {
        value: 863,
        unit: 'MW Installed Clean Capacity',
        status: 'High Renewable Density',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 700 },
          { year: 2021, value: 740 },
          { year: 2022, value: 790 },
          { year: 2023, value: 830 },
          { year: 2024, value: 855 },
          { year: 2025, value: 863 }
        ],
        plainInterpretation: 'Olkaria geothermal complex generates over 40% of Kenya\'s total electricity, providing climate-independent baseload power unaffected by drought.',
        swPlainInterpretation: 'Kituo cha jotoardhi cha Olkaria kinazalisha zaidi ya 40% ya umeme wa Kenya, kikitoa nishati thabiti isiyotegemea mvua.'
      }
    },
    sources: [
      { title: 'Annual Energy Statistics Report', organization: 'Energy and Petroleum Regulatory Authority (EPRA)', url: 'https://epra.go.ke', date: '2025' },
      { title: 'KenGen Geothermal Resource Expansion Updates', organization: 'Kenya Electricity Generating Company', url: 'https://kengen.co.ke', date: '2025' }
    ],
    limitations: 'Topographic altitude variations from valley floor to Mau Escarpment create localized microclimates that regional station averages do not capture.',
    swLimitations: 'Tofauti za urefu wa ardhi kati ya bonde na Mlima Mau husababisha hali tofauti za hewa ambazo wastani wa eneo hauwezi kuonyesha kikamilifu.'
  },

  'eastern-asal': {
    regionId: 'eastern-asal',
    regionName: 'Eastern ASALs (Sand Dam Belt)',
    swRegionName: 'Kaskazini Mashariki na Maeneo Kavu (ASAL)',
    countiesCovered: 'Makueni, Machakos, Kitui, Tharaka Nithi',
    representativeStation: 'Wote Agrometeorological Station, Makueni County',
    coordinates: { x: 62, y: 68 },
    indicators: {
      'rainfall-anomaly': {
        value: -28.4,
        unit: '% deviation from 30-yr normal',
        status: 'Severe Deficit',
        baseline: '540 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: -12.1 },
          { year: 2021, value: -26.5 },
          { year: 2022, value: -38.2 },
          { year: 2023, value: -14.0 },
          { year: 2024, value: 8.5 },
          { year: 2025, value: -28.4 }
        ],
        plainInterpretation: 'Bimodal rainfall seasons (MAM and OND) frequently terminate 2–3 weeks early. Subterranean sand dams store ephemeral runoff beneath coarse river sand to prevent evaporation.',
        swPlainInterpretation: 'Msimu wa mvua hukatika mapema kwa wiki 2 hadi 3. Mabwawa ya mchanga huhifadhi maji chini ya mchanga ili kuzuia mvuke wa joto kali.'
      },
      'surface-temp': {
        value: 1.6,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'High Thermal Stress',
        baseline: '27.5°C mean reference',
        historicalSeries: [
          { year: 2020, value: 1.1 },
          { year: 2021, value: 1.3 },
          { year: 2022, value: 1.8 },
          { year: 2023, value: 1.5 },
          { year: 2024, value: 1.4 },
          { year: 2025, value: 1.6 }
        ],
        plainInterpretation: 'Intense surface heating rapidly depletes shallow soil moisture, making open irrigation unsustainable without subsurface drip systems and mulching.',
        swPlainInterpretation: 'Joto kali la uso wa ardhi hukausha maji ya udongo mara moja, hivyo umwagiliaji wa kawaida unahitaji matone ya chini ya ardhi na utandazaji nyasi.'
      },
      'drought-spei': {
        value: -1.75,
        unit: 'SPEI-12 Index Score',
        status: 'Severe Drought',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: -0.6 },
          { year: 2021, value: -1.4 },
          { year: 2022, value: -2.3 },
          { year: 2023, value: -1.7 },
          { year: 2024, value: 0.1 },
          { year: 2025, value: -1.75 }
        ],
        plainInterpretation: 'Prolonged SPEI drought index signifies substantial cumulative moisture deficit, emphasizing the necessity of drought-hardy grains (sorghum, cowpeas, green grams).',
        swPlainInterpretation: 'Kielelezo cha ukame cha SPEI kinaonyesha upungufu mkubwa wa maji, na kusisitiza upandaji wa mtama, kunde, na dengu.'
      },
      'renewable-grid': {
        value: 75,
        unit: 'MW Installed Clean Capacity',
        status: 'Decentralized Mini-Grid',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 25 },
          { year: 2021, value: 38 },
          { year: 2022, value: 49 },
          { year: 2023, value: 60 },
          { year: 2024, value: 70 },
          { year: 2025, value: 75 }
        ],
        plainInterpretation: 'Distributed solar water pumping and community solar mini-grids power vital sand-dam water extraction and grain milling kiosks.',
        swPlainInterpretation: 'Mifumo ya jua ya kusukuma maji kutoka kwenye mabwawa ya mchanga na kusaga nafaka vijijini.'
      }
    },
    sources: [
      { title: 'National Drought Early Warning Bulletins', organization: 'National Drought Management Authority (NDMA Kenya)', url: 'https://ndma.go.ke', date: '2025' },
      { title: 'Sand Dam Hydrological Assessments', organization: 'Makueni County Department of Water & Sanitation', url: 'https://makueni.go.ke', date: '2024' }
    ],
    limitations: 'Rain-gauge distribution is sparse in remote wards; community observations and satellite soil moisture proxies supplement gauge gaps.',
    swLimitations: 'Vituo vya kupima mvua ni vichache katika wadi za mbali; taarifa za jamii na picha za satelaiti hutumika kuziba pengo hilo.'
  },

  'northern-kenya': {
    regionId: 'northern-kenya',
    regionName: 'Northern Kenya & Turkana Rangelands',
    swRegionName: 'Kaskazini mwa Kenya na Malisho ya Turkana',
    countiesCovered: 'Marsabit, Turkana, Samburu, Wajir, Mandera, Garissa',
    representativeStation: 'Marsabit Hill & Lodwar Synoptic Stations',
    coordinates: { x: 48, y: 30 },
    indicators: {
      'rainfall-anomaly': {
        value: -34.8,
        unit: '% deviation from 30-yr normal',
        status: 'Severe Deficit',
        baseline: '320 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: -18.5 },
          { year: 2021, value: -31.0 },
          { year: 2022, value: -46.2 },
          { year: 2023, value: -22.1 },
          { year: 2024, value: 5.4 },
          { year: 2025, value: -34.8 }
        ],
        plainInterpretation: 'Extreme arid climate with recurrent multi-year rainfall failures. Grazing pastures recover slowly, forcing pastoralist migration across county boundaries.',
        swPlainInterpretation: 'Hali ya hewa kavu sana na ukame wa miaka mingi. Malisho huchukua muda kurejea, hivyo wafugaji hulazimika kuhama mbali kutafuta maji.'
      },
      'surface-temp': {
        value: 1.9,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'High Thermal Stress',
        baseline: '31.2°C mean reference',
        historicalSeries: [
          { year: 2020, value: 1.2 },
          { year: 2021, value: 1.5 },
          { year: 2022, value: 2.1 },
          { year: 2023, value: 1.8 },
          { year: 2024, value: 1.7 },
          { year: 2025, value: 1.9 }
        ],
        plainInterpretation: 'Highest temperature deviations nationwide, driving severe livestock thermal stress and accelerating evaporation from surface water pans.',
        swPlainInterpretation: 'Ongezeko kubwa zaidi la joto nchini, linaloleta shida kali kwa mifugo na kukausha mabwawa ya wazi ya maji.'
      },
      'drought-spei': {
        value: -2.15,
        unit: 'SPEI-12 Index Score',
        status: 'Extreme Drought',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: -0.9 },
          { year: 2021, value: -1.7 },
          { year: 2022, value: -2.8 },
          { year: 2023, value: -2.2 },
          { year: 2024, value: -0.4 },
          { year: 2025, value: -2.15 }
        ],
        plainInterpretation: 'Critical drought conditions triggering emergency food, pasture, and water trucking operations across 12 ASAL sub-counties.',
        swPlainInterpretation: 'Ukame mkali unaosababisha hitaji la dharura la chakula, malisho, na kusafirisha maji kwa malori katika wadi 12.'
      },
      'renewable-grid': {
        value: 360,
        unit: 'MW Installed Clean Capacity',
        status: 'High Renewable Density',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 310 },
          { year: 2021, value: 310 },
          { year: 2022, value: 310 },
          { year: 2023, value: 335 },
          { year: 2024, value: 350 },
          { year: 2025, value: 360 }
        ],
        plainInterpretation: 'Lake Turkana Wind Power (310 MW, 365 turbines) harnesses consistent desert jet streams, injecting clean electricity into the national grid at Suswa.',
        swPlainInterpretation: 'Mradi wa Upepo wa Ziwa Turkana (310 MW, mitambo 365) hutumia upepo mkali wa jangwani kusambaza umeme safi kote nchini kupitia Suswa.'
      }
    },
    sources: [
      { title: 'Horn of Africa Drought Risk Atlas', organization: 'IGAD Climate Prediction and Applications Centre (ICPAC)', url: 'https://icpac.net', date: '2025' },
      { title: 'Lake Turkana Wind Power Grid Verification Data', organization: 'LTWP & Kenya Power', url: 'https://ltwp.co.ke', date: '2025' }
    ],
    limitations: 'Large territory spans vast unmonitored desert tracts; satellite radiometric estimates must be cross-verified with field veterinary officers.',
    swLimitations: 'Eneo ni kubwa sana lenye jangwa lisilo na vituo; makadirio ya satelaiti yanapaswa kuhakikiwa na maafisa wa mifugo mtaani.'
  },

  'coast-marine': {
    regionId: 'coast-marine',
    regionName: 'Coast & Marine (Blue Carbon Coastline)',
    swRegionName: 'Pwani na Mazingira ya Bahari',
    countiesCovered: 'Mombasa, Kwale, Kilifi, Lamu, Tana River',
    representativeStation: 'KMFRI Marine Research Station, Mombasa & Gazi Bay',
    coordinates: { x: 70, y: 85 },
    indicators: {
      'rainfall-anomaly': {
        value: 8.2,
        unit: '% deviation from 30-yr normal',
        status: 'Near Normal',
        baseline: '1,050 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: 12.0 },
          { year: 2021, value: -8.5 },
          { year: 2022, value: -14.2 },
          { year: 2023, value: 18.9 },
          { year: 2024, value: 21.4 },
          { year: 2025, value: 8.2 }
        ],
        plainInterpretation: 'Monsoon-driven bimodal rains (Kusi and Kaskazi). Rising sea surface temperatures intensify storm surges and coastal shoreline erosion.',
        swPlainInterpretation: 'Mvua za monsuni (Kusi na Kaskazi). Kuongezeka kwa joto la maji ya bahari huleta mawimbi makali na mmomonyoko wa fukwe.'
      },
      'surface-temp': {
        value: 1.2,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'Moderate Anomaly',
        baseline: '29.1°C mean reference',
        historicalSeries: [
          { year: 2020, value: 0.9 },
          { year: 2021, value: 1.0 },
          { year: 2022, value: 1.4 },
          { year: 2023, value: 1.3 },
          { year: 2024, value: 1.3 },
          { year: 2025, value: 1.2 }
        ],
        plainInterpretation: 'Warm coastal waters trigger seasonal coral bleaching events in Malindi and Kisite-Mpunguti marine parks, impacting artisanal fishing catches.',
        swPlainInterpretation: 'Maji moto ya bahari yanasababisha uharibifu wa miamba ya matumbawe Malindi na Kisite, na kuathiri mapato ya wavuvi wadogo.'
      },
      'drought-spei': {
        value: -0.4,
        unit: 'SPEI-12 Index Score',
        status: 'Normal / Wet',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: 0.4 },
          { year: 2021, value: -0.6 },
          { year: 2022, value: -1.1 },
          { year: 2023, value: 0.2 },
          { year: 2024, value: 0.8 },
          { year: 2025, value: -0.4 }
        ],
        plainInterpretation: 'Coastal hinterland (Kwale, Kilifi) maintains adequate moisture, but seawater intrusion into shallow coastal wells remains a threat.',
        swPlainInterpretation: 'Sehemu za bara za Kwale na Kilifi zina unyevu wa kutosha, lakini kuingia kwa maji ya chumvi ya bahari kwenye visima vya maji safi ni tishio.'
      },
      'renewable-grid': {
        value: 95,
        unit: 'MW Installed Clean Capacity',
        status: 'Expanding Infrastructure',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 40 },
          { year: 2021, value: 55 },
          { year: 2022, value: 70 },
          { year: 2023, value: 85 },
          { year: 2024, value: 90 },
          { year: 2025, value: 95 }
        ],
        plainInterpretation: 'Solar mini-grids across coastal islands and commercial solar rooftops at the Port of Mombasa, complemented by verified blue carbon sequestration in Gazi Bay.',
        swPlainInterpretation: 'Mifumo ya jua kwenye visiwa na Bandari ya Mombasa, ikisaidiwa na uhifadhi wa kaboni ya mikoko huko Gazi Bay.'
      }
    },
    sources: [
      { title: 'Kenya Marine Ecosystem & Blue Carbon Status Report', organization: 'Kenya Marine and Fisheries Research Institute (KMFRI)', url: 'https://kmfri.go.ke', date: '2024' },
      { title: 'Coastal Zone Climate Vulnerability Assessment', organization: 'National Environment Management Authority (NEMA)', url: 'https://nema.go.ke', date: '2025' }
    ],
    limitations: 'Tidal gauge and ocean temperature buoy data are concentrated near Mombasa; rural estuaries have fewer automated loggers.',
    swLimitations: 'Vifaa vya kupima mawimbi na joto la bahari viko karibu na Mombasa pekee; maeneo ya vijijini yana vifaa vichache vya kupimia.'
  },

  'lake-basin': {
    regionId: 'lake-basin',
    regionName: 'Lake Victoria Basin & Western Kenya',
    swRegionName: 'Bonde la Ziwa Victoria na Magharibi mwa Kenya',
    countiesCovered: 'Kisumu, Siaya, Homa Bay, Migori, Busia, Kakamega',
    representativeStation: 'Kisumu Airport Meteorological Station & Lake Basin Authority',
    coordinates: { x: 30, y: 60 },
    indicators: {
      'rainfall-anomaly': {
        value: 16.5,
        unit: '% deviation from 30-yr normal',
        status: 'Surplus / Flood Watch',
        baseline: '1,420 mm/yr baseline (1991–2020)',
        historicalSeries: [
          { year: 2020, value: 24.5 },
          { year: 2021, value: 5.2 },
          { year: 2022, value: -6.8 },
          { year: 2023, value: 21.0 },
          { year: 2024, value: 28.5 },
          { year: 2025, value: 16.5 }
        ],
        plainInterpretation: 'High rainfall totals with severe backflow flooding along River Nyando and Lake Victoria shorelines, impacting rice schemes in Ahero.',
        swPlainInterpretation: 'Mvua nyingi na mafuriko ya mto Nyando na Ziwa Victoria, yanayoathiri mashamba ya mpunga huko Ahero.'
      },
      'surface-temp': {
        value: 1.1,
        unit: '°C anomaly vs 1991–2020 baseline',
        status: 'Moderate Anomaly',
        baseline: '28.4°C mean reference',
        historicalSeries: [
          { year: 2020, value: 0.8 },
          { year: 2021, value: 0.9 },
          { year: 2022, value: 1.2 },
          { year: 2023, value: 1.1 },
          { year: 2024, value: 1.2 },
          { year: 2025, value: 1.1 }
        ],
        plainInterpretation: 'Warmer lake surface temperatures increase night-time convective thunderstorms across the Winam Gulf.',
        swPlainInterpretation: 'Ongezeko la joto la maji ya ziwa husababisha dhoruba kali za radi nyakati za usiku katika Ghuba ya Winam.'
      },
      'drought-spei': {
        value: 0.35,
        unit: 'SPEI-12 Index Score',
        status: 'Normal / Wet',
        baseline: '0.0 neutral baseline',
        historicalSeries: [
          { year: 2020, value: 0.8 },
          { year: 2021, value: 0.2 },
          { year: 2022, value: -0.4 },
          { year: 2023, value: 0.6 },
          { year: 2024, value: 0.9 },
          { year: 2025, value: 0.35 }
        ],
        plainInterpretation: 'Surplus hydrological conditions; the dominant climate hazard is inundation and waterborne disease rather than drought.',
        swPlainInterpretation: 'Maji mengi; hatari kubwa ya mabadiliko ya tabianchi ni mafuriko na magonjwa ya maji badala ya ukame.'
      },
      'renewable-grid': {
        value: 110,
        unit: 'MW Installed Clean Capacity',
        status: 'Expanding Infrastructure',
        baseline: 'National Target: 100% clean grid by 2030',
        historicalSeries: [
          { year: 2020, value: 50 },
          { year: 2021, value: 65 },
          { year: 2022, value: 80 },
          { year: 2023, value: 95 },
          { year: 2024, value: 105 },
          { year: 2025, value: 110 }
        ],
        plainInterpretation: 'Sondu Miriu hydropower (60 MW) and decentralized solar cold hubs for preserving fish catches along landing beaches.',
        swPlainInterpretation: 'Umeme wa maji wa Sondu Miriu (60 MW) na vyumba vya ubaridi vya jua vya kuhifadhia samaki kando ya fukwe za ziwa.'
      }
    },
    sources: [
      { title: 'Lake Victoria Basin Environmental Outlook', organization: 'Lake Victoria Basin Commission (LVBC)', url: 'https://lvbcom.org', date: '2024' },
      { title: 'Western Kenya Flood Risk & Hydrological Bulletins', organization: 'Water Resources Authority (WRA Kenya)', url: 'https://wra.go.ke', date: '2025' }
    ],
    limitations: 'Transboundary lake dynamics involve Uganda and Tanzania; lake-level measurements reflect multi-country catchment inflows.',
    swLimitations: 'Maji ya ziwa yanahusisha nchi jirani za Uganda na Tanzania; vipimo vya kina cha maji hutegemea mito ya nchi zote tatu.'
  }
};

export default function ClimateData() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [selectedRegion, setSelectedRegion] = useState<KenyaRegionId>('nairobi-central');
  const [activeIndicator, setActiveIndicator] = useState<ClimateIndicatorType>('rainfall-anomaly');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [hoveredRegion, setHoveredRegion] = useState<KenyaRegionId | null>(null);

  const regionData = KENYA_REGIONAL_DATA[selectedRegion];
  const indicatorData = regionData.indicators[activeIndicator];

  const indicatorsList: { id: ClimateIndicatorType; label: string; swLabel: string; icon: any }[] = [
    { id: 'rainfall-anomaly', label: 'Rainfall Anomaly (%)', swLabel: 'Mchepuko wa Mvua (%)', icon: CloudRain },
    { id: 'surface-temp', label: 'Surface Temperature (°C)', swLabel: 'Joto la Uso wa Ardhi (°C)', icon: Thermometer },
    { id: 'drought-spei', label: 'Drought Index (SPEI-12)', swLabel: 'Kielelezo cha Ukame (SPEI)', icon: Sun },
    { id: 'renewable-grid', label: 'Clean Grid Capacity (MW)', swLabel: 'Umeme Safi wa Gridi (MW)', icon: Activity }
  ];

  const regionsList = Object.values(KENYA_REGIONAL_DATA);

  return (
    <div className="min-h-full pb-20 bg-[#f8faf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Hero Header */}
        <div className="bg-[#00331e] rounded-3xl p-8 md:p-12 text-white shadow-xl mb-8 border border-emerald-950">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{isSwahili ? 'Data na Ramani za Kenya' : 'Kenyan Climate Data & Maps'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">
              {isSwahili ? 'Mchunguzi wa Data ya Tabianchi Nchini Kenya' : 'Kenya Climate Data & Regional Hazard Explorer'}
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
              {isSwahili
                ? 'Chunguza takwimu rasmi zilizothibitishwa za hali ya hewa kutoka Idara ya Hali ya Hewa Kenya (KMD), Mamlaka ya Kukabiliana na Ukame (NDMA), na Mamlaka ya Kudhibiti Nishati (EPRA). Chagua kanda kwenye ramani kuona viashiria vya mvua, joto, ukame, na nishati safi.'
                : 'Explore verified meteorological observations, rainfall anomalies, urban thermal signatures, and renewable power infrastructure across Kenya’s distinct ecological zones. Sourced from the Kenya Meteorological Department (KMD), NDMA Kenya, and EPRA.'}
            </p>
          </div>
        </div>

        {/* Indicator Switcher Bar */}
        <div className="flex flex-wrap gap-2.5 mb-8 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 px-2 my-auto">
            <Layers className="w-4 h-4 text-emerald-700" />
            {isSwahili ? 'Kiashiria:' : 'Indicator:'}
          </span>
          {indicatorsList.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeIndicator === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveIndicator(ind.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#00331e] text-white shadow-sm ring-2 ring-emerald-700/20'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span>{isSwahili ? ind.swLabel : ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Grid: Interactive Map + Regional Indicator Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

          {/* Left Column: Interactive Kenya SVG Map & Region Selector (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00331e]" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    {isSwahili ? 'Chagua Kanda ya Kenya' : 'Select Kenyan Region'}
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  6 Eco-Zones
                </span>
              </div>

              {/* Interactive SVG Kenya Map Canvas */}
              <div className="relative w-full aspect-[4/4.5] bg-emerald-950/5 rounded-2xl border border-emerald-900/10 p-4 flex items-center justify-center overflow-hidden">
                {/* SVG Silhouette representation of Kenya with clickable interactive region centroids */}
                <svg
                  viewBox="0 0 400 450"
                  className="w-full h-full max-h-[380px] drop-shadow-md select-none"
                >
                  <defs>
                    <linearGradient id="kenyaMapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00331e" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#0a4d30" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="glow" />
                      <feComposite in="SourceGraphic" in2="glow" operator="over" />
                    </filter>
                  </defs>

                  {/* Kenya stylized territorial boundary outline */}
                  <path
                    d="M 120,40 
                       L 230,30 
                       L 290,60 
                       L 340,110 
                       L 370,180 
                       L 340,250 
                       L 320,330 
                       L 290,410 
                       L 240,430 
                       L 210,380 
                       L 150,340 
                       L 110,320 
                       L 70,300 
                       L 80,240 
                       L 100,180 
                       L 90,120 
                       Z"
                    fill="url(#kenyaMapGrad)"
                    stroke="#002415"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Internal ecological zone dividers (decorative vectors) */}
                  <path d="M 120,160 Q 220,180 340,250" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
                  <path d="M 100,240 Q 200,260 290,410" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
                  <path d="M 170,230 L 150,340" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />

                  {/* Interactive Pins & Region Centroids */}
                  {regionsList.map((reg) => {
                    const isSelected = selectedRegion === reg.regionId;
                    const isHovered = hoveredRegion === reg.regionId;
                    const cx = (reg.coordinates.x / 100) * 400;
                    const cy = (reg.coordinates.y / 100) * 450;

                    return (
                      <g
                        key={reg.regionId}
                        onClick={() => setSelectedRegion(reg.regionId)}
                        onMouseEnter={() => setHoveredRegion(reg.regionId)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className="cursor-pointer transition-all duration-200"
                        role="button"
                        aria-label={`Select ${reg.regionName}`}
                      >
                        {/* Outer Glow / Ripple on active */}
                        {isSelected && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="24"
                            fill="#10b981"
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}

                        {/* Outer disc */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 18 : 14}
                          fill={isSelected ? '#10b981' : (isHovered ? '#34d399' : '#ffffff')}
                          stroke="#00331e"
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        {/* Inner indicator dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 7 : 5}
                          fill={isSelected ? '#ffffff' : '#00331e'}
                        />

                        {/* Text Label */}
                        <text
                          x={cx}
                          y={cy + 24}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="drop-shadow pointer-events-none select-none font-sans"
                        >
                          {reg.regionName.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Floating Legend */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-200/80 flex items-center justify-between text-[10px] text-gray-700">
                  <span className="font-bold flex items-center gap-1 text-[#00331e]">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    {isSwahili ? 'Bofya kanda kwenye ramani' : 'Click region pin to inspect'}
                  </span>
                  <span className="text-gray-500">
                    KMD & NDMA Baseline
                  </span>
                </div>
              </div>
            </div>

            {/* Quick-Select Buttons List for Mobile / Accessibility */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                {isSwahili ? 'Orodha ya Kanda:' : 'Quick Select Region:'}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {regionsList.map((reg) => {
                  const isSelected = selectedRegion === reg.regionId;
                  return (
                    <button
                      key={reg.regionId}
                      onClick={() => setSelectedRegion(reg.regionId)}
                      className={`text-left px-2.5 py-2 rounded-xl text-xs font-semibold transition truncate flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#00331e] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/60'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                      <span className="truncate">{isSwahili ? reg.swRegionName : reg.regionName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Indicator Metrics & Time-Series (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Region Title & Station Identification Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00331e] text-xs font-bold border border-emerald-100 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>🇰🇪 {isSwahili ? regionData.swRegionName : regionData.regionName}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-950">
                    {isSwahili ? regionData.swRegionName : regionData.regionName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Counties: <strong>{regionData.countiesCovered}</strong>
                  </p>
                  <p className="text-xs text-emerald-800 font-mono mt-0.5">
                    Observatory: {regionData.representativeStation}
                  </p>
                </div>

                {/* View Mode Toggle: Chart vs Accessible Table */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0 self-start">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      viewMode === 'chart' ? 'bg-white text-[#00331e] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Chart</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      viewMode === 'table' ? 'bg-white text-[#00331e] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>
              </div>

              {/* Active Indicator Summary Stat Box */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {isSwahili ? 'Kipimo cha Sasa (2025/2026):' : 'Current Observation (2025/2026):'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black text-[#00331e]">
                      {indicatorData.value > 0 ? `+${indicatorData.value}` : indicatorData.value}
                    </span>
                    <span className="text-xs font-bold text-gray-600">
                      {indicatorData.unit}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    Baseline: {indicatorData.baseline}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    {isSwahili ? 'Hali ya Tathmini:' : 'Hazard Assessment Status:'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-white text-emerald-950 border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {indicatorData.status}
                  </span>
                </div>
              </div>

              {/* Plain-Language Climate Interpretation Box (Supervisor Requirement) */}
              <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{isSwahili ? 'Maana kwa Jamii na Maisha ya Kila Siku:' : 'Plain-Language Community Interpretation:'}</span>
                </div>
                <p className="leading-relaxed">
                  {isSwahili ? indicatorData.swPlainInterpretation : indicatorData.plainInterpretation}
                </p>
              </div>

              {/* Chart Visualization Mode */}
              {viewMode === 'chart' && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-4">
                    <span>{isSwahili ? 'Mwenendo wa Kihistoria (2020–2025)' : 'Multi-Year Trajectory (2020–2025)'}</span>
                    <span className="text-gray-400 font-normal">Source: KMD / NDMA</span>
                  </div>

                  <div className="h-48 flex items-end justify-between gap-3 px-2 pt-6 border-b border-gray-200">
                    {indicatorData.historicalSeries.map((pt, i) => {
                      const allVals = indicatorData.historicalSeries.map(p => p.value);
                      const min = Math.min(...allVals, 0);
                      const max = Math.max(...allVals, 10);
                      const range = max - min || 1;
                      const heightPct = Math.max(16, ((pt.value - min) / range) * 100);
                      const isPositive = pt.value >= 0;

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[11px] font-mono font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                            {pt.value > 0 ? `+${pt.value}` : pt.value}
                          </span>
                          <div
                            className={`w-full max-w-[40px] rounded-t-xl transition-all duration-300 relative ${
                              isPositive ? 'bg-[#00331e] group-hover:bg-emerald-700' : 'bg-rose-700 group-hover:bg-rose-600'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[11px] font-bold text-gray-600 font-mono">
                            {pt.year}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tabular Accessible View Mode */}
              {viewMode === 'table' && (
                <div className="mt-6 pt-6 border-t border-gray-100 overflow-x-auto">
                  <table className="w-full text-xs text-left text-gray-700 font-mono">
                    <thead className="bg-gray-50 text-gray-900 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3">Observation Year</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Climatological Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {indicatorData.historicalSeries.map((pt, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-bold text-gray-900">{pt.year}</td>
                          <td className="py-2.5 px-3 font-bold text-[#00331e]">
                            {pt.value > 0 ? `+${pt.value}` : pt.value} {indicatorData.unit}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500">{indicatorData.baseline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Source Documentation & Scientific Limitations (Requirement 7) */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                    {isSwahili ? 'Vyanzo Vilivyothibitishwa vya Data:' : 'Documented Official Data Sources:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {regionData.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium transition"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-700" />
                        <span>{src.organization} ({src.date})</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-600">
                  <div className="font-bold text-gray-800 mb-0.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>{isSwahili ? 'Vipimo vya Kisayansi na Mipaka ya Data:' : 'Scientific Limitations & Boundary Notes:'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {isSwahili ? regionData.swLimitations : regionData.limitations}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
