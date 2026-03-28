import { useState } from "react";
import { employees } from "@/data/employees";
import { Send } from "lucide-react";

const exampleQuestions = [
  "Who is most at risk of leaving in Q2?",
  "Which team has the biggest succession gap?",
  "Who should we promote first?",
];

interface Message { role: "user" | "ai"; content: string; }

function generateResponse(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("risk") || lower.includes("leaving")) {
    const highRisk = employees.filter((e) => e.risk === "High" || e.risk === "Critical");
    return `Based on current data, **${highRisk.map((e) => e.name).join(", ")}** are at highest risk of attrition.\n\n• **${highRisk[0]?.name}**: ${highRisk[0]?.flag}\n• **${highRisk[1]?.name}**: ${highRisk[1]?.flag}\n\nRecommendation: Schedule retention conversations within 2 weeks and consider compensation adjustments for underpaid high-performers.`;
  }
  if (lower.includes("succession") || lower.includes("gap")) {
    return `**Engineering** has the biggest succession gap. Only Anna Müller and Sofia Chen are viable VP Engineering candidates.\n\n• Anna: Potential 9.1, but no promotion in 18 months — engagement risk\n• Sofia: Potential 9.5, but only 1yr tenure — needs development time\n\nRecommendation: Fast-track Anna's promotion and create a 12-month leadership development program for Sofia.`;
  }
  if (lower.includes("promote")) {
    const top = [...employees].sort((a, b) => b.potential - a.potential).slice(0, 3);
    return `Top promotion candidates ranked by potential:\n\n1. **${top[0].name}** (${top[0].potential}) — ${top[0].role}. ${top[0].flag || "Strong trajectory."}\n2. **${top[1].name}** (${top[1].potential}) — ${top[1].role}. ${top[1].flag || "Consistent performer."}\n3. **${top[2].name}** (${top[2].potential}) — ${top[2].role}.\n\nRecommendation: Prioritize Lena Schmidt — she's the highest potential employee but critically underpaid. Promote + adjust compensation simultaneously.`;
  }
  return `I've analyzed the workforce data for your query: "${q}"\n\nKey insights:\n• Average team performance score: ${(employees.reduce((a, e) => a + e.score, 0) / employees.length).toFixed(1)}\n• ${employees.filter((e) => e.risk === "High" || e.risk === "Critical").length} employees flagged as high/critical risk\n• Average tenure: ${(employees.reduce((a, e) => a + e.tenure, 0) / employees.length).toFixed(1)} years\n\nWould you like me to dive deeper into any specific area?`;
}

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "ai", content: generateResponse(text) }]);
    setInput("");
  };

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Advisor</h1>
        <p className="text-muted-foreground text-sm mt-1">Ask questions about your workforce data</p>
      </div>

      {messages.length === 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {exampleQuestions.map((q) => (
            <button key={q} onClick={() => send(q)} className="px-4 py-2.5 rounded-xl text-sm bg-card border border-border hover:border-primary/40 text-card-foreground transition-all card-glow">
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user" ? "btn-gradient text-primary-foreground" : "bg-card border border-border text-card-foreground"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Ask about your workforce..." className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" />
        <button onClick={() => send(input)} className="px-5 py-3 rounded-xl btn-gradient text-primary-foreground transition-all">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
