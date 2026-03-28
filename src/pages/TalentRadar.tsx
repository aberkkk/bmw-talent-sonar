import { useState } from "react";
import { employees } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";

const departments = ["All", ...Array.from(new Set(employees.map((e) => e.dept)))];

export default function TalentRadar() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? employees : employees.filter((e) => e.dept === filter);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Talent Radar</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time workforce intelligence overview</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === d
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-card-foreground">{emp.name}</h3>
                <p className="text-sm text-muted-foreground">{emp.role}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {emp.dept}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {emp.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-secondary text-secondary-foreground">{s}</span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gold/15 text-gold border border-gold/30">
                ⭐ {emp.potential.toFixed(1)}
              </span>
              <RiskBadge risk={emp.risk} />
            </div>

            {emp.flag && (
              <div className="bg-risk-high/8 border border-risk-high/20 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-risk-high">⚠ {emp.flag}</p>
              </div>
            )}

            <button className="w-full py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              Deep Dive →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
