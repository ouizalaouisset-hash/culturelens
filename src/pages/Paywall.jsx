import { getArchetype, encodeScores, DIMS } from "../utils/scores";

// ▼ Replace this with your Stripe Payment Link after creating it at dashboard.stripe.com
const STRIPE_LINK = "https://buy.stripe.com/YOUR_LINK_HERE";

const DIM_LABELS = {
  autonomy:      "Autonomy",
  structure:     "Structure",
  execution:     "Precision",
  ownership:     "Ownership",
  collaboration: "Collaboration",
  ambiguity:     "Ambiguity",
  leadership:    "Leadership",
  resilience:    "Resilience",
};

const DIM_ICONS = {
  autonomy:      "🧭",
  structure:     "🏗️",
  execution:     "🎯",
  ownership:     "⚙️",
  collaboration: "🤝",
  ambiguity:     "🌫️",
  leadership:    "🚀",
  resilience:    "💪",
};

// Show 4 dims in paywall preview (first half)
const PREVIEW_DIMS = DIMS.slice(0, 4);

export default function Paywall({ scores }) {
  // scores is already pcts in v2
  const pcts = scores || {};
  const archetype = getArchetype(pcts);

  const handlePay = () => {
    localStorage.setItem("cl_pending_scores", JSON.stringify(pcts));
    window.location.href = STRIPE_LINK;
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      padding: "48px 20px",
      gap: 28
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <h1 style={{ margin: "0 0 10px" }}>Your results are ready</h1>
        <p style={{ color: "var(--text)", fontSize: 17 }}>Unlock your full culture profile for a one-time payment.</p>
      </div>

      {/* Archetype teaser */}
      <div style={{
        width: "100%",
        maxWidth: 520,
        padding: "24px 28px",
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-border)",
        borderRadius: 16,
        textAlign: "left"
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Your archetype
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-h)", marginBottom: 12 }}>
          {archetype.name}
        </div>
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 15, color: "var(--text)", margin: 0, lineHeight: 1.6, filter: "blur(5px)", userSelect: "none" }}>
            {archetype.desc}
          </p>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🔒
          </div>
        </div>
      </div>

      {/* Dimension bars — blurred (first 4) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520, position: "relative" }}>
        {PREVIEW_DIMS.map(key => (
          <div key={key} style={{
            padding: "14px 18px",
            border: "1px solid var(--border)",
            borderRadius: 12,
            textAlign: "left",
            filter: "blur(3px)",
            userSelect: "none",
            pointerEvents: "none"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <span style={{ fontSize: 17 }}>{DIM_ICONS[key]}</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-h)" }}>{DIM_LABELS[key]}</span>
              <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--accent)" }}>{pcts[key] ?? 0}%</span>
            </div>
            <div style={{ height: 6, background: "var(--border)", borderRadius: 99 }}>
              <div style={{ height: "100%", width: `${pcts[key] ?? 0}%`, background: "var(--accent)", borderRadius: 99 }} />
            </div>
          </div>
        ))}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            padding: "10px 20px",
            background: "var(--bg)",
            border: "2px solid var(--accent-border)",
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--accent)"
          }}>
            🔒 Unlock all 8 dimensions
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%", maxWidth: 380 }}>
        <button
          onClick={handlePay}
          style={{
            width: "100%",
            padding: "16px 36px",
            fontSize: 18,
            fontWeight: 700,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(170,59,255,0.4)"
          }}
        >
          Unlock full results · $4.99
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)" }}>
          <span>🔐</span>
          <span>One-time payment · Secure checkout via Stripe</span>
        </div>
      </div>
    </div>
  );
}
