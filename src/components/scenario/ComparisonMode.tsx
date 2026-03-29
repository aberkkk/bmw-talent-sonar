import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { Employee } from "@/data/employees";
import { scenarioChat } from "@/lib/gemini";
import RiskBadge from "@/components/RiskBadge";
import { Loader2, ChevronDown, TrendingUp, DollarSign, Shield, FileText, CheckCircle2, Plus, X, Zap, Trophy } from "lucide-react";

interface ScenarioResult {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
}

interface PanelState {
  id: string;
  empId: number;
  decision: string;
  result: { employee: Employee; scenarios: ScenarioResult[]; analysis: string } | null;
  loading: boolean;
}

const decisions = [
  "Promote them",
  "Give them a 20% raise",
  "What if they leave?",
  "Do nothing for 6 months",
];

const COLORS = [
  { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", gradient: "from-primary/5 to-primary/10" },
  { bg: "bg-accent/15", text: "text-accent", border: "border-accent/30", gradient: "from-accent/5 to-accent/10" },
  { bg: "bg-[#8B5CF6]/10", text: "text-[#8B5CF6]", border: "border-[#8B5CF6]/30", gradient: "from-[#8B5CF6]/5 to-[#8B5CF6]/10" },
  { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/30", gradient: "from-[#F59E0B]/5 to-[#F59E0B]/10" },
  { bg: "bg-[#EC4899]/10", text: "text-[#EC4899]", border: "border-[#EC4899]/30", gradient: "from-[#EC4899]/5 to-[#EC4899]/10" },
];

function parseCostNum(costStr: string): number {
  const match = costStr.match(/€([\d.,]+)/);
  if (!match) return 0;
  const num = parseFloat(match[1].replace(",", ""));
  if (costStr.toLowerCase().includes("k")) return num * 1000;
  return num;
}

const riskIndex: Record<string, number> = { Low: 0, Medium: 1, High: 2, Critical: 3 };

interface Props {
  onClose: () => void;
}

export default function ComparisonMode({ onClose }: Props) {
  const { employees } = useEmployees();

  const makePanel = (index: number): PanelState => ({
    id: crypto.randomUUID(),
    empId: employees[Math.min(index, employees.length - 1)]?.id ?? 0,
    decision: decisions[0],
    result: null,
    loading: false,
  });

  const [panels, setPanels] = useState<PanelState[]>([makePanel(0), makePanel(1)]);

  const updatePanel = (id: string, changes: Partial<PanelState>) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  };

  const addPanel = () => {
    if (panels.length >= 5) return;
    setPanels(prev => [...prev, makePanel(prev.length)]);
  };

  const removePanel = (id: string) => {
    if (panels.length <= 2) return;
    setPanels(prev => prev.filter(p => p.id !== id));
  };

  const simulate = async (panel: PanelState) => {
    const emp = employees.find(e => e.id === panel.empId);
    if (!emp) return;
    updatePanel(panel.id, { loading: true });
    try {
      const result = await scenarioChat(`${panel.decision} for ${emp.name}`, employees);
      updatePanel(panel.id, { result: { employee: emp, scenarios: result.scenarios as ScenarioResult[], analysis: result.analysis }, loading: false });
    } catch {
      updatePanel(panel.id, { result: null, loading: false });
    }
  };

  const simulateAll = () => {
    panels.forEach(p => { if (!p.loading) simulate(p); });
  };

  const readyPanels = panels.filter(p => p.result && p.result.scenarios.length > 0);
  const allReady = readyPanels.length >= 2;

  // Find best values
  const bestProb = allReady ? Math.max(...readyPanels.map(p => p.result!.scenarios[0].probability)) : 0;
  const bestCost = allReady ? Math.min(...readyPanels.map(p => parseCostNum(p.result!.scenarios[0].cost))) : 0;
  const bestRisk = allReady ? Math.min(...readyPanels.map(p => riskIndex[p.result!.scenarios[0].risk])) : 0;

  // Overall winner (simple scoring)
  const scores = readyPanels.map(p => {
    const s = p.result!.scenarios[0];
    let score = 0;
    if (s.probability === bestProb) score += 2;
    if (parseCostNum(s.cost) === bestCost) score += 1;
    if (riskIndex[s.risk] === bestRisk) score += 1;
    return { panel: p, score };
  });
  const winner = scores.length > 0 ? scores.sort((a, b) => b.score - a.score)[0] : null;

  const inputCls = "w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none pr-8";
  const colTemplate = `160px ${panels.map(() => "1fr").join(" ")}`;

  return (
    <div className="space-y-6">
      {/* Header with Simulate All */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Multi-Employee Comparison
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Compare up to 5 employees side by side</p>
        </div>
        <div className="flex gap-2">
          {panels.length < 5 && (
            <button onClick={addPanel} className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-secondary text-secondary-foreground border border-border hover:border-primary/40 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Slot
            </button>
          )}
          <button onClick={simulateAll} className="px-4 py-2 rounded-xl text-xs font-bold btn-gradient text-primary-foreground flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Simulate All
          </button>
        </div>
      </div>

      {/* Panel cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${panels.length}, 1fr)` }}>
        {panels.map((panel, idx) => {
          const color = COLORS[idx % COLORS.length];
          const emp = employees.find(e => e.id === panel.empId);
          const label = String.fromCharCode(65 + idx);
          const s = panel.result?.scenarios[0];
          const isWinner = winner && winner.panel.id === panel.id && allReady;

          return (
            <div key={panel.id} className={`relative bg-card border-2 rounded-2xl overflow-hidden transition-all ${isWinner ? "border-primary shadow-lg shadow-primary/10" : "border-border"}`}>
              {/* Winner badge */}
              {isWinner && (
                <div className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1 z-10">
                  <Trophy className="w-3 h-3" /> Best Choice
                </div>
              )}

              {/* Color header */}
              <div className={`bg-gradient-to-b ${color.gradient} p-4 pb-3 text-center relative`}>
                {panels.length > 2 && (
                  <button onClick={() => removePanel(panel.id)} className="absolute top-2 right-2 p-1 rounded-lg hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} font-bold text-lg flex items-center justify-center mx-auto mb-2`}>
                  {label}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="relative">
                  <select value={panel.empId} onChange={e => updatePanel(panel.id, { empId: Number(e.target.value), result: null })} className={inputCls}>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {emp && <p className="text-[11px] text-muted-foreground text-center">{emp.role} · {emp.jobGrade}</p>}
                <div className="relative">
                  <select value={panel.decision} onChange={e => updatePanel(panel.id, { decision: e.target.value, result: null })} className={inputCls}>
                    {decisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <button onClick={() => simulate(panel)} disabled={panel.loading} className="w-full py-2 rounded-xl text-xs font-bold btn-gradient text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-1.5">
                  {panel.loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...</> : `Simulate ${label}`}
                </button>

                {/* Result preview */}
                {s && (
                  <div className={`rounded-xl border ${color.border} p-3 space-y-2 animate-fade-in`}>
                    <p className="text-xs font-semibold text-muted-foreground">{s.title}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-extrabold ${s.probability >= 70 ? "text-risk-low" : s.probability >= 50 ? "text-yellow-500" : "text-risk-high"}`}>{s.probability}%</span>
                      <span className="text-[10px] text-muted-foreground">success</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{s.cost}</span>
                      <RiskBadge risk={s.risk} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      {allReady && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Head-to-Head Results
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Best values highlighted — comparing {readyPanels.length} scenarios</p>
          </div>

          {/* Header */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: colTemplate }}>
            <div className="p-4" />
            {readyPanels.map((p, idx) => {
              const color = COLORS[panels.indexOf(p) % COLORS.length];
              const label = String.fromCharCode(65 + panels.indexOf(p));
              return (
                <div key={p.id} className="p-4 text-center border-l border-border">
                  <div className={`w-7 h-7 rounded-lg ${color.bg} ${color.text} font-bold text-sm flex items-center justify-center mx-auto mb-1`}>{label}</div>
                  <p className="font-semibold text-sm text-foreground">{p.result!.employee.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.result!.scenarios[0].title}</p>
                </div>
              );
            })}
          </div>

          {/* Success Rate */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: colTemplate }}>
            <div className="p-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
            </div>
            {readyPanels.map(p => {
              const prob = p.result!.scenarios[0].probability;
              const isBest = prob === bestProb;
              return (
                <div key={p.id} className={`p-4 text-center border-l border-border flex flex-col items-center justify-center ${isBest ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-2xl font-extrabold ${isBest ? "text-risk-low" : "text-foreground"}`}>{prob}%</span>
                  {isBest && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
              );
            })}
          </div>

          {/* Cost */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: colTemplate }}>
            <div className="p-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Estimated Cost</span>
            </div>
            {readyPanels.map(p => {
              const cost = parseCostNum(p.result!.scenarios[0].cost);
              const isBest = cost === bestCost;
              return (
                <div key={p.id} className={`p-4 text-center border-l border-border flex flex-col items-center justify-center ${isBest ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-lg font-bold ${isBest ? "text-risk-low" : "text-foreground"}`}>{p.result!.scenarios[0].cost}</span>
                  {isBest && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
              );
            })}
          </div>

          {/* Risk */}
          <div className="grid border-b border-border" style={{ gridTemplateColumns: colTemplate }}>
            <div className="p-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
            </div>
            {readyPanels.map(p => {
              const ri = riskIndex[p.result!.scenarios[0].risk];
              const isBest = ri === bestRisk;
              return (
                <div key={p.id} className={`p-4 text-center border-l border-border flex flex-col items-center justify-center gap-1 ${isBest ? "bg-risk-low/5" : ""}`}>
                  <RiskBadge risk={p.result!.scenarios[0].risk} />
                  {isBest && <CheckCircle2 className="w-4 h-4 text-risk-low" />}
                </div>
              );
            })}
          </div>

          {/* Outcome */}
          <div className="grid" style={{ gridTemplateColumns: colTemplate }}>
            <div className="p-4 flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="text-sm font-medium text-muted-foreground">Outcome</span>
            </div>
            {readyPanels.map(p => (
              <div key={p.id} className="p-4 border-l border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">{p.result!.scenarios[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
