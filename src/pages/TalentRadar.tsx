import { useState, useRef, useEffect } from "react";
import { employees } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";
import { deepDiveAnalysis, employeeChat } from "@/lib/gemini";
import { Loader2, X, Info, Send, MessageCircle } from "lucide-react";

const departments = ["All", ...Array.from(new Set(employees.map((e) => e.dept)))];

function riskReasoning(emp: typeof employees[0]) {
  const reasons: string[] = [];
  if (emp.lastPromo > 18) reasons.push(`no promotion in ${emp.lastPromo} months`);
  if (emp.trend === "declining") reasons.push("declining performance trend");
  if (emp.potential >= 9 && emp.salary < 75) reasons.push("high potential but below-market compensation");
  if (emp.tenure <= 2 && emp.potential >= 9) reasons.push("short tenure with high poaching risk");
  if (emp.flag) reasons.push(emp.flag.toLowerCase());
  if (reasons.length === 0) reasons.push("stable performance, competitive compensation, recent promotion");
  return reasons.join("; ");
}

interface ChatMsg { role: "user" | "assistant"; content: string; }

const quickQuestions = [
  "How do we retain them?",
  "Are they ready for promotion?",
  "Is their salary competitive?",
  "What should they learn next?",
];

export default function TalentRadar() {
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalEmployee, setModalEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const filtered = filter === "All" ? employees : employees.filter((e) => e.dept === filter);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDeepDive = async (emp: typeof employees[0]) => {
    setModalOpen(true);
    setModalEmployee(emp.name);
    setModalContent("");
    setError("");
    setLoading(true);
    setChatMessages([]);
    setChatInput("");
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

  const sendChat = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const response = await employeeChat(modalEmployee, text);
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Talent Radar</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time workforce intelligence overview</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">How scores are calculated:</span> <span className="text-gold font-medium">Potential</span> is a composite of learning agility, leadership assessment, and 360° feedback (scale 1–10). <span className="font-medium text-foreground">Risk level</span> is determined by: promotion recency, compensation gap vs. market, performance trend, and tenure-to-potential ratio. Flags are auto-generated when thresholds are breached.
        </div>
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
              <div className="bg-risk-high/5 border border-risk-high/15 rounded-lg px-3 py-2 mb-3">
                <p className="text-xs text-risk-high">⚠ {emp.flag}</p>
              </div>
            )}
            <div className="bg-muted/30 border border-border rounded-lg px-3 py-2 mb-4">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-semibold">Risk reasoning:</span> {riskReasoning(emp)}
              </p>
            </div>
            <button onClick={() => handleDeepDive(emp)} className="w-full py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              Deep Dive →
            </button>
          </div>
        ))}
      </div>

      {/* Modal with Deep Dive + Chat */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <h2 className="text-lg font-bold">AI Deep Dive — {modalEmployee}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto p-6 space-y-5">
              {/* Analysis section */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-sm text-muted-foreground">Analyzing...</span>
                </div>
              )}
              {error && <p className="text-risk-high text-sm py-4">{error}</p>}
              {modalContent && (
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-card-foreground bg-muted/20 border border-border rounded-xl p-4">
                  {modalContent}
                </div>
              )}

              {/* Chat section */}
              {modalContent && (
                <div className="border-t border-border pt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold">Ask more about {modalEmployee}</h3>
                  </div>

                  {/* Quick questions */}
                  {chatMessages.length === 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {quickQuestions.map((q) => (
                        <button key={q} onClick={() => sendChat(q)} className="px-3 py-1.5 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Chat messages */}
                  <div className="space-y-3 max-h-[300px] overflow-auto mb-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user" ? "btn-gradient text-primary-foreground" : "bg-secondary text-secondary-foreground border border-border"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary border border-border rounded-xl px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                          <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat input */}
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChat(chatInput)}
                      placeholder={`Ask about ${modalEmployee}...`}
                      className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none"
                      disabled={chatLoading}
                    />
                    <button onClick={() => sendChat(chatInput)} disabled={chatLoading} className="px-3 py-2 rounded-xl btn-gradient text-primary-foreground transition-all disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
