// Firebase Cloud Function: generateReport
// Deploy: firebase deploy --only functions
// Set secret: firebase functions:secrets:set ANTHROPIC_API_KEY
//
// To use from the frontend (production), replace the fetch() call in
// src/utils/reportApi.js with:
//   const fn = httpsCallable(getFunctions(), "generateReport");
//   const { data } = await fn({ pcts });
//   return data;

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const Anthropic = require("@anthropic-ai/sdk");

const AFFILIATE_URLS = {
  "drive":                                    "https://amzn.to/3DriveDP",
  "the war of art":                           "https://amzn.to/3WarArtSP",
  "atomic habits":                            "https://amzn.to/3AtomicJC",
  "getting things done":                      "https://amzn.to/3GTDDave",
  "deep work":                                "https://amzn.to/3DeepWCN",
  "the checklist manifesto":                  "https://amzn.to/3ChkMfst",
  "extreme ownership":                        "https://amzn.to/3ExtrOwn",
  "the 15 commitments of conscious leadership": "https://amzn.to/315CommCL",
  "the culture code":                         "https://amzn.to/3CultCode",
  "radical candor":                           "https://amzn.to/3RadCand",
  "thinking in bets":                         "https://amzn.to/3ThinkBet",
  "the lean startup":                         "https://amzn.to/3LeanSrt",
  "dare to lead":                             "https://amzn.to/3DareLead",
  "the hard thing about hard things":         "https://amzn.to/3HardThing",
  "mindset":                                  "https://amzn.to/3MindsetCD",
  "the obstacle is the way":                  "https://amzn.to/3ObstWay",
  "essentialism":                             "https://amzn.to/3EssentGM",
  "rest":                                     "https://amzn.to/3RestPang",
  "the gifts of imperfection":                "https://amzn.to/3GiftsImp",
  "the courage to be disliked":               "https://amzn.to/3CourDis",
};

function getAffiliateUrl(title) {
  if (!title) return null;
  const key = title.toLowerCase().trim();
  return AFFILIATE_URLS[key] || `https://www.amazon.com/s?k=${encodeURIComponent(title)}`;
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

Generate a comprehensive psychological profile. Tone: direct, honest, sophisticated — like a top-tier 360-feedback report. No flattery. No vague affirmations.

Return ONLY valid JSON — no markdown fences, no text outside the JSON object:

{
  "headline": "A 6–10 word phrase capturing the defining essence of this person's work identity",
  "profileSummary": "Three distinct paragraphs separated by \\n\\n. Para 1 (~120 words): fundamental orientation to work. Para 2 (~120 words): how they operate interpersonally and in systems. Para 3 (~100 words): what they're unconsciously optimizing for and what it costs them.",
  "corePatterns": [
    { "title": "Pattern name (3–5 words)", "description": "Two sentences: what this pattern looks like, and why it matters." }
  ],
  "strengths": [
    { "title": "Strength name (2–4 words)", "description": "One sentence on the strength and its competitive advantage." }
  ],
  "blindSpots": [
    {
      "title": "Blind spot name (2–4 words)",
      "description": "Two sentences: what it costs them and where it shows up.",
      "book": { "title": "Exact book title", "author": "Author full name", "reason": "One sentence why this book addresses this blind spot." }
    }
  ],
  "idealEnvironment": {
    "summary": "Two sentences on the culture/context where they thrive.",
    "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4", "Trait 5"]
  },
  "growthRecommendations": [
    {
      "area": "Area name (2–4 words)",
      "insight": "One sentence: why this is highest-leverage for this specific profile.",
      "action": "One concrete action takeable in 30 days.",
      "book": { "title": "Exact book title", "author": "Author full name", "reason": "One sentence on what this book delivers for this growth edge." }
    }
  ]
}

Constraints: corePatterns=3, strengths=3-4, blindSpots=2-3, idealEnvironment.traits=5, growthRecommendations=3. Do not quote specific percentages in the output text.`;
}

exports.generateReport = onCall(
  { secrets: ["ANTHROPIC_API_KEY"], cors: true },
  async (request) => {
    const { pcts } = request.data;
    if (!pcts || typeof pcts !== "object") {
      throw new HttpsError("invalid-argument", "pcts scores required");
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      messages: [{ role: "user", content: buildPrompt(pcts) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock) throw new HttpsError("internal", "No text in Claude response");

    let raw = textBlock.text.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    }

    const report = JSON.parse(raw);

    // Inject affiliate URLs server-side
    const injectBook = (book) =>
      book ? { ...book, affiliateUrl: getAffiliateUrl(book.title) } : book;

    return {
      ...report,
      blindSpots: (report.blindSpots || []).map((b) => ({ ...b, book: injectBook(b.book) })),
      growthRecommendations: (report.growthRecommendations || []).map((r) => ({ ...r, book: injectBook(r.book) })),
    };
  }
);
