export interface ChatMessageContext {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AssistantChatRequest {
  message: string;
  language: 'en' | 'sw';
  history?: ChatMessageContext[];
}

export interface AssistantChatResponse {
  answer: string;
  mode: 'online' | 'offline';
  source?: string;
  fallbackToOffline?: boolean;
  model?: string;
  error?: string;
}

// In-memory sliding window rate limiter: max 20 requests per minute per IP
const requestHistory = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestHistory.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestHistory.set(ip, validTimestamps);
    return false;
  }

  validTimestamps.push(now);
  requestHistory.set(ip, validTimestamps);
  return true;
}

// Climate Justice and Nairobi keywords to trigger grounding & prioritization
const CLIMATE_JUSTICE_KEYWORDS = [
  'climate', 'justice', 'flood', 'heat', 'drainage', 'rain', 'temperature', 'water',
  'contamination', 'greenwashing', 'carbon', 'adaptation', 'mitigation',
  'kibera', 'mathare', 'mukuru', 'korogocho', 'ruaraka', 'gikomba', 'nairobi',
  'mabati', 'albedo', 'runoff', 'chlorine', 'cholera', 'loss and damage',
  'article 42', 'article 69', 'article 70', 'constitution', 'polluter pays',
  'just transition', 'unfccc', 'cop', 'cidp', 'adp', 'equity', 'vulnerability',
  'memorandum', 'memoranda', 'county assembly', 'assembly', 'public participation', 'civic',
  'tabianchi', 'mafuriko', 'joto', 'mifereji', 'haki ya hali ya hewa',
  'haki ya tabianchi', 'klorini', 'upotoshaji', 'mazingira', 'kipindupindu',
  'usalama wa maji', 'katiba', 'ushiriki wa umma', 'diwani', 'mca', 'bunge la kaunti'
];

export function hasClimateIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return CLIMATE_JUSTICE_KEYWORDS.some(kw => lower.includes(kw));
}

export const GROQ_MODEL = 'llama-3.1-8b-instant';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
export const POLLINATIONS_AI_URL = 'https://text.pollinations.ai/openai';

export function isOnlineAiConfigured(): boolean {
  if (process.env.FORCE_OFFLINE === 'true') {
    return false;
  }
  return true;
}

export function getActiveProvider(): string {
  if (process.env.FORCE_OFFLINE === 'true') {
    return 'offline';
  }
  if (process.env.GROQ_API_KEY?.trim()) {
    return 'groq';
  }
  if (process.env.OPENAI_API_KEY?.trim()) {
    return 'openai';
  }
  return 'free-online';
}

export function getActiveModel(): string {
  const provider = getActiveProvider();
  if (provider === 'groq') return GROQ_MODEL;
  if (provider === 'openai') return 'gpt-4o-mini';
  if (provider === 'free-online') return 'gpt-oss (online generative engine)';
  return 'local-offline-curriculum';
}

export async function processAssistantChat(
  req: AssistantChatRequest,
  clientIp: string = '127.0.0.1'
): Promise<AssistantChatResponse> {
  const { message, language, history = [] } = req;
  const isSwahili = language === 'sw';

  // 1. Validate message length (max 1000 characters)
  if (!message || typeof message !== 'string') {
    return {
      answer: isSwahili ? 'Tafadhali andika swali halali.' : 'Please enter a valid question.',
      mode: 'offline',
      fallbackToOffline: true,
      error: 'Empty message'
    };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 1000) {
    return {
      answer: isSwahili 
        ? 'Swali ni refu mno. Tafadhali punguza liwe chini ya herufi 1,000.' 
        : 'Message exceeds maximum length of 1,000 characters. Please shorten your question.',
      mode: 'offline',
      fallbackToOffline: true,
      error: 'Message too long'
    };
  }

  // 2. Check rate limit
  if (!checkRateLimit(clientIp)) {
    return {
      answer: isSwahili
        ? 'Umefikia kikomo cha maombi kwa muda huu. Msaidizi wa ndani (offline) anapatikana au subiri sekunde chache kabla ya kuuliza tena.'
        : 'Rate limit reached for the generative assistant. Please wait a moment before trying again.',
      mode: 'offline',
      fallbackToOffline: true,
      error: 'Rate limit exceeded (HTTP 429)'
    };
  }

  // 3. Offline override check
  if (process.env.FORCE_OFFLINE === 'true') {
    return {
      answer: isSwahili
        ? 'Msaidizi yuko katika mfumo wa ndani (offline). Maswali yote ya mtaala wa haki ya tabianchi yanajibiwa kupitia mfumo wetu wa ndani bila malipo.'
        : 'Climate Buddy is running in local offline mode. All climate justice curriculum topics, glossary terms, and FAQs remain fully available.',
      mode: 'offline',
      fallbackToOffline: true,
      error: 'FORCE_OFFLINE enabled'
    };
  }

  // 4. Construct System Prompt with Clear Pedagogical, Constitutional, and Follow-up Rules
  const systemPrompt = `You are Climate Buddy, an intelligent, empathetic, and knowledgeable educational tutor and climate justice guide dedicated to youth (ages 15-24) in Nairobi and across Kenya.

Language: ${isSwahili ? 'Communicate fluently and naturally in Kiswahili (Sanifu / Kenyan urban Kiswahili)' : 'Communicate fluently and clearly in English'}.

CORE INSTRUCTIONS:
1. ANSWER DIRECTLY & CONCISELY:
   - Always answer the user's immediate question directly in your opening sentences.
   - Keep default explanations concise (2 to 4 focused paragraphs or clean bullet points). Avoid fluff or verbose introductions.
   - Use Markdown formatting: bold text for key terms, clean lists for steps/points, and short paragraphs.
   - Use Markdown tables ONLY when comparing concepts or datasets where a table genuinely improves clarity.

2. ADAPTABILITY & CONVERSATION CONTEXT:
   - Pay close attention to conversation history and respond coherently to follow-up prompts.
   - When asked to "Make that simpler" / "Simpler" / "Explain like I'm 10":
     Explain the concept in plain, non-technical everyday language using simple, intuitive Kenyan analogies.
   - When asked for "Kenyan example" / "Give an example":
     Provide concrete, factual Kenyan examples (e.g., Nairobi River riparian restoration at Michuki Park, Mathare flash flooding, Olkaria geothermal power in Naivasha, Makueni County sand dams, Lake Turkana Wind Power in Marsabit, or Gazi Bay Mikoko Pamoja mangrove conservation in Kwale).
   - When asked to "Quiz me on this" / "Test me":
     Generate 2 interactive, multiple-choice practice questions with labeled options (A, B, C, D) and provide the correct answer and a brief explanation.

3. CONSTITUTIONAL & LEGAL CLAIMS:
   - Discuss Article 42 of the Constitution of Kenya (2010) ONLY when relevant to environmental rights, public health, government duties, civic action, or pollution.
   - DO NOT force Article 42 or legal rights into purely technical, physical, or unrelated scientific questions (such as how solar panels generate electricity, how drought affects crop biology, or heatstroke physiology).
   - When discussing Article 42, cite the authentic official text:
     "Constitution of Kenya 2010, Article 42: Every person has the right to a clean and healthy environment, which includes the right—(a) to have the environment protected for the benefit of present and future generations through legislative and other measures, particularly those contemplated in Article 69; and (b) to have obligations relating to the environment fulfilled under Article 70."

4. ACCURACY & AUTHENTICITY:
   - For public policies, cite the Kenya Climate Change Act 2016 (amended 2023), EMCA 1999, and NEMA standards.
   - Never claim to have watched a video or read a video transcript unless the user explicitly provided transcript text in the conversation.
   - For real-time daily weather forecasts or alerts, state the limitation: live hourly radar is not integrated; direct the learner to the official Kenya Meteorological Department (KMD) bulletins at meteo.go.ke.
   - Maintain learner privacy: never reference or expose other users' data.`;

  // 5. Sanitize conversation history (max 8 messages)
  const sanitizedHistory: ChatMessageContext[] = [];
  const recentHistory = history.slice(-8);
  for (const h of recentHistory) {
    if (h.role === 'user' || h.role === 'assistant') {
      sanitizedHistory.push({
        role: h.role,
        content: String(h.content).slice(0, 1000)
      });
    }
  }

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...sanitizedHistory,
    { role: 'user', content: trimmedMessage }
  ];

  // 6. Invoke Model Provider with 45s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  try {
    let generatedContent = '';
    let sourceLabel = '';
    let modelLabel = '';

    if (groqKey) {
      // Primary configured provider: Groq Cloud API
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messagesPayload,
          max_tokens: 900,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        console.warn('Groq rate limit reached (HTTP 429).');
        return {
          answer: isSwahili
            ? 'Kiwango cha mtandao kimefikiwa kwa muda. Tafadhali subiri sekunde chache kabla ya kuuliza tena.'
            : 'Online rate limit reached. Please wait a moment before trying again.',
          mode: 'offline',
          fallbackToOffline: true,
          error: 'Rate limit (HTTP 429)'
        };
      }

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const data: any = await response.json();
      generatedContent = data.choices?.[0]?.message?.content?.trim() || '';
      sourceLabel = 'Climate Justice Nairobi (Groq Llama-3.1-8b)';
      modelLabel = GROQ_MODEL;
    } else if (openaiKey) {
      // Alternative configured provider: OpenAI
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messagesPayload,
          max_tokens: 900,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data: any = await response.json();
      generatedContent = data.choices?.[0]?.message?.content?.trim() || '';
      sourceLabel = 'Climate Justice Nairobi (OpenAI gpt-4o-mini)';
      modelLabel = 'gpt-4o-mini';
    } else {
      // Default Online Generative Engine via OpenAI-format POST endpoint
      const response = await fetch(POLLINATIONS_AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai-fast',
          messages: messagesPayload,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 402 || response.status === 429) {
        const errorText = await response.text().catch(() => '');
        console.warn(`Online AI rate limit reached (HTTP ${response.status}):`, errorText);
        return {
          answer: isSwahili
            ? 'Kiwango cha bure cha mtandao kimefikiwa kwa muda (kikomo cha sekunde 30). Tafadhali subiri sekunde chache kabla ya kuuliza swali linalofuata, au weka GROQ_API_KEY ya bure kwenye server/.env.'
            : 'Online AI provider burst limit reached (free tier limit: 1 request every 30s). Please wait a few seconds before sending the follow-up, or configure a free GROQ_API_KEY in server/.env for unlimited continuous generation.',
          mode: 'offline',
          fallbackToOffline: true,
          error: `Provider Rate Limit (HTTP ${response.status})`
        };
      }

      if (!response.ok) {
        throw new Error(`Online AI provider returned status ${response.status}`);
      }

      const data: any = await response.json();
      generatedContent = data.choices?.[0]?.message?.content?.trim() || '';
      sourceLabel = 'Climate Justice Nairobi (Generative Engine)';
      modelLabel = 'gpt-oss (online generative engine)';
    }

    if (!generatedContent) {
      return {
        answer: isSwahili
          ? 'Hakuna jibu lililopokelewa kutoka kwa mtandao. Tafadhali jaribu tena.'
          : 'No response received from the generative engine. Please try asking again.',
        mode: 'offline',
        fallbackToOffline: true
      };
    }

    return {
      answer: generatedContent,
      mode: 'online',
      model: modelLabel,
      source: sourceLabel
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    console.warn(`Generative AI request failed (${isTimeout ? 'Timeout' : err.message}).`);
    return {
      answer: isSwahili
        ? 'Muunganisho wa mtandao ulikatika au umechelewa. Tafadhali jaribu kuuliza swali lako tena.'
        : 'The generative AI connection timed out or is temporarily unavailable. Please try asking your question again.',
      mode: 'offline',
      fallbackToOffline: true,
      error: isTimeout ? 'Timeout' : err.message
    };
  }
}
