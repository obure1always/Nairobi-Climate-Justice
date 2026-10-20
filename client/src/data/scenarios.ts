export interface ScenarioOption {
  id: string;
  text: { en: string; sw: string };
  consequence: { en: string; sw: string };
  isRecommended: boolean;
  reasoning: { en: string; sw: string };
}

export interface Scenario {
  id: string;
  moduleId: string;
  title: { en: string; sw: string };
  context: { en: string; sw: string };
  situation: { en: string; sw: string };
  options: ScenarioOption[];
  reflection: { en: string; sw: string };
  takeaway: { en: string; sw: string };
}

export const scenarios: Scenario[] = [
  // Module 1: Nairobi Climate Risk
  {
    id: 'm1-s1',
    moduleId: 'm1',
    title: {
      en: 'Planning Grocery Inventory Under Seasonal Uncertainty',
      sw: 'Kupanga Akiba ya Mboga Wakati wa Mashaka ya Msimu'
    },
    context: {
      en: 'Gikomba Market, Nairobi. March seasonal rains outlook released by Kenya Meteorological Department.',
      sw: 'Soko la Gikomba, Nairobi. Utabiri wa mvua za msimu wa Machi umetolewa na Idara ya Hali ya Hewa (KMD).'
    },
    situation: {
      en: 'You run a small fresh produce stall in Gikomba. KMD has announced an "Alert for Erratic Rainfall" with high probability of sudden flash storms followed by prolonged dry hot spells. Wholesale vegetable prices are fluctuating rapidly in Kiambu and Machakos. What is your most climate-resilient restocking strategy?',
      sw: 'Una kibanda cha mboga safi soko la Gikomba. KMD imetangaza tahadhari ya mvua zisizotabirika zenye uwezekano mkubwa wa dhoruba za ghafla zikifuatiwa na vipindi virefu vya ukame na joto kali. Bei za mboga Kiambu na Machakos zinabadilika haraka. Ni ipi mkakati thabiti zaidi wa kupanga akiba ya bidhaa?'
    },
    options: [
      {
        id: 'm1-s1-opt1',
        text: {
          en: 'Borrow a large high-interest loan to buy 3 weeks worth of perishable greens before prices surge.',
          sw: 'Kuchukua mkopo mkubwa wa riba kubwa kununua mboga za majani za wiki tatu kabla ya bei kupanda.'
        },
        consequence: {
          en: 'High risk: Power outages and high humidity cause rapid rot; you face massive debt and ruined inventory.',
          sw: 'Hatari kubwa: Kukatika kwa umeme na joto kali kunasababisha mboga kuoza haraka; unakabiliwa na deni kubwa na hasara ya bidhaa.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Perishable vegetables cannot withstand high storage heat without refrigeration during uncertain climate shocks.',
          sw: 'Mboga za majani haziwezi kudumu kwenye joto kali bila jokofu wakati wa mishtuko ya tabianchi.'
        }
      },
      {
        id: 'm1-s1-opt2',
        text: {
          en: 'Diversify stock: buy smaller batches of hardy produce (onions, tubers, dried legumes) and coordinate daily micro-orders with nearby vendors.',
          sw: 'Kugawanya bidhaa: nunua mafungu madogo ya vyakula vinavyodumu (vitunguu, viazi, kunde kavu) na kushirikiana na wafanyabiashara wengine kwa maagizo ya kila siku.'
        },
        consequence: {
          en: 'Resilient outcome: Minimized spoilage loss, stable cash flow, and shared transport risk during sudden transport disruptions.',
          sw: 'Matokeo thabiti: Hasara ndogo ya kuoza, mtiririko thabiti wa fedha, na kupunguza hatari ya usafiri barabara zikifungwa na mafuriko.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Diversification and collective buying buffer small vendors against climate-induced supply volatility.',
          sw: 'Kugawanya bidhaa na ununuzi wa pamoja unawalinda wafanyabiashara wadogo dhidi ya mabadiliko ya bei na hali ya hewa.'
        }
      },
      {
        id: 'm1-s1-opt3',
        text: {
          en: 'Close the stall completely until the season ends and stay home.',
          sw: 'Kufunga kibanda kabisa hadi msimu uishe na kukaa nyumbani.'
        },
        consequence: {
          en: 'Economic loss: Loss of daily income and customer base, worsening household vulnerability.',
          sw: 'Hasara ya kiuchumi: Kupoteza kipato cha kila siku na wateja, jambo linaloongeza umaskini wa familia.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Total cessation of work is unsustainable for informal workers who need daily livelihood buffers.',
          sw: 'Kusimamisha kazi kabisa hakuwezekani kwa wafanyabiashara wadogo wanaotegemea kipato cha kila siku.'
        }
      }
    ],
    reflection: {
      en: 'How do weather forecasts influence everyday business choices in your community, and who bears the cost of bad weather?',
      sw: 'Je, utabiri wa hali ya hewa unaathirije maamuzi ya biashara mtaani kwako, na ni nani anayebeba gharama za hali mbaya ya hewa?'
    },
    takeaway: {
      en: 'Climate adaptation for informal businesses requires flexible inventory, diversified stock, and collective purchasing networks.',
      sw: 'Kukabiliana na tabianchi kwa biashara ndogo kunahitaji ununuzi wa mafungu madogo, bidhaa zinazodumu, na mshikamano wa wafanyabiashara.'
    }
  },
  {
    id: 'm1-s2',
    moduleId: 'm1',
    title: {
      en: 'Mitigating Micro-Heat in a Metal Workshop',
      sw: 'Kupunguza Joto Kali Ndani ya Karakana ya Mabati'
    },
    context: {
      en: 'Baba Dogo light industrial area, Ruaraka. Corrugated sheet fabrication workshop during February hot peak.',
      sw: 'Eneo la viwanda vidogo Baba Dogo, Ruaraka. Karakana ya uchomeleaji wa mabati wakati wa joto kali la Februari.'
    },
    situation: {
      en: 'Indoor temperatures inside your family sheet-metal workshop exceed 38°C by midday. Workers are experiencing severe fatigue, headaches, and dizziness, slowing down production and risking burns. Electricity is costly and intermittent. How do you adapt the workplace with low-cost interventions?',
      sw: 'Joto ndani ya karakana ya mabati ya familia linafikia zaidi ya nyuzi joto 38°C ifikapo mchana. Mafundi wanakabiliwa na uchovu mkali, maumivu ya kichwa, na kizunguzungu, jambo linalopunguza kazi na kuleta hatari ya majeraha. Umeme ni ghali na unakatika. Unarekebishaje eneo la kazi kwa gharama nafuu?'
    },
    options: [
      {
        id: 'm1-s2-opt1',
        text: {
          en: 'Install high-mounted ridge ventilation openings, paint the rusty roof exterior white with lime wash, and provide shaded cool water points.',
          sw: 'Kuweka nafasi za wazi za hewa juu ya paa, kupaka rangi nyeupe ya chokaa juu ya mabati, na kuweka sehemu zenye kivuli za maji baridi ya kunywa.'
        },
        consequence: {
          en: 'Temperature drops by 4-7°C indoors through passive radiative cooling and thermal buoyancy; worker alertness recovers.',
          sw: 'Joto linashuka kwa nyuzi 4-7°C ndani kupitia mwanga kuakisiwa na hewa ya moto kupanda nje; afya na umakini wa mafundi unarejea.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Reflective roof coatings and ridge venting remove trapped hot air without requiring expensive electricity.',
          sw: 'Rangi nyeupe na matundu ya juu ya paa hutoa hewa ya moto bila kutumia umeme wa gharama.'
        }
      },
      {
        id: 'm1-s2-opt2',
        text: {
          en: 'Seal all windows and doors with plastic sheeting to keep outside dust away.',
          sw: 'Kuziba madirisha na milango yote kwa mifuko ya plastiki ili kuzuia vumbi la nje lisiingie.'
        },
        consequence: {
          en: 'Severe hazard: Heat and welding fumes are trapped; risk of fainting and toxic respiratory distress increases drastically.',
          sw: 'Hatari kubwa: Joto na moshi wa uchomeleaji vinakwama ndani; hatari ya kuzirai na magonjwa ya kifua inaongezeka sana.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Trapping air in a metal building creates a dangerous greenhouse effect and toxic fume concentration.',
          sw: 'Kuziba hewa ndani ya jengo la mabati kunatengeneza chumba cha joto na hewa ya sumu ya uchomeleaji.'
        }
      },
      {
        id: 'm1-s2-opt3',
        text: {
          en: 'Tell workers to ignore the heat and work through the hottest hours of the day without breaks.',
          sw: 'Kueleza mafundi wapuuze joto na wafanye kazi saa za mchana kali bila kupumzika.'
        },
        consequence: {
          en: 'Medical emergency: High likelihood of heat exhaustion or heatstroke leading to hospitalization.',
          sw: 'Dharura ya kiafya: Uwezekano mkubwa wa kuanguka kwa ugonjwa wa joto kali unaohitaji kulazwa hospitalini.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Physical labor in extreme heat without hydration causes dangerous thermal cardiovascular collapse.',
          sw: 'Kazi ngumu ya mwili kwenye joto kali bila maji inasababisha mwili kushindwa kupoza damu na kuleta kifo au kiharusi.'
        }
      }
    ],
    reflection: {
      en: 'What structural features of buildings in your neighborhood make heat bearable or unbearable?',
      sw: 'Ni sifa gani za ujenzi wa nyumba mtaani kwako zinazofanya joto livumilike au liwe gumu kuvumilika?'
    },
    takeaway: {
      en: 'Passive cooling (lime wash, cross ventilation, ridge vents) provides affordable heat relief in dense informal settlements.',
      sw: 'Njia za asili za kupoza (chokaa nyeupe, madirisha yanayopitisha hewa, matundu ya paa) hupunguza joto kwa bei nafuu sana.'
    }
  },

  // Module 2: Urban Flooding
  {
    id: 'm2-s1',
    moduleId: 'm2',
    title: {
      en: 'Nighttime Flash Flood Emergency Response',
      sw: 'Hatua za Dharura za Mafuriko ya Ghafla Usiku'
    },
    context: {
      en: 'Mathare 4A riverbank, 2:45 AM. Upstream storm in Aberdares/Ngong Hills causes sudden water surge.',
      sw: 'Ukingo wa Mto Mathare 4A, saa 8:45 usiku. Mvua kubwa milimani inasababisha mafuriko ya ghafla mtoni.'
    },
    situation: {
      en: 'You wake up to the sound of rushing water and neighbors banging whistle signals. Water is already 15cm deep inside your room and rising fast. Your elderly aunt lives two doors away with limited mobility. What is your immediate, safest plan of action?',
      sw: 'Unaamka ukisikia mlio wa maji yanayotiririka kwa nguvu na filimbi za tahadhari za majirani. Maji tayari yamefika kina cha sentimita 15 ndani ya chumba chako na yanapanda haraka. Shangazi yako mzee mwenye shida ya kutembea anaishi vyumba viwili mbele. Ni ipi hatua yako salama na ya haraka zaidi?'
    },
    options: [
      {
        id: 'm2-s1-opt1',
        text: {
          en: 'Quickly grab your prepared waterproof "Go-Bag" (documents, medications, flashlight), alert your aunt immediately, and evacuate together along high ground designated routes.',
          sw: 'Kuchukua haraka mfuko wako wa dharura wa "Go-Bag" uliotayarishwa (vitambulisho, dawa, tochi), kumuamsha shangazi mara moja, na kuelekea sehemu za juu zilizopangwa.'
        },
        consequence: {
          en: 'Lives protected: You reach the elevated community hall safely before the alley becomes impassable.',
          sw: 'Maisha yanalindwa: Mnafika ukumbi wa jamii ulio sehemu ya juu salama kabla njia haijajaa maji yasiyopitika.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Prioritizing human life, designated high ground, and assisting vulnerable neighbors prevents drowning.',
          sw: 'Kutanguliza maisha ya binadamu, kuelekea sehemu za juu, na kusaidia walio na udhaifu kunazuia vifo vya mafuriko.'
        }
      },
      {
        id: 'm2-s1-opt2',
        text: {
          en: 'Stay inside to stack heavy sofas and electronic television sets onto tables to save property.',
          sw: 'Kubaki ndani kupanga masofa mazito na televisheni juu ya meza ili kuokoa mali za nyumbani.'
        },
        consequence: {
          en: 'Critical trap: Rushing water surges to waist height, jams the sheet metal door shut, and cuts off escape.',
          sw: 'Mtego hatari: Maji yanapanda hadi kiunoni kwa ghafla, yanasukuma mlango wa bati na kuufunga, na kuziba njia ya kutoroka.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Property is replaceable; human life is not. Delaying evacuation to save furniture is a leading cause of urban flood fatalities.',
          sw: 'Mali inaweza kununuliwa tena; uhai haununuliki. Kuchelewa kuhama ili kuokoa vyombo ndio chanzo kikuu cha vifo vya mafuriko.'
        }
      },
      {
        id: 'm2-s1-opt3',
        text: {
          en: 'Walk down into the riverbed to check how high the water is and attempt to pull debris from culverts.',
          sw: 'Kuteremka chini mtoni kuangalia kina cha maji na kujaribu kuondoa magogo yaliyoziba mtaro.'
        },
        consequence: {
          en: 'Extreme danger: Rapid currents of 15cm can sweep an adult off their feet; debris strikes cause severe trauma or drowning.',
          sw: 'Hatari ya kifo: Mkondo wa maji wa kina cha sentimita 15 unaweza kumwangusha mtu mzima; takataka nzito zinasababisha majeraha mabaya au kuzama.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Never enter floodwater or attempt amateur debris clearance during an active flood surge.',
          sw: 'Kamwe usiingie ndani ya maji ya mafuriko au kujaribu kusafisha mitaro wakati dhoruba kali inaendelea.'
        }
      }
    ],
    reflection: {
      en: 'Does your household have a waterproof emergency packet containing identity cards, birth certificates, and necessary medicines?',
      sw: 'Je, nyumba yenu ina mfuko usiopitisha maji uliotunzwa vitambulisho, vyeti vya kuzaliwa, na dawa muhimu za dharura?'
    },
    takeaway: {
      en: 'During flash floods, immediate evacuation to high ground with vulnerable family members overrides saving physical property.',
      sw: 'Wakati wa mafuriko ya ghafla, kuondoka mara moja kuelekea sehemu za juu na kusaidia walio hatarini ni muhimu kuliko kuokoa mali.'
    }
  },
  {
    id: 'm2-s2',
    moduleId: 'm2',
    title: {
      en: 'Community Drainage Maintenance Before Long Rains',
      sw: 'Kusafisha Mifereji ya Jamii Kabla ya Mvua Ndefu'
    },
    context: {
      en: 'Sarang’ombe Ward, Kibera. Two weeks before the forecasted onset of the March-April-May rains.',
      sw: 'Wadi ya Sarang’ombe, Kibera. Wiki mbili kabla ya kuanza kwa mvua za Machi-Aprili-Mei zilizotabiriwa.'
    },
    situation: {
      en: 'The main concrete drainage trench passing through your village is choked with plastic waste, car tires, and silt. Heavy rains will cause water to back up directly into 80 homes. The county government sanitation crew has not arrived. How should your youth group mobilize the community safely?',
      sw: 'Mfereji mkuu wa zege unaopita kijijini mwenu umezibwa na chupa za plastiki, magurudumu ya magari, na mchanga. Mvua ikinyesha maji yataingia moja kwa moja kwenye nyumba 80. Wafanyakazi wa usafi wa kaunti hawajafika. Je, kikundi chenu cha vijana kinapaswa kuhamasisha jamii vipi kwa usalama?'
    },
    options: [
      {
        id: 'm2-s2-opt1',
        text: {
          en: 'Organize a safe community cleanup with heavy-duty rubber gloves, gumboots, and rakes; bag solid waste separately; and petition the Ward Administrator for a truck.',
          sw: 'Kupanga usafi wa jamii ukiwa na glavu imara za mipira, buti ndefu, na reki; kufunga taka kwenye magunia; na kumwandikia Msimamizi wa Wadi kuleta lori la kubeba.'
        },
        consequence: {
          en: 'Safe drainage flow restored: Water runs clear without overflowing, and health hazards are safely managed with PPE.',
          sw: 'Maji yanatiririka salama: Maji yanapita bila kufurika mitaani, na hatari za maambukizi zinadhibitiwa kwa vifaa vya kujikinga.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Protective equipment prevents cuts and infections, while pairing volunteer labor with local government logistics ensures waste is hauled away.',
          sw: 'Vifaa vya kujikinga vinazuia majeraha na maambukizi, huku kushirikiana na serikali ya mtaa kunahakikisha taka zinasombwa jalalani.'
        }
      },
      {
        id: 'm2-s2-opt2',
        text: {
          en: 'Set fire to the plastic and tires inside the drainage ditch to burn them away.',
          sw: 'Kuwasha moto plastiki na magurudumu ndani ya mtaro ili viteketeze taka zote.'
        },
        consequence: {
          en: 'Severe disaster: Toxic acrid black smoke causes asthma emergencies, damages the concrete lining, and leaves molten plastic that hardens like rock.',
          sw: 'Janga kubwa: Moshi mzito wa sumu unaleta dharura za pumu, unapasua kuta za zege, na plastiki iliyoyeyuka inaganda kama jiwe na kuziba mtaro zaidi.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Burning waste in drainage produces dioxins and melts plastics into permanent drainage obstructions.',
          sw: 'Kuchoma taka ndani ya mtaro kunazalisha hewa ya sumu na kuyeyusha plastiki kuwa vizuizi vigumu vya kudumu.'
        }
      },
      {
        id: 'm2-s2-opt3',
        text: {
          en: 'Push the garbage further downstream so it washes out of your village into the neighboring village.',
          sw: 'Kusukuma takataka kuelekea chini zaidi ili ziondoke kijijini kwenu na kuingia kijiji cha jirani.'
        },
        consequence: {
          en: 'Maladaptation and conflict: Bridges downstream choke, causing catastrophic flooding for neighbors and sparking violent disputes.',
          sw: 'Madhara na ugomvi: Madaraja ya chini yanaziba, yanasababisha mafuriko makubwa kwa majirani na kuibua ugomvi mkali wa mtaa.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Shifting hazards onto adjacent communities violates climate justice and causes downstream destruction.',
          sw: 'Kuhamishia uchafu kwa majirani kunakiuka haki ya mazingira na kusababisha uharibifu mkubwa chini ya mto.'
        }
      }
    ],
    reflection: {
      en: 'How can youth groups create sustainable recycling or composting enterprises out of waste cleared from neighborhood drains?',
      sw: 'Je, vikundi vya vijana vinawezaje kuanzisha biashara za urejelezaji au mbolea kutokana na taka zinazotolewa kwenye mitaro?'
    },
    takeaway: {
      en: 'Drainage maintenance must use protective gear, safe waste disposal, and coordination with county sanitation trucks.',
      sw: 'Usafishaji wa mitaro unahitaji vifaa vya kujikinga, utupaji sahihi wa taka, na ushirikiano na malori ya kaunti.'
    }
  },

  // Module 3: Heat and Health
  {
    id: 'm3-s1',
    moduleId: 'm3',
    title: {
      en: 'Recognizing and Responding to Heat Illness in Vulnerable Neighbors',
      sw: 'Kutambua na Kushughulikia Ugonjwa wa Joto Kali kwa Majirani'
    },
    context: {
      en: 'Korogocho informal settlement, 2:30 PM. Heat wave day with outdoor temperatures reaching 34°C.',
      sw: 'Makazi ya Korogocho, saa 8:30 mchana. Wimbi la joto kali joto la nje likifikia nyuzi 34°C.'
    },
    situation: {
      en: 'You check on Mzee Juma, a 68-year-old diabetic neighbor living in a single-room corrugated iron house without ceiling insulation. He is confused, speaking incoherently, his skin is hot and dry (no sweat), and his breathing is rapid. How do you respond?',
      sw: 'Unaenda kumjulia hali Mzee Juma, jirani mwenye umri wa miaka 68 anayeishi na ugonjwa wa sukari kwenye chumba cha mabati kisicho na dari. Anachanganyikiwa, anaongea maneno yasiyoeleweka, ngozi yake ni kavu na ya moto sana (hatoki jasho), na anapumua kwa kasi. Unachukua hatua gani?'
    },
    options: [
      {
        id: 'm3-s1-opt1',
        text: {
          en: 'Recognize suspected Heatstroke (medical emergency): Call for urgent transport/ambulance to the nearest health center, move him to shade, loosen clothing, and cool him rapidly with wet cloths and fanning.',
          sw: 'Kutambua dalili za Kiharusi cha Joto (Heatstroke - dharura ya kitabibu): Piga simu ya dharura ya usafiri/ambulensi kwenda kituo cha afya, mpeleke kivulini, legeza nguo, na mpoze haraka kwa vitambaa vilivyoloa maji na kumpepea.'
        },
        consequence: {
          en: 'Life saved: Emergency cooling prevents permanent brain damage and organ failure while professional medical care takes over.',
          sw: 'Maisha yanaokolewa: Kupoza mwili kwa dharura kunazuia uharibifu wa ubongo na figo wakati madaktari wakiwasili kutoa huduma.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Hot dry skin, confusion, and high body temperature indicate life-threatening heatstroke requiring immediate cooling and urgent hospitalization.',
          sw: 'Ngozi ya moto isiyo na jasho, kuchanganyikiwa, na joto kali la mwili ni dalili za kiharusi cha joto kinachohitaji kupozwa haraka na kupelekwa hospitali.'
        }
      },
      {
        id: 'm3-s1-opt2',
        text: {
          en: 'Force him to swallow several tablets of malaria medicine and leave him locked in the room to sleep.',
          sw: 'Kumlazimisha kumeza vidonge kadhaa vya dawa za malaria na kumfungia chumbani alale.'
        },
        consequence: {
          en: 'Fatal danger: High internal body temperature continues to rise; organ failure occurs rapidly in the unventilated room.',
          sw: 'Hatari ya kifo: Joto la ndani ya mwili linaendelea kupanda; viungo vya mwili vinashindwa kufanya kazi ndani ya chumba chenye joto kali.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Medication without diagnosis can be toxic, and leaving an overheated person in a hot room is fatal.',
          sw: 'Kumpa mtu dawa bila kupimwa kunaleta sumu, na kumuacha mtu mwenye joto kali chumbani kunasababisha kifo.'
        }
      },
      {
        id: 'm3-s1-opt3',
        text: {
          en: 'Force him to drink very hot strong tea with sugar to make him sweat.',
          sw: 'Kumlazimisha kunywa chai ya moto sana yenye sukari nyingi ili atoke jasho.'
        },
        consequence: {
          en: 'Critical risk: Hot liquids raise internal body heat further, and a confused person risks choking (aspiration) into lungs.',
          sw: 'Hatari kubwa: Vinywaji vya moto vinaongeza joto mwilini, na mtu anayechanganyikiwa anaweza kupaliwa na maji kuingia kwenye mapafu.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Never give hot liquids or force liquids into someone with altered mental status.',
          sw: 'Kamwe usimpe mtu kinywaji cha moto au kumlazimisha kunywa maji akiwa amepoteza fahamu au anachanganyikiwa.'
        }
      }
    ],
    reflection: {
      en: 'Who are the most vulnerable older persons, infants, or chronically ill neighbors living near you during extreme heat events?',
      sw: 'Ni nani wazee, watoto wachanga, au majirani wanaougua magonjwa sugu wanaoishi karibu nawe wakati wa mawimbi ya joto kali?'
    },
    takeaway: {
      en: 'Heatstroke is a medical emergency: cool the person immediately with wet cloths, shade, and fanning, and get emergency medical help.',
      sw: 'Kiharusi cha joto ni dharura ya kitabibu: mpoze mgonjwa mara moja kwa maji baridi, kivuli, na upepo, na umpeleke hospitali mara moja.'
    }
  },
  {
    id: 'm3-s2',
    moduleId: 'm3',
    title: {
      en: 'Adapting a Crowded Informal Nursery Classroom',
      sw: 'Kurekebisha Darasa la Chekechea Lililobanana Wakati wa Joto'
    },
    context: {
      en: 'Community school in Ruaraka. Tin-roof classroom with 45 young children aged 3-5.',
      sw: 'Shule ya jamii Ruaraka. Darasa la mabati lenye watoto wadogo 45 wa umri wa miaka 3-5.'
    },
    situation: {
      en: 'By 1:00 PM, the metal classroom is uncomfortably hot. Children are irritable, crying, refusing to eat, and several have nosebleeds and lethargy. There are no fans or air conditioners. How does the school team adapt the environment and schedule?',
      sw: 'Kufikia saa saba mchana, darasa la mabati lina joto kali sana. Watoto wanalia, wanakataa kula, na baadhi wanatoka damu puani na kuishiwa nguvu. Hakuna feni wala viyoyozi. Je, walimu wanapaswa kurekebisha vipi mazingira na ratiba?'
    },
    options: [
      {
        id: 'm3-s2-opt1',
        text: {
          en: 'Shift heavy learning activities to early mornings (8-11 AM), move afternoon rest to an outdoor shaded courtyard under trees, establish hourly water drinking breaks, and wet perimeter mats for evaporative cooling.',
          sw: 'Kuhamisha masomo magumu asubuhi mapema (saa 2-5 asubuhi), kuwapeleka watoto kupumzika mchana nje chini ya kivuli cha miti, kuweka ratiba ya kunywa maji kila saa, na kuloweka mikeka ya nje kupoza hewa.'
        },
        consequence: {
          en: 'Child safety maintained: Symptoms resolve, hydration improves, and learning happens when temperatures are tolerable.',
          sw: 'Usalama wa watoto unalindwa: Dalili za kuugua zinakoma, wanapata maji ya kutosha, na masomo yanafanyika wakati hewa ni shwari.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Adjusting schedules and utilizing natural outdoor tree shade protects young children whose smaller bodies overheat faster.',
          sw: 'Kurekebisha ratiba na kutumia kivuli cha miti kunalinda watoto wadogo ambao miili yao inapata joto haraka zaidi kuliko watu wazima.'
        }
      },
      {
        id: 'm3-s2-opt2',
        text: {
          en: 'Make the children run physical fitness drills under direct midday sun to "build physical endurance".',
          sw: 'Kuwafanya watoto wakimbie mazoezi magumu ya viungo chini ya jua kali la mchana ili "kujenga uvumilivu".'
        },
        consequence: {
          en: 'Dangerous outcome: Severe heat exhaustion and dehydration with multiple children collapsing.',
          sw: 'Matokeo hatari: Watoto kadhaa wanazimia kwa upungufu mkubwa wa maji na mshtuko wa joto kali.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Strenuous exercise in high heat without cooling can be fatal for young children.',
          sw: 'Mazoezi magumu kwenye joto kali bila maji yanaweza kuua watoto wadogo.'
        }
      },
      {
        id: 'm3-s2-opt3',
        text: {
          en: 'Close all classroom windows to keep hot outside air from coming in, and withhold water to avoid bathroom trips.',
          sw: 'Kufunga madirisha yote kuzuia hewa ya nje, na kuwanyima watoto maji ili wasiende chooni mara kwa mara.'
        },
        consequence: {
          en: 'Severe hazard: Trap heat inside and cause acute kidney strain from severe dehydration.',
          sw: 'Hatari kubwa: Joto linakwama ndani na kusababisha figo za watoto kushindwa kufanya kazi kwa kukosa maji.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Withholding water during heat creates dangerous medical emergencies.',
          sw: 'Kunyima watoto maji wakati wa joto kali kunaleta dharura mbaya za kiafya.'
        }
      }
    ],
    reflection: {
      en: 'How can community schools and daycare centers in informal settlements be redesigned with shade trees and better ventilation?',
      sw: 'Je, shule za chekechea mitaani zinawezaje kuboreshwa kwa kupanda miti ya kivuli na madirisha yenye upepo?'
    },
    takeaway: {
      en: 'Protecting children from heat requires shifting schedules to cooler hours, active hydration, and utilizing natural outdoor shade.',
      sw: 'Kulinda watoto dhidi ya joto kunahitaji kubadilisha ratiba kuelekea asubuhi, kunywa maji mara kwa mara, na kupumzika chini ya miti.'
    }
  },

  // Module 4: Water Stress and Disease Prevention
  {
    id: 'm4-s1',
    moduleId: 'm4',
    title: {
      en: 'Managing Severe Water Rationing Without Contamination',
      sw: 'Kukabiliana na Mgao Mkali wa Maji Bila Kuchafua Maji'
    },
    context: {
      en: 'Mukuru kwa Njenga, during a 2-week tap rationing shutdown by municipal utilities.',
      sw: 'Mukuru kwa Njenga, wakati wa kukatika kwa mabomba ya maji kwa wiki mbili.'
    },
    situation: {
      en: 'The municipal piped water supply has been dry for 10 days. An informal bowser truck is selling water at 50 KES per 20-litre jerrycan. The water looks slightly murky and smells faintly of earth. Your family is down to its last two litres of drinking water. How do you handle this purchase safely?',
      sw: 'Mabomba ya maji ya kaunti yamekuwa makavu kwa siku 10. Lori la kibinafsi linauza maji kwa shilingi 50 kwa mtungi wa lita 20. Maji yanaonekana kuwa na ukungu kidogo na harufu ya udongo. Familia yako imebakisha lita mbili tu za maji. Je, unashughulikiaje ununuzi huu kwa usalama?'
    },
    options: [
      {
        id: 'm4-s1-opt1',
        text: {
          en: 'Buy what you need, let silt settle, decant clear water, treat with approved household water chlorine solution (following exact label dosage), wait 30 minutes, and store in a clean, covered, narrow-mouth container with a tap.',
          sw: 'Kununua unayohitaji, kuacha mchanga utulie chini, kutoa maji safi ya juu, kutibu kwa dawa ya klorini ya maji ya nyumbani iliyoidhinishwa (kufuata maelekezo kamili ya chupa), kusubiri dakika 30, na kuhifadhi kwenye dumu safi lenye mfuniko na mfereji.'
        },
        consequence: {
          en: 'Safe drinking water: Pathogens eliminated, chlorine residual protects against recontamination, family avoids typhoid/cholera.',
          sw: 'Maji salama ya kunywa: Vijidudu vinauawa, dawa inalinda maji yasichafuliwe tena, na familia inaepuka homa ya matumbo na kipindupindu.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Chlorination with proper contact time and safe storage makes questionable urban water safe for consumption.',
          sw: 'Kutumia dawa sahihi ya klorini kwa muda unaofaa na kuhifadhi kwenye chombo safi chenye mfuniko kunafanya maji yawe salama kabisa.'
        }
      },
      {
        id: 'm4-s1-opt2',
        text: {
          en: 'Drink the murky water directly to save money on water treatment products.',
          sw: 'Kunywa maji hayo yenye ukungu moja kwa moja bila kutibu ili kuokoa fedha za dawa.'
        },
        consequence: {
          en: 'Severe waterborne disease: High probability of acute bacterial gastroenteritis and severe dehydration.',
          sw: 'Ugonjwa hatari wa maji: Uwezekano mkubwa wa kuambukizwa bakteria ya kuhara damu na kupoteza maji mwilini.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Untreated water from unknown vendors in informal areas is a major vector for cholera and dysentery.',
          sw: 'Maji yasiyotibiwa kutoka kwa wachuuzi wasiojulikana ndicho chanzo kikuu cha mlipuko wa kipindupindu mitaani.'
        }
      },
      {
        id: 'm4-s1-opt3',
        text: {
          en: 'Pour a whole cup of concentrated laundry bleaching detergent into the jerrycan without measuring.',
          sw: 'Kumwaga kikombe kizima cha dawa kali ya kufulia nguo ndani ya mtungi bila kupima.'
        },
        consequence: {
          en: 'Chemical poisoning: Industrial laundry bleach can cause severe chemical burns to throat and stomach.',
          sw: 'Sumu ya kemikali: Dawa kali ya kufulia nguo inaweza kuunguza koo na tumbo na kusababisha madhara makubwa ya sumu.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Only use certified water-treatment products strictly following approved dosage guidelines, never industrial laundry bleaches.',
          sw: 'Tumia tu dawa zilizoidhinishwa za kutibu maji ya kunywa kulingana na vipimo rasmi, kamwe usitumie dawa kali za kufulia nguo.'
        }
      }
    ],
    reflection: {
      en: 'How much does your household spend on water during rationing periods compared to normal days, and who profits from water scarcity?',
      sw: 'Familia yako inatumia kiasi gani cha fedha kununua maji wakati wa mgao ikilinganishwa na siku za kawaida, na nani anayenufaika na uhaba huo?'
    },
    takeaway: {
      en: 'When relying on vendor water, settle sediment, treat with certified household chlorine following exact instructions, and store safely.',
      sw: 'Unaponunua maji ya wachuuzi, chuja mchanga, tibu kwa dawa sahihi iliyoidhinishwa ya klorini, na uhifadhi kwenye chombo chenye mfuniko.'
    }
  },
  {
    id: 'm4-s2',
    moduleId: 'm4',
    title: {
      en: 'Preventing Cholera Outbreak After Receding Floodwaters',
      sw: 'Kuzuia Mlipuko wa Kipindupindu Baada ya Mafuriko Kupungua'
    },
    context: {
      en: 'Ruaraka riverside settlement, 3 days after floodwaters have receded from homes and pit latrines.',
      sw: 'Makazi ya kando ya mto Ruaraka, siku 3 baada ya maji ya mafuriko kupungua kutoka kwenye nyumba na vyoo vya shimo.'
    },
    situation: {
      en: 'Floodwaters have receded, leaving slimy sludge covering compound walkways, well heads, and public water taps. Two children on your street have already been rushed to hospital with severe watery diarrhea. What action should the community health committee and youth take immediately?',
      sw: 'Maji ya mafuriko yamepungua, yakiacha matope machafu yenye kinyesi kwenye njia za makazi, visima vya maji, na mabomba ya umma. Watoto wawili mtaani tayari wamekimbizwa hospitalini wakiwa na ugonjwa mkali wa kuharisha maji. Kamati ya afya ya jamii na vijana wanapaswa kuchukua hatua gani mara moja?'
    },
    options: [
      {
        id: 'm4-s2-opt1',
        text: {
          en: 'Coordinate with the local Community Health Promoter (CHP): issue household water purification tablets, organize clean disinfection of shared taps with chlorine solution, promote strict handwashing with soap, and ensure immediate referral of any diarrhea cases for Oral Rehydration Salts (ORS).',
          sw: 'Kushirikiana na Mhudumu wa Afya wa Jamii (CHP): kugawa vidonge vya kutibu maji kwa kila nyumba, kusafisha mabomba ya umma kwa dawa ya klorini, kuhamasisha unawaji mikono kwa sabuni, na kuhakikisha wanaoharisha wanapewa chumvi ya ORS na kupelekwa hospitali mara moja.'
        },
        consequence: {
          en: 'Outbreak halted: Transmission chain is broken, children are protected, and clinical cases receive timely medical rehydration.',
          sw: 'Mlipuko unadhibitiwa: Njia ya maambukizi inakatwa, watoto wanalindwa, na wagonjwa wanapata huduma ya kuongezewa maji mwilini hospitalini.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Rapid household water chlorination, soap handwashing, and prompt ORS treatment are the proven public health defenses against cholera.',
          sw: 'Kutibu maji ya kunywa, kunawa mikono kwa sabuni, na kuwapa wagonjwa chumvi ya ORS ndio njia zilizothibitishwa kisayansi za kuzuia kipindupindu.'
        }
      },
      {
        id: 'm4-s2-opt2',
        text: {
          en: 'Tell everyone to keep drinking well water as long as it smells clean, and give sick children leftover antibiotic capsules.',
          sw: 'Kueleza kila mtu aendelee kunywa maji ya kisima maadamu hayana harufu mbaya, na kuwapa watoto wagonjwa mabaki ya vidonge vya antibiotic.'
        },
        consequence: {
          en: 'Catastrophic spread: Contaminated groundwater infects dozens more families; improper antibiotics cause drug resistance.',
          sw: 'Maambukizi makubwa: Maji ya ardhini yaliyochafuliwa yanaambukiza familia nyingi zaidi; dawa za kiholela zinaleta usugu wa bakteria.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Clear-looking water can harbor millions of deadly cholera bacteria; antibiotics must never be administered without prescription.',
          sw: 'Maji yanayoonekana masafi yanaweza kuwa na mamilioni ya bakteria ya kipindupindu; dawa za antibiotic hazipaswi kumezwa bila maagizo ya daktari.'
        }
      },
      {
        id: 'm4-s2-opt3',
        text: {
          en: 'Hide the cases from health authorities to avoid "bad reputation" for the neighborhood.',
          sw: 'Kuficha taarifa za wagonjwa wasijulikane na maafisa wa afya ili kulinda "sifa ya mtaa".'
        },
        consequence: {
          en: 'Fatal delay: Untreated cholera can kill within hours; silent spread causes preventable neighborhood deaths.',
          sw: 'Kuchelewa kunakoleta vifo: Kipindupindu kisipotibiwa kinaweza kuua ndani ya saa chache; kuficha taarifa kunaleta vifo vinavyoweza kuzuilika.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Early notification of public health authorities triggers life-saving emergency medical support and clean water supplies.',
          sw: 'Kutoa taarifa mapema kwa maafisa wa afya kunaleta msaada wa dharura wa matibabu na ugawaji wa maji safi ya kuokoa maisha.'
        }
      }
    ],
    reflection: {
      en: 'Who is the official Community Health Promoter (CHP) assigned to your village, and how can youth support their disease surveillance work?',
      sw: 'Ni nani Mhudumu wa Afya wa Jamii (CHP) anayehudumia kijiji chenu, na vijana wanawezaje kusaidia kazi yake ya kufuatilia magonjwa?'
    },
    takeaway: {
      en: 'Post-flood disease prevention requires universal water chlorination, soap handwashing, and immediate referral for Oral Rehydration Salts.',
      sw: 'Kuzuia magonjwa baada ya mafuriko kunahitaji kutibu maji yote ya kunywa, kunawa mikono kwa sabuni, na kutoa chumvi ya ORS mara moja.'
    }
  },

  // Module 5: Climate Justice
  {
    id: 'm5-s1',
    moduleId: 'm5',
    title: {
      en: 'Evaluating a Private Wall that Deflects Floodwaters',
      sw: 'Kutathmini Ukuta wa Kibinafsi Unaochepusha Mafuriko Mtaani'
    },
    context: {
      en: 'Boundary between an industrial park and an informal settlement in Mukuru.',
      sw: 'Mpaka kati ya eneo la viwanda na makazi yasiyo rasmi ya Mukuru.'
    },
    situation: {
      en: 'A private logistics company has built a 3-meter reinforced concrete boundary wall to protect its warehouse compound from floodwaters. However, the wall blocks the natural overland stormwater exit route, funneling surging floodwaters directly into 50 informal settlement houses on the other side. The community is outraged. What is the most effective and lawful climate justice response?',
      sw: 'Kampuni ya ghala za mizigo imejenga ukuta mrefu wa zege wa mita 3 kulinda mali zake dhidi ya mafuriko. Hata hivyo, ukuta huo umeziba njia ya asili ya maji ya dhoruba, na kuelekeza mafuriko yote moja kwa moja kwenye nyumba 50 za mabanda upande wa pili. Jamii ina hasira kali. Ni ipi hatua sahihi na yenye ufanisi zaidi ya haki ya tabianchi?'
    },
    options: [
      {
        id: 'm5-s1-opt1',
        text: {
          en: 'Organize affected residents, document flood damage with photographs and timestamps, file an urgent complaint with NEMA and the County Sub-County Environment Officer, and cite Environmental Management and Co-ordination Act (EMCA) regulations against blocking natural waterways.',
          sw: 'Kuwaunganisha wakaazi walioathirika, kurekodi uharibifu wa mafuriko kwa picha na tarehe, kuwasilisha malalamiko ya haraka kwa NEMA na Afisa wa Mazingira wa Kaunti, na kutaja sheria ya EMCA inayokataza kuzuia mikondo ya asili ya maji.'
        },
        consequence: {
          en: 'Lawful enforcement: NEMA inspects the site, issues an Environmental Restoration Order requiring the company to construct an underground culvert bypass.',
          sw: 'Utekelezaji wa kisheria: NEMA inakagua eneo, inatoa Amri ya Kurejesha Mazingira inayolazimisha kampuni kujenga mtaro mkubwa wa chini ya ardhi wa kupitisha maji.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Under EMCA Section 3, every person has a right to a clean and healthy environment; altering natural drainage to harm neighbors is an actionable offense.',
          sw: 'Chini ya Kifungu cha 3 cha EMCA, kila mtu ana haki ya mazingira safi; kugeuza njia ya asili ya maji kuumiza majirani ni kosa linaloadhibiwa kisheria.'
        }
      },
      {
        id: 'm5-s1-opt2',
        text: {
          en: 'Lead a midnight mob with sledgehammers to violently smash down the factory wall.',
          sw: 'Kuongoza kundi la watu usiku wakiwa na nyundo kubwa kubomoa ukuta wa kiwanda kwa fujo.'
        },
        consequence: {
          en: 'Severe danger: Security guards fire live ammunition or tear gas; youth face criminal prosecution, diverting attention from the underlying injustice.',
          sw: 'Hatari ya maisha: Walinzi wanatumia risasi au gesi ya machozi; vijana wanakamatwa na kufunguliwa mashtaka, na suala la msingi la mazingira linapotea.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Destruction of property leads to criminal arrest, physical injury, and loses public sympathy and legal leverage.',
          sw: 'Uharibifu wa mali unaleta kukamatwa, majeraha, na kupoteza nguvu ya kisheria na huruma ya jamii.'
        }
      },
      {
        id: 'm5-s1-opt3',
        text: {
          en: 'Tell neighbors that nothing can be done because big companies always win and the poor have no rights.',
          sw: 'Kueleza majirani kuwa hakuna la kufanya kwa sababu makampuni makubwa hushinda kila wakati na maskini hawana haki.'
        },
        consequence: {
          en: 'Continued devastation: Homes continue to flood every rainy season, deepening poverty and despair.',
          sw: 'Uharibifu unaendelea: Nyumba zinaendelea kujaa maji kila msimu wa mvua, jambo linalozidisha umaskini na kukata tamaa.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Apathy surrenders constitutional rights; organized communities utilizing legal institutions have successfully held corporate polluters accountable.',
          sw: 'Kukata tamaa kunapoteza haki za kikatiba; jamii zilizojipanga zikitumia sheria zimefanikiwa kuwawajibisha wenye viwanda mara nyingi.'
        }
      }
    ],
    reflection: {
      en: 'How can informal settlement associations build alliances with public interest legal organizations (like Katiba Institute or Kituo cha Sheria) to protect their rights?',
      sw: 'Je, mashirika ya mitaa ya mabanda yanawezaje kushirikiana na watetezi wa sheria za haki (kama Katiba Institute au Kituo cha Sheria) kulinda haki zao?'
    },
    takeaway: {
      en: 'Climate justice uses documented evidence, collective voice, and statutory regulatory powers (NEMA, EMCA) to stop unjust maladaptation.',
      sw: 'Haki ya tabianchi inatumia ushahidi, sauti ya pamoja, na sheria za mazingira (NEMA, EMCA) kuzuia miradi inayodhulumu jamii.'
    }
  },
  {
    id: 'm5-s2',
    moduleId: 'm5',
    title: {
      en: 'Allocating Ward Climate Finance: Mitigation vs Adaptation',
      sw: 'Kugawa Bajeti ya Tabianchi ya Wadi: Kupunguza Uzalishaji dhidi ya Kukabiliana'
    },
    context: {
      en: 'Ward Public Participation Forum on Climate Resilience Grants, Mathare.',
      sw: 'Kongamano la Ushiriki wa Umma la Wadi kuhusu Ruzuku ya Ustahimilivu wa Tabianchi, Mathare.'
    },
    situation: {
      en: 'Your ward has been granted 8,000,000 KES from the County Climate Change Fund. Two proposals are competing for the full budget: Proposal A wants to install 100 ornamental solar street lamps along the main commercial road (Mitigation). Proposal B wants to build reinforced concrete storm drainage culverts, install 4 emergency flood footbridges, and provide 10 rainwater harvesting tanks for schools (Adaptation). How do youth representatives argue the case through a climate justice lens?',
      sw: 'Wadi yenu imetengewa shilingi 8,000,000 kutoka Mfuko wa Mabadiliko ya Tabianchi wa Kaunti. Miradi miwili inashindania fedha hizo zote: Pendekezo A linataka kuweka taa 100 za sola za urembo kando ya barabara kuu (Kupunguza Hewa Chafu). Pendekezo B linataka kujenga mitaro mikubwa ya zege ya kuzuia mafuriko, madaraja 4 ya dharura ya watembea kwa miguu, na matangi 10 ya maji ya shule (Kukabiliana na Majanga). Wawakilishi wa vijana wanapaswa kutetea lipi kupitia mtazamo wa haki ya tabianchi?'
    },
    options: [
      {
        id: 'm5-s2-opt1',
        text: {
          en: 'Advocate strongly for Proposal B (Adaptation & Resilience): explain that informal residents produce almost no emissions, but suffer life-threatening floods every year; adaptation funds must protect human survival first.',
          sw: 'Kutetea kwa nguvu Pendekezo B (Kukabiliana na Ustahimilivu): kueleza kuwa wakaazi hawazalishi hewa chafu lakini wanakabiliwa na mafuriko yanayoua kila mwaka; fedha lazima zilinde maisha ya binadamu kwanza.'
        },
        consequence: {
          en: 'Equitable allocation: Budget funds storm drainage and bridges, saving lives and school access during the next heavy rains.',
          sw: 'Mgawanyo wa haki: Bajeti inafadhili mitaro na madaraja, kuokoa maisha ya watu na kuwawezesha watoto kufika shuleni mvua zikija.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Climate justice prioritizes adaptation and basic survival protection for frontline communities who did not cause global emissions.',
          sw: 'Haki ya tabianchi inaweka kipaumbele katika kulinda uhai na maisha ya jamii zilizo hatarini ambazo hazikuchafua mazingira duniani.'
        }
      },
      {
        id: 'm5-s2-opt2',
        text: {
          en: 'Support Proposal A exclusively because solar lights look modern and make the neighborhood look wealthy in photographs.',
          sw: 'Kuunga mkono Pendekezo A pekee kwa sababu taa za sola zinaonekana za kisasa na zitafanya mtaa uonekane wa kitajiri kwenye picha.'
        },
        consequence: {
          en: 'Misaligned priority: Flash floods continue washing away homes under the shiny solar lamps.',
          sw: 'Kukosa vipaumbele: Mafuriko ya ghafla yanaendelea kusomba nyumba chini ya mwanga wa taa za sola.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Superficial green aesthetics without addressing core vulnerability leaves communities defenseless against climate disasters.',
          sw: 'Urembo wa nje wa vitu vya kijani bila kutatua changamoto za dharura za mafuriko unaiacha jamii bila ulinzi.'
        }
      },
      {
        id: 'm5-s2-opt3',
        text: {
          en: 'Demand that the entire 8 million KES be distributed as one-off cash handouts to all youth without building any infrastructure.',
          sw: 'Kudai kuwa shilingi milioni 8 zote zigawanywe kama pesa taslimu mfukoni kwa vijana bila kujenga miundombinu yoyote.'
        },
        consequence: {
          en: 'Wasted opportunity: Funds are spent within days; no durable protection against future floods is created.',
          sw: 'Kupoteza nafasi: Fedha zinamalizika ndani ya siku chache; hakuna ulinzi wowote wa kudumu unaojengwa kwa ajili ya mafuriko.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Climate funds must build lasting community resilience and public infrastructure rather than temporary consumption.',
          sw: 'Fedha za tabianchi lazima zijenge ustahimilivu wa kudumu wa miundombinu ya umma badala ya kutumika mara moja na kuisha.'
        }
      }
    ],
    reflection: {
      en: 'How can young people in your ward influence the County Climate Change Planning Committee during annual budget approvals?',
      sw: 'Je, vijana katika wadi yenu wanawezaje kushawishi Kamati ya Mipango ya Tabianchi ya Kaunti wakati wa kuidhinisha bajeti za mwaka?'
    },
    takeaway: {
      en: 'Frontline urban communities must prioritize climate adaptation and basic resilience infrastructure over aesthetic projects.',
      sw: 'Jamii zilizo hatarini lazima zipe kipaumbele miundombinu ya kuokoa maisha na kukabiliana na majanga kabla ya miradi ya urembo.'
    }
  },

  // Module 6: Green Claims and Greenwashing
  {
    id: 'm6-s1',
    moduleId: 'm6',
    title: {
      en: 'Investigating a Fictional "100% Bio-Plastic Water Bottle"',
      sw: 'Kuchunguza Chupa ya Maji ya Kubuniwa ya "100% Bio-Plastiki"'
    },
    context: {
      en: 'Retail shop in Kibera. New bottled beverage brand heavily advertised on radio and TikTok.',
      sw: 'Duka la reja reja Kibera. Kinywaji kipya cha chupa kinachotangazwa sana redioni na TikTok.'
    },
    situation: {
      en: 'A commercial beverage company launches "Afya Eco-Water", charging 30% more per bottle. The label displays bright green leaves, a drawing of a turtle, and claims: "100% Eco-Safe, Bio-Plastic, Completely Harmless to Nature!" However, the small print on the back shows standard PET resin code 1 with no mention of composting conditions or third-party audits. As a youth climate advocate, how do you analyze this claim?',
      sw: 'Kampuni ya vinywaji inazindua "Afya Eco-Water", ikitoza bei ya juu kwa 30%. Lebo ina picha za majani mabichi, mchoro wa kobe, na maneno: "100% Salama kwa Mazingira, Bio-Plastiki, Haina Madhara Yoyote!". Hata hivyo, maandishi madogo nyuma yanaonyesha alama ya kawaida ya plastiki ya PET namba 1 bila maelezo ya namna inavyooza wala ukaguzi huru. Kama mtetezi wa vijana wa mazingira, unachambuaje dai hili?'
    },
    options: [
      {
        id: 'm6-s1-opt1',
        text: {
          en: 'Identify this as classic Greenwashing (vague buzzwords, misleading nature imagery, false bio-degradable claims): standard PET code 1 is petroleum-based plastic that takes centuries to degrade in Nairobi rivers.',
          sw: 'Kutambua hili kama Upotoshaji wa Mazingira (Greenwashing - maneno yasiyo wazi, picha za kudanganya, na madai ya uongo ya kuoza): plastiki ya PET namba 1 inatokana na mafuta ya petroli na inachukua karne nyingi kuoza mitoni.'
        },
        consequence: {
          en: 'Consumer awareness: You educate peers not to waste extra money on false marketing; file an inquiry with Competition Authority of Kenya (CAK).',
          sw: 'Uelewa wa walaji: Unaelimisha wenzako kutolipa fedha za ziada kwa uongo wa matangazo; unawasilisha swali kwa Mamlaka ya Ushindani ya Kenya (CAK).'
        },
        isRecommended: true,
        reasoning: {
          en: 'Claiming standard PET petroleum plastic is "bio-plastic" and "completely harmless" is illegal deceptive advertising under Kenya Consumer Protection laws.',
          sw: 'Kudai plastiki ya kawaida ya PET kuwa ni bio-plastiki inayooza ni udanganyifu wa kibiashara uliopigwa marufuku na sheria za Kenya.'
        }
      },
      {
        id: 'm6-s1-opt2',
        text: {
          en: 'Believe the label because drawing a turtle on packaging proves the company cares deeply about wildlife.',
          sw: 'Kuamini lebo hiyo kwa sababu kuchora picha ya kobe kunathibitisha kuwa kampuni inajali sana wanyamapori.'
        },
        consequence: {
          en: 'Deception persists: Consumers pay inflated prices while plastic pollution continues clogging Nairobi storm drains.',
          sw: 'Ulaghai unaendelea: Wanunuzi wanalipa bei ghali huku chupa za plastiki zikiendelea kuziba mifereji ya Nairobi.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Animal illustrations and green colors are marketing graphics, not verified environmental proof.',
          sw: 'Michoro ya wanyama na rangi za kijani ni picha za kibiashara tu, si ushahidi uliothibitishwa wa mazingira.'
        }
      },
      {
        id: 'm6-s1-opt3',
        text: {
          en: 'Throw the empty bottle into your vegetable garden assuming it will turn into soil within two days.',
          sw: 'Kutupa chupa tupu ndani ya bustani yako ya mboga ukidhani itageuka kuwa mchanga ndani ya siku mbili.'
        },
        consequence: {
          en: 'Soil contamination: The bottle remains unchanged for decades, shedding microplastics into vegetable roots.',
          sw: 'Uchafuzi wa udongo: Chupa inabaki bila kuoza kwa miongo mingi, ikimwaga vipande vidogo vya plastiki kwenye mizizi ya mboga.'
        },
        isRecommended: false,
        reasoning: {
          en: 'PET plastic does not biodegrade in garden soil; deceptive labels can lead consumers to pollute agricultural land.',
          sw: 'Plastiki ya PET haiozi kwenye udongo wa bustani; matangazo ya uongo yanaweza kufanya watu wachafue ardhi ya kilimo.'
        }
      }
    ],
    reflection: {
      en: 'What consumer goods in your local kiosk use green imagery or eco-friendly slogans without verifiable evidence?',
      sw: 'Ni bidhaa gani za dukani mtaani kwenu zinazotumia michoro ya kijani au maneno ya mazingira bila ushahidi wowote?'
    },
    takeaway: {
      en: 'Check resin codes, look for third-party certifications (KEBS, ISO), and reject unregulated marketing buzzwords like "eco-safe".',
      sw: 'Kagua nambari za plastiki, tafuta lebo rasmi za ukaguzi huru (KEBS, ISO), na ukatae maneno ya kibiashara yasiyo na maana.'
    }
  },
  {
    id: 'm6-s2',
    moduleId: 'm6',
    title: {
      en: 'Evaluating an Airline’s "Carbon-Neutral Flight" Ticket Option',
      sw: 'Kutathmini Tiketi ya Ndege Inayodai "Safari Isiyo na Kaboni"'
    },
    context: {
      en: 'University climate club seminar discussing corporate carbon accounting.',
      sw: 'Kongamano la kikundi cha tabianchi chuo kikuu likijadili mahesabu ya kaboni ya makampuni.'
    },
    situation: {
      en: 'An international airline promotes: "Fly 100% Carbon Neutral to Nairobi! Add only 450 KES to your ticket, and we will plant 2 trees in an offset project to cancel out your flight emissions completely." Club members are divided on whether this makes the flight truly sustainable. How do you lead an evidence-based assessment of this claim?',
      sw: 'Shirika la ndege linatangaza: "Safiri Bila Kaboni Kuelekea Nairobi! Ongeza shilingi 450 tu kwenye tiketi, nasi tutapanda miti 2 kufuta kabisa hewa chafu ya safari yako." Wanachama wamegawanyika iwapo safari hiyo inatunza mazingira kweli. Unaongozaje uchambuzi huu kwa kutumia ushahidi?'
    },
    options: [
      {
        id: 'm6-s2-opt1',
        text: {
          en: 'Explain that the flight burns tonnes of fossil jet fuel that immediately heats the atmosphere for decades; saplings take 20+ years to absorb equivalent carbon and face risks of drought or fire (permanence risk). Offsetting does not equal emissions reduction.',
          sw: 'Kueleza kwamba ndege inachoma tani za mafuta ya petroli yanayopasha anga joto mara moja kwa miongo mingi; miche ya miti inachukua zaidi ya miaka 20 kunyonya kaboni hiyo na inakabiliwa na ukame au moto. Fidia ya kaboni si sawa na kupunguza uzalishaji.'
        },
        consequence: {
          en: 'Critical climate literacy: Members understand the difference between actual decarbonization (sustainable fuels, reduced flying) and cheap accounting offsets.',
          sw: 'Uelewa wa kina: Wanachama wanaelewa tofauti kati ya kupunguza hewa chafu halisi na ujanja wa vyeti vya bei nafuu vya mahesabu.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Offsetting does not erase fossil emissions dumped into the atmosphere today; genuine climate action requires cutting absolute emissions at source.',
          sw: 'Fidia ya kaboni haifuti moshi uliokwisha kutolewa angani leo; hatua halisi inahitaji kusimamisha uzalishaji wa mafuta kwenye chanzo.'
        }
      },
      {
        id: 'm6-s2-opt2',
        text: {
          en: 'Agree that paying 450 KES makes flying perfectly green, so passengers should fly as often as possible without guilt.',
          sw: 'Kukubaliana kuwa kulipa shilingi 450 kunafanya ndege kuwa safi kabisa, hivyo watu wanapaswa kusafiri kwa ndege mara nyingi bila wasiwasi.'
        },
        consequence: {
          en: 'Perpetuated high emissions: Fossil fuel combustion accelerates while consumers are falsely reassured.',
          sw: 'Kuongezeka kwa hewa chafu: Uchomaji wa mafuta unazidi huku wananchi wakidanganywa kuwa wamesafisha mazingira.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Aviation is one of the most carbon-intensive human activities; nominal offset payments do not eliminate its severe warming impact.',
          sw: 'Usafiri wa ndege ni miongoni mwa shughuli zinazotoa hewa chafu zaidi; malipo madogo ya fidia hayamalizi athari zake.'
        }
      },
      {
        id: 'm6-s2-opt3',
        text: {
          en: 'Claim that planting trees in Africa causes global warming and should be completely banned.',
          sw: 'Kudai kuwa kupanda miti barani Afrika kunasababisha ongezeko la joto na kunapaswa kupigwa marufuku.'
        },
        consequence: {
          en: 'Misinformation: Legitimate ecological tree planting and indigenous agroforestry are discredited.',
          sw: 'Upotoshaji: Miradi halisi ya upandaji miti ya kijamii na uhifadhi wa asili inachafuliwa bila sababu.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Restoring forests has vital biodiversity and watershed benefits, but should not be misused as a corporate license to pollute.',
          sw: 'Kuhifadhi misitu kuna faida kubwa kwa vyanzo vya maji, lakini haipaswi kutumika kama leseni ya makampuni kuendelea kuchafua hewa.'
        }
      }
    ],
    reflection: {
      en: 'Why is it more difficult for corporations to actually cut their fossil fuel use than to buy cheap carbon credits?',
      sw: 'Kwa nini ni vigumu zaidi kwa mashirika kupunguza matumizi halisi ya mafuta machafu kuliko kununua vyeti vya bei nafuu vya kaboni?'
    },
    takeaway: {
      en: 'Real climate action requires direct reductions in fossil fuel use; offsets cannot substitute for stopping emissions at source.',
      sw: 'Hatua halisi ya tabianchi inahitaji kupunguza matumizi ya mafuta machafu moja kwa moja; fidia za karatasi haziwezi kuchukua nafasi ya upunguzaji halisi.'
    }
  },

  // Module 7: Safe Civic Participation
  {
    id: 'm7-s1',
    moduleId: 'm7',
    title: {
      en: 'Presenting a Memorandum at a County Budget Hearing',
      sw: 'Kuwasilisha Memorandum Katika Kikao cha Bajeti cha Kaunti'
    },
    context: {
      en: 'Nairobi County Assembly Public Participation on the Annual Development Plan (ADP), City Hall.',
      sw: 'Ushiriki wa Umma wa Bunge la Kaunti ya Nairobi kuhusu Mpango wa Maendeleo wa Mwaka (ADP), City Hall.'
    },
    situation: {
      en: 'Your youth environmental alliance has secured a 3-minute speaking slot before the County Assembly Committee on Water and Environment. The committee is deciding whether to allocate 15 million KES for expanding stormwater culverts in flood-prone informal settlements or reallocating the funds to office refurbishments. How do you make the most impactful, safe, and professional presentation?',
      sw: 'Muungano wenu wa vijana wa mazingira umepata nafasi ya dakika 3 kuzungumza mbele ya Kamati ya Bunge la Kaunti ya Maji na Mazingira. Kamati inaamua iwapo itatenga shilingi milioni 15 kupanua mifereji ya dhoruba kwenye makazi duni au kuhamishia fedha hizo kwenye ukarabati wa ofisi. Unawezaje kutoa uwasilishaji wenye mvuto mkubwa, salama, na wa kitaalamu?'
    },
    options: [
      {
        id: 'm7-s1-opt1',
        text: {
          en: 'Deliver a structured 3-minute presentation: 1. Introduce your group and ward; 2. State specific empirical evidence (homes flooded, clinic closures, GPS coordinates); 3. Reference Article 42 constitutional rights; 4. Hand 3 signed copies of your written memorandum to the Committee Clerk for the Hansard record.',
          sw: 'Kutoa uwasilishaji uliopangwa wa dakika 3: 1. Utambulisho wa kikundi na wadi; 2. Ushahidi maalum (nyumba zilizofurika, zahanati zilizofungwa, picha na ramani); 3. Kutaja haki za Kifungu cha 42 cha Katiba; 4. Kukabidhi nakala 3 zilizosainiwa za memorandum kwa Karani wa Kamati kwa kumbukumbu ya Hansard.'
        },
        consequence: {
          en: 'Policy victory: The committee formally adopts your recommendations into the budget report, protecting the 15M KES drainage allocation.',
          sw: 'Ushindi wa kisera: Kamati inajumuisha mapendekezo yenu kwenye ripoti rasmi ya bajeti, na kulinda mgao wa milioni 15 wa mifereji.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Evidence-backed submissions grounded in constitutional rights and formally entered into legislative records compel elected officials to act.',
          sw: 'Mawasilisho yenye ushahidi yanayosimamia haki za kikatiba na kuingizwa kwenye kumbukumbu za kisheria huwashurutisha viongozi kuwajibika.'
        }
      },
      {
        id: 'm7-s1-opt2',
        text: {
          en: 'Use your 3 minutes to shout insults at individual committee members and threaten to burn down the building if they do not listen.',
          sw: 'Kutumia dakika zako 3 kutukana wajumbe wa kamati na kutishia kuchoma jengo wasiposikiliza.'
        },
        consequence: {
          en: 'Arrest and expulsion: Serjeant-at-Arms removes you; criminal charges are filed; the drainage funding is canceled.',
          sw: 'Kukamatwa na kufukuzwa: Maafisa wa usalama wanakutoa nje; unafunguliwa mashtaka ya jinai; na fedha za mifereji zinafutwa.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Threats and insults violate parliamentary rules, derail legitimate community advocacy, and invite legal prosecution.',
          sw: 'Matukano na vitisho vinakiuka kanuni za bunge, vinaharibu utetezi halisi wa jamii, na vinaleta kufungwa jela.'
        }
      },
      {
        id: 'm7-s1-opt3',
        text: {
          en: 'Remain completely silent during your slot because you feel intimidated by the politicians in suits.',
          sw: 'Kukaa kimya kabisa wakati zamu yako inapofika kwa sababu ya kuogopa wanasiasa waliovalia suti.'
        },
        consequence: {
          en: 'Opportunity lost: The committee moves on, and funds are quietly transferred away from the informal settlement.',
          sw: 'Kupoteza nafasi: Kamati inaendelea na mambo mengine, na fedha zinahamishwa kimya kimya kutoka kwenye mtaa wenu.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Sovereignty belongs to the people under Article 1 of the Constitution; youth voices have equal legal standing in public hearings.',
          sw: 'Mamlaka yote ya nchi ni ya wananchi chini ya Kifungu cha 1 cha Katiba; sauti za vijana zina hadhi sawa ya kisheria kwenye mikutano ya umma.'
        }
      }
    ],
    reflection: {
      en: 'How can youth groups practice mock legislative presentations before appearing in front of real government committees?',
      sw: 'Je, vikundi vya vijana vinawezaje kufanya mazoezi ya kuwasilisha maoni kabla ya kufika mbele ya kamati halisi za serikali?'
    },
    takeaway: {
      en: 'Effective civic participation combines verified local data, constitutional rights, professional presentation, and formal written memoranda.',
      sw: 'Ushiriki bora wa kiraia unaunganisha ushahidi wa mtaa, haki za kikatiba, uwasilishaji wa heshima, na memoranda zilizoandikwa rasmi.'
    }
  },
  {
    id: 'm7-s2',
    moduleId: 'm7',
    title: {
      en: 'Halting Viral Disaster Misinformation on Community WhatsApp Groups',
      sw: 'Kuzuia Uvumi wa Majanga Unaoenea Kwenye Makundi ya WhatsApp ya Mtaa'
    },
    context: {
      en: 'Community neighborhood watch WhatsApp group with 450 members during heavy evening rain.',
      sw: 'Kikundi cha WhatsApp cha usalama wa mtaa chenye wanachama 450 wakati wa mvua kubwa ya jioni.'
    },
    situation: {
      en: 'At 8:30 PM, an excited member forwards a dramatic video showing a bridge collapse with people screaming, captioned: "Nairobi River has burst banks right now at Outer Ring bridge! 100 people swept away! Run for your lives!" Panic erupts, people start fleeing into the dark rain, risking traffic accidents. How do you intervene responsibly as an informed civic participant?',
      sw: 'Saa 2:30 usiku, mwanachama anatuma video ya kutisha inayoonyesha daraja likiporomoka na watu wakipiga kelele, ikiwa na maandishi: "Mto Nairobi umefurika hivi sasa daraja la Outer Ring! Watu 100 wamesombwa! Kimbieni kuokoa maisha yenu!". Hofu kubwa inatokea, watu wanaanza kukimbia gizani kwenye mvua, wakijiweka hatarini kugongwa na magari. Unaingiliaje kati kwa uwajibikaji kama mwananchi mwenye ufahamu?'
    },
    options: [
      {
        id: 'm7-s2-opt1',
        text: {
          en: 'Act immediately to de-escalate panic: 1. Take a screenshot of the video and run a Reverse Image Search; 2. Check official Kenya Red Cross (@KenyaRedCross) and KMD live bulletins; 3. Post a calm, clear correction with source link showing the video is from a 2018 event in another region; 4. Remind neighbors to stay indoors unless official local marshals advise evacuation.',
          sw: 'Kuchukua hatua mara moja kutuliza hofu: 1. Kupiga picha ya video hiyo na kuitafuta kwenye Google Reverse Image Search; 2. Kukagua taarifa rasmi za Shirika la Msalaba Mwekundu (@KenyaRedCross) na KMD; 3. Kutuma ujumbe wa uthibitisho wenye kiungo unaoonyesha video hiyo ni ya 2018 kutoka eneo lingine; 4. Kuwakumbusha majirani kubaki ndani salama isipokuwa tu viongozi wa mtaa wakitangaza kuhama.'
        },
        consequence: {
          en: 'Panic defused: Neighbors calm down, avoid dangerous nighttime flight into traffic, and community trust in verified information is strengthened.',
          sw: 'Hofu inatulia: Majirani wanatulia, wanaepuka kukimbia gizani barabarani, na uaminifu kwa taarifa zilizothibitishwa unaimarika.'
        },
        isRecommended: true,
        reasoning: {
          en: 'Fact-checking viral media against official emergency channels stops dangerous stampedes and misdirected emergency resources.',
          sw: 'Kuhakiki picha na video na kulinganisha na taarifa rasmi za uokoaji kunazuia mikanyagano ya hatari na hofu isiyo na msingi.'
        }
      },
      {
        id: 'm7-s2-opt2',
        text: {
          en: 'Forward the message to 15 other family and school WhatsApp groups immediately with extra exclamation marks to "spread awareness".',
          sw: 'Kusambaza ujumbe huo mara moja kwenye makundi mengine 15 ya familia na shule ukiwa na alama nyingi za mshangao ili "kueneza tahadhari".'
        },
        consequence: {
          en: 'Mass panic amplified: Emergency call lines are jammed with false alarms while real distress calls cannot get through.',
          sw: 'Kukuza hofu mjini kote: Nambari za simu za dharura zinazidiwa na simu za uongo huku watu walio katika hatari ya kweli wakikosa msaada.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Unverified forwarding fuels mass hysteria and obstructs genuine emergency response operations.',
          sw: 'Kusambaza habari bila kuhakiki kunaleta taharuki na kuzuia shughuli halisi za uokoaji.'
        }
      },
      {
        id: 'm7-s2-opt3',
        text: {
          en: 'Log off your phone and laugh at neighbors for being frightened.',
          sw: 'Kuzima simu yako na kuwacheka majirani kwa kuogopa.'
        },
        consequence: {
          en: 'Missed opportunity: Disinformation spreads unchecked, potentially causing physical injuries to vulnerable people running in the dark.',
          sw: 'Kupoteza wajibu: Uvumi unaendelea kusambaa, na unaweza kusababisha majeraha kwa watoto na wazee wanaokimbia usiku.'
        },
        isRecommended: false,
        reasoning: {
          en: 'Civic responsibility requires actively protecting community safety by halting misinformation with factual evidence.',
          sw: 'Uwajibikaji wa kiraia unahitaji kulinda usalama wa jamii kwa kusimamisha habari za uongo kwa kutumia ukweli na ushahidi.'
        }
      }
    ],
    reflection: {
      en: 'What ground rules can your neighborhood WhatsApp group establish to prevent the forwarding of unverified emergency alerts?',
      sw: 'Ni sheria gani ambazo kundi lenu la WhatsApp la mtaa linaweza kuweka ili kuzuia kusambaza tahadhari za dharura zisizothibitishwa?'
    },
    takeaway: {
      en: 'Responsible digital citizenship requires verifying dramatic alerts with official emergency authorities before sharing, preventing panic and harm.',
      sw: 'Uraia wa kidijitali unaowajibika unahitaji kuhakiki taarifa za majanga na mamlaka rasmi kabla ya kusambaza, kuzuia hofu na madhara.'
    }
  }
];
