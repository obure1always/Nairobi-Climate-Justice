import { useLanguage } from '../LanguageContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Star, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { modules } from '../data/modules';

export default function Progress() {
  const { language } = useLanguage();
  const { progress, achievements } = useProgress();
  const navigate = useNavigate();
  const isSwahili = language === 'sw';
  const currentModules = modules[language];

  const completedModulesCount = Object.values(progress).filter(p => p.completed).length;
  const totalModules = currentModules.length;

  // Total lessons completed calculation
  const totalLessonsCount = currentModules.reduce((acc, m) => acc + m.content.length, 0);
  const completedLessonsCount = Object.values(progress).reduce(
    (acc, p) => acc + (p.completedLessons?.length || 0), 
    0
  );

  // Deterministic, Explainable Adaptive Recommendation Engine
  let recommendation: {
    title: string;
    reason: string;
    actionLabel: string;
    actionUrl: string;
    type: 'continue' | 'next' | 'practice' | 'congrats';
  };

  // 1. Check for in-progress module
  const inProgressModule = currentModules.find(m => {
    const p = progress[m.id];
    return p && !p.completed && (p.completedLessons?.length || 0) > 0;
  });

  // 2. Check for next unstarted module
  const nextUnstartedModule = currentModules.find(m => {
    const p = progress[m.id];
    return !p || (!p.completed && (!p.completedLessons || p.completedLessons.length === 0));
  });

  if (inProgressModule) {
    const p = progress[inProgressModule.id];
    recommendation = {
      title: `${isSwahili ? 'Endelea na: ' : 'Resume: '}${inProgressModule.title}`,
      reason: isSwahili
        ? `Umekamilisha masomo ${p.completedLessons.length} kati ya ${inProgressModule.content.length}. Kamilisha masomo yaliyobaki kisha ufanye jaribio la maswali.`
        : `You completed ${p.completedLessons.length} of ${inProgressModule.content.length} lessons. Finish remaining lessons to take the module quiz.`,
      actionLabel: isSwahili ? 'Endelea Kujifunza' : 'Resume Lesson',
      actionUrl: `/module/${inProgressModule.id}`,
      type: 'continue'
    };
  } else if (completedModulesCount === totalModules) {
    recommendation = {
      title: isSwahili ? 'Hongera Sana! Umekamilisha Mtaala Mzima!' : 'Congratulations! Full Curriculum Completed!',
      reason: isSwahili
        ? 'Umekamilisha moduli zote 7 za haki ya tabianchi. Jaribu mazoezi ya uamuzi 14 au kagua miongozo ya vitendo vya jamii.'
        : 'You have mastered all seven Nairobi climate justice modules. Test your decisions in Scenarios or review Action Guides.',
      actionLabel: isSwahili ? 'Jaribu Matukio ya Uamuzi' : 'Explore Decision Scenarios',
      actionUrl: '/scenarios',
      type: 'congrats'
    };
  } else if (nextUnstartedModule) {
    recommendation = {
      title: `${isSwahili ? 'Hatua Inayofuata: ' : 'Recommended Next Module: '}${nextUnstartedModule.title}`,
      reason: isSwahili
        ? `Kulingana na mpangilio wa mtaala, moduli hii inajenga maarifa juu ya yale uliyojifunza awali.`
        : `Based on your curriculum progression, this module provides the next logical step in your climate literacy.`,
      actionLabel: isSwahili ? 'Anza Moduli Hii' : 'Start This Module',
      actionUrl: `/module/${nextUnstartedModule.id}`,
      type: 'next'
    };
  } else {
    recommendation = {
      title: isSwahili ? 'Anza Safari Yako ya Tabianchi' : 'Start Your Climate Learning Journey',
      reason: isSwahili
        ? 'Moduli ya 1: Hatari ya Hali ya Hewa Nairobi inatoa msingi imara wa kuelewa hali ya anga na mji wetu.'
        : 'Module 1: Nairobi Climate Risk provides the essential foundation for understanding urban climate patterns.',
      actionLabel: isSwahili ? 'Anza Moduli ya 1' : 'Start Module 1',
      actionUrl: `/module/m1`,
      type: 'next'
    };
  }

  // Achievement definitions with bilingual labels
  const achievementMetadata: Record<string, { titleEn: string; titleSw: string; descEn: string; descSw: string }> = {
    FIRST_STEP: {
      titleEn: 'First Step in Climate Literacy',
      titleSw: 'Hatua ya Kwanza ya Tabianchi',
      descEn: 'Completed Nairobi Climate Risk module.',
      descSw: 'Umekamilisha moduli ya Hatari ya Hali ya Hewa Nairobi.'
    },
    FLOOD_READY: {
      titleEn: 'Urban Flood Preparedness Master',
      titleSw: 'Mtaalamu wa Kujiandaa na Mafuriko',
      descEn: 'Completed Urban Flooding module and safety quizzes.',
      descSw: 'Umekamilisha moduli ya Mafuriko ya Mjini na usalama.'
    },
    HEAT_AWARE: {
      titleEn: 'Heat & Health Awareness Champion',
      titleSw: 'Mshindi wa Elimu ya Joto na Afya',
      descEn: 'Mastered thermal comfort and heat illness prevention.',
      descSw: 'Umeelewa upoezaji wa nyumba na kuzuia magonjwa ya joto.'
    },
    WATER_WISE: {
      titleEn: 'Water Safety & Health Guardian',
      titleSw: 'Mlinzi wa Usalama wa Maji na Afya',
      descEn: 'Learned correct chlorination and cholera prevention.',
      descSw: 'Umejifunza kutibu maji na kuzuia kipindupindu.'
    },
    JUSTICE_EXPLORER: {
      titleEn: 'Climate Justice Advocate',
      titleSw: 'Mtetezi wa Haki ya Tabianchi',
      descEn: 'Explored equity, CBDR, and locally led adaptation.',
      descSw: 'Umechunguza usawa na kukabiliana kunakoongozwa na jamii.'
    },
    CLAIM_CHECKER: {
      titleEn: 'Green Claims Fact-Checker',
      titleSw: 'Mhakiki wa Madai ya Kijani',
      descEn: 'Mastered greenwashing detection and eco-labels.',
      descSw: 'Umebaini mbinu za greenwashing na lebo za kweli.'
    },
    COMMUNITY_VOICE: {
      titleEn: 'Civic Participation Leader',
      titleSw: 'Kiongozi wa Ushiriki wa Kiraia',
      descEn: 'Mastered constitutional rights and written memorandums.',
      descSw: 'Umeelewa haki za kikatiba na kuandika memoranda.'
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {isSwahili ? 'Maendeleo na Ustahimilivu Wako' : 'Learning Progress & Recommendations'}
        </h1>
        <p className="text-gray-600">
          {isSwahili 
            ? 'Fuatilia masomo uliyosoma, alama za majaribio, na mapendekezo yaliyobinafsishwa yanayotegemea kanuni zilizo wazi.' 
            : 'Track your completed lessons, quiz scores, and transparent deterministic recommendations.'}
        </p>
      </div>

      {/* Adaptive Recommendation Card */}
      <div className="bg-gradient-to-br from-forest-green to-forest-green/90 text-white rounded-organic p-6 md:p-8 shadow-natural mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2">
          <Sparkles className="w-4 h-4" />
          {isSwahili ? 'Pendekezo Linalofuata (Kulingana na Masomo Yako)' : 'Explainable Next Recommendation'}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {recommendation.title}
        </h2>
        <p className="text-sm text-emerald-50 mb-6 leading-relaxed max-w-2xl">
          {recommendation.reason}
        </p>
        <button
          onClick={() => navigate(recommendation.actionUrl)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-forest-green font-bold text-sm hover:bg-emerald-50 transition shadow-sm"
        >
          <span>{recommendation.actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-natural text-center">
          <div className="w-12 h-12 rounded-full bg-forest-green/10 text-forest-green flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-gray-900">
            {completedModulesCount} / {totalModules}
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {isSwahili ? 'Moduli Zilizokamilika' : 'Modules Completed'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-natural text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-700 flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-gray-900">
            {completedLessonsCount} / {totalLessonsCount}
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {isSwahili ? 'Masomo Yaliyosomwa' : 'Lessons Completed'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-natural text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-gray-900">
            {achievements.length} / 7
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {isSwahili ? 'Mafanikio Yaliyofunguliwa' : 'Milestones Unlocked'}
          </p>
        </div>
      </div>

      {/* Module-by-Module Progress Breakdown */}
      <div className="bg-white rounded-organic border border-gray-200 p-6 md:p-8 shadow-natural mb-8">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-forest-green" />
          {isSwahili ? 'Maendeleo ya Kila Moduli (Moduli 7):' : 'Topic-Level Module Breakdown (7 Modules):'}
        </h3>

        <div className="space-y-4">
          {currentModules.map((m, idx) => {
            const p = progress[m.id];
            const isCompleted = p?.completed;
            const completedCount = p?.completedLessons?.length || 0;
            const total = m.content.length;
            const percent = isCompleted ? 100 : Math.round((completedCount / total) * 100);

            return (
              <div 
                key={m.id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-100/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-forest-green uppercase">
                      {isSwahili ? 'Moduli' : 'Module'} {idx + 1}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        {isSwahili ? 'Imekamilika' : 'Completed'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">
                    {m.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{completedCount} / {total} {isSwahili ? 'masomo' : 'lessons'}</span>
                    <span>•</span>
                    <span>{m.quiz.length} {isSwahili ? 'maswali' : 'quiz items'}</span>
                  </div>
                </div>

                <div className="sm:w-44 flex items-center gap-3">
                  <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-forest-green h-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-10 text-right">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Milestones & Badges */}
      <div className="bg-white rounded-organic border border-gray-200 p-6 md:p-8 shadow-natural">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          {isSwahili ? 'Mafanikio na Beji za Kujifunza:' : 'Personal Milestones & Achievements:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Object.entries(achievementMetadata).map(([id, meta]) => {
            const isUnlocked = achievements.includes(id);

            return (
              <div 
                key={id}
                className={`p-4 rounded-xl border transition flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isUnlocked ? 'bg-forest-green text-white shadow-sm' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {isSwahili ? meta.titleSw : meta.titleEn}
                  </h4>
                  <p className="text-xs mt-0.5">
                    {isSwahili ? meta.descSw : meta.descEn}
                  </p>
                  {isUnlocked && (
                    <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                      ✓ {isSwahili ? 'Imefunguliwa' : 'Unlocked'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
