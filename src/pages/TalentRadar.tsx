import { useState } from "react";
import { employees } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";
import { deepDiveAnalysis } from "@/lib/gemini";
import { Loader2, X } from "lucide-react";

const departments = ["All", ...Array.from(new Set(employees.map((e) => e.dept)))];

export default function TalentRadar() {
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalEmployee, setModalEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = filter === "All" ? employees : employees.filter((e) => e.dept === filter);

  const handleDeepDive = async (emp: typeof employees[0]) => {
    setModalOpen(true);
    setModalEmployee(emp.name);
    setModalContent("");
    setError("");
    setLoading(true);
    try {
      const info = `Name: ${emp.name}, Role: ${emp.role}, Department: ${emp.dept}, Skills: ${emp.skills.join(", ")}, Tenure: ${emp.tenure} years, Performance Score: ${emp.score}, Salary: €${emp.salary}k, Trend: ${emp.trend}, Last Promotion: ${emp.lastPromo} months ago, Potential Score: ${emp.potential}, Risk Level: ${emp.risk}${emp.flag ? `, Flag: ${emp.flag}` : ""}`;
      const result = await deepDiveAnalysis(info);
      setModalContent(result);
    } catch (e) {
      setError("Failed to get AI analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Talent Radar</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time workforce intelligence overview</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {departments.map((d) => (
          <button key={d} onClick={() => setFilter(d)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === d ? "btn-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((emp) => (
          <div key={emp.id} className="bg-card border border-border rounded-xl p-5 transition-all card-glow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-card-foreground">{emp.name}</h3>
                <p className="text-sm text-muted-foreground">{emp.role}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{emp.dept}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {emp.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-secondary text-muted-foreground">{s}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gold/10 text-gold border border-gold/25 glow-amber">⭐ {emp.potential.toFixed(1)}</span>
              <RiskBadge risk={emp.risk} />
            </div>
            {emp.flag && (
              <div className="bg-risk-high/5 border border-risk-high/15 rounded-lg px-3 py-2 mb-4">
                <p className="text-xs text-risk-high">⚠ {emp.flag}</p>
              </div>
            )}
            <button onClick={() => handleDeepDive(emp)} className="w-full py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Deep Dive →
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">AI Deep Dive — {modalEmployee}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
            </div>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-sm text-muted-foreground">Analyzing...</span>
              </div>
            )}
            {error && <p className="text-risk-high text-sm py-4">{error}</p>}
            {modalContent && <div className="text-sm leading-relaxed whitespace-pre-wrap text-card-foreground">{modalContent}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
