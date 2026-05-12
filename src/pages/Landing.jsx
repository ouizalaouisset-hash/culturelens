const PRIMARY_BTN = {
  padding: "14px 36px",
  fontSize: 17,
  fontWeight: 600,
  background: "var(--accent)",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(170,59,255,0.35)",
};

export default function Landing({ goNext, onManagerClick, hasTarget, companyName }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "40px 20px",
      gap: 20
    }}>
      <div style={{ fontSize: 52 }}>🔍</div>
      <h1 style={{ margin: 0 }}>CultureLens</h1>

      {hasTarget && companyName && (
        <div style={{
          padding: "8px 18px",
          background: "var(--accent-bg)",
          border: "1px solid var(--accent-border)",
          borderRadius: 99,
          fontSize: 14,
          fontWeight: 600,
          color: "var(--accent)"
        }}>
          Invited by {companyName}
        </div>
      )}

      <p style={{
        maxWidth: hasTarget ? 440 : 480,
        fontSize: hasTarget ? 18 : 19,
        lineHeight: 1.65,
        textAlign: "center",
        color: "var(--text)"
      }}>
        {hasTarget
          ? `Complete this culture assessment to see how your working style aligns with ${companyName ? `the ${companyName} team` : "this company"}.`
          : "Find out how you work best — in 30 questions about your ideal environment, pace, and working style."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8, width: "100%", maxWidth: 320 }}>
        <button onClick={goNext} style={PRIMARY_BTN}>
          {hasTarget ? "Start Assessment" : "Take the Assessment"}
        </button>
        {!hasTarget && (
          <button
            onClick={onManagerClick}
            style={{
              padding: "14px 36px",
              fontSize: 16,
              fontWeight: 500,
              background: "transparent",
              color: "var(--text-h)",
              border: "2px solid var(--border)",
              borderRadius: 10,
              cursor: "pointer"
            }}
          >
            I'm a hiring manager →
          </button>
        )}
      </div>

      <p style={{ fontSize: 14, color: "var(--text)", marginTop: 4 }}>
        Takes about 5 minutes · 30 questions · No right answers
      </p>
    </div>
  );
}
