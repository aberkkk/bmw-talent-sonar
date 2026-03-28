import { employees } from "@/data/employees";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const benchmarkMultipliers: Record<number, number> = { 1: 1.12, 2: 1.10, 3: 1.22, 4: 1.08, 5: 1.18, 6: 1.11 };

const data = employees.map((e) => {
  const benchmark = Math.round(e.salary * benchmarkMultipliers[e.id]);
  const gap = Math.round(((benchmark - e.salary) / e.salary) * 100);
  return { name: e.name.split(" ")[0], fullName: e.name, current: e.salary, benchmark, gap, isHigh: gap > 15 };
});

export default function CompensationPulse() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Compensation Pulse</h1>
        <p className="text-muted-foreground text-sm mt-1">Salary benchmarking & market alignment</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 33% 18%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(240 15% 60%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(240 15% 60%)", fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
            <Tooltip contentStyle={{ background: "#111128", border: "1px solid #1E1E3F", borderRadius: 8, color: "#fff" }} formatter={(value: number) => [`€${value}k`]} />
            <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill="#6C63FF" />)}
            </Bar>
            <Bar dataKey="benchmark" name="Benchmark" radius={[4, 4, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.isHigh ? "#FF4757" : "#8888AA"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">Employee</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Current</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Benchmark</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Gap%</th>
              <th className="text-right p-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.fullName} className="border-b border-border last:border-0 hover:bg-secondary/50">
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
    </div>
  );
}
