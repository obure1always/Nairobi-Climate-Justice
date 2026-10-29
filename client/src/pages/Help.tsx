import { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Globe2,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { faqs } from '../data/faqs';

interface HelpTopic {
  id: string;
  category: 'account' | 'courses' | 'video' | 'transcripts' | 'quizzes' | 'certificates';
  title: { en: string; sw: string };
  content: { en: string; sw: string };
  troubleshootingTips?: { en: string; sw: string }[];
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'topic-auth-options',
    category: 'account',
    title: {
      en: 'How to Register, Sign In, and Preserve Guest Progress',
      sw: 'Jinsi ya Kujiandikisha, Kuingia, na Kuhifadhi Maendeleo ya Mgeni'
    },
    content: {
      en: 'You can explore Climate Justice Nairobi completely anonymously in Guest Mode without entering any credentials. When you are ready to earn verifiable certificates, you can register using an Email & Password, Phone SMS OTP (Kenya +254), or Google OAuth. Any modules completed during your guest session can be transferred automatically to your new permanent account upon sign-in.',
      sw: 'Unaweza kuchunguza jukwaa bila kujiandikisha katika Hali ya Mgeni. Ukiwa tayari kupokea vyeti vinavyotambulika, unaweza kusajili akaunti kwa Barua Pepe, Msimbo wa Simu wa SMS (Kenya +254), au Google. Masomo uliyomaliza ukiwa mgeni yatahamishiwa kiotomatiki kwenye akaunti yako mpya pindi unapoingia.'
    },
    troubleshootingTips: [
      {
        en: 'Did not receive phone OTP code? Verify your mobile network signal and confirm your Kenyan mobile number (+254). If the SMS gateway is currently offline or undergoing maintenance, please sign in with Email & Password.',
        sw: 'Hukupata msimbo wa SMS? Hakikisha mtandao wa simu yako na uhakikishe nambari ya Kenya (+254). Iwapo lango la SMS linakaguliwa, tafadhali ingia kwa Barua Pepe na Nenosiri.'
      },
      {
        en: 'Forgot email password? Use the single-use recovery code generated upon registration to reset your password securely on the login screen.',
        sw: 'Umesahau nenosiri? Tumia msimbo wako wa dharura uliopewa wakati wa usajili kubadili nenosiri kwenye ukurasa wa kuingia.'
      }
    ]
  },
  {
    id: 'topic-course-navigation',
    category: 'courses',
    title: {
      en: 'Navigating Courses, Pathways, and Prerequisites',
      sw: 'Kupitia Kozi, Njia za Masomo (Pathways), na Masharti'
    },
    content: {
      en: 'The curriculum is organized into 6 learning pathways ranging from foundational climate science to municipal adaptation policy. Each pathway contains linked modules (M1 through M7) and 42 total substantive lessons. You can track completion percentages on your Dashboard. Each lesson includes explanatory paragraphs, practical field examples, key term definitions, and community reflection prompts.',
      sw: 'Mtaala umegawanywa katika njia 6 za masomo kuanzia misingi ya sayansi hadi sera za mitaa. Kila njia ina moduli (M1 hadi M7) na jumla ya masomo 42. Unaweza kuangalia asilimia ya maendeleo yako kwenye Dashibodi. Kila somo linajumuisha maelezo, mifano ya mitaani, istilahi muhimu, na maswali ya tafakari.'
    }
  },
  {
    id: 'topic-video-playback',
    category: 'video',
    title: {
      en: 'Video Playback, Player Controls, and Connectivity Troubleshooting',
      sw: 'Uchezaji wa Video, Vifungo vya Kichezaji, na Utatuzi wa Mtandao'
    },
    content: {
      en: 'Lessons advertised as video or simulation lessons feature integrated playback with verified recordings, scrubbing timeline sliders, volume toggles, elapsed counters, and speed controls. Text lessons provide comprehensive reading material with estimated reading times, reflection prompts, and field cases.',
      sw: 'Masomo yenye video au simulizi za kisayansi yanajumuisha kichezaji cha moja kwa moja chenye picha halisi, upau wa kusogeza mbele/nyuma, sauti, na chaguo za kasi. Masomo mengine yanajumuisha maandishi kamili ya kusoma yenye makadirio ya muda, maswali ya tafakari, na mifano ya mtaani.'
    },
    troubleshootingTips: [
      {
        en: 'Video does not start or buffers slowly? Videos are served as standard MP4/WebM streams. Check your internet connection or pause the video for 5 seconds to buffer sufficient data before playing.',
        sw: 'Video haianzi au inachelewa? Video zimehifadhiwa kwa muundo wa MP4/WebM. Angalia muunganisho wa mtandao au simamisha video kwa sekunde chache ili ipate kupakia.'
      },
      {
        en: 'No audio sound? Check the speaker icon on the player control bar to ensure it is not muted, and verify your device volume settings.',
        sw: 'Hakuna sauti? Angalia aikoni ya spika kwenye kichezaji ili kuhakikisha haijazimwa, na uhakiki sauti ya kifaa chako.'
      },
      {
        en: 'Resume playback position: The player automatically remembers your timestamp locally so you can resume where you left off when returning to a lesson.',
        sw: 'Kuendelea pale ulipoishia: Kichezaji kinakumbuka dakika uliyofikia kwenye kifaa chako hata ukifunga kivinjari.'
      }
    ]
  },
  {
    id: 'topic-transcripts-downloads',
    category: 'transcripts',
    title: {
      en: 'Interactive Transcripts, Audio Narration & Offline Downloads',
      sw: 'Maandishi ya Video, Sauti ya Kusoma, na Nyaraka za Kupakua'
    },
    content: {
      en: 'For lessons with recorded audio or video presentations, switch to the "Interactive Transcript" tab to read full synchronized dialogue or timeline milestones. For all lessons, use the "Downloadable Notes" tab to export complete lesson notes as Markdown (.md) or print them for offline community study.',
      sw: 'Kwa masomo yenye sauti au video, fungua kichupo cha "Interactive Transcript" kusoma maneno yaliyopatanishwa na video. Kwa masomo yote, unaweza kutumia "Downloadable Notes" kupakua nyaraka kama Markdown (.md) au kuzichapisha kwa ajili ya kusoma nje ya mtandao.'
    },
    troubleshootingTips: [
      {
        en: 'Bilingual speech synthesis: Click the "Listen" button at the top right of any lesson to hear the text read aloud in English or Kiswahili at your preferred reading speed.',
        sw: 'Sauti ya kusoma: Bonyeza kitufe cha "Sikiliza" juu kulia mwa somo lolote kusikiliza somo likisomwa kwa Kiswahili au Kiingereza.'
      }
    ]
  },
  {
    id: 'topic-quizzes-projects',
    category: 'quizzes',
    title: {
      en: 'Module Quizzes, 70% Mastery Threshold & Practical Projects',
      sw: 'Majaribio ya Maswali, Kiwango cha 70% cha Ufaulu, na Miradi ya Vitendo'
    },
    content: {
      en: 'At the end of each module, you will take a mastery quiz consisting of 5 substantive questions. A passing score of 70% or higher is required to unlock certificate eligibility. You may retake quizzes if needed to master key concepts. For pathways requiring applied projects, you can submit reports or public links (Google Drive, GitHub) for rubric-based faculty evaluation.',
      sw: 'Mwishoni mwa kila moduli, utafanya jaribio la maswali 5. Alama ya kufaulu ya 70% au zaidi inahitajika ili kufuzu cheti. Unaweza kurudia jaribio mara kadhaa ili kuelewa vyema. Kwa njia zenye miradi ya vitendo, unaweza kuwasilisha ripoti au viungo vya mtandaoni ili vikaguliwe.'
    }
  },
  {
    id: 'topic-certificates-verification',
    category: 'certificates',
    title: {
      en: 'Verifiable Certificates & Public Credential Verification',
      sw: 'Vyeti Vinavyothibitishwa na Uhakiki wa Umma'
    },
    content: {
      en: 'Completed pathway certificates feature tamper-evident credential IDs and QR codes. Anyone—employers, community organizations, or institutional partners—can verify the authenticity and distinction of your certificate by visiting /verify/:certId directly on our public verification ledger.',
      sw: 'Vyeti vyote vya masomo vinajumuisha nambari maalum ya uthibitishaji na msimbo wa QR. Mwajiri yeyote, shirika la jamii, au mshirika wa kitaasisi anaweza kuthibitisha ukweli wa cheti chako kwa kufungua kiungo cha /verify/:certId kwenye rejista yetu ya umma.'
    }
  }
];

export default function Help() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isSwahili = language === 'sw';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
    'topic-video-playback': true,
    'topic-auth-options': true
  });

  // Support Ticket Form State
  const [ticketName, setTicketName] = useState(user?.displayName || user?.name || '');
  const [ticketEmail, setTicketEmail] = useState(user?.email || '');
  const [ticketCategory, setTicketCategory] = useState('video');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [ticketReference, setTicketReference] = useState<string | null>(null);
  const [ticketError, setTicketError] = useState<string | null>(null);

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter topics by category and search query
  const filteredTopics = useMemo(() => {
    return HELP_TOPICS.filter(t => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (t.title[isSwahili ? 'sw' : 'en'] || t.title.en).toLowerCase();
      const content = (t.content[isSwahili ? 'sw' : 'en'] || t.content.en).toLowerCase();
      return title.includes(q) || content.includes(q);
    });
  }, [selectedCategory, searchQuery, isSwahili]);

  // Filter Climate FAQs as supplementary search results
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return faqs.filter(f => 
      f.question.en.toLowerCase().includes(q) ||
      f.question.sw.toLowerCase().includes(q) ||
      f.answer.en.toLowerCase().includes(q) ||
      f.answer.sw.toLowerCase().includes(q) ||
      f.keywords.some(k => k.toLowerCase().includes(q))
    ).slice(0, 4);
  }, [searchQuery]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketError(null);
    setTicketSuccess(null);
    setTicketReference(null);

    if (!ticketName.trim()) {
      setTicketError(isSwahili ? 'Tafadhali ingiza jina lako.' : 'Please enter your name.');
      return;
    }
    if (!ticketEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketEmail.trim())) {
      setTicketError(isSwahili ? 'Tafadhali ingiza barua pepe sahihi.' : 'Please enter a valid email address.');
      return;
    }
    if (!ticketSubject.trim()) {
      setTicketError(isSwahili ? 'Tafadhali ingiza mada ya swali.' : 'Please enter a subject.');
      return;
    }
    if (!ticketMessage.trim() || ticketMessage.trim().length < 10) {
      setTicketError(isSwahili ? 'Ujumbe lazima uwe na herufi angalau 10.' : 'Message must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('climate_justice_token') || localStorage.getItem('climate_justice_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: ticketName.trim(),
          email: ticketEmail.trim(),
          category: ticketCategory,
          subject: ticketSubject.trim(),
          message: ticketMessage.trim()
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry to support server');
      }

      setTicketSuccess(data.message || 'Your inquiry has been successfully received.');
      setTicketReference(data.ticketId);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      setTicketError(err.message || 'Unable to submit support inquiry. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full pb-24 bg-[#f8faf8] font-inter">
      {/* Hero Header */}
      <div className="bg-[#00331e] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>{isSwahili ? 'Kituo cha Msaada' : 'Learner Support & Knowledge Base'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isSwahili ? 'Tunawezaje Kukusaidia Leo?' : 'How Can We Support Your Learning?'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto">
            {isSwahili
              ? 'Tafuta miongozo ya video, usajili, vyeti, utatuzi wa mtandao, au wasilisha swali kwa wakufunzi.'
              : 'Substantive troubleshooting for video playback, offline study packs, quizzes, certificates, and direct technical support.'}
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSwahili ? 'Tafuta mada (k.m. video, vyeti, nenosiri, kupakua)...' : 'Search guides & FAQs (e.g., video buffering, transcripts, certificates, offline)...'}
                className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 rounded-2xl text-sm font-medium shadow-lg outline-none focus:ring-4 focus:ring-emerald-500/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full px-2 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: isSwahili ? 'Mada Zote' : 'All Topics' },
            { id: 'video', label: isSwahili ? 'Video na Utatuzi' : 'Video & Playback' },
            { id: 'account', label: isSwahili ? 'Akaunti na Kuingia' : 'Account & Access' },
            { id: 'courses', label: isSwahili ? 'Kozi na Mtaala' : 'Courses & Curriculum' },
            { id: 'transcripts', label: isSwahili ? 'Maandishi na Kupakua' : 'Transcripts & Notes' },
            { id: 'quizzes', label: isSwahili ? 'Majaribio na Miradi' : 'Quizzes & Projects' },
            { id: 'certificates', label: isSwahili ? 'Uhakiki wa Vyeti' : 'Certificates' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id 
                  ? 'bg-forest-green text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Section 1: Detailed Guides & Topics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-forest-green" />
              <span>{isSwahili ? 'Miongozo ya Masomo na Utatuzi' : 'Detailed Learning Guides'}</span>
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {filteredTopics.length} {filteredTopics.length === 1 ? 'guide' : 'guides'}
            </span>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="p-8 bg-white rounded-3xl border border-gray-200 text-center text-gray-500 text-xs sm:text-sm">
              {isSwahili ? 'Hakuna mwongozo uliopatikana unaolingana na utafutaji wako.' : 'No help guides match your search query. Try other keywords or submit an inquiry below.'}
            </div>
          ) : (
            filteredTopics.map(topic => {
              const isExpanded = Boolean(expandedTopics[topic.id]);
              return (
                <div key={topic.id} className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden transition-all">
                  <button
                    onClick={() => toggleTopic(topic.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-gray-50/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-forest-green/10 text-forest-green flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                          {topic.title[isSwahili ? 'sw' : 'en'] || topic.title.en}
                        </h3>
                        <span className="text-[10px] font-bold text-forest-green uppercase tracking-wider mt-1 block">
                          Category: {topic.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-400 mt-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4">
                      <p>{topic.content[isSwahili ? 'sw' : 'en'] || topic.content.en}</p>

                      {topic.troubleshootingTips && topic.troubleshootingTips.length > 0 && (
                        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-700" />
                            <span>{isSwahili ? 'Vidokezo vya Utatuzi wa Haraka:' : 'Troubleshooting Checklist:'}</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-emerald-950">
                            {topic.troubleshootingTips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{tip[isSwahili ? 'sw' : 'en'] || tip.en}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Supplementary Climate Science FAQs matching query */}
        {filteredFaqs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-forest-green" />
              <span>{isSwahili ? 'Maswali ya Kisayansi Yaliyolingana' : 'Matching Climate Science FAQs'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFaqs.map(faq => (
                <div key={faq.id} className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                    {faq.question[isSwahili ? 'sw' : 'en'] || faq.question.en}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {faq.answer[isSwahili ? 'sw' : 'en'] || faq.answer.en}
                  </p>
                  <span className="text-[10px] text-gray-400 block pt-1">
                    Source: {faq.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Lesson-Specific Q&A Guidance */}
        <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>💬</span>
              <span>{isSwahili ? 'Je, Una Swali Kuhusu Somo Maalum?' : 'Have a Question on a Specific Lesson?'}</span>
            </h3>
            <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
              {isSwahili 
                ? 'Kila somo lina kichupo cha "Uliza Swali (Q&A)" ambapo unaweza kuwasilisha swali moja kwa moja kwa mwalimu wa moduli husika.'
                : 'Inside any course lesson player, click the "Ask a Question (Q&A)" tab. Inquiries are linked directly to that lesson and answered publicly for all cohort learners.'}
            </p>
          </div>
          <a
            href="/learn"
            className="self-start sm:self-center shrink-0 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-forest-green rounded-xl text-xs font-bold transition border border-emerald-200"
          >
            {isSwahili ? 'Fungua Mtaala' : 'Go to Lessons'}
          </a>
        </div>

        {/* Section 3: Genuine Support Submission Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-forest-green uppercase tracking-wider">
              {isSwahili ? 'Usaidizi wa Moja kwa Moja' : 'Direct Support Helpdesk'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">
              {isSwahili ? 'Wasilisha Swali au Ripoti Tatizo' : 'Submit a Support Inquiry'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isSwahili
                ? 'Tuma ombi lako kwa timu ya kiufundi na wakufunzi. Tiketi yako itarekodiwa na kupokea nambari ya uthibitisho.'
                : 'Log a technical or curriculum inquiry directly with our support desk. Each submission receives a permanent reference ID.'}
            </p>
          </div>

          {ticketSuccess && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-sm">{isSwahili ? 'Ombi Lako Limepokelewa!' : 'Inquiry Logged Successfully!'}</h4>
              </div>
              <p className="text-xs leading-relaxed">{ticketSuccess}</p>
              {ticketReference && (
                <div className="pt-2">
                  <span className="text-xs text-gray-500">Official Ticket Reference: </span>
                  <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-900">
                    {ticketReference}
                  </span>
                </div>
              )}
            </div>
          )}

          {ticketError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{ticketError}</span>
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Jina Lako Kamili *' : 'Your Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="e.g. Amina Wanjiku"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Barua Pepe ya Majibu *' : 'Email Address for Response *'}
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Aina ya Tatizo / Kategoria *' : 'Inquiry Category *'}
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
                >
                  <option value="video">Video Playback / Streaming Error</option>
                  <option value="account">Sign-In / Password / Phone OTP</option>
                  <option value="certificates">Certificate Verification / QR</option>
                  <option value="quizzes">Quizzes & Project Evaluations</option>
                  <option value="curriculum">Curriculum Question / Fact Check</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isSwahili ? 'Mada ya Swali *' : 'Subject Line *'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Video buffering on Module 2 Lesson 3"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isSwahili ? 'Ujumbe / Maelezo ya Tatizo (Herufi 10+) *' : 'Detailed Message / Description *'}
              </label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder={isSwahili ? 'Eleza tatizo unalokumbana nalo kwa kina...' : 'Describe what happened, the lesson you were studying, or the question you have...'}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-forest-green"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (isSwahili ? 'Inatuma...' : 'Logging Inquiry...') : (isSwahili ? 'Wasilisha Ombi la Msaada' : 'Submit Support Ticket')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
