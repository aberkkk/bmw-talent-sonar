import { useState } from "react";
import { employees, Employee } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";

const decisions = ["Promote Now", "Give 15% Raise", "Relocate to Munich", "Do Nothing"];
const timeframes = ["3 months", "6 months", "12 months"];

interface Scenario { title: string; probability: number; cost: string; risk: "Low" | "Medium" | "High" | "Critical"; desc: string; }

function generateScenarios(emp: Employee, decision: string, timeframe: string): Scenario[] {
  const tf = timeframe.replace(" months", "mo");
  if (decision === "Promote Now") return [
    { title: "Successful Transition", probability: 72, cost: "+€12,000/yr", risk: "Low", desc: `${emp.name} excels in new role within ${tf}. Team morale improves significantly.` },
    { title: "Adjustment Period", probability: 20, cost: "+€12,000/yr", risk: "Medium", desc: `${emp.name} needs mentoring but adapts. Minor productivity dip in first quarter.` },
    { title: "Role Mismatch", probability: 8, cost: "+€25,000", risk: "High", desc: `Promotion creates skill gaps. May need external hire to backfill, increasing costs.` },
  ];
  if (decision === "Give 15% Raise") return [
    { title: "Retention Secured", probability: 85, cost: `+€${Math.round(emp.salary * 0.15)}k/yr`, risk: "Low", desc: `${emp.name} stays engaged and motivated. Retention risk drops to minimal for ${tf}.` },
    { title: "Temporary Satisfaction", probability: 12, cost: `+€${Math.round(emp.salary * 0.15)}k/yr`, risk: "Medium", desc: `Raise helps short-term but underlying career growth concerns resurface within ${tf}.` },
    { title: "Equity Disruption", probability: 3, cost: `+€${Math.round(emp.salary * 0.15 + 20)}k`, risk: "High", desc: `Other team members demand parity raises. Compensation budget pressure increases.` },
  ];
  if (decision === "Relocate to Munich") return [
    { title: "Smooth Relocation", probability: 55, cost: "+€30,000", risk: "Medium", desc: `${emp.name} relocates and integrates with Munich team. Cross-site collaboration improves.` },
    { title: "Partial Remote", probability: 30, cost: "+€15,000", risk: "Low", desc: `Hybrid arrangement works. ${emp.name} splits time between locations effectively.` },
    { title: "Relocation Declined", probability: 15, cost: "€0", risk: "High", desc: `${emp.name} declines relocation. Risk of resignation increases sharply within ${tf}.` },
  ];
  return [
    { title: "Status Quo Maintained", probability: 40, cost: "€0", risk: "Medium", desc: `No change in trajectory. ${emp.name}'s current trend (${emp.trend}) continues through ${tf}.` },
    { title: "Gradual Disengagement", probability: 35, cost: "-€20,000", risk: "High", desc: `Without intervention, engagement drops. Productivity decreases and replacement risk grows.` },
    { title: "Self-Correction", probability: 25, cost: "€0", risk: "Low", desc: `${emp.name} finds internal motivation. Performance stabilizes without management action.` },
  ];
}

function generateAdvice(emp: Employee, decision: string): string {
  return `Based on ${emp.name}'s profile (potential: ${emp.potential}, risk: ${emp.risk}, trend: ${emp.trend}), "${decision}" is ${emp.potential > 8 ? "a strong move" : "worth careful consideration"}. ${emp.flag ? `Key concern: ${emp.flag}.` : ""} Recommend monitoring KPIs monthly and scheduling a 1:1 within 2 weeks.`;
}

export default function ScenarioSimulator() {
  const [selectedEmp, setSelectedEmp] = useState<number | "">("");
  const [decision, setDecision] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const [advice, setAdvice] = useState("");

  const simulate = () => {
    if (!selectedEmp || !decision || !timeframe) return;
    const emp = employees.find((e) => e.id === selectedEmp)!;
    setScenarios(generateScenarios(emp, decision, timeframe));
    setAdvice(generateAdvice(emp, decision));
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
          <button onClick={simulate} disabled={!selectedEmp || !decision || !timeframe} className="w-full py-3 rounded-lg text-sm font-bold btn-gradient text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            Simulate →
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scenarios
              ? scenarios.map((s, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 card-glow transition-all">
                    <p className="text-xs text-muted-foreground mb-1">Scenario {String.fromCharCode(65 + i)}</p>
                    <h3 className="font-semibold text-sm mb-3">{s.title}</h3>
                    <p className="text-3xl font-bold text-primary mb-1">{s.probability}%</p>
                    <p className="text-xs text-muted-foreground mb-2">probability</p>
                    <p className="text-sm font-medium text-cyan mb-2">{s.cost}</p>
                    <RiskBadge risk={s.risk} />
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
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
