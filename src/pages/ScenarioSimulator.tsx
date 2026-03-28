import { useState } from "react";
import { employees, Employee } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";
import { simulateScenarios } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

const decisions = ["Promote Now", "Give 15% Raise", "Relocate to Munich", "Do Nothing"];
const timeframes = ["3 months", "6 months", "12 months"];

interface Scenario { title: string; probability: number; cost: string; risk: "Low" | "Medium" | "High" | "Critical"; description: string; }

export default function ScenarioSimulator() {
  const [selectedEmp, setSelectedEmp] = useState<number | "">("");
  const [decision, setDecision] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const simulate = async () => {
    if (!selectedEmp || !decision || !timeframe) return;
    const emp = employees.find((e) => e.id === selectedEmp)!;
    setLoading(true);
    setError("");
    setScenarios(null);
    setAdvice("");
    try {
      const prompt = `Employee: ${emp.name}, Role: ${emp.role}, Dept: ${emp.dept}, Tenure: ${emp.tenure}yr, Score: ${emp.score}, Potential: ${emp.potential}, Salary: €${emp.salary}k, Risk: ${emp.risk}, Trend: ${emp.trend}${emp.flag ? `, Flag: ${emp.flag}` : ""}. Decision: ${decision}. Timeframe: ${timeframe}.`;
      const result = await simulateScenarios(prompt);
      const mapped: Scenario[] = [
        { ...result.scenarioA, risk: result.scenarioA.risk as Scenario["risk"] },
        { ...result.scenarioB, risk: result.scenarioB.risk as Scenario["risk"] },
        { ...result.scenarioC, risk: result.scenarioC.risk as Scenario["risk"] },
      ];
      setScenarios(mapped);
      setAdvice(`Based on ${emp.name}'s profile (potential: ${emp.potential}, risk: ${emp.risk}, trend: ${emp.trend}), the AI has modeled three outcomes for "${decision}" over ${timeframe}. Review each scenario's probability and cost impact before deciding.${emp.flag ? ` Key concern: ${emp.flag}.` : ""}`);
    } catch (e) {
      setError("Failed to generate scenarios. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Scenario Simulator ⭐</h1>
        <p className="text-muted-foreground text-sm mt-1">Model workforce decisions before committing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-lg">Configure Simulation</h2>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Select Employee</label>
            <select value={selectedEmp} onChange={(e) => setSelectedEmp(Number(e.target.value))} className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none">
              <option value="">Choose an employee...</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.role}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Select Decision</label>
            <select value={decision} onChange={(e) => setDecision(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none">
              <option value="">Choose a decision...</option>
              {decisions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none">
              <option value="">Select timeframe...</option>
              {timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={simulate} disabled={!selectedEmp || !decision || !timeframe || loading} className="w-full py-3 rounded-lg text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : "Simulate →"}
          </button>
        </div>

        <div className="space-y-5">
          {error && <p className="text-risk-high text-sm bg-risk-high/5 border border-risk-high/15 rounded-lg px-4 py-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ))
              : scenarios
              ? scenarios.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 card-glow transition-all">
                    <p className="text-xs text-muted-foreground mb-1">Scenario {String.fromCharCode(65 + i)}</p>
                    <h3 className="font-semibold text-sm mb-3">{s.title}</h3>
                    <p className="text-3xl font-bold text-primary mb-1">{s.probability}%</p>
                    <p className="text-xs text-muted-foreground mb-2">probability</p>
                    <p className="text-sm font-medium text-accent mb-2">{s.cost}</p>
                    <RiskBadge risk={s.risk} />
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.description}</p>
                  </div>
                ))
              : [0, 1, 2].map((i) => (
                  <div key={i} className="bg-card border border-dashed border-border rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                    <p className="text-xs text-muted-foreground text-center">Run a simulation to see Scenario {String.fromCharCode(65 + i)}</p>
                  </div>
                ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-2">🤖 AI Advisor says:</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{advice || "Configure and run a simulation above to receive AI-powered recommendations."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
