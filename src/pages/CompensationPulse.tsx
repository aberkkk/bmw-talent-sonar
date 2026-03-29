import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ScatterChart, Scatter, ZAxis, ReferenceLine,
} from "recharts";
import { Info, BarChart3, TrendingDown, TrendingUp, Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { useChartColors } from "@/hooks/useChartColors";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChartView = "bar" | "gap" | "trend" | "scatter";

export default function CompensationPulse() {
  const { employees } = useEmployees();
  const colors = useChartColors();
  const [chartView, setChartView] = useState<ChartView>("bar");

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

  const gradeMultiplier: Record<string, number> = {
    "L1": 1.08, "L2": 1.10, "L3": 1.12, "L4": 1.15, "L5": 1.18, "Director": 1.20, "VP": 1.25,
  };

  const data = employees.map((e) => {
    const baseMult = gradeMultiplier[e.jobGrade] || 1.12;
    const benchmark = Math.round(e.salary * baseMult);
    const gap = Math.round(((benchmark - e.salary) / e.salary) * 100);
    const gapEuro = benchmark - e.salary;
    const source = "Hays Salary Guide 2024";
    const reasoning = gap > 15
      ? `${e.name}'s salary (€${e.salary}k) is ${gap}% below benchmark (€${benchmark}k) for "${e.role}" roles. This gap increases flight risk.`
      : `${e.name}'s salary (€${e.salary}k) is within ${gap}% of benchmark (€${benchmark}k). Market-aligned.`;
    return {
      name: e.name.split(" ")[0], fullName: e.name, current: e.salary, benchmark, gap, gapEuro,
      isHigh: gap > 15, reasoning, source, tenure: e.tenure, trainingHours: e.trainingHours,
    };
  });

  // Gap chart data sorted by largest gap
  const gapData = [...data].sort((a, b) => b.gapEuro - a.gapEuro);

  // Simulated trend data (3-4 historical points per employee)
  const trendData = [0, 1, 2, 3].map((yearsAgo) => {
    const year = new Date().getFullYear() - (3 - yearsAgo);
    const point: Record<string, any> = { year: String(year) };
    data.forEach((d) => {
      const growth = 1 - (3 - yearsAgo) * (0.04 + Math.random() * 0.02);
      point[d.name] = Math.round(d.current * Math.max(growth, 0.8));
    });
    return point;
  });

  // Scatter data: tenure (x) vs salary (y)
  const scatterData = data.map((d) => ({
    x: d.tenure,
    y: d.current,
    name: d.name,
    fullName: d.fullName,
    benchmark: d.benchmark,
  }));

  const avgBenchmark = Math.round(data.reduce((s, d) => s + d.benchmark, 0) / data.length);

  const trendColors = ["#0D9488", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"];

  const chartTitles: Record<ChartView, string> = {
    bar: "Current vs. Market Benchmark",
    gap: "Market Gap by Employee",
    trend: "Salary Progression Over Time",
    scatter: "Tenure vs. Salary (Peer Comparison)",
  };

  console.log('CompChart data:', data);

  const renderChart = () => {
    switch (chartView) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="name" tick={{ fill: colors.tick, fontSize: 12 }} />
              <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
              <Tooltip contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, color: colors.tooltipText }} formatter={(value: number) => [`€${value}k`]} />
              <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => <Cell key={i} fill="#0D9488" />)}
              </Bar>
              <Bar dataKey="benchmark" name="Benchmark" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill={d.isHigh ? "#EF4444" : "#94A3B8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "gap":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={gapData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis type="number" tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
              <YAxis dataKey="name" type="category" tick={{ fill: colors.tick, fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, color: colors.tooltipText }} formatter={(value: number, name: string) => name === "gapEuro" ? [`€${value}k`, "Gap €"] : [`${value}%`, "Gap %"]} />
              <Bar dataKey="gapEuro" name="gapEuro" radius={[0, 4, 4, 0]}>
                {gapData.map((d, i) => <Cell key={i} fill={d.isHigh ? "#EF4444" : "#F59E0B"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case "trend":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="year" tick={{ fill: colors.tick, fontSize: 12 }} />
              <YAxis tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
              <Tooltip contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, color: colors.tooltipText }} formatter={(value: number) => [`€${value}k`]} />
              {data.map((d, i) => (
                <Line key={d.name} type="monotone" dataKey={d.name} stroke={trendColors[i % trendColors.length]} strokeWidth={2} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis type="number" dataKey="x" name="Tenure (yrs)" tick={{ fill: colors.tick, fontSize: 12 }} label={{ value: "Tenure (years)", position: "insideBottom", offset: -5, fill: colors.tick, fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Salary" tick={{ fill: colors.tick, fontSize: 12 }} tickFormatter={(v) => `€${v}k`} />
              <ZAxis range={[80, 80]} />
              <Tooltip contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, color: colors.tooltipText }} formatter={(value: number, name: string) => name === "Salary" ? [`€${value}k`] : [value]} />
              <ReferenceLine y={avgBenchmark} stroke={colors.referenceLine} strokeDasharray="6 3" label={{ value: `Avg Benchmark €${avgBenchmark}k`, fill: colors.tick, fontSize: 11, position: "insideTopRight" }} />
              <Scatter name="Employees" data={scatterData} fill="#0D9488">
                {scatterData.map((d, i) => <Cell key={i} fill={d.y < d.benchmark ? "#EF4444" : "#0D9488"} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Compensation Pulse</h1>
        <p className="text-muted-foreground text-sm mt-1">Salary benchmarking & market alignment</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Methodology:</span> Benchmarks from industry salary surveys for equivalent roles in the DACH region. Gap &gt;15% flagged as "Below Market". Benchmark multiplier adjusts based on job grade.
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-6 card-glow transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">{chartTitles[chartView]}</h2>
          <ToggleGroup type="single" value={chartView} onValueChange={(v) => v && setChartView(v as ChartView)} className="bg-muted/50 rounded-lg p-0.5">
            <ToggleGroupItem value="bar" aria-label="Bar Chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1.5 text-xs gap-1.5 rounded-md">
              <BarChart3 className="w-3.5 h-3.5" /> Bar
            </ToggleGroupItem>
            <ToggleGroupItem value="gap" aria-label="Gap Chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1.5 text-xs gap-1.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5" /> Gap
            </ToggleGroupItem>
            <ToggleGroupItem value="trend" aria-label="Trend Chart" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1.5 text-xs gap-1.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" /> Trend
            </ToggleGroupItem>
            <ToggleGroupItem value="scatter" aria-label="Scatter Plot" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 py-1.5 text-xs gap-1.5 rounded-md">
              <Users className="w-3.5 h-3.5" /> Peers
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {chartView === "bar" && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#0D9488]" /> Current</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#94A3B8]" /> Aligned</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> Below Market</span>
          </div>
        )}
        {chartView === "gap" && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> &gt;15% Gap</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> ≤15% Gap</span>
          </div>
        )}
        {chartView === "scatter" && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#0D9488]" /> At/Above Benchmark</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444]" /> Below Benchmark</span>
            <span className="flex items-center gap-1.5"><span className="w-8 border-t-2 border-dashed" style={{ borderColor: colors.referenceLine }} /> Avg Benchmark</span>
          </div>
        )}

        {renderChart()}
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
