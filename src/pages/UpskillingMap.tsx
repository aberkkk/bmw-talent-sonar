import { useEmployees } from "@/context/EmployeeContext";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Info } from "lucide-react";
import EmptyState from "@/components/EmptyState";

function RoleNode({ role, isCurrent }: { role: string; isCurrent?: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-xl text-sm font-semibold text-center min-w-[140px] ${
      isCurrent ? "bg-primary/15 text-primary border-2 border-primary/40" : "bg-secondary text-secondary-foreground border border-border"
    }`}>
      {role}
    </div>
  );
}

function SkillGap({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
      {skills.map((s) => (
        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-medium bg-risk-high/15 text-risk-high border border-risk-high/25">{s}</span>
      ))}
    </div>
  );
}

function generateCareerPath(emp: ReturnType<typeof useEmployees>["employees"][0]) {
  const dept = emp.dept.toLowerCase();
  if (dept.includes("engineer") || dept.includes("tech") || dept.includes("data")) {
    return { next: "Lead Engineer", nextSkills: ["System Design", "Team Mgmt"], nextReason: `${emp.tenure}yr tenure with ${emp.skills.join(", ")} expertise. System Design & Team Mgmt are standard gaps for IC→Lead transition.`, future: "VP Engineering", futureSkills: ["Budgeting", "Strategy"], futureReason: `Lead→VP requires business acumen. ${emp.tenure >= 5 ? "Strong tenure supports this path." : "Needs more experience."}` };
  }
  if (dept.includes("sales")) {
    return { next: "Sales Director", nextSkills: ["P&L Management", "Team Scaling"], nextReason: `${emp.tenure}yr tenure. P&L Management needed at director level.`, future: "VP Sales", futureSkills: ["Board Reporting", "Global Markets"], futureReason: `VP requires board-level communication and multi-market experience.` };
  }
  if (dept.includes("operation")) {
    return { next: "Operations Manager", nextSkills: ["Budget Planning", "Vendor Mgmt"], nextReason: `${emp.tenure}yr tenure. Budget & Vendor Mgmt are prerequisites for manager-level.`, future: "Operations Director", futureSkills: ["C-Suite Comm.", "M&A Ops"], futureReason: `Director requires executive presence.` };
  }
  if (dept.includes("leader") || dept.includes("product")) {
    return { next: "Senior " + emp.role, nextSkills: ["Data Analytics", "Innovation"], nextReason: `${emp.tenure}yr tenure. Analytics and Innovation address common growth gaps.`, future: "Director", futureSkills: ["Board Pres.", "Portfolio Strategy"], futureReason: `Director competencies based on industry frameworks.` };
  }
  return { next: "Senior " + emp.role, nextSkills: ["Leadership", "Strategic Planning"], nextReason: `Based on ${emp.tenure}yr tenure and ${emp.skills.length} current skills.`, future: dept.charAt(0).toUpperCase() + dept.slice(1) + " Director", futureSkills: ["P&L Ownership", "Executive Comm."], futureReason: `Director-level requires full P&L and exec communication.` };
}

export default function UpskillingMap() {
  const { employees } = useEmployees();
  const { t } = useLanguage();

  if (employees.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t("upskill.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("upskill.subtitle")}</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t("upskill.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("upskill.subtitle")}</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Methodology:</span> Career paths based on competency frameworks. Skill gaps (red) are competencies required for the next role not in the employee's current profile.
        </div>
      </div>

      <div className="space-y-6">
        {employees.map((emp) => {
          const path = generateCareerPath(emp);
          return (
            <div key={emp.id} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">{emp.name} <span className="text-muted-foreground font-normal text-sm">· {emp.dept}</span></h3>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <RoleNode role={emp.role} isCurrent />
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                <SkillGap skills={path.nextSkills} />
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                <RoleNode role={path.next} />
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                <SkillGap skills={path.futureSkills} />
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                <RoleNode role={path.future} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-muted/30 border border-border rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">Next Step Reasoning</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{path.nextReason}</p>
                </div>
                <div className="bg-muted/30 border border-border rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">Long-Term Path Reasoning</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{path.futureReason}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
