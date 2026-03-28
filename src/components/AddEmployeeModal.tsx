import { useState } from "react";
import { Employee } from "@/data/employees";
import { X, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (emp: Omit<Employee, "id" | "employeeId">) => void;
}

const trendOptions = ["improving", "rapidly improving", "stable", "declining"];

const jobGradeOptions = ["L1", "L2", "L3", "L4", "L5", "Director", "VP"];

const departmentOptions = [
  "Engineering", "Product", "Analytics", "Design", "Marketing",
  "Sales", "Finance", "HR", "Operations", "Legal", "IT", "R&D",
  "Supply Chain", "Manufacturing", "Customer Success"
];

const roleOptions = [
  "Junior Engineer", "Engineer", "Senior Engineer", "Lead Engineer", "Staff Engineer", "Principal Engineer",
  "Junior Designer", "Designer", "Senior Designer", "Lead Designer",
  "Analyst", "Senior Analyst", "Lead Analyst", "Data Scientist", "Senior Data Scientist",
  "Product Manager", "Senior Product Manager", "Director of Product",
  "Marketing Specialist", "Senior Marketing Specialist", "Marketing Manager",
  "Sales Representative", "Senior Sales Representative", "Sales Manager",
  "HR Specialist", "HR Manager", "HR Director",
  "Finance Analyst", "Senior Finance Analyst", "Finance Manager",
  "Operations Manager", "Senior Operations Manager",
  "Team Lead", "Manager", "Senior Manager", "Director", "VP", "SVP"
];

export default function AddEmployeeModal({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [jobGrade, setJobGrade] = useState("L3");
  const [managerName, setManagerName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [skillsStr, setSkillsStr] = useState("");
  const [tenure, setTenure] = useState("");
  const [score, setScore] = useState("");
  const [salary, setSalary] = useState("");
  const [trend, setTrend] = useState("stable");
  const [lastPromo, setLastPromo] = useState("");
  const [potential, setPotential] = useState("");
  const [lastReviewScore, setLastReviewScore] = useState("");
  const [trainingHours, setTrainingHours] = useState("");

  if (!open) return null;

  const isValid = name.trim() && role.trim() && dept.trim() && skillsStr.trim() && tenure && score && salary && potential && lastPromo && jobGrade;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      name: name.trim(),
      role: role.trim(),
      dept: dept.trim(),
      deptCode: deptCode.trim(),
      jobGrade,
      managerName: managerName.trim(),
      startDate: startDate ? startDate.toISOString() : "",
      skills: skillsStr.split(",").map(s => s.trim()).filter(Boolean),
      tenure: parseFloat(tenure),
      score: parseFloat(score),
      salary: parseFloat(salary),
      trend,
      lastPromo: parseInt(lastPromo),
      potential: parseFloat(potential),
      lastReviewScore: lastReviewScore ? parseFloat(lastReviewScore) : 3,
      trainingHours: trainingHours ? parseInt(trainingHours) : 0,
      risk: "Low",
      flag: null,
    });
    setName(""); setRole(""); setDept(""); setDeptCode(""); setJobGrade("L3"); setManagerName(""); setStartDate(undefined); setSkillsStr(""); setTenure(""); setScore(""); setSalary(""); setTrend("stable"); setLastPromo(""); setPotential(""); setLastReviewScore(""); setTrainingHours("");
    onClose();
  };

  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none placeholder:text-muted-foreground";
  const labelCls = "text-sm text-muted-foreground font-medium";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Add Employee</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Full Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Anna Müller" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Manager Name</label>
              <input value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="e.g. Thomas Schmidt" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Role *</label>
              <select value={role} onChange={e => setRole(e.target.value)} className={inputCls}>
                <option value="">Select role...</option>
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Job Grade *</label>
              <select value={jobGrade} onChange={e => setJobGrade(e.target.value)} className={inputCls}>
                {jobGradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Department *</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={inputCls}>
                <option value="">Select...</option>
                {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Dept Code</label>
              <input value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="e.g. ENG-01" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(inputCls, "text-left", !startDate && "text-muted-foreground")}>
                    {startDate ? format(startDate, "PP") : "Pick date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[60]" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Salary (€k/year) *</label>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. 85" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Training Hours This Year</label>
              <input type="number" value={trainingHours} onChange={e => setTrainingHours(e.target.value)} placeholder="e.g. 40" className={inputCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Skills * <span className="text-xs text-muted-foreground">(comma-separated)</span></label>
            <input value={skillsStr} onChange={e => setSkillsStr(e.target.value)} placeholder="e.g. Python, ML, Battery Systems" className={inputCls} />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Tenure (yr) *</label>
              <input type="number" step="0.5" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="4" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Score (1-10) *</label>
              <input type="number" step="0.1" min="1" max="10" value={score} onChange={e => setScore(e.target.value)} placeholder="8.2" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Potential *</label>
              <input type="number" step="0.1" min="1" max="10" value={potential} onChange={e => setPotential(e.target.value)} placeholder="9.1" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Review (1-5)</label>
              <input type="number" step="0.1" min="1" max="5" value={lastReviewScore} onChange={e => setLastReviewScore(e.target.value)} placeholder="4.2" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className={labelCls}>Last Promotion *</label>
              <input type="number" value={lastPromo} onChange={e => setLastPromo(e.target.value)} placeholder="months ago" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Trend *</label>
              <select value={trend} onChange={e => setTrend(e.target.value)} className={inputCls}>
                {trendOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={!isValid} className="w-full py-3 rounded-lg text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2">
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
