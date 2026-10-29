import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Users
} from 'lucide-react';

export default function About() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const pillars = [
    {
      title: isSwahili ? '1. Sayansi ya Hali Halisi ya Afrika' : '1. Africa-Grounded Climate Science',
      description: isSwahili 
        ? 'Maudhui yetu yamejengwa kwa kuzingatia hali halisi ya Nairobi na miji ya Afrika Mashariki, ikijumuisha data rasmi za Idara ya Hali ya Hewa Kenya (KMD) na ripoti za IPCC.' 
        : 'Curriculum structured specifically around the micro-climates, urban topographies, and municipal policies of Nairobi and East African cities, drawing on official KMD meteorological records and IPCC AR6 findings.'
    },
    {
      title: isSwahili ? '2. Mafunzo ya Vitendo Yanayotekelezeka' : '2. Actionable, Practical Learning',
      description: isSwahili 
        ? 'Badala ya nadharia tupu, kila somo linajumuisha mifano halisi ya mitaani—kutoka upandaji wa miti ya kiasili hadi kingo za mito (riparian buffers) na tathmini ya alama ya kaboni.' 
        : 'Beyond abstract theory, every module links directly to concrete neighbourhood interventions—from 30-meter riparian buffers and permeable bio-swales to cool-roof coatings and carbon audits.'
    },
    {
      title: isSwahili ? '3. Vyeti Vinavyothibitishwa Kisayansi' : '3. Verified Credential Registry',
      description: isSwahili 
        ? 'Vyeti vya jukwaa vinatolewa kwa wanafunzi waliokamilisha masomo yote, waliofaulu majaribio kwa kiwango cha 70%+, na kuwasilisha miradi iliyokaguliwa kulingana na vigezo rasmi.' 
        : 'Certificates are issued only upon passing verified 70%+ mastery assessments and submitting rubric-evaluated applied projects, each verifiable on our public verification ledger.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: isSwahili ? 'Mtaala wa Moduli (Modules)' : 'Foundational Modules',
      description: isSwahili 
        ? 'Moduli 7 zenye masomo 42 ya kina, zikijumuisha video, maandishi ya kusoma, istilahi muhimu, na maswali ya tafakari.' 
        : 'Seven structured modules covering Nairobi climate risk, urban drainage, heat mitigation, renewable energy transitions, circular waste management, and environmental justice rights.'
    },
    {
      number: '02',
      title: isSwahili ? 'Mifano Halisi ya Kenya (Case Studies)' : 'Kenyan Climate Case Studies',
      description: isSwahili 
        ? 'Uchunguzi wa kina wa miradi iliyotekelezwa kote Kenya, ikitofautisha matokeo yaliyopimwa na makadirio ya kinadharia.' 
        : 'Rigorous 400–700 word field studies documenting verifiable interventions across Kenya, clearly distinguishing measured outcomes from speculative estimates.'
    },
    {
      number: '03',
      title: isSwahili ? 'Zana za Vitendo (Tools & Calculators)' : 'Interactive Diagnostics',
      description: isSwahili 
        ? 'Kokotoa uzalishaji wa kaboni (IPCC Tier-1) na chunguza ramani za hatari za joto na mafuriko katika kaunti ya Nairobi.' 
        : 'Hands-on calculation tools including a bilingual Nairobi household carbon auditor and localized climate vulnerability maps.'
    },
    {
      number: '04',
      title: isSwahili ? 'Miradi ya Vitendo (Applied Projects)' : 'Applied Practical Projects',
      description: isSwahili 
        ? 'Wanafunzi huwasilisha miradi ya kiutendaji inayopimwa kwa vigezo rasmi (rubrics) kabla ya kupokea cheti kinachotambulika.' 
        : 'Learners apply lessons by drafting neighbourhood climate proposals, audit reports, or restoration plans evaluated by academic reviewers.'
    }
  ];

  return (
    <div className="min-h-full pb-24 bg-[#f8faf8] font-inter">
      {/* Hero Header */}
      <div className="bg-[#00331e] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Climate Justice Nairobi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {isSwahili 
              ? 'Kuhusu Jukwaa la Climate Justice Nairobi' 
              : 'Empowering African Communities Through Climate Education'}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {isSwahili
              ? 'Jukwaa huru la kielimu linalojitolea kutoa mafunzo thabiti ya mazingira, data za kisayansi, na zana za vitendo kwa vijana na jamii za Afrika Mashariki.'
              : 'An independent, open-access climate learning platform delivering rigorous environmental science, verifiable field evidence, and community resilience tools tailored for Nairobi and East Africa.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Core Mission Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-forest-green/10 text-forest-green flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isSwahili ? 'Dhamira Yetu (Our Mission)' : 'Our Mission & Pedagogical Vision'}
              </h2>
              <p className="text-xs text-gray-500">
                {isSwahili ? 'Kuziba pengo kati ya sayansi ya tabianchi na vitendo vya kijamii' : 'Bridging global climate science and localized grassroots action'}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {isSwahili
              ? 'Wakati mijadala ya mabadiliko ya tabianchi mara nyingi hufanyika katika ngazi za kimataifa, athari zake—kama vile mafuriko ya ghafla kando ya Mto Nairobi, kisiwa cha joto mjini (Urban Heat Island), na magonjwa yatokanayo na maji machafu—hukumba moja kwa moja familia za kipato cha chini na makazi yasiyo rasmi. Climate Justice Nairobi inalenga kuwapa vijana, wanafunzi, na viongozi wa jamii maarifa ya kisayansi na kisheria ili kuleta mabadiliko chanya.'
              : 'While global climate discourse often unfolds at international summits, the devastating physical impacts—severe riverbank overflows, deadly heatwaves under corrugated iron roofs, and waterborne disease spikes—fall heaviest upon informal settlements and vulnerable urban communities. Climate Justice Nairobi equips youth advocates, community organizers, and municipal decision-makers with the scientific foundation, policy literacy, and practical skills required to design resilient neighbourhoods.'}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-forest-green" />
            <span>{isSwahili ? 'Nguzo Kuu za Jukwaa' : 'Our Three Foundational Pillars'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-900 text-base">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How The Learning Architecture Fits Together */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-forest-green uppercase tracking-wider">
              {isSwahili ? 'Mfumo wa Kujifunza' : 'Integrated Learning Architecture'}
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-1">
              {isSwahili ? 'Jinsi Masomo, Mifano, na Miradi Inavyoungana' : 'How Modules, Case Studies & Projects Connect'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              {isSwahili 
                ? 'Jukwaa limepangwa katika mlolongo unaoanzia msingi wa sayansi hadi utekelezaji wa miradi halisi ya kijamii.'
                : 'Each component reinforces the next, guiding learners from conceptual science to verifiable community action.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-200/80 space-y-2">
                <span className="font-mono text-xs font-bold text-forest-green bg-forest-green/10 px-2 py-0.5 rounded-md">
                  {st.number}
                </span>
                <h3 className="font-bold text-gray-900 text-sm">{st.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Sourcing & Scientific Review Policy */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isSwahili ? 'Uhakiki wa Maudhui na Uadilifu wa Kisayansi' : 'Scientific Sourcing & Review Standards'}
              </h2>
              <p className="text-xs text-gray-500">
                {isSwahili ? 'Uadilifu bila makadirio ya uongo au matangazo ya kibiashara' : 'Strict verification standards without greenwashing or unsupported claims'}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>
              {isSwahili
                ? 'Maudhui yote ya jukwaa yanakaguliwa kulingana na data rasmi za serikali na taasisi za kimataifa, zikiwemo Wizara ya Mazingira na Mabadiliko ya Tabianchi Kenya, NEMA, KFS, Idara ya Hali ya Hewa Kenya (KMD), na UNEP. Hatutoi madai ya takwimu bila chanzo maalum cha mwaka na taasisi husika.'
                : 'All platform curriculum materials and case studies are compiled from peer-reviewed scientific literature and public agency documentation, including Kenya’s Ministry of Environment, Climate Change and Forestry, the National Environment Management Authority (NEMA), Kenya Forest Service (KFS), Kenya Meteorological Department (KMD), and the United Nations Environment Programme (UNEP).'}
            </p>
            <p>
              {isSwahili
                ? 'Katika uchunguzi wa mifano ya Kenya, tunatofautisha wazi kati ya matokeo yaliyopimwa moja kwa moja (kama vile hekta za kingo za mito zilizorejeshwa au megawati za jotoardhi) na makadirio ya kinadharia au mipango ya baadaye. Wanafunzi na wakufunzi wanaweza pia kutumia kichupo cha Maswali na Majibu au kutoa maoni ikiwa taarifa yoyote inahitaji marekebisho.'
                : 'In our Kenyan case studies, we rigorously distinguish between measured, documented physical outcomes (e.g., surveyed riparian vegetation recovery, recorded geothermal megawatts, or verified mangrove blue carbon tonnes) and model estimates or future policy proposals. Furthermore, learners and educators can flag potential inaccuracies directly via our Help and feedback channels for prompt scientific review.'}
            </p>
          </div>
        </div>

        {/* Intended Learners */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isSwahili ? 'Walengwa wa Jukwaa Hili' : 'Who This Platform Is For'}
              </h2>
              <p className="text-xs text-gray-500">
                {isSwahili ? 'Kuanzia wanafunzi wa awali hadi wataalamu wa sera' : 'From emerging grassroots advocates to municipal practitioners'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <h3 className="font-bold text-xs text-gray-900">{isSwahili ? 'Vijana na Jamii za Mitaani' : 'Youth & Community Advocates'}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isSwahili ? 'Vijana wanaoishi katika makazi ya Nairobi wanaotaka kulinda mazingira na kuongoza miradi ya mtaani.' : 'Youth and informal settlement residents seeking actionable understanding of local flood risks, heat hazards, and waste solutions.'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <h3 className="font-bold text-xs text-gray-900">{isSwahili ? 'Wanafunzi wa Vyuo na Shule' : 'Students & Researchers'}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isSwahili ? 'Wanafunzi wa jiografia, mipango miji, na sayansi ya mazingira wanaohitaji mifano ya Afrika Mashariki.' : 'Environmental science, urban planning, and geography scholars seeking localized African field evidence and bilingual study packs.'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <h3 className="font-bold text-xs text-gray-900">{isSwahili ? 'Waratibu na Watunga Sera' : 'Practitioners & Planners'}</h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {isSwahili ? 'Kamati za wadi na mashirika ya kijamii yanayounda mipango ya kukabiliana na maafa ya hali ya hewa.' : 'Ward climate committees, NGO practitioners, and civic actors evaluating NBS riparian buffers and drainage investments.'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Hub Links */}
        <div className="mt-12 p-8 bg-[#00331e] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl font-bold">
              {isSwahili ? 'Uko tayari kuanza safari yako ya masomo?' : 'Ready to Start Your Climate Journey?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200">
              {isSwahili ? 'Gundua njia 6 za masomo au soma mifano halisi ya Afrika.' : 'Explore 6 structured pathways or inspect our documented African case studies.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/pathways"
              className="px-5 py-2.5 bg-white text-forest-green hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-2"
            >
              <span>{isSwahili ? 'Angalia Njia za Masomo' : 'Explore Pathways'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/case-studies"
              className="px-5 py-2.5 bg-forest-green border border-emerald-700 hover:bg-forest-green/80 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <span>{isSwahili ? 'Mifano ya Afrika' : 'Field Case Studies'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
