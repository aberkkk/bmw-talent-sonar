import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { Employee } from "@/data/employees";
import { scenarioChat } from "@/lib/gemini";
import RiskBadge from "@/components/RiskBadge";
import { Loader2, ChevronDown, TrendingUp, DollarSign, Shield, FileText, CheckCircle2 } from "lucide-react";

interface ScenarioResult {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
}

interface PanelResult {
  employee: Employee;
  decision: string;
  scenarios: ScenarioResult[];
  analysis: string;
}

const decisions = [
  "Promote them",
  "Give them a 20% raise",
  "What if they leave?",
  "Do nothing for 6 months",
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
  const [empIdA, setEmpIdA] = useState<number>(employees[0]?.id ?? 0);
  const [empIdB, setEmpIdB] = useState<number>(employees[Math.min(1, employees.length - 1)]?.id ?? 0);
  const [decisionA, setDecisionA] = useState(decisions[0]);
  const [decisionB, setDecisionB] = useState(decisions[0]);
  const [resultA, setResultA] = useState<PanelResult | null>(null);
  const [resultB, setResultB] = useState<PanelResult | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const empA = employees.find(e => e.id === empIdA);
  const empB = employees.find(e => e.id === empIdB);

  const simulate = async (side: "A" | "B") => {
    const emp = side === "A" ? empA : empB;
    const decision = side === "A" ? decisionA : decisionB;
    const setLoading = side === "A" ? setLoadingA : setLoadingB;
    const setResult = side === "A" ? setResultA : setResultB;
    if (!emp) return;
    setLoading(true);
    try {
      const result = await scenarioChat(`${decision} for ${emp.name}`, employees);
      setResult({ employee: emp, decision, scenarios: result.scenarios as ScenarioResult[], analysis: result.analysis });
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const bothReady = resultA && resultB && resultA.scenarios.length > 0 && resultB.scenarios.length > 0;
  const sA = resultA?.scenarios[0];
  const sB = resultB?.scenarios[0];

  const inputCls = "w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none appearance-none pr-8";

  return (
    <div className="space-y-8">
      {/* Apple-style column headers */}
      <div className="grid grid-cols-[1fr_1fr] gap-6">
        {/* Panel A */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">A</div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select value={empIdA} onChange={e => setEmpIdA(Number(e.target.value))} className={inputCls}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {empA && <p className="text-xs text-muted-foreground text-center">{empA.role} · {empA.dept} · {empA.jobGrade}</p>}
            <div className="relative">
              <select value={decisionA} onChange={e => setDecisionA(e.target.value)} className={inputCls}>
                {decisions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <button onClick={() => simulate("A")} disabled={loadingA} className="w-full py-2.5 rounded-xl text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            {loadingA ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : "Simulate A"}
          </button>
        </div>

        {/* Panel B */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent font-bold text-lg flex items-center justify-center mx-auto mb-3">B</div>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <select value={empIdB} onChange={e => setEmpIdB(Number(e.target.value))} className={inputCls}>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {empB && <p className="text-xs text-muted-foreground text-center">{empB.role} · {empB.dept} · {empB.jobGrade}</p>}
            <div className="relative">
              <select value={decisionB} onChange={e => setDecisionB(e.target.value)} className={inputCls}>
                {decisions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <button onClick={() => simulate("B")} disabled={loadingB} className="w-full py-2.5 rounded-xl text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-2">
            {loadingB ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : "Simulate B"}
          </button>
        </div>
      </div>

      {/* Apple-style comparison specs */}
      {bothReady && sA && sB && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[200px_1fr_1fr] border-b border-border">
            <div className="p-5">
              <h3 className="text-base font-bold text-foreground">Compare</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Best scenario results</p>
            </div>
            <div className="p-5 text-center border-l border-border">
              <p className="font-semibold text-foreground">{resultA!.employee.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sA.title}</p>
            </div>
            <div className="p-5 text-center border-l border-border">
              <p className="font-semibold text-foreground">{resultB!.employee.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sB.title}</p>
            </div>
          </div>

          {/* Probability Row */}
          {(() => {
            const aBetter = sA.probability >= sB.probability;
            return (
              <div className="grid grid-cols-[200px_1fr_1fr] border-b border-border">
                <div className="p-5 flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center ${aBetter ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-2xl font-extrabold ${aBetter ? "text-risk-low" : "text-foreground"}`}>{sA.probability}%</span>
                  {aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center ${!aBetter ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-2xl font-extrabold ${!aBetter ? "text-risk-low" : "text-foreground"}`}>{sB.probability}%</span>
                  {!aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
              </div>
            );
          })()}

          {/* Cost Row */}
          {(() => {
            const costA = parseCostNum(sA.cost);
            const costB = parseCostNum(sB.cost);
            const aBetter = costA <= costB;
            return (
              <div className="grid grid-cols-[200px_1fr_1fr] border-b border-border">
                <div className="p-5 flex items-center gap-2.5">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Estimated Cost</span>
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center ${aBetter ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-lg font-bold ${aBetter ? "text-risk-low" : "text-foreground"}`}>{sA.cost}</span>
                  {aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center ${!aBetter ? "bg-risk-low/5" : ""}`}>
                  <span className={`text-lg font-bold ${!aBetter ? "text-risk-low" : "text-foreground"}`}>{sB.cost}</span>
                  {!aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low mt-1" />}
                </div>
              </div>
            );
          })()}

          {/* Risk Row */}
          {(() => {
            const aBetter = riskIndex[sA.risk] <= riskIndex[sB.risk];
            return (
              <div className="grid grid-cols-[200px_1fr_1fr] border-b border-border">
                <div className="p-5 flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center gap-1 ${aBetter ? "bg-risk-low/5" : ""}`}>
                  <RiskBadge risk={sA.risk} />
                  {aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low" />}
                </div>
                <div className={`p-5 text-center border-l border-border flex flex-col items-center justify-center gap-1 ${!aBetter ? "bg-risk-low/5" : ""}`}>
                  <RiskBadge risk={sB.risk} />
                  {!aBetter && <CheckCircle2 className="w-4 h-4 text-risk-low" />}
                </div>
              </div>
            );
          })()}

          {/* Description Row */}
          <div className="grid grid-cols-[200px_1fr_1fr]">
            <div className="p-5 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="text-sm font-medium text-muted-foreground">Outcome</span>
            </div>
            <div className="p-5 border-l border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">{sA.description}</p>
            </div>
            <div className="p-5 border-l border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">{sB.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
