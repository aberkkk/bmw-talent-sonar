import { useState, useRef, useEffect } from "react";
import { employees } from "@/data/employees";
import RiskBadge from "@/components/RiskBadge";
import { scenarioChat } from "@/lib/gemini";
import { Loader2, Send, Info, MessageCircle } from "lucide-react";

interface ChatMsg { role: "user" | "assistant"; content: string; scenarios?: Scenario[] | null; }
interface Scenario { title: string; probability: number; cost: string; risk: "Low" | "Medium" | "High" | "Critical"; description: string; reasoning: string; }

const quickPrompts = [
  "What if we promote Anna Müller now?",
  "Give Lena Schmidt a 25% raise — what happens?",
  "What if Marco Rossi leaves in 3 months?",
  "Compare: relocating Sofia Chen vs giving her a raise",
  "What if we do nothing about our high-risk employees?",
];

export default function ScenarioSimulator() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const result = await scenarioChat(text);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.analysis,
        scenarios: result.scenarios,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that scenario. Try rephrasing your question." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Scenario Simulator ⭐</h1>
        <p className="text-muted-foreground text-sm mt-1">Describe any workforce decision in plain language — get scenario analysis</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">How it works:</span> Describe any HR decision naturally — promotions, raises (any %), relocations, team changes, or custom scenarios. The simulator models outcomes based on employee data including performance scores, risk levels, market benchmarks, and tenure. Probabilities are calculated from historical workforce patterns.
        </div>
      </div>

      {/* Quick prompts when empty */}
      {messages.length === 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Try asking something like:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q) => (
              <button key={q} onClick={() => send(q)} className="px-4 py-2.5 rounded-xl text-sm bg-card border border-border hover:border-primary/40 text-card-foreground transition-all card-glow">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-auto space-y-5 mb-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user" ? "btn-gradient text-primary-foreground" : "bg-card border border-border text-card-foreground"
              }`}>
                {msg.content}
              </div>
            </div>
            {/* Scenario cards */}
            {msg.scenarios && msg.scenarios.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 max-w-[90%]">
                {msg.scenarios.map((s, j) => (
                  <div key={j} className="bg-card border border-border rounded-xl p-4 card-glow transition-all">
                    <p className="text-xs text-muted-foreground mb-1">Scenario {String.fromCharCode(65 + j)}</p>
                    <h3 className="font-semibold text-sm mb-3">{s.title}</h3>
                    <p className="text-3xl font-bold text-primary mb-1">{s.probability}%</p>
                    <p className="text-xs text-muted-foreground mb-2">probability of positive outcome</p>
                    <p className="text-sm font-medium text-accent mb-2">{s.cost}</p>
                    <RiskBadge risk={s.risk} />
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.description}</p>
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        <span className="font-semibold not-italic">Reasoning:</span> {s.reasoning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Simulating scenarios...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Describe a decision... e.g. 'What if we give Sofia a 30% raise and promote her?'"
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none"
          disabled={loading}
        />
        <button onClick={() => send(input)} disabled={loading} className="px-5 py-3 rounded-xl btn-gradient text-primary-foreground transition-all disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
