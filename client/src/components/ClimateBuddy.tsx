import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  RotateCcw,
  CheckCircle2,
  Square,
  Globe2,
  WifiOff,
  Scale,
  CloudRain,
  Users2
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { searchClimateBuddy, type AssistantQueryResult } from '../lib/assistantEngine';
import { speakText, stopSpeech, isSpeechSupported } from '../lib/speech';

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check backend online status
  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/assistant/status');
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

        const res = await fetch('http://localhost:3001/api/v1/assistant/chat', {
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

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      stopSpeech();
      setSpeakingMessageId(null);
      return;
    }

    stopSpeech();
    setSpeakingMessageId(msgId);
    setVoiceNotice(null);

    // Clean markdown asterisks and brackets before speech
    const cleanSpeechText = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    speakText(
      cleanSpeechText,
      language,
      1.0,
      {
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

  const handleResetChat = () => {
    stopSpeech();
    handleStopRequest();
    setSpeakingMessageId(null);
    const welcomeText = isSwahili
      ? 'Mazungumzo yameanza upya. Ni mada gani unayotaka tuchunguze leo?'
      : 'Conversation restarted. Which topic would you like to explore?';

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText,
        mode: isOnlineActive ? 'online' : 'offline',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      {/* Assistant Card Header */}
      <div className="bg-white rounded-organic border border-gray-200 shadow-natural p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-green text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">Climate Buddy</h1>
                {isOnlineActive ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Globe2 className="w-3 h-3 text-emerald-600" />
                    {isSwahili ? 'Akili ya Mtandaoni (Haki ya Tabianchi)' : 'Online AI (Climate Justice Focused)'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    <WifiOff className="w-3 h-3 text-blue-600" />
                    {isSwahili ? 'Msaidizi wa Ndani (Mtaala)' : 'Offline Mode (Local Curriculum)'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isOnlineActive
                  ? (isSwahili 
                      ? `Mtandaoni: Msaidizi anayelenga Haki ya Tabianchi Nairobi • ${providerInfo?.model || 'llama-3.1-8b'}`
                      : `Online: Nairobi Climate Justice AI Specialist • ${providerInfo?.model || 'llama-3.1-8b'}`)
                  : (isSwahili 
                      ? 'Nje ya mtandao: Mtaala wa ndani wa Nairobi uliohifadhiwa bila mtandao • 100% Bure' 
                      : 'Offline: Local verified curriculum knowledge base • 100% Free & Fast')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
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
                    {isSwahili ? 'Badilisha kuwa Mtandaoni' : 'Switch to Online'}
                  </>
                ) : (
                  <>
                    <Globe2 className="w-3.5 h-3.5" />
                    {isSwahili ? 'Jaribu Nje ya Mtandao' : 'Test Offline Mode'}
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isSwahili ? 'Anza Upya' : 'Clear Chat'}
            </button>
          </div>
        </div>

        {voiceNotice && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-grow">{voiceNotice}</div>
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-gray-50/80 rounded-organic border border-gray-200 shadow-inner p-4 md:p-6 min-h-[420px] max-h-[560px] overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const res = msg.result;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-forest-green text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                {!isUser && res?.question && (
                  <div className="font-bold text-forest-green mb-1.5 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {res.question}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.text}</div>

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
                          className={`p-1.5 rounded-full transition-colors ${
                            speakingMessageId === msg.id
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={isSwahili ? 'Sikiliza jibu' : 'Listen to answer'}
                        >
                          {speakingMessageId === msg.id ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
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

              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-3.5 shadow-sm text-xs text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest-green animate-ping"></span>
              <span>{isSwahili ? 'Climate Buddy anatafakari jibu...' : 'Climate Buddy is thinking...'}</span>
              <button
                onClick={handleStopRequest}
                className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-600 rounded text-[11px] transition-colors"
              >
                <Square className="w-3 h-3" />
                {isSwahili ? 'Sitisha' : 'Stop'}
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel if conversation just started */}
      {messages.length <= 2 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {isSwahili ? 'Maswali ya Kuanzia:' : 'Suggested Questions to Ask:'}
            </p>
            <div className="flex items-center gap-1 text-[11px] flex-wrap">
              <button
                onClick={() => setPromptCategory('all')}
                className={`px-2 py-0.5 rounded-full ${promptCategory === 'all' ? 'bg-forest-green text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {isSwahili ? 'Yote' : 'All'}
              </button>
              <button
                onClick={() => setPromptCategory('justice')}
                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${promptCategory === 'justice' ? 'bg-forest-green text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Scale className="w-3 h-3" />
                {isSwahili ? 'Haki & Katiba' : 'Justice & Rights'}
              </button>
              <button
                onClick={() => setPromptCategory('hazards')}
                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${promptCategory === 'hazards' ? 'bg-forest-green text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <CloudRain className="w-3 h-3" />
                {isSwahili ? 'Majanga ya Mjini' : 'Urban Hazards'}
              </button>
              <button
                onClick={() => setPromptCategory('action')}
                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${promptCategory === 'action' ? 'bg-forest-green text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Users2 className="w-3 h-3" />
                {isSwahili ? 'Hatua za Jamii' : 'Community Action'}
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.text)}
                className="px-3.5 py-2 bg-white hover:bg-forest-green/10 hover:border-forest-green border border-gray-200 rounded-full text-xs font-medium text-gray-800 transition-all shrink-0 shadow-sm text-left max-w-xs truncate"
              >
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white rounded-full border border-gray-300 p-1.5 shadow-natural focus-within:border-forest-green focus-within:ring-4 focus-within:ring-forest-green/20 transition-all"
      >
        <input
          type="text"
          id="climate-buddy-input"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isSwahili 
              ? 'Uliza swali kuhusu haki ya tabianchi, Katiba, mafuriko, joto la mabati, hatua za jamii...' 
              : 'Ask about climate justice, Article 42, flood safety, mabati heat, greenwashing, or community action...'
          }
          className="flex-grow px-4 py-2.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={handleStopRequest}
            className="w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            title={isSwahili ? 'Sitisha ombi' : 'Stop request'}
          >
            <Square className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="w-10 h-10 rounded-full bg-forest-green disabled:bg-gray-300 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            title={isSwahili ? 'Tuma swali' : 'Send question'}
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Disclaimer Notice */}
      <p className="text-center text-[11px] text-gray-500 mt-3 flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-forest-green" />
        {isSwahili 
          ? 'Majibu ya AI yanaweza kuwa na hitilafu. Taarifa za mtaala wa ndani na miongozo rasmi hupewa kipaumbele.' 
          : 'AI-generated answers may contain inaccuracies. Official guidelines and local curriculum facts are prioritized.'}
      </p>
    </div>
  );
}
