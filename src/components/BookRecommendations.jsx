import { getPersonalizedRecommendations } from "../utils/recommendations";

function BookCard({ book, isMain }) {
  return (
    <a
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: 16,
        padding: isMain ? "18px 20px" : "14px 18px",
        background: isMain ? "var(--accent-bg)" : "var(--code-bg, rgba(255,255,255,0.03))",
        border: `1px solid ${isMain ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: 12,
        textDecoration: "none",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {/* Cover */}
      <div style={{
        width: isMain ? 56 : 44,
        height: isMain ? 76 : 60,
        borderRadius: 6,
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--accent-bg)",
        border: "1px solid var(--accent-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMain ? 24 : 20,
      }}>
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.style.display = "none"; }}
          />
        ) : "📖"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {isMain && (
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent)",
            marginBottom: 4,
          }}>
            Top pick
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: isMain ? 15 : 14, color: "var(--text-h)", marginBottom: 2 }}>
          {book.title}
        </div>
        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>
          {book.author}
        </div>
        <p style={{ fontSize: 13, color: "var(--text)", margin: "0 0 8px", lineHeight: 1.55 }}>
          {book.reason}
        </p>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>
          Get the book →
        </span>
      </div>
    </a>
  );
}

function TraitRecommendation({ rec }) {
  const headerColor = rec.isRisk ? "#ef4444" : "var(--accent)";
  const tagText = rec.isGrowth ? "Growth area" : rec.isRisk ? "Risk pattern" : "Development priority";

  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "var(--shadow)",
    }}>
      <div style={{
        padding: "18px 22px 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--accent-bg)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>{rec.icon}</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-h)" }}>{rec.label}</span>
          <span style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: headerColor,
            background: rec.isRisk ? "rgba(239,68,68,0.1)" : "var(--accent-bg)",
            border: `1px solid ${rec.isRisk ? "rgba(239,68,68,0.3)" : "var(--accent-border)"}`,
            padding: "3px 10px",
            borderRadius: 99,
          }}>
            {tagText}
          </span>
        </div>

        {!rec.isRisk && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ height: 5, background: "var(--border)", borderRadius: 99 }}>
              <div style={{
                height: "100%",
                width: `${rec.score}%`,
                background: rec.isGrowth ? "var(--accent)" : "#f59e0b",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text)", marginTop: 5 }}>
              Your score: <strong style={{ color: rec.isGrowth ? "var(--accent)" : "#f59e0b" }}>{rec.score}%</strong>
            </div>
          </div>
        )}

        <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.7 }}>
          {rec.insight}
        </p>
      </div>

      <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text)",
          opacity: 0.6,
          marginBottom: 2,
        }}>
          Recommended reading
        </div>
        {rec.books.map((book, i) => (
          <BookCard key={i} book={book} isMain={book.priority === "main"} />
        ))}
      </div>
    </div>
  );
}

export default function BookRecommendations({ pcts }) {
  const recommendations = getPersonalizedRecommendations(pcts);
  if (!recommendations || recommendations.length === 0) return null;

  const hasRealWeaknesses = recommendations.some(r => !r.isGrowth);
  const sectionTitle = hasRealWeaknesses ? "Your Growth Blueprint" : "Areas to Strengthen";
  const sectionSubtitle = hasRealWeaknesses
    ? "Based on your lowest-scoring dimensions, these are the areas with the highest developmental leverage — and the books most likely to move the needle."
    : "You score strongly across most dimensions. These are the areas with the most room to compound your existing strengths.";

  return (
    <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ marginTop: 8 }}>
        <h3 style={{
          margin: "0 0 6px",
          fontSize: 15,
          color: "var(--text)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}>
          📚 {sectionTitle}
        </h3>
        <p style={{ fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>
          {sectionSubtitle}
        </p>
      </div>

      {recommendations.map((rec) => (
        <TraitRecommendation key={rec.dim} rec={rec} />
      ))}

      <p style={{
        fontSize: 12,
        color: "var(--text)",
        textAlign: "center",
        margin: "4px 0 0",
        opacity: 0.5,
        lineHeight: 1.5,
      }}>
        Recommendations based on your behavioral profile.
        <br />Book links are Amazon affiliate links — same price for you.
      </p>
    </div>
  );
}
