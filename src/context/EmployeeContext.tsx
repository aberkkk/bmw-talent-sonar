import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Employee } from "@/data/employees";

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, "id" | "employeeId">) => void;
  addEmployees: (emps: Omit<Employee, "id" | "employeeId">[]) => void;
  updateEmployee: (id: number, changes: Partial<Omit<Employee, "id" | "employeeId">>) => void;
  removeEmployee: (id: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const STORAGE_KEY = "bmw-workforce-employees";

function generateEmployeeId(nextNum: number): string {
  return `BMW-${String(nextNum).padStart(4, "0")}`;
}

/** Auto-compute risk level and flag from employee data */
function computeRiskAndFlag(emp: Employee): Pick<Employee, "risk" | "flag"> {
  const gradeMultiplier: Record<string, number> = {
    "L1": 1.08, "L2": 1.10, "L3": 1.12, "L4": 1.15, "L5": 1.18, "Director": 1.20, "VP": 1.25,
  };
  const mult = gradeMultiplier[emp.jobGrade] || 1.12;
  const benchmark = Math.round(emp.salary * mult);
  const salaryGap = Math.round(((benchmark - emp.salary) / emp.salary) * 100);
  const flags: string[] = [];

  if (emp.lastPromo > 18) flags.push(`No promotion in ${emp.lastPromo} months`);
  if (salaryGap > 10) flags.push(`Underpaid vs market by ${salaryGap}%`);
  if (emp.tenure <= 2) flags.push("Short tenure, at risk of poaching");

  let risk: Employee["risk"] = "Low";
  let score = 0;
  if (emp.lastPromo > 24) score += 3; else if (emp.lastPromo > 18) score += 2; else if (emp.lastPromo > 12) score += 1;
  if (salaryGap > 20) score += 3; else if (salaryGap > 10) score += 2; else if (salaryGap > 5) score += 1;
  if (emp.tenure <= 2) score += 2;

  if (score >= 7) risk = "Critical";
  else if (score >= 5) risk = "High";
  else if (score >= 3) risk = "Medium";
  else risk = "Low";

  return { risk, flag: flags.length > 0 ? flags[0] : null };
}

function applyAutoFields(emp: Employee): Employee {
  const { risk, flag } = computeRiskAndFlag(emp);
  return { ...emp, risk, flag };
}

function migrateEmployee(e: any): Employee {
  const base: Employee = {
    id: e.id,
    employeeId: e.employeeId || `BMW-${String(e.id).padStart(4, "0")}`,
    name: e.name || "",
    role: e.role || "",
    dept: e.dept || "",
    deptCode: e.deptCode || "",
    jobGrade: e.jobGrade || "L3",
    managerName: e.managerName || "",
    startDate: e.startDate || "",
    skills: e.skills || [],
    tenure: e.tenure || 0,
    salary: e.salary || 0,
    lastPromo: e.lastPromo || 0,
    trainingHours: e.trainingHours || 0,
    risk: e.risk || "Low",
    flag: e.flag || null,
  };
  return base;
}

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return parsed.map((e: any) => applyAutoFields(migrateEmployee(e)));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = useCallback((emp: Omit<Employee, "id" | "employeeId">) => {
    setEmployees(prev => {
      const id = prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 1;
      const employeeId = generateEmployeeId(id);
      const newEmp = applyAutoFields({ ...emp, id, employeeId } as Employee);
      return [...prev, newEmp];
    });
  }, []);

  const addEmployees = useCallback((emps: Omit<Employee, "id" | "employeeId">[]) => {
    setEmployees(prev => {
      let nextId = prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 1;
      const newEmps = emps.map(emp => {
        const employeeId = generateEmployeeId(nextId);
        const e = applyAutoFields({ ...emp, id: nextId, employeeId } as Employee);
        nextId++;
        return e;
      });
      return [...prev, ...newEmps];
    });
  }, []);

  const updateEmployee = useCallback((id: number, changes: Partial<Omit<Employee, "id" | "employeeId">>) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== id) return e;
      const updated = { ...e, ...changes };
      return applyAutoFields(updated);
    }));
  }, []);

  const removeEmployee = useCallback((id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, addEmployees, updateEmployee, removeEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used within EmployeeProvider");
  return ctx;
}
