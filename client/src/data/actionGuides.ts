export interface ActionGuideStep {
  stepNumber: number;
  title: { en: string; sw: string };
  action: { en: string; sw: string };
  tips: { en: string; sw: string };
}

export interface ActionGuide {
  id: string;
  moduleId: string;
  title: { en: string; sw: string };
  purpose: { en: string; sw: string };
  disclaimer: { en: string; sw: string };
  targetAudience: { en: string; sw: string };
  materialsNeeded: { en: string[]; sw: string[] };
  steps: ActionGuideStep[];
}

export const actionGuides: ActionGuide[] = [
  // Module 1: Personal and Neighbourhood Climate-Risk Observation
  {
    id: 'ag-m1',
    moduleId: 'm1',
    title: {
      en: 'Neighborhood Climate-Risk Mapping and Observation Guide',
      sw: 'Mwongozo wa Kutathmini na Kuchora Ramani ya Hatari za Tabianchi Mtaani'
    },
    purpose: {
      en: 'Empower youth to systematically document local environmental hazards, high-heat microclimates, and vulnerable infrastructure to inform community planning.',
      sw: 'Kuwawezesha vijana kurekodi kwa utaratibu maeneo hatarishi, maeneo yenye joto kali, na miundombinu duni ili kuongoza mipango ya jamii.'
    },
    disclaimer: {
      en: 'Community risk mapping is an educational planning tool; it does not replace official meteorological data or engineering surveys.',
      sw: 'Kazi hii ya kutathmini mazingira ni zana ya kielimu; haichukui nafasi ya takwimu rasmi za idara ya hali ya hewa wala wataalamu wa uhandisi.'
    },
    targetAudience: {
      en: 'Youth groups, neighborhood elders, community organizers, and students.',
      sw: 'Vikundi vya vijana, wazee wa mtaa, wanaharakati wa jamii, na wanafunzi.'
    },
    materialsNeeded: {
      en: ['A notebook and pen', 'Smartphone with camera / GPS (optional)', 'A hand-drawn sketch map of the ward', 'Comfortable walking shoes'],
      sw: ['Daftari na kalamu', 'Simu ya mkononi yenye kamera / GPS (kama ipo)', 'Mchoro wa ramani ya mtaa kwa mkono', 'Viatu imara vya kutembea']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Identify Assessment Boundaries', sw: 'Bainisha Mipaka ya Eneo la Ukaguzi' },
        action: {
          en: 'Select a defined area such as your street, village cluster, or a 500-meter corridor around your school or market.',
          sw: 'Chagua eneo maalum kama njia ya mtaa wako, kijiji, au mzunguko wa mita 500 kuzunguka shule au soko.'
        },
        tips: {
          en: 'Walk in pairs during daylight hours for safety and collaborative note-taking.',
          sw: 'Tembeeni wawili wawili wakati wa mchana kwa usalama na kushirikiana kuandika kumbukumbu.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Spot High-Heat Microclimates', sw: 'Tambua Maeneo Yenye Joto Kali Zaidi' },
        action: {
          en: 'Note areas with unshaded dark asphalt, dense rusty corrugated sheets, and zero tree canopy where temperatures feel significantly higher.',
          sw: 'Taja maeneo yenye lami nyeusi isiyo na kivuli, mabati mengi ya zamani, na yasiyo na miti ambapo joto huhisiwa kali sana.'
        },
        tips: {
          en: 'Check midday outdoor worker spots (fundis, open-air vendors, car washes) for shade availability.',
          sw: 'Angalia maeneo ya wafanyabiashara wa nje mchana kama wana vivuli vya kujikinga na joto.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Map Surface Runoff and Drainage Bottlenecks', sw: 'Chora Mikondo ya Maji na Vikwazo vya Mifereji' },
        action: {
          en: 'Trace the natural direction of rainwater flow: mark collapsed culverts, uncollected garbage dams, and houses located in historical riverbeds.',
          sw: 'Fuatilia mkondo wa asili wa maji ya mvua: weka alama kwenye mitaro iliyobomoka, malundo ya taka, na nyumba zilizojengwa bondeni.'
        },
        tips: {
          en: 'Ask elder residents where floodwaters reached during the 1997/98 or 2024 heavy rain seasons.',
          sw: 'Waulize wazee wa mtaa ni wapi maji ya mafuriko yalipofika wakati wa mvua za El Niño za 1997/98 au 2024.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Identify Vulnerable Residents and Safe Havens', sw: 'Tambua Watu Walio Hatarini na Maeneo Salama' },
        action: {
          en: 'Note locations of households with infants, older persons, or persons with disabilities. Locate elevated public halls, churches, or schools that can serve as emergency gathering points.',
          sw: 'Weka kumbukumbu ya nyumba zenye watoto wachanga, wazee, au watu wenye ulemavu. Tambua kumbi za juu za jamii, makanisa, au shule zinazoweza kuwa vituo salama.'
        },
        tips: {
          en: 'Protect privacy: never publish personal medical conditions or full names publicly.',
          sw: 'Linda faragha: usichapishe majina kamili au magonjwa ya watu waziwazi kwa umma.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Compile and Share Community Hazard Map', sw: 'Kusanya na Kusambaza Ramani ya Hatari' },
        action: {
          en: 'Draw a master community poster combining your observations. Present the map to your local Ward Administrator, MCA, and village baraza.',
          sw: 'Chora bango kuu la jamii lenye taarifa zote zilizokusanywa. Wasilisha ramani hiyo kwa Msimamizi wa Wadi, Diwani (MCA), na baraza la wazee.'
        },
        tips: {
          en: 'Keep a digital photo copy stored securely in offline phone storage for quick reference.',
          sw: 'Hifadhi picha ya ramani hiyo kwenye simu yako ili uweze kuitumia hata bila intaneti.'
        }
      }
    ]
  },

  // Module 2: Urban Flooding Preparedness Checklist
  {
    id: 'ag-m2',
    moduleId: 'm2',
    title: {
      en: 'Household and Neighborhood Flood-Readiness Action Plan',
      sw: 'Mpango Kazi wa Kujiandaa na Mafuriko ya Nyumbani na Mtaani'
    },
    purpose: {
      en: 'A step-by-step practical guide to prepare households and local alleys before and during rapid onset urban flood events in Nairobi.',
      sw: 'Mwongozo wa vitendo wa hatua kwa hatua wa kuandaa nyumba na njia za mtaa kabla na wakati wa mafuriko ya ghafla Nairobi.'
    },
    disclaimer: {
      en: 'Never enter moving floodwaters. Preparedness education does not replace official emergency evacuation orders from county or national disaster authorities.',
      sw: 'Kamwe usiingie ndani ya maji yanayotiririka ya mafuriko. Mwongozo huu hauchukui nafasi ya amri rasmi za uokoaji kutoka serikalini.'
    },
    targetAudience: {
      en: 'Households in flood-prone informal settlements, youth emergency volunteers, and landlords.',
      sw: 'Familia zinazoishi maeneo yanayofurika, vijana wa kujitolea wa uokoaji, na wamiliki wa nyumba.'
    },
    materialsNeeded: {
      en: ['Waterproof plastic document bags', 'Heavy-duty sandbags / soil-filled rice bags', 'Flashlight with extra batteries', 'Emergency whistle', 'First aid basics'],
      sw: ['Mifuko ya plastiki isiyopitisha maji', 'Magunia ya mchanga ya kuzuia maji', 'Tochi yenye betri za ziada', 'Filimbi ya dharura', 'Sanduku la huduma ya kwanza']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Pack the Household Emergency "Go-Bag"', sw: 'Andaa Mfuko wa Dharura wa "Go-Bag"' },
        action: {
          en: 'Place essential national IDs, birth certificates, title deeds/tenancy agreements, daily medications, and a whistle inside a waterproof ziplock bag kept in an accessible spot.',
          sw: 'Weka vitambulisho, vyeti vya kuzaliwa, mikataba ya kodi, dawa za kila siku, na filimbi ndani ya mfuko wa plastiki unaofungika vizuri sehemu inayofikika haraka.'
        },
        tips: {
          en: 'Make sure every household member knows exactly where the Go-Bag is kept.',
          sw: 'Hakikisha kila mtu ndani ya nyumba anajua mahali mfuko huo ulipowekwa.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Clear Thresholds and Install Temporary Barriers', sw: 'Safisha Njia na Weka Vizuizi vya Mchanga' },
        action: {
          en: 'Clear loose garbage from doorways and compound gutters. Stack soil or sandbags in an overlapping brick pattern across low doorways.',
          sw: 'Ondoa taka zote mlangoni na kwenye mitaro ya uani. Panga magunia ya mchanga mlangoni yakipishana kama matofali kuzuia maji yasiingie.'
        },
        tips: {
          en: 'Line sandbags with thick plastic sheeting underneath to prevent seepage through burlap weave.',
          sw: 'Weka karatasi ya nailoni chini ya magunia ili kuzuia maji yasipenye kwenye matundu ya magunia.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Elevate Vital Belongings and Electronics', sw: 'Inua Vyombo Muhimu na Vifaa vya Umeme Juu' },
        action: {
          en: 'Move mattress, food reserves (maize flour, rice), and electrical sockets above anticipated water line (at least 50cm above floor level).',
          sw: 'Inua godoro, akiba ya chakula (unga, mchele), na vifaa vya umeme juu ya kina cha maji (angalau sentimita 50 juu ya sakafu).'
        },
        tips: {
          en: 'Turn off the main electrical breaker immediately if water touches extension cords or outlets.',
          sw: 'Zima swichi kuu ya umeme mara moja ikiwa maji yataanza kukaribia waya au soketi za umeme.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Establish Community Evacuation Buddy System', sw: 'Weka Mfumo wa Majirani wa Kusaidiana (Buddy System)' },
        action: {
          en: 'Pair capable youth with elderly neighbors, expectant mothers, or persons with mobility limitations living nearby.',
          sw: 'Unganisha vijana wenye uwezo na wazee, wajawazito, au watu wenye matatizo ya kutembea wanaoishi karibu nao.'
        },
        tips: {
          en: 'Agree on a distinctive whistle pattern (e.g., three short sharp blasts) to signal immediate evacuation.',
          sw: 'Kukubaliana mlio maalum wa filimbi (k.m., milio mitatu mifupi) kuashiria kuhama mara moja.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Post-Flood Hygiene and Disinfection Protocol', sw: 'Usafi na Dawa Baada ya Maji Kupungua' },
        action: {
          en: 'Do not eat food touched by floodwaters. Scrub floors and walls with dilute household bleach solution (1 cup bleach per 10 litres water). Let rooms dry fully before moving children back.',
          sw: 'Usile chakula chochote kilichoguswa na maji ya mafuriko. Safisha sakafu na kuta kwa maji yenye dawa ya jiki (kikombe 1 kwa lita 10 za maji). Kausha chumba kabla ya watoto kurudi.'
        },
        tips: {
          en: 'Wear gumboots and rubber gloves during cleanup to avoid cuts from rusty nails and sewage infections.',
          sw: 'Vaa buti na glavu wakati wa kusafisha kuzuia kukatwa na misumari na magonjwa ya maji machafu.'
        }
      }
    ]
  },

  // Module 3: Household Heat-Reduction Checklist
  {
    id: 'ag-m3',
    moduleId: 'm3',
    title: {
      en: 'Low-Cost Household Heat-Reduction and Wellness Checklist',
      sw: 'Orodha ya Hatua za Kupunguza Joto Nyumbani na Kulinda Afya'
    },
    purpose: {
      en: 'Practical, zero-to-low-cost techniques to reduce indoor temperatures in corrugated sheet homes and protect families from heat illness.',
      sw: 'Mbinu za vitendo za bei nafuu za kupunguza joto ndani ya nyumba za mabati na kulinda familia dhidi ya magonjwa ya joto kali.'
    },
    disclaimer: {
      en: 'This guide offers preventive thermal comfort strategies. Heatstroke is a life-threatening medical emergency requiring immediate professional hospital care.',
      sw: 'Mwongozo huu unatoa kinga ya kupunguza joto. Kiharusi cha joto ni dharura ya kitabibu inayohitaji hospitali mara moja.'
    },
    targetAudience: {
      en: 'Families living in dense informal settlements, informal daycare centers, and outdoor workers.',
      sw: 'Familia zinazoishi kwenye nyumba za mabati, vituo vya kulelea watoto, na wafanyabiashara wa vibandani.'
    },
    materialsNeeded: {
      en: ['Lime wash (chokaa) or white exterior paint', 'Handheld spray bottles / water basins', 'Porous clay water pots (nyungu)', 'Light cotton cloths', 'Ventilation mesh / mosquito wire'],
      sw: ['Chokaa nyeupe au rangi nyeupe ya nje', 'Chupa ya kupulizia maji / beseni', 'Vyungu vya asili vya udongo vya maji', 'Vitambaa vyepesi vya pamba', 'Wavu wa mbu wa madirishani']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Whitewash Roof Exterior with Lime Wash', sw: 'Paka Paa Chokaa Nyeupe Juu ya Mabati' },
        action: {
          en: 'Mix agricultural lime (chokaa) with water and salt to create a low-cost reflective white paint. Apply two coats over dark corrugated metal roof sheets.',
          sw: 'Changanya chokaa ya kilimo na maji na chumvi kidogo kutengeneza rangi nyeupe ya asili. Paka koti mbili juu ya mabati meusi ya paa.'
        },
        tips: {
          en: 'A white reflective roof can reduce indoor ceiling temperatures by up to 5–8°C during peak midday sun.',
          sw: 'Paa jeupe linaweza kupunguza joto la ndani ya nyumba kwa nyuzi 5 hadi 8°C wakati wa jua kali la mchana.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Maximize Cross-Ventilation and Ridge Openings', sw: 'Boresha Mzunguko wa Hewa na Matundu ya Paa' },
        action: {
          en: 'Create small 10cm mesh-covered openings under the roof eaves on opposite walls to let hot buoyant air escape while cooler air enters.',
          sw: 'Tengeneza nafasi za sentimita 10 zilizofunikwa kwa wavu chini ya paa kwenye kuta za pande mbili ili hewa ya moto itoke na hewa safi iingie.'
        },
        tips: {
          en: 'Hot air naturally rises; high-level vents act as a passive thermal chimney.',
          sw: 'Hewa ya moto hupanda juu kiasili; matundu ya juu ya paa hutoa joto nje kama bomba la moshi.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Utilize Traditional Clay Pots for Cool Water', sw: 'Tumia Vyungu vya Udongo Kupoza Maji ya Kunywa' },
        action: {
          en: 'Store treated drinking water in unglazed porous clay pots kept in shaded, ventilated drafts. The microscopic sweating chills the water naturally.',
          sw: 'Hifadhi maji safi ya kunywa kwenye vyungu vya udongo visivyoning’inizwa vilivyowekwa kivulini mahali penye upepo. Maji yanapoa yenyewe kiasili.'
        },
        tips: {
          en: 'Clean the pot weekly with boiling water and keep it elevated on a clean wooden stand with a tight lid.',
          sw: 'Safisha chungu kila wiki kwa maji ya moto na kukiweka juu ya kiti safi cha mbao kikiwa na mfuniko.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Adjust Activity Schedules and Hydration Cycles', sw: 'Badilisha Ratiba za Kazi na Unywaji Maji' },
        action: {
          en: 'Shift strenuous physical tasks (laundry, heavy hauling) to early morning (6–9 AM) or evening. Drink clean water every hour even before feeling thirsty.',
          sw: 'Fanya kazi ngumu (kufua nguo, kubeba mizigo) asubuhi mapema (saa 12-3 asubuhi) au jioni. Kunywa maji safi kila saa kabla hata ya kuhisi kiu.'
        },
        tips: {
          en: 'Avoid high-sugar sodas and excessive black tea during heatwaves, as they can accelerate fluid loss.',
          sw: 'Epuka soda zenye sukari nyingi na chai ya rangi nyingi wakati wa joto kali, kwani zinazidisha upungufu wa maji.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Daily Vulnerability Check-Ins on Neighbors', sw: 'Kagua Hali ya Wazee na Watoto Mtaani Kila Siku' },
        action: {
          en: 'Visit elderly neighbors, chronically ill persons, and infants twice daily during heat spells. Check for mental alertness, moist skin, and adequate drinking water.',
          sw: 'Watembelee wazee, wagonjwa, na watoto wachanga mara mbili kwa siku wakati wa mawimbi ya joto. Angalia utulivu wa akili na upatikanaji wa maji ya kunywa.'
        },
        tips: {
          en: 'If skin is burning hot and dry with confusion, cool with wet towels immediately and summon medical transport.',
          sw: 'Ngozi ikiwa ya moto sana bila jasho na mtu anachanganyikiwa, mpoze kwa taulo iliyoloa maji na umpeleke hospitali mara moja.'
        }
      }
    ]
  },

  // Module 4: Water Safety and Disease Prevention Checklist
  {
    id: 'ag-m4',
    moduleId: 'm4',
    title: {
      en: 'Household Water Safety, Treatment, and Hygiene Action Guide',
      sw: 'Mwongozo wa Usalama wa Maji, Utibu, na Usafi wa Nyumbani'
    },
    purpose: {
      en: 'Equip urban residents with proven, affordable methods to test, clarify, chlorinate, and safely store drinking water to prevent cholera and typhoid.',
      sw: 'Kuwapa wakaazi mbinu za bei nafuu za kuchuja, kutibu kwa klorini, na kuhifadhi salama maji ya kunywa kuzuia kipindupindu na typhoid.'
    },
    disclaimer: {
      en: 'Follow official label dosage on certified water treatment products strictly. Do not invent chemical measurements or use unapproved industrial bleaches.',
      sw: 'Fuata maelekezo kamili ya chupa ya dawa zilizoidhinishwa za maji. Usibuni vipimo vyako mwenyewe wala kutumia dawa kali za viwandani.'
    },
    targetAudience: {
      en: 'Heads of households, food vendors, community water kiosk operators, and health volunteers.',
      sw: 'Wakuu wa familia, wauza vyakula, waendeshaji wa vibanda vya maji, na wahudumu wa afya.'
    },
    materialsNeeded: {
      en: ['Certified household chlorine solution (or WaterGuard / Aquatabs)', 'Clean 20-litre jerrycans with narrow necks and caps', 'Clean white cotton cloth for straining', 'Handwashing soap and clean water station (Tippy-Tap)'],
      sw: ['Dawa iliyoidhinishwa ya klorini (WaterGuard / Aquatabs)', 'Mitungi safi ya lita 20 yenye vifuniko', 'Kitambaa safi cheupe cha pamba cha kuchujia', 'Sabuni ya kunawa mikono na kibuyu cha maji (Tippy-Tap)']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Pre-Treatment: Sediment Settling and Straining', sw: 'Hatua ya Kwanza: Kutuliza na Kuchuja Mchanga' },
        action: {
          en: 'If vendor water has visible turbidity (cloudy/muddy), let it stand undisturbed in a clean bucket for at least 2 hours so sediment drops to the bottom. Decant clear water through a clean cotton cloth into a treatment jerrycan.',
          sw: 'Maji ya muuzaji yakiwa na ukungu au matope, yaache yatulie kwenye ndoo safi kwa angalau saa 2 ili mchanga uende chini. Mimina maji masafi ya juu kupitia kitambaa safi cha pamba kuingia kwenye mtungi wa kutibu.'
        },
        tips: {
          en: 'Chlorine cannot kill bacteria effectively if suspended dirt particles shield them.',
          sw: 'Dawa ya klorini haiwezi kuua vijidudu vizuri ikiwa kuna matope yanayowakinga vijidudu hivyo.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Exact Chlorination Dosage', sw: 'Kipimo Sahihi cha Dawa ya Klorini' },
        action: {
          en: 'For clear water in a standard 20-litre jerrycan, add one bottle cap (approx. 5ml) of certified household sodium hypochlorite (e.g., WaterGuard). If water remains slightly cloudy even after settling, double the dose to two caps as instructed on official packaging.',
          sw: 'Kwa maji masafi kwenye mtungi wa kawaida wa lita 20, weka kifuniko kimoja (takriban 5ml) cha dawa iliyoidhinishwa ya klorini (k.m., WaterGuard). Maji yakiwa na ukungu kidogo hata baada ya kutulia, weka vifuniko viwili kulingana na maagizo ya chupa.'
        },
        tips: {
          en: 'Always shake the jerrycan vigorously for 30 seconds to disperse the chlorine evenly.',
          sw: 'Tikisa mtungi kwa nguvu kwa sekunde 30 ili dawa isambae sawasawa ndani ya maji.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Mandatory 30-Minute Contact Time', sw: 'Subiri Dakika 30 Kamili Kabla ya Kunywa' },
        action: {
          en: 'Wait a full 30 minutes before consuming the water. A faint chlorine scent indicates that pathogens have been eliminated and residual protection exists.',
          sw: 'Subiri dakika 30 kamili kabla ya kunywa maji hayo. Harufu hafifu ya dawa inathibitisha kuwa vijidudu vimekufa na maji yana ulinzi wa mabaki ya dawa.'
        },
        tips: {
          en: 'Do not drink immediately; the chemical reaction requires time to rupture bacterial cell walls.',
          sw: 'Usinywe maji mara moja; dawa inahitaji muda wa kutosha kuua kuta za bakteria za magonjwa.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Safe Dispensing Without Hand Contact', sw: 'Kuchota Maji Bila Kugusa kwa Mikono' },
        action: {
          en: 'Store water in a dedicated drinking jerrycan with a tap or narrow neck. Pour water directly into clean drinking cups; never dip communal mugs or fingers into the storage vessel.',
          sw: 'Hifadhi maji kwenye mtungi maalum wenye mfereji au mdomo mwembamba. Mimina maji moja kwa moja kwenye kikombe safi; kamwe usitumbukize kikombe au mikono ndani ya chombo cha maji.'
        },
        tips: {
          en: 'Wash and sanitize the storage container with soapy water and chlorine rinse once a week.',
          sw: 'Osha chombo cha kuhifadhia maji kwa sabuni na kukisuuza kwa maji ya klorini mara moja kwa wiki.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Install a Zero-Cost Tippy-Tap Handwashing Station', sw: 'Tengeneza Kibuyu cha Kunawa Mikono (Tippy-Tap)' },
        action: {
          en: 'Hang a 5-litre plastic cooking oil jug from a wooden pole with a foot pedal string and bar of soap hung from a string. Wash hands with soap after toilet use, before cooking, and before feeding children.',
          sw: 'Tundika kibuyu cha lita 5 cha mafuta kwenye nguzo ya mti kikiwa na kamba ya kukanyaga kwa mguu na sabuni iliyotundikwa kwa kamba. Nawa mikono kwa sabuni baada ya kutoka chooni, kabla ya kupika, na kabla ya kulisha watoto.'
        },
        tips: {
          en: 'A Tippy-Tap uses only 40ml of water per handwash compared to hundreds of millilitres from a running tap.',
          sw: 'Kibuyu cha Tippy-Tap kinatumia 40ml tu za maji kwa kila unawaji, kikiokoa maji mengi wakati wa uhaba.'
        }
      }
    ]
  },

  // Module 5: Climate-Justice Project Evaluation Checklist
  {
    id: 'ag-m5',
    moduleId: 'm5',
    title: {
      en: 'Four-Pillar Climate Justice Project Evaluation Checklist',
      sw: 'Orodha ya Nguzo Nne ya Kutathmini Miradi ya Haki ya Tabianchi'
    },
    purpose: {
      en: 'A tool for community organizers and youth advocates to critically review proposed public, NGO, or donor climate adaptation projects to ensure fairness, local control, and accountability.',
      sw: 'Zana ya wanaharakati wa jamii na vijana kukagua miradi inayopendekezwa ya serikali au wafadhili ili kuhakikisha usawa, udhibiti wa wenyeji, na uwajibikaji.'
    },
    disclaimer: {
      en: 'This evaluation framework is designed for peaceful civic analysis and constructive dialogue with government bodies and project implementers.',
      sw: 'Mfumo huu wa tathmini umebuniwa kwa ajili ya uchambuzi wa amani wa kiraia na mazungumzo ya kujenga na serikali na wakandarasi.'
    },
    targetAudience: {
      en: 'Youth leaders, Community-Based Organizations (CBOs), ward representatives, and civic auditors.',
      sw: 'Viongozi wa vijana, mashirika ya kijamii (CBOs), wawakilishi wa wadi, na wakaguzi wa kiraia.'
    },
    materialsNeeded: {
      en: ['Copy of Project Proposal / County Budget line item / EIA Report', 'Assessment worksheet with scoring grid', 'Recording notebook and camera', 'Community survey questions'],
      sw: ['Nakala ya Pendekezo la Mradi / Kipengele cha Bajeti ya Kaunti / Ripoti ya EIA', 'Karatasi ya maswali ya tathmini', 'Daftari la kuandika na kamera', 'Maswali ya mahojiano ya wakaazi']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Pillar 1: Who Decided? (Procedural Justice)', sw: 'Nguzo ya 1: Nani Aliamua? (Haki ya Kiutaratibu)' },
        action: {
          en: 'Investigate project origins: Was it initiated by local grassroots residents or imposed top-down? Did genuine public participation occur with at least 7 days public notice and accessible translation into Kiswahili?',
          sw: 'Chunguza chanzo cha mradi: Je, ulibuniwa na wakaazi wa mashinani au ulilazimishwa kutoka juu? Je, kulikuwa na ushiriki wa kweli wa umma wenye notisi ya siku 7 na tafsiri ya Kiswahili?'
        },
        tips: {
          en: 'Demand copies of the public participation attendance register and minutes under Article 35 of the Constitution.',
          sw: 'Dai nakala za orodha ya waliohudhuria na kumbukumbu za mkutano wa umma chini ya Kifungu cha 35 cha Katiba.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Pillar 2: Who Benefits? (Distributive Justice)', sw: 'Nguzo ya 2: Nani Ananufaika? (Haki ya Mgawanyo)' },
        action: {
          en: 'Analyze who reaps the primary rewards: Do floodwalls, water lines, or shaded spaces serve the most marginalized informal settlement households, or wealthy commercial landlords downstream?',
          sw: 'Chambua nani anayepata faida kuu: Je, mifereji au kuta zinalinda familia duni za mabanda au wamiliki matajiri wa viwanda na majumba ya kibiashara?'
        },
        tips: {
          en: 'Ensure project jobs prioritize local unemployed youth and artisans, not outside commercial cartels.',
          sw: 'Hakikisha ajira za mradi zinawapa kipaumbele vijana na mafundi wa mtaa, si magenge ya nje ya kibiashara.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Pillar 3: Who Bears the Burden? (Harm Assessment)', sw: 'Nguzo ya 3: Nani Anayebeba Mzigo? (Tathmini ya Madhara)' },
        action: {
          en: 'Screen for potential Maladaptation: Does the project divert floodwater onto neighboring settlements? Does it involve forced evictions or loss of micro-business stalls without compensation?',
          sw: 'Chunguza madhara ya maladaptation: Je, mradi unachepusha mafuriko kwa majirani maskini? Je, unahusisha kubomoa nyumba au vibanda vya biashara bila fidia?'
        },
        tips: {
          en: 'Under international human rights standards, involuntary resettlement must always include humane alternative housing.',
          sw: 'Chini ya sheria za kimataifa za haki za kibinadamu, uhamishaji wowote lazima uhusishe makazi mbadala ya utu.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Pillar 4: Is it Transparent and Accountable?', sw: 'Nguzo ya 4: Je, Kuna Uwazi na Uwajibikaji?' },
        action: {
          en: 'Inspect financial transparency: Are contractor contract amounts, project completion timelines, bill of quantities (BOQ), and grievance redress mechanisms displayed openly on public noticeboards?',
          sw: 'Kagua uwazi wa kifedha: Je, kiasi cha fedha cha mkataba wa mkandarasi, ratiba ya kukamilika, na njia za kutoa malalamiko zimewekwa wazi kwenye mbao za matangazo ya umma?'
        },
        tips: {
          en: 'Check whether an independent community oversight committee exists to monitor actual construction quality.',
          sw: 'Chunguza iwapo kuna kamati huru ya usimamizi ya wakaazi inayokagua ubora halisi wa vifaa vya ujenzi.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Compile and Submit Equitable Adaptation Scorecard', sw: 'Andaa na Wasilisha Ripoti ya Tathmini' },
        action: {
          en: 'Score the project out of 20 points (5 points per pillar). Present the findings at the Ward Development Committee baraza and share a copy with civil society networks.',
          sw: 'Toa alama kwa mradi kati ya alama 20 (alama 5 kwa kila nguzo). Wasilisha matokeo kwenye baraza la Kamati ya Maendeleo ya Wadi na mashirika ya kijamii.'
        },
        tips: {
          en: 'Projects scoring below 12 points indicate severe risks of maladaptation requiring redesign and community renegotiation.',
          sw: 'Mradi unaopata chini ya alama 12 unaonyesha hatari kubwa za udhalimu unaohitaji kusimamishwa na kupangwa upya.'
        }
      }
    ]
  },

  // Module 6: Environmental Claims Evidence Checklist
  {
    id: 'ag-m6',
    moduleId: 'm6',
    title: {
      en: 'Five-Step Green Claims and Greenwashing Verification Checklist',
      sw: 'Orodha ya Hatua Tano ya Kuchunguza Madai ya Mazingira na Upotoshaji'
    },
    purpose: {
      en: 'Provide young consumers and community advocates with a rigorous critical framework to interrogate corporate environmental advertising and identify misleading claims.',
      sw: 'Kuwapa vijana na walaji mfumo thabiti wa kisayansi wa kuchunguza matangazo ya mazingira ya makampuni na kubaini ulaghai wa kibiashara.'
    },
    disclaimer: {
      en: 'Always base green claims evaluations on objective evidence, public test records, and legal standards. Do not make public allegations without verifiable documentation.',
      sw: 'Simamisha tathmini ya madai kwenye ushahidi halisi, ripoti za maabara, na sheria. Usitoe tuhuma za umma bila nyaraka zilizothibitishwa.'
    },
    targetAudience: {
      en: 'Youth consumers, student researchers, environmental journalists, and business owners.',
      sw: 'Vijana walaji, wanafunzi watafiti, wanahabari wa mazingira, na wamiliki wa biashara.'
    },
    materialsNeeded: {
      en: ['Product packaging or printed advertisement', 'Smartphone for scanning QR codes and checking websites', 'Competition Authority of Kenya guidelines', 'KEBS standard marks reference'],
      sw: ['Kifungashio cha bidhaa au tangazo lililochapishwa', 'Simu ya mkononi ya kusoma QR kodi na kukagua tovuti', 'Miongozo ya Mamlaka ya Ushindani ya Kenya (CAK)', 'Mwongozo wa alama za viwango za KEBS']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Step 1: Test for Specificity (Reject Vague Buzzwords)', sw: 'Hatua ya 1: Pima Umaalumu (Kataa Maneno Yasiyo Wazi)' },
        action: {
          en: 'Check the exact phrasing: Does the claim use vague unregulated slogans ("100% Green", "Eco-Friendly", "Nature’s Choice"), or does it state specific, measurable percentages (e.g., "contains 30% recycled PET plastic")?',
          sw: 'Kagua maneno kamili yaliyotumika: Je, linatumia maneno ya jumla ya uongo ("100% Kijani", "Rafiki wa Mazingira", "Chaguo la Asili"), au linataja asilimia halisi zinazopimika (k.m., "ina 30% plastiki iliyorejelezwa")?'
        },
        tips: {
          en: 'If a claim cannot be expressed in precise numbers or scientific chemical compositions, it is an unregulated marketing buzzword.',
          sw: 'Dai lisiloweza kutajwa kwa nambari kamili au vipimo vya kisayansi ni neno la kibiashara tu lisilo na maana.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Step 2: Inspect Accessible Supporting Evidence', sw: 'Hatua ya 2: Kagua Ushahidi Unaofikika' },
        action: {
          en: 'Search for public proof: Does the packaging provide a working QR code, link, or test reference to an accessible third-party audit report verifying the claim?',
          sw: 'Tafuta uthibitisho wa wazi: Je, kifungashio kina QR kodi inayofanya kazi, kiungo cha tovuti, au nambari ya ripoti huru ya ukaguzi wa maabara kuthibitisha dai hilo?'
        },
        tips: {
          en: 'If scanning the QR code leads to a generic advertising video instead of a certified audit report, the claim is unsubstantiated.',
          sw: 'QR kodi ikifungua video ya matangazo ya mziki badala ya ripoti ya kisayansi ya ukaguzi, dai hilo halina ushahidi.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Step 3: Verify Independent Third-Party Certification', sw: 'Hatua ya 3: Hakiki Uthibitisho wa Shirika Huru' },
        action: {
          en: 'Distinguish real eco-labels from self-made corporate stamps: Look for accredited marks like KEBS Diamond Mark of Quality, Forest Stewardship Council (FSC), Fairtrade, or ISO 14024 Type I labels.',
          sw: 'Tofautisha lebo halisi za viwango na nembo zilizochorwa na kampuni: Tafuta alama zilizoidhinishwa kama KEBS Diamond Mark, FSC, Fairtrade, au ISO 14024.'
        },
        tips: {
          en: 'Verify the certification code on the official registry website (e.g., info.fsc.org or kebs.org).',
          sw: 'Thibitisha nambari ya cheti kwenye tovuti rasmi ya shirika husika la viwango (k.m., kebs.org au info.fsc.org).'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Step 4: Audit the Full Life-Cycle (Identify Hidden Trade-Offs)', sw: 'Hatua ya 4: Kagua Mzunguko Mzima wa Maisha' },
        action: {
          en: 'Examine hidden impacts: Does advertising a minor positive feature (e.g., a cap using 5% less plastic) conceal massive destructive footprints in raw material extraction, toxic manufacturing, or dirty transport?',
          sw: 'Chunguza madhara yaliyofichwa: Je, kutangaza sifa ndogo (k.m., kizibo kinachotumia 5% plastiki kidogo) kunaficha uharibifu mkubwa wa uchimbaji wa mafuta au uchafuzi wa viwandani?'
        },
        tips: {
          en: 'A truly sustainable product must not generate toxic sludge or human rights violations in other lifecycle phases.',
          sw: 'Bidhaa endelevu ya kweli haipaswi kutoa sumu au kukiuka haki za binadamu katika hatua zingine za uzalishaji.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Step 5: Reality-Check in Local Nairobi Context', sw: 'Hatua ya 5: Pima Uhalisia wa Mtaa Nairobi' },
        action: {
          en: 'Assess practical feasibility: Even if technically recyclable in an advanced industrial facility, does the physical collection and recycling infrastructure actually exist in Kibera, Mathare, or Ruaraka?',
          sw: 'Tathmini uhalisia wa vitendo: Hata kama kitu kinaweza kurejelezwa kimaabara, je, miundombinu halisi ya ukusanyaji na urejelezaji ipo kweli Kibera, Mathare, au Ruaraka?'
        },
        tips: {
          en: 'If a "recyclable" container inevitably ends up burned in open piles or choking storm culverts, the claim is misleading in local practice.',
          sw: 'Kifungashio kinachoitwa "kinachoweza kurejelezwa" kikiishia kuchomwa moto au kuziba mitaro, dai hilo linapotosha kiuhalisia.'
        }
      }
    ]
  },

  // Module 7: Safe Civic Participation Planning Template
  {
    id: 'ag-m7',
    moduleId: 'm7',
    title: {
      en: 'Safe Civic Participation and Written Memorandum Planning Template',
      sw: 'Kiolezo cha Ushiriki Salama wa Kiraia na Kuandaa Memorandum ya Maandishi'
    },
    purpose: {
      en: 'A step-by-step framework to guide young leaders in drafting persuasive, evidence-grounded written submissions and engaging safely in county legislative processes.',
      sw: 'Mwongozo wa hatua kwa hatua wa kuwaongoza vijana kuandika memoranda za kitaalamu zenye ushahidi na kushiriki kwa usalama katika utawala wa kaunti.'
    },
    disclaimer: {
      en: 'Civic participation must always remain peaceful, constructive, and strictly non-partisan. Never engage in violence, hate speech, or partisan property destruction.',
      sw: 'Ushiriki wa kiraia lazima daima uwe wa amani, wenye kujenga, na usioegemea upande wa kisiasa. Kamwe usishiriki vurugu, chuki, au uharibifu wa mali.'
    },
    targetAudience: {
      en: 'Youth advocacy coalitions, student councils, community organizers, and ward committees.',
      sw: 'Muungano wa vijana watetezi, mabaraza ya wanafunzi, wanaharakati wa mitaa, na kamati za wadi.'
    },
    materialsNeeded: {
      en: ['Copy of Constitution of Kenya (Articles 10, 35, 42)', 'Template paper for written memorandum', 'Official County Assembly calendar / notice', 'Contact details of Ward MCA and Committee Clerk'],
      sw: ['Nakala ya Katiba ya Kenya (Vifungu 10, 35, 42)', 'Karatasi ya kuandika memorandum', 'Kalenda au notisi rasmi ya Bunge la Kaunti', 'Mawasiliano ya Diwani wa Wadi (MCA) na Karani wa Kamati']
    },
    steps: [
      {
        stepNumber: 1,
        title: { en: 'Track Statutory County Consultation Notices', sw: 'Fuatilia Notisi Rasmi za Mashauriano za Kaunti' },
        action: {
          en: 'Monitor the official Nairobi County website (nairobi.go.ke), national daily newspapers, and local ward notice boards for statutory public participation announcements on the CIDP, ADP, or Budget Estimates.',
          sw: 'Fuatilia tovuti rasmi ya Kaunti ya Nairobi (nairobi.go.ke), magazeti ya kila siku, na mbao za matangazo za wadi kupata matangazo ya mikutano ya CIDP, ADP, au Bajeti.'
        },
        tips: {
          en: 'By law, public notices must be published at least 7 days before the hearing date.',
          sw: 'Kisheria, matangazo ya umma lazima yachapishwe angalau siku 7 kabla ya tarehe ya kikao.'
        }
      },
      {
        stepNumber: 2,
        title: { en: 'Structure the Written Memorandum', sw: 'Panga Muundo wa Memorandum ya Maandishi' },
        action: {
          en: 'Draft a 2-to-3 page memorandum with four sections: 1. Identity & Mandate (Who you are); 2. Context & Verified Evidence (Localized problem with photos/GPS); 3. Concrete Recommendations (Specific budget line allocations); 4. Constitutional Grounding (Articles 10 & 42).',
          sw: 'Andika memorandum ya kurasa 2 hadi 3 yenye sehemu nne: 1. Utambulisho (Ninyi ni nani); 2. Changamoto yenye Ushahidi (Picha na maelezo ya mtaa); 3. Mapendekezo Maalum (Kiasi cha fedha cha bajeti); 4. Msingi wa Katiba (Vifungu 10 na 42).'
        },
        tips: {
          en: 'Keep demands practical and costed: proposing specific budget allocations is far more persuasive than general complaints.',
          sw: 'Weka madai ya vitendo yenye makadirio ya gharama: kupendekeza mgao maalum wa fedha kuna nguvu kuliko kulalamika tu kwa jumla.'
        }
      },
      {
        stepNumber: 3,
        title: { en: 'Apply Digital Safety Protocols for Organizers', sw: 'Tumia Kanuni za Usalama wa Kidijitali' },
        action: {
          en: 'Enable Two-Factor Authentication (2FA) with an authenticator app on all organizer accounts. Keep sensitive logistics discussions in end-to-end encrypted messaging channels.',
          sw: 'Washa Uthibitishaji wa Hatua Mbili (2FA) kwa programu ya simu kwenye akaunti zote za viongozi. Weka mawasiliano ya mipango kwenye programu salama zilizolindwa kwa njia fiche.'
        },
        tips: {
          en: 'Never broadcast home addresses, personal financial numbers, or vulnerable individuals’ photos publicly.',
          sw: 'Kamwe usitangaze anwani za nyumbani, nambari za benki, au picha za watu walio hatarini mtandaoni.'
        }
      },
      {
        stepNumber: 4,
        title: { en: 'Deliver Oral Remarks and Submit Official Copies', sw: 'Wasilisha Maoni ya Mdomo na Nakala Rasmi' },
        action: {
          en: 'Select two designated articulate youth speakers. Keep oral comments strictly within the allocated time (typically 3 minutes). State your main recommendation in the first 60 seconds. Hand 3 physical signed copies to the Committee Clerk for the Hansard record.',
          sw: 'Chagua wazungumzaji wawili wa vijana wenye ufasaha. Zingatia muda uliotengwa (kwa kawaida dakika 3). Toa hoja kuu ndani ya sekunde 60 za kwanza. Kabidhi nakala 3 zilizosainiwa kwa Karani wa Kamati kwa kumbukumbu ya Hansard.'
        },
        tips: {
          en: 'Request a stamped receiving acknowledgment copy from the Clerk as legal proof of submission.',
          sw: 'Omba nakala moja iliyogongwa muhuri wa kupokelewa na Karani kama uthibitisho wa kisheria wa uwasilishaji.'
        }
      },
      {
        stepNumber: 5,
        title: { en: 'Monitor Implementation and Public Oversight', sw: 'Fuatilia Utekelezaji na Ukaguzi wa Umma' },
        action: {
          en: 'Track the published County Budget Appropriations Act to confirm whether your recommended line items were adopted. Monitor subsequent construction works collaboratively with your Ward Administrator.',
          sw: 'Fuatilia Sheria ya Bajeti iliyopitishwa kuthibitisha iwapo mapendekezo yenu yalijumuishwa. Fuatilia ujenzi utakapoanza kwa kushirikiana na Msimamizi wa Wadi.'
        },
        tips: {
          en: 'Civic participation is a continuous democratic cycle of advocacy, oversight, and community maintenance.',
          sw: 'Ushiriki wa kiraia ni mzunguko unaoendelea wa utetezi, ukaguzi wa umma, na utunzaji wa maendeleo ya jamii.'
        }
      }
    ]
  }
];
