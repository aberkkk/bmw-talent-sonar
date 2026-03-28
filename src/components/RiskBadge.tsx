import { cn } from "@/lib/utils";

const riskStyles = {
  Low: { classes: "bg-risk-low/10 text-risk-low border-risk-low/25", glow: "glow-green" },
  Medium: { classes: "bg-risk-medium/10 text-risk-medium border-risk-medium/25", glow: "glow-amber" },
  High: { classes: "bg-risk-high/10 text-risk-high border-risk-high/25", glow: "glow-red" },
  Critical: { classes: "bg-risk-critical/10 text-risk-critical border-risk-critical/25", glow: "glow-pink" },
};

export default function RiskBadge({ risk }: { risk: "Low" | "Medium" | "High" | "Critical" }) {
  const s = riskStyles[risk];
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold border", s.classes, s.glow)}>
      {risk}
    </span>
  );
}
