import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Square, 
  Globe2, 
  WifiOff, 
  Sliders, 
  Play, 
  X, 
  Volume1, 
  Radio 
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { searchClimateBuddy, type AssistantQueryResult } from '../lib/assistantEngine';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  speakText, 
  stopSpeech, 
  isSpeechSupported, 
  getAvailableVoices, 
  getRankedVoices, 
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  getSpeechRate,
  setSpeechRate,
  cleanTextForSpeech,
  type VoiceOption
} from '../lib/speech';
import { audioCoordinator } from '../lib/audioCoordinator';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: 'online' | 'offline';
  source?: string;
  result?: AssistantQueryResult;
  timestamp: string;
}

export default function ClimateBuddy() {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineAvailable, setOnlineAvailable] = useState<boolean>(false);
  const [providerInfo, setProviderInfo] = useState<{ provider: string; model: string } | null>(null);
  const [forceOfflineMode, setForceOfflineMode] = useState<boolean>(false);
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [promptCategory, setPromptCategory] = useState<'all' | 'justice' | 'hazards' | 'action'>('all');

  // Voice Settings & Natural Voice Customization
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [speechRate, setLocalSpeechRate] = useState<number>(0.93);
  const [cloudTtsInfo, setCloudTtsInfo] = useState<{ available: boolean; provider: string; configuredVoice?: string; instructions: string } | null>(null);
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cloudAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize with Audio Coordinator to avoid overlapping playback
  useEffect(() => {
    const unsubscribe = audioCoordinator.subscribe((state) => {
      if (!state.isPlaying) {
        setSpeakingMessageId(null);
        setIsPlayingTestAudio(false);
      }
    });

    return () => {
      unsubscribe();
      stopSpeech();
    };
  }, []);

  // Fetch available voices & cloud TTS status
  useEffect(() => {
    getAvailableVoices().then((voices) => {
      const ranked = getRankedVoices(language, voices);
      setAvailableVoices(ranked);

      const savedURI = getPreferredVoiceURI();
      if (savedURI && voices.some(v => v.voiceURI === savedURI)) {
        setSelectedVoiceURI(savedURI);
      } else if (ranked.length > 0) {
        setSelectedVoiceURI(ranked[0].voice.voiceURI);
      }
    });

    setLocalSpeechRate(getSpeechRate());

    // Check optional cloud TTS status on server
    fetch('/api/v1/assistant/tts/status')
      .then(res => res.json())
      .then(data => {
        setCloudTtsInfo(data);
      })
      .catch(() => {
        setCloudTtsInfo({
          available: false,
          provider: 'Local Enhanced Web Speech API (Client-side)',
          instructions: 'Offline mode active.'
        });
      });
  }, [language]);

  // Check backend online status
  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const res = await fetch('/api/v1/assistant/status');
        if (res.ok) {
          const data = await res.json();
          setOnlineAvailable(Boolean(data.onlineAvailable));
          setProviderInfo({ provider: data.provider, model: data.model });
        }
      } catch {
        setOnlineAvailable(false);
      }
    };

    checkOnlineStatus();

    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnlineActive = isBrowserOnline && onlineAvailable && !forceOfflineMode;

  const quickPrompts = isSwahili
    ? [
        { cat: 'justice', text: 'Haki zangu chini ya Kifungu cha 42 cha Katiba ya Kenya ni zipi?' },
        { cat: 'justice', text: 'Kwa nini mitaa ya mabati kama Kibera inaumia zaidi kuliko vitongoji tajiri?' },
        { cat: 'justice', text: 'Kanuni ya "Mchafuzi Anayegharimu" (Polluter Pays) inatumikaje Kenya?' },
        { cat: 'justice', text: 'Ni nini fidia ya "Hasara na Uharibifu" (Loss & Damage) kwa vijana wa Afrika?' },
        { cat: 'hazards', text: 'Mafuriko ya ghafla ya mito ya Nairobi na Mathare yanatokeaje?' },
        { cat: 'hazards', text: 'Njia za bei nafuu za kupunguza joto kali ndani ya nyumba ya mabati?' },
        { cat: 'hazards', text: 'Kipimo sahihi cha kutibu maji kwa klorini ili kuzuia kipindupindu?' },
        { cat: 'hazards', text: 'Kisiwa cha joto cha mjini (Urban Heat Island) ni nini?' },
        { cat: 'action', text: 'Jinsi ya kuandika na kuwasilisha Memorandum kwa Bunge la Kaunti ya Nairobi?' },
        { cat: 'action', text: 'Mbinu za kugundua na kufichua upotoshaji wa kijani (Greenwashing)?' },
        { cat: 'action', text: 'Vitu muhimu vya kuweka kwenye mfuko wa dharura wa Go-Bag?' },
        { cat: 'action', text: 'Jinsi ya kuanzisha kamati ya vijana ya kusafisha mifereji mtaani?' }
      ]
    : [
        { cat: 'justice', text: 'What are my environmental rights under Article 42 of the Kenyan Constitution?' },
        { cat: 'justice', text: 'Why are informal settlements like Kibera more vulnerable to climate shocks?' },
        { cat: 'justice', text: 'How does the "Polluter Pays" principle apply in Kenyan environmental law?' },
        { cat: 'justice', text: 'What is "Loss and Damage" and what does climate debt mean for African youth?' },
        { cat: 'hazards', text: 'How do flash floods happen along Nairobi and Mathare River basins?' },
        { cat: 'hazards', text: 'What are low-cost ways to reduce extreme heat inside iron-sheet (mabati) homes?' },
        { cat: 'hazards', text: 'How do we chlorinate and test drinking water to prevent cholera in floods?' },
        { cat: 'hazards', text: 'What causes the Urban Heat Island (UHI) effect in Nairobi?' },
        { cat: 'action', text: 'How can youth submit a public memorandum to the Nairobi County Assembly (CIDP/ADP)?' },
        { cat: 'action', text: 'How can I identify corporate greenwashing and false carbon claims?' },
        { cat: 'action', text: 'What essential survival supplies belong in an emergency household Go-Bag?' },
        { cat: 'action', text: 'How do we organize a community-led youth drainage clearing team?' }
      ];

  const filteredPrompts = quickPrompts.filter(p => promptCategory === 'all' || p.cat === promptCategory);

  // Welcome message on load or language switch
  useEffect(() => {
    const welcomeText = isSwahili
      ? 'Hujambo! Mimi ni Climate Buddy, msaidizi wako wa Haki ya Tabianchi (Climate Justice) na Kukabiliana na Hali ya Hewa Nairobi. Unaweza kuniuliza kuhusu haki za Kikatiba (Kifungu cha 42), kujiandaa na mafuriko, kupunguza joto la nyumba za mabati, usalama wa maji, au kuwasilisha maoni kwa Bunge la Kaunti.'
      : 'Hello! I am Climate Buddy, your dedicated Nairobi Climate Justice and Adaptation Guide. Ask me anything about environmental rights under Article 42, urban flood safety, mabati heat reduction, water chlorination, exposing greenwashing, or submitting civic memoranda.';

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: welcomeText,
        mode: isOnlineActive ? 'online' : 'offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language, isSwahili, isOnlineActive]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // Halt any playing speech when a new query is submitted
    stopSpeech();
    setSpeakingMessageId(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Try online generative AI if online mode is operational
    if (isOnlineActive) {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const historyPayload = messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text
        }));

        const res = await fetch('/api/v1/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            language,
            history: historyPayload
          }),
          signal: controller.signal
        });

        if (res.ok) {
          const data = await res.json();
          if (data.mode === 'online' && !data.fallbackToOffline) {
            const assistantMsg: ChatMessage = {
              id: `asst-${Date.now()}`,
              sender: 'assistant',
              text: data.answer,
              mode: 'online',
              source: data.source || 'Groq Online AI (Llama-3.1-8b)',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, assistantMsg]);
            setIsLoading(false);
            abortControllerRef.current = null;
            return;
          }
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          setIsLoading(false);
          abortControllerRef.current = null;
          return;
        }
      } finally {
        abortControllerRef.current = null;
      }
    }

    // Seamless Offline Fallback
    const searchRes = searchClimateBuddy(query, language);
    const fallbackNotice = isOnlineActive 
      ? (isSwahili ? '\n\n*(Mtandao haukupatikana: Jibu limetolewa kutoka kwa mtaala wa ndani)*' : '\n\n*(Answered via local offline curriculum search)*')
      : '';

    const assistantMsg: ChatMessage = {
      id: `asst-${Date.now()}`,
      sender: 'assistant',
      text: searchRes.answer + fallbackNotice,
      mode: 'offline',
      result: searchRes,
      source: searchRes.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleStopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSpeak = async (msgId: string, text: string) => {
    // If clicking on already-playing message, stop it
    if (speakingMessageId === msgId) {
      stopSpeech();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any existing audio immediately to prevent overlap
    stopSpeech();
    setSpeakingMessageId(msgId);
    setVoiceNotice(null);

    // Clean text to avoid speaking markdown symbols, hashtags, asterisks, tables, and links
    const speechCleanedText = cleanTextForSpeech(text, language);

    // 1. Check if cloud neural TTS is available on server
    if (cloudTtsInfo?.available) {
      try {
        const res = await fetch('/api/v1/assistant/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: speechCleanedText, language })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.audioBase64) {
            audioCoordinator.requestPlayback(msgId, 'cloud-tts');
            const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
            cloudAudioElementRef.current = audio;
            audioCoordinator.registerAudioElement(audio);

            audio.onended = () => {
              audioCoordinator.releasePlayback(msgId);
              setSpeakingMessageId(null);
            };

            audio.onerror = () => {
              audioCoordinator.releasePlayback(msgId);
              setSpeakingMessageId(null);
            };

            await audio.play();
            return;
          }
        }
      } catch {
        // Fall back cleanly to client browser speech
      }
    }

    // 2. Client-side Enhanced Natural Web Speech Synthesis
    speakText(
      speechCleanedText,
      language,
      speechRate,
      {
        sourceId: msgId,
        onStart: () => setSpeakingMessageId(msgId),
        onEnd: () => setSpeakingMessageId(null),
        onError: (err) => {
          setSpeakingMessageId(null);
          if (typeof err === 'string') setVoiceNotice(err);
        },
        onVoiceNotice: (notice) => setVoiceNotice(notice)
      }
    );
  };

  const handlePlayVoiceSample = () => {
    if (isPlayingTestAudio) {
      stopSpeech();
      setIsPlayingTestAudio(false);
      return;
    }

    setIsPlayingTestAudio(true);
    const sampleText = isSwahili
      ? 'Hujambo! Hii ni sauti asilia ya Climate Buddy kwa ajili ya haki ya tabianchi na mafunzo Nairobi.'
      : 'Hello! This is Climate Buddy’s clear natural voice for Nairobi climate justice and adaptation guidance.';

    speakText(
      sampleText,
      language,
      speechRate,
      {
        sourceId: 'voice-sample',
        onStart: () => setIsPlayingTestAudio(true),
        onEnd: () => setIsPlayingTestAudio(false),
        onError: () => setIsPlayingTestAudio(false)
      }
    );
  };

  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    setPreferredVoiceURI(uri);
  };

  const handleRateChange = (rate: number) => {
    setLocalSpeechRate(rate);
    setSpeechRate(rate);
  };

  const handleResetChat = () => {
    stopSpeech();
    handleStopRequest();
    setSpeakingMessageId(null);
    const welcomeText = isSwahili
      ? 'Mazungumzo yameanza upya. Ni mada gani unayotaka tuchunguze leo?'
      : 'Conversation restarted. Which topic would you like to explore?';

    setMessages([
      {
        id: 'welcome-msg-reset',
        sender: 'assistant',
        text: welcomeText,
        mode: isOnlineActive ? 'online' : 'offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 pb-28 max-w-4xl mx-auto flex flex-col min-h-screen">
      {/* Header Panel */}
      <div className="bg-white rounded-organic border border-gray-200 shadow-natural p-5 md:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest-green to-emerald-500 text-white flex items-center justify-center shadow-md relative">
              <Bot className="w-6 h-6" />
              {speakingMessageId && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">Climate Buddy</h1>
                {isOnlineActive ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Globe2 className="w-3 h-3 text-emerald-600" />
                    {isSwahili ? 'Akili ya Mtandaoni' : 'Online AI'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    <WifiOff className="w-3 h-3 text-blue-600" />
                    {isSwahili ? 'Msaidizi wa Ndani' : 'Offline Mode'}
                  </span>
                )}

                {/* Natural Voice Active Indicator */}
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-forest-green border border-emerald-200">
                  <Volume1 className="w-3 h-3" />
                  {isSwahili ? 'Sauti Asilia' : 'Natural Voice'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isOnlineActive
                  ? (isSwahili 
                      ? `Mtandaoni: Msaidizi wa Haki ya Tabianchi • ${providerInfo?.model || 'llama-3.1-8b'}`
                      : `Online: Nairobi Climate Justice AI • ${providerInfo?.model || 'llama-3.1-8b'}`)
                  : (isSwahili 
                      ? 'Nje ya mtandao: Mtaala wa ndani wa Nairobi uliohifadhiwa bila mtandao • 100% Bure' 
                      : 'Offline: Local verified curriculum knowledge base • 100% Free & Fast')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
            {/* Voice Settings Button */}
            <button
              onClick={() => setVoiceSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm"
              title={isSwahili ? 'Mipangilio ya Sauti' : 'Voice Settings'}
              aria-label={isSwahili ? 'Mipangilio ya Sauti ya Climate Buddy' : 'Climate Buddy Voice Settings'}
            >
              <Sliders className="w-3.5 h-3.5 text-forest-green" />
              <span>{isSwahili ? 'Sauti' : 'Voice'}</span>
            </button>

            {onlineAvailable && isBrowserOnline && (
              <button
                onClick={() => setForceOfflineMode(prev => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                  forceOfflineMode
                    ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
                title={isSwahili ? 'Badilisha kati ya Mtandao na Nje ya Mtandao' : 'Toggle between Online AI and Offline Mode'}
              >
                {forceOfflineMode ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>{isSwahili ? 'Mtandaoni' : 'Online'}</span>
                  </>
                ) : (
                  <>
                    <Globe2 className="w-3.5 h-3.5" />
                    <span>{isSwahili ? 'Nje ya Mtandao' : 'Offline'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={isSwahili ? 'Anza upya mazungumzo' : 'Reset chat'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSwahili ? 'Safisha' : 'Clear'}</span>
            </button>
          </div>
        </div>

        {voiceNotice && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 animate-in fade-in">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-grow">{voiceNotice}</div>
          </div>
        )}
      </div>

      {/* Voice Settings Modal */}
      {voiceSettingsOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-settings-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-green/10 text-forest-green flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 id="voice-settings-title" className="text-base font-bold text-gray-900">
                  {isSwahili ? 'Mipangilio ya Sauti ya Buddy' : 'Climate Buddy Voice Settings'}
                </h3>
              </div>
              <button
                onClick={() => setVoiceSettingsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voice Selection Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {isSwahili ? 'Chagua Sauti (Iliyoboreshwa)' : 'Select Voice (Natural Scored)'}
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-forest-green text-gray-900"
              >
                {availableVoices.map((vo) => (
                  <option key={vo.voice.voiceURI} value={vo.voice.voiceURI}>
                    {vo.displayName} {vo.isNatural ? '★ Natural' : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                {isSwahili
                  ? 'Sauti asilia (Natural/Neural) huchaguliwa kwanza ili kuondoa sauti za mashine zilizopitwa na wakati.'
                  : 'Modern neural/natural voices are scored first to eliminate robotic 90s synthesizers.'}
              </p>
            </div>

            {/* Speaking Pace Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {isSwahili ? 'Kasi ya Kusoma' : 'Speaking Pace'}
                </label>
                <span className="text-xs font-bold text-forest-green">{speechRate}x</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400">0.8x</span>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                  className="w-full accent-forest-green cursor-pointer"
                />
                <span className="text-[11px] text-gray-400">1.25x</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{isSwahili ? 'Taratibu' : 'Gentle'}</span>
                <span className="text-forest-green font-bold">{isSwahili ? '0.93x (Inayopendekezwa)' : '0.93x (Recommended)'}</span>
                <span>{isSwahili ? 'Haraka' : 'Fast'}</span>
              </div>
            </div>

            {/* Cloud Neural Studio Voice Status & Credentials info */}
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-forest-green">
                  <Radio className="w-3.5 h-3.5" />
                  {isSwahili ? 'Hali ya Sauti ya Cloud Studio' : 'Cloud Studio Voice Status'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cloudTtsInfo?.available
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-white text-emerald-800 border border-emerald-200'
                }`}>
                  {cloudTtsInfo?.available ? 'Cloud Active' : 'Offline Natural Mode'}
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {cloudTtsInfo?.available
                  ? `Sauti ya OpenAI ${cloudTtsInfo.configuredVoice} inafanya kazi kwa uwazi wa kiwango cha juu.`
                  : isSwahili
                    ? 'Kwa sasa inatumia sauti za asili za kivinjari bila gharama. Ili kuwezesha sauti ya studio ya OpenAI, weka OPENAI_API_KEY kwenye faili ya server/.env.'
                    : 'Currently using zero-cost client natural synthesis. To enable studio-grade OpenAI audio, add OPENAI_API_KEY in server/.env.'}
              </p>
            </div>

            {/* Test Voice Sample & Close */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePlayVoiceSample}
                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {isPlayingTestAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-gray-800" />
                    <span>{isSwahili ? 'Sitisha Sampuli' : 'Stop Sample'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-gray-800" />
                    <span>{isSwahili ? 'Sikiliza Sampuli' : 'Play Voice Sample'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setVoiceSettingsOpen(false)}
                className="py-2.5 px-6 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
              >
                {isSwahili ? 'Hifadhi' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div 
        className="bg-gray-50/80 rounded-organic border border-gray-200 shadow-inner p-4 md:p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4 mb-4"
        role="log"
        aria-live="polite"
        aria-label={isSwahili ? 'Historia ya Mazungumzo' : 'Chat Conversation History'}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const res = msg.result;
          const isSpeakingThis = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm transition-all ${
                  isUser
                    ? 'bg-forest-green text-white rounded-br-none'
                    : isSpeakingThis
                      ? 'bg-white text-gray-900 border-2 border-forest-green rounded-bl-none shadow-md ring-2 ring-forest-green/10'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                {!isUser && res?.question && (
                  <div className="font-bold text-forest-green mb-1.5 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {res.question}
                  </div>
                )}

                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                  <div className="text-gray-900 leading-relaxed overflow-x-auto">
                    <MarkdownRenderer content={msg.text} />
                  </div>
                )}

                {/* Assistant Metadata (Source, Mode, Links, Listen) */}
                {!isUser && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      {msg.source && (
                        <span className="text-[11px] font-semibold text-gray-500">
                          {isSwahili ? 'Chanzo: ' : 'Source: '}{msg.source}
                        </span>
                      )}
                      {msg.mode && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          msg.mode === 'online' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {msg.mode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isSpeechSupported() && (
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                            isSpeakingThis
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20'
                              : 'bg-gray-100 text-gray-700 hover:bg-forest-green/10 hover:text-forest-green'
                          }`}
                          aria-label={isSpeakingThis ? (isSwahili ? 'Sitisha kusoma' : 'Stop audio') : (isSwahili ? 'Sikiliza kwa sauti asilia' : 'Listen with natural voice')}
                        >
                          {isSpeakingThis ? (
                            <>
                              <span className="flex gap-0.5 items-end h-3">
                                <span className="w-0.5 h-3 bg-amber-700 animate-pulse"></span>
                                <span className="w-0.5 h-2 bg-amber-700 animate-pulse delay-75"></span>
                                <span className="w-0.5 h-3 bg-amber-700 animate-pulse delay-150"></span>
                              </span>
                              <span className="text-[11px] font-bold">{isSwahili ? 'Sitisha' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-forest-green" />
                              <span className="text-[11px]">{isSwahili ? 'Sikiliza' : 'Listen'}</span>
                            </>
                          )}
                        </button>
                      )}

                      {res?.moduleId && (
                        <Link
                          to={`/module/${res.moduleId}`}
                          className="inline-flex items-center gap-1 text-forest-green hover:underline font-semibold text-xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {res.moduleTitle || (isSwahili ? 'Soma Moduli' : 'View Module')}
                        </Link>
                      )}

                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/v1/assistant/report-error', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                query: res?.question || 'Learner question',
                                responseText: msg.text,
                                feedback: 'Learner reported factual discrepancy'
                              })
                            });
                            alert(isSwahili ? 'Ujumbe umewasilishwa kwa wakufunzi kwa ukaguzi.' : 'Reported to climate instructors for review and correction.');
                          } catch {
                            alert('Could not submit report.');
                          }
                        }}
                        className="text-[11px] text-gray-400 hover:text-amber-700 underline transition ml-1"
                        title="Report potential inaccuracy to course instructors"
                      >
                        {isSwahili ? 'Ripoti Hitilafu' : 'Report Issue'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Related suggestion chips on assistant responses */}
              {!isUser && res && res.relatedSuggestions?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                  <span className="text-[11px] font-bold text-gray-500 self-center mr-1">
                    {isSwahili ? 'Maswali yanayohusiana: ' : 'Related topics: '}
                  </span>
                  {res.relatedSuggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1 bg-white hover:bg-forest-green/10 hover:border-forest-green/30 border border-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs italic bg-white p-3 rounded-2xl w-fit border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-forest-green animate-ping" />
            <span>{isSwahili ? 'Climate Buddy anatafakari jibu...' : 'Climate Buddy is thinking...'}</span>
            <button
              onClick={handleStopRequest}
              className="ml-2 text-red-600 hover:text-red-700 font-bold not-italic"
            >
              {isSwahili ? 'Acha' : 'Cancel'}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Filter Bar */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="font-bold text-gray-400 uppercase text-[10px] shrink-0 mr-1">
            {isSwahili ? 'Mada:' : 'Topics:'}
          </span>
          {[
            { id: 'all', label: isSwahili ? 'Yote' : 'All' },
            { id: 'justice', label: isSwahili ? 'Haki za Kikatiba' : 'Rights & Justice' },
            { id: 'hazards', label: isSwahili ? 'Mafuriko na Joto' : 'Floods & Heat' },
            { id: 'action', label: isSwahili ? 'Hatua za Kiraia' : 'Civic Action' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setPromptCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                promptCategory === cat.id
                  ? 'bg-forest-green text-white font-bold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
          {filteredPrompts.slice(0, 4).map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.text)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 hover:border-forest-green hover:text-forest-green whitespace-nowrap transition-colors shrink-0 shadow-sm"
            >
              {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-auto"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isSwahili
              ? 'Uliza swali kuhusu haki za tabianchi, mafuriko, au joto Nairobi...'
              : 'Ask a question about climate justice, flood safety, heat in Nairobi...'
          }
          className="flex-1 bg-white border border-gray-300 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-green shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="bg-forest-green hover:bg-forest-green/90 disabled:opacity-40 text-white p-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center shrink-0"
          aria-label={isSwahili ? 'Tuma ujumbe' : 'Send question'}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
