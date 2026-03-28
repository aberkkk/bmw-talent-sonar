export interface Employee {
  id: number;
  name: string;
  role: string;
  dept: string;
  skills: string[];
  tenure: number;
  score: number;
  salary: number;
  trend: string;
  lastPromo: number;
  potential: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  flag: string | null;
}
