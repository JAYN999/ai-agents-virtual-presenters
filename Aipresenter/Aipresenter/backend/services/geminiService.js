import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are a professional video presenter.

Generate a natural spoken script about the topic.

Rules:

- Speak ONLY about the topic
- No generic explanations
- No AI or technology mentions unless topic is technology
- 40–60 words
- Natural human speech tone
- Clear and engaging
- No headings
- No bullet points
- No emojis
- No formatting

Return ONLY spoken script.
`;

// ─────────────────────────────────────────────────────────────
// Helper: sleep for ms
// ─────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────
// Helper: clean up raw script text
// ─────────────────────────────────────────────────────────────
function cleanScript(raw) {
    let script = raw.replace(/^["']+|["']+$/g, "").trim();
    script = script.replace(/^(Script:|Here is|Here's)[:\s]*/i, "").trim();
    if (!script || script.length < 10) {
        throw new Error("Generated script is too short");
    }
    return script;
}

// ─────────────────────────────────────────────────────────────
// Strategy 1: Google Gemini (direct)
// ─────────────────────────────────────────────────────────────
async function tryGemini(topic, maxRetries = 2) {
    if (!process.env.GEMINI_API_KEY) return null;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nTopic: ${topic}`);
            const response = await result.response;
            return response.text();
        } catch (error) {
            const is429 = error?.status === 429 || error?.message?.includes("429");
            const isQuotaZero = error?.message?.includes("limit: 0");

            // If quota is truly 0 (exhausted daily), don't bother retrying
            if (isQuotaZero) {
                console.warn("⚠️  Gemini daily quota exhausted (limit: 0). Skipping retries.");
                return null;
            }

            // Transient rate-limit — retry with backoff
            if (is429 && attempt < maxRetries) {
                const wait = Math.pow(2, attempt + 1) * 1000; // 2s, 4s
                console.log(`⏳ Gemini rate-limited. Retrying in ${wait / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
                await sleep(wait);
                continue;
            }

            // Non-retryable error
            console.error("Gemini API Error:", error.message || error);
            return null;
        }
    }
    return null;
}

// ─────────────────────────────────────────────────────────────
// Strategy 2: OpenRouter fallback
// ─────────────────────────────────────────────────────────────
async function tryOpenRouter(topic) {
    if (!process.env.OPENROUTER_API_KEY) return null;

    console.log("🔄 Trying OpenRouter fallback...");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: SYSTEM_PROMPT.trim() },
                { role: "user", content: `Topic: ${topic}` },
            ],
            max_tokens: 300,
        }),
    });

    if (!response.ok) {
        const errBody = await response.text().catch(() => "unknown");
        console.error(`❌ OpenRouter error (${response.status}):`, errBody);
        return null;
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || null;
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
export async function generateScript(topic) {
    if (!topic || topic.trim().length === 0) {
        throw new Error("Topic is required");
    }

    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    if (!hasGemini && !hasOpenRouter) {
        throw new Error("No AI provider configured. Set GEMINI_API_KEY or OPENROUTER_API_KEY in .env");
    }

    console.log(`\n📝 Generating script for: "${topic}"`);

    // Try Gemini first
    let rawScript = await tryGemini(topic);

    // Fallback to OpenRouter
    if (!rawScript && hasOpenRouter) {
        rawScript = await tryOpenRouter(topic);
    }

    if (!rawScript) {
        const providers = [];
        if (hasGemini) providers.push("Gemini (quota exhausted / error)");
        if (hasOpenRouter) providers.push("OpenRouter (error)");
        throw new Error(
            `All AI providers failed: ${providers.join(", ")}. ` +
            "Check your API keys and quota at https://ai.google.dev/gemini-api/docs/rate-limits"
        );
    }

    const script = cleanScript(rawScript);

    console.log(`✅ Script generated (${script.length} chars)`);
    console.log(`📄 "${script}"`);

    return script;
}
