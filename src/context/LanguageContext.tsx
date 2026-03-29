import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Lang = "en" | "de";

const translations = {
  // Navigation
  "nav.talentRadar": { en: "Talent Radar", de: "Talent-Radar" },
  "nav.successionPlanner": { en: "Succession Planner", de: "Nachfolgeplanung" },
  "nav.scenarioSimulator": { en: "Scenario Simulator", de: "Szenario-Simulator" },
  "nav.upskillingMap": { en: "Upskilling Map", de: "Weiterbildungskarte" },
  "nav.compensationPulse": { en: "Compensation Pulse", de: "Vergütungspuls" },
  "nav.aiAdvisor": { en: "AI Advisor", de: "KI-Berater" },

  // Header
  "header.takeTour": { en: "Take a Tour", de: "Tour starten" },

  // Talent Radar
  "talent.title": { en: "Talent Radar", de: "Talent-Radar" },
  "talent.subtitle": { en: "Real-time XA-108 Technologies overview", de: "XA-108 Technologies Echtzeit-Übersicht" },
  "talent.addEmployee": { en: "Add Employee", de: "Mitarbeiter hinzufügen" },
  "talent.bulkImport": { en: "Bulk Import", de: "Massenimport" },
  "talent.bulkImportCsv": { en: "Bulk Import CSV", de: "CSV-Massenimport" },
  "talent.deepDive": { en: "Deep Dive →", de: "Tiefenanalyse →" },
  "talent.riskReasoning": { en: "Risk reasoning:", de: "Risikobegründung:" },
  "talent.howRiskCalculated": { en: "How risk is calculated:", de: "Wie das Risiko berechnet wird:" },
  "talent.howRiskDesc": { en: "Risk level is determined by: promotion recency, compensation gap vs. market benchmark, and tenure-to-poaching ratio.", de: "Das Risikoniveau wird bestimmt durch: Beförderungsaktualität, Vergütungslücke zum Markt-Benchmark und Betriebszugehörigkeit-zu-Abwerbungsrisiko-Verhältnis." },
  "talent.noEmployees": { en: "No employees added yet", de: "Noch keine Mitarbeiter hinzugefügt" },
  "talent.noEmployeesDesc": { en: "Add your first employee or bulk import from a CSV to start building your XA-108 Technologies dashboard", de: "Fügen Sie Ihren ersten Mitarbeiter hinzu oder importieren Sie per CSV, um Ihr XA-108 Technologies Dashboard aufzubauen" },
  "talent.filter.all": { en: "All", de: "Alle" },
  "talent.aiDeepDive": { en: "AI Deep Dive", de: "KI-Tiefenanalyse" },
  "talent.askMore": { en: "Ask more about", de: "Mehr erfahren über" },
  "talent.managerNotes": { en: "Manager Notes", de: "Manager-Notizen" },
  "talent.addNote": { en: "Add a note...", de: "Notiz hinzufügen..." },
  "talent.editEmployee": { en: "Edit employee", de: "Mitarbeiter bearbeiten" },
  "talent.deleteEmployee": { en: "Delete employee", de: "Mitarbeiter löschen" },

  // Scenario Simulator
  "scenario.title": { en: "Scenario Simulator", de: "Szenario-Simulator" },
  "scenario.subtitle": { en: "Describe any workforce decision — simulate & apply it live", de: "Beschreiben Sie eine Personalentscheidung — simulieren und live anwenden" },
  "scenario.howItWorks": { en: "How it works:", de: "So funktioniert's:" },
  "scenario.howItWorksDesc": { en: 'Describe any HR decision naturally. The simulator models outcomes. Click "Apply" on a scenario to update the employee\'s data across ALL modules instantly.', de: 'Beschreiben Sie eine HR-Entscheidung natürlich. Der Simulator modelliert Ergebnisse. Klicken Sie auf "Anwenden", um die Daten in ALLEN Modulen sofort zu aktualisieren.' },
  "scenario.exportPdf": { en: "Export PDF", de: "PDF exportieren" },
  "scenario.compare": { en: "Compare Two Employees", de: "Zwei Mitarbeiter vergleichen" },
  "scenario.exitCompare": { en: "Exit Compare", de: "Vergleich beenden" },
  "scenario.tryAsking": { en: "Try asking:", de: "Probieren Sie:" },
  "scenario.simulating": { en: "Simulating scenarios...", de: "Szenarien werden simuliert..." },
  "scenario.inputPlaceholder": { en: "Describe a decision... e.g. 'What if we give Sofia a 30% raise?'", de: "Beschreiben Sie eine Entscheidung... z.B. 'Was passiert, wenn wir Sofia 30% mehr Gehalt geben?'" },
  "scenario.applied": { en: "Applied", de: "Angewendet" },
  "scenario.applyScenario": { en: "Apply This Scenario", de: "Dieses Szenario anwenden" },
  "scenario.successRate": { en: "Success Rate", de: "Erfolgsrate" },
  "scenario.estCost": { en: "Est. Cost", de: "Geschätzte Kosten" },
  "scenario.viewReasoning": { en: "View Reasoning", de: "Begründung anzeigen" },
  "scenario.scenarioApplied": { en: "Scenario Applied ✅", de: "Szenario angewendet ✅" },

  // Compensation Pulse
  "comp.title": { en: "Compensation Pulse", de: "Vergütungspuls" },
  "comp.subtitle": { en: "Salary benchmarking & market alignment", de: "Gehaltsbenchmarking & Marktanpassung" },
  "comp.methodology": { en: "Methodology:", de: "Methodik:" },
  "comp.methodologyDesc": { en: 'Benchmarks from industry salary surveys for equivalent roles in the DACH region. Gap >15% flagged as "Below Market". Benchmark multiplier adjusts based on job grade.', de: 'Benchmarks aus Branchengehaltsumfragen für vergleichbare Positionen in der DACH-Region. Lücke >15% als "Unter Markt" gekennzeichnet. Benchmark-Multiplikator passt sich nach Jobstufe an.' },
  "comp.current": { en: "Current", de: "Aktuell" },
  "comp.benchmark": { en: "Benchmark", de: "Benchmark" },
  "comp.aligned": { en: "Aligned", de: "Marktgerecht" },
  "comp.belowMarket": { en: "Below Market", de: "Unter Markt" },
  "comp.employee": { en: "Employee", de: "Mitarbeiter" },
  "comp.status": { en: "Status", de: "Status" },
  "comp.detailedReasoning": { en: "Detailed Reasoning", de: "Detaillierte Begründung" },
  "comp.barVsBenchmark": { en: "Current vs. Market Benchmark", de: "Aktuell vs. Markt-Benchmark" },
  "comp.gapByEmployee": { en: "Market Gap by Employee", de: "Marktlücke pro Mitarbeiter" },
  "comp.salaryProgression": { en: "Salary Progression Over Time", de: "Gehaltsentwicklung über Zeit" },
  "comp.peerComparison": { en: "Tenure vs. Salary (Peer Comparison)", de: "Betriebszugehörigkeit vs. Gehalt (Peer-Vergleich)" },

  // Upskilling Map
  "upskill.title": { en: "Upskilling Map", de: "Weiterbildungskarte" },
  "upskill.subtitle": { en: "Individual career progression paths & skill gaps", de: "Individuelle Karrierepfade & Kompetenzlücken" },
  "upskill.methodology": { en: "Methodology:", de: "Methodik:" },
  "upskill.methodologyDesc": { en: "Career paths based on competency frameworks. Skill gaps (red) are competencies required for the next role not in the employee's current profile.", de: "Karrierepfade basierend auf Kompetenzrahmen. Kompetenzlücken (rot) sind für die nächste Rolle erforderliche Fähigkeiten, die im aktuellen Profil fehlen." },
  "upskill.nextStep": { en: "Next Step Reasoning", de: "Nächster Schritt – Begründung" },
  "upskill.longTerm": { en: "Long-Term Path Reasoning", de: "Langfristiger Pfad – Begründung" },

  // Succession Planner
  "succession.title": { en: "Succession Planner", de: "Nachfolgeplanung" },
  "succession.subtitle": { en: "Key leadership pipeline & readiness assessment", de: "Führungspipeline & Bereitschaftsbewertung" },
  "succession.methodology": { en: "Methodology:", de: "Methodik:" },
  "succession.methodologyDesc": { en: 'Candidates ranked by tenure and promotion recency. Thresholds: "Ready Now" (5+ yr tenure, recent promo), "Ready in 1yr" (3+ yr tenure), "Needs Development" (<3yr).', de: 'Kandidaten nach Betriebszugehörigkeit und Beförderungsaktualität eingestuft. Schwellen: "Jetzt bereit" (5+ Jahre), "Bereit in 1 Jahr" (3+ Jahre), "Entwicklung nötig" (<3 Jahre).' },
  "succession.keyPosition": { en: "Key Position", de: "Schlüsselposition" },
  "succession.successor": { en: "Successor", de: "Nachfolger" },
  "succession.readyNow": { en: "Ready Now", de: "Jetzt bereit" },
  "succession.readyIn1yr": { en: "Ready in 1yr", de: "Bereit in 1 Jahr" },
  "succession.needsDev": { en: "Needs Development", de: "Entwicklung nötig" },
  "succession.lastPromo": { en: "Last promo:", de: "Letzte Beförderung:" },

  // AI Advisor
  "advisor.title": { en: "AI Advisor", de: "KI-Berater" },
  "advisor.subtitle": { en: "Ask questions about your workforce data — powered by AI", de: "Stellen Sie Fragen zu Ihren Personaldaten — KI-gestützt" },
  "advisor.placeholder": { en: "Ask about your workforce...", de: "Fragen Sie über Ihre Belegschaft..." },
  "advisor.thinking": { en: "Thinking...", de: "Denkt nach..." },

  // Empty State
  "empty.noEmployees": { en: "No employees added yet", de: "Noch keine Mitarbeiter hinzugefügt" },
  "empty.addInTalentRadar": { en: "Add employees in Talent Radar to get started", de: "Fügen Sie Mitarbeiter im Talent-Radar hinzu, um zu beginnen" },
  "empty.goToTalentRadar": { en: "Go to Talent Radar →", de: "Zum Talent-Radar →" },

  // Onboarding Tour
  "tour.talentRadar": { en: "See all employees and their risk levels", de: "Alle Mitarbeiter und ihre Risikostufen sehen" },
  "tour.scenarioSim": { en: "Simulate decisions and compare outcomes", de: "Entscheidungen simulieren und Ergebnisse vergleichen" },
  "tour.compensation": { en: "Track salary gaps vs market", de: "Gehaltslücken zum Markt verfolgen" },
  "tour.upskilling": { en: "Identify skill gaps per employee", de: "Kompetenzlücken pro Mitarbeiter identifizieren" },
  "tour.succession": { en: "See who is ready for the next role", de: "Sehen, wer für die nächste Rolle bereit ist" },
  "tour.complete": { en: "You're ready!", de: "Sie sind bereit!" },
  "tour.completeDesc": { en: "You've seen all the key modules. Start exploring!", de: "Sie haben alle wichtigen Module gesehen. Jetzt erkunden!" },
  "tour.close": { en: "Let's Go!", de: "Los geht's!" },
  "tour.next": { en: "Next", de: "Weiter" },
  "tour.prev": { en: "Previous", de: "Zurück" },
  "tour.skip": { en: "Skip Tour", de: "Tour überspringen" },

  // Common
  "common.save": { en: "Save", de: "Speichern" },
  "common.cancel": { en: "Cancel", de: "Abbrechen" },
  "common.delete": { en: "Delete", de: "Löschen" },
  "common.edit": { en: "Edit", de: "Bearbeiten" },
  "common.close": { en: "Close", de: "Schließen" },
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("app-lang");
      return (stored === "de" || stored === "en") ? stored : "en";
    } catch { return "en"; }
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("app-lang", l);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[key]?.[lang] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
