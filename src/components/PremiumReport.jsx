import { useState } from "react";
import { generateReport } from "../utils/reportApi";

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: "var(--accent)",
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function BookCTA({ book }) {
  if (!book) return null;
  return (
    <a
      href={book.link}
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
        marginTop: 14,
        transition: "opacity 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <div style={{
        width: 44, height: 60, borderRadius: 5, overflow: "hidden", flexShrink: 0,
        background: "var(--accent-bg)", border: "1px solid var(--accent-border)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>
        {book.image
          ? <img src={book.image} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
          : "📖"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-h)", marginBottom: 2 }}>
          {book.title}
        </div>
        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>
          {book.author}
        </div>
        <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.55 }}>
          {book.reason}
        </p>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "0.02em",
        }}>
          Read or get the book →
        </span>
      </div>
    </a>
  );
}

function SkeletonBlock({ height = 16, width = "100%", mb = 8 }) {
  return (
    <div style={{
      height,
      width,
      background: "var(--border)",
      borderRadius: 6,
      marginBottom: mb,
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ padding: "24px 28px", border: "1px solid var(--border)", borderRadius: 16 }}>
        <SkeletonBlock height={12} width="30%" mb={14} />
        <SkeletonBlock height={22} width="70%" mb={20} />
        <SkeletonBlock height={14} mb={8} />
        <SkeletonBlock height={14} mb={8} />
        <SkeletonBlock height={14} width="85%" mb={0} />
      </div>
      {[1, 2].map(i => (
        <div key={i} style={{ padding: "20px 24px", border: "1px solid var(--border)", borderRadius: 14 }}>
          <SkeletonBlock height={12} width="25%" mb={12} />
          <SkeletonBlock height={18} width="55%" mb={14} />
          <SkeletonBlock height={13} mb={7} />
          <SkeletonBlock height={13} width="90%" mb={0} />
        </div>
      ))}
    </div>
  );
}

// ─── Section cards ─────────────────────────────────────────────────────────────

function HeadlineCard({ headline, profileSummary }) {
  const paras = profileSummary.split(/\n\n+/);
  return (
    <div style={{
      padding: "28px 30px",
      background: "var(--accent-bg)",
      border: "1px solid var(--accent-border)",
      borderRadius: 18,
    }}>
      <SectionLabel>AI Profile Report</SectionLabel>
      <h2 style={{ margin: "0 0 20px", fontSize: 22, color: "var(--text-h)", fontWeight: 700, lineHeight: 1.3 }}>
        {headline}
      </h2>
      {paras.map((p, i) => (
        <p key={i} style={{ fontSize: 15, color: "var(--text)", margin: i < paras.length - 1 ? "0 0 14px" : 0, lineHeight: 1.75 }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function CorePatternsCard({ patterns }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--accent-bg)" }}>
        <SectionLabel>Core Patterns</SectionLabel>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
          The recurring behavioral signatures that define how you work.
        </p>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {patterns.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--accent-bg)",
              border: "1px solid var(--accent-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-h)", marginBottom: 4 }}>
                {p.title}
              </div>
              <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StrengthsCard({ strengths }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--accent-bg)" }}>
        <SectionLabel>Competitive Strengths</SectionLabel>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
          Where your profile gives you a genuine edge over most professionals.
        </p>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {strengths.map((s, i) => (
          <div key={i} style={{
            padding: "12px 16px",
            background: "rgba(34,197,94,0.04)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ color: "#22c55e", fontSize: 16 }}>✦</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-h)" }}>{s.title}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.55, paddingLeft: 26 }}>
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlindSpotsCard({ blindSpots }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "rgba(239,68,68,0.03)" }}>
        <SectionLabel>Blind Spots & Derailers</SectionLabel>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
          Patterns that will quietly limit your trajectory if left unaddressed.
        </p>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {blindSpots.map((b, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ color: "#ef4444", fontSize: 16 }}>◆</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#ef4444" }}>{b.title}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 0 26px", lineHeight: 1.6 }}>
              {b.description}
            </p>
            {b.book && <div style={{ paddingLeft: 26 }}><BookCTA book={b.book} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function IdealEnvironmentCard({ idealEnvironment }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--accent-bg)" }}>
        <SectionLabel>Your Ideal Environment</SectionLabel>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
          {idealEnvironment.summary}
        </p>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {idealEnvironment.traits.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 14, color: "var(--text)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthCard({ recommendations }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", background: "var(--accent-bg)" }}>
        <SectionLabel>Growth Recommendations</SectionLabel>
        <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
          The three development priorities with the highest leverage for your specific profile.
        </p>
      </div>
      <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
        {recommendations.map((r, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                color: "white",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-h)" }}>{r.area}</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 6px 34px", lineHeight: 1.6 }}>
              {r.insight}
            </p>
            <div style={{
              marginLeft: 34,
              padding: "10px 14px",
              background: "var(--code-bg, rgba(255,255,255,0.03))",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text)",
              lineHeight: 1.55,
              marginBottom: 0,
            }}>
              <span style={{ fontWeight: 700, color: "var(--text-h)" }}>30-day action: </span>
              {r.action}
            </div>
            {r.book && <div style={{ paddingLeft: 34 }}><BookCTA book={r.book} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PremiumReport({ pcts }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setState("loading");
    setError(null);
    try {
      const data = await generateReport(pcts);
      setReport(data);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  };

  if (state === "idle") {
    return (
      <div style={{
        width: "100%",
        maxWidth: 520,
        padding: "28px 30px",
        border: "1px solid var(--accent-border)",
        borderRadius: 18,
        background: "var(--accent-bg)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "var(--text-h)", fontWeight: 700 }}>
          AI Psychological Report
        </h3>
        <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 22px", lineHeight: 1.7 }}>
          Get a premium executive-level profile — your core patterns, competitive strengths,
          blind spots, and targeted growth plan, generated by Claude Opus.
        </p>
        <button
          onClick={handleGenerate}
          style={{
            padding: "13px 28px",
            fontSize: 15,
            fontWeight: 700,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(170,59,255,0.3)",
          }}
        >
          Generate my report
        </button>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 24, color: "var(--text)", fontSize: 14 }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>✦</div>
          Analyzing your profile with Claude Opus…
          <br />
          <span style={{ opacity: 0.6, fontSize: 12 }}>This takes 15–30 seconds</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div style={{
        width: "100%",
        maxWidth: 520,
        padding: "24px 28px",
        border: "1px solid #fca5a5",
        borderRadius: 16,
        background: "rgba(239,68,68,0.04)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
        <p style={{ fontSize: 14, color: "#ef4444", margin: "0 0 16px", lineHeight: 1.6 }}>
          {error}
        </p>
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 22px",
            fontSize: 14,
            fontWeight: 600,
            background: "transparent",
            color: "var(--text)",
            border: "2px solid var(--border)",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 16 }}>
      <HeadlineCard headline={report.headline} profileSummary={report.profileSummary} />
      <CorePatternsCard patterns={report.corePatterns} />
      <StrengthsCard strengths={report.strengths} />
      <BlindSpotsCard blindSpots={report.blindSpots} />
      <IdealEnvironmentCard idealEnvironment={report.idealEnvironment} />
      <GrowthCard recommendations={report.growthRecommendations} />

      <p style={{
        fontSize: 11,
        color: "var(--text)",
        textAlign: "center",
        opacity: 0.5,
        margin: "4px 0 0",
        lineHeight: 1.5,
      }}>
        Generated by Claude Opus · Based on your behavioral assessment ·
        Book links may be affiliate links
      </p>
    </div>
  );
}
