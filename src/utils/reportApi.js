// Premium report generation via Claude API.
// Dev: calls api.anthropic.com directly using VITE_ANTHROPIC_API_KEY from .env.local
// Prod: swap generateReport() to call your deployed Cloud Function (see functions/index.js)

import { enrichBook } from "./booksDb";

function injectBookData(report) {
  const enrich = (book) => book ? enrichBook(book) : null;
  return {
    ...report,
    blindSpots: (report.blindSpots || []).map(b => ({ ...b, book: enrich(b.book) })),
    growthRecommendations: (report.growthRecommendations || []).map(r => ({ ...r, book: enrich(r.book) })),
  };
}

function buildPrompt(pcts) {
  const dim = (v) => `${v ?? 0}%`;
  return `You are a senior executive coach and behavioral psychologist producing a premium psychological profile for a professional client.

BEHAVIORAL ASSESSMENT SCORES (0–100):
• Autonomy: ${dim(pcts.autonomy)} — preference for self-directed work vs needing external guidance
• Structure: ${dim(pcts.structure)} — preference for defined processes vs fluid approach
• Precision: ${dim(pcts.execution)} — quality/craft orientation vs speed/throughput bias
• Ownership: ${dim(pcts.ownership)} — breadth of accountability felt beyond direct responsibilities
• Collaboration: ${dim(pcts.collaboration)} — energy drawn from working through people vs independently
• Ambiguity Tolerance: ${dim(pcts.ambiguity)} — comfort operating under uncertainty with incomplete information
• Leadership Drive: ${dim(pcts.leadership)} — pull toward shaping direction and influencing people
• Resilience: ${dim(pcts.resilience)} — capacity to perform under sustained pressure and setbacks

RISK SIGNALS (elevated = present):
• Burnout tendency: ${dim(pcts.burnout)} — pattern of overextension and poor energy management
• Validation dependency: ${dim(pcts.validation)} — reliance on external approval for sense of competence

Generate a comprehensive psychological profile. Tone: direct, honest, sophisticated — like a top-tier 360-feedback report. No flattery. No vague affirmations. Write as if you have done 2,000 of these and you see this person clearly.

Return ONLY valid JSON — no markdown fences, no text outside the JSON object:

{
  "headline": "A 6–10 word phrase that captures the defining essence of this person's work identity",
  "profileSummary": "Three distinct paragraphs separated by \\n\\n. Para 1 (~120 words): their fundamental orientation to work and what drives them. Para 2 (~120 words): how they operate interpersonally and within systems. Para 3 (~100 words): what they're unconsciously optimizing for — and what that costs them.",
  "corePatterns": [
    { "title": "Pattern name (3–5 words)", "description": "Two sentences: what this pattern looks like in real work situations, and why it matters for their trajectory." }
  ],
  "strengths": [
    { "title": "Strength name (2–4 words)", "description": "One sentence: the strength and its specific competitive advantage." }
  ],
  "blindSpots": [
    {
      "title": "Blind spot name (2–4 words)",
      "description": "Two sentences: what this pattern costs them and where it typically shows up.",
      "book": { "title": "Exact book title", "author": "Author full name", "reason": "One sentence on how this book directly addresses this specific blind spot for this person." }
    }
  ],
  "idealEnvironment": {
    "summary": "Two sentences describing the culture and organizational context where this person will do their best work.",
    "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4", "Trait 5"]
  },
  "growthRecommendations": [
    {
      "area": "Area name (2–4 words)",
      "insight": "One sentence: why this is the highest-leverage growth edge for this specific person.",
      "action": "One concrete action they can take in the next 30 days.",
      "book": { "title": "Exact book title", "author": "Author full name", "reason": "One sentence on what this book specifically delivers for this person's growth edge." }
    }
  ]
}

Constraints:
- corePatterns: exactly 3 items
- strengths: 3 to 4 items
- blindSpots: 2 to 3 items
- idealEnvironment.traits: exactly 5 items
- growthRecommendations: exactly 3 items
- Prefer books from this list when relevant: Drive, The War of Art, Atomic Habits, Getting Things Done, Deep Work, The Checklist Manifesto, Extreme Ownership, The Culture Code, Radical Candor, Thinking in Bets, The Lean Startup, Dare to Lead, The Hard Thing About Hard Things, Mindset, The Obstacle Is the Way, Essentialism, Rest, The Gifts of Imperfection, The Courage to Be Disliked
- Do NOT quote specific score percentages inside the report text
- Do NOT produce generic insight that could apply to anyone`;
}

const PRIMARY_DIMS = [
  { key: "autonomy",      label: "Autonomy",            desc: "preference for self-directed work vs needing external guidance" },
  { key: "structure",     label: "Structure",            desc: "preference for defined processes vs fluid approach" },
  { key: "execution",     label: "Precision",            desc: "quality/craft orientation vs speed/throughput bias" },
  { key: "ownership",     label: "Ownership",            desc: "breadth of accountability felt beyond direct responsibilities" },
  { key: "collaboration", label: "Collaboration",        desc: "energy drawn from working through people vs independently" },
  { key: "ambiguity",     label: "Ambiguity Tolerance",  desc: "comfort operating under uncertainty with incomplete information" },
  { key: "leadership",    label: "Leadership Drive",     desc: "pull toward shaping direction and influencing people" },
  { key: "resilience",    label: "Resilience",           desc: "capacity to perform under sustained pressure and setbacks" },
];

function buildQuickPrompt(pcts) {
  const dim = (v) => `${v ?? 0}%`;
  const scores = PRIMARY_DIMS.map(d => `• ${d.label}: ${dim(pcts[d.key])} — ${d.desc}`).join("\n");

  const lowest = PRIMARY_DIMS.reduce((min, d) =>
    (pcts[d.key] ?? 0) < (pcts[min.key] ?? 0) ? d : min
  );

  return `You are a behavioral psychologist and executive coach. Generate a high-impact, short insight for a professional.

BEHAVIORAL SCORES (0–100):
${scores}

Their LOWEST dimension is: ${lowest.label} (${dim(pcts[lowest.key])})

Focus the insight on this lowest dimension. Be accurate, personal, and direct — not generic. Sound like a real coach who has seen this pattern many times. Keep everything short and impactful.

Return ONLY valid JSON — no markdown, no text outside the object:

{
  "lowestDim": "${lowest.label}",
  "profile": "One sentence capturing their core work identity and what it reveals about them.",
  "keyWeakness": "One short paragraph (3–4 sentences). What this low score costs them in practice. Why this pattern exists. Where it shows up most visibly. Be specific, not clinical.",
  "actionAdvice": "One short paragraph (2–3 sentences). One concrete action they can take this week. Make it specific enough that they can start today.",
  "recommendedBook": {
    "title": "Exact book title",
    "author": "Author full name",
    "reason": "One sentence — why this book is the obvious, specific next step for this exact weakness."
  }
}

Prefer books from: Drive, The War of Art, Atomic Habits, Getting Things Done, Deep Work, The Checklist Manifesto, Extreme Ownership, The Culture Code, Radical Candor, Thinking in Bets, The Lean Startup, Dare to Lead, The Hard Thing About Hard Things, Mindset, The Obstacle Is the Way, Essentialism, Rest, The Gifts of Imperfection, The Courage to Be Disliked.
Do NOT quote specific percentages in the output text.`;
}

async function callClaude(body, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-request-header": "true",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error ${res.status}`);
  }
  const data = await res.json();
  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("No text in Claude response");
  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(raw);
}

export async function generateQuickInsight(pcts) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing API key. Add VITE_ANTHROPIC_API_KEY to .env.local");

  const result = await callClaude({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: buildQuickPrompt(pcts) }],
  }, apiKey);

  return {
    ...result,
    book: enrichBook(result.recommendedBook),
  };
}

export async function generateReport(pcts) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing API key. Add VITE_ANTHROPIC_API_KEY to .env.local");

  const report = await callClaude({
    model: "claude-opus-4-7",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: buildPrompt(pcts) }],
  }, apiKey);

  return injectBookData(report);
}
