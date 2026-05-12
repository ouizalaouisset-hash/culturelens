import { useState, useEffect } from "react";
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Assessment from "./pages/Assessment";
import CandidateInfo from "./pages/CandidateInfo";
import Paywall from "./pages/Paywall";
import Results from "./pages/Results";
import CompanySetup from "./pages/CompanySetup";
import Dashboard from "./pages/Dashboard";
import { DIMS, decodeScores, encodeScores, getArchetype, getMatchScore } from "./utils/scores";

export default function App() {
  const [page, setPage] = useState("loading");
  const [scores, setScores] = useState(null);         // always pcts (0–100) after v2
  const [companyId, setCompanyId] = useState(null);
  const [companyTarget, setCompanyTarget] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [dashboardKey, setDashboardKey] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    const k = params.get("k");
    const c = params.get("c");
    const s = params.get("s");
    const paid = params.get("paid");

    if (d && k) {
      setCompanyId(d);
      setDashboardKey(k);
      setPage("dashboard");
      return;
    }

    if (paid === "true") {
      const pending = localStorage.getItem("cl_pending_scores");
      if (pending) {
        const restored = JSON.parse(pending);
        localStorage.removeItem("cl_pending_scores");
        // Validate it's a new-format pcts object
        if (restored && DIMS.every(dim => dim in restored)) {
          setScores(restored);
          setPage("results");
          const next = new URLSearchParams(window.location.search);
          next.delete("paid");
          next.set("s", encodeScores(restored));
          window.history.replaceState({}, "", `?${next}`);
          return;
        }
      }
      setPage("landing");
      return;
    }

    if (c) {
      setCompanyId(c);
      getDoc(doc(db, "companies", c))
        .then(snap => {
          if (snap.exists()) {
            const data = snap.data();
            setCompanyTarget(data.target);
            setCompanyName(data.name || "");
          }
          setPage("landing");
        })
        .catch(() => setPage("landing"));
      return;
    }

    if (s) {
      const decoded = decodeScores(s);
      // Only accept new 8-dim format
      if (decoded && DIMS.every(dim => dim in decoded)) {
        setScores(decoded);
        setPage("results");
        return;
      }
    }

    setPage("landing");
  }, []);

  // Assessment returns pcts directly
  const handleResults = (pcts) => {
    setScores(pcts);
    if (companyTarget) {
      setPage("candidateInfo");
    } else {
      setPage("results");
    }
  };

  const handleCandidateInfo = async (name) => {
    if (companyId && companyTarget && scores) {
      try {
        const archetype = getArchetype(scores);
        const matchScore = getMatchScore(scores, companyTarget);
        const ref = doc(collection(db, "companies", companyId, "candidates"));
        await setDoc(ref, {
          name,
          pcts: scores,
          matchScore,
          archetype: archetype.name,
          submittedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save candidate result:", err);
      }
    }
    setPage("results");
  };

  const handleRestart = () => {
    setScores(null);
    setPage("landing");
    const params = new URLSearchParams(window.location.search);
    params.delete("s");
    const qs = params.toString();
    window.history.replaceState({}, "", qs ? `?${qs}` : window.location.pathname);
  };

  if (page === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <p style={{ color: "var(--text)" }}>Loading…</p>
      </div>
    );
  }

  if (page === "dashboard") return <Dashboard companyId={companyId} dashboardKey={dashboardKey} />;
  if (page === "company-setup") return <CompanySetup onBack={() => setPage("landing")} />;
  if (page === "onboarding") return <Onboarding goNext={() => setPage("assessment")} companyName={companyName} />;
  if (page === "assessment") return <Assessment goResults={handleResults} />;
  if (page === "candidateInfo") return <CandidateInfo onNext={handleCandidateInfo} companyName={companyName} />;
  if (page === "paywall") return <Paywall scores={scores} />;
  if (page === "results") {
    return (
      <Results
        scores={scores}
        companyTarget={companyTarget}
        companyName={companyName}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Landing
      goNext={() => setPage("onboarding")}
      onManagerClick={() => setPage("company-setup")}
      hasTarget={!!companyTarget}
      companyName={companyName}
    />
  );
}
