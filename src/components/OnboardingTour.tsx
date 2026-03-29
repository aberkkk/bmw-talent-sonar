import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, ChevronLeft, X, PartyPopper } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/context/LanguageContext";

interface TourStep {
  selector: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const TOUR_STEPS: TourStep[] = [
  { selector: '[data-tour="talent-radar"]', titleKey: "nav.talentRadar", descKey: "tour.talentRadar" },
  { selector: '[data-tour="scenario-simulator"]', titleKey: "nav.scenarioSimulator", descKey: "tour.scenarioSim" },
  { selector: '[data-tour="compensation-pulse"]', titleKey: "nav.compensationPulse", descKey: "tour.compensation" },
  { selector: '[data-tour="upskilling-map"]', titleKey: "nav.upskillingMap", descKey: "tour.upskilling" },
  { selector: '[data-tour="succession-planner"]', titleKey: "nav.successionPlanner", descKey: "tour.succession" },
];

interface Props {
  active: boolean;
  onEnd: () => void;
}

export default function OnboardingTour({ active, onEnd }: Props) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [done, setDone] = useState(false);

  const measure = useCallback(() => {
    if (!active || done) return;
    const el = document.querySelector(TOUR_STEPS[step]?.selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [step, active, done]);

  useEffect(() => {
    if (active) { setStep(0); setDone(false); }
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  if (!active) return null;

  // Finished state
  if (done) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onEnd}>
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm text-center shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">You're ready! 🎉</h2>
          <p className="text-sm text-muted-foreground mb-6">You've completed the tour. Start exploring the BMW Scenario Simulator to manage your workforce intelligently.</p>
          <button onClick={onEnd} className="px-6 py-2.5 rounded-xl text-sm font-bold btn-gradient text-primary-foreground">
            Get Started
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const current = TOUR_STEPS[step];
  const pad = 6;

  // Tooltip position: prefer right of element, fallback to below
  const tooltipStyle: React.CSSProperties = rect ? (() => {
    const spaceRight = window.innerWidth - rect.right;
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceRight > 340) {
      return { position: "fixed", left: rect.right + 16, top: rect.top + rect.height / 2, transform: "translateY(-50%)" };
    }
    if (spaceBelow > 200) {
      return { position: "fixed", left: rect.left, top: rect.bottom + 16 };
    }
    return { position: "fixed", left: rect.left, top: rect.top - 16, transform: "translateY(-100%)" };
  })() : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay with cutout using CSS clip-path */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - pad}
                y={rect.top - pad}
                width={rect.width + pad * 2}
                height={rect.height + pad * 2}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-mask)" style={{ pointerEvents: "auto" }} onClick={onEnd} />
      </svg>

      {/* Spotlight ring */}
      {rect && (
        <div
          className="absolute border-2 border-primary rounded-xl pointer-events-none transition-all duration-300"
          style={{
            left: rect.left - pad,
            top: rect.top - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0.15), 0 0 30px hsl(var(--primary) / 0.1)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="bg-card border border-border rounded-2xl p-5 shadow-2xl w-[300px] animate-scale-in"
        style={tooltipStyle as any}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Step {step + 1} of {TOUR_STEPS.length}</span>
          <button onClick={onEnd} className="p-0.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <h3 className="text-base font-bold text-foreground mb-1">{current.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{current.description}</p>

        <div className="flex items-center justify-between">
          <button onClick={onEnd} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Skip Tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 transition-colors">
                <ChevronLeft className="w-3 h-3" /> Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < TOUR_STEPS.length - 1) setStep(s => s + 1);
                else setDone(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold btn-gradient text-primary-foreground flex items-center gap-1"
            >
              {step < TOUR_STEPS.length - 1 ? <>Next <ChevronRight className="w-3 h-3" /></> : "Finish"}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {TOUR_STEPS.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? "bg-primary w-4" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
