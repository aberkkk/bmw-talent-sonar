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
  score: number;
  salary: number;
  trend: string;
  lastPromo: number;
  potential: number;
  lastReviewScore: number; // 1-5
  trainingHours: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  flag: string | null;
}
