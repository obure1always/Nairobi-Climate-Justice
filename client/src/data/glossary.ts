export interface GlossaryTerm {
  id: string;
  term: { en: string; sw: string };
  definition: { en: string; sw: string };
  example: { en: string; sw: string };
  moduleId: string; // 'm1' - 'm7'
  category: 'climate-science' | 'flooding-drainage' | 'heat-health' | 'water-sanitation' | 'climate-justice' | 'green-claims' | 'civic-governance';
}

export const glossaryTerms: GlossaryTerm[] = [
  // Module 1: Nairobi Climate Risk (10 terms)
  {
    id: 'term-1',
    term: { en: 'Weather', sw: 'Hali ya Hewa' },
    definition: {
      en: 'The day-to-day state of the atmosphere regarding temperature, rain, wind, and humidity at a specific place and time.',
      sw: 'Hali ya anga ya kila siku kuhusu joto, mvua, upepo, na unyevunyevu katika eneo na wakati maalum.'
    },
    example: {
      en: 'A sudden afternoon rain shower in Westlands followed by a cold evening.',
      sw: 'Mvua ya ghafla ya alasiri Westlands ikifuatiwa na baridi ya jioni.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-2',
    term: { en: 'Climate', sw: 'Tabianchi' },
    definition: {
      en: 'The statistical average and patterns of weather measured over a long period, typically 30 years or more.',
      sw: 'Wastani wa takwimu na mifumo ya hali ya hewa iliyopimwa kwa kipindi kirefu, kwa kawaida miaka 30 au zaidi.'
    },
    example: {
      en: 'Nairobi’s historical equatorial highland climate having two distinct rainy seasons: March–May and October–December.',
      sw: 'Tabianchi ya nyanda za juu za ikweta ya Nairobi yenye misimu miwili ya mvua: Machi–Mei na Oktoba–Desemba.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-3',
    term: { en: 'Climate Variability', sw: 'Mabadiliko ya Misimu' },
    definition: {
      en: 'Natural short-to-medium-term swings in climate patterns around a long-term average, such as El Niño and La Niña cycles.',
      sw: 'Mabadiliko ya kawaida ya asili ya mifumo ya hewa kuzunguka wastani wa muda mrefu, kama vile vipindi vya El Niño na La Niña.'
    },
    example: {
      en: 'A drought year where seasonal rains fail, followed two years later by an El Niño with heavy rains.',
      sw: 'Mwaka wa kiangazi ambapo mvua za msimu zinakosekana, ukifuatiwa na mwaka wenye El Niño na mvua nyingi.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-4',
    term: { en: 'Climate Change', sw: 'Mabadiliko ya Tabianchi' },
    definition: {
      en: 'Long-term, systemic shifts in global temperatures and weather patterns driven primarily by human greenhouse gas emissions.',
      sw: 'Mabadiliko ya kudumu na ya kimfumo ya joto la dunia na mifumo ya anga yanayosababishwa na uzalishaji wa gesi chafu wa binadamu.'
    },
    example: {
      en: 'A continuous multi-decade upward trend in average Nairobi temperatures and increased frequency of extreme storms.',
      sw: 'Mwelekeo wa miongo mingi wa kupanda kwa wastani wa joto Nairobi na kuongezeka kwa dhoruba kali.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-5',
    term: { en: 'Greenhouse Effect', sw: 'Athari ya Chafu' },
    definition: {
      en: 'The natural process where atmospheric gases trap infrared radiation from Earth, warming the planet to habitable temperatures.',
      sw: 'Mchakato wa asili ambapo gesi za angani zinatega mionzi ya joto kutoka ardhini na kufanya sayari iwe na joto linalowezesha uhai.'
    },
    example: {
      en: 'Gases like water vapor and carbon dioxide keeping Earth at an average 15°C instead of a frozen -18°C.',
      sw: 'Gesi kama mvuke wa maji na kaboni dioksidi zinazofanya dunia kuwa na wastani wa nyuzi 15°C badala ya kuganda kwenye -18°C.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-6',
    term: { en: 'Enhanced Greenhouse Effect', sw: 'Ongezeko la Athari ya Chafu' },
    definition: {
      en: 'The intensification of natural heat-trapping caused by human additions of greenhouse gases like carbon dioxide and methane.',
      sw: 'Kuzidi kwa mtego wa joto angani kunakosababishwa na uzalishaji mkubwa wa ziada wa gesi chafu kutoka viwandani na mafuta.'
    },
    example: {
      en: 'Industrial burning of fossil fuels raising global carbon dioxide concentrations from 280 ppm to over 420 ppm.',
      sw: 'Uchomaji wa mafuta ya kisukuku ukipandisha kiwango cha kaboni angani kutoka 280 ppm hadi zaidi ya 420 ppm.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-7',
    term: { en: 'Urban Heat Island (UHI)', sw: 'Kisiwa cha Joto Mjini' },
    definition: {
      en: 'An urban area that is significantly warmer than surrounding rural areas due to human infrastructure, concrete, and waste heat.',
      sw: 'Eneo la jiji lenye joto la juu zaidi kuliko maeneo ya mashambani yanayolizunguka kutokana na zege, lami, na ukosefu wa mimea.'
    },
    example: {
      en: 'Nairobi CBD and industrial zones staying 3 to 6°C warmer at night than Ngong forest or Tigoni tea fields.',
      sw: 'Katikati ya jiji la Nairobi kuwa na joto la juu kwa nyuzi 3 hadi 6°C usiku kuliko msitu wa Ngong au mashamba ya chai ya Tigoni.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-8',
    term: { en: 'Albedo', sw: 'Uakisi wa Mwanga (Albedo)' },
    definition: {
      en: 'The fraction of solar radiation reflected by a surface, with light surfaces having high albedo and dark surfaces low albedo.',
      sw: 'Kiwango cha mionzi ya jua kinachoakisiwa na uso wa kitu; nyuso nyeupe huakisi sana na nyuso nyeusi hunyonya joto jingi.'
    },
    example: {
      en: 'Dark asphalt roads absorbing 90% of solar heat (low albedo) versus whitewashed roofs reflecting 80% (high albedo).',
      sw: 'Barabara nyeusi za lami zikinyonya 90% ya joto (albedo ndogo) ikilinganishwa na mabati meupe yanayoakisi 80% (albedo kubwa).'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-9',
    term: { en: 'Climate Hazard', sw: 'Hatari ya Tabianchi' },
    definition: {
      en: 'A potentially damaging physical climate event, such as a severe storm, prolonged drought, or extreme heat wave.',
      sw: 'Tukio la kimaumbile la hali ya hewa linaloweza kuleta madhara, kama dhoruba kali, ukame mrefu, au wimbi la joto kali.'
    },
    example: {
      en: 'A 70mm downpour hitting Nairobi within two hours.',
      sw: 'Mvua kubwa ya milimita 70 inayonyesha Nairobi ndani ya saa mbili tu.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },
  {
    id: 'term-10',
    term: { en: 'Adaptive Capacity', sw: 'Uwezo wa Kukabiliana' },
    definition: {
      en: 'The ability of systems, institutions, and individuals to adjust to potential damage, take advantage of opportunities, or respond to consequences.',
      sw: 'Uwezo wa jamii, taasisi, na watu kurekebisha mifumo yao, kupunguza madhara, na kujikwamua baada ya mishtuko ya tabianchi.'
    },
    example: {
      en: 'A youth group having savings reserves, flood barriers, and early warning WhatsApp chains to protect their workshop.',
      sw: 'Kikundi cha vijana chenye akiba ya fedha, vizuizi vya maji, na mtandao wa tahadhari wa WhatsApp kulinda karakana yao.'
    },
    moduleId: 'm1',
    category: 'climate-science'
  },

  // Module 2: Urban Flooding (10 terms)
  {
    id: 'term-11',
    term: { en: 'Surface Runoff', sw: 'Mtiririko wa Juu wa Maji' },
    definition: {
      en: 'Precipitation that cannot infiltrate into saturated or paved ground and flows over land into drains, streams, or streets.',
      sw: 'Maji ya mvua yasiyoweza kuingia ardhini kwa sababu ya ardhi kujaa au kufunikwa na zege, yanayotiririka juu ya ardhi kuelekea mitaroni.'
    },
    example: {
      en: 'Sheets of brown rainwater rushing down paved alleys in Kibera toward the Nairobi River.',
      sw: 'Maji ya mvua ya rangi ya kahawia yakitiririka kwa kasi kwenye njia za zege Kibera kuelekea Mto Nairobi.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-12',
    term: { en: 'Impervious Surface', sw: 'Uso Usiopitisha Maji' },
    definition: {
      en: 'Artificial structures such as pavements, roads, parking lots, and sheet-metal roofs that prevent water soaking into the soil.',
      sw: 'Miundo ya kibinadamu kama lami, barabara za zege, na mabati ya nyumba inayozuia maji ya mvua kupenya na kufyonzwa na ardhi.'
    },
    example: {
      en: 'Corrugated iron roofs covering over 80% of informal settlement land area, generating immediate storm runoff.',
      sw: 'Mabati ya nyumba yanayofunika zaidi ya 80% ya eneo la mtaa usio rasmi, yakizalisha mtiririko mkubwa wa maji ya dhoruba.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-13',
    term: { en: 'Catchment Basin (Watershed)', sw: 'Bonde la Mto (Watershed)' },
    definition: {
      en: 'An area of land where all surface water converges to a single point, such as a river exit or lake.',
      sw: 'Eneo la ardhi ambapo maji yote ya mvua hutiririka na kukutana kwenye mto mmoja au kijito kinachoelekea baharini au ziwani.'
    },
    example: {
      en: 'The Nairobi River Basin, draining water from the Ngong Hills and Aberdare foothills through Nairobi County.',
      sw: 'Bonde la Mto Nairobi, linalokusanya maji kutoka Milima ya Ngong na Aberdare yakipita katikati ya Kaunti ya Nairobi.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-14',
    term: { en: 'Riparian Reserve', sw: 'Ukanda wa Hifadhi ya Mto' },
    definition: {
      en: 'The legally protected strip of land bordering a river or lake where permanent construction is prohibited to preserve floodways.',
      sw: 'Ukanda wa ardhi kando ya mto au ziwa unaolindwa kisheria ambapo ujenzi wa kudumu umepigwa marufuku ili kuruhusu maji kupita.'
    },
    example: {
      en: 'Kenya’s EMCA 30-meter buffer zone along riverbanks intended to absorb seasonal high water surges.',
      sw: 'Ukanda wa mita 30 chini ya sheria ya EMCA kando ya mito nchini Kenya uliokusudiwa kupitisha na kupunguza kasi ya mafuriko.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-15',
    term: { en: 'Culvert', sw: 'Kalvati (Mtaro wa Chini ya Barabara)' },
    definition: {
      en: 'A tunnel or pipe structure built under a roadway or railway to allow water to pass freely from one side to the other.',
      sw: 'Bomba kubwa au mtaro wa zege uliojengwa chini ya barabara kuruhusu maji ya dhoruba kupita bila kuzuiliwa.'
    },
    example: {
      en: 'A 1.5-meter concrete culvert under Juja Road that floods when choked with uncollected plastic bags.',
      sw: 'Kalvati ya zege ya mita 1.5 chini ya Barabara ya Juja inayofurika inapozibwa na mifuko ya plastiki iliyotupwa.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-16',
    term: { en: 'Flash Flood', sw: 'Mafuriko ya Ghafla' },
    definition: {
      en: 'A rapid flood of great volume occurring within six hours, or even minutes, of heavy rainfall.',
      sw: 'Mafuriko ya ghafla yenye kiasi kikubwa cha maji yanayotokea ndani ya saa chache au dakika chache baada ya mvua kubwa kunyesha.'
    },
    example: {
      en: 'Riverbanks in Mathare bursting and flooding homes within 20 minutes of an intense thunderstorm.',
      sw: 'Mto Mathare kufurika na kuingia ndani ya nyumba ndani ya dakika 20 baada ya dhoruba kali kuanza.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-17',
    term: { en: 'Go-Bag (Emergency Kit)', sw: 'Mfuko wa Dharura (Go-Bag)' },
    definition: {
      en: 'A portable, waterproof emergency backpack containing essential supplies, medicines, documents, and tools for rapid evacuation.',
      sw: 'Begi linalobebeka lisilopitisha maji lililowekwa vitu muhimu, dawa, nyaraka za vitambulisho, na tochi kwa ajili ya kuondoka haraka.'
    },
    example: {
      en: 'A sealed bag containing national identity cards, birth certificates, daily medications, and a whistle hung near the doorway.',
      sw: 'Mfuko uliofungwa wenye vitambulisho vya kitaifa, vyeti vya kuzaliwa, dawa za kila siku, na filimbi uliotundikwa karibu na mlango.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-18',
    term: { en: 'Flood Exposure', sw: 'Mfiduo wa Mafuriko' },
    definition: {
      en: 'The presence of people, livelihoods, housing, and infrastructure in hazard-prone flood zones.',
      sw: 'Kuwepo kwa watu, makazi, biashara, na miundombinu ndani ya maeneo yaliyo katika hatari ya kujaa maji.'
    },
    example: {
      en: 'Over 500 households living within five meters of the Ngong River channel during rainy season.',
      sw: 'Familia zaidi ya 500 zinazoishi ndani ya umbali wa mita tano kutoka kwenye mfereji wa Mto Ngong wakati wa mvua.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-19',
    term: { en: 'Nature-Based Solutions (NbS)', sw: 'Suluhu Zinazotegemea Asili (NbS)' },
    definition: {
      en: 'Actions to protect, sustainably manage, and restore natural ecosystems to address societal challenges like flooding and heat.',
      sw: 'Hatua za kulinda, kusimamia, na kurejesha mazingira ya asili ili kutatua changamoto za kijamii kama mafuriko na joto kali.'
    },
    example: {
      en: 'Planting deep-rooted vetiver grass and bamboo along river slopes to stabilize mud and slow storm runoff.',
      sw: 'Kupanda nyasi za vetiver zenye mizizi mirefu na mianzi kando ya kingo za mito kutuliza matope na kupunguza kasi ya maji.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },
  {
    id: 'term-20',
    term: { en: 'Early Warning System (EWS)', sw: 'Mfumo wa Tahadhari ya Mapema' },
    definition: {
      en: 'An integrated system of monitoring, forecasting, disaster risk assessment, and communication that enables timely protective action.',
      sw: 'Mfumo uliounganishwa wa ufuatiliaji, utabiri wa majanga, na mawasiliano unaowezesha watu kuchukua hatua za haraka za kujilinda.'
    },
    example: {
      en: 'Upstream river sensor sending SMS alerts to community wardens 45 minutes before water reaches Mathare settlements.',
      sw: 'Kipima maji juu ya mto kinachotuma ujumbe wa SMS kwa walinzi wa jamii dakika 45 kabla ya maji kufika mitaani Mathare.'
    },
    moduleId: 'm2',
    category: 'flooding-drainage'
  },

  // Module 3: Heat and Health (10 terms)
  {
    id: 'term-21',
    term: { en: 'Thermoregulation', sw: 'Udhibiti wa Joto la Mwili' },
    definition: {
      en: 'The biological mechanism by which the human body maintains its internal core temperature within a safe range around 37°C.',
      sw: 'Mfumo wa kibiolojia ambao mwili wa binadamu unatumia kudumisha joto lake la ndani katika kiwango salama cha takriban nyuzi 37°C.'
    },
    example: {
      en: 'Sweating and dilating skin blood vessels to shed excess heat during hot weather.',
      sw: 'Kutoka jasho na kupanuka kwa mishipa ya damu ya ngozi ili kutoa joto la ziada wakati wa joto kali.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-22',
    term: { en: 'Heat Exhaustion', sw: 'Uchovu wa Joto Kali' },
    definition: {
      en: 'A heat-related illness caused by excessive loss of water and salt through sweating, marked by heavy sweating, weakness, and dizziness.',
      sw: 'Ugonjwa unaosababishwa na kupoteza maji na chumvi nyingi mwilini kupitia jasho, unaoambatana na uchovu mwingi na kizunguzungu.'
    },
    example: {
      en: 'A handcart puller feeling dizzy, nauseous, and sweating heavily after pushing loads for hours in the midday sun.',
      sw: 'Mkokoteni anayehisi kizunguzungu, kichefuchefu, na kutoa jasho jingi baada ya kusukuma mizigo mchana kutwa juani.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-23',
    term: { en: 'Heatstroke', sw: 'Kiharusi cha Joto (Heatstroke)' },
    definition: {
      en: 'A medical emergency where body core temperature exceeds 40°C, sweating mechanisms fail, and mental confusion or coma occurs.',
      sw: 'Dharura ya kitabibu ambapo joto la mwili linapanda zaidi ya 40°C, jasho linakoma, na mgonjwa anapata kuchanganyikiwa au kupoteza fahamu.'
    },
    example: {
      en: 'An elderly resident found in a closed tin shack with burning hot dry skin, delirium, and rapid pulse.',
      sw: 'Mzee anayekutwa ndani ya chumba cha mabati chenye joto akiwa na ngozi kavu ya moto bila jasho, akiwa amechanganyikiwa akili.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-24',
    term: { en: 'Dehydration', sw: 'Upungufu wa Maji Mwilini' },
    definition: {
      en: 'A harmful deficit in bodily fluids occurring when water output exceeds water input, causing blood volume to drop.',
      sw: 'Kupungua kwa maji mwilini kunakotokea pale ambapo mwili unapoteza maji mengi kuliko unavyopokea, jambo linalopunguza wingi wa damu.'
    },
    example: {
      en: 'Dark amber urine, persistent dry mouth, sunken eyes, and fatigue during a Nairobi heat spell.',
      sw: 'Mkojo wa rangi ya kahawia iliyoiva, kukausha mdomo, macho kuingia ndani, na uchovu mkali wakati wa joto kali.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-25',
    term: { en: 'Passive Cooling', sw: 'Upoezaji wa Asili (Passive Cooling)' },
    definition: {
      en: 'Building design approaches that cool indoor spaces naturally without consuming electrical power, using ventilation, shading, and reflection.',
      sw: 'Mbinu za ujenzi zinazopoza nyumba kiasili bila kutumia umeme, kwa kutumia madirisha ya upepo, vivuli, na kuakisi mwanga.'
    },
    example: {
      en: 'Painting rusty corrugated roofs white with lime wash and opening high cross-ventilation eaves.',
      sw: 'Kupaka chokaa nyeupe juu ya mabati na kuweka nafasi za wazi za kupitisha upepo chini ya paa.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-26',
    term: { en: 'Cross Ventilation', sw: 'Mzunguko wa Upepo (Cross Ventilation)' },
    definition: {
      en: 'The natural flow of wind through a building entering on one side and exiting on the opposite side, flushing out heat and humidity.',
      sw: 'Mtiririko wa upepo unaoingia upande mmoja wa jengo na kutoka upande wa pili, ukiondoa hewa nzito ya moto na unyevu nje.'
    },
    example: {
      en: 'Opening windows on both northern and southern walls of a schoolroom to create a continuous breeze.',
      sw: 'Kufungua madirisha ya upande wa kaskazini na kusini ya darasa ili upepo upite mfululizo.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-27',
    term: { en: 'Thermal Mass', sw: 'Hifadhi ya Joto ya Vifaa (Thermal Mass)' },
    definition: {
      en: 'The ability of a material to absorb, store, and slowly release heat energy over time.',
      sw: 'Uwezo wa kifaa cha ujenzi kunyonya, kuhifadhi, na kutoa joto polepole kwa muda mrefu.'
    },
    example: {
      en: 'Thick stone or stabilized earth blocks remaining cool indoors during the day compared to thin metal sheets.',
      sw: 'Kuta nene za mawe au matofali ya udongo kubaki na ubaridi mchana ikilinganishwa na mabati membamba.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-28',
    term: { en: 'Cool Roof', sw: 'Paa Linaloakisi Joto (Cool Roof)' },
    definition: {
      en: 'A roof designed with high solar reflectance and thermal emittance to stay significantly cooler in the sun than conventional roofs.',
      sw: 'Paa lililobuniwa kuakisi kiwango kikubwa cha mwanga wa jua na kutoa joto nje haraka ili libaki na ubaridi.'
    },
    example: {
      en: 'An informal settlement roof painted with reflective elastomeric white paint that lowers ceiling temperatures by 5°C.',
      sw: 'Paa la kibanda lililopakwa rangi nyeupe inayometa inayopunguza joto la dari kwa nyuzi 5°C.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-29',
    term: { en: 'Urban Canopy', sw: 'Mwamvuli wa Miti Mijini' },
    definition: {
      en: 'The layer of leaves, branches, and stems of trees that cover the ground when viewed from above, providing shade and evapotranspiration.',
      sw: 'Safu ya majani na matawi ya miti inayofunika ardhi, ikitoa kivuli na kutoa unyevu hewani unaopoza jiji.'
    },
    example: {
      en: 'Streets with mature jacaranda or indigenous acacia trees having pavement temperatures 15°C cooler than unshaded asphalt.',
      sw: 'Barabara zenye miti mikubwa ya asili zikiwa na joto la lami la chini kwa nyuzi 15°C kuliko barabara zisizo na kivuli.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },
  {
    id: 'term-30',
    term: { en: 'Evaporative Cooling', sw: 'Upoezaji kwa Mvuke (Evaporative Cooling)' },
    definition: {
      en: 'The drop in temperature resulting from the evaporation of liquid water, which absorbs latent heat from the surrounding air.',
      sw: 'Kushuka kwa joto kunakotokana na maji kugeuka mvuke, jambo linalonyonya joto kutoka kwenye hewa iliyo karibu.'
    },
    example: {
      en: 'Sprinkling water on unpaved verandas or clay pots to cool passing air during dry, hot afternoons.',
      sw: 'Kumwaga maji kidogo kwenye baraza za udongo au vyungu ili kupoza hewa inayopita alasiri za joto kali.'
    },
    moduleId: 'm3',
    category: 'heat-health'
  },

  // Module 4: Water Stress and Disease Prevention (10 terms)
  {
    id: 'term-31',
    term: { en: 'Water Rationing', sw: 'Mgao wa Maji' },
    definition: {
      en: 'The controlled distribution of water resources when supply cannot meet demand, typically cutting pipeline supply on set days.',
      sw: 'Ugawaji wa maji kwa zamu na vipimo maalum pale ambapo uzalishaji haukidhi mahitaji, kwa kufunga mabomba siku maalum.'
    },
    example: {
      en: 'Nairobi City Water and Sewerage Company (NCWSC) providing piped water to a neighborhood only on Tuesdays and Fridays.',
      sw: 'Kampuni ya Maji ya Nairobi (NCWSC) ikifungulia mtaa maji ya bomba Jumanne na Ijumaa pekee.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-32',
    term: { en: 'Waterborne Diseases', sw: 'Magonjwa ya Maji' },
    definition: {
      en: 'Illnesses caused by microscopic pathogens transmitted through drinking, cooking with, or contacting contaminated water.',
      sw: 'Magonjwa yanayosababishwa na vijidudu vinavyoishi kwenye maji machafu yanayonywewa au kutumiwa kupikia.'
    },
    example: {
      en: 'Infections like cholera, typhoid fever, amoebiasis, and bacillary dysentery.',
      sw: 'Magonjwa kama kipindupindu, homa ya matumbo (typhoid), na kuhara damu.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-33',
    term: { en: 'Chlorination', sw: 'Kutibu Maji kwa Klorini' },
    definition: {
      en: 'The process of adding a measured concentration of chlorine or hypochlorite to water to kill bacteria, viruses, and parasites.',
      sw: 'Mchakato wa kuweka kiwango sahihi cha dawa ya klorini kwenye maji ili kuua bakteria, virusi, na vijidudu vya magonjwa.'
    },
    example: {
      en: 'Adding one bottle cap of certified household chlorine solution to a 20-litre jerrycan of clear water and waiting 30 minutes.',
      sw: 'Kuweka kifuniko kimoja cha dawa ya klorini iliyoidhinishwa kwenye mtungi wa lita 20 wa maji masafi na kusubiri dakika 30.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-34',
    term: { en: 'Residual Chlorine', sw: 'Mabaki ya Klorini ya Kinga' },
    definition: {
      en: 'The small amount of active chlorine that remains in treated water to provide continuous disinfection against recontamination during storage.',
      sw: 'Kiasi kidogo cha dawa ya klorini kinachobaki ndani ya maji ili kuendelea kuua vijidudu iwapo maji yataingiliwa na uchafu wakati wa kuhifadhi.'
    },
    example: {
      en: 'A free chlorine residual between 0.2 and 0.5 mg/L in household stored water keeping drinking water safe for 48 hours.',
      sw: 'Mabaki ya klorini ya 0.2 hadi 0.5 mg/L yanayoweka maji ya kunywa ya mtungi salama kwa saa 48.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-35',
    term: { en: 'Turbidity', sw: 'Ukungu wa Maji (Turbidity)' },
    definition: {
      en: 'The cloudiness or haziness of a fluid caused by large numbers of individual particles that are generally invisible to the naked eye.',
      sw: 'Hali ya maji kuwa na ukungu au kutokuwa safi inayotokana na chembe ndogo za matope au mchanga zilizosimamishwa ndani yake.'
    },
    example: {
      en: 'Murky river water having high turbidity that protects bacteria from chlorine disinfection until settled and filtered.',
      sw: 'Maji ya mto yenye ukungu mwingi yanayozuia dawa ya klorini kuua vijidudu hadi yachujwe kwanza.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-36',
    term: { en: 'Fecal-Oral Route', sw: 'Njia ya Maambukizi ya Kinyesi-Mdomo' },
    definition: {
      en: 'A pathway of disease transmission wherein pathogens from human or animal feces enter the mouth through contaminated water, food, or unwashed hands.',
      sw: 'Njia ya maambukizi ambapo vijidudu vya kinyesi huingia mdomoni kupitia maji machafu, chakula, au mikono isiyonawa kwa sabuni.'
    },
    example: {
      en: 'Children getting diarrhea after drinking water from an unwashed cup dipped into an open water bucket by unwashed hands.',
      sw: 'Watoto kuugua kuhara baada ya kunywa maji kwenye kikombe kilichochotwa kwa mikono michafu ndani ya ndoo wazi.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-37',
    term: { en: 'Oral Rehydration Salts (ORS)', sw: 'Chumvi ya ORS ya Kuongeza Maji' },
    definition: {
      en: 'A balanced mixture of glucose, sodium, potassium, and citrate dissolved in clean water used to prevent dehydration from severe diarrhea.',
      sw: 'Mchanganyiko maalum wa sukari, chumvi, na madini unaoyeyushwa kwenye maji safi kuzuia kifo kutokana na upungufu wa maji wa kuharisha.'
    },
    example: {
      en: 'Dissolving one standard sachet of ORS in exactly one litre of safe drinking water for a child with watery diarrhea.',
      sw: 'Kuyeyusha pakiti moja ya ORS katika lita moja kamili ya maji salama ya kunywa kwa mtoto anayeharisha.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-38',
    term: { en: 'Safe Water Storage', sw: 'Uhifadhi Salama wa Maji' },
    definition: {
      en: 'Storing treated drinking water in a clean container with a tight-fitting lid and a narrow neck or spigot to prevent hand contact.',
      sw: 'Kuhifadhi maji yaliyotibiwa kwenye chombo safi chenye mfuniko unaobana na mfereji wa kuchotea ili mikono isiguse maji.'
    },
    example: {
      en: 'Using a dedicated clean jerrycan with a tap instead of an open wide-mouth bucket where cups and hands are dipped.',
      sw: 'Kutumia mtungi maalum wenye mfereji badala ya ndoo wazi ambapo vikombe na vidole huingizwa moja kwa moja.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-39',
    term: { en: 'Rainwater Harvesting', sw: 'Kuvuna Maji ya Mvua' },
    definition: {
      en: 'The collection and storage of rain from roofs or surface catchments for domestic, garden, or livestock use.',
      sw: 'Ukusanyaji na uhifadhi wa maji ya mvua kutoka kwenye mapaa ya nyumba kwa ajili ya matumizi ya nyumbani au bustani.'
    },
    example: {
      en: 'Installing gutters on a tin roof leading to a 1,000-litre plastic tank with a first-flush diverter.',
      sw: 'Kuweka mifereji ya mabati inayopeleka maji kwenye tanki la plastiki la lita 1,000 lenye bomba la kumwaga maji ya kwanza machafu.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },
  {
    id: 'term-40',
    term: { en: 'First-Flush Diverter', sw: 'Kichungi cha Maji ya Kwanza (First-Flush)' },
    definition: {
      en: 'A plumbing mechanism in rainwater harvesting that discards the initial contaminated runoff carrying roof dust, leaves, and bird droppings.',
      sw: 'Kifaa cha mabomba kinachotenga na kumwaga maji ya kwanza ya mvua yenye vumbi la paa na kinyesi cha ndege kabla ya tanki kuanza kujaa.'
    },
    example: {
      en: 'A vertical standpipe that fills with the first 20 litres of rain runoff before clean rainwater overflows into the storage tank.',
      sw: 'Bomba la wima linalojaa lita 20 za kwanza za mvua machafu kabla maji masafi hayajaanza kuingia ndani ya tanki kuu.'
    },
    moduleId: 'm4',
    category: 'water-sanitation'
  },

  // Module 5: Climate Justice (10 terms)
  {
    id: 'term-41',
    term: { en: 'Climate Justice', sw: 'Haki ya Hali ya Hewa' },
    definition: {
      en: 'Framing global warming as an ethical, legal, and human rights issue rather than a purely physical or environmental problem.',
      sw: 'Kutambua mabadiliko ya tabianchi kama suala la kimaadili, kisheria, na haki za kibinadamu badala ya sayansi ya mazingira pekee.'
    },
    example: {
      en: 'Demanding that historical polluter nations fund adaptation for African urban informal residents who emit virtually no carbon.',
      sw: 'Kudai kuwa mataifa yaliyochafua hewa yagharimie miradi ya kujikinga kwa wakaazi wa mabanda Afrika wasiochafua hewa.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-42',
    term: { en: 'CBDR-RC', sw: 'CBDR-RC (Wajibu wa Pamoja Lakini Tofauti)' },
    definition: {
      en: 'Common But Differentiated Responsibilities and Respective Capabilities; the core international legal principle governing climate equity.',
      sw: 'Kanuni ya kisheria ya kimataifa inayotambua wajibu wa nchi zote lakini ikitofautisha kulingana na uzalishaji wa kihistoria na uwezo wa kiuchumi.'
    },
    example: {
      en: 'Under the Paris Agreement, industrialized nations must provide financial resources to developing nations for adaptation.',
      sw: 'Chini ya Mkataba wa Paris, nchi tajiri za viwanda lazima zitoe fedha za kusaidia nchi zinazoendelea kukabiliana na majanga.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-43',
    term: { en: 'Climate Mitigation', sw: 'Kupunguza Uzalishaji (Mitigation)' },
    definition: {
      en: 'Human interventions to reduce the sources or enhance the sinks of greenhouse gases, halting further global warming.',
      sw: 'Hatua za binadamu za kupunguza vyanzo au kuongeza misitu inayonyonya gesi chafu ili kuzuia ongezeko zaidi la joto duniani.'
    },
    example: {
      en: 'Transitioning Nairobi matatus from diesel engines to battery-electric power charged with geothermal electricity.',
      sw: 'Kubadilisha matatu za dizeli za Nairobi kutumia umeme safi unaozalishwa na nishati ya mvuke ya Olkaria.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-44',
    term: { en: 'Climate Adaptation', sw: 'Kukabiliana na Tabianchi (Adaptation)' },
    definition: {
      en: 'Adjustments in ecological, social, or economic systems to moderate potential damages or exploit beneficial opportunities of climate change.',
      sw: 'Marekebisho ya mifumo ya kijamii, kiuchumi, na miundombinu ili kupunguza madhara au kuishi salama na mabadiliko ya hali ya hewa yaliyopo.'
    },
    example: {
      en: 'Constructing stone flood walls and widening culverts in Mukuru to protect homes from flash floods.',
      sw: 'Kujenga kuta za mawe na kupanua mifereji Mukuru kulinda nyumba dhidi ya mafuriko ya ghafla.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-45',
    term: { en: 'Loss and Damage', sw: 'Hasara na Uharibifu (Loss and Damage)' },
    definition: {
      en: 'The irreversible losses and permanent damages caused by climate change that exceed human and natural adaptive capacity.',
      sw: 'Hasara za kudumu na uharibifu usioweza kurekebishwa unaotokana na mabadiliko ya tabianchi unaozidi uwezo wa binadamu kujikinga.'
    },
    example: {
      en: 'Lives lost in fatal urban mudslides and entire family homes permanently swept away by torrential floods.',
      sw: 'Vifo vya maporomoko ya ardhi na nyumba za familia zinazosombwa kabisa na mafuriko bila uwezekano wa kurejeshwa.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-46',
    term: { en: 'Intersectionality', sw: 'Makutano ya Kijamii (Intersectionality)' },
    definition: {
      en: 'The interconnected nature of social categorizations (gender, age, class, disability) compounding vulnerability to climate hazards.',
      sw: 'Muunganiko wa sifa za kijamii (jinsia, umri, umaskini, ulemavu) unaoongeza udhaifu na ugumu wa mtu kujikinga na majanga ya tabianchi.'
    },
    example: {
      en: 'A deaf young woman living in an informal settlement facing communication, mobility, and gender-safety barriers during a flood.',
      sw: 'Msichana kiziwi anayeishi makazi duni akikabiliwa na vikwazo vya taarifa, usalama wa kijinsia, na njia za kuondoka wakati wa mafuriko.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-47',
    term: { en: 'Locally Led Adaptation (LLA)', sw: 'Kukabiliana Kunakoongozwa na Jamii (LLA)' },
    definition: {
      en: 'An approach ensuring local communities and grassroots groups have direct authority, resources, and decision-making power over adaptation actions.',
      sw: 'Mbinu inayohakikisha jamii za wenyeji na vikundi vya mtaa vina mamlaka ya moja kwa moja, fedha, na uwezo wa kuamua juu ya miradi ya tabianchi.'
    },
    example: {
      en: 'A youth and women’s federation co-designing and overseeing the drainage upgrade budget in their village.',
      sw: 'Shirikisho la vijana na wanawake likibuni na kusimamia bajeti ya ukarabati wa mifereji katika kijiji chao.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-48',
    term: { en: 'Maladaptation', sw: 'Makosa ya Kukabiliana (Maladaptation)' },
    definition: {
      en: 'Actions that lead to increased risk of adverse climate-related outcomes, increased vulnerability, or diminished welfare.',
      sw: 'Hatua za mazingira ambazo bila kukusudia zinaongeza hatari, udhaifu zaidi, au kuhamishia majanga kwa jamii jirani zilizo hatarini.'
    },
    example: {
      en: 'Building a private flood wall that protects one commercial factory while deflecting surging floodwater into an informal settlement.',
      sw: 'Kujenga ukuta unaolinda kiwanda lakini unaoelekeza maji yote ya mafuriko kwenye makazi ya mabanda ya jirani.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-49',
    term: { en: 'Adaptation Finance Gap', sw: 'Pengo la Fedha za Kukabiliana' },
    definition: {
      en: 'The huge deficit between global funds provided for adaptation in developing nations and the actual financial costs required to protect people.',
      sw: 'Tofauti kubwa iliyopo kati ya fedha zinazotolewa kusaidia nchi zinazoendelea kukabiliana na gharama halisi zinazohitajika kulinda watu.'
    },
    example: {
      en: 'African nations receiving less than 20% of their estimated annual climate adaptation needs from international funds.',
      sw: 'Nchi za Afrika zikipokea chini ya 20% ya mahitaji yao ya kifedha ya kila mwaka ya kujikinga na majanga ya tabianchi.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },
  {
    id: 'term-50',
    term: { en: 'Climate Displaced Persons', sw: 'Wakimbizi wa Tabianchi' },
    definition: {
      en: 'People forced to leave their habitual homes due to sudden or progressive environmental changes that adversely affect their lives.',
      sw: 'Watu wanaolazimika kuhama makazi yao ya asili kutokana na majanga ya ghafla au ya muda mrefu ya hali ya hewa yanayotishia uhai wao.'
    },
    example: {
      en: 'Families forced to abandon riverbank homes in Mathare after catastrophic floods permanently washed away the riverbed.',
      sw: 'Familia zilizolazimika kuhama kabisa kingo za mto Mathare baada ya mafuriko kubomoa ardhi yote ya makazi.'
    },
    moduleId: 'm5',
    category: 'climate-justice'
  },

  // Module 6: Green Claims and Greenwashing (10 terms)
  {
    id: 'term-51',
    term: { en: 'Environmental Claim', sw: 'Dai la Kimazingira' },
    definition: {
      en: 'Any statement, symbol, or representation suggesting a product, service, or company has specific positive or reduced environmental impacts.',
      sw: 'Kauli, alama, au tangazo lolote linalopendekeza kuwa bidhaa au kampuni ina manufaa maalum au madhara yaliyopunguzwa ya kimazingira.'
    },
    example: {
      en: 'A soap manufacturer advertising that its packaging is "made from 50% post-consumer recycled plastic".',
      sw: 'Kiwanda cha sabuni kikitangaza kwamba chupa zake "zimetengenezwa kwa 50% plastiki iliyorejelezwa".'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-52',
    term: { en: 'Greenwashing', sw: 'Upotoshaji wa Mazingira (Greenwashing)' },
    definition: {
      en: 'Deceptive marketing practices that mislead consumers regarding the environmental practices of a company or benefits of a product.',
      sw: 'Mbinu za udanganyifu za kibiashara zinazopotosha wananchi kuamini kampuni au bidhaa inatunza mazingira wakati sivyo kiuhalisia.'
    },
    example: {
      en: 'An oil company spending millions on advertising photos of green trees while continuing 99% of its investments in fossil fuels.',
      sw: 'Kampuni ya mafuta ikitumia mamilioni kutangaza picha za miti mizuri huku 99% ya uwekezaji wake ukiwa katika mafuta machafu.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-53',
    term: { en: 'Carbon Offset (Credit)', sw: 'Fidia ya Kaboni (Carbon Offset)' },
    definition: {
      en: 'A tradeable financial certificate representing one metric tonne of carbon dioxide equivalent prevented from entering or removed from the atmosphere.',
      sw: 'Hati ya kifedha inayoweza kuuzwa inayowakilisha tani moja ya hewa ya CO2 iliyozuiwa au kuondolewa angani mahali pengine.'
    },
    example: {
      en: 'An airline buying credits from a rural tree-planting project to declare its international flights "carbon neutral".',
      sw: 'Shirika la ndege likinunua vyeti kutoka mradi wa kupanda miti mashambani ili kutangaza safari zake kuwa hazina kaboni.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-54',
    term: { en: 'Carbon Neutrality', sw: 'Kutokuwa na Kaboni (Carbon Neutrality)' },
    definition: {
      en: 'Achieving net-zero carbon dioxide emissions by balancing emissions with an equivalent amount of carbon offsets or removals.',
      sw: 'Kufikia kiwango sifuri cha kaboni kwa kusawazisha hewa chafu inayotolewa na kiasi sawa cha fidia ya kaboni au unyonyaji wa miti.'
    },
    example: {
      en: 'A logistics business claiming zero emissions while still running diesel trucks, simply by buying cheap paper offset credits.',
      sw: 'Biashara ya usafirishaji ikidai haina kaboni huku ikiendesha malori ya dizeli, kwa kununua tu vyeti vya karatasi vya fidia.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-55',
    term: { en: 'Life-Cycle Assessment (LCA)', sw: 'Tathmini ya Mzunguko wa Maisha (LCA)' },
    definition: {
      en: 'A standardized scientific method evaluating environmental impacts through all stages of a product: extraction, production, use, and disposal.',
      sw: 'Mbinu sanifu ya kisayansi ya kutathmini athari za mazingira katika hatua zote za bidhaa: malighafi, utengenezaji, matumizi, na utupaji jalalani.'
    },
    example: {
      en: 'Tracing the total energy and carbon used to mine lithium, assemble an electric bike, charge it, and recycle its worn battery.',
      sw: 'Kupima nishati na kaboni yote ya kuchimba lithiamu, kutengeneza baiskeli ya umeme, kuichaji, na kutupa betri yake.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-56',
    term: { en: 'Extended Producer Responsibility (EPR)', sw: 'Wajibu Ulioongezwa wa Mzalishaji (EPR)' },
    definition: {
      en: 'An environmental policy approach placing financial and physical responsibility on manufacturers for the post-consumer disposal of their goods.',
      sw: 'Sera inayowajibisha makampuni ya viwanda kugharamia na kusimamia ukusanyaji na urejelezaji wa taka za bidhaa zao baada ya kutumiwa.'
    },
    example: {
      en: 'Under Kenya’s 2022 Waste Management Act, beverage bottlers funding schemes to collect plastic bottles from Nairobi rivers.',
      sw: 'Chini ya Sheria ya Taka ya Kenya ya 2022, wenye viwanda vya soda kulipia shughuli za kuokota chupa zao za plastiki mitoni.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-57',
    term: { en: 'Third-Party Certification', sw: 'Uthibitisho wa Taasisi Huru ya Tatu' },
    definition: {
      en: 'An independent audit confirming that a product, service, or system adheres strictly to defined environmental or quality standards.',
      sw: 'Ukaguzi huru unaofanywa na shirika lisilofungamana na kampuni kuthibitisha bidhaa inakidhi viwango vya ubora na mazingira.'
    },
    example: {
      en: 'The Forest Stewardship Council (FSC) seal proving exercise book paper comes from responsibly harvested timber.',
      sw: 'Nembo ya FSC inayothibitisha karatasi ya daftari imetoka kwenye misitu inayovunwa kwa kufuata sheria na uendelevu.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-58',
    term: { en: 'Self-Declared Claim', sw: 'Dai la Kujitangazia Mwenyewe' },
    definition: {
      en: 'An environmental marketing claim made by a manufacturer without independent external auditing or accredited standards.',
      sw: 'Dai la mazingira linalotolewa na kampuni yenyewe kwenye bidhaa zake bila kukaguliwa na shirika huru la viwango.'
    },
    example: {
      en: 'A laundry detergent label featuring an unverified golden seal saying "100% Eco-Pure Formula".',
      sw: 'Lebo ya sabuni yenye nembo ya duara ya dhahabu iliyochorwa ikisema "100% Salama kwa Mazingira" bila ushahidi.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-59',
    term: { en: 'Deceptive Trade Practice', sw: 'Biashara ya Udanganyifu' },
    definition: {
      en: 'An unlawful business action that misleads, deceives, or causes detriment to consumers regarding product quality or characteristics.',
      sw: 'Kitendo haramu cha kibiashara kinachopotosha, kudanganya, au kuumiza wanunuzi kuhusu ubora au sifa halisi za bidhaa.'
    },
    example: {
      en: 'Under Section 55 of the Kenya Competition Act, falsely claiming plastic bags are fully biodegradable when they contain conventional polymers.',
      sw: 'Chini ya Kifungu cha 55 cha Sheria ya Ushindani ya Kenya, kudanganya kuwa mifuko inaoza yenyewe wakati ina plastiki ya kawaida.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },
  {
    id: 'term-60',
    term: { en: 'Direct Emissions Reduction', sw: 'Upunguzaji wa Moja kwa Moja wa Hewa Chafu' },
    definition: {
      en: 'Physical cuts in greenhouse gases released directly at the industrial source, rather than paying for offsets elsewhere.',
      sw: 'Kupunguza moshi na gesi chafu moja kwa moja kwenye kiwanda au gari, badala ya kulipia vyeti vya kupanda miti kwingineko.'
    },
    example: {
      en: 'Replacing an industrial heavy fuel oil boiler with a geothermal steam connection in a textile mill.',
      sw: 'Kuondoa jiko la viwandani la mafuta mazito ya dizeli na kutumia mvuke wa asili wa ardhini katika kiwanda cha nguo.'
    },
    moduleId: 'm6',
    category: 'green-claims'
  },

  // Module 7: Safe Civic Participation (10 terms)
  {
    id: 'term-61',
    term: { en: 'Public Participation', sw: 'Ushiriki wa Umma' },
    definition: {
      en: 'The constitutional process allowing citizens and communities to voice opinions, provide input, and shape public policy decisions.',
      sw: 'Mchakato wa kikatiba unaowapa wananchi na jamii fursa ya kutoa maoni, mapendekezo, na kushawishi maamuzi ya sera za umma.'
    },
    example: {
      en: 'Youth attending a ward town-hall meeting to debate proposed county drainage and clinic budget allocations.',
      sw: 'Vijana wakihudhuria baraza la wadi kujadili bajeti inayopendekezwa ya kaunti ya mifereji na zahanati za afya.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-62',
    term: { en: 'Article 10 (National Values)', sw: 'Kifungu cha 10 (Maadili ya Kitaifa)' },
    definition: {
      en: 'The Kenyan constitutional clause establishing public participation, transparency, equity, and sustainable development as mandatory national values.',
      sw: 'Kipengele cha Katiba ya Kenya kinachoweka ushiriki wa umma, uwazi, usawa, na maendeleo endelevu kama maadili ya lazima ya kitaifa.'
    },
    example: {
      en: 'High Court rulings annulling county bills that were passed without meaningful public barazas under Article 10.',
      sw: 'Uamuzi wa Mahakama Kuu kufutilia mbali sheria za kaunti zilizopitishwa bila mabaraza halisi ya wananchi chini ya Kifungu cha 10.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-63',
    term: { en: 'Article 42 (Environmental Right)', sw: 'Kifungu cha 42 (Haki ya Mazingira)' },
    definition: {
      en: 'The fundamental constitutional right guaranteed to every person in Kenya to a clean and healthy environment.',
      sw: 'Haki ya kimsingi ya kikatiba anayopewa kila mtu nchini Kenya ya kuishi katika mazingira safi na yenye afya.'
    },
    example: {
      en: 'Community members citing Article 42 to stop an illegal toxic waste dumpsite operating next to residential homes.',
      sw: 'Wananchi wakitumia Kifungu cha 42 kusimamisha jalala haramu la taka za sumu lililoko karibu na nyumba za makazi.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-64',
    term: { en: 'Devolution', sw: 'Ugatuzi' },
    definition: {
      en: 'The constitutional transfer of political authority, resources, and functions from the national government to 47 county governments.',
      sw: 'Mgawanyo wa kikatiba wa madaraka, fedha, na majukumu kutoka serikali kuu kwenda serikali 47 za kaunti.'
    },
    example: {
      en: 'Nairobi City County Government having direct legal mandate to build local stormwater drains, clinics, and manage solid waste.',
      sw: 'Serikali ya Kaunti ya Nairobi kuwa na mamlaka ya kisheria kujenga mifereji ya dhoruba, zahanati, na kusimamia taka.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-65',
    term: { en: 'Member of County Assembly (MCA)', sw: 'Diwani wa Bunge la Kaunti (MCA)' },
    definition: {
      en: 'An elected ward representative in the County Assembly responsible for debating local bills, passing budgets, and oversight.',
      sw: 'Mwakilishi aliyechaguliwa wa wadi katika Bunge la Kaunti mwenye majukumu ya kutunga sheria za kaunti, kuidhinisha bajeti, na usimamizi.'
    },
    example: {
      en: 'Residents petitioning their ward MCA to sponsor an amendment allocating funds for footbridge repairs.',
      sw: 'Wakaazi wakimwomba Diwani wao kuwasilisha mswada wa kutenga fedha za kukarabati madaraja ya mtaa.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-66',
    term: { en: 'County Integrated Development Plan (CIDP)', sw: 'Mpango Jumuishi wa Maendeleo wa Kaunti (CIDP)' },
    definition: {
      en: 'A statutory 5-year strategic blueprint that guides all development priorities, infrastructure projects, and budgets for a county.',
      sw: 'Mpango mkakati wa kisheria wa miaka mitano unaoongoza vipaumbele vyote vya maendeleo, miundombinu, na bajeti za kaunti.'
    },
    example: {
      en: 'The Nairobi CIDP 2023–2027 identifying urban flood mitigation in informal settlements as a priority capital program.',
      sw: 'CIDP ya Nairobi ya 2023–2027 ikiweka ujenzi wa mifereji katika makazi duni kama mradi mkuu wa kipaumbele.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-67',
    term: { en: 'Written Memorandum', sw: 'Memorandum ya Maandishi' },
    definition: {
      en: 'A structured formal document submitted to a parliamentary committee or government agency outlining evidence, concerns, and policy proposals.',
      sw: 'Hati rasmi iliyoandikwa inayowasilishwa kwa kamati ya bunge au serikali ikieleza ushahidi, kero za jamii, na mapendekezo ya sera.'
    },
    example: {
      en: 'Youth submitting a 3-page signed memorandum with photos of blocked culverts to the County Assembly Clerk.',
      sw: 'Vijana wakiwasilisha memorandum ya kurasa tatu yenye picha za mitaro iliyoziba kwa Karani wa Bunge la Kaunti.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-68',
    term: { en: 'Community-Based Organization (CBO)', sw: 'Shirika la Jamii (CBO)' },
    definition: {
      en: 'A locally registered grassroots non-profit organization established to address specific community needs and run social initiatives.',
      sw: 'Shirika la kijamii la mashinani lililosajiliwa kisheria linaloendeshwa na wananchi kutatua changamoto za mtaa.'
    },
    example: {
      en: 'A registered youth CBO in Ruaraka managing tree nurseries and coordinating neighborhood flood cleanups.',
      sw: 'CBO ya vijana iliyosajiliwa Ruaraka inayosimamia vitalu vya miti na kuongoza usafi wa mifereji mtaani.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-69',
    term: { en: 'Digital Safety', sw: 'Usalama wa Kidijitali' },
    definition: {
      en: 'Practices and tools to protect personal identity, sensitive communications, and digital devices against hacking, harassment, and surveillance.',
      sw: 'Mbinu na zana za kulinda utambulisho, mawasiliano nyeti, na simu/kompyuta dhidi ya udukuzi, vitisho, na ufuatiliaji usioidhinishwa.'
    },
    example: {
      en: 'Enabling Two-Factor Authentication (2FA) with an authenticator app and using end-to-end encrypted messaging for civic planning.',
      sw: 'Kuwasha Uthibitishaji wa Hatua Mbili (2FA) kwa programu ya simu na kutumia jumbe zilizolindwa kwa njia fiche.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  },
  {
    id: 'term-70',
    term: { en: 'Non-Partisan Action', sw: 'Hatua Isiyoegemea Upande wa Siasa' },
    definition: {
      en: 'Civic activities conducted without bias, loyalty, or affiliation toward any political party, focusing entirely on collective community welfare.',
      sw: 'Shughuli za kiraia zinazoendeshwa bila kupendelea chama chochote cha siasa, zikilenga tu ustawi na usalama wa jamii nzima.'
    },
    example: {
      en: 'Neighbors from different political backgrounds uniting peacefully to clean public drainage channels before the heavy rains.',
      sw: 'Majirani wa vyama tofauti vya kisiasa wakiungana kwa amani kusafisha mifereji ya umma kabla ya mvua kubwa kunyesha.'
    },
    moduleId: 'm7',
    category: 'civic-governance'
  }
];
