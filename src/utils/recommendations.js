// ─── Book Recommendation Engine ───────────────────────────────────────────────
// Built on behavioral psychology, executive coaching literature, and
// evidence-based self-development frameworks.
//
// Each trait maps to: a psychological insight + 1–2 books with specific rationale.
// Weaknesses are detected by score thresholds, then ranked by severity.
// ─────────────────────────────────────────────────────────────────────────────

const TRAIT_MAP = {

  // ── PRIMARY DIMENSIONS (weakness = score < 45) ───────────────────────────

  autonomy: {
    label: "Autonomy",
    icon: "🧭",
    insight: `You tend to do your best work with clear direction and regular alignment rather than charting your own course. While this reflects strong collaborative instincts, it can become a ceiling in environments that demand self-driven initiative. At its root, this pattern often reflects an underdeveloped relationship with your own judgment — and a subtle conditioning that decisions made alone are less valid until confirmed by others.`,
    books: [
      {
        title: "Drive",
        author: "Daniel Pink",
        cover: "📙",
        reason: `Pink's research demonstrates that most people's reliance on external direction is not a personality trait — it's a byproduct of systems that rewarded compliance over intrinsic motivation. This book will help you reconnect with the internal motivational sources that make self-direction feel natural rather than anxious, and show you the science behind why autonomy is not just a preference but a fundamental human need.`,
      },
      {
        title: "The War of Art",
        author: "Steven Pressfield",
        cover: "📗",
        reason: `Pressfield names "Resistance" — the invisible force that keeps talented people dependent on external structures and permission to create. For someone who struggles to self-direct, this book is a psychologically precise confrontation with exactly what holds you back, and one of the most honest accounts ever written about what it costs to trust your own initiative.`,
      },
    ],
  },

  structure: {
    label: "Structure",
    icon: "🏗️",
    insight: `Low structure scores often signal a fluid, creative mind that resists constraint — but can also reflect an underdeveloped relationship with consistency and follow-through. Without intentional systems, even strong intentions collapse under the accumulated weight of daily demands. The irony is that freedom from structure often produces the most constraining kind of chaos: one that's invisible until it's already cost you something significant.`,
    books: [
      {
        title: "Atomic Habits",
        author: "James Clear",
        cover: "📘",
        reason: `Clear systematically dismantles the myth that discipline is a personality trait, revealing it as an architectural one. For someone who struggles with consistency, this book is the most practical blueprint available for building reliable systems without depending on motivation — which is the single most unreliable input in human behavior.`,
      },
      {
        title: "Getting Things Done",
        author: "David Allen",
        cover: "📒",
        reason: `GTD is not a productivity system — it's a trust system. Allen demonstrates that the cognitive load of tracking everything in your head is precisely what prevents reliable execution. The methodology gives you an infrastructure where structure finally feels like relief rather than restriction, and where nothing important can fall through the cracks.`,
      },
    ],
  },

  execution: {
    label: "Precision",
    icon: "🎯",
    insight: `A low precision score often means you prioritize momentum over mastery — moving fast but consistently leaving quality on the table. This frequently masquerades as productivity while quietly eroding credibility and self-trust. Over time, the habit of shipping "good enough" work creates a ceiling on what your output can open for you professionally, because reputation is built not on volume, but on signal quality.`,
    books: [
      {
        title: "Deep Work",
        author: "Cal Newport",
        cover: "📓",
        reason: `Newport makes a compelling, evidence-backed case that the ability to produce high-quality, distraction-free output is becoming the defining competitive advantage in knowledge work. For someone who tends toward speed over depth, this book reframes precision not as perfectionism, but as the professional leverage that separates interchangeable contributors from irreplaceable ones.`,
      },
      {
        title: "The Checklist Manifesto",
        author: "Atul Gawande",
        cover: "📔",
        reason: `Gawande's research in surgery and aviation proves that precision failures are almost never intelligence failures — they are process failures. This book will show you how to build the lightweight habits and systems that catch what instinct skips, making high-quality execution a design outcome rather than a personality dependency.`,
      },
    ],
  },

  ownership: {
    label: "Ownership",
    icon: "⚙️",
    insight: `A low ownership score reveals a tendency to draw narrow boundaries around accountability — to own your piece cleanly without feeling responsible for the whole. While this protects you from blame in the short term, it also limits your ability to influence outcomes and earn the trust required for meaningful advancement. The shift from "contributor" to "owner" is one of the most defining growth edges in professional life, and it begins as a psychological decision before it becomes a behavioral one.`,
    books: [
      {
        title: "Extreme Ownership",
        author: "Jocko Willink & Leif Babin",
        cover: "📕",
        reason: `Written by two Navy SEAL commanders who operated in some of the most unforgiving environments imaginable, this book makes the radical case that all outcomes — not only those within your lane — are your responsibility. For someone working on expanding their accountability mindset, this is a direct, at times uncomfortable confrontation with where ownership actually starts.`,
      },
      {
        title: "The 15 Commitments of Conscious Leadership",
        author: "Jim Dethmer, Diana Chapman & Kaley Klemp",
        cover: "📗",
        reason: `Dethmer introduces the concept of "above the line" vs "below the line" thinking — the distinction between taking full responsibility and rationalizing, blaming, or staying in victim patterns. This is one of the most psychologically precise books ever written on the internal mechanics of ownership, and why it feels threatening before it feels liberating.`,
      },
    ],
  },

  collaboration: {
    label: "Collaboration",
    icon: "🤝",
    insight: `A low collaboration score doesn't necessarily mean you're antisocial — it more often means you've learned, probably through experience, that working alone is safer, faster, and more reliable than depending on others. This pattern can be deeply functional in the short term while quietly creating professional isolation and a reputation for being hard to work with. The highest-leverage output in most organizations happens at the intersection of people, not in silos.`,
    books: [
      {
        title: "The Culture Code",
        author: "Daniel Coyle",
        cover: "📘",
        reason: `Coyle spent years inside the world's most cohesive teams — Navy SEALs, Pixar, championship sports franchises — and identified the three deceptively simple skills that create genuine belonging and high-performance cooperation. For someone who operates better solo, this book makes collaboration feel like a learnable science rather than an innate disposition you either have or don't.`,
      },
      {
        title: "Radical Candor",
        author: "Kim Scott",
        cover: "📙",
        reason: `Many people avoid collaboration because navigating interpersonal friction is emotionally costly and the ROI feels uncertain. Scott's framework — caring personally while challenging directly — is the most practically useful guide to making working relationships both high-performing and emotionally honest. It resolves the false choice between being liked and being effective.`,
      },
    ],
  },

  ambiguity: {
    label: "Ambiguity Tolerance",
    icon: "🌫️",
    insight: `Low ambiguity tolerance typically manifests as needing more information before acting than the situation actually permits — which in fast-moving environments reads as hesitation, over-analysis, or a chronic need for reassurance. At its deepest level, discomfort with ambiguity is discomfort with the possibility of being wrong, and the ego cost that comes with it. In startup or high-growth contexts, this pattern creates a consistent drag on both pace and perceived confidence.`,
    books: [
      {
        title: "Thinking in Bets",
        author: "Annie Duke",
        cover: "📒",
        reason: `Duke, a former World Series of Poker champion and behavioral decision researcher, reframes decision-making around probability rather than certainty. This book is transformative for anyone who struggles to act under ambiguity because it decouples the quality of a decision from the quality of its outcome — the cognitive distinction that makes uncertainty finally feel navigable rather than threatening.`,
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        cover: "📓",
        reason: `Ries's build-measure-learn methodology is essentially an operating system for functioning effectively inside ambiguity. Rather than eliminating uncertainty before acting, it makes uncertainty productive by treating every decision as a time-bounded experiment rather than a permanent commitment. For someone who freezes without clarity, this book provides the mental framework that converts unknowns into inputs.`,
      },
    ],
  },

  leadership: {
    label: "Leadership Drive",
    icon: "🚀",
    insight: `A low leadership score often reflects a genuine preference for contributing over directing — which is valuable, but can become professionally limiting at a certain scale. Many people who score low here aren't lacking conviction or ideas; they're lacking the belief that their influence is wanted, legitimate, or earned. This hesitation to step into impact is one of the most costly patterns in careers, because leadership isn't about authority — it's about the willingness to be accountable to a direction.`,
    books: [
      {
        title: "Dare to Lead",
        author: "Brené Brown",
        cover: "📕",
        reason: `Brown's research-backed argument is that the most effective leadership is built not on authority or charisma, but on the courage to be vulnerable, direct, and clear under pressure. For someone who holds back from influence because it feels presumptuous or exposing, this book reframes leadership as an act of service to others rather than a claim of superiority over them.`,
      },
      {
        title: "The Hard Thing About Hard Things",
        author: "Ben Horowitz",
        cover: "📗",
        reason: `Horowitz strips leadership down to its most honest form — not the polished LinkedIn version, but the daily, unglamorous work of making hard calls without certainty, delivering difficult feedback, and holding a direction when everyone is exhausted. For someone who avoids stepping up, this book normalizes the discomfort of leadership in a way that makes trying it feel less like overreach.`,
      },
    ],
  },

  resilience: {
    label: "Resilience",
    icon: "💪",
    insight: `Low resilience scores indicate that sustained pressure, setbacks, or failure significantly erode your capacity to function and recover. This is not a character flaw — it often reflects high sensitivity to the gap between expectation and reality, combined with an underdeveloped toolkit for closing that gap without shutting down. The critical insight from psychology is that resilience is not a fixed trait: it is one of the most trainable dimensions of human behavior.`,
    books: [
      {
        title: "Mindset",
        author: "Carol Dweck",
        cover: "📘",
        reason: `Dweck's decades of Stanford research demonstrate that how we interpret difficulty — as evidence of fixed limits or as stimulus for growth — is the single most powerful predictor of whether we recover or collapse. This is the foundational psychological framework for building resilience, and one of the most replicated findings in behavioral science. It changes not just what you believe about failure, but how you respond to it in real time.`,
      },
      {
        title: "The Obstacle Is the Way",
        author: "Ryan Holiday",
        cover: "📙",
        reason: `Drawing on Stoic philosophy and the lives of leaders who performed under extraordinary adversity, Holiday makes the counterintuitive case that obstacles are not interruptions to progress — they are the medium through which progress becomes real. For someone who struggles to maintain function under pressure, this book provides a mental model that converts adversity into fuel rather than friction.`,
      },
    ],
  },

  // ── RISK INDICATORS (weakness = score > 60) ──────────────────────────────

  burnout: {
    label: "Burnout Tendency",
    icon: "🔥",
    isRisk: true,
    insight: `Your pattern of pushing through exhaustion rather than managing your energy reveals a relationship with work that has likely served you in the short term — promotions, output, reputation — while quietly eroding your capacity over time. This isn't a discipline problem. It is almost always a values conflict: you likely care deeply about your work, which makes slowing down feel like betrayal. That same care is both your greatest strength and your most significant vulnerability.`,
    books: [
      {
        title: "Essentialism",
        author: "Greg McKeown",
        cover: "📒",
        reason: `McKeown builds an irrefutable case against the cultural pressure to do everything, accept everything, and be available for everything. For someone prone to over-extension, this book is a psychologically grounded permission slip to pursue far fewer things with far greater depth — and a practical framework for making that choice deliberately rather than reactively after the damage is done.`,
      },
      {
        title: "Rest",
        author: "Alex Soojung-Kim Pang",
        cover: "📓",
        reason: `Drawing on neuroscience, history, and the documented work patterns of exceptional performers from Darwin to Dickens, Pang demonstrates that deliberate rest is not the opposite of high performance — it is an active component of it. For someone who treats stopping as failure, this book fundamentally reframes recovery as productive rather than passive.`,
      },
    ],
  },

  validation: {
    label: "Validation Dependency",
    icon: "🪞",
    isRisk: true,
    insight: `A high need for external validation creates an invisible dependency: your sense of progress, competence, and worth becomes conditional on how your work is received. This can drive exceptional output in the short term while creating deep fragility under critical feedback, ambiguous response, or shifting audiences. At its core, this pattern reflects a gap between your external achievements and your internal self-trust — and the belief, often unconscious, that what you produce is only real once someone confirms it.`,
    books: [
      {
        title: "The Gifts of Imperfection",
        author: "Brené Brown",
        cover: "📕",
        reason: `Brown's most personally honest book is a direct and research-grounded confrontation with the exhausting project of proving worthiness through external achievement. It offers the psychological framework for shifting from a life organized around what others think to one guided by internal values — which Brown calls "wholehearted living." For someone caught in validation dependency, this book is not inspirational; it is diagnostic.`,
      },
      {
        title: "The Courage to Be Disliked",
        author: "Ichiro Kishimi & Fumitake Koga",
        cover: "📗",
        reason: `Written as a Socratic dialogue rooted in Adlerian psychology — the branch of psychology Freud called most dangerous because it dissolves the excuses we use to avoid change — this book makes the radical argument that the desire for approval is the primary source of unhappiness, and that freedom from it is both possible and learnable. One of the most psychologically precise books ever written on self-worth and internal authority.`,
      },
    ],
  },
};

// ─── Book data ────────────────────────────────────────────────────────────────
import { enrichBook } from "./booksDb";

// ─── Core recommendation logic ────────────────────────────────────────────────

const PRIMARY_THRESHOLD = 45;   // below this = weakness for primary dims
const RISK_THRESHOLD    = 60;   // above this = weakness for risk indicators
const MAX_RESULTS       = 3;    // max number of traits to surface

export function getPersonalizedRecommendations(pcts) {
  if (!pcts || typeof pcts !== "object") return [];

  const candidates = [];

  // Score each primary dimension
  const primaryDims = ['autonomy', 'structure', 'execution', 'ownership', 'collaboration', 'ambiguity', 'leadership', 'resilience'];
  primaryDims.forEach(dim => {
    const score = pcts[dim] ?? 50;
    const severity = PRIMARY_THRESHOLD - score; // positive = below threshold
    if (severity > 0) {
      candidates.push({ dim, score, severity });
    }
  });

  // Score risk indicators (high = bad)
  ['burnout', 'validation'].forEach(dim => {
    const score = pcts[dim] ?? 0;
    const severity = score - RISK_THRESHOLD; // positive = above threshold
    if (severity > 0) {
      candidates.push({ dim, score, severity });
    }
  });

  // Sort by severity descending, take top N
  candidates.sort((a, b) => b.severity - a.severity);
  const topWeaknesses = candidates.slice(0, MAX_RESULTS);

  // If no trait is technically "weak", surface the 2 lowest primary dims anyway
  // (framed as growth areas rather than weaknesses)
  if (topWeaknesses.length === 0) {
    const allPrimary = primaryDims
      .map(dim => ({ dim, score: pcts[dim] ?? 50 }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 2);
    topWeaknesses.push(...allPrimary.map(({ dim, score }) => ({ dim, score, severity: 0 })));
  }

  // Build output
  return topWeaknesses.map(({ dim, score, severity }) => {
    const trait = TRAIT_MAP[dim];
    if (!trait) return null;
    return {
      dim,
      label:    trait.label,
      icon:     trait.icon,
      score,
      isGrowth: severity <= 0,   // true = "growth area", false = "real weakness"
      isRisk:   trait.isRisk || false,
      insight:  trait.insight,
      books:    trait.books.map((b, i) => ({ ...enrichBook(b), priority: i === 0 ? "main" : "secondary" })),
    };
  }).filter(Boolean);
}
