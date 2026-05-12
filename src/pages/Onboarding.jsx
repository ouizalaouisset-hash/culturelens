function Onboarding({ goNext }) {
  const steps = [
    { icon: "📋", label: "30 questions", desc: "Sliders, multiple choice, and ranking — across 5 themed sections." },
    { icon: "📊", label: "Instant profile", desc: "See your scores across 8 behavioral dimensions." },
    { icon: "🎯", label: "No right answers", desc: "This is about fit, not performance." }
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      padding: "40px 20px",
      gap: 28
    }}>
      <h1 style={{ margin: 0 }}>How it works</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 460, width: "100%" }}>
        {steps.map(item => (
          <div key={item.label} style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            padding: "16px 20px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: 12,
            textAlign: "left"
          }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-h)", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 15, color: "var(--text)" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goNext}
        style={{
          marginTop: 8,
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
        I'm ready →
      </button>
    </div>
  );
}

export default Onboarding;
