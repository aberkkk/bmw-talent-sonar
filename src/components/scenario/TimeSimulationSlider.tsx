import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Employee } from "@/data/employees";

function riskToNum(risk: Employee["risk"]): number {
  return risk === "Low" ? 1 : risk === "Medium" ? 2 : risk === "High" ? 3 : 4;
}

function numToRisk(n: number): string {
  if (n < 1.5) return "Low";
  if (n < 2.5) return "Medium";
  if (n < 3.5) return "High";
  return "Critical";
}

function numToColor(n: number): string {
  if (n < 2) return "#22C55E";
  if (n <= 3) return "#F59E0B";
  return "#EF4444";
}

function getEscalationRate(emp: Employee): number {
  // Since trend was removed, base escalation on lastPromo and tenure
  if (emp.lastPromo > 24) return 0.3;
  if (emp.lastPromo > 18) return 0.2;
  if (emp.lastPromo > 12) return 0.15;
  if (emp.tenure <= 2) return 0.15;
  return 0.1;
}

function getRecommendation(riskLabel: string): string {
  switch (riskLabel) {
    case "Critical": return "Immediate 1:1 + compensation review + retention package required";
    case "High": return "Schedule retention meeting within 5 business days";
    case "Medium": return "Review career development plan within 30 days";
    default: return "Maintain current engagement with regular check-ins";
  }
}

interface Props {
  employee: Employee;
}

export default function TimeSimulationSlider({ employee }: Props) {
  const [months, setMonths] = useState(3);

  const escalationRate = getEscalationRate(employee);
  const startRisk = riskToNum(employee.risk);

  const chartData = useMemo(() => {
    return Array.from({ length: 13 }, (_, m) => {
      const risk = Math.min(4, startRisk + escalationRate * m);
      return { month: m, risk: parseFloat(risk.toFixed(2)), label: numToRisk(risk) };
    });
  }, [startRisk, escalationRate]);

  const currentProjection = chartData[months];
  const riskLabel = currentProjection?.label || "Low";

  // Build gradient segments for line coloring
  const segments = chartData.slice(0, months + 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6 card-glow">
      <h3 className="text-sm font-semibold text-foreground mb-1">Projected Risk Escalation</h3>
      <p className="text-xs text-muted-foreground mb-5">
        How {employee.name}'s risk level changes without intervention (escalation rate: +{escalationRate}/month)
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Months without action: <span className="text-primary font-bold">{months}</span></span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            riskLabel === "Critical" ? "bg-risk-high/15 text-risk-high" :
            riskLabel === "High" ? "bg-risk-high/10 text-risk-high" :
            riskLabel === "Medium" ? "bg-risk-medium/10 text-risk-medium" :
            "bg-risk-low/10 text-risk-low"
          }`}>
            {riskLabel}
          </span>
        </div>
        <Slider
          value={[months]}
          onValueChange={(v) => setMonths(v[0])}
          min={0}
          max={12}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>Now</span>
          <span>3mo</span>
          <span>6mo</span>
          <span>9mo</span>
          <span>12mo</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickFormatter={(v) => `${v}mo`}
          />
          <YAxis
            domain={[0, 4.5]}
            ticks={[1, 2, 3, 4]}
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickFormatter={(v) => {
              if (v === 1) return "Low";
              if (v === 2) return "Med";
              if (v === 3) return "High";
              if (v === 4) return "Crit";
              return "";
            }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              color: "hsl(var(--foreground))",
              fontSize: 12,
            }}
            formatter={(value: number) => [numToRisk(value), "Risk Level"]}
            labelFormatter={(v) => `Month ${v}`}
          />
          <ReferenceLine
            y={3}
            stroke="#EF4444"
            strokeDasharray="8 4"
            strokeWidth={1.5}
            label={{ value: "Critical Threshold", position: "right", fill: "#EF4444", fontSize: 10 }}
          />
          {/* Highlight current slider position */}
          <ReferenceLine
            x={months}
            stroke="hsl(var(--primary))"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="url(#riskGradient)"
            strokeWidth={3}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const isSelected = payload.month === months;
              const color = numToColor(payload.risk);
              return (
                <circle
                  key={payload.month}
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 3}
                  fill={color}
                  stroke={isSelected ? "hsl(var(--primary))" : "none"}
                  strokeWidth={isSelected ? 2 : 0}
                />
              );
            }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={`mt-4 rounded-lg p-3 border text-sm leading-relaxed ${
        riskLabel === "Critical" || riskLabel === "High"
          ? "bg-risk-high/5 border-risk-high/20 text-foreground"
          : riskLabel === "Medium"
          ? "bg-risk-medium/5 border-risk-medium/20 text-foreground"
          : "bg-risk-low/5 border-risk-low/20 text-foreground"
      }`}>
        <span className="font-semibold">At {months} months:</span>{" "}
        <span className={
          riskLabel === "Critical" || riskLabel === "High" ? "text-risk-high font-semibold" :
          riskLabel === "Medium" ? "text-risk-medium font-semibold" :
          "text-risk-low font-semibold"
        }>{riskLabel} risk</span>.{" "}
        <span className="text-muted-foreground">Recommended action: {getRecommendation(riskLabel)}</span>
      </div>
    </div>
  );
}
