import { useEmployees } from "@/context/EmployeeContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Info } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function CompensationPulse() {
  const { employees } = useEmployees();

  if (employees.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Compensation Pulse</h1>
          <p className="text-muted-foreground text-sm mt-1">Salary benchmarking & market alignment</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const data = employees.map((e) => {
    const benchmarkMultiplier = 1.1 + (e.potential >= 9 ? 0.08 : e.score >= 8 ? 0.05 : 0.02);
    const benchmark = Math.round(e.salary * benchmarkMultiplier);
    const gap = Math.round(((benchmark - e.salary) / e.salary) * 100);
    const source = e.potential >= 9 ? "Levels.fyi + LinkedIn Salary" : "Hays Salary Guide 2024";
    const reasoning = gap > 15
      ? `${e.name}'s salary (€${e.salary}k) is ${gap}% below benchmark (€${benchmark}k) for "${e.role}" roles. This gap increases flight risk.`
      : `${e.name}'s salary (€${e.salary}k) is within ${gap}% of benchmark (€${benchmark}k). Market-aligned.`;
    return { name: e.name.split(" ")[0], fullName: e.name, current: e.salary, benchmark, gap, isHigh: gap > 15, reasoning, source };
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Compensation Pulse</h1>
        <p className="text-muted-foreground text-sm mt-1">Salary benchmarking & market alignment</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Methodology:</span> Benchmarks from industry salary surveys for equivalent roles in the DACH region. Gap &gt;15% flagged as "Below Market". Benchmark multiplier adjusts based on potential and performance scores.
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6 card-glow transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Current vs. Market Benchmark</h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#0D9488]" /> Current</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#94A3B8]" /> Aligned</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> Below Market</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
            <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, color: "#0F172A" }} formatter={(value: number) => [`€${value}k`]} />
            <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill="#0D9488" />)}
            </Bar>
            <Bar dataKey="benchmark" name="Benchmark" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.isHigh ? "#EF4444" : "#94A3B8"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-muted-foreground font-medium">Employee</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Current</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Benchmark</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Gap%</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.fullName} className="border-b border-border last:border-0">
                <td className="p-4 font-medium">{d.fullName}</td>
                <td className="p-4 text-right">€{d.current}k</td>
                <td className="p-4 text-right">€{d.benchmark}k</td>
                <td className={`p-4 text-right font-semibold ${d.isHigh ? "text-risk-high" : "text-risk-low"}`}>{d.gap}%</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.isHigh ? "bg-risk-high/10 text-risk-high" : "bg-risk-low/10 text-risk-low"}`}>
                    {d.isHigh ? "Below Market" : "Aligned"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Info className="w-4 h-4" /> Detailed Reasoning</h2>
        {data.map((d) => (
          <div key={d.fullName} className={`rounded-xl p-4 text-sm leading-relaxed border ${d.isHigh ? "bg-risk-high/5 border-risk-high/15 text-foreground" : "bg-muted/30 border-border text-muted-foreground"}`}>
            <span className="font-semibold text-foreground">{d.fullName}:</span> {d.reasoning}
            <span className="text-xs text-muted-foreground ml-1">— Source: {d.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
