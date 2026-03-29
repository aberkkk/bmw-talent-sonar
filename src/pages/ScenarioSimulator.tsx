import { useState, useRef, useEffect } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { useLanguage } from "@/context/LanguageContext";
import RiskBadge from "@/components/RiskBadge";
import { scenarioChat } from "@/lib/gemini";
import { Loader2, Send, Info, MessageCircle, CheckCircle2, GitCompareArrows, Download } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import CostRiskMatrix from "@/components/scenario/CostRiskMatrix";
import TimeSimulationSlider from "@/components/scenario/TimeSimulationSlider";
import ComparisonMode from "@/components/scenario/ComparisonMode";
import jsPDF from "jspdf";

interface ScenarioChanges {
  employeeId: number;
  employeeName: string;
  salaryChange?: number;
  newRole?: string;
  resetPromo?: boolean;
}

interface Scenario {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
  changes?: ScenarioChanges;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  scenarios?: Scenario[] | null;
  appliedIndex?: number;
  mentionedEmployeeId?: number;
}

export default function ScenarioSimulator() {
  const { employees, updateEmployee } = useEmployees();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (employees.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("scenario.title")} ⭐</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("scenario.subtitle")}</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const quickPrompts = [
    `What if we promote ${employees[0]?.name}?`,
    `Give ${employees[Math.min(1, employees.length - 1)]?.name} a 25% raise — what happens?`,
    `What if ${employees[Math.min(2, employees.length - 1)]?.name} leaves?`,
    "What if we do nothing about high-risk employees?",
  ];

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const result = await scenarioChat(text, employees);
      // Find the mentioned employee for the time slider
      const lower = text.toLowerCase();
      const mentionedEmp = employees.find(e =>
        lower.includes(e.name.toLowerCase()) || lower.includes(e.name.split(" ")[0].toLowerCase())
      );
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.analysis,
        scenarios: result.scenarios as Scenario[],
        mentionedEmployeeId: mentionedEmp?.id,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that scenario." }]);
    } finally {
      setLoading(false);
    }
  };

  const applyScenario = (msgIndex: number, scenarioIndex: number, scenario: Scenario) => {
    if (!scenario.changes) return;
    const { employeeId, salaryChange, newRole, resetPromo } = scenario.changes;
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const changes: Partial<typeof emp> = {};
    if (salaryChange) changes.salary = Math.round(emp.salary + salaryChange);
    if (newRole) changes.role = newRole;
    if (resetPromo) changes.lastPromo = 0;

    updateEmployee(employeeId, changes);

    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, appliedIndex: scenarioIndex } : m));

    toast({
      title: "Scenario Applied ✅",
      description: `${scenario.title} applied to ${scenario.changes.employeeName}. All modules updated.`,
    });
  };

  // Find the latest message with scenarios for the charts
  const latestWithScenarios = [...messages].reverse().find(m => m.scenarios && m.scenarios.length > 0);
  const latestEmployee = latestWithScenarios?.mentionedEmployeeId
    ? employees.find(e => e.id === latestWithScenarios.mentionedEmployeeId)
    : null;

  const exportPdf = () => {
    if (!latestWithScenarios?.scenarios || !latestEmployee) {
      toast({ title: "No data to export", description: "Run a simulation for a specific employee first." });
      return;
    }
    const emp = latestEmployee;
    const scenarios = latestWithScenarios.scenarios;
    const appliedIdx = latestWithScenarios.appliedIndex;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = 210;
    let y = 20;

    // Header
    doc.setFillColor(10, 15, 30);
    doc.rect(0, 0, w, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BMW Scenario Simulator", 15, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Report generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 15, 24);
    doc.text("Confidential — BMW Talent Oracle", 15, 30);
    y = 48;

    // Employee Profile
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Employee Profile", 15, y); y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const profileLines = [
      `Name: ${emp.name}`,
      `Role: ${emp.role} · ${emp.dept}`,
      `Grade: ${emp.jobGrade} · Tenure: ${emp.tenure} years`,
      `Salary: €${emp.salary}k · Risk: ${emp.risk}`,
    ];
    profileLines.forEach(line => { doc.text(line, 15, y); y += 6; });
    y += 6;

    // Scenarios
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Scenario Analysis", 15, y); y += 8;

    scenarios.forEach((s, i) => {
      const isApplied = appliedIdx === i;
      const label = `Scenario ${String.fromCharCode(65 + i)}: ${s.title}`;

      if (isApplied) {
        doc.setFillColor(220, 252, 231);
        doc.rect(14, y - 5, w - 28, 32, "F");
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(isApplied ? `✓ ${label} — DECISION MADE` : label, 15, y); y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Probability: ${s.probability}% · Cost: ${s.cost} · Risk: ${s.risk}`, 15, y); y += 5;
      const descLines = doc.splitTextToSize(s.description, w - 30);
      doc.text(descLines, 15, y); y += descLines.length * 4.5 + 2;
      const reasonLines = doc.splitTextToSize(`Reasoning: ${s.reasoning}`, w - 30);
      doc.setTextColor(100, 100, 100);
      doc.text(reasonLines, 15, y); y += reasonLines.length * 4.5 + 8;
      doc.setTextColor(30, 30, 30);

      if (y > 260) { doc.addPage(); y = 20; }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("BMW Scenario Simulator · Generated by BMW Talent Oracle", 15, 285);

    doc.save(`scenario-report-${emp.name.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    toast({ title: "Report exported ✅", description: `PDF report for ${emp.name} downloaded.` });
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("scenario.title")} ⭐</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("scenario.subtitle")}</p>
          </div>
          <div className="relative group">
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
              <Info className="w-4 h-4" />
            </button>
            <div className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-xl p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{t("scenario.howItWorks")}</span> {t("scenario.howItWorksDesc")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {latestWithScenarios && latestEmployee && (
            <button
              onClick={exportPdf}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border bg-secondary text-secondary-foreground border-border hover:border-primary/40"
            >
              <Download className="w-4 h-4" />
              {t("scenario.exportPdf")}
            </button>
          )}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${
              compareMode
                ? "btn-gradient text-primary-foreground border-transparent"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
            }`}
          >
            <GitCompareArrows className="w-4 h-4" />
            {compareMode ? t("scenario.exitCompare") : t("scenario.compare")}
          </button>
        </div>
      </div>

      {compareMode ? (
        <div className="flex-1 overflow-auto">
          <ComparisonMode onClose={() => setCompareMode(false)} />
        </div>
      ) : (
        <>

          {messages.length === 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> {t("scenario.tryAsking")}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q) => (
                  <button key={q} onClick={() => send(q)} className="px-4 py-2.5 rounded-xl text-sm bg-card border border-border hover:border-primary/40 text-card-foreground transition-all card-glow">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto space-y-5 mb-4">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" ? "btn-gradient text-primary-foreground" : "bg-card border border-border text-card-foreground"
                  }`}>
                    {msg.content}
                  </div>
                </div>
                {msg.scenarios && msg.scenarios.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5 max-w-[90%]">
                      {msg.scenarios.map((s, j) => {
                        const isApplied = msg.appliedIndex === j;
                        const anotherApplied = msg.appliedIndex !== undefined && msg.appliedIndex !== j;
                        const probColor = s.probability >= 75 ? "text-risk-low" : s.probability >= 50 ? "text-yellow-500" : "text-risk-high";
                        return (
                          <div key={j} className={`bg-card border rounded-2xl overflow-hidden transition-all ${isApplied ? "border-primary/50 ring-2 ring-primary/20" : "border-border"} ${anotherApplied ? "opacity-40 pointer-events-none" : "card-glow"}`}>
                            {/* Header strip */}
                            <div className="bg-muted/40 border-b border-border px-5 py-3 flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">Scenario {String.fromCharCode(65 + j)}</span>
                              <RiskBadge risk={s.risk} />
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-4">
                              <h3 className="font-bold text-base leading-snug">{s.title}</h3>

                              {/* Key metrics row */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/30 rounded-xl p-3 text-center">
                                  <p className={`text-2xl font-extrabold ${probColor}`}>{s.probability}%</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{t("scenario.successRate")}</p>
                                </div>
                                <div className="bg-muted/30 rounded-xl p-3 text-center">
                                  <p className="text-2xl font-extrabold text-foreground">{s.cost}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">{t("scenario.estCost")}</p>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>

                              {/* Reasoning - collapsible feel */}
                              <details className="group">
                                <summary className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-1">
                                  <Info className="w-3 h-3" /> {t("scenario.viewReasoning")}
                                </summary>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-2 pl-4 border-l-2 border-primary/20 italic">{s.reasoning}</p>
                              </details>
                            </div>

                            {/* Action */}
                            {s.changes && (
                              <div className="px-5 pb-5">
                                <button
                                  onClick={() => applyScenario(i, j, s)}
                                  disabled={msg.appliedIndex !== undefined}
                                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                    isApplied
                                      ? "bg-risk-low/15 text-risk-low border border-risk-low/30 cursor-default"
                                      : "btn-gradient text-primary-foreground hover:opacity-90"
                                  }`}
                                >
                                  {isApplied ? <><CheckCircle2 className="w-4 h-4" /> {t("scenario.applied")}</> : t("scenario.applyScenario")}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Cost vs Risk Matrix */}
                    <div className="mt-5 max-w-[90%]">
                      <CostRiskMatrix scenarios={msg.scenarios} />
                    </div>

                    {/* Time Simulation Slider */}
                    {msg.mentionedEmployeeId && employees.find(e => e.id === msg.mentionedEmployeeId) && (
                      <div className="mt-5 max-w-[90%]">
                        <TimeSimulationSlider employee={employees.find(e => e.id === msg.mentionedEmployeeId)!} />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Simulating scenarios...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Describe a decision... e.g. 'What if we give Sofia a 30% raise?'" className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" disabled={loading} />
            <button onClick={() => send(input)} disabled={loading} className="px-5 py-3 rounded-xl btn-gradient text-primary-foreground transition-all disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
