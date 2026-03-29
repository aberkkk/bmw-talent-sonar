import { useEmployees } from "@/context/EmployeeContext";
import { Info } from "lucide-react";
import EmptyState from "@/components/EmptyState";

function readinessColor(tenure: number, lastPromo: number) {
  if (tenure >= 5 && lastPromo <= 12) return { bg: "bg-risk-low/10", border: "border-risk-low/25", text: "text-risk-low", label: "Ready Now" };
  if (tenure >= 3) return { bg: "bg-risk-medium/10", border: "border-risk-medium/25", text: "text-risk-medium", label: "Ready in 1yr" };
  return { bg: "bg-risk-high/10", border: "border-risk-high/25", text: "text-risk-high", label: "Needs Development" };
}

function readinessReasoning(emp: ReturnType<typeof useEmployees>["employees"][0], rank: number) {
  const r = readinessColor(emp.tenure, emp.lastPromo);
  if (r.label === "Ready Now") return `Ranked #${rank} — ${emp.tenure}yr tenure, promoted ${emp.lastPromo} months ago. Strong experience base.`;
  if (r.label === "Ready in 1yr") return `Ranked #${rank} — ${emp.tenure}yr tenure. ${emp.flag ? `Note: ${emp.flag}.` : "Building toward readiness."}`;
  return `Ranked #${rank} — ${emp.tenure}yr tenure. ${emp.flag ? `Flag: ${emp.flag}.` : "Needs more experience."}`;
}

export default function SuccessionPlanner() {
  const { employees } = useEmployees();

  if (employees.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Succession Planner</h1>
          <p className="text-muted-foreground text-sm mt-1">Key leadership pipeline & readiness assessment</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  // Dynamically build positions from departments
  const depts = [...new Set(employees.map(e => e.dept))];
  const positions = depts.slice(0, 3).map(d => {
    const deptEmps = employees.filter(e => e.dept === d);
    const title = d === "Engineering" ? "VP Engineering" : d === "Sales" ? "Head of Sales" : `${d} Director`;
    return { title, candidateIds: deptEmps.sort((a, b) => b.tenure - a.tenure).slice(0, 3).map(e => e.id) };
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Succession Planner</h1>
          <p className="text-muted-foreground text-sm mt-1">Key leadership pipeline & readiness assessment</p>
        </div>
        <div className="relative group">
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <Info className="w-4 h-4" />
          </button>
          <div className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-xl p-4 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Methodology:</span> Candidates ranked by tenure and promotion recency. Thresholds: <span className="text-risk-low font-medium">"Ready Now" (5+ yr tenure, recent promo)</span>, <span className="text-risk-medium font-medium">"Ready in 1yr" (3+ yr tenure)</span>, <span className="text-risk-high font-medium">"Needs Development" (&lt;3yr)</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {positions.map((pos) => {
          const candidates = pos.candidateIds.map(id => employees.find(e => e.id === id)!).filter(Boolean);
          return (
            <div key={pos.title} className="space-y-4">
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 text-center glow-purple">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Position</p>
                <h3 className="text-lg font-bold text-primary">{pos.title}</h3>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-6 bg-border" /></div>
              <div className="space-y-3">
                {candidates.map((emp, i) => {
                  const r = readinessColor(emp.tenure, emp.lastPromo);
                  return (
                    <div key={emp.id} className={`${r.bg} border ${r.border} rounded-xl p-4 card-glow`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium">#{i + 1} Successor</span>
                        <span className={`text-xs font-semibold ${r.text}`}>{r.label}</span>
                      </div>
                      <h4 className="font-semibold text-card-foreground">{emp.name}</h4>
                      <p className="text-xs text-muted-foreground">{emp.role} · {emp.tenure}yr tenure</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Last promo: {emp.lastPromo}mo ago</span>
                        <span className="text-xs text-muted-foreground">€{emp.salary}k</span>
                      </div>
                      <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed italic border-t border-border/50 pt-2">
                        {readinessReasoning(emp, i + 1)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
