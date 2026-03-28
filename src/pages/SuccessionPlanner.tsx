import { employees } from "@/data/employees";

const positions = [
  { title: "VP Engineering", candidates: [1, 5, 3] },
  { title: "Head of Sales", candidates: [2, 6, 4] },
  { title: "Operations Director", candidates: [3, 6, 1] },
];

function readinessColor(potential: number) {
  if (potential > 9) return { bg: "bg-risk-low/10", border: "border-risk-low/25", text: "text-risk-low", label: "Ready Now", glow: "glow-green" };
  if (potential >= 7) return { bg: "bg-risk-medium/10", border: "border-risk-medium/25", text: "text-risk-medium", label: "Ready in 1yr", glow: "glow-amber" };
  return { bg: "bg-risk-high/10", border: "border-risk-high/25", text: "text-risk-high", label: "Needs Development", glow: "glow-red" };
}

export default function SuccessionPlanner() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Succession Planner</h1>
        <p className="text-muted-foreground text-sm mt-1">Key leadership pipeline & readiness assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {positions.map((pos) => {
          const candidates = pos.candidates
            .map((id) => employees.find((e) => e.id === id)!)
            .sort((a, b) => b.potential - a.potential);
          return (
            <div key={pos.title} className="space-y-4">
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 text-center glow-purple">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Position</p>
                <h3 className="text-lg font-bold text-primary">{pos.title}</h3>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-6 bg-border" /></div>
              <div className="space-y-3">
                {candidates.map((emp, i) => {
                  const r = readinessColor(emp.potential);
                  return (
                    <div key={emp.id} className={`${r.bg} border ${r.border} rounded-xl p-4 card-glow`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium">#{i + 1} Successor</span>
                        <span className={`text-xs font-semibold ${r.text}`}>{r.label}</span>
                      </div>
                      <h4 className="font-semibold text-card-foreground">{emp.name}</h4>
                      <p className="text-xs text-muted-foreground">{emp.role} · {emp.tenure}yr tenure</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gold font-bold">Potential: {emp.potential.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">Score: {emp.score.toFixed(1)}</span>
                      </div>
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
