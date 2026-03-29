import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Radar, Users, Sparkles, BookOpen, DollarSign, Bot, Sun, Moon, HelpCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import type { TranslationKey } from "@/context/LanguageContext";
import OnboardingTour from "@/components/OnboardingTour";

const navItems = [
  { titleKey: "nav.talentRadar" as TranslationKey, path: "/", icon: Radar, tourId: "talent-radar" },
  { titleKey: "nav.successionPlanner" as TranslationKey, path: "/succession", icon: Users, tourId: "succession-planner" },
  { titleKey: "nav.scenarioSimulator" as TranslationKey, path: "/simulator", icon: Sparkles, star: true, tourId: "scenario-simulator" },
  { titleKey: "nav.upskillingMap" as TranslationKey, path: "/upskilling", icon: BookOpen, tourId: "upskilling-map" },
  { titleKey: "nav.compensationPulse" as TranslationKey, path: "/compensation", icon: DollarSign, tourId: "compensation-pulse" },
  { titleKey: "nav.aiAdvisor" as TranslationKey, path: "/advisor", icon: Bot },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [tourActive, setTourActive] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-64 shrink-0 bg-sidebar sidebar-shadow flex flex-col z-10 border-r border-sidebar-border">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/600px-BMW.svg.png"
              alt="BMW"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">BMW Scenario</h1>
              <p className="text-xs text-muted-foreground">Simulator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                data-tour={item.tourId}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{t(item.titleKey)}</span>
                {item.star && <span className="text-xs">⭐</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground">v2.4 · XA-108 Technologies</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {/* Top bar with language, tour + theme toggle */}
        <div className="flex items-center justify-end gap-2 px-8 pt-5 pb-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-secondary border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setLang("en")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                lang === "en"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="English"
            >
              <span className="text-base leading-none">🇬🇧</span>
              EN
            </button>
            <button
              onClick={() => setLang("de")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                lang === "de"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Deutsch"
            >
              <span className="text-base leading-none">🇩🇪</span>
              DE
            </button>
          </div>

          <button
            onClick={() => setTourActive(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-secondary text-secondary-foreground border border-border hover:border-primary/40 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {t("header.takeTour")}
          </button>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full border border-border bg-secondary transition-colors duration-300 flex items-center px-1 group hover:border-primary/40"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                theme === "dark"
                  ? "translate-x-7 bg-primary/20"
                  : "translate-x-0 bg-primary/15"
              }`}
            >
              {theme === "dark" ? (
                <Moon className="w-3 h-3 text-primary" />
              ) : (
                <Sun className="w-3 h-3 text-primary" />
              )}
            </div>
          </button>
        </div>
        <div className="px-8 pb-8">{children}</div>
      </main>

      <OnboardingTour active={tourActive} onEnd={() => setTourActive(false)} />
    </div>
  );
}
