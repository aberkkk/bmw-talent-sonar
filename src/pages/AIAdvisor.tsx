import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { useLanguage } from "@/context/LanguageContext";
import { advisorChat } from "@/lib/gemini";
import { Send, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const exampleQuestions = [
  "Who is most at risk of leaving?",
  "Which team has the biggest succession gap?",
  "Who should we promote first?",
];

interface Message { role: "user" | "assistant"; content: string; }

export default function AIAdvisor() {
  const { employees } = useEmployees();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (employees.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{t("advisor.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("advisor.subtitle")}</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const history = updated.map((m) => ({ role: m.role, content: m.content }));
      const response = await advisorChat(text, history.slice(0, -1), employees);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-tour="advisor-area" className="animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("advisor.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("advisor.subtitle")}</p>
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
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder={t("advisor.placeholder")} className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" disabled={loading} />
        <button onClick={() => send(input)} disabled={loading} className="px-5 py-3 rounded-xl btn-gradient text-primary-foreground transition-all disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
