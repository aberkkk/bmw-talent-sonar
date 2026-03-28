import { cn } from "@/lib/utils";

const riskColors = {
  Low: "bg-risk-low/15 text-risk-low border-risk-low/30",
  Medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
  High: "bg-risk-high/15 text-risk-high border-risk-high/30",
  Critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
};

export default function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" | "Critical" }) {
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold border", riskColors[risk])}>
      {risk}
    </span>
  );
}
