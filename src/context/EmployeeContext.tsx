import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Employee } from "@/data/employees";

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, "id">) => void;
  addEmployees: (emps: Omit<Employee, "id">[]) => void;
  updateEmployee: (id: number, changes: Partial<Omit<Employee, "id">>) => void;
  removeEmployee: (id: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const STORAGE_KEY = "bmw-workforce-employees";

/** Auto-compute risk level and flag from employee data */
function computeRiskAndFlag(emp: Employee): Pick<Employee, "risk" | "flag"> {
  const benchmark = Math.round(emp.salary * 1.12);
  const salaryGap = Math.round(((benchmark - emp.salary) / emp.salary) * 100);
  const flags: string[] = [];

  if (emp.lastPromo > 18) flags.push(`No promotion in ${emp.lastPromo} months`);
  if (salaryGap > 10) flags.push(`Underpaid vs market by ${salaryGap}%`);
  if (emp.trend === "declining") flags.push("Declining performance trend");
  if (emp.potential >= 9 && emp.tenure <= 2) flags.push("High potential, at risk of poaching");
  if (emp.score < 6) flags.push("Below performance threshold");

  let risk: Employee["risk"] = "Low";
  let score = 0;
  if (emp.lastPromo > 24) score += 3; else if (emp.lastPromo > 18) score += 2; else if (emp.lastPromo > 12) score += 1;
  if (salaryGap > 20) score += 3; else if (salaryGap > 10) score += 2; else if (salaryGap > 5) score += 1;
  if (emp.trend === "declining") score += 3; else if (emp.trend === "stable") score += 1;
  if (emp.potential >= 9 && emp.tenure <= 2) score += 2;
  if (emp.score < 6) score += 1;

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

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      return parsed.map(applyAutoFields);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = useCallback((emp: Omit<Employee, "id">) => {
    setEmployees(prev => {
      const id = prev.length > 0 ? Math.max(...prev.map(e => e.id)) + 1 : 1;
      const newEmp = applyAutoFields({ ...emp, id } as Employee);
      return [...prev, newEmp];
    });
  }, []);

  const updateEmployee = useCallback((id: number, changes: Partial<Omit<Employee, "id">>) => {
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
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, removeEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used within EmployeeProvider");
  return ctx;
}
