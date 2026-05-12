import { useState } from "react";
import { getArchetype, getMatchScore, getRiskFlags, DIMS, encodeScores } from "../utils/scores";
import BookRecommendations from "../components/BookRecommendations";
import PremiumReport from "../components/PremiumReport";
import QuickInsight from "../components/QuickInsight";

const DIMENSION_INFO = {
  autonomy:      { label: "Autonomy",         icon: "🧭", low: "You work well with guidance and collaborative direction.", high: "You operate with high independence — minimal oversight, maximum ownership." },
  structure:     { label: "Structure",        icon: "🏗️", low: "You prefer flexibility and adapt your process to context.", high: "You thrive with clear systems, defined processes, and predictable frameworks." },
  execution:     { label: "Precision",        icon: "🎯", low: "You prioritize speed and throughput — done is better than perfect.", high: "Quality is non-negotiable — you hold high standards even under deadline pressure." },
  ownership:     { label: "Ownership",        icon: "⚙️", low: "You own your scope clearly and let others own theirs.", high: "You feel accountable for outcomes well beyond your direct responsibilities." },
  collaboration: { label: "Collaboration",   icon: "🤝", low: "You do your sharpest thinking independently.", high: "You're energized by working through people — teamwork is how you do your best work." },
  ambiguity:     { label: "Ambiguity Tolerance", icon: "🌫️", low: "You work best in defined environments with clear parameters.", high: "Uncertainty energizes you — you build the road while driving on it." },
  leadership:    { label: "Leadership Drive", icon: "🚀", low: "You contribute with depth and execution, not by seeking to lead.", high: "You naturally step into influence — shaping direction and moving people toward it." },
  resilience:    { label: "Resilience",       icon: "💪", low: "You perform at your best with manageable pace and recovery time.", high: "Sustained pressure sharpens you — you're built for high-demand environments." },
};

const RISK_INFO = {
  burnout: {
    icon: "🔥",
    label: "Burnout Risk",
    color: "#ef4444",
    borderColor: "#fca5a5",
    bgColor: "rgba(239,68,68,0.05)",
  },
  validation: {
    icon: "🪞",
    label: "Validation Dependency",
    color: "#f59e0b",
    borderColor: "#fcd34d",
    bgColor: "rgba(245,158,11,0.05)",
  },
};

export default function Results({ scores, companyTarget, companyName, onRestart }) {
  const [copied, setCopied] = useState(false);

  if (!scores || Object.keys(scores).length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 20 }}>
        <p style={{ color: "var(--text)" }}>No results to display.</p>
        <button onClick={onRestart} style={{ cursor: "pointer" }}>Start over</button>
      </div>
    );
  }

  // scores is already pcts (0–100 per dim) coming from Assessment
  const pcts = scores;
  const archetype = getArchetype(pcts);
  const matchScore = companyTarget ? getMatchScore(pcts, companyTarget) : null;
  const riskFlags = getRiskFlags(pcts);

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", encodeScores(pcts));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchColor = matchScore === null ? null
    : matchScore >= 80 ? "#22c55e"
    : matchScore >= 65 ? "var(--accent)"
    : "#f59e0b";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      padding: "48px 20px",
      gap: 24
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: "0 0 8px" }}>Your Culture Profile</h1>
        <p style={{ color: "var(--text)", fontSize: 16 }}>Scored across 8 behavioral dimensions</p>
      </div>

      {/* Archetype card */}
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
        <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-h)", marginBottom: 10 }}>
          {archetype.name}
        </div>
        <p style={{ fontSize: 15, color: "var(--text)", margin: 0, lineHeight: 1.65 }}>
          {archetype.desc}
        </p>
      </div>

      {/* Company match card */}
      {matchScore !== null && (
        <div style={{
          width: "100%",
          maxWidth: 520,
          padding: "20px 24px",
          border: "1px solid var(--border)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 20
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `conic-gradient(${matchColor} ${matchScore * 3.6}deg, var(--border) 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: matchColor
            }}>
              {matchScore}%
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--text-h)", marginBottom: 4 }}>
              {matchScore >= 80 ? "Strong match" : matchScore >= 65 ? "Good match" : "Partial match"} with {companyName || "this company"}
            </div>
            <div style={{ fontSize: 14, color: "var(--text)" }}>
              {matchScore >= 80
                ? "Your working style aligns closely with their culture across all key dimensions."
                : matchScore >= 65
                ? "You share core values with meaningful differences worth exploring in conversation."
                : "Your profile brings a distinct perspective — different from their target, not necessarily incompatible."}
            </div>
          </div>
        </div>
      )}

      {/* Quick AI insight */}
      <QuickInsight pcts={pcts} />

      {/* Dimension bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 520 }}>
        <h3 style={{ margin: "8px 0 4px", fontSize: 15, color: "var(--text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Dimension Breakdown
        </h3>
        {DIMS.map(key => {
          const info = DIMENSION_INFO[key];
          const pct = pcts[key] ?? 0;
          const targetPct = companyTarget ? (companyTarget[key] ?? null) : null;
          const isHigh = pct >= 60;

          return (
            <div key={key} style={{
              padding: "16px 20px",
              border: "1px solid var(--border)",
              borderRadius: 12,
              textAlign: "left",
              boxShadow: "var(--shadow)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{info.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-h)" }}>{info.label}</span>
                <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 16, color: "var(--accent)" }}>{pct}%</span>
              </div>

              <div style={{ position: "relative", height: 7, background: "var(--border)", borderRadius: 99, marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: 99, transition: "width 0.6s ease" }} />
                {targetPct !== null && (
                  <div style={{
                    position: "absolute",
                    top: -3,
                    left: `${targetPct}%`,
                    width: 3,
                    height: 13,
                    background: "#f59e0b",
                    borderRadius: 2,
                    transform: "translateX(-50%)"
                  }} />
                )}
              </div>

              {targetPct !== null && (
                <div style={{ fontSize: 12, color: "var(--text)", marginBottom: 7 }}>
                  <span style={{ color: "#f59e0b", fontWeight: 600 }}>◆</span> Company target: {targetPct}%
                </div>
              )}

              <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                {isHigh ? info.high : info.low}
              </p>
            </div>
          );
        })}
      </div>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 520 }}>
          <h3 style={{ margin: "8px 0 4px", fontSize: 15, color: "var(--text)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Signals to Watch
          </h3>
          {riskFlags.map(flag => {
            const info = RISK_INFO[flag.type];
            return (
              <div key={flag.type} style={{
                padding: "16px 20px",
                border: `1px solid ${info.borderColor}`,
                background: info.bgColor,
                borderRadius: 12,
                textAlign: "left",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}>
                  <span style={{ fontSize: 18 }}>{info.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 15, color: info.color }}>{flag.label}</span>
                  <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 15, color: info.color }}>
                    {pcts[flag.type]}%
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.5 }}>
                  {flag.detail}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Book recommendations */}
      <BookRecommendations pcts={pcts} />

      {/* AI premium report */}
      <PremiumReport pcts={pcts} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
        <button
          onClick={handleShare}
          style={{
            padding: "12px 24px",
            fontSize: 15,
            fontWeight: 600,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(170,59,255,0.3)"
          }}
        >
          {copied ? "✓ Link copied!" : "Share results"}
        </button>
        <button
          onClick={onRestart}
          style={{
            padding: "12px 24px",
            fontSize: 15,
            fontWeight: 500,
            background: "transparent",
            color: "var(--text)",
            border: "2px solid var(--border)",
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          Take it again
        </button>
      </div>
    </div>
  );
}
