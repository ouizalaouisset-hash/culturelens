import { useState } from "react";

export default function CandidateInfo({ onNext, companyName }) {
  const [name, setName] = useState("");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "40px 20px",
      gap: 24
    }}>
      <div style={{ fontSize: 48 }}>👋</div>
      <h1 style={{ margin: 0 }}>Almost there!</h1>
      <p style={{
        maxWidth: 440,
        textAlign: "center",
        color: "var(--text)",
        fontSize: 17,
        lineHeight: 1.65
      }}>
        Enter your name so {companyName ? `the ${companyName} team` : "the hiring team"} can identify your results in their dashboard.
      </p>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && name.trim() && onNext(name.trim())}
        placeholder="Your full name"
        autoFocus
        style={{
          width: "100%",
          maxWidth: 380,
          padding: "14px 18px",
          fontSize: 17,
          border: "2px solid var(--border)",
          borderRadius: 10,
          background: "transparent",
          color: "var(--text-h)",
          boxSizing: "border-box",
          outline: "none",
          fontFamily: "var(--sans)"
        }}
      />

      <button
        onClick={() => onNext(name.trim() || "Anonymous")}
        style={{
          padding: "14px 36px",
          fontSize: 17,
          fontWeight: 600,
          background: "var(--accent)",
          color: "white",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(170,59,255,0.35)"
        }}
      >
        See my results →
      </button>

      <button
        onClick={() => onNext("Anonymous")}
        style={{
          background: "none",
          border: "none",
          color: "var(--text)",
          fontSize: 14,
          cursor: "pointer",
          textDecoration: "underline"
        }}
      >
        Skip, stay anonymous
      </button>
    </div>
  );
}
