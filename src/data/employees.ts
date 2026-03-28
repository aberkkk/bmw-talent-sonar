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

export const employees: Employee[] = [
  { id: 1, name: "Anna Müller", role: "Senior Engineer", dept: "Engineering", skills: ["Python", "ML", "Battery Systems"], tenure: 4, score: 8.2, salary: 85, trend: "improving", lastPromo: 18, potential: 9.1, risk: "Medium", flag: "No promotion in 18 months" },
  { id: 2, name: "James Park", role: "Sales Manager", dept: "Sales", skills: ["Negotiation", "EV Portfolio", "CRM"], tenure: 7, score: 7.8, salary: 92, trend: "stable", lastPromo: 6, potential: 7.4, risk: "Low", flag: null },
  { id: 3, name: "Lena Schmidt", role: "Operations Lead", dept: "Operations", skills: ["Supply Chain", "Lean", "Data Analysis"], tenure: 2, score: 9.0, salary: 72, trend: "rapidly improving", lastPromo: 0, potential: 9.8, risk: "High", flag: "Underpaid vs market by 22%" },
  { id: 4, name: "Marco Rossi", role: "Product Manager", dept: "Leadership", skills: ["Strategy", "EV Roadmap", "Stakeholders"], tenure: 9, score: 7.1, salary: 110, trend: "declining", lastPromo: 30, potential: 6.2, risk: "Critical", flag: "Declining performance, no growth path" },
  { id: 5, name: "Sofia Chen", role: "Data Analyst", dept: "Engineering", skills: ["SQL", "Tableau", "R", "NLP"], tenure: 1, score: 8.7, salary: 65, trend: "improving", lastPromo: 0, potential: 9.5, risk: "High", flag: "High potential, at risk of poaching" },
  { id: 6, name: "Tobias Weber", role: "Team Lead", dept: "Operations", skills: ["Leadership", "Agile", "Process Opt."], tenure: 6, score: 7.5, salary: 88, trend: "stable", lastPromo: 12, potential: 7.8, risk: "Low", flag: null },
];
