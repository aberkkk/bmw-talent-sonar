import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Radar, Users, Sparkles, BookOpen, DollarSign, Bot } from "lucide-react";

const navItems = [
  { title: "Talent Radar", path: "/", icon: Radar },
  { title: "Succession Planner", path: "/succession", icon: Users },
  { title: "Scenario Simulator", path: "/simulator", icon: Sparkles, star: true },
  { title: "Upskilling Map", path: "/upskilling", icon: BookOpen },
  { title: "Compensation Pulse", path: "/compensation", icon: DollarSign },
  { title: "AI Advisor", path: "/advisor", icon: Bot },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">BMW</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-accent-foreground leading-tight">BMW Workforce</h1>
              <p className="text-xs text-sidebar-foreground">Oracle</p>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
                {item.star && <span className="text-gold text-xs">⭐</span>}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">v2.4 · Workforce Intelligence</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
