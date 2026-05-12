import { useState, useEffect } from "react";
import { generateQuickInsight } from "../utils/reportApi";

function Pulse() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text)", fontSize: 13 }}>
      <style>{`
        @keyframes qi-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .qi-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:qi-pulse 1.4s ease-in-out infinite; }
        .qi-dot:nth-child(2){ animation-delay:0.2s }
        .qi-dot:nth-child(3){ animation-delay:0.4s }
      `}</style>
      <div className="qi-dot" />
      <div className="qi-dot" />
      <div className="qi-dot" />
      <span style={{ opacity: 0.7 }}>Generating your insight…</span>
    </div>
  );
}

export default function QuickInsight({ pcts }) {
  const [state, setState] = useState("loading"); // loading | done | error | nokey
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      setState("nokey");
      return;
    }
    generateQuickInsight(pcts)
      .then(data => { setInsight(data); setState("done"); })
      .catch(() => setState("error"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === "nokey" || state === "error") return null;

  return (
    <div style={{
      width: "100%",
      maxWidth: 520,
      border: "1px solid var(--accent-border)",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 22px",
        background: "var(--accent-bg)",
        borderBottom: "1px solid var(--accent-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--accent)",
        }}>
          ✦ Key Insight
        </div>
        {state === "loading" && <Pulse />}
        {state === "done" && (
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text)",
            opacity: 0.5,
          }}>
            Focus: {insight.lowestDim}
          </div>
        )}
      </div>

      {/* Body */}
      {state === "loading" && (
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
          <style>{`@keyframes sk-pulse{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
          {[90, 100, 75, 100, 60].map((w, i) => (
            <div key={i} style={{
              height: 13,
              width: `${w}%`,
              background: "var(--border)",
              borderRadius: 6,
              animation: "sk-pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      )}

      {state === "done" && insight && (
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile */}
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-h)",
            margin: 0,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            "{insight.profile}"
          </p>

          {/* Key weakness */}
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text)",
              opacity: 0.6,
              marginBottom: 6,
            }}>
              What to watch
            </div>
            <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.7 }}>
              {insight.keyWeakness}
            </p>
          </div>

          {/* Action */}
          <div style={{
            padding: "14px 16px",
            background: "var(--code-bg, rgba(255,255,255,0.03))",
            border: "1px solid var(--border)",
            borderRadius: 10,
          }}>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--accent)",
              marginBottom: 6,
            }}>
              This week
            </div>
            <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.65 }}>
              {insight.actionAdvice}
            </p>
          </div>

          {/* Book */}
          {insight.book && (
            <a
              href={insight.book.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "14px 16px",
                background: "var(--accent-bg)",
                border: "1px solid var(--accent-border)",
                borderRadius: 10,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{
                width: 48, height: 64, borderRadius: 5, overflow: "hidden", flexShrink: 0,
                background: "var(--accent-bg)", border: "1px solid var(--accent-border)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                {insight.book.image
                  ? <img src={insight.book.image} alt={insight.book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                  : "📖"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-h)", marginBottom: 2 }}>
                  {insight.book.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>
                  {insight.book.author}
                </div>
                <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.55 }}>
                  {insight.book.reason}
                </p>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
                  Read or get the book →
                </span>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
