export interface Employee {
  id: number;
  employeeId: string; // BMW-XXXX
  name: string;
  role: string;
  dept: string;
  deptCode: string; // e.g. ENG-01
  jobGrade: string; // L1-L5, Director, VP
  managerName: string;
  startDate: string; // ISO date string
  skills: string[];
  tenure: number;
  salary: number;
  lastPromo: number;
  trainingHours: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  flag: string | null;
}
