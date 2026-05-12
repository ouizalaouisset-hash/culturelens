import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DIMS } from "../utils/scores";

const DIM_INFO = {
  autonomy:      { label: "Autonomy",    icon: "🧭" },
  structure:     { label: "Structure",   icon: "🏗️" },
  execution:     { label: "Precision",   icon: "🎯" },
  ownership:     { label: "Ownership",   icon: "⚙️" },
  collaboration: { label: "Collab",      icon: "🤝" },
  ambiguity:     { label: "Ambiguity",   icon: "🌫️" },
  leadership:    { label: "Leadership",  icon: "🚀" },
  resilience:    { label: "Resilience",  icon: "💪" },
};

function matchColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "var(--accent)";
  return "#f59e0b";
}

function matchLabel(score) {
  if (score >= 80) return "Strong match";
  if (score >= 65) return "Good match";
  if (score >= 50) return "Partial match";
  return "Low match";
}

export default function Dashboard({ companyId, dashboardKey }) {
  const [company, setCompany] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [companyDoc, snap] = await Promise.all([
          getDoc(doc(db, "companies", companyId)),
          getDocs(collection(db, "companies", companyId, "candidates")),
        ]);
        if (!companyDoc.exists() || companyDoc.data().dashboardKey !== dashboardKey) {
          setError("Invalid or expired dashboard link.");
          setLoading(false);
          return;
        }
        setCompany(companyDoc.data());
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => b.matchScore - a.matchScore);
        setCandidates(list);
      } catch {
        setError("Failed to load dashboard. Make sure Firebase is configured in src/firebase.js.");
      }
      setLoading(false);
    }
    load();
  }, [companyId, dashboardKey]);

  const candidateLink = `${window.location.origin}${window.location.pathname}?c=${companyId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(candidateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <p style={{ color: "var(--text)" }}>Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <p style={{ color: "var(--text)", textAlign: "center", maxWidth: 400 }}>{error}</p>
      </div>
    );
  }

  // Show only first 4 dims in collapsed view; expand to all 8
  const compactDims = DIMS.slice(0, 4);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      padding: "48px 20px",
      gap: 28,
      maxWidth: 760,
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box"
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: "0 0 6px" }}>{company.name || "Dashboard"}</h1>
          <p style={{ color: "var(--text)", margin: 0 }}>
            {candidates.length === 0
              ? "No candidates yet — share your assessment link to get started."
              : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} · ranked by culture match across 8 dimensions`}
          </p>
        </div>
        <button
          onClick={handleCopyLink}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 10px rgba(170,59,255,0.3)"
          }}
        >
          {copied ? "✓ Copied!" : "Copy candidate link"}
        </button>
      </div>

      {/* Company target summary */}
      <div style={{
        padding: "14px 20px",
        border: "1px solid var(--border)",
        borderRadius: 12,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>Target:</span>
        {DIMS.map(d => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <span>{DIM_INFO[d].icon}</span>
            <span style={{ color: "var(--text-h)", fontWeight: 500 }}>{DIM_INFO[d].label}</span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{company.target[d] ?? 50}%</span>
          </div>
        ))}
      </div>

      {/* Candidates */}
      {candidates.length === 0 ? (
        <div style={{
          padding: "48px 24px",
          border: "2px dashed var(--border)",
          borderRadius: 14,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
          <p style={{ color: "var(--text)", margin: 0 }}>
            Share the candidate link above in your job posting on LinkedIn, Indeed, or anywhere else.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {candidates.map((c, i) => {
            const isExpanded = expandedId === c.id;
            const dimsToShow = isExpanded ? DIMS : compactDims;

            return (
              <div key={c.id} style={{
                padding: "20px 24px",
                border: "1px solid var(--border)",
                borderRadius: 14,
                boxShadow: "var(--shadow)",
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                flexWrap: "wrap"
              }}>
                {/* Rank + match gauge */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60 }}>
                  <div style={{ fontSize: 12, color: "var(--text)", marginBottom: 6 }}>#{i + 1}</div>
                  <div style={{
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: `conic-gradient(${matchColor(c.matchScore)} ${c.matchScore * 3.6}deg, var(--border) 0deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "var(--bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 12,
                      color: matchColor(c.matchScore)
                    }}>
                      {c.matchScore}%
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: matchColor(c.matchScore),
                    fontWeight: 600,
                    marginTop: 5,
                    textAlign: "center",
                    lineHeight: 1.2
                  }}>
                    {matchLabel(c.matchScore)}
                  </div>
                </div>

                {/* Candidate details */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 17, color: "var(--text-h)" }}>{c.name}</span>
                    <span style={{
                      fontSize: 12,
                      color: "var(--accent)",
                      fontWeight: 600,
                      background: "var(--accent-bg)",
                      padding: "2px 10px",
                      borderRadius: 99
                    }}>
                      {c.archetype}
                    </span>
                  </div>

                  {/* Mini dimension bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {dimsToShow.map(d => (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, color: "var(--text)", width: 80, flexShrink: 0 }}>
                          {DIM_INFO[d].icon} {DIM_INFO[d].label}
                        </span>
                        <div style={{ flex: 1, height: 5, background: "var(--border)", borderRadius: 99, position: "relative" }}>
                          <div style={{
                            height: "100%",
                            width: `${c.pcts?.[d] ?? 0}%`,
                            background: "var(--accent)",
                            borderRadius: 99
                          }} />
                          {company.target[d] != null && (
                            <div style={{
                              position: "absolute",
                              top: -3,
                              left: `${company.target[d]}%`,
                              width: 3,
                              height: 11,
                              background: "#f59e0b",
                              borderRadius: 2,
                              transform: "translateX(-50%)"
                            }} />
                          )}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-h)", width: 28, textAlign: "right" }}>
                          {c.pcts?.[d] ?? 0}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    style={{
                      marginTop: 10,
                      background: "none",
                      border: "none",
                      color: "var(--accent)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {isExpanded ? "▲ Show fewer dimensions" : "▼ Show all 8 dimensions"}
                  </button>

                  {c.submittedAt && (
                    <div style={{ fontSize: 12, color: "var(--text)", marginTop: 8 }}>
                      Submitted {new Date(c.submittedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
