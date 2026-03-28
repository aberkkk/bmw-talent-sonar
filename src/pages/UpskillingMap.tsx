import { employees } from "@/data/employees";
import { ArrowRight, Info } from "lucide-react";

const careerPaths: Record<number, { next: string; nextSkills: string[]; nextReason: string; future: string; futureSkills: string[]; futureReason: string }> = {
  1: { next: "Lead Engineer", nextSkills: ["System Design", "Team Mgmt"], nextReason: "Strong Python/ML foundation (score 8.2). System Design & Team Mgmt are the standard competency gaps for individual contributors moving to lead roles per BMW Engineering competency framework.", future: "VP Engineering", futureSkills: ["Budgeting", "Strategy"], futureReason: "Lead-to-VP transition requires business acumen. Budgeting & Strategy are top-cited gaps in BMW's leadership assessment data." },
  2: { next: "Regional Sales Director", nextSkills: ["P&L Management", "Team Scaling"], nextReason: "7yr tenure and strong CRM skills. P&L Management is required at director level per BMW Sales career ladder. Team Scaling needed to manage 10+ reports.", future: "VP Sales", futureSkills: ["Board Reporting", "Global Markets"], futureReason: "VP Sales requires board-level communication and multi-market experience, neither currently in James's skill set." },
  3: { next: "Operations Manager", nextSkills: ["Budget Planning", "Vendor Mgmt"], nextReason: "Highest potential score (9.8) with only 2yr tenure. Budget Planning and Vendor Mgmt are prerequisites for manager-level Operations roles per Korn Ferry framework.", future: "Operations Director", futureSkills: ["C-Suite Comm.", "M&A Ops"], futureReason: "Director-level requires executive presence and M&A integration experience. Rapidly improving trend supports accelerated development." },
  4: { next: "Senior PM", nextSkills: ["Data Analytics", "Innovation Mgmt"], nextReason: "9yr tenure but declining trend (score 7.1). Data Analytics and Innovation Mgmt address the skills most correlated with PM career stagnation per industry research.", future: "Director of Product", futureSkills: ["Board Pres.", "Portfolio Strategy"], futureReason: "Declining performance must reverse before director track. Board Presentation and Portfolio Strategy are standard director competencies." },
  5: { next: "Senior Data Scientist", nextSkills: ["ML Engineering", "Cloud Infra"], nextReason: "Exceptional potential (9.5) with strong SQL/Tableau/R/NLP base. ML Engineering & Cloud Infra are the most in-demand adjacent skills per LinkedIn Talent Insights 2024.", future: "Head of Data", futureSkills: ["Team Building", "Data Strategy"], futureReason: "IC-to-Head transition requires people leadership and strategic roadmap skills. Only 1yr tenure — needs time to build organizational context." },
  6: { next: "Department Manager", nextSkills: ["Strategic Planning", "Hiring"], nextReason: "Already a Team Lead with 6yr tenure. Strategic Planning and Hiring are the two competencies differentiating team leads from department managers per BMW's leadership model.", future: "Operations Director", futureSkills: ["P&L Ownership", "Executive Comm."], futureReason: "Director requires full P&L responsibility and executive-level communication. Stable trend (7.5 score) suggests steady but not accelerated progression." },
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

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex gap-3 items-start">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Methodology:</span> Career paths are based on BMW's internal competency framework and industry career ladders (Korn Ferry, Mercer). Skill gaps (shown in red) represent competencies required for the next role that are not currently in the employee's assessed skill profile. Sources include 360° reviews, manager assessments, and LinkedIn Talent Insights 2024.
        </div>
      </div>

      <div className="space-y-6">
        {employees.map((emp) => {
          const path = careerPaths[emp.id];
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
