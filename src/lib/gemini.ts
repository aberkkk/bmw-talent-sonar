import { Employee } from "@/data/employees";

export async function deepDiveAnalysis(employeeInfo: string, allEmployees: Employee[]): Promise<string> {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

  const emp = allEmployees.find(e => employeeInfo.includes(e.name));
  if (!emp) return "Employee not found in database.";

  const strengths = emp.score >= 8.5
    ? `${emp.name} demonstrates exceptional performance (${emp.score}/10) with a trajectory that is ${emp.trend}. Core competencies in ${emp.skills.join(", ")} position them as a top-tier contributor in ${emp.dept}.`
    : emp.score >= 7.5
    ? `${emp.name} is a solid performer (${emp.score}/10) with reliable expertise in ${emp.skills.join(", ")}. Their ${emp.trend} trend in ${emp.dept} reflects consistent delivery.`
    : `${emp.name} shows baseline competency (${emp.score}/10) in ${emp.skills.join(", ")}. Performance trend is ${emp.trend}, requiring attention.`;

  const potential = emp.potential >= 9
    ? `Hidden Potential: Exceptionally high (${emp.potential}/10). ${emp.name} is a future leadership candidate with rapid skill acquisition. Consider fast-tracking into strategic roles.`
    : emp.potential >= 7.5
    ? `Hidden Potential: Above average (${emp.potential}/10). ${emp.name} shows capacity for expanded responsibilities with targeted development.`
    : `Hidden Potential: Moderate (${emp.potential}/10). Growth opportunities exist but may require structured mentoring and clear milestones.`;

  const riskSection = emp.risk === "Critical"
    ? `Risk Factors: CRITICAL — ${emp.flag || "Multiple warning indicators detected"}. Immediate intervention required. ${emp.lastPromo > 24 ? `No promotion in ${emp.lastPromo} months is a significant retention concern.` : ""}`
    : emp.risk === "High"
    ? `Risk Factors: HIGH — ${emp.flag || "Elevated flight risk detected"}. ${emp.tenure <= 2 ? "Short tenure increases vulnerability to external offers." : ""} Proactive retention strategy recommended.`
    : emp.risk === "Medium"
    ? `Risk Factors: MEDIUM — ${emp.flag || "Some indicators warrant monitoring"}. ${emp.lastPromo > 12 ? `Promotion gap of ${emp.lastPromo} months may affect engagement.` : "Regular check-ins advised."}`
    : `Risk Factors: LOW — Stable engagement indicators. ${emp.name} appears well-positioned and satisfied in current role.`;

  const action = emp.risk === "Critical" || emp.risk === "High"
    ? `Recommended Action: Schedule 1:1 within 5 business days. ${emp.flag?.includes("Underpaid") ? "Initiate compensation review immediately." : emp.flag?.includes("promotion") ? "Explore promotion or lateral move options." : "Develop a tailored retention plan."} Consider a ${emp.potential >= 9 ? "leadership development track" : "skills advancement program"}.`
    : emp.risk === "Medium"
    ? `Recommended Action: Review career development plan within 30 days. ${emp.lastPromo > 12 ? "Discuss growth opportunities and timeline expectations." : "Continue current trajectory with quarterly reviews."}`
    : `Recommended Action: Maintain current engagement. Recognize contributions in ${emp.dept} and explore stretch assignments aligned with ${emp.skills[0]} expertise.`;

  return `**1) Key Strengths**\n${strengths}\n\n**2) ${potential}**\n\n**3) ${riskSection}**\n\n**4) ${action}**\n\n⚠️ *Note: This analysis is AI-generated. All personnel decisions must be validated by HR leadership and direct managers.*`;
}

export async function advisorChat(message: string, history: { role: string; content: string }[], allEmployees: Employee[]): Promise<string> {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  if (allEmployees.length === 0) {
    return "No employee data available yet. Add employees in Talent Radar to start getting workforce intelligence insights.\n\n⚠️ *All recommendations are data-driven suggestions. Final decisions rest with human leadership.*";
  }

  const lower = message.toLowerCase();

  if (lower.includes("risk") && lower.includes("leaving") || lower.includes("flight risk") || lower.includes("attrition")) {
    const atRisk = allEmployees.filter(e => e.risk === "Critical" || e.risk === "High").sort((a, b) => b.potential - a.potential);
    if (atRisk.length === 0) return "No employees are currently flagged as high or critical flight risk.\n\n⚠️ *Final decisions should involve direct managers and HR leadership.*";
    return `Based on current workforce data, the highest flight risks are:\n\n${atRisk.map((e, i) => `${i + 1}. **${e.name}** (${e.role}) — Risk: ${e.risk} | ${e.flag || "Multiple indicators"}`).join("\n")}\n\nPriority action: ${atRisk[0]?.name} requires immediate attention due to ${atRisk[0]?.flag?.toLowerCase() || "critical risk indicators"}.\n\n⚠️ *Final decisions should involve direct managers and HR leadership.*`;
  }

  if (lower.includes("succession") || lower.includes("gap")) {
    const highPotential = allEmployees.filter(e => e.potential >= 9).sort((a, b) => b.potential - a.potential);
    const declining = allEmployees.filter(e => e.trend === "declining");
    return `**Succession Gap Analysis:**\n\n${declining.length > 0 ? `⚠️ ${declining.map(e => e.name).join(", ")} show${declining.length === 1 ? "s" : ""} declining performance — succession planning is urgent for ${declining[0].dept}.` : "No immediate succession emergencies detected."}\n\n**Ready-now successors:** ${highPotential.length > 0 ? highPotential.map(e => `${e.name} (potential: ${e.potential})`).join(", ") : "None identified yet"}.\n\n⚠️ *All succession decisions require validation by senior leadership.*`;
  }

  if (lower.includes("promot") || lower.includes("advance")) {
    const candidates = allEmployees.filter(e => e.score >= 8.5 && e.potential >= 9).sort((a, b) => b.score - a.score);
    const overdue = allEmployees.filter(e => e.lastPromo > 18 && e.score >= 7.5);
    return `**Promotion Candidates:**\n\n${candidates.length > 0 ? candidates.map(e => `✅ **${e.name}** — Score: ${e.score}, Potential: ${e.potential}, Trend: ${e.trend}`).join("\n") : "No standout candidates at this time."}\n\n${overdue.length > 0 ? `**Overdue for review:** ${overdue.map(e => `${e.name} (${e.lastPromo} months since last promotion)`).join(", ")}` : ""}\n\n⚠️ *Promotion decisions must be reviewed by department heads.*`;
  }

  if (lower.includes("compensation") || lower.includes("salary") || lower.includes("pay") || lower.includes("underpaid")) {
    const underpaid = allEmployees.filter(e => e.flag?.includes("Underpaid"));
    const avgSalary = Math.round(allEmployees.reduce((sum, e) => sum + e.salary, 0) / allEmployees.length);
    return `**Compensation Overview:**\n\nAverage salary: €${avgSalary}k\n${underpaid.length > 0 ? `\n⚠️ **Underpaid employees:** ${underpaid.map(e => `${e.name} (€${e.salary}k — ${e.flag})`).join(", ")}` : "\nNo significant compensation gaps detected."}\n\nHighest: €${Math.max(...allEmployees.map(e => e.salary))}k | Lowest: €${Math.min(...allEmployees.map(e => e.salary))}k\n\n⚠️ *Compensation adjustments require Finance and HR approval.*`;
  }

  if (lower.includes("team") || lower.includes("department") || lower.includes("overview")) {
    const depts = [...new Set(allEmployees.map(e => e.dept))];
    const summary = depts.map(d => {
      const team = allEmployees.filter(e => e.dept === d);
      const avgScore = (team.reduce((s, e) => s + e.score, 0) / team.length).toFixed(1);
      return `**${d}:** ${team.length} employees, avg score ${avgScore}, ${team.filter(e => e.risk === "High" || e.risk === "Critical").length} at risk`;
    });
    return `**Team Overview:**\n\n${summary.join("\n")}\n\nTotal workforce: ${allEmployees.length} employees across ${depts.length} departments.\n\n⚠️ *Strategic workforce decisions require cross-functional alignment.*`;
  }

  return `I can help you with workforce intelligence across ${allEmployees.length} employees. Try asking about:\n\n• **Flight risk** — Who's most likely to leave?\n• **Succession gaps** — Which teams need bench strength?\n• **Promotions** — Who's ready to advance?\n• **Compensation** — Any pay equity concerns?\n• **Team overview** — Department-level insights\n\n⚠️ *All recommendations are data-driven suggestions. Final decisions rest with human leadership.*`;
}

export async function employeeChat(employeeName: string, question: string, allEmployees: Employee[]): Promise<string> {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

  const emp = allEmployees.find(e => e.name === employeeName);
  if (!emp) return "Employee not found in the database.";

  const lower = question.toLowerCase();

  if (lower.includes("retain") || lower.includes("keep") || lower.includes("retention")) {
    const strategies: string[] = [];
    if (emp.lastPromo > 12) strategies.push(`accelerate promotion timeline (overdue by ${emp.lastPromo - 12} months)`);
    if (emp.potential >= 9) strategies.push("assign a high-visibility strategic project to signal investment in their growth");
    if (emp.salary < 80) strategies.push(`conduct market compensation review — current €${emp.salary}k may be below competitive range`);
    if (emp.tenure <= 2) strategies.push("pair with a senior mentor to deepen organizational ties");
    strategies.push("schedule quarterly career development conversations");
    return `**Retention Strategy for ${emp.name}:**\n\n${strategies.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase() + s.slice(1)}`).join("\n")}\n\n**Reasoning:** ${emp.risk === "High" || emp.risk === "Critical" ? `${emp.name} is at ${emp.risk} risk — proactive retention is critical. ${emp.flag ? `Key concern: ${emp.flag}.` : ""}` : `${emp.name} is currently ${emp.risk} risk, but preventive measures strengthen long-term loyalty.`}\n\n⚠️ *Final retention decisions should involve the direct manager and HR.*`;
  }

  if (lower.includes("promot") || lower.includes("ready") || lower.includes("advance")) {
    const readiness = emp.potential >= 9 && emp.score >= 8.5 ? "strong" : emp.potential >= 7.5 ? "moderate" : "not yet";
    const gaps: string[] = [];
    if (emp.potential < 9) gaps.push("leadership assessment score needs improvement");
    if (emp.tenure < 3) gaps.push(`only ${emp.tenure}yr tenure — consider minimum 2-3yr threshold`);
    if (emp.trend === "declining") gaps.push("declining performance trend must reverse first");
    return `**Promotion Readiness — ${emp.name}:**\n\nReadiness level: **${readiness.toUpperCase()}**\n\n• Potential: ${emp.potential}/10 ${emp.potential >= 9 ? "✅" : "⚠️"}\n• Performance: ${emp.score}/10 ${emp.score >= 8 ? "✅" : "⚠️"}\n• Trend: ${emp.trend} ${emp.trend === "improving" || emp.trend === "rapidly improving" ? "✅" : "⚠️"}\n• Last promotion: ${emp.lastPromo} months ago ${emp.lastPromo > 18 ? "⚠️ overdue" : "✅"}\n${gaps.length > 0 ? `\n**Gaps to address:**\n${gaps.map(g => `- ${g}`).join("\n")}` : "\n✅ No major gaps identified."}\n\n⚠️ *Promotion decisions require department head approval.*`;
  }

  if (lower.includes("salary") || lower.includes("pay") || lower.includes("compensation") || lower.includes("raise") || lower.includes("market")) {
    const benchmark = Math.round(emp.salary * 1.12);
    const gap = Math.round(((benchmark - emp.salary) / emp.salary) * 100);
    return `**Compensation Analysis — ${emp.name}:**\n\n• Current salary: €${emp.salary}k\n• Market benchmark: €${benchmark}k (${gap > 15 ? "⚠️ significantly below" : "aligned with"} market)\n• Gap: ${gap}%\n\n${gap > 15 ? `**Recommendation:** A salary adjustment of €${benchmark - emp.salary}k is recommended to close the market gap.` : `**Assessment:** Compensation is competitive.`}\n\n⚠️ *Compensation changes require Finance and HR approval.*`;
  }

  if (lower.includes("skill") || lower.includes("train") || lower.includes("develop") || lower.includes("learn") || lower.includes("upskill")) {
    return `**Skills & Development — ${emp.name}:**\n\n**Current skills:** ${emp.skills.join(", ")}\n**Proficiency level:** ${emp.score >= 8.5 ? "Expert" : emp.score >= 7.5 ? "Advanced" : "Intermediate"} (based on ${emp.score}/10 performance score)\n\n**Recommended development areas:**\n${emp.potential >= 9 ? "- Leadership & people management\n- Strategic thinking & executive communication" : "- Deepening technical expertise in " + emp.skills[0] + "\n- Cross-functional collaboration skills"}\n\n⚠️ *Development plans should be co-created with the employee and their manager.*`;
  }

  if (lower.includes("team") || lower.includes("fit") || lower.includes("culture") || lower.includes("peer")) {
    const deptPeers = allEmployees.filter(e => e.dept === emp.dept && e.id !== emp.id);
    return `**Team Dynamics — ${emp.name}:**\n\n**Department:** ${emp.dept} (${deptPeers.length + 1} members)\n**Tenure:** ${emp.tenure} years\n\n${deptPeers.length > 0 ? `**Peer comparison:**\n${deptPeers.map(p => `- ${p.name}: Score ${p.score}, Risk ${p.risk}`).join("\n")}` : "No other employees in this department yet."}\n\n⚠️ *Team assessments should be supplemented with 360° feedback.*`;
  }

  if (lower.includes("strength") || lower.includes("good at") || lower.includes("best")) {
    return `**Key Strengths — ${emp.name}:**\n\n1. **Technical expertise** in ${emp.skills.slice(0, 2).join(" & ")}\n2. **Performance** — ${emp.score}/10 with ${emp.trend} trajectory\n3. **${emp.tenure >= 5 ? "Institutional knowledge" : "Fresh perspective"}** — ${emp.tenure}yr tenure\n${emp.potential >= 9 ? `4. **Leadership potential** — ${emp.potential}/10` : ""}\n\n⚠️ *Strength assessments should be validated with the direct manager.*`;
  }

  if (lower.includes("risk") || lower.includes("concern") || lower.includes("worry") || lower.includes("flag")) {
    return `**Risk Assessment — ${emp.name}:**\n\n**Current risk level:** ${emp.risk}\n${emp.flag ? `**Active flag:** ⚠️ ${emp.flag}` : "**No active flags.**"}\n\n**Risk factors analyzed:**\n- Promotion recency: ${emp.lastPromo} months ${emp.lastPromo > 18 ? "⚠️" : "✅"}\n- Compensation: €${emp.salary}k ${emp.salary < 75 ? "⚠️ below typical range" : "✅"}\n- Performance trend: ${emp.trend} ${emp.trend === "declining" ? "⚠️" : "✅"}\n- Tenure: ${emp.tenure}yr ${emp.tenure <= 1 ? "⚠️ very new" : "✅"}\n\n⚠️ *Risk assessments are probabilistic — always verify with qualitative manager input.*`;
  }

  return `**${emp.name} — Quick Profile:**\n\n• **Role:** ${emp.role} in ${emp.dept}\n• **Tenure:** ${emp.tenure} years\n• **Performance:** ${emp.score}/10 (${emp.trend})\n• **Potential:** ${emp.potential}/10\n• **Risk:** ${emp.risk}${emp.flag ? ` — ${emp.flag}` : ""}\n• **Salary:** €${emp.salary}k\n• **Skills:** ${emp.skills.join(", ")}\n\nYou can ask me about:\n- **Retention** — "How do we keep them?"\n- **Promotion** — "Are they ready?"\n- **Compensation** — "Is their salary competitive?"\n- **Skills** — "What should they learn?"\n- **Risk** — "What are the concerns?"\n\n⚠️ *All recommendations are data-driven suggestions.*`;
}

interface ScenarioChanges {
  employeeId: number;
  employeeName: string;
  salaryChange?: number;
  newRole?: string;
  resetPromo?: boolean;
}

interface ScenarioResult {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
  changes?: ScenarioChanges;
}

export async function scenarioChat(message: string, allEmployees: Employee[]): Promise<{ analysis: string; scenarios: ScenarioResult[] }> {
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

  if (allEmployees.length === 0) {
    return { analysis: "No employee data available yet. Add employees in Talent Radar first.", scenarios: [] };
  }

  const lower = message.toLowerCase();

  const mentionedEmps = allEmployees.filter(e =>
    lower.includes(e.name.toLowerCase()) || lower.includes(e.name.split(" ")[0].toLowerCase())
  );
  const emp = mentionedEmps[0] || null;

  const raiseMatch = lower.match(/(\d+)\s*%?\s*raise/i) || lower.match(/raise.*?(\d+)\s*%/i) || lower.match(/(\d+)\s*percent/i);
  const raisePercent = raiseMatch ? parseInt(raiseMatch[1]) : null;

  const isPromotion = lower.includes("promot");
  const isRaise = lower.includes("raise") || lower.includes("salary") || lower.includes("pay") || lower.includes("compens") || raisePercent !== null;
  const isLeaving = lower.includes("leave") || lower.includes("quit") || lower.includes("resign") || lower.includes("depart");
  const isDoNothing = lower.includes("nothing") || lower.includes("wait") || lower.includes("ignore");

  if (!emp) {
    const highRisk = allEmployees.filter(e => e.risk === "High" || e.risk === "Critical");
    return {
      analysis: `I couldn't identify a specific employee. ${highRisk.length > 0 ? `Current high-risk employees: ${highRisk.map(e => e.name).join(", ")}.` : ""}\n\nTry mentioning an employee by name, e.g.:\n• "What if we promote ${allEmployees[0]?.name}?"\n• "Give ${allEmployees[Math.min(2, allEmployees.length - 1)]?.name} a 20% raise"`,
      scenarios: [],
    };
  }

  const marketBenchmark = Math.round(emp.salary * 1.12);
  const marketGap = Math.round(((marketBenchmark - emp.salary) / emp.salary) * 100);
  const isHighRisk = emp.risk === "High" || emp.risk === "Critical";
  const isHighPotential = emp.potential >= 9;
  const replacementCost = Math.round(emp.salary * 1.5);

  let scenarios: ScenarioResult[] = [];
  let analysis = "";

  if (isPromotion) {
    const promoCost = Math.round(emp.salary * 0.2);
    const nextRole = "Senior " + emp.role;
    scenarios = [
      {
        title: "Promote Now",
        probability: isHighPotential ? 92 : emp.score >= 7.5 ? 75 : 55,
        cost: `€${promoCost}k/yr increase`,
        risk: emp.trend === "declining" ? "Medium" : "Low",
        description: `Promoting ${emp.name} signals career investment. ${isHighPotential ? "Their 9+ potential strongly supports this." : "Score of " + emp.score + " suggests they can grow into the role."}`,
        reasoning: `Probability based on potential (${emp.potential}/10), performance (${emp.score}/10), trend (${emp.trend}). Cost ~20% salary increase (industry standard).`,
        changes: { employeeId: emp.id, employeeName: emp.name, salaryChange: promoCost, newRole: nextRole, resetPromo: true },
      },
      {
        title: "Promote in 6 Months",
        probability: isHighRisk ? 45 : 65,
        cost: `€${Math.round(promoCost * 0.5)}k interim + €${promoCost}k later`,
        risk: isHighRisk ? "High" : "Medium",
        description: `Delayed promotion with stretch assignments. ${isHighRisk ? `Risk: ${emp.name} may not wait.` : "Allows time to build a stronger case."}`,
        reasoning: `6-month delay drops probability because ${isHighRisk ? `risk is ${emp.risk}` : "market conditions may shift"}.`,
        changes: { employeeId: emp.id, employeeName: emp.name, salaryChange: Math.round(promoCost * 0.5) },
      },
      {
        title: "Lateral Move Instead",
        probability: emp.trend === "improving" ? 70 : 50,
        cost: `€${Math.round(promoCost * 0.3)}k`,
        risk: "Medium",
        description: `Cross-functional role move. Broadens experience without full promotion commitment.`,
        reasoning: `Lateral moves have ~${emp.trend === "improving" ? "70" : "50"}% success rate based on trend and skill breadth (${emp.skills.length} skills).`,
        changes: { employeeId: emp.id, employeeName: emp.name, salaryChange: Math.round(promoCost * 0.3), resetPromo: true },
      },
    ];
    analysis = `**Promotion Analysis for ${emp.name}** (${emp.role})\n\nKey factors: potential ${emp.potential}/10, score ${emp.score}/10, trend ${emp.trend}, last promoted ${emp.lastPromo} months ago.`;

  } else if (isRaise) {
    const pct = raisePercent || 15;
    const raiseCost = Math.round(emp.salary * (pct / 100));
    const newSalary = emp.salary + raiseCost;
    const closesGap = newSalary >= marketBenchmark;

    scenarios = [
      {
        title: `${pct}% Raise`,
        probability: closesGap ? 85 : 60,
        cost: `€${raiseCost}k/yr`,
        risk: closesGap ? "Low" : "Medium",
        description: `A ${pct}% raise brings ${emp.name} from €${emp.salary}k to €${newSalary}k. ${closesGap ? "Meets market benchmark." : `Still below benchmark (€${marketBenchmark}k).`}`,
        reasoning: `Market benchmark: €${marketBenchmark}k (${marketGap}% gap). ${closesGap ? "Gap closed." : `Only closes ${Math.round((pct / marketGap) * 100)}% of gap.`}`,
        changes: { employeeId: emp.id, employeeName: emp.name, salaryChange: raiseCost },
      },
      {
        title: `Market-Rate (${marketGap}%)`,
        probability: 90,
        cost: `€${marketBenchmark - emp.salary}k/yr`,
        risk: "Low",
        description: `Full market alignment to €${marketBenchmark}k. Maximum retention impact.`,
        reasoning: `Full alignment has 90% retention probability. Cost vs replacement (€${replacementCost}k) is economically sound.`,
        changes: { employeeId: emp.id, employeeName: emp.name, salaryChange: marketBenchmark - emp.salary },
      },
      {
        title: "Non-Monetary Package",
        probability: emp.tenure <= 2 ? 55 : 65,
        cost: "€3-5k",
        risk: isHighRisk ? "High" : "Medium",
        description: `Flexible hours, remote options, training budget instead of raise. ${isHighRisk ? "⚠️ May be insufficient given risk level." : ""}`,
        reasoning: `Non-monetary benefits have ${emp.tenure <= 2 ? "moderate" : "variable"} effectiveness based on tenure and trend.`,
      },
    ];
    analysis = `**Compensation Scenario for ${emp.name}** (€${emp.salary}k → ${pct}% raise)\n\nMarket benchmark: €${marketBenchmark}k (${marketGap}% gap).`;

  } else if (isLeaving) {
    scenarios = [
      {
        title: "Immediate Retention",
        probability: isHighRisk ? 60 : 80,
        cost: `€${Math.round(emp.salary * 0.2)}k`,
        risk: isHighRisk ? "Medium" : "Low",
        description: `Emergency retention: compensation review + career discussion within 48 hours.`,
        reasoning: `Retention success: ${isHighRisk ? "60% (elevated risk)" : "80% (manageable risk)"}. Early intervention is 3x more effective.`,
      },
      {
        title: "Accept & Plan Succession",
        probability: 100,
        cost: `€${replacementCost}k`,
        risk: "High",
        description: `If ${emp.name} leaves: recruitment + onboarding + productivity loss = ~€${replacementCost}k.`,
        reasoning: `Replacement at 1.5x salary (industry standard for ${emp.role}-level).`,
      },
      {
        title: "Counter-Offer",
        probability: isHighPotential ? 70 : 50,
        cost: `€${Math.round(emp.salary * 0.25)}k`,
        risk: "Medium",
        description: `Competitive counter-offer: market salary + enhanced scope.`,
        reasoning: `Counter-offer success: ${isHighPotential ? "70% for high-potential" : "50% average"}.`,
      },
    ];
    analysis = `**Departure Risk — ${emp.name}** (${emp.role})\n\nRisk: **${emp.risk}**. Replacement cost: ~€${replacementCost}k.`;

  } else if (isDoNothing) {
    scenarios = [
      {
        title: "Status Quo (3 months)",
        probability: isHighRisk ? 30 : 70,
        cost: "€0 direct",
        risk: isHighRisk ? "High" : "Low",
        description: `No intervention. ${isHighRisk ? `${emp.risk} risk suggests 25-60% departure chance.` : "Low immediate risk."}`,
        reasoning: `Based on risk (${emp.risk}), trend (${emp.trend}), promotion gap (${emp.lastPromo} months).`,
      },
      {
        title: "Status Quo (12 months)",
        probability: isHighRisk ? 15 : 50,
        cost: `€0-${replacementCost}k`,
        risk: isHighRisk ? "Critical" : "Medium",
        description: `Extended inaction. ${isHighRisk ? "Near-certain departure risk." : "Engagement likely declines."}`,
        reasoning: `12-month projection: ${isHighRisk ? "85% departure probability" : "50% disengagement chance"}.`,
      },
      {
        title: "Check-ins Only",
        probability: isHighRisk ? 50 : 75,
        cost: "€0-1k",
        risk: isHighRisk ? "Medium" : "Low",
        description: `Monthly 1:1s without structural changes. Low cost, moderate impact.`,
        reasoning: `Check-ins improve retention by 15-20% (Gallup data).`,
      },
    ];
    analysis = `**Inaction Analysis — ${emp.name}**\n\nRisk ${emp.risk}, Trend ${emp.trend}, ${emp.lastPromo} months since promotion.`;

  } else {
    const actionCost = Math.round(emp.salary * 0.15);
    scenarios = [
      {
        title: "Proactive Approach",
        probability: isHighPotential ? 85 : 70,
        cost: `€${actionCost}k`,
        risk: "Low",
        description: `Immediate action: address ${emp.flag || "development needs"} with a tailored plan.`,
        reasoning: `Based on potential (${emp.potential}/10) and trend (${emp.trend}). ${isHighPotential ? "85%+" : "~70%"} success rate.`,
      },
      {
        title: "Delayed Action",
        probability: isHighRisk ? 40 : 55,
        cost: `€${actionCost * 2}k potential`,
        risk: isHighRisk ? "High" : "Medium",
        description: `Wait 6 months. ${isHighRisk ? "Significant departure risk." : "May lose momentum."}`,
        reasoning: `Delay reduces success by ${isHighRisk ? "45-50%" : "15-20%"} based on risk level.`,
      },
      {
        title: "Creative Alternative",
        probability: 65,
        cost: `€${Math.round(actionCost * 0.4)}k`,
        risk: "Medium",
        description: `Hybrid: ${isHighPotential ? "mentorship + stretch project" : "cross-training + rotation"}.`,
        reasoning: `~65% success rate. Lower cost but depends on responsiveness.`,
      },
    ];
    analysis = `**Scenario Analysis for ${emp.name}** (${emp.role})\n\nPerformance ${emp.score}/10, potential ${emp.potential}/10, risk ${emp.risk}, salary €${emp.salary}k.`;
  }

  return { analysis, scenarios };
}
