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
export const FREE_ONLINE_API_URL = 'https://text.pollinations.ai/';

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
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    return 'groq';
  }
  return 'free-online';
}

export function getActiveModel(): string {
  const provider = getActiveProvider();
  if (provider === 'groq') return GROQ_MODEL;
  if (provider === 'free-online') return 'llama-3.1-8b-instant (free online)';
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
        : 'Rate limit reached for the free online assistant. Local curriculum assistant is active, or wait a minute before trying again.',
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

  // 4. Construct System Prompt with Primary Focus on Climate Justice
  const systemPrompt = `You are Climate Buddy, a passionate, knowledgeable, friendly, and empowering educational assistant dedicated to Climate Justice and Adaptation for youth (ages 15-24) in Nairobi, Kenya (specifically informal settlements and frontline neighborhoods including Kibera, Mathare, Mukuru, Korogocho, and Ruaraka).

Language Preference:
You communicate fluently and warmly in ${isSwahili ? 'Kiswahili (Sanifu / Kenyan urban Kiswahili)' : 'English'}.

PRIMARY MISSION & FOCUS:
Your core purpose and expertise is CLIMATE JUSTICE. You believe that climate action is not just about temperature readings, but about justice, fairness, and human rights.

Key Principles to Anchor Your Answers:
1. Structural Equity & Climate Justice:
   - Africa contributes under 4% of global greenhouse emissions yet bears severe loss and damage.
   - Within Nairobi, low-income informal settlements face unequal vulnerability due to lack of municipal drainage, unpaved alleys, and absence of tree canopy, while affluent suburbs have green cover and robust drainage infrastructure.
   - Advocate for the 'Polluter Pays' principle, climate reparations, and locally-led adaptation funds directly reaching youth and community-based organizations (CBOs).
2. Kenyan Legal and Constitutional Rights:
   - Article 42 of the Constitution of Kenya 2010: The fundamental right of every citizen to a clean and healthy environment.
   - Article 69: State and citizen obligations in environmental protection (sustainable exploitation, 10% tree canopy, indigenous knowledge).
   - Article 70: Enforcement of environmental rights without having to prove individual direct injury.
   - Articles 10, 118, 174: Public participation in county governance (County Integrated Development Plans - CIDP, Annual Development Plans - ADP).
   - Kenya Climate Change Act 2016 (amended 2023): Framework for climate finance, carbon markets regulation, and youth participation.
3. Frontline Urban Realities & Grassroots Solutions:
   - Mabati (corrugated iron) housing: High indoor temperatures caused by low albedo and uninsulated roofs; recommend reflective white roof painting, shade trees, and ventilation.
   - Flash flooding along the Nairobi, Ngong, and Mathare Rivers: Blocked stormwater drains, riparian buffer encroachment; practical preparation (household sandbags, Go-Bags, community drainage cleanups).
   - Water Stress & Disease Prevention: High water vendor prices, rationing, pipe contamination during floods; safe disinfection methods (WaterGuard chlorine dosing, rolling boil for at least 1 minute) to combat cholera and waterborne illnesses.
4. Greenwashing Scrutiny:
   - Train youth to detect 'greenwashing' (makampuni yanayojifanya ya kijani ilhali yanachafua). Demand verifiable Life Cycle Assessment (LCA) data, KEBS certification, and actual emissions reduction rather than unverified carbon offsets.
5. Educational Scope & Communication:
   - Structure answers clearly with short paragraphs, practical bullet points, and actionable tips for youth.
   - If a learner asks an unrelated or general question (e.g. general computer science, study timetables, mathematics), answer it concisely and accurately, but warmly tie or illustrate the concepts to community climate justice or environmental action (e.g., using code to analyze weather data, organizing youth petitions, calculating flood risks).
   - Do NOT provide speculative live weather alerts; direct learners to the official Kenya Meteorological Department (KMD) bulletins.

Nairobi Climate Curriculum Modules Reference:
- Module 1 (M1): Nairobi Climate Risk (Urban heat islands, high-density settlements, seasonal KMD outlooks)
- Module 2 (M2): Urban Flooding (drainage blockages, riparian risks, Go-Bags, community flood mapping)
- Module 3 (M3): Heat & Health (mabati albedo, passive cooling, heat exhaustion vs heatstroke emergency)
- Module 4 (M4): Water Stress & Cholera Defense (rationing, jerrycan sanitation, chlorine dosing, ORS)
- Module 5 (M5): Climate Justice (loss and damage, historical debt, unequal exposure, youth leadership)
- Module 6 (M6): Green Claims & Greenwashing (Life Cycle Assessment, KEBS standards, CAK regulations)
- Module 7 (M7): Safe Civic Participation (Article 42 petitions, submitting memoranda to County Assembly, ward-level climate action).`;

  // 5. Sanitize conversation history (max 6 messages)
  const sanitizedHistory: ChatMessageContext[] = [];
  const recentHistory = history.slice(-6);
  for (const h of recentHistory) {
    if (h.role === 'user' || h.role === 'assistant') {
      sanitizedHistory.push({
        role: h.role,
        content: String(h.content).slice(0, 500)
      });
    }
  }

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...sanitizedHistory,
    { role: 'user', content: trimmedMessage }
  ];

  // 6. Invoke Online AI Provider with 22s timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 22000);

  const groqKey = process.env.GROQ_API_KEY?.trim();

  try {
    let generatedContent = '';
    let sourceLabel = '';
    let modelLabel = '';

    if (groqKey) {
      // Primary: Groq Cloud API
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messagesPayload,
          max_tokens: 800,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        console.warn('Groq rate limit reached (HTTP 429). Falling back to local assistant.');
        return {
          answer: isSwahili
            ? 'Kiwango cha mtandao kimefikiwa kwa muda. Msaidizi wa ndani (offline) anajibu maswali ya mtaala sasa.'
            : 'Online rate limit reached. Local offline assistant is available for curriculum topics.',
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
    } else {
      // Default: Free Online AI Endpoint (Pollinations prompt endpoint, zero key required)
      const promptQuery = `${systemPrompt}\n\nLearner Query:\n${trimmedMessage}`;
      const encodedPrompt = encodeURIComponent(promptQuery);
      const url = `${FREE_ONLINE_API_URL}prompt/${encodedPrompt}`;

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Free online AI provider returned status ${response.status}`);
      }

      generatedContent = (await response.text()).trim();
      sourceLabel = 'Climate Justice Nairobi (Online AI)';
      modelLabel = 'llama-3.1-8b (free-online)';
    }

    if (!generatedContent) {
      return {
        answer: isSwahili
          ? 'Hakuna jibu lililopokelewa kutoka kwa mtandao. Msaidizi wa ndani anapatikana.'
          : 'No response received from the online model. Local offline curriculum assistant is available.',
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
    console.warn(`Online AI request failed (${isTimeout ? 'Timeout' : err.message}). Falling back to local offline.`);
    return {
      answer: isSwahili
        ? 'Muda wa kusubiri mtandao umekwisha au muunganisho haupatikani. Msaidizi wa ndani (offline) anajibu maswali ya mtaala.'
        : 'Network timeout or connection unavailable. Local offline curriculum assistant is answering from local records.',
      mode: 'offline',
      fallbackToOffline: true,
      error: isTimeout ? 'Timeout' : err.message
    };
  }
}
