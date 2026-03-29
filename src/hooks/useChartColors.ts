import { useTheme } from "@/context/ThemeContext";

export function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return {
    grid: isDark ? "#2a3558" : "#E2E8F0",
    tick: isDark ? "#8899bb" : "#64748B",
    tooltipBg: isDark ? "#1e2d4f" : "#ffffff",
    tooltipBorder: isDark ? "#2e3f6f" : "#E2E8F0",
    tooltipText: isDark ? "#d4dced" : "#0F172A",
    referenceLine: isDark ? "#8899bb" : "#64748B",
  };
}
