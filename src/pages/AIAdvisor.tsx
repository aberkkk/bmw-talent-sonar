import { useState, useRef, useEffect } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { useLanguage } from "@/context/LanguageContext";
import { advisorChat } from "@/lib/gemini";
import { Send, Loader2, Sparkles, User, RotateCcw } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import ReactMarkdown from "react-markdown";

const exampleQuestions = [
  { text: "Who is most at risk of leaving?", emoji: "🚨" },
  { text: "Which team has the biggest succession gap?", emoji: "🔄" },
  { text: "Who should we promote first?", emoji: "📈" },
  { text: "Give me a compensation overview", emoji: "💰" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1.4s_ease-in-out_0s_infinite]" />
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
      <span className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
    </div>
  );
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none 
      prose-headings:text-foreground prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-3
      prose-p:text-card-foreground prose-p:leading-relaxed prose-p:mb-2
      prose-strong:text-foreground prose-strong:font-semibold
      prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:text-card-foreground
      prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-medium
      prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
      prose-hr:border-border
      [&_em]:text-muted-foreground [&_em]:text-xs [&_em]:block [&_em]:mt-3 [&_em]:opacity-80
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

function StreamingText({ content, onDone }: { content: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    
    const speed = Math.max(5, Math.min(15, 2000 / content.length));
    
    const interval = setInterval(() => {
      indexRef.current += Math.ceil(content.length / 150);
      if (indexRef.current >= content.length) {
        setDisplayed(content);
        clearInterval(interval);
        onDone();
      } else {
        setDisplayed(content.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, onDone]);

  return <MarkdownMessage content={displayed} />;
}

export default function AIAdvisor() {
  const { employees } = useEmployees();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      setMessages((prev) => [...prev, { role: "assistant", content: response, isStreaming: true }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamDone = (index: number) => {
    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isStreaming: false } : m));
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div data-tour="advisor-area" className="animate-fade-in flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("advisor.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("advisor.subtitle")}</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-auto mb-4 scroll-smooth">
        {messages.length === 0 ? (
          /* Welcome screen */
          <div className="flex flex-col items-center justify-center h-full pb-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 border border-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">How can I help?</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md text-center">
              Ask me anything about your workforce — risk analysis, promotions, compensation, succession planning, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {exampleQuestions.map((q) => (
                <button
                  key={q.text}
                  onClick={() => send(q.text)}
                  className="group flex items-start gap-3 px-4 py-3.5 rounded-xl text-left text-sm bg-card border border-border hover:border-primary/30 hover:bg-primary/5 text-card-foreground transition-all duration-200"
                >
                  <span className="text-lg mt-0.5 group-hover:scale-110 transition-transform">{q.emoji}</span>
                  <span className="leading-relaxed">{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="space-y-1 py-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 px-3 py-4 rounded-xl transition-colors ${
                  msg.role === "user" ? "" : "bg-muted/30"
                } animate-fade-in`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mt-0.5">
                  {msg.role === "assistant" ? (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {msg.role === "assistant" ? "AI Advisor" : "You"}
                  </p>
                  {msg.role === "user" ? (
                    <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                  ) : msg.isStreaming ? (
                    <StreamingText content={msg.content} onDone={() => handleStreamDone(i)} />
                  ) : (
                    <MarkdownMessage content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div className="flex gap-3 px-3 py-4 rounded-xl bg-muted/30 animate-fade-in">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-primary-foreground animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">AI Advisor</p>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-border pt-4">
        <div className="relative flex items-end gap-2 bg-card border border-border rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={t("advisor.placeholder")}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-32 leading-relaxed"
            disabled={loading}
            style={{ minHeight: "24px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "24px";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all disabled:opacity-30 hover:bg-primary/90 disabled:hover:bg-primary"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
          AI-powered insights based on your workforce data. Always validate with HR leadership.
        </p>
      </div>
    </div>
  );
}
