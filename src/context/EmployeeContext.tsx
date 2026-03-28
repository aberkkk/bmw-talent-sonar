import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Employee } from "@/data/employees";

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, "id">) => void;
  removeEmployee: (id: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

const STORAGE_KEY = "bmw-workforce-employees";

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (emp: Omit<Employee, "id">) => {
    const id = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    setEmployees(prev => [...prev, { ...emp, id }]);
  };

  const removeEmployee = (id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, removeEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployees must be used within EmployeeProvider");
  return ctx;
}
