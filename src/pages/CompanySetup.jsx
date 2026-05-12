import { useState } from "react";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { DIMS } from "../utils/scores";

const DIM_INFO = {
  autonomy:      { label: "Autonomy",            icon: "🧭", desc: "How independently do people operate in this role? High = self-directed; Low = closely guided." },
  structure:     { label: "Structure",           icon: "🏗️", desc: "How process-driven is your environment? High = defined playbooks; Low = fluid and improvised." },
  execution:     { label: "Precision",           icon: "🎯", desc: "Is quality or speed more valued? High = high standards required; Low = throughput over perfection." },
  ownership:     { label: "Ownership Scope",     icon: "⚙️", desc: "How broadly do people own outcomes? High = full accountability beyond role; Low = clearly scoped." },
  collaboration: { label: "Collaboration",       icon: "🤝", desc: "How central is teamwork vs individual contribution? High = team-first culture; Low = solo execution." },
  ambiguity:     { label: "Ambiguity Tolerance", icon: "🌫️", desc: "How much uncertainty does this role require? High = constant ambiguity; Low = clearly defined." },
  leadership:    { label: "Leadership Drive",    icon: "🚀", desc: "How much initiative and influence does this role demand? High = proactive direction-setting." },
  resilience:    { label: "Resilience",          icon: "💪", desc: "How demanding is the pace and pressure? High = sustained intensity; Low = manageable cadence." },
};

function randomKey() {
  return Array.from(crypto.getRandomValues(new Uint8Array(18)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const DEFAULT_TARGETS = Object.fromEntries(DIMS.map(d => [d, 50]));

export default function CompanySetup({ onBack }) {
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [links, setLinks] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const companyRef = doc(collection(db, "companies"));
      const dashboardKey = randomKey();
      await setDoc(companyRef, {
        name: name.trim() || "My Company",
        target: targets,
        dashboardKey,
        createdAt: new Date().toISOString(),
      });
      const base = window.location.origin + window.location.pathname;
      setLinks({
        candidate: `${base}?c=${companyRef.id}`,
        dashboard: `${base}?d=${companyRef.id}&k=${dashboardKey}`,
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const handleCopy = async (field) => {
    await navigator.clipboard.writeText(links[field]);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (status === "saved") {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        padding: "48px 20px",
        gap: 28
      }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h1 style={{ margin: 0 }}>Profile saved!</h1>
        <p style={{ color: "var(--text)", fontSize: 17, textAlign: "center", maxWidth: 480 }}>
          Share the candidate link in your job posting. Bookmark the dashboard link — it's your private view.
        </p>

        {[
          {
            field: "candidate",
            icon: "🔗",
            title: "Candidate link",
            desc: "Paste this in your LinkedIn, Indeed, or job posting. Candidates who open it take the assessment for free.",
          },
          {
            field: "dashboard",
            icon: "📊",
            title: "Your dashboard (keep this private)",
            desc: "Bookmark this. It shows every candidate ranked by culture match across 8 dimensions. Don't share it publicly.",
          },
        ].map(({ field, icon, title, desc }) => (
          <div key={field} style={{
            width: "100%",
            maxWidth: 520,
            padding: "20px 24px",
            border: `1px solid ${field === "dashboard" ? "var(--accent-border)" : "var(--border)"}`,
            background: field === "dashboard" ? "var(--accent-bg)" : "transparent",
            borderRadius: 14,
            textAlign: "left"
          }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-h)", marginBottom: 6 }}>
              {icon} {title}
            </div>
            <p style={{ fontSize: 14, color: "var(--text)", margin: "0 0 14px" }}>{desc}</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{
                flex: 1,
                padding: "9px 14px",
                background: "var(--code-bg)",
                borderRadius: 8,
                fontSize: 13,
                fontFamily: "var(--mono)",
                color: "var(--text-h)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {links[field]}
              </div>
              <button
                onClick={() => handleCopy(field)}
                style={{
                  padding: "9px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  background: field === "dashboard" ? "var(--accent)" : "var(--border)",
                  color: field === "dashboard" ? "white" : "var(--text-h)",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
              >
                {copiedField === field ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={onBack}
          style={{
            padding: "10px 24px",
            fontSize: 15,
            background: "transparent",
            color: "var(--text)",
            border: "2px solid var(--border)",
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      padding: "48px 20px",
      gap: 32
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ margin: "0 0 10px" }}>Company Profile</h1>
        <p style={{ color: "var(--text)", fontSize: 16 }}>
          Define your ideal culture across 8 behavioral dimensions. Candidates will be matched and ranked against this profile automatically.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 520 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>
          Company name
        </label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Acme Corp"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 16,
            border: "2px solid var(--border)",
            borderRadius: 10,
            background: "transparent",
            color: "var(--text-h)",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: "var(--sans)"
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 520 }}>
        {DIMS.map(dim => {
          const info = DIM_INFO[dim];
          const val = targets[dim];
          const level = val >= 75 ? "High" : val >= 50 ? "Moderate" : val >= 25 ? "Low" : "Very low";
          return (
            <div key={dim} style={{
              padding: "18px 22px",
              border: "1px solid var(--border)",
              borderRadius: 12,
              boxShadow: "var(--shadow)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                <span style={{ fontSize: 18 }}>{info.icon}</span>
                <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: 15 }}>{info.label}</span>
                <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--accent)", fontSize: 14 }}>
                  {level} · {val}%
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 14px", lineHeight: 1.4 }}>{info.desc}</p>
              <input
                type="range"
                min={0} max={100} step={5}
                value={val}
                onChange={e => setTargets(t => ({ ...t, [dim]: Number(e.target.value) }))}
                style={{ width: "100%", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text)", marginTop: 5 }}>
                <span>Not a priority</span>
                <span>Essential</span>
              </div>
            </div>
          );
        })}
      </div>

      {status === "error" && (
        <p style={{ color: "#ef4444", fontSize: 14 }}>
          Failed to save. Make sure Firebase is configured in src/firebase.js.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 520 }}>
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          style={{
            width: "100%",
            padding: "14px 36px",
            fontSize: 17,
            fontWeight: 600,
            background: status === "saving" ? "var(--border)" : "var(--accent)",
            color: status === "saving" ? "var(--text)" : "white",
            border: "none",
            borderRadius: 10,
            cursor: status === "saving" ? "default" : "pointer",
            boxShadow: status === "saving" ? "none" : "0 4px 16px rgba(170,59,255,0.35)"
          }}
        >
          {status === "saving" ? "Saving…" : "Save profile & generate links"}
        </button>
        <button
          onClick={onBack}
          style={{
            padding: "10px 24px",
            fontSize: 15,
            background: "transparent",
            color: "var(--text)",
            border: "2px solid var(--border)",
            borderRadius: 10,
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
