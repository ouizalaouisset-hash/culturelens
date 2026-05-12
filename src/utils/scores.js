export const DIMS = ['autonomy', 'structure', 'execution', 'ownership', 'collaboration', 'ambiguity', 'leadership', 'resilience'];
export const RISK_DIMS = ['burnout', 'validation'];
export const ALL_DIMS = [...DIMS, ...RISK_DIMS];

// Encode/decode percentages (0–100 integers) for URL sharing
export function encodeScores(pcts) {
  return ALL_DIMS.map(d => Math.round(pcts[d] ?? 0)).join('-');
}

export function decodeScores(str) {
  const parts = str.split('-').map(Number);
  if (parts.length < DIMS.length) return null; // old format — reject
  return Object.fromEntries(ALL_DIMS.map((d, i) => [d, isNaN(parts[i]) ? 0 : parts[i]]));
}

// Convert raw accumulated scores to percentages
export function toPct(rawScores, maxScores) {
  return Object.fromEntries(
    ALL_DIMS.map(d => [
      d,
      (maxScores[d] ?? 0) > 0
        ? Math.min(100, Math.round(((rawScores[d] ?? 0) / maxScores[d]) * 100))
        : 0
    ])
  );
}

const ARCHETYPE_MAP = {
  'autonomy+leadership': {
    name: 'The Founder Mindset',
    desc: 'You operate with high independence and a strong drive to lead. You define direction, move with conviction, and bring others along through clarity of vision. Most effective in early-stage environments and founding teams where self-direction and initiative are survival traits.'
  },
  'ambiguity+autonomy': {
    name: 'The Pioneer',
    desc: 'You thrive where others stall. Energized by undefined territory, you don\'t wait for a roadmap — you draw one. Ambiguity isn\'t a constraint; it\'s an invitation. Best suited for roles where the job is to figure out what the job is.'
  },
  'leadership+ownership': {
    name: 'The Operator',
    desc: 'You run things. Clear accountability, high follow-through, and a drive to own outcomes — not just tasks. You make organizations function at their highest level. The person executives trust to execute without babysitting.'
  },
  'collaboration+leadership': {
    name: 'The Catalyst',
    desc: 'You make teams better. You build trust quickly, elevate the work of those around you, and lead through influence rather than authority. Culture carriers, coalition builders — the kind of person that raises the floor of every room they walk into.'
  },
  'execution+structure': {
    name: 'The Craftsperson',
    desc: 'You build things right. Precision, strong systems thinking, and a non-negotiable standard for quality define your output. You\'re the person who makes great work look effortless — because you put in the discipline others skip.'
  },
  'ownership+structure': {
    name: 'The Reliable Architect',
    desc: 'You build systems people count on. You bring order to complexity, own your scope fully, and create infrastructure that outlasts you. Organizations depend on profiles like yours to convert early chaos into durable process.'
  },
  'ambiguity+resilience': {
    name: 'The Startup Athlete',
    desc: 'Pressure sharpens you. Ambiguity doesn\'t paralyze you. You operate at your best when the rules haven\'t been written yet — essential in hypergrowth environments where the only constant is that everything will change by Thursday.'
  },
  'collaboration+resilience': {
    name: 'The Team Anchor',
    desc: 'You are the glue. Grounded, consistent, and deeply attuned to the people around you — you\'re who teams stabilize around when everything else is uncertain. Your presence prevents entropy. That\'s rarer than most organizations realize.'
  },
  'ambiguity+leadership': {
    name: 'The Venture Builder',
    desc: 'You build from zero. You make calls with incomplete information, create direction from chaos, and carry others into a vision that doesn\'t fully exist yet. The archetype of a founding leader in motion.'
  },
  'execution+ownership': {
    name: 'The Precision Driver',
    desc: 'You deliver with exceptional accuracy and own the outcome completely. High standards, no-excuses accountability, and a refusal to let quality slip. You raise the bar of everyone working alongside you.'
  },
  'autonomy+execution': {
    name: 'The Deep Expert',
    desc: 'You do your best work alone, at the highest level. Independent, precise, and quietly excellent — you produce output that doesn\'t require explanation. Organizations need you more than they know how to ask for you.'
  },
  'ambiguity+collaboration': {
    name: 'The Adaptive Collaborator',
    desc: 'You flex without breaking. You read rooms, shift roles in teams naturally, and find a way to connect and contribute regardless of how the environment shifts. A rare combination of social intelligence and structural resilience.'
  },
  'ownership+resilience': {
    name: 'The Steady Leader',
    desc: 'You hold things together. You absorb pressure without fracturing, own outcomes fully, and provide the kind of consistent presence organizations depend on in turbulent periods. Stability isn\'t boring — it\'s load-bearing.'
  },
  'leadership+structure': {
    name: 'The Systems Thinker',
    desc: 'You build the scaffolding others work within. You see process as an enabler of scale, lead with data and frameworks, and thrive when turning early-stage chaos into repeatable, durable systems.'
  },
  'autonomy+resilience': {
    name: 'The Resilient Maverick',
    desc: 'You operate independently and bounce back fast. You don\'t need external validation to keep moving, and difficult environments sharpen rather than diminish you. The rarest combination: self-directed and unbreakable.'
  },
  'collaboration+structure': {
    name: 'The Structured Collaborator',
    desc: 'You bring both discipline and warmth to teams. You value clear processes and strong relationships equally — the person who makes collaboration feel organized and people feel seen simultaneously.'
  },
  'autonomy+collaboration': {
    name: 'The Independent Connector',
    desc: 'You move fast on your own and invest deeply in people. You don\'t need to be managed, but you care about the humans you work with. A natural fit for cross-functional roles that require both self-direction and relationship capital.'
  },
  'resilience+structure': {
    name: 'The Grounded Executor',
    desc: 'You perform consistently in demanding conditions and do your best work within clear frameworks. Reliable under pressure, methodical in approach — the kind of professional who keeps score and keeps delivering.'
  },
};

export function getArchetype(pcts) {
  const sorted = DIMS.map(d => [d, pcts[d] ?? 0]).sort((a, b) => b[1] - a[1]);
  const [t1, t2] = sorted.map(([k]) => k);
  const key = [t1, t2].sort().join('+');
  return ARCHETYPE_MAP[key] ?? {
    name: 'The Versatile Operator',
    desc: 'You score across the board without a single dominant orientation — adaptive, multi-skilled, and effective in a wide range of contexts. Organizations that need flexibility over specialization will value this profile highly.'
  };
}

export function getMatchScore(candidatePcts, targetPcts) {
  const total = DIMS.reduce((sum, d) => {
    return sum + (100 - Math.abs((candidatePcts[d] ?? 0) - (targetPcts[d] ?? 0)));
  }, 0);
  return Math.round(total / DIMS.length);
}

// Weighted scoring matrix — used for advanced profile reporting
// Each dimension weight reflects its predictive power for startup culture fit
export const DIM_WEIGHTS = {
  autonomy:      0.14,
  structure:     0.10,
  execution:     0.10,
  ownership:     0.14,
  collaboration: 0.10,
  ambiguity:     0.16,
  leadership:    0.14,
  resilience:    0.12,
};

export function getWeightedFitScore(pcts) {
  return Math.round(
    DIMS.reduce((sum, d) => sum + (pcts[d] ?? 0) * DIM_WEIGHTS[d], 0)
  );
}

export function getRiskFlags(pcts) {
  const flags = [];
  if ((pcts.burnout ?? 0) >= 65) {
    flags.push({
      type: 'burnout',
      label: 'Burnout Risk',
      detail: 'Tends to push through exhaustion rather than pace sustainably. May require proactive check-ins in high-demand environments.',
    });
  }
  if ((pcts.validation ?? 0) >= 65) {
    flags.push({
      type: 'validation',
      label: 'Validation Dependency',
      detail: 'External feedback strongly shapes sense of progress and self-worth. Thrives with regular recognition; may struggle in low-feedback cultures.',
    });
  }
  return flags;
}
