import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, ChevronLeft, X, PartyPopper, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TourStep {
  path: string;
  selector: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    path: "/",
    selector: '[data-tour="talent-cards"]',
    title: "Talent Radar",
    description:
      "This is your Talent Radar. Every employee appears here with their risk level, salary gap flags, and potential score. Click Deep Dive to see full details.",
  },
  {
    path: "/simulator",
    selector: '[data-tour="scenario-input"]',
    title: "Scenario Simulator",
    description:
      "This is the Scenario Simulator — the heart of the tool. Type any decision like 'What if we promote Anna?' and the AI simulates the outcome instantly. You can also compare two employees side by side.",
  },
  {
    path: "/succession",
    selector: '[data-tour="succession-cards"]',
    title: "Succession Planner",
    description:
      "The Succession Planner shows who is ready to step into key leadership roles. Readiness updates automatically when decisions are applied in the Simulator.",
  },
  {
    path: "/upskilling",
    selector: '[data-tour="career-paths"]',
    title: "Upskilling Map",
    description:
      "The Upskilling Map shows each employee's career path and the skill gaps blocking their next promotion. Red tags are missing skills. These update when a promotion scenario is applied.",
  },
  {
    path: "/compensation",
    selector: '[data-tour="comp-chart"]',
    title: "Compensation Pulse",
    description:
      "Compensation Pulse benchmarks every employee's salary against the market. Switch between Bar, Gap, Trend, and Peer views. Numbers update live when a salary decision is applied.",
  },
  {
    path: "/advisor",
    selector: '[data-tour="advisor-area"]',
    title: "AI Advisor",
    description:
      "The AI Advisor answers questions about your workforce in plain language. Ask things like 'Who is most at risk?' or 'Who should we promote first?' and get instant AI-powered insights.",
  },
];

interface Props {
  active: boolean;
  onEnd: () => void;
}

export default function OnboardingTour({ active, onEnd }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [done, setDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const retryRef = useRef<number>(0);

  const measure = useCallback(() => {
    if (!active || done) return;
    const el = document.querySelector(TOUR_STEPS[step]?.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Small delay to let scroll settle
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setRect(r);
        setTransitioning(false);
        retryRef.current = 0;
      });
    } else if (retryRef.current < 15) {
      retryRef.current++;
      setTimeout(measure, 150);
    }
  }, [step, active, done]);

  useEffect(() => {
    if (active) {
      setStep(0);
      setDone(false);
      setTransitioning(true);
      navigate(TOUR_STEPS[0].path);
    }
  }, [active]);

  useEffect(() => {
    if (!active || done) return;
    setTransitioning(true);
    setRect(null);
    retryRef.current = 0;
    navigate(TOUR_STEPS[step].path);
    // Wait for page to render
    const timeout = setTimeout(measure, 300);
    return () => clearTimeout(timeout);
  }, [step, active, done]);

  useEffect(() => {
    if (!active || done) return;
    const handleResize = () => measure();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measure, active, done]);

  if (!active) return null;

  // Finished state
  if (done) {
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onEnd}
      >
        <div
          className="bg-card border border-border rounded-2xl p-10 max-w-md text-center shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            You're ready to make smarter people decisions.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Start in the Scenario Simulator to simulate your first decision.
          </p>
          <button
            onClick={() => {
              navigate("/simulator");
              onEnd();
            }}
            className="px-8 py-3 rounded-xl text-sm font-bold btn-gradient text-primary-foreground flex items-center gap-2 mx-auto"
          >
            <Rocket className="w-4 h-4" />
            Go to Simulator
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const current = TOUR_STEPS[step];
  const pad = 8;

  // Tooltip position
  const tooltipStyle: React.CSSProperties = rect
    ? (() => {
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceRight > 360) {
          return {
            position: "fixed",
            left: rect.right + 20,
            top: rect.top + rect.height / 2,
            transform: "translateY(-50%)",
          };
        }
        if (spaceLeft > 360) {
          return {
            position: "fixed",
            left: rect.left - 340,
            top: rect.top + rect.height / 2,
            transform: "translateY(-50%)",
          };
        }
        if (spaceBelow > 220) {
          return {
            position: "fixed",
            left: Math.max(16, rect.left + rect.width / 2 - 160),
            top: rect.bottom + 20,
          };
        }
        return {
          position: "fixed",
          left: Math.max(16, rect.left + rect.width / 2 - 160),
          top: rect.top - 20,
          transform: "translateY(-100%)",
        };
      })()
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - pad}
                y={rect.top - pad}
                width={rect.width + pad * 2}
                height={rect.height + pad * 2}
                rx="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: "auto" }}
          onClick={onEnd}
        />
      </svg>

      {/* Spotlight ring */}
      {rect && !transitioning && (
        <div
          className="absolute border-2 border-primary rounded-xl pointer-events-none transition-all duration-500 ease-out"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow:
              "0 0 0 4px hsl(var(--primary) / 0.2), 0 0 40px hsl(var(--primary) / 0.15)",
          }}
        />
      )}

      {/* Tooltip */}
      {!transitioning && rect && (
        <div
          className="bg-card border border-border rounded-2xl p-6 shadow-2xl w-[320px] animate-scale-in"
          style={tooltipStyle as any}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
              {step + 1} of {TOUR_STEPS.length}
            </span>
            <button
              onClick={onEnd}
              className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1.5">
            {current.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {current.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={onEnd}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
              )}
              <button
                onClick={() => {
                  if (step < TOUR_STEPS.length - 1) setStep((s) => s + 1);
                  else setDone(true);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold btn-gradient text-primary-foreground flex items-center gap-1"
              >
                {step < TOUR_STEPS.length - 1 ? (
                  <>
                    Next <ChevronRight className="w-3 h-3" />
                  </>
                ) : (
                  "Finish"
                )}
              </button>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? "bg-primary w-5"
                    : i < step
                    ? "bg-primary/40 w-1.5"
                    : "bg-muted-foreground/20 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
