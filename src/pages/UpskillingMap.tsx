import { employees } from "@/data/employees";
import { ArrowRight } from "lucide-react";

const careerPaths: Record<number, { next: string; nextSkills: string[]; future: string; futureSkills: string[] }> = {
  1: { next: "Lead Engineer", nextSkills: ["System Design", "Team Mgmt"], future: "VP Engineering", futureSkills: ["Budgeting", "Strategy"] },
  2: { next: "Regional Sales Director", nextSkills: ["P&L Management", "Team Scaling"], future: "VP Sales", futureSkills: ["Board Reporting", "Global Markets"] },
  3: { next: "Operations Manager", nextSkills: ["Budget Planning", "Vendor Mgmt"], future: "Operations Director", futureSkills: ["C-Suite Comm.", "M&A Ops"] },
  4: { next: "Senior PM", nextSkills: ["Data Analytics", "Innovation Mgmt"], future: "Director of Product", futureSkills: ["Board Pres.", "Portfolio Strategy"] },
  5: { next: "Senior Data Scientist", nextSkills: ["ML Engineering", "Cloud Infra"], future: "Head of Data", futureSkills: ["Team Building", "Data Strategy"] },
  6: { next: "Department Manager", nextSkills: ["Strategic Planning", "Hiring"], future: "Operations Director", futureSkills: ["P&L Ownership", "Executive Comm."] },
};

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

export default function UpskillingMap() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upskilling Map</h1>
        <p className="text-muted-foreground text-sm mt-1">Individual career progression paths & skill gaps</p>
      </div>

      <div className="space-y-6">
        {employees.map((emp) => {
          const path = careerPaths[emp.id];
          return (
            <div key={emp.id} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">{emp.name} <span className="text-muted-foreground font-normal text-sm">· {emp.dept}</span></h3>
              <div className="flex items-center gap-3 flex-wrap">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
