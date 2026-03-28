import { useState, useRef } from "react";
import { Employee } from "@/data/employees";
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (employees: Omit<Employee, "id" | "employeeId">[]) => void;
}

const EXPECTED_HEADERS = ["name", "role", "dept", "skills", "tenure", "score", "salary", "trend", "lastPromo", "potential"];

const SAMPLE_CSV = `name,role,dept,skills,tenure,score,salary,trend,lastPromo,potential,jobGrade,managerName,deptCode,startDate,lastReviewScore,trainingHours
Anna Müller,Senior Engineer,Engineering,"Python, ML, Battery Systems",4.5,8.2,82,improving,6,9.1,L4,Thomas Schmidt,ENG-01,2021-06-15,4.5,32
Markus Weber,Product Manager,Product,"Agile, Roadmapping, UX",3,7.5,78,stable,14,7.8,L3,Lisa König,PRD-01,2022-03-01,3.8,24
Sofia Rossi,Data Scientist,Analytics,"R, Python, Tableau",2,9.1,71,rapidly improving,3,9.5,L3,Marco Bianchi,ANA-01,2023-01-10,4.8,48`;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      row.push(current.trim()); current = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(current.trim()); current = "";
      if (row.some(c => c)) rows.push(row);
      row = [];
    } else {
      current += ch;
    }
  }
  row.push(current.trim());
  if (row.some(c => c)) rows.push(row);
  return rows;
}

function validateRow(row: string[], headers: string[]): { emp: Omit<Employee, "id" | "employeeId"> | null; errors: string[] } {
  const errors: string[] = [];
  const get = (key: string) => {
    const idx = headers.indexOf(key);
    return idx >= 0 ? row[idx]?.trim() || "" : "";
  };

  const name = get("name");
  const role = get("role");
  const dept = get("dept");
  const skillsRaw = get("skills");
  const tenureRaw = get("tenure");
  const scoreRaw = get("score");
  const salaryRaw = get("salary");
  const trend = get("trend") || "stable";
  const lastPromoRaw = get("lastPromo") || get("lastpromo") || get("last_promo");
  const potentialRaw = get("potential");

  if (!name) errors.push("Missing name");
  if (!role) errors.push("Missing role");
  if (!dept) errors.push("Missing dept");

  const tenure = parseFloat(tenureRaw);
  const score = parseFloat(scoreRaw);
  const salary = parseFloat(salaryRaw);
  const lastPromo = parseInt(lastPromoRaw);
  const potential = parseFloat(potentialRaw);

  if (isNaN(tenure)) errors.push("Invalid tenure");
  if (isNaN(score) || score < 1 || score > 10) errors.push("Invalid score (1-10)");
  if (isNaN(salary)) errors.push("Invalid salary");
  if (isNaN(lastPromo)) errors.push("Invalid lastPromo");
  if (isNaN(potential) || potential < 1 || potential > 10) errors.push("Invalid potential (1-10)");

  if (errors.length > 0) return { emp: null, errors };

  const jobGrade = get("jobgrade") || get("jobGrade") || "L3";
  const managerNameVal = get("managername") || get("managerName") || "";
  const deptCodeVal = get("deptcode") || get("deptCode") || "";
  const startDateVal = get("startdate") || get("startDate") || "";
  const lastReviewScoreVal = parseFloat(get("lastreviewscore") || get("lastReviewScore") || "3");
  const trainingHoursVal = parseInt(get("traininghours") || get("trainingHours") || "0");

  return {
    emp: {
      name, role, dept,
      deptCode: deptCodeVal,
      jobGrade,
      managerName: managerNameVal,
      startDate: startDateVal,
      skills: skillsRaw.split(",").map(s => s.trim()).filter(Boolean),
      tenure, score, salary,
      trend: ["improving", "rapidly improving", "stable", "declining"].includes(trend) ? trend : "stable",
      lastPromo, potential,
      lastReviewScore: isNaN(lastReviewScoreVal) ? 3 : lastReviewScoreVal,
      trainingHours: isNaN(trainingHoursVal) ? 0 : trainingHoursVal,
      risk: "Low" as const,
      flag: null,
    },
    errors: [],
  };
}

export default function BulkImportModal({ open, onClose, onImport }: Props) {
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [parsed, setParsed] = useState<{ emp: Omit<Employee, "id" | "employeeId"> | null; errors: string[]; row: number }[]>([]);
  const [fileName, setFileName] = useState("");
  const [rawError, setRawError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pasteText, setPasteText] = useState("");

  if (!open) return null;

  const processCSV = (text: string) => {
    setRawError("");
    const rows = parseCSV(text);
    if (rows.length < 2) { setRawError("File must have a header row and at least one data row."); return; }

    const headers = rows[0].map(h => h.toLowerCase().replace(/[^a-z]/g, ""));
    const missing = EXPECTED_HEADERS.filter(h => !headers.includes(h.toLowerCase().replace(/[^a-z]/g, "")));
    if (missing.length > 0) { setRawError(`Missing columns: ${missing.join(", ")}. Download the template for the correct format.`); return; }

    const results = rows.slice(1).map((row, i) => ({ ...validateRow(row, headers), row: i + 2 }));
    setParsed(results);
    setStep("preview");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => processCSV(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    setFileName("Pasted data");
    processCSV(pasteText);
  };

  const validEmployees = parsed.filter(p => p.emp !== null).map(p => p.emp!);
  const errorRows = parsed.filter(p => p.errors.length > 0);

  const handleImport = () => {
    onImport(validEmployees);
    setStep("done");
    setTimeout(() => { onClose(); setStep("upload"); setParsed([]); setFileName(""); setPasteText(""); }, 1500);
  };

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "employee_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { setStep("upload"); setParsed([]); setFileName(""); setRawError(""); setPasteText(""); };

  const inputCls = "w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" /> Bulk Import Employees
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {step === "done" && (
          <div className="flex flex-col items-center py-12">
            <CheckCircle2 className="w-16 h-16 text-risk-low mb-4" />
            <h3 className="text-xl font-bold mb-1">Import Complete!</h3>
            <p className="text-sm text-muted-foreground">{validEmployees.length} employees added successfully.</p>
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-5">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">CSV Format Required</p>
              <p>Columns: <code className="text-primary text-xs">name, role, dept, skills, tenure, score, salary, trend, lastPromo, potential</code></p>
              <p className="mt-1">Skills should be comma-separated within quotes. Risk & flags are auto-calculated.</p>
              <button onClick={downloadTemplate} className="mt-3 px-4 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download Template CSV
              </button>
            </div>

            {/* File upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">Click to upload CSV file</p>
              <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
              <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
            </div>

            {/* Paste option */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Or paste CSV data directly:</p>
              <textarea
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={`name,role,dept,skills,tenure,score,salary,trend,lastPromo,potential\nAnna Müller,Senior Engineer,Engineering,"Python, ML",4.5,8.2,82,improving,6,9.1`}
                rows={5}
                className={inputCls + " font-mono text-xs"}
              />
              <button onClick={handlePaste} disabled={!pasteText.trim()} className="px-5 py-2.5 rounded-xl text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Parse Pasted Data
              </button>
            </div>

            {rawError && (
              <div className="bg-risk-high/10 border border-risk-high/20 rounded-lg px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-risk-high shrink-0 mt-0.5" />
                <p className="text-sm text-risk-high">{rawError}</p>
              </div>
            )}
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">File: <strong className="text-foreground">{fileName}</strong></span>
              <button onClick={reset} className="text-xs text-primary hover:underline">Change file</button>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-risk-low/10 border border-risk-low/20">
                <CheckCircle2 className="w-4 h-4 text-risk-low" />
                <span className="text-sm font-medium text-risk-low">{validEmployees.length} valid</span>
              </div>
              {errorRows.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-risk-high/10 border border-risk-high/20">
                  <AlertCircle className="w-4 h-4 text-risk-high" />
                  <span className="text-sm font-medium text-risk-high">{errorRows.length} errors</span>
                </div>
              )}
            </div>

            {/* Preview table */}
            <div className="max-h-[300px] overflow-auto border border-border rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50 text-left">
                    <th className="px-3 py-2 font-medium text-muted-foreground">Row</th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">Name</th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">Role</th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">Dept</th>
                    <th className="px-3 py-2 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((p, i) => (
                    <tr key={i} className={`border-t border-border ${p.errors.length > 0 ? "bg-risk-high/5" : ""}`}>
                      <td className="px-3 py-2 text-muted-foreground">{p.row}</td>
                      <td className="px-3 py-2">{p.emp?.name || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.emp?.role || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{p.emp?.dept || "—"}</td>
                      <td className="px-3 py-2">
                        {p.errors.length > 0 ? (
                          <span className="text-xs text-risk-high">{p.errors.join(", ")}</span>
                        ) : (
                          <span className="text-xs text-risk-low font-medium">✓ Valid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={reset} className="flex-1 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                Cancel
              </button>
              <button onClick={handleImport} disabled={validEmployees.length === 0} className="flex-1 py-3 rounded-xl text-sm font-bold btn-gradient text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Import {validEmployees.length} Employee{validEmployees.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
