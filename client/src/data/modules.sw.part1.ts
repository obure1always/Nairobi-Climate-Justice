import type { ModuleData } from './modules.en';

export const modules_sw_part1: ModuleData[] = [
  {
    id: 'm1',
    title: 'Hatari ya Hali ya Hewa Nairobi',
    description: 'Kuelewa tofauti ya hali ya hewa na tabianchi, athari ya chafu, kisiwa cha joto mjini, mabadiliko ya mvua, na jinsi hatari, mfiduo, na udhaifu vinavyounda hatari za kimazingira Nairobi.',
    image: '/images/nairobi_climate_risk_1790629624713.jpg',
    content: [
      {
        id: 'm1-l1',
        heading: 'Hali ya Hewa, Tabianchi, na Mabadiliko ya Tabianchi Afrika Mashariki',
        objectives: [
          'Kutofautisha hali ya hewa ya kila siku (weather) na tabianchi ya muda mrefu (climate).',
          'Kuelewa mabadiliko ya misimu katika nyanda za juu za ikweta za Afrika Mashariki.',
          'Kutambua mwelekeo wa mabadiliko ya tabianchi yanayoathiri Kenya kwa miongo kadhaa.'
        ],
        paragraphs: [
          'Hali ya hewa (weather) inaeleza hali ya angahewa kuhusu joto, unyevunyevu, upepo, na mvua inayotokea kwa muda mfupi wa saa chache au siku chache. Kwa mfano, dhoruba ya mvua inayonyesha alasiri moja Nairobi Magharibi ikifuatiwa na baridi jioni ni tukio la hali ya hewa la siku hiyo. Kinyume chake, tabianchi (climate) inawakilisha wastani na mifumo ya hali ya hewa iliyopimwa kwa kipindi kirefu cha angalau miaka thelathini. Kihistoria, Nairobi imekuwa na tabianchi ya nyanda za juu yenye joto la wastani na misimu miwili ya mvua: "Mvua Ndefu" kati ya Machi na Mei (MAM) na "Mvua Fupi" kati ya Oktoba na Desemba (OND).',
          'Mabadiliko ya tabianchi (climate change) yanarejelea mabadiliko ya kudumu na ya muda mrefu katika joto la dunia na mifumo ya hewa yanayosababishwa hasa na uzalishaji wa gesi chafu kutokana na shughuli za binadamu tangu mapinduzi ya viwanda. Katika Afrika Mashariki, rekodi za Idara ya Hali ya Hewa ya Kenya (KMD) zinaonyesha kupanda kwa wastani wa joto la mwaka na kutotabirika kwa mwanzo wa misimu ya mvua. Badala ya misimu ya kawaida, jamii zinakumbana na vipindi virefu vya kiangazi vinavyokatizwa na dhoruba kali za ghafla zinazozidi uwezo wa mifereji kwa dakika chache.',
          'Kutambua tofauti kati ya hali ya hewa na tabianchi ni muhimu kwa mipango salama ya jamii. Asubuhi moja ya baridi mwezi Julai haimaanishi kuwa ongezeko la joto duniani limesimama, kama vile wiki moja ya jua kali mwezi Aprili haithibitishi kuanza kwa ukame wa kudumu. Kukabiliana kwa ufanisi kunahitaji kuelewa mienendo ya miongo kadhaa badala ya kutegemea mabadiliko ya siku moja tu.'
        ],
        nairobiExample: 'Wafanyabiashara katika masoko ya Gikomba na Toi mara nyingi husimulia jinsi mwanzo wa mvua za Machi ulivyobadilika kwa wiki kadhaa mbele au nyuma, na kuharibu ratiba za usafirishaji wa mboga kutoka Kiambu na Machakos.',
        keyTerms: [
          { term: 'Hali ya Hewa (Weather)', definition: 'Hali ya angahewa ya kila siku kuhusu joto, unyevu, upepo, na mvua.' },
          { term: 'Tabianchi (Climate)', definition: 'Wastani wa takwimu za hali ya hewa kwa kipindi kirefu, kwa kawaida miaka 30.' },
          { term: 'Mabadiliko ya Misimu (Climate Variability)', definition: 'Mabadiliko ya kawaida ya msimu na mwaka kuzunguka wastani wa muda mrefu (k.m., El Niño na La Niña).' },
          { term: 'Mabadiliko ya Tabianchi (Climate Change)', definition: 'Mabadiliko ya kimfumo na ya muda mrefu ya joto na mifumo ya anga yanayoendeshwa na uzalishaji wa gesi chafu.' }
        ],
        takeaways: [
          'Hali ya hewa ni matukio ya leo; tabianchi ni wastani wa miaka 30.',
          'Nairobi ina misimu miwili mikuu ya mvua: Machi–Mei (ndefu) na Oktoba–Desemba (fupi).',
          'Afrika Mashariki inashuhudia ongezeko la joto na mwanzo usiotabirika wa mvua.',
          'Matukio ya siku moja ya hewa lazima yatazamwe ndani ya muktadha wa rekodi za miongo.'
        ],
        reflectionQuestion: 'Fikiria kuhusu hadithi ambazo wazee au majirani wanasimulia kuhusu hali ya hewa ya Nairobi miaka ishirini iliyopita. Ni mabadiliko gani ya msimu uliyoyashuhudia mtaani kwako?',
        activity: 'Weka kumbukumbu ya siku saba ya hali ya hewa ukifuatilia joto la asubuhi, mawingu, na mvua mtaani kwako. Linganisha rekodi yako na utabiri rasmi wa Idara ya Hali ya Hewa ya Kenya (KMD).',
        misconceptions: [
          { misconception: 'Wiki moja yenye baridi kali Nairobi inathibitisha kuwa ongezeko la joto duniani halipo.', correction: 'Vipindi vifupi vya baridi ni mabadiliko ya kawaida ya hali ya hewa ya kila siku; mabadiliko ya tabianchi yanathibitishwa na rekodi za wastani wa joto kwa miongo kadhaa.' }
        ],
        sources: [
          'Idara ya Hali ya Hewa ya Kenya (KMD) (meteo.go.ke)',
          'Ripoti ya Sita ya Tathmini ya IPCC (AR6), Kikundi cha Kazi II: Sura ya 9 (Afrika)'
        ]
      },
      {
        id: 'm1-l2',
        heading: 'Athari ya Chafu na Vichocheo vya Mijini vya Ongezeko la Joto',
        objectives: [
          'Kueleza mchakato wa asili na ule uliozidishwa wa athari ya chafu (greenhouse effect).',
          'Kutambua gesi chafu kuu zikiwemo kaboni dioksidi, methane, na nitrasi oksidi.',
          'Kuchunguza jinsi matumizi ya nishati, usafiri, na taka mijini yanavyochangia ongezeko la joto.'
        ],
        paragraphs: [
          'Athari ya asili ya chafu (greenhouse effect) ni mchakato wa angahewa unaofanya Dunia iweze kukaliwa na viumbe hai. Mionzi ya jua hupenya angahewa; sayari yetu hufyonza nishati hii na kuitoa tena kama mionzi ya joto (infrared). Gesi chafu—hasa kaboni dioksidi (CO2), mvuke wa maji, methane (CH4), na nitrasi oksidi (N2O)—hufyonza joto hili na kulirudisha ardhini, na kuifanya Dunia kuwa na joto la nyuzi 33 Selsiasi zaidi kuliko ingekuwa bila gesi hizo.',
          'Hata hivyo, shughuli za binadamu zimeongeza blanketi hili la gesi chafu. Uchomaji wa nishati ya kisukuku (petroli, dizeli, makaa ya mawe, gesi asilia), viwanda, ukataji miti, na taka za manispaa zinazooza hutoa mabilioni ya tani za gesi chafu kila mwaka. Hali hii inanasa joto la ziada duniani, na kupandisha joto la angahewa na bahari.',
          'Katika jiji la Nairobi, usafiri na taka ngumu za kikaboni ni vyanzo vikuu vya uzalishaji. Mamia ya maelfu ya magari binafsi, matatu, na malori yanayosafiri katika foleni kubwa hutoa CO2 na masizi meusi (black carbon). Wakati huo huo, taka za vyakula zinazooza katika madampo hutoa gesi ya methane, ambayo ina uwezo wa kunasa joto mara 28 zaidi ya kaboni dioksidi kwa kipindi cha miaka mia moja. Miji inazalisha gesi hizi na pia ndiyo inayoathirika zaidi na joto linalotokana nazo.'
        ],
        nairobiExample: 'Msongamano mkubwa wa magari kwenye Barabara ya Jogoo, Thika Superhighway, na Mombasa Road hufanya magari yanayosimama kutoa hewa chafu iliyokolea ya gesi na masizi katika anga ya Nairobi.',
        keyTerms: [
          { term: 'Athari ya Chafu (Greenhouse Effect)', definition: 'Mchakato wa asili ambapo gesi za angahewa hunasa joto na kuifanya Dunia kuwa na joto linalofaa uhai.' },
          { term: 'Athari Iliyozidishwa ya Chafu', definition: 'Ongezeko la joto linalosababishwa na binadamu kuongeza gesi chafu hewani kupita kiasi.' },
          { term: 'Methane (CH4)', definition: 'Gesi chafu yenye nguvu inayotokana na mifugo, uchimbaji mafuta, na kuoza kwa taka.' },
          { term: 'Masizi Meusi (Black Carbon)', definition: 'Chembechembe za moshi zinazotokana na uchomaji usio kamili wa dizeli na kuni zinazofyonza jua moja kwa moja.' }
        ],
        takeaways: [
          'Athari ya asili ya chafu inalinda uhai; ongezeko linalotokana na binadamu linasababisha hatari kubwa.',
          'CO2 na methane ndizo gesi kuu zinazoendesha ongezeko la joto duniani.',
          'Usafiri wa mijini, viwanda, na taka ni vyanzo vikuu vya hewa chafu Nairobi.',
          'Kupunguza foleni na kutenga taka za kikaboni hupunguza uchafuzi wa hewa na joto.'
        ],
        reflectionQuestion: 'Ni shughuli gani za kila siku mtaani kwako (kama usafiri, kupika kwa makaa au kuni, au uchomaji taka) zinazotoa gesi chafu au moshi?',
        activity: 'Chunguza njia za usafiri mtaani kwako. Hesabu ni watu wangapi wanaotembea kwa miguu, baiskeli, matatu, au magari binafsi kwa dakika 15 kwenye barabara kuu.',
        misconceptions: [
          { misconception: 'Athari ya chafu ni jambo baya kabisa linalopaswa kuondolewa kwa asilimia mia moja.', correction: 'Bila athari ya asili ya chafu, Dunia ingekuwa baridi mno kwa uhai wa binadamu kuwepo; ni lile ongezeko la ziada la binadamu ndilo hatari.' }
        ],
        sources: [
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050 (Hesabu ya Uzalishaji)',
          'Ripoti ya Pengo la Uzalishaji ya UNEP'
        ]
      },
      {
        id: 'm1-l3',
        heading: 'Kisiwa cha Joto Mjini Nairobi na Vifaa vya Ujenzi',
        objectives: [
          'Kufasili hali ya Kisiwa cha Joto Mjini (Urban Heat Island - UHI) na kanuni zake za kimaumbile.',
          'Kuchunguza jinsi saruji, lami, na mabati yanavyobadilisha joto la mazingira.',
          'Kuchambua kwa nini makazi yasiyo rasmi yanakabiliwa na msongo mkubwa wa joto.'
        ],
        paragraphs: [
          'Athari ya Kisiwa cha Joto Mjini (Urban Heat Island - UHI) hutokea wakati maeneo ya mijini yanapokuwa na joto la juu zaidi kuliko maeneo ya mashambani au yenye mimea yanayozunguka. Tofauti hii ya joto inasababishwa na ukweli kwamba maeneo ya asili—kama misitu, maeneo oevu, na nyasi—hupoza hewa kupitia kivuli na uvukizi wa mimea (evapotranspiration), wakati miundombinu ya mijini hufyonza, huhifadhi, na kutoa joto polepole.',
          'Katika jiji la Nairobi, hali hii inazidishwa na vifaa vinavyotumika kujenga. Majengo ya saruji, barabara za lami, na mabati ya kawaida yana uwezo mdogo wa kuakisi mionzi ya jua (albedo ndogo) na uwezo mkubwa wa kuhifadhi joto. Wakati wa mchana, nyuso hizi hufyonza jua kali. Baada ya jua kuzama, badala ya kupoa haraka, hutoa joto hilo lililohifadhiwa mitaani na ndani ya nyumba, na kuzuia hewa kupoa usiku.',
          'Muhimu zaidi, UHI haigawanyiki sawa Nairobi. Mitaa ya watu wenye mapato ya juu kama Karen, Muthaiga, na Lavington ina miti mingi mikubwa, bustani za kijani, na msongamano mdogo unaopunguza joto. Kinyume chake, makazi yasiyo rasmi yenye watu wengi kama Kibera, Mathare, na Ruaraka hayana miti, yana vichochoro vyembamba, na nyumba nyingi za mabati ambazo hufanya kazi kama tanuri, zikileta msongo mkubwa wa joto kwa wakazi.'
        ],
        nairobiExample: 'Picha za satelaiti za joto zinaonyesha tofauti ya joto ya nyuzi 4 hadi 7 Selsiasi kati ya misitu ya Karura na maeneo yenye msongamano mkubwa wa mabati huko Kibera.',
        keyTerms: [
          { term: 'Kisiwa cha Joto Mjini (UHI)', definition: 'Eneo la mjini lenye joto la juu zaidi kuliko maeneo ya mashambani yanayozunguka kutokana na miundombinu.' },
          { term: 'Albedo', definition: 'Kiwango cha mionzi ya jua inayoakisiwa na uso wa kitu, kutoka 0 (hufyonza yote) hadi 1 (huakisi yote).' },
          { term: 'Uhifadhi wa Joto (Thermal Mass)', definition: 'Uwezo wa nyenzo kama saruji au jiwe kuhifadhi na kutoa nishati ya joto polepole.' },
          { term: 'Uvukizi wa Mimea (Evapotranspiration)', definition: 'Mchakato ambapo mimea hutoa mvuke wa maji hewani kupitia majani, na kupoza mazingira.' }
        ],
        takeaways: [
          'Miji ina joto zaidi ya mashambani kwa sababu miundombinu migumu hufyonza na kuhifadhi mionzi ya jua.',
          'Mabati na lami huchemka haraka na kuendelea kutoa joto usiku kucha.',
          'Miti na maeneo ya kijani hufanya kazi kama viyoyozi vya asili vya mtaa.',
          'Makazi yasiyo rasmi yanabeba mzigo mkubwa zaidi wa joto kwa sababu ya uhaba wa miti na msongamano wa mabati.'
        ],
        reflectionQuestion: 'Joto linakuwaje ndani ya nyumba ya mabati saa nane mchana ikilinganishwa na kukaa chini ya mti mkubwa katika bustani au shuleni?',
        activity: 'Pima joto kwa mikono salama mchana wenye jua kali: gusa nyasi yenye kivuli, ukuta wa saruji, na bati lililopigwa na jua. Tambua tofauti ya joto kati ya nyuso hizo.',
        misconceptions: [
          { misconception: 'Joto liko sawa kila mahali katika jiji zima la Nairobi kwa siku moja.', correction: 'Hali ya joto inatofautiana sana kati ya mitaa kulingana na wingi wa miti, msongamano wa majengo, na vifaa vya ujenzi.' }
        ],
        sources: [
          'Stockholm Environment Institute (SEI) Afrika: Makazi Yasiyo Rasmi na Uthabiti wa Tabianchi Nairobi',
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050'
        ]
      },
      {
        id: 'm1-l4',
        heading: 'Mvua Zisizotabirika, Mvua Ndefu, na Kutotabirika kwa Tabianchi',
        objectives: [
          'Kuelewa mifumo ya mvua ya misimu miwili Nairobi na mambo yanayoiongoza.',
          'Kuchambua mienendo ya hivi karibuni ya mvua zisizotabirika na dhoruba za ghafla.',
          'Kuchunguza jinsi kutotabirika kwa mvua kunavyoathiri miundombinu na usalama wa chakula.'
        ],
        paragraphs: [
          'Mzunguko wa maji wa kila mwaka Nairobi unaendeshwa na miondoko ya Ukanda wa Mkutano wa Kitropiki (ITCZ), unaotengeneza misimu miwili ya mvua: Mvua Ndefu (Machi, Aprili, Mei) na Mvua Fupi (Oktoba, Novemba, Desemba). Kihistoria, wakulima wadogo wanaolisha Nairobi na mamlaka za maji walijua kwa uhakika lini mabwawa ya Ndakaini na Sasumua yatajaa maji.',
          'Katika miaka ya hivi karibuni, hali ya angahewa imekuwa isiyotabirika sana. Mifumo ya bahari kama Indian Ocean Dipole (IOD) na El Niño huungana na ongezeko la joto la dunia na kusababisha hali mbaya za hewa. Miaka mingine inashuhudia ukame mkubwa wa muda mrefu, wakati miaka mingine inaleta dhoruba kali zinazomwaga mvua ya mwezi mzima ndani ya saa sita tu.',
          'Kutotabirika huku kwa mvua kunatia shinikizo kubwa kwenye miundombinu ya Nairobi. Mifereji ya maji iliyotengenezwa kwa ajili ya mvua za kawaida inazidiwa haraka na dhoruba kali. Wakati mvua inapokosekana, uzalishaji wa umeme wa maji hupungua na mgao wa maji unaongezeka. Wakati mvua inaponyesha kwa fujo, mito huvunja kingo na barabara kusombwa. Kupanga chini ya tabianchi isiyotabirika kunahitaji mifumo thabiti na inayoweza kubadilika.'
        ],
        nairobiExample: 'Wakati wa mvua za Machi–Mei 2024, mvua kali za ghafla katika bonde la Mto Nairobi zilisababisha maji kufurika haraka katika makazi ya Kibra, Mathare, na Mukuru na kukatiza usafiri kwenye Barabara Kuu ya Uhuru.',
        keyTerms: [
          { term: 'Misimu Miwili ya Mvua (Bimodal Rainfall)', definition: 'Mfumo wa tabianchi wenye misimu miwili tofauti ya mvua ndani ya mwaka mmoja wa kalenda.' },
          { term: 'ITCZ', definition: 'Ukanda wa Mkutano wa Kitropiki ambapo pepo za kibiashara hukutana karibu na ikweta na kuleta mvua.' },
          { term: 'Indian Ocean Dipole (IOD)', definition: 'Mabadiliko ya joto la uso wa Bahari ya Hindi yanayoathiri sana mvua za Afrika Mashariki.' },
          { term: 'Dhoruba ya Ghafla (Cloudburst)', definition: 'Mvua kubwa sana inayonyesha kwa muda mfupi katika eneo dogo na kusababisha mafuriko ya haraka.' }
        ],
        takeaways: [
          'Nairobi inategemea Mvua Ndefu (MAM) na Mvua Fupi (OND) kwa maji ya mabwawa na kilimo.',
          'Mabadiliko ya tabianchi huongeza kutotabirika: ukame mkali unaofuatiwa na dhoruba za ghafla.',
          'Dhoruba fupi za fujo huzidisha mifereji haraka kuliko mvua za taratibu.',
          'Jamii lazima zijiandae kwa uhaba wa maji na hatari za mafuriko ya ghafla kwa wakati mmoja.'
        ],
        reflectionQuestion: 'Mvua kubwa ya ghafla au kiangazi kirefu kinaathirije bei za vyakula na upatikanaji wa maji katika soko lako la karibu?',
        activity: 'Soma utabiri wa hivi punde wa msimu kutoka Idara ya Hali ya Hewa ya Kenya. Andika utabiri wao kwa kaunti yako na jadili tahadhari zinazohitajika nyumbani.',
        misconceptions: [
          { misconception: 'Utabiri ukisema "mvua za wastani" inamaanisha mvua itanyesha kwa utulivu na kiasi sawa kila siku ya msimu.', correction: 'Wastani wa mvua unaweza kufikiwa kupitia dhoruba mbili tu za mafuriko makubwa zikitenganishwa na wiki za jua kavu.' }
        ],
        sources: [
          'Idara ya Hali ya Hewa ya Kenya (meteo.go.ke/our-products/seasonal-forecast/)',
          'Mpango wa Kitaifa wa Kukabiliana na Mabadiliko ya Tabianchi wa Kenya 2015–2030'
        ]
      },
      {
        id: 'm1-l5',
        heading: 'Kwa Nini Athari za Tabianchi Zinajiri Tofauti Mitaani',
        objectives: [
          'Kuchambua ukosefu wa usawa wa maeneo katika hatari za kimazingira Nairobi.',
          'Kuchunguza ushawishi wa sura ya nchi (topography), mabonde ya mito, na makazi yasiyo rasmi.',
          'Kutofautisha hatari za asili za kijiografia na udhaifu wa kimuundo uliotengenezwa na binadamu.'
        ],
        paragraphs: [
          'Hatari za tabianchi haziathiri wakazi wote wa Nairobi kwa usawa. Ingawa dhoruba ya mvua inanyesha katika jiji lote, madhara yake—kama vile nyumba kujaa maji, mali kusombwa, au kukatika kwa umeme—hutokea zaidi katika mitaa maalum. Tofauti hii inasababishwa na mchanganyiko wa umbo la ardhi (topography), historia ya upangaji miji, na uwekezaji wa kiuchumi.',
          'Kihistoria, upangaji wa miji wa kikoloni ulitenga maeneo ya juu yenye mteremko mzuri na udongo thabiti mwekundu wa volkano kwa ajili ya makazi ya Wazungu (leo hii Upper Hill, Westlands, na Karen). Maeneo ya chini ya mabonde ya mito na udongo wa mfinyanzi mweusi kando ya mito ya Nairobi, Ngong, na Mathare yalitengwa kama maeneo ya viwanda au kutelekezwa. Wakati Nairobi ilipokua kwa kasi bila nyumba za kutosha za bei nafuu, wafanyakazi wa kipato cha chini walijenga vibanda kando ya mito hii.',
          'Matokeo yake, mito inapofurika, makazi yaliyo karibu na kingo za mito ndiyo yanayoathirika kwanza. Zaidi ya hayo, makazi haya yanakosa mifereji ya kisasa, barabara za lami, na ukusanyaji wa taka wa manispaa. Mvua inayonyesha bila madhara katika bustani ya Kileleshwa inaweza kusababisha maafa ya maisha, kubomoka kwa kuta, na hatari za umeme huko Kibera au Ruaraka. Ukosefu wa usawa wa miundombinu unageuza matukio ya asili ya hewa kuwa majanga ya mtaani.'
        ],
        nairobiExample: 'Mto Ngong unaopita Kibera na Mto Nairobi unaopita Mathare uko chini ya mabonde ya mifereji, na kufanya nyumba zilizojengwa kingoni mwa mito kuwa za kwanza kujaa maji wakati wa mvua kubwa.',
        keyTerms: [
          { term: 'Ukosefu wa Usawa wa Maeneo (Spatial Inequality)', definition: 'Mgawanyo usio sawa wa huduma, rasilimali, na ubora wa mazingira katika maeneo tofauti ya kijiografia.' },
          { term: 'Ukanda wa Mto (Riparian Zone)', definition: 'Eneo la ardhi linalopakana moja kwa moja na mto au kijito ambalo hujaa maji kiasili mito inapofurika.' },
          { term: 'Sura ya Nchi (Topography)', definition: 'Mwinuko na maumbile ya asili ya ardhi kama milima, miinuko, na mabonde.' },
          { term: 'Udongo wa Mfinyanzi Mweusi (Black Cotton Soil)', definition: 'Udongo mzito unaotanuka sana ukipata maji na kusinyaa ukikauka, na kufanya misingi ya nyumba kuyumba.' }
        ],
        takeaways: [
          'Mvua inanyesha juu ya jiji zima, lakini maafa hupiga zaidi makazi ya mabondeni.',
          'Historia ya upangaji miji ilipeleka jamii za kipato cha chini kwenye maeneo ya hatari ya kingo za mito.',
          'Mitaa ya matajiri ina miti, mifereji bora, na ardhi inayonyonya maji kwa urahisi.',
          'Kutatua hatari za tabianchi kunahitaji kurekebisha miundombinu mitaani, si kutoa tahadhari tu.'
        ],
        reflectionQuestion: 'Tazama mtaa wako: Je, nyumba yako iko kwenye kilima, sehemu tambarare, au bondeni? Maji ya mvua hutiririka kuelekea wapi mvua ikinyesha?',
        activity: 'Chora mchoro rahisi wa mtiririko wa maji mtaani kwako. Onyesha mteremko wa ardhi, sehemu ambapo maji yanajaa madimbwi, na mahali mito au vijito vinapopita.',
        misconceptions: [
          { misconception: 'Watu wanaoishi karibu na mito yenye mafuriko wako pale kwa sababu hawajali usalama wao wa kibinafsi.', correction: 'Gharama kubwa za nyumba, umaskini, na hitaji la kuwa karibu na vibarua huwalazimu watu wengi kuishi katika maeneo hayo kwa ukosefu wa njia mbadala.' }
        ],
        sources: [
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050',
          'UN-Habitat: Tathmini ya Udhaifu wa Mabadiliko ya Tabianchi Nairobi'
        ]
      },
      {
        id: 'm1-l6',
        heading: 'Kupima Hatari ya Tabianchi: Hatari, Mfiduo, Udhaifu, na Uwezo',
        objectives: [
          'Kuelewa kanuni ya hatari ya maafa: Hatari = (Tukio × Mfiduo × Udhaifu) ÷ Uwezo.',
          'Kutofautisha matukio ya asili na udhaifu wa kijamii na kiuchumi.',
          'Kutambua uwezo wa mtu binafsi, jamii, na taasisi wa kukabiliana na majanga.'
        ],
        paragraphs: [
          'Ili kuunda mikakati madhubuti ya kukabiliana na mabadiliko ya tabianchi, watafiti, wapangaji miji, na viongozi wa jamii hutumia mfumo rasmi wa kutathmini hatari uliowekwa na Umoja wa Mataifa (UNDRR) na IPCC. Katika mfumo huu, hatari ya tabianchi siyo hali mbaya ya hewa pekee. Hatari inatokana na makutano ya vipengele vinne: Tukio la Hatari (Hazard), Mfiduo (Exposure), Udhaifu (Vulnerability), na Uwezo wa Kukabili (Capacity).',
          '**Tukio la Hatari (Hazard)** ni tukio hatari la kimaumbile—kama mafuriko ya ghafla, wimbi la joto kali, au ukame. **Mfiduo (Exposure)** inamaanisha watu, nyumba, shule, na mali zilizopo katika eneo linalofikiwa na tukio hilo. **Udhaifu (Vulnerability)** ni mazingira ya kimwili, kijamii, au kiuchumi yanayofanya watu wadhuriwe kwa urahisi—kama misingi dhaifu ya nyumba, umaskini, ukosefu wa maji safi, au magonjwa.',
          'Jambo la muhimu ni kwamba hatari inaweza kupunguzwa kupitia **Uwezo (Capacity)**—nguvu za pamoja, rasilimali, ujuzi, na mifumo ya jamii ya kutabiri, kukabiliana na kupona kutokana na mishtuko. Ingawa jamii haiwezi kuzuia dhoruba kubwa ya mvua peke yake, inaweza kupunguza mfiduo (kwa kutojenga mtoni), kupunguza udhaifu (kwa kulinda maji ya kunywa na kuinua milango), na kuongeza uwezo (kupitia vikundi vya tahadhari, usafishaji mifereji, na hazina za akiba za jamii). Haki ya tabianchi inalenga kuongeza uwezo wa wenyeji na kudai serikali ipunguze udhaifu wa kimfumo.'
        ],
        nairobiExample: 'Ruaraka, mafuriko ya ghafla (hazard) yanatishia nyumba zilizoko mita 5 kutoka mtoni (exposure). Nyumba za udongo na bati ni dhaifu (vulnerability), lakini vijana wenye kikundi cha tahadhari ya simu na magunia ya mchanga wana uwezo mkubwa (capacity) wa kupunguza hasara.',
        keyTerms: [
          { term: 'Tukio la Hatari (Hazard)', definition: 'Tukio la asili linaloweza kusababisha madhara, vifo, majeraha, au uharibifu wa mali na mazingira.' },
          { term: 'Mfiduo (Exposure)', definition: 'Kuwepo kwa watu, mali, au huduma katika eneo linaloweza kuathiriwa na tukio la hatari.' },
          { term: 'Udhaifu (Vulnerability)', definition: 'Hali zinazomfanya mtu au mfumo kuwa rahisi kudhuriwa na athari za tukio la hatari.' },
          { term: 'Uwezo wa Kukabili (Adaptive Capacity)', definition: 'Uwezo, ujuzi, na rasilimali za watu au jamii kujirekebisha na kupona kutokana na maafa.' }
        ],
        takeaways: [
          'Hatari = (Tukio la Hatari × Mfiduo × Udhaifu) ÷ Uwezo wa Kukabili.',
          'Majanga siyo ya asili pekee; hutokea wakati matukio ya asili yanapopiga mifumo dhaifu ya kibinadamu.',
          'Uwezo wa jamii, mpangilio, na maarifa ya wenyeji ni ngao madhubuti dhidi ya hatari za tabianchi.',
          'Uwekezaji wa serikali lazima ulenga kupunguza udhaifu na mfiduo wa jamii za chini.'
        ],
        reflectionQuestion: 'Fikiria tatizo la kimazingira lililotokea hivi karibuni mtaani kwako. Ni nini kilikuwa tukio, nani alikuwa kwenye mfiduo, ni nini kilileta udhaifu, na ni uwezo gani uliwasaidia kukabiliana nalo?',
        activity: 'Tumia Kanuni ya Hatari kuchambua shule, eneo la kazi, au ploti yako. Andika: Tukio 1 la hatari, vitu 2 vilivyopo kwenye mfiduo, mambo 2 ya udhaifu, na uwezo 2 ambao jamii yako inao.',
        misconceptions: [
          { misconception: 'Majanga yote ni "mipango ya Mungu" tu ambayo binadamu hawezi kubadilisha au kupunguza kwa vyovyote vile.', correction: 'Ingawa matukio ya hewa hutokea, maamuzi ya binadamu kuhusu ujenzi, mifereji, na usaidizi huamua iwapo tukio litakuwa janga kuu au la.' }
        ],
        sources: [
          'Istilahi za UNDRR kuhusu Upunguzaji wa Hatari za Majanga',
          'Muhtasari wa Watunga Sera wa Ripoti ya IPCC AR6 Kikundi cha Kazi II'
        ]
      }
    ],
    quiz: [
      {
        id: 'm1-q1',
        question: 'Kuna tofauti gani ya kimsingi kati ya hali ya hewa (weather) na tabianchi (climate)?',
        options: [
          'Hali ya hewa inapimwa Nairobi pekee, wakati tabianchi inapimwa duniani kote.',
          'Hali ya hewa inaonyesha hali ya angahewa ya muda mfupi, wakati tabianchi ni wastani wa mifumo kwa miaka 30 au zaidi.',
          'Hali ya hewa inatabirika kila wakati, wakati tabianchi haibadiliki kamwe.',
          'Tabianchi inahusu mvua pekee, wakati hali ya hewa inahusu joto pekee.'
        ],
        correctAnswer: 1,
        explanation: 'Hali ya hewa inaeleza matukio ya kila siku ya angahewa, wakati tabianchi inawakilisha wastani wa takwimu za hewa kwa miaka 30 au zaidi.',
        difficulty: 'beginner',
        lessonRef: 'm1-l1',
        source: 'Idara ya Hali ya Hewa ya Kenya (KMD)'
      },
      {
        id: 'm1-q2',
        question: 'Ni misimu ipi miwili mikuu ya mvua inayoshuhudiwa jijini Nairobi kila mwaka?',
        options: [
          'Mvua inayonyesha mfululizo kuanzia Januari hadi Agosti.',
          'Mvua Ndefu (Machi–Mei) na Mvua Fupi (Oktoba–Desemba).',
          'Msimu mmoja tu wa mvua kati ya Julai na Septemba.',
          'Mvua inanyesha tu wakati wa likizo ya Desemba.'
        ],
        correctAnswer: 1,
        explanation: 'Nairobi ina misimu miwili ya mvua: Mvua Ndefu (Machi–Mei / MAM) na Mvua Fupi (Oktoba–Desemba / OND).',
        difficulty: 'beginner',
        lessonRef: 'm1-l1',
        source: 'Idara ya Hali ya Hewa ya Kenya (meteo.go.ke)'
      },
      {
        id: 'm1-q3',
        question: 'Kwa nini uzalishaji wa gesi chafu kama kaboni dioksidi na methane husababisha ongezeko la joto duniani?',
        options: [
          'Zinatengeneza mashimo makubwa yanayoruhusu jua hatari la angani kufika ardhini.',
          'Zinafyonza joto la mionzi ya infrared linalotoka ardhini na kulirudisha chini, zikinasa joto katika angahewa.',
          'Zinapunguza joto la mawingu na kusimamisha mvua zote za asili.',
          'Zinawasha moto hewani unaochoma angahewa.'
        ],
        correctAnswer: 1,
        explanation: 'Gesi chafu hufyonza mionzi ya joto inayotolewa na uso wa Dunia na kuirudisha pande zote, jambo linalonasa joto hewani.',
        difficulty: 'intermediate',
        lessonRef: 'm1-l2',
        source: 'IPCC AR6 Kikundi cha Kazi I'
      },
      {
        id: 'm1-q4',
        question: 'Ni sababu gani kuu ya kimaumbile inayosababisha athari ya Kisiwa cha Joto Mjini (UHI)?',
        options: [
          'Miji kuwa na miti mingi na kingo nyingi za mito kuliko mashambani.',
          'Saruji, lami, na mabati kufyonza na kuhifadhi joto badala ya kuliakisi au kupoza kwa uvukizi wa mimea.',
          'Wakazi wa mijini kutumia feni nyingi sana za umeme ndani ya nyumba.',
          'Jua kuwa karibu zaidi kijiografia na maghorofa ya jiji kuliko mabonde ya mashambani.'
        ],
        correctAnswer: 1,
        explanation: 'Vifaa vya ujenzi wa mijini (saruji, lami, mabati) vina albedo ndogo, hivyo hufyonza joto mchana na kulitoa polepole usiku.',
        difficulty: 'intermediate',
        lessonRef: 'm1-l3',
        source: 'Stockholm Environment Institute (SEI) Afrika'
      },
      {
        id: 'm1-q5',
        question: 'Kwa nini makazi yasiyo rasmi kama Kibera na Mathare yanashuhudia msongo mkubwa zaidi wa joto kuliko mitaa ya kijani kama Karen au Muthaiga?',
        options: [
          'Makazi yasiyo rasmi yana miti mingi zaidi na maziwa ya baridi.',
          'Msongamano mkubwa wa majengo, mabati meusi, na uhaba wa miti hutengeneza mazingira madogo yanayonasa joto kali.',
          'Mitaa ya kijani iko juu sana angani zaidi ya angahewa.',
          'Mabati huakisi asilimia 100 ya joto, na kufanya nyumba zigande kama barafu.'
        ],
        correctAnswer: 1,
        explanation: 'Nyumba za mabati zilizo banana hufyonza joto jingi bila uwepo wa miti inayotoa kivuli na kupoza hewa kiasili.',
        difficulty: 'intermediate',
        lessonRef: 'm1-l3',
        source: 'SEI Afrika: Makazi Yasiyo Rasmi na Uthabiti wa Tabianchi'
      },
      {
        id: 'm1-q6',
        question: 'Mabadiliko ya tabianchi yamebadilishaje mifumo ya mvua ya msimu jijini Nairobi?',
        options: [
          'Mvua imekuwa ya kiwango sawa kabisa kila siku ya mwaka mzima.',
          'Mvua haitabiriki, ikiwa na ucheleweshaji wa misimu, vipindi virefu vya ukame, na dhoruba kali za ghafla zinazozidi mifereji.',
          'Nairobi haina mvua tena hata tone moja katika mwezi wowote.',
          'Dhoruba hutokea tu asubuhi na mito haifuriki kamwe.'
        ],
        correctAnswer: 1,
        explanation: 'Mabadiliko ya tabianchi huleta kutotabirika: ukame mkali na dhoruba za ghafla za masaa machache zinazosababisha mafuriko.',
        difficulty: 'intermediate',
        lessonRef: 'm1-l4',
        source: 'Mpango wa Kitaifa wa Kukabiliana na Mabadiliko ya Tabianchi wa Kenya'
      },
      {
        id: 'm1-q7',
        question: 'Kwa nini makazi ya mabondeni mwa mito Nairobi hupata madhara makubwa ya mafuriko kuliko mitaa ya miinukoni?',
        options: [
          'Mawingu humwaga mvua kwenye mabonde pekee na kuruka miinuko.',
          'Maji ya mvua hutiririka kuelekea mabondeni kiasili, na makazi ya mabondeni yanakosa mifereji ya kutosha ya kisasa kutokana na ukosefu wa mipango miji ya kihistoria.',
          'Mitaa ya miinukoni imejengwa chini ya ardhi kabisa.',
          'Mito hutiririka kupanda milima wakati wa mvua.'
        ],
        correctAnswer: 1,
        explanation: 'Maji hutiririka mabondeni kiasili. Makazi ya kipato cha chini yaliyoko mabondeni yanakosa mifereji mikubwa, hivyo huathirika mara moja.',
        difficulty: 'intermediate',
        lessonRef: 'm1-l5',
        source: 'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050'
      },
      {
        id: 'm1-q8',
        question: 'Katika usimamizi wa hatari za maafa, ni kanuni ipi inayowakilisha hatari ya tabianchi kwa usahihi?',
        options: [
          'Hatari = Tukio la Hatari + Hali ya Hewa + Bahati',
          'Hatari = (Tukio la Hatari × Mfiduo × Udhaifu) ÷ Uwezo wa Kukabili',
          'Hatari = Joto ÷ Unyevu wa Hewa',
          'Hatari = Idadi ya Watu × Idadi ya Magari'
        ],
        correctAnswer: 1,
        explanation: 'Kulingana na UNDRR na IPCC, Hatari ya Maafa ni zao la Tukio, Mfiduo, na Udhaifu, ikigawanywa kwa Uwezo wa Jamii wa kukabili.',
        difficulty: 'advanced',
        lessonRef: 'm1-l6',
        source: 'Istilahi za UNDRR kuhusu Upunguzaji wa Hatari za Majanga'
      }
    ]
  },
  {
    id: 'm2',
    title: 'Mafuriko Mjini',
    description: 'Jifunze kanuni za mtiririko wa maji mijini, jinsi taka ngumu zinavyozidisha mafuriko, ramani za jamii za maeneo hatarishi, mipango ya dharura ya kaya, na usafi salama baada ya mafuriko.',
    image: '/images/urban_flooding_1790629636632.jpg',
    content: [
      {
        id: 'm2-l1',
        heading: 'Kanuni za Mafuriko ya Mijini: Tiririko, Mabonde ya Mito, na Ardhi Isiyonyonya Maji',
        objectives: [
          'Kuelewa jinsi mzunguko wa maji mijini unavyotofautiana na mazingira ya asili ya misitu.',
          'Kueleza dhana ya nyuso zisizopenya maji (impervious surfaces) na uzalishaji wa mtiririko wa maji.',
          'Kuchambua jinsi maji ya dhoruba yanavyotiririka kupitia mabonde ya asili ya mito ya Nairobi.'
        ],
        paragraphs: [
          'Katika msitu au uwanda wa nyasi wa asili, mvua inaponyesha, kati ya asilimia 80 hadi 90 ya maji huzama ardhini, kujaza chemchemi za chini ya ardhi na kufyonzwa na mizizi ya mimea. Sehemu ndogo tu ndiyo hutiririka juu ya ardhi kuelekea vijitoni. Katika jiji lenye majengo mengi kama Nairobi, uwiano huu wa asili wa maji umevurugika kabisa.',
          'Maendeleo ya mijini yanafunika ardhi ya asili kwa nyuso zisizopenya maji: barabara za lami, lami za saruji, majengo ya mawe, na mabati. Maji ya mvua hayawezi kuzama kwenye vifaa hivi vigumu. Badala yake, asilimia 80 hadi 90 ya mvua inabadilika mara moja kuwa mtiririko wa maji wa juu ya ardhi (surface runoff). Kwa sababu miji ina njia laini za barabara, mtiririko huu huongezeka kasi sana na kukusanya nguvu kubwa ya uharibifu unapoteremka chini.',
          'Nairobi ina mifumo mitatu mikuu ya mito ndani ya bonde la Mto Athi: Mto Nairobi, Mto Ngong, na Mto Mathare. Njia hizi za asili hukusanya maji kutoka miinuko ya Westlands, Kilimani, na Upper Hill. Wakati mvua kubwa inaponyesha, mamilioni ya lita za maji ya dhoruba humiminika kwenye mito hii ndani ya dakika chache. Ikiwa mikondo ya mito au mifereji haina nafasi ya kutosha, maji huvunja kingo na kusababisha mafuriko makubwa ya ghafla.'
        ],
        nairobiExample: 'Kando ya Nairobi Expressway na sehemu za Barabara ya Mombasa, nyuso kubwa za lami huzalisha mikondo mikubwa ya maji inayomiminika kwenye Mto Ngong, na kusababisha mafuriko ya ghafla kule Mukuru na Industrial Area.',
        keyTerms: [
          { term: 'Mtiririko wa Juu (Surface Runoff)', definition: 'Maji ya mvua yanayotiririka juu ya ardhi badala ya kuzama ardhini.' },
          { term: 'Uso Usiopemya Maji (Impervious Surface)', definition: 'Miundo migumu (lami, saruji, mabati) inayozuia maji kupenya na kuzama ardhini kiasili.' },
          { term: 'Mzunguko wa Maji (Hydrological Cycle)', definition: 'Mwendo endelevu wa maji juu, ndani, na angani mwa sayari ya Dunia.' },
          { term: 'Bonde la Mto (Catchment Basin)', definition: 'Eneo la ardhi ambapo maji yote ya mvua hutiririka na kukusanyika kuelekea mto au ziwa moja.' }
        ],
        takeaways: [
          'Ardhi ya asili hunyonya maji mengi; lami na saruji ya jiji hulazimisha maji yote kutiririka juu.',
          'Nyuso zisizopenya maji huongeza wingi na kasi ya maji ya dhoruba.',
          'Mabonde ya asili ya mito ya Nairobi (Nairobi, Ngong, Mathare) hupokea maji kutoka milimani.',
          'Mafuriko ya ghafla hutokea wakati maji yanapozidi uwezo wa mto au mfereji kubeba.'
        ],
        reflectionQuestion: 'Maji yanayonyesha juu ya paa la nyumba yako yanaelekea wapi? Je, yanazama bustanini, yanaingia kwenye mfereji, au yanatiririka moja kwa moja mlangoni kwako?',
        activity: 'Chunguza barabara yako wakati wa mvua. Tazama jinsi madimbwi yanavyoungana haraka na kutengeneza vijito vinavyotiririka, na uone mahali ambapo maji yanakutana na vizuizi.',
        misconceptions: [
          { misconception: 'Mafuriko ya mijini yanasababishwa tu na kiasi kikubwa cha mvua inayonyesha kutoka angani.', correction: 'Mafuriko husababishwa na saruji na lami kuzuia maji kuzama ardhini na kuyasukuma kwa kasi zaidi ya uwezo wa mifereji.' }
        ],
        sources: [
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050 (Ramani ya Hatari za Mafuriko)',
          'Ripoti za Bonde la Maji za Mamlaka ya Minara ya Maji ya Kenya'
        ]
      },
      {
        id: 'm2-l2',
        heading: 'Taka Ngumu, Mifereji Iliyoziba, na Vikwazo vya Maji',
        objectives: [
          'Kutambua jinsi taka ngumu zisizosimamiwa vizuri zinavyozidisha mafuriko ya mijini.',
          'Kuelewa vikwazo vya mtiririko vinavyotokana na kalvati nyembamba, ujenzi haramu, na mchanga.',
          'Kuchunguza usafi wa mifereji unaoongozwa na jamii kama njia ya kupunguza hatari ya mafuriko.'
        ],
        paragraphs: [
          'Ingawa dhoruba kali ndizo zinazoleta wingi wa maji, usimamizi mbaya wa taka ngumu ni kichocheo kikuu kinachofanya mafuriko kuwa mabaya zaidi Nairobi. Katika makazi yasiyo rasmi na maeneo yenye biashara nyingi, maelfu ya tani za taka za manispaa hazikusanywi kutokana na uhaba wa huduma za kaunti, barabara finyu, na gharama za kibinafsi za utupaji.',
          'Chupa za plastiki, mifuko ya nailoni, vifungashio, nguo zilizotupwa, na mabaki ya ujenzi husombwa na kuingia ndani ya mifereji ya maji ya dhoruba na kalvati za barabara. Ndani ya mifereji, taka hizi hutengeneza mabwawa imara ya vizuizi. Wakati wa kiangazi, mchanga na udongo humomonyoka na kuingia miferejini, na kuifanya iwe duni na yenye kina kifupi. Mvua kubwa inaponyesha, maji hayawezi kupita katika mifereji hii iliyoziba. Maji yakizuiliwa kwenye madaraja na kalvati, hufurika na kujaa mitaani, madukani, na ndani ya nyumba.',
          'Zaidi ya hayo, majengo yanayojengwa bila mpangilio mara nyingi huingilia njia za asili za maji. Kujenga juu ya mikondo ya maji kunatengeneza vikwazo vikali: maji yanayohitaji upana wa mita nne yanalazimishwa kupita kwenye bomba la mita moja. Kusafisha na kutunza mifereji wazi kupitia usafi wa jamii na kushawishi huduma za mara kwa mara za taka za manispaa ni hatua za msingi za kuzuia mafuriko.'
        ],
        nairobiExample: 'Mathare 4A na Kibera Silanga, vikundi vya vijana vinavyofanya usafi kabla ya mvua mara nyingi hutoa mamia ya magunia ya plastiki na magurudumu yaliyokuwa yameziba kabisa kalvati chini ya madaraja ya miguu.',
        keyTerms: [
          { term: 'Kalvati (Culvert)', definition: 'Handaki, bomba, au muundo unaopitisha mfereji au kijito chini ya barabara au reli.' },
          { term: 'Kutuama kwa Mchanga (Siltation)', definition: 'Mkusanyiko wa udongo, mchanga, na tope ndani ya mifereji, unaopunguza kina chake cha kubeba maji.' },
          { term: 'Kikwazo cha Mtiririko (Hydraulic Bottleneck)', definition: 'Sehemu nyembamba ya mfereji inayozuia maji kutiririka na kusababisha maji kurudi nyuma na kufurika.' },
          { term: 'Uvamizi wa Kingo za Mito (Riparian Encroachment)', definition: 'Ujenzi usioidhinishwa ndani ya hifadhi ya kingo za mito, unaozuia mtiririko wa asili wa mafuriko.' }
        ],
        takeaways: [
          'Plastiki na taka zilizotupwa hubadilisha mvua ya kawaida kuwa mafuriko hatari ya ghafla.',
          'Mchanga na tope hupunguza kina na uwezo wa mifereji ya maji kadiri muda unavyopita.',
          'Kalvati nyembamba na majengo yaliyojengwa juu ya mifereji hutengeneza vizuizi hatari.',
          'Kusafisha mifereji kabla ya misimu ya mvua kunaokoa nyumba na bidhaa za maduka.'
        ],
        reflectionQuestion: 'Je, umewahi kuona watu wakitupa taka kwenye mifereji ya maji? Kwa nini hufanya hivyo, na kuna njia gani mbadala mtaani kwako?',
        activity: 'Tembea mita 100 kando ya mfereji wa maji mtaani kwako. Rekodi iwapo uko wazi, umeziba kiasi na plastiki, umejaa mchanga, au umeziba kabisa.',
        misconceptions: [
          { misconception: 'Mifereji inaziba kwa sababu tu serikali ya kaunti haisafishi mitaa.', correction: 'Ingawa huduma za serikali ni muhimu, tabia za kila siku za utupaji taka za wakazi na biashara ndogo pia zinachangia moja kwa moja kuziba kwa mifereji.' }
        ],
        sources: [
          'Mwongozo wa Mamlaka ya Kitaifa ya Usimamizi wa Mazingira (NEMA) Kenya',
          'Sheria ya Usimamizi wa Taka Ngumu ya Kaunti ya Jiji la Nairobi 2015'
        ]
      },
      {
        id: 'm2-l3',
        heading: 'Kuchora Ramani ya Maeneo Yaliyo Hatarini mwa Mafuriko',
        objectives: [
          'Kujifunza misingi ya uchongaji ramani shirikishi wa hatari na maafa na jamii.',
          'Kutambua maeneo hatarishi (hotspots), nyumba zilizo hatarini, na maeneo salama ya juu.',
          'Kutambua jinsi maarifa ya jamii yanavyofichua hatari zinazopuuzwa na ramani rasmi.'
        ],
        paragraphs: [
          'Uchoraji ramani shirikishi wa hatari za jamii ni chombo chenye nguvu cha kujenga uthabiti dhidi ya majanga. Ramani rasmi za serikali mara nyingi hukosa maelezo ya kina ya vichochoro katika makazi yasiyo rasmi. Hata hivyo, wakazi wanaishi pale na wana maarifa ya kina ya vitendo: wanajua hasa ni sehemu gani za mto zinazofurika kwanza, ni njia gani zinazogeuka mito ya fujo, na ni nyumba gani zilizosimama kwenye mwamba thabiti au ardhi legevu.',
          'Ramani ya mafuriko ya jamii inaonyesha kanda tatu muhimu: **Kanda za Hatari** (kingo za mito, mashimo ya chini, sehemu za kutokea kalvati zilizoziba, na kuta dhaifu za udongo), **Rasilimali Zilizo Hatarini** (nyumba za wazee, watoto wadogo, au walemavu; vituo vya watoto; na nyaya za umeme zilizo karibu na ardhi), na **Sehemu Salama** (shule imara, makanisa, kumbi za jamii zilizoko miinukoni, na njia salama za uokoaji).',
          'Kutengeneza ramani hii kabla ya msimu wa mvua huwezesha mashirika ya kijamii (CBOs) na majirani kupanga njia salama za uokoaji. Maji ya mafuriko yanapoanza kuingia nyumbani saa nane usiku, familia hazihitaji kubahatisha wapi pa kukimbilia; hufuata njia zilizokubaliwa kuelekea maeneo salama yaliyotambuliwa. Ramani shirikishi huunganisha hekima ya jamii na sayansi ya kukabiliana na tabianchi.'
        ],
        nairobiExample: 'Huko Mukuru kwa Reuben na Kibera Soweto East, miradi ya kuchora ramani ya jamii kwa simu ilitambua madaraja ya miguu yasiyokuwa kwenye ramani rasmi yaliyokuwa yakivunjika wakati wa dhoruba, na kusaidia wakazi kuchagua njia mbadala salama.',
        keyTerms: [
          { term: 'Uchoraji Ramani Shirikishi (Participatory Mapping)', definition: 'Mchakato ambapo wakazi hushirikiana kuchora ramani inayoonyesha maarifa yao ya eneo na vipaumbele vyao.' },
          { term: 'Eneo Hatarishi (Flood Hotspot)', definition: 'Sehemu maalum ya kijiografia yenye uwezekano mkubwa wa kujaa maji mara kwa mara wakati wa mvua.' },
          { term: 'Njia ya Uokoaji (Evacuation Route)', definition: 'Njia iliyoteuliwa, iliyo wazi, na salama inayowatoa watu kwenye hatari kuelekea makazi salama.' },
          { term: 'Kimbilio Salama (Safe Haven)', definition: 'Jengo lililoko sehemu ya juu na lenye muundo imara lililotengwa kuwahifadhi watu wakati wa mafuriko.' }
        ],
        takeaways: [
          'Wakazi wa mtaa wanajua mienendo ya maji vizuri zaidi kuliko ramani za mbali za satelaiti.',
          'Ramani za jamii hutambua maeneo hatarishi, majirani walio hatarini, na maeneo salama ya juu.',
          'Njia za uokoaji lazima zikubaliwe na kujulikana kabla ya kuanza kwa msimu wa mvua.',
          'Vijana wanaweza kutumia simu zao kurekodi na kuripoti maeneo ya hatari kwa mamlaka za jiji.'
        ],
        reflectionQuestion: 'Mafuriko ya ghafla yakiingia mtaani kwako sasa hivi, ni jengo gani au eneo gani lililo juu na salama ambalo familia yako inaweza kukimbilia?',
        activity: 'Ukiwa na majirani au marafiki wawili, chora ramani ya kundi la nyumba 10 za jirani. Weka alama ya bluu sehemu ya chini kabisa, alama nyekundu kwenye mifereji iliyoziba, na alama ya kijani kwenye sehemu salama ya juu.',
        misconceptions: [
          { misconception: 'Kuchora ramani ya jamii kunahitaji vifaa vya gharama kubwa vya GPS na programu za kompyuta za wataalamu.', correction: 'Ramani zilizochorwa kwa mkono kwenye karatasi na wakazi kwa kushirikiana zina ufanisi mkubwa sana kwa mipango ya dharura ya mtaa.' }
        ],
        sources: [
          'Mwongozo wa Kupunguza Hatari za Maafa wa Shirika la Msalaba Mwekundu Kenya',
          'Mradi wa Map Kibera / Humanitarian OpenStreetMap Team'
        ]
      },
      {
        id: 'm2-l4',
        heading: 'Kuandaa Mpango wa Kujiandaa na Mafuriko Nyumbani na Jamii',
        objectives: [
          'Kutengeneza orodha ya vitendo ya kujiandaa na mafuriko nyumbani.',
          'Kutayarisha "Mkoba wa Dharura" usiopitisha maji wenye nyaraka muhimu na vifaa.',
          'Kuanzisha mfumo jumuishi wa mawasiliano ili kuwalinda watoto, wazee, na walemavu.'
        ],
        paragraphs: [
          'Maji ya mafuriko yanapovunja kuta, hufika ndani ya dakika chache, bila kutoa nafasi ya kutafuta vitambulisho vilivyopotea, vyeti vya shule, au dawa za kila siku. Mpango wa kujiandaa wa kaya unahakikisha kwamba kila mtu katika familia anajua hasa hatua za kuchukua mara tu mvua kubwa inapotishia kuingia nyumbani.',
          'Nguzo kuu ya kujiandaa nyumbani ni **Mkoba wa Dharura (Grab-Bag)**. Huu ni mkoba imara usiopitisha maji au ndoo ya plastiki yenye mfuniko iliyowekwa mahali panapofikika kwa urahisi. Unapaswa kuwa na: nyaraka asili za utambulisho (Vitambulisho vya Taifa, vyeti vya kuzaliwa, vyeti vya shule) vilivyotiwa ndani ya karatasi za nailoni za ziplock; dawa muhimu za kila siku za wanafamilia; simu iliyojaa chaji na power bank; tochi au taa ya jua; filimbi ya kupiga kelele ya kuomba msaada; na pesa kidogo taslimu za dharura.',
          'Zaidi ya mkoba wa dharura, kujiandaa nyumbani kunajumuisha ulinzi wa vitu: kuweka vyakula visivyoharibika haraka, matandiko, na vifaa vya umeme kwenye rafu za mbao au meza zilizoinuliwa juu ya kiwango cha mafuriko. Muhimu zaidi, mpango lazima uwe jumuishi. Majirani lazima wakubaliane mapema nani atamsaidia mzee anayeishi peke yake, mama mjamzito, watoto wadogo, au mtu mwenye ulemavu wa kutembea kabla njia hazijajaa maji.'
        ],
        nairobiExample: 'Katika maeneo ya Ruaraka karibu na Mto Mathare, vikundi vya akina mama huweka orodha ya mawasiliano na kujua mapema nani atakayewasaidia majirani wazee kuhama wakati kengele za tahadhari zinapolia.',
        keyTerms: [
          { term: 'Mkoba wa Dharura (Grab-Bag)', definition: 'Mkoba unaobebeka usiopitisha maji wenye nyaraka muhimu, dawa, na vifaa vya kujiokoa wakati wa kuhama kwa haraka.' },
          { term: 'Mfumo wa Mapema wa Tahadhari', definition: 'Mfumo wa ufuatiliaji, utabiri, na mawasiliano unaowezesha hatua za mapema kupunguza maafa.' },
          { term: 'Kujiandaa Kujumuishi (Inclusive Preparedness)', definition: 'Mipango ya dharura inayozingatia mahitaji maalum ya watoto, wazee, na watu wenye ulemavu.' },
          { term: 'Kuinua Miundo (Physical Hardening)', definition: 'Kuinua vizingiti vya milango au kuweka mbao za kuzuia maji yasiingie ndani ya nyumba.' }
        ],
        takeaways: [
          'Mafuriko hutoa tahadhari ya dakika chache; maandalizi lazima yafanyike wiki kadhaa kabla.',
          'Weka vyeti vya kuzaliwa, vitambulisho, na vyeti vya shule kwenye mfuko wa nailoni usiopitisha maji.',
          'Inua vitanda, chakula, na vifaa vya umeme juu wakati wa misimu ya mvua.',
          'Panga mapema jinsi ya kuwasaidia majirani wenye ulemavu au wazee kuhama salama.'
        ],
        reflectionQuestion: 'Nyaraka muhimu zaidi za familia yako zimewekwa wapi hivi sasa? Je, unaweza kuzichukua gizani ndani ya sekunde ishirini ikiwa dharura itatokea?',
        activity: 'Andaa au tengeneza mfano wa Mkoba wa Dharura nyumbani. Kusanya nakala za karatasi, zifunge kwenye nailoni safi, na teua sehemu ya juu na salama ya kuziweka.',
        misconceptions: [
          { misconception: 'Kujiandaa na mafuriko ni kwa ajili ya matajiri tu wenye bima na jenereta za umeme.', correction: 'Hatua rahisi za gharama nafuu kama kufunga vyeti kwenye nailoni na kuinua vitanda juu ya mawe huokoa maisha na mali katika nyumba yoyote.' }
        ],
        sources: [
          'Orodha ya Usalama wa Mafuriko ya Shirika la Msalaba Mwekundu Kenya (redcross.or.ke)',
          'Miongozo ya Kituo cha Kitaifa cha Operesheni za Maafa (NDOC) Kenya'
        ]
      },
      {
        id: 'm2-l5',
        heading: 'Usalama wa Maisha Wakati wa Mafuriko: Mienendo Salama na Mwitikio wa Haraka',
        objectives: [
          'Kuelewa nguvu kubwa na hatari ya kimaumbile ya maji ya mafuriko yanayotiririka kwa kasi.',
          'Kujifunza kanuni ya "Geuka Usizame" (Turn Around, Don’t Drown) na hatari za shoti za umeme.',
          'Kutambua hatua sahihi za uokoaji wa kibinafsi na mambo yasiyopaswa kufanywa kabisa.'
        ],
        paragraphs: [
          'Wakati wa mafuriko, kulinda uhai wa binadamu ndio kipaumbele kikuu kisichoweza kujadiliwa. Vyombo, samani, na vifaa vya ujenzi vinaweza kubadilishwa; maisha ya binadamu yakipotea hayarudi. Chanzo kikuu cha vifo wakati wa mafuriko ni watu kujaribu kutembea, kuogelea, au kuendesha vyombo vya usafiri ndani ya maji yanayotiririka kwa kasi. Maji yanayosogea yana nguvu kubwa sana: sentimita kumi na tano tu (inchi sita) za maji yanayotiririka kwa nguvu zinaweza kumuangusha mtu mzima, na sentimita thelathini zinaweza kusomba gari.',
          'Kamwe usijaribu kukatiza maji ya mafuriko usiyojua kina chake. Katika jiji la Nairobi, maji machafu ya mafuriko hufunika vifuniko vilivyofunguka vya mashimo ya maji taka (manholes), mifereji mirefu ya dhoruba iliyofunguka, mabati yenye kutu, chupa zilizovunjika, na vizuizi vilivyozama. Mtu anayekanyaga kile kinachoonekana kama kidimbwi kifupi anaweza kutumbukia mara moja kwenye kalvati ya kina cha mita mbili na kuvutwa chini na mkondo wa maji.',
          'Zaidi ya hayo, maji ya mafuriko mijini huleta hatari kubwa ya kupigwa na umeme (electrocution). Nyaya za umeme zilizozama, miunganisho haramu (sambaza), na transfoma zilizoharibika zinaweza kupitisha umeme mkali majini bila dalili yoyote inayoonekana. Maji yakianza kuingia nyumbani kwako, zima swichi kuu ya umeme mara moja ikiwa unaweza kufanya hivyo salama ukiwa mahali pakavu. Maji yakipanda kwa kasi, kimbilia maeneo ya juu au juu ya paa na upigie simu nambari ya dharura ya Msalaba Mwekundu Kenya (1199).'
        ],
        nairobiExample: 'Wakati wa dhoruba kali, watembea kwa miguu wanaojaribu kukatiza maeneo yenye maji kwenye Barabara ya Juja au Outer Ring Road wamewahi kusombwa ndani ya mifereji mikubwa ya barabara kwa sababu barabara na mfereji vilionekana kama mto mmoja wa matope.',
        keyTerms: [
          { term: 'Nguvu ya Maji Yanayotembea (Hydrodynamic Force)', definition: 'Nguvu kubwa inayotolewa na mkondo wa maji yanayosogea dhidi ya miili ya watu na majengo.' },
          { term: 'Kupigwa na Umeme Majini (Electrocution)', definition: 'Mkondo hatari wa umeme unaosafiri kupitia maji kutoka nyaya zilizokatika au miunganisho haramu.' },
          { term: 'Mtego wa Kalvati (Open Culvert Hazard)', definition: 'Mifereji mirefu ya dhoruba iliyofichika chini ya maji ya matope inayovuta watu chini kwa nguvu ya mkondo.' },
          { term: 'Nyaya za Sambaza', definition: 'Miunganisho ya umeme isiyo rasmi inayopita juu au ardhini katika makazi yasiyo rasmi inayoleta hatari kubwa ya umeme majini.' }
        ],
        takeaways: [
          'Kamwe usitembee, kuogelea, au kuendesha chombo ndani ya maji ya mafuriko: Geuka Usizame!',
          'Sentimita 15 tu za maji yanayotiririka zinaweza kumuangusha mtu mzima mwenye nguvu.',
          'Maji ya matope huficha mashimo ya maji taka, mifereji mirefu, na vitu vyenye ncha kali.',
          'Shoti za umeme ni muuaji mkuu aliyefichika wakati wa mafuriko; zima umeme salama mapema.'
        ],
        reflectionQuestion: 'Je, umewahi kuona watu wakijaribu kukatiza barabara iliyojaa maji ya mafuriko ili wawahi kufika nyumbani? Ni hatari gani zilizofichika zilizokuwa chini ya maji hayo?',
        activity: 'Hifadhi nambari za dharura za kitaifa kwenye simu yako: Msalaba Mwekundu Kenya (1199), Polisi/Maafa ya Kitaifa (999 au 112). Mfundishe mdogo wako au jirani nambari hizi tatu.',
        misconceptions: [
          { misconception: 'Maji yakifika kiwango cha ugoko tu, ni salama kabisa kutembea ndani yake.', correction: 'Maji yanayotiririka kwa kasi kwenye kiwango cha ugoko yana nguvu ya kutosha kukuangusha na kukuburuza ndani ya mifereji mirefu.' }
        ],
        sources: [
          'Kanuni za Usalama wa Mafuriko za Shirika la Msalaba Mwekundu Kenya (redcross.or.ke/floods/)',
          'Shirika la Afya Duniani (WHO): Kujiandaa na Mafuriko na Usalama wa Kibinafsi'
        ]
      },
      {
        id: 'm2-l6',
        heading: 'Kupona Baada ya Mafuriko, Maji Machafu, na Usaidizi Jumuishi',
        objectives: [
          'Kutambua hatari za pili baada ya mafuriko kupungua, zikiwemo magonjwa na kubomoka kwa kuta.',
          'Kutumia mbinu thabiti za usafi kuzuia kipindupindu, homa ya matumbo, na maambukizi ya ngozi.',
          'Kusaidia jamii kupona kwa staha na usawa, hasa kwa makundi yaliyo hatarini zaidi.'
        ],
        paragraphs: [
          'Maji ya mafuriko yanapopungua na kurudi nyuma, dharura haijaisha. Kwa kweli, kipindi kinachofuata mara baada ya mafuriko huleta hatari za pili zinazoweza kusababisha magonjwa na hasara kubwa ya kiuchumi kuliko maji yenyewe. Maji ya mafuriko katika makazi yasiyo rasmi huchanganyika na vyoo vya mashimo vilivyofurika, kinyesi kibichi, kemikali za viwandani, na mizoga, na kuacha matope yenye sumu na bakteria juu ya sakafu, kuta, vyombo vya kulia, na njia za mtaa.',
          'Kamwe usinywe maji kutoka kwenye mabomba, visima, au matanki yaliyokuwa yamezama majini, kwani maji ya mafuriko huingia kwa urahisi kwenye mabomba yaliyopasuka na visima vifupi, na kusababisha milipuko ya haraka ya magonjwa yanayosambazwa na maji kama kipindupindu na homa ya matumbo (typhoid). Chakula chochote kilichogusana na maji ya mafuriko lazima kitupwe mbali. Vifaa vya nyumbani, sakafu, na vyombo vya kupikia lazima vioshwe na kutiwa dawa ya klorini (bleach) au kuchemshwa kabla ya kutumika tena.',
          'Zaidi ya hayo, maji huloweka na kuharibu misingi ya nyumba. Kuta za udongo, saruji isiyo imara, na nguzo za mbao zinaweza kupoteza uimara na kubomoka saa chache au siku kadhaa baada ya mvua kusimama. Kuwa mwangalifu sana kabla ya kuingia tena ndani ya nyumba. Hatimaye, kupona kwa jamii kunahitaji mshikamano: vijana wanapaswa kusaidia kwanza familia za wazazi wasio na wenzi, wazee, na walemavu kuondoa matope, kusafisha nyumba, na kupata misaada ya kibinadamu.'
        ],
        nairobiExample: 'Baada ya mafuriko Mathare, wahamasishaji wa afya ya jamii (CHPs) hupima maji nyumba kwa nyumba na kugawa vidonge vya kutibu maji (WaterGuard) ili kusimamisha ongezeko la ugonjwa wa kuhara kwa watoto.',
        keyTerms: [
          { term: 'Hatari ya Pili (Secondary Hazard)', definition: 'Madhara yanayotokana na janga la awali, kama milipuko ya magonjwa au njaa baada ya mafuriko.' },
          { term: 'Magonjwa ya Maji (Waterborne Disease)', definition: 'Magonjwa yanayosababishwa na vimelea vinavyoenezwa kupitia maji machafu ya kunywa (k.m., kipindupindu, typhoid).' },
          { term: 'Kuharibika kwa Misingi (Structural Undermining)', definition: 'Kupoteza uimara wa udongo chini ya kuta za nyumba kutokana na kulowekwa na maji.' },
          { term: 'Wahamasishaji wa Afya ya Jamii (CHPs)', definition: 'Wahudumu wa afya wa ngazi ya jamii wanaotoa elimu ya usafi, usalama wa maji, na huduma za kwanza.' }
        ],
        takeaways: [
          'Maji ya mafuriko yanapoondoka huacha matope yenye sumu na kinyesi kwenye nyumba na vyombo.',
          'Usinywe maji ya mifereji au visima vilivyofurika bila kuchemsha au kutibu kwa klorini.',
          'Kuta na misingi iliyolowa maji inaweza kuporomoka siku kadhaa baada ya mafuriko kupungua.',
          'Mshikamano wa jamii unahitajika kusafisha makazi na kuwalinda watoto na wazee.'
        ],
        reflectionQuestion: 'Ni hatua gani ungechukua nyumbani kwako kusafisha na kuua viini kwenye vyombo vya kulia, vyungu vya kupikia, na sakafu baada ya maji ya mafuriko kuingia chumbani?',
        activity: 'Tengeneza bango fupi la hatua 4 za "Kurudi Salama Nyumbani": 1. Angalia nyufa za kuta, 2. Zima umeme uliolowa, 3. Osha na dawa ya klorini, 4. Chemsha maji yote ya kunywa.',
        misconceptions: [
          { misconception: 'Maji ya mafuriko yakitoka chumbani, kila kitu ni safi mara moja na kinaweza kutumika kama kawaida bila wasiwasi.', correction: 'Maji yanayoondoka huacha bakteria hatari zisizoonekana na misingi dhaifu ya nyumba inayohitaji kusafishwa kwa dawa na kukaguliwa usalama.' }
        ],
        sources: [
          'Wizara ya Afya Kenya: Miongozo ya Kuzuia Magonjwa Yanayoenezwa na Maji',
          'Shirika la Msalaba Mwekundu Kenya: Itifaki za Usafi na Afya Baada ya Maafa'
        ]
      }
    ],
    quiz: [
      {
        id: 'm2-q1',
        question: 'Kwa nini miji huzalisha mtiririko mkubwa zaidi wa maji ya juu (runoff) kuliko misitu wakati wa dhoruba ile ile ya mvua?',
        options: [
          'Miji ina hewa baridi sana inayobadilisha unyevu kuwa maji mara moja.',
          'Nyuso zisizopenya maji kama saruji, lami, na mabati huzuia maji kuzama kiasili ardhini.',
          'Miti ya misituni hunyunyizia maji hewani na kuyazuia yasifike ardhini.',
          'Mabomba ya chini ya ardhi ya jiji huvuta mawingu chini moja kwa moja.'
        ],
        correctAnswer: 1,
        explanation: 'Nyuso ngumu zisizopenya maji huzuia maji kuzama ardhini, na kubadilisha hadi 90% ya mvua kuwa mtiririko mkubwa wa maji wa juu ya ardhi.',
        difficulty: 'beginner',
        lessonRef: 'm2-l1',
        source: 'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050'
      },
      {
        id: 'm2-q2',
        question: 'Taka ngumu zisizosimamiwa vizuri zinachangiaje moja kwa moja kuongeza mafuriko ya mijini Nairobi?',
        options: [
          'Taka za plastiki hunyonya maji yote na kufanya mawingu yatoe mvua zaidi.',
          'Taka huziba kalvati, mifereji ya dhoruba, na njia za chini ya madaraja, na kuzuia maji kutiririka kiasi cha kufurika mitaani.',
          'Taka ngumu huongeza urefu wa milima iliyo nje ya jiji.',
          'Karatasi zilizotupwa hubadilisha maji kuwa moshi wenye sumu unaochoma miti.'
        ],
        correctAnswer: 1,
        explanation: 'Plastiki na taka ngumu husombwa ndani ya mifereji na kalvati, zikitengeneza vizuizi vinavyozuia maji kutiririka kiasili.',
        difficulty: 'beginner',
        lessonRef: 'm2-l2',
        source: 'Miongozo ya NEMA Kenya kuhusu Taka Ngumu'
      },
      {
        id: 'm2-q3',
        question: 'Lengo kuu la kuchora ramani shirikishi ya hatari na jamii kabla ya msimu wa mvua ni nini?',
        options: [
          'Kuuza tikiti za utalii kwa wageni wanaotaka kutazama maeneo ya mafuriko.',
          'Kutambua maeneo hatarishi ya mafuriko, majirani walio hatarini wanaohitaji usaidizi, na maeneo salama ya juu ya kimbilio.',
          'Kuthibitisha kwamba hakuna mtu yeyote mtaani anayehitaji usaidizi wowote.',
          'Kufuta katiba ya taifa na kuweka mchoro wa jamii badala yake.'
        ],
        correctAnswer: 1,
        explanation: 'Ramani shirikishi za jamii huweka kumbukumbu ya maeneo hatarishi, watu walio hatarini, na njia salama za uokoaji kabla ya dharura kutokea.',
        difficulty: 'intermediate',
        lessonRef: 'm2-l3',
        source: 'Mwongozo wa Msalaba Mwekundu Kenya kuhusu Upunguzaji wa Maafa'
      },
      {
        id: 'm2-q4',
        question: 'Kazi kuu ya Mkoba wa Dharura (Grab-Bag) wakati wa mafuriko ni nini?',
        options: [
          'Kubeba runinga kubwa na masofa mazito wakati wa dhoruba.',
          'Kuwezesha wanafamilia kuhama mara moja wakiwa na vitambulisho vilivyokingwa na nailoni, dawa muhimu, tochi, na vifaa vya kujiokoa.',
          'Kuhifadhi nguo chafu hadi mvua itakapomalizika.',
          'Kukusanya maji ya mafuriko kwa ajili ya kuosha magari.'
        ],
        correctAnswer: 1,
        explanation: 'Mkoba wa dharura unahakikisha nyaraka muhimu kama vyeti na vitambulisho, dawa, na vifaa vya kujiokoa vinachukuliwa salama ndani ya sekunde chache.',
        difficulty: 'beginner',
        lessonRef: 'm2-l4',
        source: 'Miongozo ya Usalama wa Mafuriko ya Msalaba Mwekundu Kenya'
      },
      {
        id: 'm2-q5',
        question: 'Mwongozo wa usalama wa maisha "Geuka Usizame" (Turn Around, Don’t Drown) unawashauri watembea kwa miguu na madereva kufanya nini?',
        options: [
          'Kuogelea kuvuka maji ya mafuriko yanayotembea haraka ikiwa yanaonekana kufika magotini tu.',
          'Kutojaribu kamwe kutembea, kuogelea, au kuendesha chombo ndani ya maji ya mafuriko yanayosogea kwa kasi ambayo kina chake hakijulikani.',
          'Kusubiri katikati ya mto uliofurika hadi mtu alete mashua.',
          'Kuendesha gari kwa kasi kubwa kuvuka daraja lililojaa maji.'
        ],
        correctAnswer: 1,
        explanation: 'Sentimita 15 tu za maji yanayotiririka zinaweza kumuangusha mtu mzima, na maji huficha mashimo ya maji taka na hatari za shoti za umeme.',
        difficulty: 'beginner',
        lessonRef: 'm2-l5',
        source: 'Kanuni za Usalama wa Mafuriko za WHO na Msalaba Mwekundu'
      },
      {
        id: 'm2-q6',
        question: 'Mbali na hatari ya kuzama, ni hatari gani nyingine hatari na iliyofichika inayopatikana kwenye maji ya mafuriko mijini?',
        options: [
          'Kupigwa na umeme (electrocution) kutoka kwa nyaya za umeme zilizozama au miunganisho haramu ya "sambaza".',
          'Mionzi mikubwa ya nyuklia kutoka angani.',
          'Maji kuganda mara moja na kuwa mawe ya barafu.',
          'Mawimbi ya tetemeko la ardhi yanayotengenezwa na matone ya mvua.'
        ],
        correctAnswer: 0,
        explanation: 'Nyaya za umeme zilizokatika na miunganisho haramu inaweza kupitisha umeme mkali majini bila dalili inayoonekana, na kusababisha vifo vya ghafla.',
        difficulty: 'intermediate',
        lessonRef: 'm2-l5',
        source: 'Kituo cha Kitaifa cha Operesheni za Maafa (NDOC) Kenya'
      },
      {
        id: 'm2-q7',
        question: 'Kwa nini ni hatari kunywa maji ya bomba la kaunti au visima mara tu baada ya maji ya mafuriko kupungua?',
        options: [
          'Maji huwa na ladha ya chumvi nyingi mno.',
          'Maji ya mafuriko huchanganyika na maji taka na vyoo vilivyofurika, yakibeba bakteria za kipindupindu na typhoid ndani ya mabomba yaliyopasuka.',
          'Maji yanabadilika kuwa mvuke tupu wa moto.',
          'Tumbo la binadamu haliwezi kuyeyusha maji baridi ya mvua.'
        ],
        correctAnswer: 1,
        explanation: 'Mafuriko huvunja mifumo ya maji taka, yakichafua visima na kuingia kwenye mabomba yaliyopasuka kupitia shinikizo hasi (back-siphonage).',
        difficulty: 'intermediate',
        lessonRef: 'm2-l6',
        source: 'Ufuatiliaji wa Magonjwa wa Wizara ya Afya Kenya'
      },
      {
        id: 'm2-q8',
        question: 'Ni hatari gani ya kimuundo inayoweza kutokea kwa nyumba siku kadhaa baada ya maji ya mafuriko kuondoka kabisa?',
        options: [
          'Nyumba kubadilika mara moja na kuwa mawe ya asili.',
          'Udongo uliolowa maji na misingi iliyomomonyoka inaweza kusababisha kuta na nguzo kupasuka au kubomoka ghafla.',
          'Paa za nyumba kupaa angani kuelekea mawinguni.',
          'Majengo kuwa imara milele dhidi ya hali yoyote ya hewa.'
        ],
        correctAnswer: 1,
        explanation: 'Misingi iliyolowa maji kwa muda mrefu na udongo uliomomonyoka unaweza kusababisha kuta kupoteza uimara na kubomoka hata baada ya mvua kusimama.',
        difficulty: 'intermediate',
        lessonRef: 'm2-l6',
        source: 'Bodi ya Kitaifa ya Ukaguzi wa Majengo Kenya'
      }
    ]
  },
  {
    id: 'm3',
    title: 'Joto na Afya',
    description: 'Kuelewa msongo wa joto katika makazi yenye msongamano, dalili za kimwili za uchovu wa joto na kiharusi cha joto, mbinu za kupooza nyumba, na kulinda jamii.',
    image: '/images/heat_and_health_1790629650810.jpg',
    content: [
      {
        id: 'm3-l1',
        heading: 'Kuelewa Joto la Mijini na Hali ya Hewa Ndogo Katika Makazi Yenye Msongamano',
        objectives: [
          'Kuchunguza jinsi msongamano wa majengo na uhaba wa madirisha unavyotengeneza joto kali ndani ya nyumba.',
          'Kutofautisha joto la kawaida la hewa ya nje na joto la mionzi (radiant heat) ndani ya nyumba za mabati.',
          'Kuchambua visababishi vya kuchemka kwa nyumba za mabati mchana kutwa.'
        ],
        paragraphs: [
          'Joto kali mara nyingi huitwa "janga lililonyamaza" (silent hazard) kwa sababu tofauti na mafuriko ya fujo au moto mkubwa, halibomoi kuta za nyumba wala kuacha vifusi vinavyoonekana mara moja. Hata hivyo, duniani na kikanda, kukaa kwenye joto kali kwa muda mrefu husababisha maradhi makubwa, kulazwa hospitalini, na vifo. Katika jiji la Nairobi, joto la juu linapokutana na muundo wa makazi duni, hutengeneza mazingira madogo yenye joto hatari sana.',
          'Katika makazi yasiyo rasmi, nyumba nyingi zimejengwa kwa mabati ya bati yasiyo na dari wala insulation, kwa paa na hata kuta. Mabati yana uwezo mkubwa wa kupitisha joto na uwezo mdogo wa kuakisi mionzi ya jua: chini ya jua kali la ikweta, uso wa bati unaweza kufikia joto la nyuzi 55 hadi 65 Selsiasi. Bati hili basi hufanya kazi kama hita kubwa, likitoa joto la mionzi kuelekea chini ndani ya vyumba vidogo visivyo na madirisha ya kutosha.',
          'Zaidi ya hayo, msongamano mkubwa wa nyumba huacha vichochoro vyembamba vinavyozuia upepo wa asili kupita na kupoza nyumba. Matokeo yake, joto la ndani ya nyumba za mabati linaweza kuwa nyuzi 5 hadi 10 juu zaidi ya hewa ya kivulini ya nje. Wakati mchana wenye joto kali unapofuatiwa na usiku wenye hewa nzito na tulivu, miili ya binadamu haiwezi kupoa, jambo linaloleta msongo mkubwa wa kiafya.'
        ],
        nairobiExample: 'Katika vijiji vyenye msongamano mkubwa kule Kibera kama Gatwekera na Mashimoni, wakazi huelezea vyumba vya mabati kuhisi kama "tanuri" kati ya saa tano asubuhi na saa kumi jioni, na kuwalazimu kukaa nje vichochoroni kupata nafuu.',
        keyTerms: [
          { term: 'Joto la Mionzi (Radiant Heat)', definition: 'Nishati ya joto inayotolewa kama mawimbi ya infrared kutoka nyuso zenye joto (kama mabati ya paa) kuelekea vitu vya baridi.' },
          { term: 'Upitishaji wa Joto (Thermal Conductivity)', definition: 'Kasi ambayo nyenzo hupitisha joto kutoka upande mmoja hadi mwingine.' },
          { term: 'Hali ya Hewa Ndogo (Microclimate)', definition: 'Hali ya hewa ya eneo dogo maalum inayotofautiana waziwazi na tabianchi ya eneo pana linalolizunguka.' },
          { term: 'Upepo wa Kukatiza (Cross-Ventilation)', definition: 'Mzunguko wa hewa safi inayopita katikati ya jengo kutoka milango au madirisha yaliyo kinyume.' }
        ],
        takeaways: [
          'Joto kali ni muuaji wa kimya kimya anayezidisha shinikizo la damu, figo, na moyo.',
          'Mabati ya bati hufyonza jua kali na kutoa joto la mionzi moja kwa moja ndani ya vyumba.',
          'Uhaba wa madirisha na vichochoro vyembamba huzuia upepo wa asili kuingia na kupoza vyumba.',
          'Joto la ndani ya nyumba ya mabati linaweza kuwa kubwa zaidi kuliko hewa ya kivulini nje.'
        ],
        reflectionQuestion: 'Nyumba yako inakuwa na joto kali zaidi wakati gani wa siku? Kufungua milango au madirisha kunabadilishaje hali ya hewa ndani ya chumba chako?',
        activity: 'Chukua kipimajoto (au tumia hisia za mwili): linganisha joto lililopo ndani ya chumba saa saba mchana kukiwa kumefungwa na kukiwa na milango miwili wazi inayopitisha upepo wa kukatiza.',
        misconceptions: [
          { misconception: 'Joto kali ni hatari kwenye majangwa pekee; miji ya nyanda za juu kama Nairobi haiwezi kupata joto hatari.', correction: 'Makazi ya mabati yenye msongamano Nairobi yanaweza kufikia joto la ndani la zaidi ya 38°C, ambalo ni hatari kubwa kiafya.' }
        ],
        sources: [
          'Mwongozo wa WHO kuhusu Mabadiliko ya Tabianchi na Mawimbi ya Joto',
          'SEI Afrika: Joto Mijini na Afya ya Umma katika Makazi ya Nairobi'
        ]
      },
      {
        id: 'm3-l2',
        heading: 'Athari za Kimwili: Uchovu wa Joto, Upungufu wa Maji, na Kiharusi cha Joto',
        objectives: [
          'Kuelewa jinsi mwili wa binadamu unavyodhibiti joto la ndani kupitia jasho na mzunguko wa damu.',
          'Kutofautisha misuli kukakamaa kwa joto, uchovu wa joto (heat exhaustion), na kiharusi cha joto (heatstroke).',
          'Kutambua dalili za hatari zinazohitaji matibabu ya dharura ya haraka hospitalini.'
        ],
        paragraphs: [
          'Mwili wa binadamu hufanya kazi kudumisha joto la ndani ndani ya kiwango salama na cha afya cha takriban nyuzi 36.5 hadi 37.5 Selsiasi. Joto la nje linapoongezeka, mwili hujipoza hasa kupitia njia mbili kuu za kisaikolojia: kutanua mishipa ya damu ya ngozi ili kutoa joto nje, na kutoa jasho, ambapo maji yanapovukiza kutoka ngozini hubeba joto mbali na mwili.',
          'Hata hivyo, joto la mazingira likiwa kubwa mno au unyevu ukiwa juu kiasi cha kuzuia jasho kuvukiza, mifumo ya mwili ya kujipoza inalemewa. Kupoteza maji mwilini na madini ya chumvi husababisha **Uchovu wa Joto (Heat Exhaustion)**, unaoonekana kwa jasho jingi, ngozi kuwa baridi na yenye unyevu, kizunguzungu, maumivu ya kichwa, kichefuchefu, kukakamaa misuli, na kuchoka sana. Mtu mwenye dalili hizi anapaswa kuhamishiwa kivulini mara moja, kupewa maji safi ya kunywa polepole, na kupozwa kwa vitambaa vilivyolowa.',
          'Uchovu wa joto usipotibiwa haraka unaweza kugeuka kuwa **Kiharusi cha Joto (Heatstroke)**, ambalo ni janga la dharura ya kimatibabu lenye hatari kubwa ya kifo au uharibifu wa ubongo wa kudumu. Wakati wa kiharusi cha joto, mfumo wa mwili wa kudhibiti joto unashindwa kabisa: joto la ndani hupanda zaidi ya nyuzi 40 Selsiasi. Ngozi inakuwa ya moto, nyekundu, na kavu (kutoa jasho kunasimama kabisa); mtu anachanganyikiwa akili, anashindwa kuongea wazi, anapata degedege, au anapoteza fahamu. Uokoaji wa haraka kwenda hospitali unahitajika mara moja.'
        ],
        nairobiExample: 'Wakati wa kiangazi chenye joto kali mwezi Februari, zahanati za afya Ruaraka huripoti ongezeko la watoto wadogo na wazee wanaofikishwa wakiwa na upungufu mkubwa wa maji, kuzirai kwa joto, na maumivu makali ya kichwa.',
        keyTerms: [
          { term: 'Udhibiti wa Joto la Mwili (Thermoregulation)', definition: 'Mchakato wa kisaikolojia unaowezesha mwili wa binadamu kudumisha joto salama la ndani.' },
          { term: 'Uchovu wa Joto (Heat Exhaustion)', definition: 'Ugonjwa unaotokana na joto unaojulikana kwa jasho jingi, kizunguzungu, kichefuchefu, na kupoteza maji na chumvi mwilini.' },
          { term: 'Kiharusi cha Joto (Heatstroke)', definition: 'Dharura hatari ya kimatibabu ambapo joto la mwili linazidi 40°C na mfumo wa fahamu wa ubongo kuvurugika.' },
          { term: 'Upungufu wa Maji Mwilini (Dehydration)', definition: 'Hali hatari ya mwili kukosa maji na madini ya kutosha kutokana na jasho jingi bila kunywa maji.' }
        ],
        takeaways: [
          'Kutoa jasho hupoza mwili, lakini joto kali na ukosefu wa maji huzuia upoaji huu.',
          'Dalili za uchovu wa joto: jasho jingi, kizunguzungu, kichefuchefu, maumivu ya kichwa, na udhaifu.',
          'Dalili za kiharusi cha joto: ngozi kavu ya moto, kuchanganyikiwa akili, kuzirai, na joto la mwili zaidi ya 40°C.',
          'Kiharusi cha joto ni dharura ya daktari; mpoze mgonjwa haraka na umkimbize hospitalini mara moja.'
        ],
        reflectionQuestion: 'Je, umewahi kuhisi kizunguzungu, kichefuchefu, au maumivu makali ya kichwa baada ya kufanya kazi au kutembea chini ya jua kali la mchana? Ulifanya nini kupata nafuu?',
        activity: 'Jifunze kichocheo rahisi cha Maji ya Chumvi na Sukari (ORS): lita 1 ya maji safi ya kunywa + vijiko 6 vidogo vya sukari + nusu kijiko kidogo cha chumvi. Fahamu jinsi mchanganyiko huu unavyorudisha madini mwilini.',
        misconceptions: [
          { misconception: 'Kiharusi cha joto ni maumivu madogo tu ya kichwa yanayopona mtu akikaa kimya bila kunywa maji.', correction: 'Kiharusi cha joto ni dharura hatari inayoweza kuharibu ubongo au kusababisha kifo ndani ya dakika chache bila matibabu.' }
        ],
        sources: [
          'Karatasi ya Ukweli ya WHO: Mabadiliko ya Tabianchi, Joto na Afya',
          'Mwongozo wa Huduma ya Kwanza wa Shirika la Msalaba Mwekundu Kenya'
        ]
      },
      {
        id: 'm3-l3',
        heading: 'Kuwalinda Wafanyakazi wa Nje, Wanafunzi, na Majirani Walio Hatarini',
        objectives: [
          'Kutambua makundi ya watu walio hatarini zaidi kukabiliwa na athari za joto kali.',
          'Kuunda mbinu za ulinzi kazini kwa wafanyakazi wa nje na sekta isiyo rasmi ya Jua Kali.',
          'Kuchunguza mifumo ya kusaidia wazee wanaoishi peke yao na watoto wadogo.'
        ],
        paragraphs: [
          'Hatari za kiafya za joto kali hazigawanyiki sawa katika jamii. Udhaifu wa kisaikolojia hutofautiana sana kulingana na umri na hali ya afya. Watoto wachanga na walio chini ya umri wa miaka mitano hupata joto mara tatu hadi tano haraka zaidi kuliko watu wazima kwa sababu ya uzito wao mdogo na mifumo yao ya mwili ambayo haijakomaa kikamilifu. Wazee, watu wenye shinikizo la juu la damu, ugonjwa wa moyo, au matatizo ya figo, na wanawake wajawazito wanakabiliwa na hatari kubwa zaidi wakati wa mawimbi ya joto.',
          'Mazingira ya kazi ni kipengele kingine muhimu cha mfiduo wa joto. Katika jiji la Nairobi, mamia ya maelfu ya vijana na wafanyakazi wa sekta isiyo rasmi hupata riziki yao nje juani: mafundi wa ujenzi, wachomeleaji vyuma wa sekta ya Jua Kali, wasukumaji mikokoteni, wachuuzi wa masokoni, na makondakta wa matatu. Wafanyakazi hawa hufanya kazi ngumu ya misuli moja kwa moja chini ya jua kali, mara nyingi bila maji safi ya kutosha, kofia, au mahali pa kivuli pa kupumzika.',
          'Kuwakinga wafanyakazi na jamii kunahitaji hatua rahisi za gharama nafuu: kupanga kazi nzito za nje asubuhi mapema au jioni wakati hewa ikiwa tulivu; kuvaa kofia zenye mapana mapana na nguo nyepesi za pamba; kuweka ratiba ya kupumzika kivulini na kunywa maji mara kwa mara; na kuwatembelea majirani wazee wanaoishi peke yao kwenye nyumba za mabati wakati wa mchana mkali.'
        ],
        nairobiExample: 'Katika maeneo ya Jua Kali huko Gikomba na Kamukunji, mafundi wanaochomelea vyuma chini ya mabati hukabiliwa na joto mara mbili: kutoka kwa moto wa kazi na kutoka kwa jua kali la juu, na kusababisha misuli yao kukakamaa mara kwa mara.',
        keyTerms: [
          { term: 'Msongo wa Joto Kazini (Occupational Heat Stress)', definition: 'Mzigo wa joto unaompata mfanyakazi kutokana na kazi ngumu ya mwili pamoja na joto kali la mazingira ya nje.' },
          { term: 'Udhaifu wa Kisaikolojia (Physiological Vulnerability)', definition: 'Kuwa na hatari kubwa ya kuugua kutokana na umri, ugonjwa sugu, au mimba.' },
          { term: 'Sekta ya Jua Kali', definition: 'Uchumi mkubwa wa mafundi na wajasiriamali wadogo nchini Kenya, uliopewa jina hilo kwa kufanyia kazi chini ya "jua kali".' },
          { term: 'Joto la Misuli (Metabolic Heat)', definition: 'Joto linalotengenezwa ndani ya mwili wa binadamu wakati wa kufanya kazi ngumu au mazoezi.' }
        ],
        takeaways: [
          'Watoto wadogo, wazee, wajawazito, na wagonjwa wa moyo wako hatarini zaidi wakati wa joto.',
          'Mafundi wa Jua Kali na wachuuzi hufanya kazi ngumu ya misuli moja kwa moja chini ya jua kali.',
          'Panga kazi nzito asubuhi na mapema kabla ya jua kali kupanda.',
          'Kunywa maji safi mara kwa mara kabla hujasikia kiu; kiu ni ishara iliyochelewa ya upungufu wa maji.'
        ],
        reflectionQuestion: 'Nani katika familia au mtaa wako anayefanya kazi ngumu zaidi nje juani kila siku? Ni mabadiliko gani madogo yanayoweza kumlinda asipatwe na ugonjwa wa joto?',
        activity: 'Andaa mwongozo mfupi wa "Kufanya Kazi Salama Juani" kwa fundi au mchuuzi wa mtaani: pendekeza tabia 3 za kunywa maji, ushauri 2 wa mavazi, na ratiba 1 ya mapumziko.',
        misconceptions: [
          { misconception: 'Mtu anapaswa kunywa maji tu pale ambapo koo limekauka kabisa na anahisi kiu kali.', correction: 'Kiu ni dalili ya kuchelewa; wakati unaposikia kiu, mwili wako tayari umepoteza maji mengi ya kutosha.' }
        ],
        sources: [
          'Shirika la Kazi Duniani (ILO): Kufanya Kazi Kwenye Sayari Yenye Joto Zaidi',
          'Mwongozo wa Afya ya Umma wa WHO kuhusu Joto na Makundi Yaliyo Hatarini'
        ]
      },
      {
        id: 'm3-l4',
        heading: 'Kupunguza Joto Nyumbani: Paa Zinazoakisi Nuru na Mzunguko wa Hewa',
        objectives: [
          'Kuelewa sayansi ya uakisi wa mionzi ya jua (mikakati ya paa zenye albedo kubwa).',
          'Kujifunza jinsi paa zilizopakwa rangi nyeupe zinavyoakisi hadi 70% ya joto la jua.',
          'Kutekeleza mbinu za gharama nafuu za kupitisha hewa ili kupoza vyumba vya nyumbani.'
        ],
        paragraphs: [
          'Kwa sababu wakazi wengi wa makazi yasiyo rasmi hawana uwezo wa kifedha wa kuweka viyoyozi vya umeme au kujenga nyumba mpya za mawe, mikakati ya kukabiliana na joto lazima iwe ya bei nafuu, iliyothibitishwa kisayansi, na inayoweza kutekelezwa kwa kutumia vifaa vinavyopatikana mtaani. Mbinu mbili kuu zenye matokeo bora zaidi ni **Paa Zinazookoa Joto (Cool Roofs)** na **Uingizaji Hewa wa Asili (Passive Ventilation)**.',
          'Paa ya kawaida ya bati iliyozeeka au yenye kutu ina albedo ya takriban 0.10 hadi 0.20, ikimaanisha inafyonza asilimia 80 hadi 90 ya jua linaloipiga. Kwa kupaka nje ya paa rangi nyeupe inayoakisi jua au chokaa ya asili ya bei nafuu (lime-wash), albedo ya paa hupanda hadi 0.70 au 0.80. Hali hii hurudisha sehemu kubwa ya mionzi ya jua angani kabla haijabadilika kuwa joto, na kupunguza joto la ndani ya nyumba kwa nyuzi 2 hadi 5 Selsiasi wakati wa mchana.',
          'Mbali na paa nyeupe, mzunguko wa hewa ya asili huondoa hewa nzito ya moto chumbani. Kuweka matundu ya hewa au wavu juu karibu na kilele cha paa huruhusu hewa ya moto—ambayo kiasili hupanda juu kwa kuwa nyepesi—kutoka nje mfululizo. Kuacha nafasi ndogo chini ya kingo za paa na kuweka dari ya bei nafuu ya boksi au mikeka ya mwanzi hutengeneza safu ya hewa inayozuia joto kushuka chini, na kuleta nafuu kubwa chumbani.'
        ],
        nairobiExample: 'Majaribio ya vitendo yaliyofanywa katika makazi yasiyo rasmi jijini Nairobi yanaonyesha kuwa kaya zilizopaka paa zao rangi nyeupe ziliripoti kupungua kwa wazi kwa joto la mchana na usingizi mnono usiku.',
        keyTerms: [
          { term: 'Paa Inayookoa Joto (Cool Roof)', definition: 'Paa iliyoundwa kuakisi jua zaidi na kufyonza joto kidogo kuliko paa ya kawaida, mara nyingi kwa rangi nyeupe.' },
          { term: 'Chokaa (Lime-Wash)', definition: 'Dawa ya asili ya madini ya bei nafuu inayotengeneza ukuta au paa nyeupe inayong’aa na kuakisi jua vizuri.' },
          { term: 'Mnyanyuko wa Hewa ya Moto (Thermal Buoyancy)', definition: 'Kanuni ya kimaumbile ambapo hewa ya moto inakuwa nyepesi na kupanda juu, wakati hewa ya baridi inazama chini.' },
          { term: 'Uingizaji Hewa wa Asili (Passive Ventilation)', definition: 'Kupoza jengo na kuzungusha hewa kwa kutumia nguvu za asili za upepo bila kutumia feni za umeme.' }
        ],
        takeaways: [
          'Kupaka paa za mabati rangi nyeupe huakisi jua na kuzuia joto kufyonzwa kabla halijaingia ndani.',
          'Chokaa ya kawaida ni mbadala wa bei nafuu sana badala ya rangi ghali za madukani.',
          'Hewa ya moto hupanda juu kiasili; matundu ya juu ya dari huruhusu joto lililofungiwa kutoroka.',
          'Dari rahisi za makaratasi ya boksi au mikeka hutengeneza kizuizi kizuri cha kuzuia joto la bati.'
        ],
        reflectionQuestion: 'Tazama paa za mtaa wako: je, nyingi ni nyeusi na zenye kutu, au kuna mtu aliyejaribu kupaka rangi nyeupe au kuweka dari? Tofauti gani unaiona?',
        activity: 'Chukua mikebe miwili ya bati tupu: paka mmoja rangi nyeupe (au ufunike kwa karatasi nyeupe) na uache mwingine ukiwa mweusi. Iweke yote juani kwa dakika 30, kisha uguse joto la ndani ya kila mkebe.',
        misconceptions: [
          { misconception: 'Rangi nyeupe hubadilisha tu muonekano wa urembo wa nyumba lakini haina athari yoyote kwa joto la ndani.', correction: 'Uthibitisho thabiti wa kisayansi unaonyesha kuwa nyuso nyeupe huakisi sehemu kubwa ya joto la jua, na kupunguza moja kwa moja joto la ndani ya nyumba.' }
        ],
        sources: [
          'Muungano wa Miji ya Paa za Kupoa Duniani (GCCA)',
          'SEI Afrika: Hatua za Vitendo za Kupunguza Joto katika Makazi ya Mijini'
        ]
      },
      {
        id: 'm3-l5',
        heading: 'Upandaji Miti Mjini, Bustani Ndogo, na Mbinu za Kupooza Jamii',
        objectives: [
          'Kueleza jinsi mimea ya mijini inavyotoa kivuli na kupoza hewa kwa uvukizi.',
          'Kuchunguza mbinu za vitendo za kijani katika maeneo yenye nafasi finyu: bustani za magunia na miti ya ndoo.',
          'Kubuni vituo vya jamii vya kupooza (cooling hubs) kusaidia wakazi wakati wa mawimbi ya joto.'
        ],
        paragraphs: [
          'Wakati hatua za nyumbani kama paa nyeupe zikilinda familia moja moja, kupooza mtaa mzima kunahitaji kurejesha mimea katika mandhari ya jiji. Miti na mimea hupambana na joto la mijini kupitia njia mbili kuu: **kutoa kivuli cha moja kwa moja**, kinachozuia mionzi ya jua kupiga barabara na kuta, na **uvukizi wa maji ya mimea (evapotranspiration)**, ambapo mimea hufyonza maji ardhini na kuyatoa kama mvuke kupitia majani, na kupoza hewa ya mazingira kiasili.',
          'Katika makazi yenye nafasi finyu kama Kibera, Mathare, au Ruaraka, kupanda misitu mikubwa haiwezekani kwa sababu ya uhaba wa ardhi. Hata hivyo, mifano ya kibunifu ya kijani ya jamii imeonyesha matokeo makubwa: bustani za magunia za wima (vertical sack gardens) pembezoni mwa kuta, mimea inayotambaa juu ya vibaraza vya nje, miti ya kiasili iliyopandwa kwenye ndoo kando ya ploti, na maeneo madogo ya kijani (pocket parks) katika shule na makanisa.',
          'Zaidi ya hayo, jamii zinaweza kuanzisha **Vituo vya Jamii vya Kupooza (Community Cooling Hubs)**. Hivi ni majengo ya umma yaliyopo yenye hewa nzuri, kivuli, na usalama—kama kumbi za jamii, shule, au chini ya vikundi vikubwa vya miti—yakiwa na maji safi ya bure ya kunywa na vifaa vya huduma ya kwanza. Wakati wa mawimbi makali ya joto, wazee na watoto wanaweza kukusanyika hapo mchana kupumzika salama.'
        ],
        nairobiExample: 'Kule Kibera na Mathare, vikundi vya vijana vya mazingira vimebadilisha maeneo yaliyokuwa madampo haramu ya taka kando ya njia kuwa bustani ndogo zenye miti kwenye ndoo na magunia ya mboga za kienyeji.',
        keyTerms: [
          { term: 'Bustani Ndogo ya Mtaa (Pocket Park)', definition: 'Eneo dogo la wazi la kijani lililotengenezwa kwenye kiwanja kilichokuwa wazi au kilichosafishwa katikati ya jiji.' },
          { term: 'Bustani ya Magunia (Vertical Sack Garden)', definition: 'Upandaji wa mboga au mimea kuelekea juu kwenye magunia ya udongo ili kuokoa nafasi finyu ya ardhi.' },
          { term: 'Kituo cha Jamii cha Kupooza (Cooling Hub)', definition: 'Mahali pa umma palipotengwa penye kivuli, hewa nzuri, na maji safi ya bure ya kuwakinga wakazi wakati wa joto kali.' },
          { term: 'Ukanda wa Majani ya Miti (Canopy Cover)', definition: 'Asilimia ya ardhi ya jiji iliyofunikwa na matawi na majani ya miti inapotazamwa kutoka angani.' }
        ],
        takeaways: [
          'Miti na mimea hupoza mitaa kiasili kupitia kivuli na kutoa mvuke wa maji hewani.',
          'Bustani za magunia ya wima na mimea inayotambaa huleta kijani kwenye vichochoro vyembamba.',
          'Kusafisha madampo haramu na kupanda mimea hupunguza taka na kupunguza joto kwa wakati mmoja.',
          'Vituo vya jamii vya kupooza huwapa wazee na watoto mahali pa kupumzika na kunywa maji mchana.'
        ],
        reflectionQuestion: 'Je, kuna kona iliyojaa taka mtaani kwako inayoweza kusafishwa na kupandwa miti midogo ya ndoo au mimea inayotambaa?',
        activity: 'Tafuta sehemu moja mtaani kwako yenye kivuli cha mti. Keti hapo kwa dakika 10, tambua tofauti ya joto ikilinganishwa na juani, na chora jinsi ya kuongeza mmea mwingine kando yake.',
        misconceptions: [
          { misconception: 'Unahitaji mashamba makubwa ya hekta nyingi ili kupata faida ya kupanda miti na mimea ya kupooza joto.', correction: 'Hata mimea inayotambaa ukutani au kikundi kidogo cha mimea kwenye ndoo hupunguza joto la mazingira madogo ya chumba.' }
        ],
        sources: [
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050 (Miundombinu ya Kijani)',
          'UN-Habitat: Suluhisho za Asili kwa Uthabiti wa Tabianchi Mijini'
        ]
      },
      {
        id: 'm3-l6',
        heading: 'Mipaka ya Kukabiliana Kibinafsi na Mahitaji ya Sera za Umma',
        objectives: [
          'Kutambua mipaka ya hatua za mtu binafsi dhidi ya majanga makubwa ya kimfumo ya joto.',
          'Kutambua uwekezaji wa lazima wa umma: maji ya mifereji, gridi ya umeme, na upangaji miji.',
          'Kuunda madai ya kisera ya kuelekeza bajeti ya manispaa kwenye makazi yasiyo rasmi.'
        ],
        paragraphs: [
          'Ingawa paa zilizopakwa rangi nyeupe, kunywa maji, na bustani za magunia huleta nafuu ya haraka ya kuokoa maisha, ni lazima kutambua mipaka ya wazi ya hatua za mtu binafsi. Familia yenye umaskini inayoishi katika chumba cha mita tatu kwa tatu chenye watoto watano haiwezi "kujinasua yenyewe" kutoka kwa ukweli wa jengo la bati lililoko kwenye mtaa usio na mti hata mmoja, usio na maji ya bomba, na usio na umeme wa uhakika.',
          'Ulinzi wa kudumu na wa kweli dhidi ya joto la mijini unahitaji uwekezaji wa kimuundo kutoka kwa serikali ya kaunti na kitaifa. Suluhu hizi za kimfumo zinajumuisha: kuboresha makazi ya mitaa duni kwa kanuni za ujenzi zinazozuia joto; kuweka vituo vya bure na vya kuaminika vya maji ya kunywa ya umma; kujenga barabara zenye vifaa vinavyoakisi joto; kupanua bustani za umma za miti; na kulinda miundombinu ya umeme ili feni na friji za zahanati zisiache kufanya kazi.',
          'Kuelewa mipaka hii ya kimfumo kunazuia mtego hatari wa kuwalaumu watu walio hatarini kwa mateso wanayopata wakati wa mawimbi ya joto. Haki ya tabianchi inadai kwamba bajeti za manispaa zigawanye rasilimali kulingana na mahitaji ya maeneo yanayobeba mzigo mkubwa zaidi wa mazingira, kuhakikisha kuwa sera za umma zinalinda afya na utu wa kila raia wa mijini.'
        ],
        nairobiExample: 'Mpango Kazi wa Tabianchi wa Nairobi 2020–2050 una malengo ya kupanua miti na kuboresha nafasi za umma, lakini ufuatiliaji wa vijana unahitajika ili kuhakikisha fedha hizi zinafika makazi yasiyo rasmi na si bustani za katikati mwa jiji pekee.',
        keyTerms: [
          { term: 'Kukabiliana kwa Kimfumo (Systemic Adaptation)', definition: 'Mabadiliko makubwa ya kimuundo, kitaasisi, na kimiundombinu yanayoongozwa na sera za serikali na umma.' },
          { term: 'Mipaka ya Kukabili Kibinafsi', definition: 'Kiwango ambacho hatua za kibinafsi haziwezi tena kusaidia kwa sababu ya ukosefu wa miundombinu ya umma.' },
          { term: 'Bajeti ya Tabianchi (Climate Budgeting)', definition: 'Kutenga rasmi mapato ya serikali ya kaunti au kitaifa kuelekea miradi ya uthabiti wa tabianchi.' },
          { term: 'Ukosefu wa Usawa wa Kimuundo', definition: 'Mifumo ya kijamii na kitaasisi inayoweka makundi fulani katika hasara endelevu ya kiuchumi na kimazingira.' }
        ],
        takeaways: [
          'Hatua za kibinafsi ni muhimu kwa uhai wa sasa, lakini haziwezi kuchukua nafasi ya miundombinu ya umma.',
          'Uthabiti wa kweli wa joto unahitaji maji ya bomba ya manispaa, maeneo ya kijani, na nyumba bora za utu.',
          'Wakazi wasilaumiwe kwa kuugua magonjwa ya joto ndani ya nyumba duni za mabati.',
          'Ushiriki wa kiraia wa vijana lazima uwasukume viongozi wa kaunti kutenga bajeti za haki za kukabiliana na joto.'
        ],
        reflectionQuestion: 'Ni uwekezaji gani mmoja mkubwa wa umma ambao serikali ya kaunti inaweza kufanya mtaani kwako (kama maji ya bomba au bustani ya umma) ambao ungekinga jamii mara moja dhidi ya joto?',
        activity: 'Andika orodha fupi ya madai 3 ya kukabiliana na joto kwa ajili ya Mwakilishi wako wa Wodi (MCA), ukilenga vituo vya maji ya umma, upandaji miti, na uboreshaji wa zahanati.',
        misconceptions: [
          { misconception: 'Kuhimili mawimbi ya joto ni suala la ushujaa wa kibinafsi tu na kunywa maji; serikali haina jukumu lolote hapo.', correction: 'Joto la mijini ni janga la afya ya umma linaloathiriwa moja kwa moja na sera za nyumba za manispaa, upangaji miji, na utoaji wa huduma za umma.' }
        ],
        sources: [
          'Katiba ya Kenya (2010), Kifungu cha 42 (Haki ya Mazingira Safi na Yenye Afya)',
          'Mpango Kazi wa Tabianchi wa Kaunti ya Jiji la Nairobi 2020–2050'
        ]
      }
    ],
    quiz: [
      {
        id: 'm3-q1',
        question: 'Kwa nini nyumba za chumba kimoja za mabati katika makazi yasiyo rasmi hupata joto kali sana mchana wenye jua?',
        options: [
          'Mabati hutengeneza umeme wake yenyewe yanapokutana na hewa.',
          'Mabati yasiyo na dari yana upitishaji mkubwa wa joto na albedo ndogo, yakifyonza jua na kutoa joto la mionzi moja kwa moja chumbani.',
          'Wakazi huwasha moto mkubwa ndani ya nyumba kila alasiri.',
          'Paa za chuma huvuta hewa baridi kutoka chini ya ardhi.'
        ],
        correctAnswer: 1,
        explanation: 'Mabati hufyonza mionzi ya jua kali na kutoa joto la mionzi kuelekea chini ndani ya vyumba, na kufanya joto la ndani kuwa juu sana kuliko nje.',
        difficulty: 'beginner',
        lessonRef: 'm3-l1',
        source: 'SEI Afrika: Joto Mijini na Afya ya Umma katika Makazi ya Nairobi'
      },
      {
        id: 'm3-q2',
        question: 'Ni zipi dalili za kawaida za tahadhari za uchovu wa joto (heat exhaustion)?',
        options: [
          'Ngozi kavu kabisa, kucheka bila sababu, na mikono kuganda kama barafu.',
          'Jasho jingi, ngozi baridi na yenye unyevu, kizunguzungu, kichefuchefu, maumivu ya kichwa, na udhaifu mkuu wa mwili.',
          'Kupoteza uwezo wa kuongea bila kutokwa na jasho wala kuhisi joto.',
          'Kutamani kula vyakula vyenye chumvi nyingi pekee.'
        ],
        correctAnswer: 1,
        explanation: 'Uchovu wa joto unaambatana na jasho jingi, ngozi baridi yenye unyevu, kichefuchefu, udhaifu, kizunguzungu, na kichwa kuuma kutokana na upungufu wa maji na chumvi.',
        difficulty: 'beginner',
        lessonRef: 'm3-l2',
        source: 'Karatasi ya Ukweli ya WHO: Mabadiliko ya Tabianchi, Joto na Afya'
      },
      {
        id: 'm3-q3',
        question: 'Kiharusi cha joto (heatstroke) kinatofautianaje na uchovu wa joto, na kwa nini ni dharura ya daktari?',
        options: [
          'Kiharusi cha joto hutokea usiku tu na huleta usingizi mzuri.',
          'Kiharusi cha joto kinahusisha joto la mwili kupanda zaidi ya 40°C, ngozi kuwa kavu ya moto, kuchanganyikiwa akili au kuzirai, na kinaweza kuharibu ubongo au kuua.',
          'Kiharusi cha joto kinapona kwa kunywa kikombe cha chai ya moto.',
          'Kiharusi cha joto hakina athari yoyote kwa mfumo wa fahamu.'
        ],
        correctAnswer: 1,
        explanation: 'Kiharusi cha joto huashiria kushindwa kwa udhibiti wa joto mwilini: joto linapanda zaidi ya 40°C, na kusababisha kuvurugika kwa ubongo na hatari ya kifo.',
        difficulty: 'intermediate',
        lessonRef: 'm3-l2',
        source: 'Mwongozo wa Huduma ya Kwanza wa Shirika la Msalaba Mwekundu Kenya'
      },
      {
        id: 'm3-q4',
        question: 'Kwa nini watoto wadogo walio chini ya miaka mitano wako kwenye hatari kubwa zaidi wakati wa mawimbi ya joto?',
        options: [
          'Watoto hawana tezi za kutoa jasho popote kwenye miili yao.',
          'Watoto hupata joto mara 3 hadi 5 haraka zaidi ya watu wazima kutokana na uzito wao mdogo na mifumo ya mwili ambayo haijakomaa kikamilifu.',
          'Watoto wana damu nzito kuliko watu wazima.',
          'Watoto huchukia kunywa maji safi ya baridi kiasili.'
        ],
        correctAnswer: 1,
        explanation: 'Watoto wana uwiano mkubwa wa eneo la ngozi kwa uzito wa mwili na mifumo ya kudhibiti joto ambayo haijakomaa, hivyo hupata joto haraka sana.',
        difficulty: 'intermediate',
        lessonRef: 'm3-l3',
        source: 'Mwongozo wa Afya ya Umma wa WHO kuhusu Joto'
      },
      {
        id: 'm3-q5',
        question: 'Kupaka paa ya bati rangi nyeupe (Cool Roof) kunapunguzaje joto la ndani ya nyumba?',
        options: [
          'Rangi nyeupe hubadilisha bati kuwa barafu ngumu ya kudumu.',
          'Rangi nyeupe huongeza sana albedo (uakisi) ya paa, ikirudisha asilimia 70–80 ya mionzi ya jua angani kabla haijafyonzwa kama joto.',
          'Rangi nyeupe hufyonza maji moja kwa moja kutoka kwenye mawingu ya mvua hadi kwenye dari.',
          'Rangi nyeupe haina athari yoyote na ni kwa ajili ya urembo wa macho tu.'
        ],
        correctAnswer: 1,
        explanation: 'Rangi nyeupe yenye albedo kubwa huakisi sehemu kubwa ya mionzi ya jua, na kupunguza kwa kiasi kikubwa nishati ya joto inayoingia ndani ya chumba.',
        difficulty: 'intermediate',
        lessonRef: 'm3-l4',
        source: 'Muungano wa Miji ya Paa za Kupoa Duniani (GCCA)'
      },
      {
        id: 'm3-q6',
        question: 'Ni nyenzo gani rahisi na ya bei nafuu ya kienyeji ambayo wakazi wanaweza kuitumia kama rangi nyeupe inayoakisi jua kwenye paa?',
        options: [
          'Lami nyeusi ya barabarani',
          'Chokaa ya asili ya kawaida (lime-wash)',
          'Mafuta machafu ya injini za magari',
          'Rangi nyekundu ya kutu'
        ],
        correctAnswer: 1,
        explanation: 'Chokaa (lime-wash) ni dawa ya asili ya bei nafuu inayotengeneza safu nyeupe inayong’aa na kuakisi jua vizuri sana kwa gharama ndogo.',
        difficulty: 'intermediate',
        lessonRef: 'm3-l4',
        source: 'Hatua za Vitendo za SEI Afrika za Kupunguza Joto'
      },
      {
        id: 'm3-q7',
        question: 'Miti na mimea hupoza mitaa ya jiji kupitia njia gani kuu mbili za asili?',
        options: [
          'Kutoa kivuli moja kwa moja na uvukizi wa maji ya mimea (evapotranspiration).',
          'Kugandisha mawingu ya mvua na kufyonza gesi ya kaboni monoksaidi.',
          'Kuakisi jua kwa nguvu za sumaku na kupuliza upepo kupitia mizizi.',
          'Kutengeneza mito ya chini ya ardhi inayopoza mabati kutoka chini.'
        ],
        correctAnswer: 0,
        explanation: 'Miti hupoza mazingira ya jiji kwa kutoa kivuli kinachozuia jua kugonga ardhi na kwa kutoa mvuke wa maji hewani kupitia majani (evapotranspiration).',
        difficulty: 'intermediate',
        lessonRef: 'm3-l5',
        source: 'UN-Habitat Suluhisho za Asili za Mazingira'
      },
      {
        id: 'm3-q8',
        question: 'Kwa nini ni muhimu kutambua mipaka ya hatua za mtu binafsi za kukabiliana na joto katika makazi yasiyo rasmi?',
        options: [
          'Kwa sababu familia za kibinafsi hazipaswi kuchukua tahadhari yoyote ya usalama kamwe.',
          'Kwa sababu hatua za kibinafsi haziwezi kuchukua nafasi ya uhaba wa maji ya bomba ya manispaa, maeneo ya umma ya kivuli, na miundombinu duni ya nyumba.',
          'Kwa sababu joto kali huathiri wanyama wa porini tu katika mbuga za kitaifa.',
          'Kwa sababu sheria za serikali zinakataza kuwekeza katika mitaa ya maskini.'
        ],
        correctAnswer: 1,
        explanation: 'Hatua za mtu binafsi ni muhimu kwa maisha ya sasa, lakini haziwezi kuwa mbadala wa uwekezaji wa umma katika maji, nafasi za kijani, na makazi bora.',
        difficulty: 'advanced',
        lessonRef: 'm3-l6',
        source: 'Katiba ya Kenya (2010), Kifungu cha 42'
      }
    ]
  },
  {
    id: 'm4',
    title: 'Uhaba wa Maji na Kuzuia Magonjwa',
    description: 'Kuchunguza uhusiano wa tabianchi na maji, uchumi usio rasmi wa vioski vya maji, kuchafuliwa kwa maji wakati wa mafuriko, utibuaji salama wa maji nyumbani, na kuzuia magonjwa.',
    image: '/images/water_stress_1790629662981.jpg',
    content: [
      {
        id: 'm4-l1',
        heading: 'Uhusiano wa Tabianchi na Maji: Ukame, Mvua za Ghafla, na Usambazaji wa Maji Nairobi',
        objectives: [
          'Kuelewa jinsi mabadiliko ya tabianchi ya kikanda yanavyoathiri mabwawa makuu ya maji ya Nairobi.',
          'Kuchunguza safari ya maji ya manispaa kutoka minara ya maji ya Aberdare hadi kwenye mabomba ya jiji.',
          'Kuchambua vyanzo vikuu vya mgao wa maji na uhaba wa misimu jijini.'
        ],
        paragraphs: [
          'Maji ndiyo njia kuu ambapo athari za mabadiliko ya tabianchi huonekana moja kwa moja katika jamii na maisha ya kila siku. Katika jiji la Nairobi, upatikanaji wa maji umefungamana moja kwa moja na hali ya hewa katika maeneo ya mbali ya nyanda za juu. Zaidi ya asilimia 85 ya maji ya bomba ya Nairobi hutoka kwenye safu za milima ya Aberdare na bonde la Mto Tana, yakikusanywa hasa katika mabwawa ya Ndakaini (Thika), Sasumua, na Ruiru kabla ya kutibiwa katika kituo cha Ng’ethu na kusambazwa na Kampuni ya Maji na Maji Taka ya Jiji la Nairobi (NCWSC).',
          'Wakati ukame wa muda mrefu unapotokea katikati mwa Kenya, viwango vya maji ya mito inayoingia kwenye bwawa la Ndakaini hushuka sana. Kwa sababu mahitaji ya kila siku ya maji ya Nairobi (zaidi ya mita za ujazo 850,000 kwa siku) yanazidi uwezo wa miundombinu iliyopo (takriban mita za ujazo 525,000 kwa siku), upungufu wowote wa maji mabwawani hulazimisha jiji kuingia kwenye ratiba kali za mgao wa maji.',
          'Mgao huu wa maji huathiri wakazi wa Nairobi kwa ukosefu mkubwa wa usawa. Wakati mitaa ya matajiri ikiwa na matanki makubwa ya kuhifadhi maji chini ya ardhi na visima vya kibinafsi, makazi yasiyo rasmi huingia katika shida kubwa. Wakati mabomba ya manispaa yanapokauka kwa wiki kadhaa, wakazi hulazimika kutegemea wachuuzi wa mikokoteni, visima visivyothibitishwa, au vijito vichafu, jambo linaloongeza hatari kubwa za kiafya.'
        ],
        nairobiExample: 'Wakati wa kiangazi, kiwango cha maji katika Bwawa la Ndakaini hushuka chini ya 50%, na kusababisha mgao mkali wa maji Eastlands, Ruaraka, na Kibera ambapo foleni za maji kwenye vioski hufikia mamia ya mita.',
        keyTerms: [
          { term: 'Uhusiano wa Tabianchi na Maji (Climate-Water Nexus)', definition: 'Mwingiliano thabiti kati ya mabadiliko ya tabianchi, mifumo ya mvua, rasilimali za maji, na maisha ya binadamu.' },
          { term: 'Mgao wa Maji (Water Rationing)', definition: 'Kuzuia au kugawa upatikanaji wa maji ya manispaa kwa ratiba maalum ili kudhibiti upungufu wakati wa uhaba.' },
          { term: 'Mnara wa Maji (Water Tower / Catchment)', definition: 'Maeneo ya misitu ya milimani (kama Aberdare) yanayovuta mvua na kulisha mito inayoingia mabwawani.' },
          { term: 'Uhaba wa Maji (Water Insecurity)', definition: 'Kukosekana kwa upatikanaji wa uhakika wa maji safi na salama ya kutosha kwa mahitaji ya kila siku kwa bei nafuu.' }
        ],
        takeaways: [
          'Maji ya bomba ya Nairobi yanategemea mvua inayonyesha mamia ya kilomita mbali kwenye milima ya Aberdare.',
          'Mahitaji ya maji ya jiji yanazidi uwezo wa mabwawa, hivyo ukame wowote huleta mgao mkali mara moja.',
          'Mgao huathiri zaidi makazi yasiyo rasmi kwa sababu ya ukosefu wa matanki makubwa ya kuhifadhi nyumbani.',
          'Kulinda misitu ya vyanzo vya maji ni muhimu kwa ajili ya usalama wa maji wa jiji la Nairobi.'
        ],
        reflectionQuestion: 'Maji ya bomba hutiririka siku ngapi kwa wiki mtaani kwako? Familia yako hufanya nini wakati mabomba yanapokauka kwa wiki nzima?',
        activity: 'Piga hesabu ya matumizi ya maji ya familia yako: hesabu ni mitungi mingapi ya lita 20 (jerrycans) ambayo familia yako hutumia kila siku kwa kunywa, kupika, kuosha vyombo, na chooni.',
        misconceptions: [
          { misconception: 'Nairobi inapata maji yake yote moja kwa moja kutoka Ziwa Victoria au Bahari ya Hindi.', correction: 'Nairobi inategemea mabwawa ya milimani katika safu za Aberdare kama Ndakaini na Sasumua kwa zaidi ya asilimia 85 ya maji yake.' }
        ],
        sources: [
          'Mpango Mkakati wa Kampuni ya Maji na Maji Taka ya Jiji la Nairobi (NCWSC)',
          'Ripoti za Bonde la Maji za Mamlaka ya Rasilimali za Maji (WRA) Kenya'
        ]
      },
      {
        id: 'm4-l2',
        heading: 'Uhaba wa Maji na Uchumi wa Vioski vya Maji',
        objectives: [
          'Kuchambua mzigo wa kiuchumi wa kununua maji kutoka kwa wachuuzi katika makazi ya kipato cha chini.',
          'Kuchunguza soko lisilo rasmi la maji: mikokoteni, vioski, na hatari za ubora wa maji.',
          'Kuchunguza vioski vinavyosimamiwa na jamii kama njia ya usawa na uthabiti.'
        ],
        paragraphs: [
          'Katika makazi yasiyo rasmi ambapo mabomba ya ndani ya nyumba ni machache au hayapo kabisa, upatikanaji wa maji unasimamiwa na soko lisilo rasmi. Wakazi hutegemea vioski vya maji, wamiliki binafsi wa visima, na wachuuzi wa mikokoteni. Hali hii inatengeneza ukosefu mkubwa wa usawa wa kiuchumi unaojulikana kama "adhabu ya umaskini" (poverty penalty): familia za kipato cha chini hulipa bei ya juu zaidi kwa kila lita ya maji kuliko wakazi matajiri wenye mita za maji za kaunti nyumbani kwao.',
          'Wakati maji ya bomba ya manispaa yanalipiwa kwa viwango vilivyowekwa na serikali (takriban Shilingi 2 hadi 5 za Kenya kwa mtungi wa lita 20), wachuuzi wa mikokoteni hutoza Shilingi 10, 20, au hata 50 kwa mtungi wakati wa vipindi vikali vya ukame na mgao. Kwa familia inayopata kibarua cha Shilingi 400 kwa siku, kutumia Shilingi 100 kila siku kwa maji pekee ni sawa na kutumia robo ya mapato yao yote ya chakula na kodi.',
          'Zaidi ya hayo, ubora wa maji yanayouzwa mara nyingi haukaguliwi. Wachuuzi wanaweza kuchota maji kutoka kwa miunganisho haramu inayopita ndani ya mifereji ya maji taka au visima vyenye chumvi nyingi na vijidudu vya magonjwa. Kuanzisha vioski vya maji vinavyosimamiwa na makundi rasmi ya vijana au akina mama huhakikisha uwazi wa bei zilizowekwa, kuzuia unyonyaji, na kudumisha ubora uliothibitishwa wa maji.'
        ],
        nairobiExample: 'Huko Ruaraka na Kibera, wakati mgao wa maji unapozidi, wasukuma mikokoteni hupandisha bei ya mtungi wa lita 20 kutoka Shilingi 10 hadi Shilingi 30 au 50, na kulazimisha familia kupunguza usafi ili wapate maji ya kupikia.',
        keyTerms: [
          { term: 'Adhabu ya Umaskini (Poverty Penalty)', definition: 'Hali ambapo watu maskini hulipa bei ya juu zaidi kwa bidhaa na huduma za kimsingi kuliko matajiri.' },
          { term: 'Kioski cha Maji (Water Kiosk)', definition: 'Kituo cha umma au cha kibinafsi kinachouza maji ya vyombo kwa bei maalum.' },
          { term: 'Makaraza ya Maji (Water Cartels)', definition: 'Mitandao isiyo rasmi inayodhibiti usambazaji na kupandisha bei za maji kiholela wakati wa uhaba.' },
          { term: 'Chumvi ya Visima (Borehole Salinity)', definition: 'Kiwango cha chumvi na madini yaliyoyeyuka ndani ya maji ya chini ya ardhi, ambayo mara nyingi huwa juu Nairobi.' }
        ],
        takeaways: [
          'Familia maskini hulipa hadi mara kumi zaidi kwa lita ya maji kuliko nyumba zenye mita za kaunti.',
          'Wachuuzi wasio rasmi hupandisha bei mara mbili au tatu wakati wa mgao wa tabianchi.',
          'Mabomba ya plastiki yanayopita ndani ya mitaro ya maji taka huvuja na kuchafua maji ya kunywa.',
          'Vioski vinavyoongozwa na jamii hutoa bei nafuu za haki na kuhakikisha ubora safi wa maji.'
        ],
        reflectionQuestion: 'Familia yako hutumia pesa ngapi kwa maji kila wiki? Ni vitu gani muhimu (kama chakula au nauli) vinavyopunguzwa wakati bei za maji zinapopanda?',
        activity: 'Chunguza vituo vitatu tofauti vya maji mtaani kwako. Rekodi bei ya mtungi wa lita 20, chanzo cha maji (bomba, kisima, au boza), na kama bei hubadilika wakati wa kiangazi.',
        misconceptions: [
          { misconception: 'Watu wanaoishi makazi yasiyo rasmi hupata maji ya bure au ya bei nafuu sana kuliko matajiri.', correction: 'Kwa sababu ya wachuuzi na unyonyaji wa maji, familia za kipato cha chini hulipa gharama kubwa zaidi kwa kila lita kuliko wenye mita rasmi za nyumbani.' }
        ],
        sources: [
          'Benki ya Dunia: Mpango wa Maji na Usafi katika Makazi Yasiyo Rasmi Nairobi',
          'Tume ya Kitaifa ya Haki za Kibinadamu ya Kenya: Haki ya Binadamu ya Kupata Maji'
        ]
      },
      {
        id: 'm4-l3',
        heading: 'Kuchafuka kwa Maji Wakati wa Mafuriko na Mlipuko wa Magonjwa',
        objectives: [
          'Kueleza jinsi mafuriko ya ghafla yanavyofurisha vyoo vya mashimo na kuchafua maji ya kunywa.',
          'Kutambua vimelea vikuu vinavyoeneza kipindupindu, typhoid, na ugonjwa wa kuhara damu.',
          'Kuelewa hatari ya uchafuzi kupitia shinikizo hasi (back-siphonage) kwenye mabomba yaliyopasuka.'
        ],
        paragraphs: [
          'Wakati ukame ukileta uhaba wa maji, mafuriko ya ghafla huleta uchafuzi mkali wa vyanzo vya maji. Katika makazi yasiyo rasmi, vyoo vinavyotumika zaidi ni vyoo vya mashimo vya jumuiya na mifereji ya wazi. Wakati mvua kubwa inapofurika, maji ya mafuriko hufurisha vyoo hivi vya mashimo, yakisomba kinyesi kibichi na kukitawanya kote mitaani, viwanjani, na kwenye njia za kutembea.',
          'Wakati huo huo, mabomba ya maji ya manispaa na mabomba membamba ya plastiki yasiyo rasmi—ambayo mara nyingi hupitishwa ndani ya mitaro ya maji taka ili kuepuka kukata barabara—mara nyingi huwa na nyufa au viungio vilivyolegea. Wakati shinikizo la maji linapopungua bombani wakati wa dhoruba, hewa tupu (vacuum) hutengenezwa ndani ya bomba. Maji ya mafuriko yaliyojaa kinyesi huvutwa moja kwa moja ndani ya bomba la maji ya kunywa kupitia mchakato unaoitwa back-siphonage.',
          'Uchafuzi huu wa pande zote hutengeneza janga kubwa la kiafya. Kunywa maji yaliyochafuliwa na vimelea vya kinyesi cha binadamu—kama vile bakteria ya *Vibrio cholerae* (kipindupindu), *Salmonella typhi* (typhoid), na virusi vya rotavirus—husababisha milipuko ya haraka ya kuhara kwa maji mengi, kutapika, na upungufu wa maji mwilini. Bila matibabu ya haraka ya kurejesha maji mwilini, kipindupindu kinaweza kusababisha kifo ndani ya masaa machache tu baada ya kuanza.'
        ],
        nairobiExample: 'Baada ya mvua kubwa kwenye bonde la Mto Nairobi, vituo vya afya Mathare Kaskazini na Kibera huripoti ongezeko kubwa la watoto wanaougua kipindupindu kutokana na maji machafu kuingia kwenye mabomba ya PVC yaliyopasuka mitaroni.',
        keyTerms: [
          { term: 'Shinikizo Hasi Bombani (Back-Siphonage)', definition: 'Kuvutwa kwa maji machafu ya nje kuingia ndani ya bomba la maji safi kunakofanyika wakati shinikizo la ndani linaposhuka.' },
          { term: 'Njia ya Kinyesi Mdomoni (Fecal-Oral Route)', definition: 'Njia ya maambukizi ambapo vimelea kutoka kwenye kinyesi huingia mdomoni kupitia maji machafu, chakula, au mikono michafu.' },
          { term: 'Vibrio cholerae', definition: 'Bakteria anayesababisha ugonjwa wa kipindupindu, unaoleta kuhara kali kwa maji na upungufu wa haraka wa maji mwilini.' },
          { term: 'Uchafuzi Mtambuka (Cross-Contamination)', definition: 'Kuingiliana bila kukusudia kwa maji ya kinyesi na maji safi ya kunywa kupitia mabomba yaliyoharibika.' }
        ],
        takeaways: [
          'Mafuriko hufurisha vyoo vya mashimo, yakisambaza kinyesi kibichi katika njia na nyumba za mtaa.',
          'Mabomba yaliyopasuka mitaroni huvuta maji ya kinyesi ndani shinikizo la maji linaposhuka.',
          'Kipindupindu na typhoid huenea haraka wakati maji machafu yanapoingia kwenye bilauri na vyungu vya kupikia.',
          'Kuhara kali huondoa maji mwilini haraka na kunaweza kuua ndani ya masaa machache bila chumvi ya ORS.'
        ],
        reflectionQuestion: 'Je, umewahi kuona mabomba ya maji safi yakipita ndani ya mitaro michafu ya maji taka mtaani kwako? Nini kitatokea bomba hilo likipasuka na tundu dogo?',
        activity: 'Fuatilia njia inayopita bomba linaloleta maji kwenye bomba au kioski chako cha karibu. Angalia kama linapita kwenye mitaro ya maji taka, madimbwi machafu, au milima ya taka.',
        misconceptions: [
          { misconception: 'Maji ya bomba yakionekana safi na yasiyo na harufu baada ya mafuriko, hayana bakteria yoyote na ni salama kabisa kunywa mara moja.', correction: 'Vimelea hatari vya kipindupindu ni vidogo mno havionekani kwa macho, havina harufu, na havina ladha hata kwenye maji yanayoonekana meupe safi.' }
        ],
        sources: [
          'Wizara ya Afya Kenya: Mpango wa Kitaifa wa Kuzuia na Kudhibiti Kipindupindu',
          'Miongozo ya WHO kuhusu Ubora wa Maji ya Kunywa'
        ]
      },
      {
        id: 'm4-l4',
        heading: 'Utibuaji Salama wa Maji Nyumbani: Kuchemsha, Klorini, na Uhifadhi',
        objectives: [
          'Kujifunza sayansi na matumizi sahihi ya mbinu za kusafisha maji nyumbani.',
          'Kutekeleza kanuni sahihi za kuchemsha maji na matumizi sahihi ya klorini (WaterGuard / vidonge).',
          'Kutumia mbinu salama za kuhifadhi maji ili kuzuia kuchafuliwa upya (secondary recontamination).'
        ],
        paragraphs: [
          'Kwa sababu maji ya mabomba na vioski hayawezi kuwa na hakika ya asilimia mia moja ya usalama wakati wa majanga ya tabianchi, kutibu maji nyumbani kabla ya kunywa (Household Water Treatment - HWT) ndiyo ngao madhubuti zaidi ya kujilinda dhidi ya magonjwa. Mbinu mbili kuu zinazofikiwa na zenye ufanisi mkubwa zaidi Nairobi ni **kuchemsha kwa moto** na **kutibu kwa dawa ya klorini**.',
          'Kuchemsha ndiyo kiwango cha dhahabu: kuchemsha maji hadi yachemke kwa fujo na mapovu mengi (rolling boil) kwa angalau dakika moja kamili huua asilimia 100 ya bakteria, virusi, na vijidudu vya protozoa. Hata hivyo, kwa kuwa nishati ya kupikia (makaa, mafuta ya taa, gesi ya LPG) ni ghali, dawa zilizoidhinishwa za klorini kama vile WaterGuard au vidonge vya Aquatabs hutoa suluhisho rahisi na la bei nafuu. Kifuniko kimoja cha WaterGuard kwenye mtungi wa lita 20 wa maji yaliyo masafi, kikitingiswa vizuri na kuachwa kitulie kwa angalau dakika thelathini, huacha kinga ya klorini inayoua vimelea vyote.',
          'Jambo la muhimu ni kwamba maji yaliyotibiwa lazima yahifadhiwe salama ili kuzuia **kuchafuliwa upya (secondary recontamination)**. Kuhifadhi maji kwenye ndoo wazi ambapo watu huingiza mikono michafu au bilauri hurejesha vijidudu mara moja. Maji safi lazima yahifadhiwe kwenye mitungi yenye shingo nyembamba na vifuniko imara, au kwenye matangi madogo yenye mifereji ya bomba, yakihifadhiwa juu mbali na wanyama.'
        ],
        nairobiExample: 'Wahudumu wa Afya ya Jamii wanaogawa WaterGuard Kibera husisitiza: "Kifuniko kimoja kwa lita 20 za maji yaliyo masafi, tikisa vizuri, na ungoje dakika 30 kabla ya kunywa. Kamwe usinywe mara moja!"',
        keyTerms: [
          { term: 'Kutibu Maji Nyumbani (HWTS)', definition: 'Mbinu zinazotumiwa na familia nyumbani kusafisha na kuua viini kwenye maji ya kunywa kabla ya matumizi.' },
          { term: 'Mchemko wa Fujo (Rolling Boil)', definition: 'Mchemko kamili ambapo maji yanatokota kwa mapovu mengi mfululizo, yakifikia viwango vinavyoua vijidudu vyote.' },
          { term: 'Mabaki ya Klorini (Residual Chlorine)', definition: 'Kiwango kidogo cha klorini kinachobaki majini baada ya matibabu kinachoendelea kuua bakteria mpya.' },
          { term: 'Kuchafuka Upya (Secondary Recontamination)', definition: 'Kurejesha vijidudu ndani ya maji yaliyosafishwa kupitia mikono michafu, bilauri chafu, au vyombo wazi.' }
        ],
        takeaways: [
          'Chemsha maji hadi yachemke kwa mapovu mengi kwa angalau dakika 1 kamili ili kuua vijidudu vyote.',
          'Ukitumia klorini (WaterGuard), fuata maagizo ya chupa: kifuniko 1 kwa lita 20 za maji masafi.',
          'Subiri kila mara dakika 30 kamili baada ya kuweka klorini kabla ya kunywa maji hayo.',
          'Hifadhi maji kwenye vyombo vyenye shingo nyembamba au bomba; kamwe usitumbukize vikombe mikononi.'
        ],
        reflectionQuestion: 'Familia yako inatibu vipi maji ya kunywa hivi sasa? Je, mnachemsha, mnatumia klorini, au mnakunywa moja kwa moja kutoka bombani au kioski?',
        activity: 'Kagua chombo cha kuhifadhia maji ya kunywa nyumbani kwako. Je, kina mfuniko? Je, kina bomba au shingo nyembamba, au kila mtu anatumbukiza bilauri yake moja kwa moja ndani?',
        misconceptions: [
          { misconception: 'Ukiweka klorini kwenye maji inaua vijidudu ndani ya sekunde tano, kwa hiyo unaweza kunywa mara moja.', correction: 'Klorini inahitaji angalau dakika 30 kamili za mawasiliano ndani ya maji ili kuharibu kuta za seli za bakteria na virusi.' }
        ],
        sources: [
          'Wizara ya Afya Kenya: Mwongozo wa Matibabu Salama ya Maji na Uhifadhi Nyumbani (HWTS)',
          'Miongozo ya Vituo vya Kudhibiti Magonjwa (CDC): Mfumo wa Maji Salama'
        ]
      },
      {
        id: 'm4-l5',
        heading: 'Usafi wa Kibinafsi na Mazingira Kuzuia Magonjwa',
        objectives: [
          'Kuelewa nyakati muhimu na mbinu sahihi za kunawa mikono kwa sabuni na maji yanayotiririka.',
          'Kuchunguza ubunifu wa gharama nafuu wa kunawia: kifaa cha Tippy-Tap na chupa zenye maji ya sabuni.',
          'Kuchunguza njia salama za kutupa maji machafu ya nyumbani na taka ngumu.'
        ],
        paragraphs: [
          'Kutibu maji ya kunywa ni sehemu moja tu ya mnyororo wa kuzuia magonjwa. Vimelea vinavyosababisha magonjwa makali ya tumbo pia huenezwa kupitia mikono michafu, vyakula vilivyo wazi, na nyuso za mazingira. Kunawa mikono kwa ukamilifu kwa sabuni na maji yanayotiririka ni mojawapo ya hatua za afya ya umma zenye gharama nafuu zaidi duniani, iliyothibitishwa kupunguza magonjwa ya kuhara kwa zaidi ya asilimia 40.',
          'Kuna nyakati tano muhimu za kunawa mikono ambazo kila kijana lazima azingatie: 1. Baada ya kutoka chooni, 2. Baada ya kumsafisha mtoto aliyetoka chooni au kubadilisha nepi, 3. Kabla ya kuandaa au kushika chakula, 4. Kabla ya kula milo, na 5. Baada ya kushika taka au matope ya mafuriko. Kunawa mikono kunahitaji sabuni na maji yanayotiririka; kusukutua tu vidole kwenye bakuli la maji yaliyosimama hueneza vijidudu kutoka kwa mtu mmoja hadi mwingine.',
          'Katika ploti zinazokosa mabomba ya maji yanayotiririka, vijana wanaweza kutengeneza **Tippy-Tap**—kifaa cha kunawia mikono kinachofanya kazi bila kuguswa kwa mikono, kikitengenezwa kwa mtungi wa plastiki uliotumiwa, vijiti, na kamba inayoguswa kwa mguu. Mtumiaji anapokanyaga kamba, mtungi unainama na kumwaga maji yanayotiririka, hivyo mikono safi haigusi chombo chochote kichafu. Kuweka vyoo safi na kuchimba mashimo ya changarawe (soakaways) ya kumwaga maji ya kuoshea kunakamilisha kinga ya mtaa.'
        ],
        nairobiExample: 'Wakati wa tahadhari ya kipindupindu Ruaraka, vikundi vya vijana vilitengeneza Tippy-Taps nje ya vyoo vya ploti kwa kutumia mitungi ya lita 5 ya mafuta ya kupikia na kamba, na kutoa maji ya bure ya kunawia kwa mamia ya wakazi.',
        keyTerms: [
          { term: 'Tippy-Tap', definition: 'Kifaa rahisi cha kunawia mikono cha bei nafuu kinachoendeshwa kwa kanyagio la mguu bila mikono kugusa chombo.' },
          { term: 'Nyakati Muhimu za Kunawa', definition: 'Nyakati maalum za siku ambapo kunawa mikono kwa sabuni huleta matokeo makubwa zaidi ya kuzuia maambukizi.' },
          { term: 'Uso Unaobeba Vijidudu (Fomite)', definition: 'Kitu kisicho hai (kama komeo la mlango wa choo au koki ya bomba) kinachoweza kubeba na kueneza vijidudu.' },
          { term: 'Shimo la Maji ya Kuosha (Soakaway)', definition: 'Shimo lililojazwa mawe au changarawe linaloruhusu maji ya kuoshea kuzama ardhini bila kutengeneza madimbwi machafu.' }
        ],
        takeaways: [
          'Kunawa mikono kwa sabuni na maji yanayotiririka hupunguza magonjwa ya kuhara kwa zaidi ya 40%.',
          'Kamwe usinawe mikono kwenye bakuli la maji yaliyosimama; tumia maji yanayotiririka daima.',
          'Nyakati 5: baada ya choo, baada ya mtoto, kabla ya kupika, kabla ya kula, baada ya taka.',
          'Tippy-taps zilizotengenezwa kwa mitungi ya plastiki hutoa maji yanayotiririka bila kuguswa mikononi.'
        ],
        reflectionQuestion: 'Je, choo cha ploti yenu kina sabuni na maji yanayotiririka mlangoni? Majirani wanawezaje kuanzisha Tippy-Tap rahisi hapo?',
        activity: 'Fanya mazoezi ya kunawa mikono kwa sekunde 20 kwa usahihi: viganja, nyuma ya mikono, katikati ya vidole, vidole gumba, na chini ya kucha kwa sabuni na maji yanayotiririka.',
        misconceptions: [
          { misconception: 'Kusafisha mikono kwa maji pekee bila sabuni kunatosha kuua na kuondoa bakteria wote.', correction: 'Maji pekee hayawezi kuvunja mafuta yanayoshikilia bakteria na virusi kwenye ngozi; sabuni inahitajika kuondoa viini hivyo.' }
        ],
        sources: [
          'Miongozo ya WHO kuhusu Usafi wa Mikono Katika Jamii',
          'Viwango vya Maji, Usafi wa Mazingira na Afya (WASH) vya UNICEF'
        ]
      },
      {
        id: 'm4-l6',
        heading: 'Uthabiti wa Maji wa Jamii na Utunzaji wa Miundombinu',
        objectives: [
          'Kuchunguza mbinu za jamii za kuvuna na kuhifadhi maji mengi ya mvua.',
          'Kuchambua jukumu la vijana katika kulinda miundombinu ya maji ya manispaa.',
          'Kuunda mifumo ya uwajibikaji ya jamii kwa usalama wa maji na bei za haki.'
        ],
        paragraphs: [
          'Kujenga usalama wa kudumu wa maji katika makazi yasiyo rasmi kunahitaji kuvuka hatua za dharura za nyumba moja moja na kuelekea kwenye usimamizi wa pamoja wa miundombinu ya jamii. Wakati majanga ya tabianchi yanapokatiza usambazaji wa maji wa jiji, jamii zenye mifumo ya pamoja ya kuhifadhi na kutunza maji hupona haraka zaidi kuliko mitaa isiyo na mpangilio.',
          'Mkakati mmoja mzuri wa jamii ni **Uvunaji wa Maji ya Mvua (Rainwater Harvesting - RWH)**. Wakati wa mvua ndefu na fupi za Nairobi, mamilioni ya lita za maji safi ya angahewa humwagika kwenye paa za mabati na kutiririka kuelekea mitaro michafu. Kwa kuweka mifereji ya mabati na matanki makubwa ya kuhifadhi (kama matanki ya lita 5,000 au 10,000) yenye vizuizi vya maji machafu ya kwanza (first-flush diverters), shule, makanisa, na vituo vya vijana vinaweza kukusanya akiba kubwa ya maji safi yasiyo na chumvi kwa ajili ya matumizi ya dharura.',
          'Zaidi ya hayo, vijana wana jukumu muhimu kama walinzi wa miundombinu. Kuripoti mabomba yaliyopasuka, kuzuia njia za maji taka zisichanganywe na mabomba ya maji safi, kufuatilia kwamba vioski haviuzi maji juu ya bei elekezi za kaunti, na kushirikiana na Kampuni ya Maji ya Nairobi (NCWSC) kunahakikisha kuwa miundombinu ya umma inabaki salama. Uthabiti wa tabianchi hujengwa kupitia umiliki wa pamoja wa rasilimali za jamii.'
        ],
        nairobiExample: 'Huko Kibera, mashirika ya jamii kama mtandao wa maji safi wa SHOFCO hutumia mabomba yanayoning’inia angani (aerial piping) kusafirisha maji safi kuelekea vioskini, yakiepuka kabisa mitaro ya maji taka ya ardhini.',
        keyTerms: [
          { term: 'Uvunaji wa Maji ya Mvua (Rainwater Harvesting)', definition: 'Kukusanya na kuhifadhi maji ya mvua kutoka kwenye paa za majengo kwa matumizi kabla hayajapotea mitaroni.' },
          { term: 'Kizuia Maji ya Kwanza (First-Flush Diverter)', definition: 'Kifaa kinachotenga maji ya kwanza ya mvua (yenye vumbi na kinyesi cha ndege) yasiingie kwenye tanki kuu la kuhifadhi.' },
          { term: 'Ulinzi wa Miundombinu (Infrastructure Stewardship)', definition: 'Ufuatiliaji, matengenezo, na ulinzi wa huduma za umma unaoongozwa na wakazi wa jamii.' },
          { term: 'Mabomba ya Angani (Aerial Piping)', definition: 'Mabomba ya maji yanayopitishwa juu angani kwenye nguzo ili kuzuia kugusana na maji taka ya mitaro ya ardhini.' }
        ],
        takeaways: [
          'Uvunaji wa maji ya mvua kutoka kwenye paa hukusanya maelfu ya lita za maji laini wakati wa mvua.',
          'Vizuia maji ya kwanza huhakikisha vumbi la paa haliingii ndani ya tanki kuu la maji ya kunywa.',
          'Vikundi vya vijana vinaweza kufuatilia na kuripoti mabomba yaliyopasuka kuzuia upotevu wa maji.',
          'Mabomba ya angani yanatenganisha maji safi na maji taka ya ardhini kwa ufanisi mkubwa.'
        ],
        reflectionQuestion: 'Maji mengi kiasi gani ya mvua yanayotiririka kutoka kwenye paa la nyumba yako na kupotea bure wakati wa mvua kubwa? Mtaa wenu unawezaje kuyavuna na kuyahifadhi salama?',
        activity: 'Chora mfumo rahisi wa uvunaji maji ya mvua kwa ajili ya shule au kanisa la mtaani: onyesha mifereji ya paa, bomba la kutoa maji ya kwanza machafu, tanki kuu la kuhifadhi, na sehemu ya kufungulia maji.',
        misconceptions: [
          { misconception: 'Maji ya mvua yanayotoka kwenye paa daima ni safi kabisa bila kuhitaji kizuia uchafu au usafishaji wowote.', correction: 'Mvua ya dakika za kwanza huosha vumbi, masizi, na kinyesi cha ndege kutoka paani; kizuia maji ya kwanza kinahitajika kabla ya kuingiza maji safi tankini.' }
        ],
        sources: [
          'Miongozo ya Kiufundi ya Shirika la Maji ya Mvua Kenya',
          'Sera ya Maji na Usafi wa Mazingira ya Kaunti ya Jiji la Nairobi'
        ]
      }
    ],
    quiz: [
      {
        id: 'm4-q1',
        question: 'Zaidi ya asilimia 85 ya maji ya bomba ya manispaa ya Nairobi yanatoka wapi?',
        options: [
          'Kusukumiwa moja kwa moja kutoka Ziwa Victoria huko Kisumu.',
          'Vyanzo vya milimani katika safu za Aberdare na mabwawa kama Ndakaini.',
          'Mitambo ya kuondoa chumvi baharini pwani ya Mombasa.',
          'Mabwawa ya chini ya ardhi chini ya Mbuga ya Kitaifa ya Nairobi.'
        ],
        correctAnswer: 1,
        explanation: 'Zaidi ya 85% ya maji ya manispaa ya Nairobi hutoka kwenye vyanzo vya milima ya Aberdare vinavyolisha mabwawa ya Ndakaini na Sasumua.',
        difficulty: 'beginner',
        lessonRef: 'm4-l1',
        source: 'Kampuni ya Maji na Maji Taka ya Jiji la Nairobi (NCWSC)'
      },
      {
        id: 'm4-q2',
        question: '"Adhabu ya umaskini" (poverty penalty) inamaanisha nini kuhusu upatikanaji wa maji mijini Nairobi?',
        options: [
          'Kodi inayotozwa na benki kwa watu wasio na akiba.',
          'Wakazi wa kipato cha chini katika makazi yasiyo rasmi kulipa bei ya juu zaidi kwa kila lita ya maji kutoka kwa wachuuzi kuliko nyumba tajiri zenye mita za kaunti.',
          'Faini inayolipwa na kaya wanaposafisha matanki yao ya maji.',
          'Maji ya bure yanayogawiwa kwa ploti maskini pekee.'
        ],
        correctAnswer: 1,
        explanation: 'Kutokana na ukosefu wa mita rasmi na unyonyaji wa wachuuzi, familia maskini hulipa gharama ya juu zaidi kwa lita kuliko matajiri.',
        difficulty: 'intermediate',
        lessonRef: 'm4-l2',
        source: 'Mpango wa Maji wa Benki ya Dunia'
      },
      {
        id: 'm4-q3',
        question: 'Mafuriko ya ghafla husababishaje uchafuzi mtambuka ndani ya mabomba ya maji ya manispaa?',
        options: [
          'Mawingu ya mvua yana chumvi tupu kutoka Bahari ya Hindi.',
          'Maji ya mafuriko hufurisha vyoo vya mashimo na kinyesi, na shinikizo linaposhuka, maji machafu huvutwa ndani ya mabomba yaliyopasuka kupitia shinikizo hasi (back-siphonage).',
          'Mabomba ya maji hubadilika mara moja na kuwa mawe wakati wa mvua.',
          'Umeme ulioko majini huyeyusha klorini yote iliyomo bombani.'
        ],
        correctAnswer: 1,
        explanation: 'Mafuriko hufurisha maji taka, na shinikizo hasi ndani ya mabomba yaliyopasuka huvuta maji yenye vimelea vya kinyesi ndani ya mfumo wa maji safi.',
        difficulty: 'intermediate',
        lessonRef: 'm4-l3',
        source: 'Ufuatiliaji wa Magonjwa wa Wizara ya Afya Kenya'
      },
      {
        id: 'm4-q4',
        question: 'Ni kanuni ipi sahihi ya kuchemsha maji ya kunywa ili kuua vimelea vyote vya magonjwa?',
        options: [
          'Pasha maji hadi mapovu madogo yaonekane chini, kisha zima moto mara moja.',
          'Chemsha maji hadi yatokote kwa mapovu mengi ya fujo (rolling boil) kwa angalau dakika moja kamili.',
          'Chemsha maji ukiwa umeweka bati lenye kutu ndani yake.',
          'Weka maji juani kwa dakika kumi pekee.'
        ],
        correctAnswer: 1,
        explanation: 'Mchemko kamili wa fujo kwa angalau dakika 1 huhakikisha maji yamefikia joto linaloua bakteria, virusi, na vimelea vyote vya magonjwa.',
        difficulty: 'beginner',
        lessonRef: 'm4-l4',
        source: 'Miongozo ya WHO kuhusu Ubora wa Maji ya Kunywa'
      },
      {
        id: 'm4-q5',
        question: 'Unapotumia dawa iliyoidhinishwa ya klorini (kama WaterGuard) kusafisha maji safi ya kunywa, ni lazima usubiri kwa muda gani kabla ya kunywa?',
        options: [
          'Kunywa mara moja ndani ya sekunde kumi.',
          'Subiri angalau dakika 30 ili klorini ipate muda wa kuua vimelea vyote vya magonjwa.',
          'Subiri masaa 48 gizani.',
          'Chemsha maji na mafuta ya taa kwanza.'
        ],
        correctAnswer: 1,
        explanation: 'Klorini inahitaji angalau dakika 30 kamili za mawasiliano ndani ya maji ili kuharibu kuta za seli za bakteria na virusi vyote.',
        difficulty: 'beginner',
        lessonRef: 'm4-l4',
        source: 'Miongozo ya HWTS ya Wizara ya Afya Kenya'
      },
      {
        id: 'm4-q6',
        question: 'Kwa nini ni hatari kuhifadhi maji safi ya kunywa kwenye ndoo wazi ambapo kila mtu anatumbukiza bilauri?',
        options: [
          'Maji yatavukiza yote ndani ya saa moja.',
          'Mikono michafu, vikombe visivyooshwa, na wadudu huingiza bakteria kwa urahisi, na kusababisha kuchafuliwa upya kwa maji safi.',
          'Ndoo itawaka moto kutoka hewani.',
          'Ndoo za plastiki hubadilisha maji kuwa sumu ya asidi.'
        ],
        correctAnswer: 1,
        explanation: 'Kuingiza mikono na vyombo ndani ya chombo wazi huchafua tena maji yaliyosafishwa; hifadhi kwenye chombo chenye mfuniko na bomba.',
        difficulty: 'beginner',
        lessonRef: 'm4-l4',
        source: 'Mwongozo wa Mfumo wa Maji Salama wa CDC'
      },
      {
        id: 'm4-q7',
        question: 'Kwa nini kifaa cha Tippy-Tap ni salama zaidi kwa kunawa mikono kuliko bakuli la maji yaliyosimama katika ploti?',
        options: [
          'Tippy-taps hutumia mashine ghali za umeme kutoka nchi za nje.',
          'Hutoa maji yanayotiririka yanayoendeshwa kwa kanyagio la mguu, na kuzuia mikono kugusa koki chafu au kuoshea kwenye maji ya pamoja yaliyochafuka.',
          'Hupasha maji moto hadi kuchemka kiasili.',
          'Hunyunyizia manukato badala ya sabuni.'
        ],
        correctAnswer: 1,
        explanation: 'Tippy-Tap inayoendeshwa kwa mguu inaruhusu mtu kunawa kwa maji safi yanayotiririka bila kugusa chombo chochote kwa mikono iliyooshwa.',
        difficulty: 'intermediate',
        lessonRef: 'm4-l5',
        source: 'Miongozo ya Kiufundi ya WASH ya UNICEF'
      },
      {
        id: 'm4-q8',
        question: 'Kazi ya "kizuia maji ya kwanza" (first-flush diverter) katika mfumo wa kuvuna maji ya mvua ni nini?',
        options: [
          'Huongeza sukari kwenye maji ili yawe matamu.',
          'Hutenga na kumwaga maji ya kwanza machafu ya paa (yenye vumbi, masizi, na kinyesi cha ndege) mbali na tanki kuu kabla ya kukusanya maji safi.',
          'Hupiga maji teke kurudi mawinguni.',
          'Huzuia mvua isinyeshe juu ya paa la nyumba.'
        ],
        correctAnswer: 1,
        explanation: 'Kizuia maji ya kwanza hutenga uchafu wa awali unaoosha paa, na kuhakikisha maji safi yanayofuata ndiyo yanayoingia kwenye tanki la kuhifadhi.',
        difficulty: 'intermediate',
        lessonRef: 'm4-l6',
        source: 'Shirika la Maji ya Mvua Kenya'
      }
    ]
  }
];
