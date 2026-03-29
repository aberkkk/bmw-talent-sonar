import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Label } from "recharts";
import { useChartColors } from "@/hooks/useChartColors";

interface Scenario {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
  changes?: {
    employeeId: number;
    employeeName: string;
    salaryChange?: number;
    newRole?: string;
    resetPromo?: boolean;
  };
}

function parseCost(costStr: string): number {
  const match = costStr.match(/€([\d.,]+)/);
  if (!match) return 0;
  const num = parseFloat(match[1].replace(",", ""));
  if (costStr.toLowerCase().includes("k")) return num * 1000;
  return num;
}

const riskColor: Record<string, string> = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#EF4444",
  Critical: "#DC2626",
};

interface Props {
  scenarios: Scenario[];
}

export default function CostRiskMatrix({ scenarios }: Props) {
  const colors = useChartColors();

  if (scenarios.length < 3) return null;

  const data = scenarios.map((s, i) => ({
    name: `Scenario ${String.fromCharCode(65 + i)}`,
    label: String.fromCharCode(65 + i),
    cost: parseFloat(s.cost.replace(/[^0-9.]/g, '')) || 0,
    probability: s.probability,
    risk: s.risk,
    title: s.title,
  }));

  const maxCost = Math.max(...data.map(d => d.cost), 25000);

  return (
    <div className="bg-card border border-border rounded-xl p-6 card-glow">
      <h3 className="text-sm font-semibold text-foreground mb-1">Cost vs Retention Matrix</h3>
      <p className="text-xs text-muted-foreground mb-4">Scatter plot of each scenario's cost and retention probability</p>

      <div className="relative">
        {/* Quadrant labels */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ top: 20, left: 60, right: 20, bottom: 40 }}>
          <div className="grid grid-cols-2 grid-rows-2 h-full w-full text-[10px] font-semibold opacity-40">
            <div className="flex items-start justify-start p-2 text-risk-low">✅ Best Value</div>
            <div className="flex items-start justify-end p-2 text-gold">💰 High Cost High Reward</div>
            <div className="flex items-end justify-start p-2 text-risk-high">⚠️ Risky</div>
            <div className="flex items-end justify-end p-2 text-risk-high">❌ Avoid</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              type="number"
              dataKey="cost"
              name="Cost"
              domain={[0, Math.ceil(maxCost / 5000) * 5000]}
              tick={{ fill: colors.tick, fontSize: 11 }}
              tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            >
              <Label value="Cost (€)" position="bottom" offset={0} style={{ fill: colors.tick, fontSize: 11 }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="probability"
              name="Retention %"
              domain={[0, 100]}
              tick={{ fill: colors.tick, fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            >
              <Label value="Retention %" angle={-90} position="left" offset={5} style={{ fill: colors.tick, fontSize: 11 }} />
            </YAxis>
            <ReferenceLine x={20000} stroke={colors.referenceLine} strokeDasharray="6 4" strokeOpacity={0.5} />
            <ReferenceLine y={70} stroke={colors.referenceLine} strokeDasharray="6 4" strokeOpacity={0.5} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: 8,
                color: colors.tooltipText,
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => {
                if (name === "Cost") return [`€${(value / 1000).toFixed(1)}k`, name];
                return [`${value}%`, name];
              }}
              labelFormatter={(_, payload) => {
                if (payload?.[0]?.payload) {
                  const d = payload[0].payload;
                  return `Scenario ${d.label}: ${d.title}`;
                }
                return "";
              }}
            />
            <Scatter data={data} shape="circle">
              {data.map((d, i) => (
                <Cell key={i} fill={riskColor[d.risk]} r={12} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 justify-center">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: riskColor[d.risk] }} />
            <span className="text-muted-foreground font-medium">{d.label}: {d.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
