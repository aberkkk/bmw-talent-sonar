import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { Employee } from "@/data/employees";
import { scenarioChat } from "@/lib/gemini";
import RiskBadge from "@/components/RiskBadge";
import { Loader2, ChevronDown } from "lucide-react";

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

function ComparePanel({
  label,
  employees,
  result,
  loading,
  onSimulate,
}: {
  label: string;
  employees: Employee[];
  result: PanelResult | null;
  loading: boolean;
  onSimulate: (emp: Employee, decision: string) => void;
}) {
  const [selectedEmpId, setSelectedEmpId] = useState<number | "">(employees[0]?.id ?? "");
  const [selectedDecision, setSelectedDecision] = useState(decisions[0]);

  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none";

  return (
    <div className="flex-1 bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-7 h-7 rounded-lg bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">{label}</span>
        <h4 className="text-sm font-semibold text-foreground">Employee {label}</h4>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Select Employee</label>
          <div className="relative">
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(Number(e.target.value))}
              className={inputCls + " appearance-none pr-8"}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} — {emp.role}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Decision</label>
          <div className="relative">
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className={inputCls + " appearance-none pr-8"}
            >
              {decisions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          const emp = employees.find(e => e.id === selectedEmpId);
          if (emp) onSimulate(emp, `${selectedDecision} for ${emp.name}`);
        }}
        disabled={loading || !selectedEmpId}
        className="w-full py-2.5 rounded-lg text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : "Simulate"}
      </button>

      {result && result.scenarios.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Best scenario:</p>
          <div className="bg-muted/30 border border-border rounded-lg p-3">
            <p className="text-sm font-semibold text-foreground mb-1">{result.scenarios[0].title}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-primary">{result.scenarios[0].probability}%</span>
              <RiskBadge risk={result.scenarios[0].risk} />
            </div>
            <p className="text-xs text-muted-foreground">{result.scenarios[0].cost}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function ComparisonMode({ onClose }: Props) {
  const { employees } = useEmployees();
  const [resultA, setResultA] = useState<PanelResult | null>(null);
  const [resultB, setResultB] = useState<PanelResult | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const simulateA = async (emp: Employee, decision: string) => {
    setLoadingA(true);
    try {
      const result = await scenarioChat(decision, employees);
      setResultA({ employee: emp, decision, scenarios: result.scenarios as ScenarioResult[], analysis: result.analysis });
    } catch {
      setResultA(null);
    } finally {
      setLoadingA(false);
    }
  };

  const simulateB = async (emp: Employee, decision: string) => {
    setLoadingB(true);
    try {
      const result = await scenarioChat(decision, employees);
      setResultB({ employee: emp, decision, scenarios: result.scenarios as ScenarioResult[], analysis: result.analysis });
    } catch {
      setResultB(null);
    } finally {
      setLoadingB(false);
    }
  };

  const bothReady = resultA && resultB && resultA.scenarios.length > 0 && resultB.scenarios.length > 0;

  const rows = bothReady ? [
    {
      label: "Probability",
      a: `${resultA!.scenarios[0].probability}%`,
      b: `${resultB!.scenarios[0].probability}%`,
      aBetter: resultA!.scenarios[0].probability >= resultB!.scenarios[0].probability,
    },
    {
      label: "Cost",
      a: resultA!.scenarios[0].cost,
      b: resultB!.scenarios[0].cost,
      aBetter: parseCostNum(resultA!.scenarios[0].cost) <= parseCostNum(resultB!.scenarios[0].cost),
    },
    {
      label: "Risk",
      a: resultA!.scenarios[0].risk,
      b: resultB!.scenarios[0].risk,
      aBetter: ["Low", "Medium", "High", "Critical"].indexOf(resultA!.scenarios[0].risk) <= ["Low", "Medium", "High", "Critical"].indexOf(resultB!.scenarios[0].risk),
    },
    {
      label: "Description",
      a: resultA!.scenarios[0].description,
      b: resultB!.scenarios[0].description,
      aBetter: false, // No better/worse for description
    },
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex gap-4">
        <ComparePanel label="A" employees={employees} result={resultA} loading={loadingA} onSimulate={simulateA} />
        <ComparePanel label="B" employees={employees} result={resultB} loading={loadingB} onSimulate={simulateB} />
      </div>

      {bothReady && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Side-by-Side Decision Comparison</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Comparing best scenario for each employee</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium w-[120px]">Metric</th>
                <th className="text-center p-3 text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">A</span>
                    {resultA!.employee.name}
                  </span>
                </th>
                <th className="text-center p-3 text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">B</span>
                    {resultB!.employee.name}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-muted-foreground">{row.label}</td>
                  <td className={`p-3 text-center ${row.label !== "Description" && row.aBetter ? "text-risk-low font-semibold" : "text-foreground"}`}>
                    {row.label === "Risk" ? <span className="inline-block"><RiskBadge risk={row.a as any} /></span> : row.a}
                  </td>
                  <td className={`p-3 text-center ${row.label !== "Description" && !row.aBetter ? "text-risk-low font-semibold" : "text-foreground"}`}>
                    {row.label === "Risk" ? <span className="inline-block"><RiskBadge risk={row.b as any} /></span> : row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
