import { useState } from "react";
import { toPct } from "../utils/scores";

// ─── Rank weights: position 1 = full credit, position 4 = none ───────────────
const RANK_WEIGHTS = { 1: 1.0, 2: 0.5, 3: 0.25, 4: 0, 5: 0 };

// ─── 30 Questions ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 1, name: "Work Style Foundations",       subtitle: "How you actually operate day-to-day" },
  { id: 2, name: "Team & Communication",          subtitle: "How you work with and through other people" },
  { id: 3, name: "Startup & Uncertainty",         subtitle: "How you handle the unexpected" },
  { id: 4, name: "Leadership & Decision-Making",  subtitle: "How you influence outcomes and make calls" },
  { id: 5, name: "Deep Behavioral Patterns",      subtitle: "How you really function at work" },
];

const QUESTIONS = [
  // ── SECTION 1 ─────────────────────────────────────────────────────────────
  {
    id: 1, section: 1, type: "slider",
    text: "When starting a new project, how much of the approach do you prefer to define yourself?",
    labelLow: "I need a clear method defined before I start",
    labelHigh: "Give me the outcome — I'll figure out the how",
    dimScores: { autonomy: { multiplier: 10 } },
  },
  {
    id: 2, section: 1, type: "choice",
    text: "A deliverable is due in 4 hours. Your work is 80% complete and 90% accurate. You:",
    options: [
      { id: "a", text: "Submit it — consistently delivering on time is its own discipline. Speed builds trust.", scores: { execution: 15 } },
      { id: "b", text: "Ask for a short extension — I'd rather have an honest timeline conversation than ship work I'm not proud of.", scores: { execution: 90 } },
      { id: "c", text: "Ship it with a clear summary noting what's done, what's missing, and why — transparency protects the work.", scores: { execution: 50, ownership: 90 } },
      { id: "d", text: "Identify the two biggest gaps, fix them in the remaining time, ship a 95% version.", scores: { execution: 70, ownership: 65 } },
    ],
  },
  {
    id: 3, section: 1, type: "choice",
    text: "You're handed a complex task with almost no instructions. What typically happens?",
    options: [
      { id: "a", text: "I research similar cases, map out a plan, then execute step by step.", scores: { structure: 85, autonomy: 45 } },
      { id: "b", text: "I start immediately — I figure things out faster through action than through planning.", scores: { structure: 15, autonomy: 90 } },
      { id: "c", text: "I ask clarifying questions until I feel confident about scope and expectations, then start.", scores: { structure: 65, autonomy: 30 } },
      { id: "d", text: "I look for how others solved similar problems, borrow an approach, then adapt it to this context.", scores: { structure: 55, autonomy: 55 } },
    ],
  },
  {
    id: 4, section: 1, type: "slider",
    text: "A project you contributed to significantly underperforms. How personally accountable do you feel — even for parts you didn't directly own?",
    labelLow: "Accountable for my piece — collective outcomes are shared responsibility",
    labelHigh: "I feel ownership over the whole outcome, not just my scope",
    dimScores: { ownership: { multiplier: 10 } },
  },
  {
    id: 5, section: 1, type: "choice",
    text: "How do you actually manage your own workload — not how you should, but how you really do?",
    options: [
      { id: "a", text: "Structured systems — task lists, calendars, documentation. Without them I lose efficiency.", scores: { structure: 90, autonomy: 30 } },
      { id: "b", text: "Mostly mental — I know what needs to happen next without formal tracking.", scores: { structure: 15, autonomy: 90 } },
      { id: "c", text: "Lightweight — a simple list or running note. Enough structure without overhead.", scores: { structure: 55, autonomy: 65 } },
      { id: "d", text: "Context-dependent — systematic for complex projects, loose for routine work.", scores: { structure: 60, autonomy: 60 } },
    ],
  },
  {
    id: 6, section: 1, type: "slider",
    text: "How often do you seek your manager's input on decisions that technically fall within your own scope?",
    labelLow: "Rarely — I decide, then update them",
    labelHigh: "Frequently — alignment before acting is how I work best",
    dimScores: { structure: { multiplier: 10 }, autonomy: { multiplier: -10, offset: 110 } },
  },

  // ── SECTION 2 ─────────────────────────────────────────────────────────────
  {
    id: 7, section: 2, type: "ranking",
    text: "Rank these work modes from most to least energizing for you:",
    options: [
      { id: "a", text: "Deep solo focus — uninterrupted independent work", rankScores: { autonomy: 10, collaboration: 0 } },
      { id: "b", text: "Real-time collaboration — solving problems live with teammates", rankScores: { autonomy: 0, collaboration: 10 } },
      { id: "c", text: "Async collaboration — working independently with clear handoffs", rankScores: { autonomy: 7, collaboration: 4 } },
      { id: "d", text: "Mixed mode — rotating between solo and team based on what the task demands", rankScores: { autonomy: 4, collaboration: 7 } },
    ],
  },
  {
    id: 8, section: 2, type: "choice",
    text: "A colleague presents work in a team meeting that has a significant flaw you can see will affect the project. You:",
    options: [
      { id: "a", text: "Raise it directly in the meeting — the problem needs to be surfaced now, not later.", scores: { leadership: 80, collaboration: 50 } },
      { id: "b", text: "Message them privately after — protect their confidence and address the issue quietly.", scores: { leadership: 40, collaboration: 75 } },
      { id: "c", text: "Stay quiet and flag it separately to your manager.", scores: { leadership: 15, collaboration: 40 } },
      { id: "d", text: "Ask a carefully framed question in the meeting that guides them toward finding the issue themselves.", scores: { leadership: 65, collaboration: 70 } },
    ],
  },
  {
    id: 9, section: 2, type: "choice",
    text: "Tension has been building with a colleague over working styles for several weeks. You tend to:",
    options: [
      { id: "a", text: "Initiate a direct conversation — I'd rather address it head-on than let it compound.", scores: { leadership: 80, resilience: 70 } },
      { id: "b", text: "Adapt my own style to reduce friction, without necessarily naming the issue.", scores: { resilience: 60, collaboration: 70 } },
      { id: "c", text: "Wait to see if it resolves naturally — some friction is temporary.", scores: { resilience: 40, leadership: 20 } },
      { id: "d", text: "Escalate to a manager once it starts affecting the quality of the work.", scores: { leadership: 45, resilience: 45 } },
    ],
  },
  {
    id: 10, section: 2, type: "slider",
    text: "How attuned are you to the emotional climate of your team on a daily basis?",
    labelLow: "I focus on the work — I let people manage their own emotional states",
    labelHigh: "I actively notice shifts in team energy and adjust how I show up",
    dimScores: { collaboration: { multiplier: 10 } },
  },
  {
    id: 11, section: 2, type: "choice",
    text: "You receive critical feedback on a piece of work you spent significant time on. Your immediate internal reaction is:",
    options: [
      { id: "a", text: "Frustration — especially if the feedback feels vague or subjective.", scores: { resilience: 20, validation: 70 } },
      { id: "b", text: "Curiosity — I want to understand specifically what missed the mark.", scores: { resilience: 80, ownership: 70 } },
      { id: "c", text: "Self-doubt — I question whether my judgment can be trusted.", scores: { resilience: 15, validation: 85 } },
      { id: "d", text: "Calm acceptance — feedback is data. I process it and move on.", scores: { resilience: 90, ownership: 60 } },
    ],
  },
  {
    id: 12, section: 2, type: "choice",
    text: "In your experience, trust at work is primarily built through:",
    options: [
      { id: "a", text: "Consistent follow-through — doing exactly what you said you'd do, reliably.", scores: { ownership: 80, leadership: 50 } },
      { id: "b", text: "Genuine personal connection — mutual understanding and care between people.", scores: { collaboration: 80, leadership: 40 } },
      { id: "c", text: "Demonstrated expertise — people trust the quality and depth of your thinking.", scores: { leadership: 75, ownership: 55 } },
      { id: "d", text: "Transparent reasoning — people know exactly why you're doing what you're doing.", scores: { ownership: 70, leadership: 70 } },
    ],
  },

  // ── SECTION 3 ─────────────────────────────────────────────────────────────
  {
    id: 13, section: 3, type: "slider",
    text: "You join a project where the goal, timeline, and success criteria are all unclear. How does that feel?",
    labelLow: "Uncomfortable — I need definition to work effectively",
    labelHigh: "Energizing — ambiguity means room to shape things",
    dimScores: { ambiguity: { multiplier: 10 } },
  },
  {
    id: 14, section: 3, type: "choice",
    text: "Midway through a major project, leadership shifts the priorities significantly. Your first response is:",
    options: [
      { id: "a", text: "Frustration, then adjustment — I need mental reorientation time before I can effectively pivot.", scores: { resilience: 45, ambiguity: 40 } },
      { id: "b", text: "Immediate pivot — I stay in motion and adapt the plan.", scores: { resilience: 80, ambiguity: 80 } },
      { id: "c", text: "Clarification — I ask what changed and why before changing course.", scores: { resilience: 60, ambiguity: 55 } },
      { id: "d", text: "Concern — I flag the execution cost of the pivot before committing to the new direction.", scores: { resilience: 55, ambiguity: 45, leadership: 55 } },
    ],
  },
  {
    id: 15, section: 3, type: "ranking",
    text: "Rank these working environments from most to least comfortable for you:",
    options: [
      { id: "a", text: "Clear role, established processes, predictable workload", rankScores: { structure: 10, ambiguity: 0 } },
      { id: "b", text: "Mostly defined role, some process, occasionally unpredictable demands", rankScores: { structure: 7, ambiguity: 4 } },
      { id: "c", text: "Fluid role, minimal process, frequent ambiguity", rankScores: { structure: 3, ambiguity: 7 } },
      { id: "d", text: "No defined role — you build everything as you go, constant change", rankScores: { structure: 0, ambiguity: 10 } },
    ],
  },
  {
    id: 16, section: 3, type: "slider",
    text: "Under sustained high pressure — not a single crunch, but weeks of intensity — what's true about how you operate?",
    labelLow: "Quality and energy decline — I need recovery time to perform at my best",
    labelHigh: "I perform well under sustained pressure — it actually sharpens my focus",
    dimScores: { resilience: { multiplier: 10 } },
  },
  {
    id: 17, section: 3, type: "choice",
    text: "Your manager reprioritizes your main project for the third time this month. You:",
    options: [
      { id: "a", text: "That's startup life — I adapt, stay focused on impact, and keep moving.", scores: { ambiguity: 85, resilience: 80 } },
      { id: "b", text: "Mildly frustrated, but I trust there's a reason — I adjust and move forward.", scores: { ambiguity: 65, resilience: 65 } },
      { id: "c", text: "I flag the execution risk of constant resets before the next pivot.", scores: { ambiguity: 45, resilience: 55, leadership: 55 } },
      { id: "d", text: "Increasingly disengaged — repeated reprioritization erodes my ability to do quality work.", scores: { ambiguity: 20, resilience: 25, burnout: 70 } },
    ],
  },
  {
    id: 18, section: 3, type: "slider",
    text: "How well do you operate in environments where processes are broken, missing, or being invented on the fly?",
    labelLow: "I need functional systems — missing process significantly slows me down",
    labelHigh: "I build what I need and fill the gaps — it doesn't slow me down at all",
    dimScores: { ambiguity: { multiplier: 10 } },
  },

  // ── SECTION 4 ─────────────────────────────────────────────────────────────
  {
    id: 19, section: 4, type: "choice",
    text: "Your team is aligned on a direction you believe is a meaningful mistake. You:",
    options: [
      { id: "a", text: "Make the case clearly — speak up and propose an alternative, even if it's uncomfortable.", scores: { leadership: 90, ownership: 75 } },
      { id: "b", text: "Voice your concern once and clearly, then commit to the team's decision.", scores: { leadership: 55, ownership: 60 } },
      { id: "c", text: "Go along with the group, but document your objection and reasoning.", scores: { leadership: 30, ownership: 50 } },
      { id: "d", text: "Work behind the scenes to shift consensus before the decision is locked in.", scores: { leadership: 70, ownership: 55 } },
    ],
  },
  {
    id: 20, section: 4, type: "choice",
    text: "When you need to persuade stakeholders who hold a different view, your most effective approach is:",
    options: [
      { id: "a", text: "Data and logical argument — I build the case with evidence.", scores: { leadership: 65, structure: 50 } },
      { id: "b", text: "Storytelling and framing — I make the impact tangible and personally relevant.", scores: { leadership: 70, collaboration: 55 } },
      { id: "c", text: "Relationship first — I earn credibility with the person before the idea lands.", scores: { leadership: 55, collaboration: 75 } },
      { id: "d", text: "Demonstration — I prototype or show results rather than argue.", scores: { leadership: 75, ownership: 60 } },
    ],
  },
  {
    id: 21, section: 4, type: "slider",
    text: "While doing your day-to-day work, how often are you thinking about the broader strategic implications beyond your immediate task?",
    labelLow: "I focus on executing my work well — strategy is beyond my scope",
    labelHigh: "I'm constantly connecting my work to the larger organizational picture",
    dimScores: { leadership: { multiplier: 10 } },
  },
  {
    id: 22, section: 4, type: "choice",
    text: "You have two viable options for solving a critical problem. Which do you choose?",
    options: [
      { id: "a", text: "The proven solution — lower risk, predictable outcome, limited upside.", scores: { execution: 65, ambiguity: 35 } },
      { id: "b", text: "The innovative approach — higher potential impact, with real failure risk.", scores: { ambiguity: 85, leadership: 75 } },
      { id: "c", text: "The fastest solution — gets you moving immediately, even if imperfect.", scores: { execution: 30, ambiguity: 65 } },
      { id: "d", text: "Request more time to find an option that better balances all three.", scores: { execution: 80, structure: 70, leadership: 50 } },
    ],
  },
  {
    id: 23, section: 4, type: "choice",
    text: "When something goes wrong on your team, your instinct is to:",
    options: [
      { id: "a", text: "Clearly own my part, even if it's uncomfortable — before anyone asks.", scores: { ownership: 95, leadership: 70 } },
      { id: "b", text: "Analyze what actually happened before assigning responsibility — including to myself.", scores: { ownership: 65, leadership: 55 } },
      { id: "c", text: "Focus on fixing the problem first — accountability is for the retrospective.", scores: { ownership: 55, resilience: 65 } },
      { id: "d", text: "Ensure accountability is accurately distributed across everyone involved.", scores: { ownership: 60, leadership: 45 } },
    ],
  },
  {
    id: 24, section: 4, type: "slider",
    text: "In the absence of complete information, how confident are you making — and publicly defending — a call?",
    labelLow: "I prefer to gather more before committing — uncertainty makes me hesitant",
    labelHigh: "I'm comfortable deciding with 60% of the information I'd ideally want",
    dimScores: { leadership: { multiplier: 8 }, ambiguity: { multiplier: 6 } },
  },

  // ── SECTION 5 ─────────────────────────────────────────────────────────────
  {
    id: 25, section: 5, type: "ranking",
    text: "Rank what actually drives your best work — not what should drive it, but what genuinely does:",
    options: [
      { id: "a", text: "Mastery — getting significantly better at something I care about", rankScores: { autonomy: 7, ownership: 5 } },
      { id: "b", text: "Recognition — being seen and valued for the quality of what I produce", rankScores: { validation: 10, leadership: 3 } },
      { id: "c", text: "Impact — knowing the work meaningfully changed something", rankScores: { ownership: 8, leadership: 6 } },
      { id: "d", text: "Autonomy — the freedom to work in my own way, on my own terms", rankScores: { autonomy: 10, ownership: 4 } },
      { id: "e", text: "Belonging — being part of a team I deeply believe in", rankScores: { collaboration: 10, resilience: 4 } },
    ],
  },
  {
    id: 26, section: 5, type: "slider",
    text: "When you're running at over-capacity for an extended stretch, what's most true?",
    labelLow: "I naturally pull back and protect my energy — I recognize my limits",
    labelHigh: "I keep pushing through — stopping or slowing down feels like failure",
    dimScores: { burnout: { multiplier: 10 } },
  },
  {
    id: 27, section: 5, type: "choice",
    text: "After completing a genuinely challenging piece of work, what's true about how you feel?",
    options: [
      { id: "a", text: "I have my own internal benchmark — I know whether it's good regardless of what others say.", scores: { validation: 10, ownership: 80 } },
      { id: "b", text: "I want acknowledgment from at least one person I respect — that matters to me.", scores: { validation: 55, ownership: 55 } },
      { id: "c", text: "I actively seek feedback — external input is how I calibrate whether the work actually landed.", scores: { validation: 65, ownership: 50 } },
      { id: "d", text: "My satisfaction is heavily shaped by how it's received — I need the response to feel complete.", scores: { validation: 90, ownership: 30 } },
    ],
  },
  {
    id: 28, section: 5, type: "choice",
    text: "You're about to ship work that's genuinely good — but not as refined as you'd want. The deadline is real. You:",
    options: [
      { id: "a", text: "Ship it. Done and good is the job. Perfect and late isn't.", scores: { execution: 25, resilience: 75 } },
      { id: "b", text: "Find the one critical issue, fix it quickly, then ship.", scores: { execution: 65, ownership: 70 } },
      { id: "c", text: "I struggle internally but hit the deadline — quality standards cost me something.", scores: { execution: 50, burnout: 65 } },
      { id: "d", text: "Renegotiate the deadline — I'd rather discuss timeline than knowingly compromise quality.", scores: { execution: 90, leadership: 60 } },
    ],
  },
  {
    id: 29, section: 5, type: "slider",
    text: "When you receive unexpected public criticism of your work in a meeting or review, how grounded do you stay?",
    labelLow: "It visibly affects me — separating the work from my self-worth is difficult",
    labelHigh: "I engage with the feedback directly and stay composed — it doesn't destabilize me",
    dimScores: { resilience: { multiplier: 10 }, validation: { multiplier: -8, offset: 88 } },
  },
  {
    id: 30, section: 5, type: "choice",
    text: "Over a 2-year horizon, what would most likely cause you to disengage from a role?",
    options: [
      { id: "a", text: "No growth or learning — I plateau and gradually lose motivation.", scores: { autonomy: 70, leadership: 55 } },
      { id: "b", text: "Poor leadership or cultural misalignment — I need to believe in the people and direction.", scores: { collaboration: 75, resilience: 40 } },
      { id: "c", text: "Insufficient recognition or limited visibility of my contributions.", scores: { validation: 75, leadership: 40 } },
      { id: "d", text: "Constrained autonomy — feeling like my judgment isn't trusted.", scores: { autonomy: 85, leadership: 60 } },
      { id: "e", text: "Values divergence — when what the company actually does conflicts with what it says it believes.", scores: { ownership: 75, resilience: 45 } },
    ],
  },
];

// ─── Compute max possible contribution per dimension for a given question ────
function getQuestionMaxes(q) {
  const maxes = {};
  if (q.type === "slider") {
    Object.entries(q.dimScores).forEach(([dim, { multiplier, offset }]) => {
      const v = multiplier >= 0 ? 10 * multiplier + (offset || 0) : 1 * multiplier + (offset || 0);
      maxes[dim] = Math.max(maxes[dim] || 0, v);
    });
    // For each slider dim, max is always 100 (the max the formula can produce)
    Object.entries(q.dimScores).forEach(([dim]) => {
      maxes[dim] = 100;
    });
  } else if (q.type === "choice") {
    q.options.forEach(opt => {
      Object.entries(opt.scores || {}).forEach(([dim, val]) => {
        if ((maxes[dim] || 0) < val) maxes[dim] = val;
      });
    });
  } else if (q.type === "ranking") {
    q.options.forEach(opt => {
      Object.entries(opt.rankScores || {}).forEach(([dim, val]) => {
        const maxContrib = val * RANK_WEIGHTS[1]; // max when ranked 1st
        if ((maxes[dim] || 0) < maxContrib) maxes[dim] = maxContrib;
      });
    });
  }
  return maxes;
}

// ─── Section transition card ─────────────────────────────────────────────────
function SectionIntro({ section, onContinue, questionNum }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 520, textAlign: "center" }}>
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          background: "var(--accent-bg)",
          border: "1px solid var(--accent-border)",
          borderRadius: 99,
          fontSize: 12,
          fontWeight: 700,
          color: "var(--accent)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 24
        }}>
          Section {section.id} of 5
        </div>
        <h2 style={{ margin: "0 0 12px", fontSize: 26 }}>{section.name}</h2>
        <p style={{ color: "var(--text)", fontSize: 16, margin: "0 0 40px", lineHeight: 1.6 }}>
          {section.subtitle}
        </p>
        <button
          onClick={onContinue}
          style={{
            padding: "14px 36px",
            fontSize: 16,
            fontWeight: 600,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(170,59,255,0.3)"
          }}
        >
          {questionNum === 1 ? "Start assessment" : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ─── Ranking UI ───────────────────────────────────────────────────────────────
function RankingQuestion({ question, onAnswer }) {
  const [order, setOrder] = useState([]); // array of option ids in ranked order

  const handleClick = (optId) => {
    if (order.includes(optId)) {
      // Unrank this and everything after it
      const idx = order.indexOf(optId);
      setOrder(order.slice(0, idx));
    } else {
      setOrder([...order, optId]);
    }
  };

  const handleConfirm = () => {
    // Build rankings map: optId → rank position (1 = first picked = most preferred)
    const rankings = {};
    order.forEach((id, i) => { rankings[id] = i + 1; });
    // Unranked options get position after the last ranked one
    question.options.forEach((opt, i) => {
      if (!rankings[opt.id]) rankings[opt.id] = order.length + 1 + i;
    });
    onAnswer(rankings);
  };

  const canConfirm = order.length >= 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 480 }}>
      {question.options.map(opt => {
        const rank = order.indexOf(opt.id);
        const isRanked = rank !== -1;
        return (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.id)}
            style={{
              padding: "14px 18px",
              fontSize: 15,
              fontWeight: 500,
              background: isRanked ? "var(--accent-bg)" : "transparent",
              color: isRanked ? "var(--accent)" : "var(--text-h)",
              border: `2px solid ${isRanked ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 14,
              transition: "all 0.15s ease",
            }}
          >
            <span style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: isRanked ? "var(--accent)" : "var(--border)",
              color: isRanked ? "white" : "var(--text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}>
              {isRanked ? rank + 1 : ""}
            </span>
            {opt.text}
          </button>
        );
      })}

      <p style={{ fontSize: 13, color: "var(--text)", margin: "4px 0 0", textAlign: "center" }}>
        {order.length === 0
          ? "Click options in order of preference — start with your top choice"
          : order.length < question.options.length
          ? `${order.length} of ${question.options.length} ranked — confirm now or keep ranking`
          : "All ranked — confirm when ready"}
      </p>

      {canConfirm && (
        <button
          onClick={handleConfirm}
          style={{
            marginTop: 8,
            padding: "13px 28px",
            fontSize: 16,
            fontWeight: 600,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(170,59,255,0.3)",
          }}
        >
          Confirm ranking
        </button>
      )}
    </div>
  );
}

// ─── Slider UI ────────────────────────────────────────────────────────────────
function SliderQuestion({ question, onAnswer }) {
  const [value, setValue] = useState(5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%", maxWidth: 480 }}>
      <div style={{ textAlign: "center" }}>
        <span style={{
          fontSize: 42,
          fontWeight: 800,
          color: "var(--accent)",
          fontFamily: "var(--mono)",
        }}>
          {value}
        </span>
        <span style={{ fontSize: 18, color: "var(--text)", marginLeft: 4 }}>/ 10</span>
      </div>

      <input
        type="range"
        min={1} max={10} step={1}
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer", height: 6 }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span style={{
          fontSize: 13,
          color: "var(--text)",
          maxWidth: 180,
          lineHeight: 1.4,
          textAlign: "left"
        }}>
          {question.labelLow}
        </span>
        <span style={{
          fontSize: 13,
          color: "var(--text)",
          maxWidth: 180,
          lineHeight: 1.4,
          textAlign: "right"
        }}>
          {question.labelHigh}
        </span>
      </div>

      <button
        onClick={() => onAnswer(value)}
        style={{
          padding: "14px 28px",
          fontSize: 16,
          fontWeight: 600,
          background: "var(--accent)",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(170,59,255,0.3)",
          alignSelf: "center",
          marginTop: 4,
        }}
      >
        Continue
      </button>
    </div>
  );
}

// ─── Choice UI ────────────────────────────────────────────────────────────────
function ChoiceQuestion({ question, onAnswer }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 480 }}>
      {question.options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => onAnswer(opt)}
          onMouseEnter={() => setHovered(opt.id)}
          onMouseLeave={() => setHovered(null)}
          style={{
            padding: "14px 18px",
            fontSize: 15,
            fontWeight: 500,
            background: hovered === opt.id ? "var(--accent-bg)" : "transparent",
            color: hovered === opt.id ? "var(--accent)" : "var(--text-h)",
            border: `2px solid ${hovered === opt.id ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 10,
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            transition: "all 0.15s ease",
            lineHeight: 1.5,
          }}
        >
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            opacity: 0.4,
            minWidth: 16,
            marginTop: 2,
            flexShrink: 0,
          }}>
            {String.fromCharCode(65 + i)}
          </span>
          {opt.text}
        </button>
      ))}
    </div>
  );
}

// ─── Main Assessment Component ────────────────────────────────────────────────
export default function Assessment({ goResults }) {
  const [current, setCurrent] = useState(0);       // index into QUESTIONS
  const [showSectionIntro, setShowSectionIntro] = useState(true); // show section 1 intro first
  const [currentSection, setCurrentSection] = useState(1);
  const [rawScores, setRawScores] = useState({});
  const [maxScores, setMaxScores] = useState({});

  const question = QUESTIONS[current];
  const progress = (current / QUESTIONS.length) * 100;

  const applyScores = (addRaw, addMax) => {
    setRawScores(prev => {
      const next = { ...prev };
      Object.entries(addRaw).forEach(([d, v]) => { next[d] = (next[d] || 0) + v; });
      return next;
    });
    setMaxScores(prev => {
      const next = { ...prev };
      Object.entries(addMax).forEach(([d, v]) => { next[d] = (next[d] || 0) + v; });
      return next;
    });
  };

  const advance = (addRaw, addMax) => {
    applyScores(addRaw, addMax);

    const nextIdx = current + 1;
    if (nextIdx >= QUESTIONS.length) {
      // Compute final pcts and call goResults
      const finalRaw = { ...rawScores };
      const finalMax = { ...maxScores };
      Object.entries(addRaw).forEach(([d, v]) => { finalRaw[d] = (finalRaw[d] || 0) + v; });
      Object.entries(addMax).forEach(([d, v]) => { finalMax[d] = (finalMax[d] || 0) + v; });
      goResults(toPct(finalRaw, finalMax));
      return;
    }

    const nextQ = QUESTIONS[nextIdx];
    if (nextQ.section !== question.section) {
      setCurrentSection(nextQ.section);
      setShowSectionIntro(true);
    }
    setCurrent(nextIdx);
  };

  const handleSlider = (value) => {
    const addRaw = {};
    const addMax = {};
    Object.entries(question.dimScores).forEach(([dim, { multiplier, offset }]) => {
      addRaw[dim] = value * multiplier + (offset || 0);
      addMax[dim] = 100;
    });
    advance(addRaw, addMax);
  };

  const handleChoice = (selectedOpt) => {
    const addRaw = {};
    const addMax = getQuestionMaxes(question);
    Object.entries(selectedOpt.scores || {}).forEach(([dim, val]) => {
      addRaw[dim] = val;
    });
    // Ensure dims in max but not in raw get 0 raw
    Object.keys(addMax).forEach(dim => {
      if (addRaw[dim] === undefined) addRaw[dim] = 0;
    });
    advance(addRaw, addMax);
  };

  const handleRanking = (rankings) => {
    const addRaw = {};
    const addMax = {};
    question.options.forEach(opt => {
      const weight = RANK_WEIGHTS[rankings[opt.id]] || 0;
      Object.entries(opt.rankScores || {}).forEach(([dim, val]) => {
        addRaw[dim] = (addRaw[dim] || 0) + val * weight;
        const maxContrib = val * RANK_WEIGHTS[1];
        if ((addMax[dim] || 0) < maxContrib) addMax[dim] = maxContrib;
      });
    });
    advance(addRaw, addMax);
  };

  // Section intro screen
  if (showSectionIntro) {
    const section = SECTIONS.find(s => s.id === currentSection);
    return (
      <SectionIntro
        section={section}
        questionNum={current + 1}
        onContinue={() => setShowSectionIntro(false)}
      />
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "40px 20px",
    }}>
      {/* Progress header */}
      <div style={{ width: "100%", maxWidth: 520, marginBottom: 48 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          fontSize: 14,
          color: "var(--text)"
        }}>
          <span>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {SECTIONS.find(s => s.id === question.section)?.name}
            </span>
            {" · "}Q{current + 1} of {QUESTIONS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 6, background: "var(--border)", borderRadius: 99 }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--accent)",
            borderRadius: 99,
            transition: "width 0.35s ease"
          }} />
        </div>
      </div>

      {/* Question text */}
      <h2 style={{
        maxWidth: 500,
        marginBottom: question.type === "ranking" ? 28 : 36,
        textAlign: "center",
        lineHeight: 1.4,
        fontSize: 20,
      }}>
        {question.text}
      </h2>

      {/* Answer UI */}
      {question.type === "slider" && (
        <SliderQuestion question={question} onAnswer={handleSlider} />
      )}
      {question.type === "choice" && (
        <ChoiceQuestion question={question} onAnswer={handleChoice} />
      )}
      {question.type === "ranking" && (
        <RankingQuestion question={question} onAnswer={handleRanking} />
      )}
    </div>
  );
}
