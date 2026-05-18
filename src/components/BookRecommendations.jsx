import { useState } from "react";
import { getPersonalizedRecommendations } from "../utils/recommendations";

function BookCard({ book, isMain, dimension }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <a
      href={book.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: isMain ? "20px" : "16px",
        background: isMain ? "var(--accent-bg)" : "var(--code-bg, rgba(255,255,255,0.03))",
        border: `1px solid ${isMain ? "var(--accent-border)" : "var(--border)"}`,
        borderRadius: 14,
        textDecoration: "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 32px rgba(124,58,237,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Book cover — centered above title */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{
          width: isMain ? 88 : 72,
          height: isMain ? 120 : 98,
          borderRadius: 8,
          overflow: "hidden",
          background: "var(--accent-bg)",
          border: "1px solid var(--accent-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMain ? 40 : 32,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}>
          {book.image && !imgFailed ? (
            <img
              src={book.image}
              alt={book.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span>📖</span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {isMain && (
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--accent)",
            marginBottom: 6,
            textAlign: "center",
          }}>
            ✦ Top pick
          </div>
        )}

        <div style={{
          fontWeight: 700,
          fontSize: isMain ? 15 : 14,
          color: "var(--text-h)",
          marginBottom: 2,
          textAlign: "center",
        }}>
          {book.title}
        </div>

        <div style={{
          fontSize: 12,
          color: "var(--accent)",
          fontWeight: 600,
          marginBottom: 10,
          textAlign: "center",
        }}>
          {book.author}
        </div>

        {dimension && (
          <div style={{
            fontSize: 12,
            color: "var(--text)",
            fontStyle: "italic",
            marginBottom: 12,
            padding: "5px 10px",
            background: "rgba(124,58,237,0.08)",
            borderRadius: 8,
            borderLeft: "3px solid var(--accent)",
            lineHeight: 1.5,
          }}>
            Recommended to improve your{" "}
            <strong style={{ fontStyle: "normal" }}>{dimension}</strong>
          </div>
        )}

        <p style={{
          fontSize: 13,
          color: "var(--text)",
          margin: "0 0 16px",
          lineHeight: 1.6,
          flex: 1,
        }}>
          {book.reason}
        </p>

        {/* CTA */}
        <div style={{
          padding: "11px 16px",
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          color: "#fff",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
        }}>
          Improve this → Get the book
        </div>
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
          <BookCard
            key={i}
            book={book}
            isMain={book.priority === "main"}
            dimension={rec.label}
          />
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
        lineHeight: 1.6,
      }}>
        As an Amazon Associate, I earn from qualifying purchases.
      </p>
    </div>
  );
}
