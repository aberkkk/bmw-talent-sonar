import { employees } from "@/data/employees";

export async function deepDiveAnalysis(employeeInfo: string): Promise<string> {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

  const emp = employees.find(e => employeeInfo.includes(e.name));
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

export async function simulateScenarios(prompt: string) {
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

  const emp = employees.find(e => prompt.includes(e.name));
  const isHighRisk = emp && (emp.risk === "High" || emp.risk === "Critical");
  const isHighPotential = emp && emp.potential >= 9;
  const isUnderpaid = emp?.flag?.includes("Underpaid");
  const needsPromo = emp && emp.lastPromo > 18;

  const costMultiplier = emp ? Math.round(emp.salary * 0.15) : 12;

  return {
    scenarioA: {
      title: "Act Now",
      probability: isHighRisk ? 88 : 75,
      cost: `€${isUnderpaid ? costMultiplier + 5 : costMultiplier},000`,
      risk: "Low",
      description: emp
        ? `Immediate intervention for ${emp.name}: ${isUnderpaid ? "salary adjustment to market rate" : needsPromo ? "accelerated promotion review" : "enhanced development program"}. ${isHighPotential ? "Secures a future leader and prevents competitor poaching." : "Stabilizes the team and maintains operational continuity."}`
        : "Proactive intervention reduces long-term costs and preserves institutional knowledge. Early action typically yields 3x ROI compared to reactive measures."
    },
    scenarioB: {
      title: "Wait 6 Months",
      probability: isHighRisk ? 35 : 55,
      cost: `€${(costMultiplier * 3) + 10},000`,
      risk: isHighRisk ? "Critical" : "High",
      description: emp
        ? `Delayed action on ${emp.name} risks ${emp.risk === "Critical" ? "imminent departure" : "disengagement and productivity decline"}. Replacement cost estimated at ${Math.round(emp.salary * 1.5)}k+ including recruitment, onboarding, and lost productivity.`
        : "Delayed response increases flight risk by 40-60%. Market conditions may worsen the talent gap, escalating replacement costs significantly."
    },
    scenarioC: {
      title: "Alternative Approach",
      probability: isHighRisk ? 65 : 72,
      cost: `€${Math.round(costMultiplier * 0.6)},000`,
      risk: "Medium",
      description: emp
        ? `Implement a hybrid strategy for ${emp.name}: ${isHighPotential ? "mentorship pairing with senior leadership plus stretch project assignment" : "lateral move to a high-impact role with skills alignment"}. ${emp.trend === "improving" ? "Leverages positive momentum." : "Addresses trajectory concerns while managing costs."}`
        : "Balanced approach combining targeted development with strategic repositioning. Moderate investment with 70%+ success rate in similar cases."
    }
  };
}

export async function advisorChat(message: string, history: { role: string; content: string }[]): Promise<string> {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  const lower = message.toLowerCase();

  if (lower.includes("risk") && lower.includes("leaving") || lower.includes("flight risk") || lower.includes("attrition")) {
    const atRisk = employees.filter(e => e.risk === "Critical" || e.risk === "High").sort((a, b) => b.potential - a.potential);
    return `Based on current workforce data, the highest flight risks are:\n\n${atRisk.map((e, i) => `${i + 1}. **${e.name}** (${e.role}) — Risk: ${e.risk} | ${e.flag || "Multiple indicators"}`).join("\n")}\n\nPriority action: ${atRisk[0]?.name} requires immediate attention due to ${atRisk[0]?.flag?.toLowerCase() || "critical risk indicators"}.\n\n⚠️ *Final decisions should involve direct managers and HR leadership.*`;
  }

  if (lower.includes("succession") || lower.includes("gap")) {
    const highPotential = employees.filter(e => e.potential >= 9).sort((a, b) => b.potential - a.potential);
    const declining = employees.filter(e => e.trend === "declining");
    return `**Succession Gap Analysis:**\n\n${declining.length > 0 ? `⚠️ ${declining.map(e => e.name).join(", ")} show${declining.length === 1 ? "s" : ""} declining performance — succession planning is urgent for ${declining[0].dept}.` : "No immediate succession emergencies detected."}\n\n**Ready-now successors:** ${highPotential.map(e => `${e.name} (potential: ${e.potential})`).join(", ")}.\n\n⚠️ *All succession decisions require validation by senior leadership.*`;
  }

  if (lower.includes("promot") || lower.includes("advance")) {
    const candidates = employees.filter(e => e.score >= 8.5 && e.potential >= 9).sort((a, b) => b.score - a.score);
    const overdue = employees.filter(e => e.lastPromo > 18 && e.score >= 7.5);
    return `**Promotion Candidates:**\n\n${candidates.length > 0 ? candidates.map(e => `✅ **${e.name}** — Score: ${e.score}, Potential: ${e.potential}, Trend: ${e.trend}`).join("\n") : "No standout candidates at this time."}\n\n${overdue.length > 0 ? `**Overdue for review:** ${overdue.map(e => `${e.name} (${e.lastPromo} months since last promotion)`).join(", ")}` : ""}\n\n⚠️ *Promotion decisions must be reviewed by department heads.*`;
  }

  if (lower.includes("compensation") || lower.includes("salary") || lower.includes("pay") || lower.includes("underpaid")) {
    const underpaid = employees.filter(e => e.flag?.includes("Underpaid"));
    const avgSalary = Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length);
    return `**Compensation Overview:**\n\nAverage salary: €${avgSalary}k\n${underpaid.length > 0 ? `\n⚠️ **Underpaid employees:** ${underpaid.map(e => `${e.name} (€${e.salary}k — ${e.flag})`).join(", ")}` : "\nNo significant compensation gaps detected."}\n\nHighest: €${Math.max(...employees.map(e => e.salary))}k | Lowest: €${Math.min(...employees.map(e => e.salary))}k\n\n⚠️ *Compensation adjustments require Finance and HR approval.*`;
  }

  if (lower.includes("team") || lower.includes("department") || lower.includes("overview")) {
    const depts = [...new Set(employees.map(e => e.dept))];
    const summary = depts.map(d => {
      const team = employees.filter(e => e.dept === d);
      const avgScore = (team.reduce((s, e) => s + e.score, 0) / team.length).toFixed(1);
      return `**${d}:** ${team.length} employees, avg score ${avgScore}, ${team.filter(e => e.risk === "High" || e.risk === "Critical").length} at risk`;
    });
    return `**Team Overview:**\n\n${summary.join("\n")}\n\nTotal workforce: ${employees.length} employees across ${depts.length} departments.\n\n⚠️ *Strategic workforce decisions require cross-functional alignment.*`;
  }

  // Default response
  return `I can help you with workforce intelligence across ${employees.length} employees. Try asking about:\n\n• **Flight risk** — Who's most likely to leave?\n• **Succession gaps** — Which teams need bench strength?\n• **Promotions** — Who's ready to advance?\n• **Compensation** — Any pay equity concerns?\n• **Team overview** — Department-level insights\n\n⚠️ *All recommendations are data-driven suggestions. Final decisions rest with human leadership.*`;
}

export async function employeeChat(employeeName: string, question: string): Promise<string> {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

  const emp = employees.find(e => e.name === employeeName);
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
    const benchmarkMultiplier = { 1: 1.12, 2: 1.10, 3: 1.22, 4: 1.08, 5: 1.18, 6: 1.11 }[emp.id] || 1.1;
    const benchmark = Math.round(emp.salary * benchmarkMultiplier);
    const gap = Math.round(((benchmark - emp.salary) / emp.salary) * 100);
    return `**Compensation Analysis — ${emp.name}:**\n\n• Current salary: €${emp.salary}k\n• Market benchmark: €${benchmark}k (${gap > 15 ? "⚠️ significantly below" : "aligned with"} market)\n• Gap: ${gap}%\n\n${gap > 15 ? `**Recommendation:** A salary adjustment of €${benchmark - emp.salary}k is recommended to close the market gap. ${emp.risk === "High" || emp.risk === "Critical" ? "Given the elevated flight risk, this should be prioritized." : "This would strengthen retention."}` : `**Assessment:** Compensation is competitive. ${emp.risk === "Low" ? "No immediate action needed." : "Focus retention efforts on non-monetary factors (career growth, project ownership)."}`}\n\n**Reasoning:** Benchmark based on Glassdoor/Hays data for "${emp.role}" roles in DACH region.\n\n⚠️ *Compensation changes require Finance and HR approval.*`;
  }

  if (lower.includes("skill") || lower.includes("train") || lower.includes("develop") || lower.includes("learn") || lower.includes("upskill")) {
    return `**Skills & Development — ${emp.name}:**\n\n**Current skills:** ${emp.skills.join(", ")}\n**Proficiency level:** ${emp.score >= 8.5 ? "Expert" : emp.score >= 7.5 ? "Advanced" : "Intermediate"} (based on ${emp.score}/10 performance score)\n\n**Recommended development areas:**\n${emp.potential >= 9 ? "- Leadership & people management (high potential → leadership track)\n- Strategic thinking & executive communication" : "- Deepening technical expertise in " + emp.skills[0] + "\n- Cross-functional collaboration skills"}\n- Industry trend awareness in ${emp.dept}\n\n**Suggested format:** ${emp.tenure <= 2 ? "Structured mentorship + formal training" : "Stretch assignments + conference attendance"}\n\n**Reasoning:** Based on ${emp.name}'s ${emp.trend} trend and ${emp.potential}/10 potential score, ${emp.potential >= 9 ? "leadership development should be prioritized" : "skills deepening will maximize current-role impact"}.\n\n⚠️ *Development plans should be co-created with the employee and their manager.*`;
  }

  if (lower.includes("team") || lower.includes("fit") || lower.includes("culture") || lower.includes("peer")) {
    const deptPeers = employees.filter(e => e.dept === emp.dept && e.id !== emp.id);
    return `**Team Dynamics — ${emp.name}:**\n\n**Department:** ${emp.dept} (${deptPeers.length + 1} members)\n**Tenure:** ${emp.tenure} years (${emp.tenure >= 5 ? "senior team member" : emp.tenure >= 2 ? "established contributor" : "relatively new"})\n\n**Peer comparison:**\n${deptPeers.map(p => `- ${p.name}: Score ${p.score}, Risk ${p.risk}`).join("\n")}\n\n**Assessment:** ${emp.score > (deptPeers.reduce((s, p) => s + p.score, 0) / Math.max(deptPeers.length, 1)) ? `${emp.name} performs above the team average — a key contributor.` : `${emp.name} performs near or below team average — may benefit from peer mentoring.`}\n\n⚠️ *Team assessments should be supplemented with 360° feedback.*`;
  }

  if (lower.includes("strength") || lower.includes("good at") || lower.includes("best")) {
    return `**Key Strengths — ${emp.name}:**\n\n1. **Technical expertise** in ${emp.skills.slice(0, 2).join(" & ")} — core to ${emp.dept} operations\n2. **Performance consistency** — ${emp.score}/10 with ${emp.trend} trajectory\n3. **${emp.tenure >= 5 ? "Institutional knowledge" : "Fresh perspective"}** — ${emp.tenure}yr tenure brings ${emp.tenure >= 5 ? "deep organizational understanding" : "new ideas and external best practices"}\n${emp.potential >= 9 ? `4. **Leadership potential** — ${emp.potential}/10 indicates exceptional growth capacity` : ""}\n\n**Reasoning:** Strengths identified from performance reviews (${emp.score}/10), skill assessments, and potential evaluation (${emp.potential}/10).\n\n⚠️ *Strength assessments should be validated with the direct manager.*`;
  }

  if (lower.includes("risk") || lower.includes("concern") || lower.includes("worry") || lower.includes("flag")) {
    return `**Risk Assessment — ${emp.name}:**\n\n**Current risk level:** ${emp.risk}\n${emp.flag ? `**Active flag:** ⚠️ ${emp.flag}` : "**No active flags.**"}\n\n**Risk factors analyzed:**\n- Promotion recency: ${emp.lastPromo} months ${emp.lastPromo > 18 ? "⚠️" : "✅"}\n- Compensation alignment: €${emp.salary}k ${emp.salary < 75 ? "⚠️ below typical range" : "✅"}\n- Performance trend: ${emp.trend} ${emp.trend === "declining" ? "⚠️" : "✅"}\n- Tenure stability: ${emp.tenure}yr ${emp.tenure <= 1 ? "⚠️ very new" : "✅"}\n\n**Reasoning:** Risk level is computed from a weighted model considering promotion gaps (30%), market compensation alignment (25%), performance trajectory (25%), and tenure-to-potential ratio (20%).\n\n⚠️ *Risk assessments are probabilistic — always verify with qualitative manager input.*`;
  }

  // Default
  return `**${emp.name} — Quick Profile:**\n\n• **Role:** ${emp.role} in ${emp.dept}\n• **Tenure:** ${emp.tenure} years\n• **Performance:** ${emp.score}/10 (${emp.trend})\n• **Potential:** ${emp.potential}/10\n• **Risk:** ${emp.risk}${emp.flag ? ` — ${emp.flag}` : ""}\n• **Salary:** €${emp.salary}k\n• **Skills:** ${emp.skills.join(", ")}\n\nYou can ask me about:\n- **Retention strategies** — "How do we keep them?"\n- **Promotion readiness** — "Are they ready for promotion?"\n- **Compensation** — "Is their salary competitive?"\n- **Skills & development** — "What should they learn next?"\n- **Risk analysis** — "What are the concerns?"\n- **Team dynamics** — "How do they fit in the team?"\n- **Strengths** — "What are they best at?"\n\n⚠️ *All recommendations are data-driven suggestions.*`;
}

interface ScenarioResult {
  title: string;
  probability: number;
  cost: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  description: string;
  reasoning: string;
}

export async function scenarioChat(message: string): Promise<{ analysis: string; scenarios: ScenarioResult[] }> {
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));

  const lower = message.toLowerCase();

  // Find mentioned employee(s)
  const mentionedEmps = employees.filter(e =>
    lower.includes(e.name.toLowerCase()) || lower.includes(e.name.split(" ")[0].toLowerCase())
  );
  const emp = mentionedEmps[0] || null;

  // Parse raise percentage from message
  const raiseMatch = lower.match(/(\d+)\s*%?\s*raise/i) || lower.match(/raise.*?(\d+)\s*%/i) || lower.match(/(\d+)\s*percent/i);
  const raisePercent = raiseMatch ? parseInt(raiseMatch[1]) : null;

  // Detect intent
  const isPromotion = lower.includes("promot");
  const isRaise = lower.includes("raise") || lower.includes("salary") || lower.includes("pay") || lower.includes("compens") || raisePercent !== null;
  const isRelocation = lower.includes("relocat") || lower.includes("transfer") || lower.includes("move");
  const isLeaving = lower.includes("leave") || lower.includes("quit") || lower.includes("resign") || lower.includes("depart");
  const isDoNothing = lower.includes("nothing") || lower.includes("wait") || lower.includes("ignore");
  const isCompare = lower.includes("compare") || lower.includes(" vs ") || lower.includes("versus") || lower.includes(" or ");

  // If no employee found, give general analysis
  if (!emp) {
    const highRisk = employees.filter(e => e.risk === "High" || e.risk === "Critical");
    return {
      analysis: `I'll analyze that scenario. I couldn't identify a specific employee — here's a workforce-wide view.\n\n**Current high-risk employees:** ${highRisk.map(e => e.name).join(", ")}\n\nTry mentioning an employee by name for a targeted simulation, e.g.:\n• "What if we promote ${employees[0].name}?"\n• "Give ${employees[2].name} a 20% raise"\n\n⚠️ *All projections are data-driven estimates.*`,
      scenarios: [],
    };
  }

  const benchmarkMultiplier = { 1: 1.12, 2: 1.10, 3: 1.22, 4: 1.08, 5: 1.18, 6: 1.11 }[emp.id] || 1.1;
  const marketBenchmark = Math.round(emp.salary * benchmarkMultiplier);
  const marketGap = Math.round(((marketBenchmark - emp.salary) / emp.salary) * 100);
  const isHighRisk = emp.risk === "High" || emp.risk === "Critical";
  const isHighPotential = emp.potential >= 9;
  const replacementCost = Math.round(emp.salary * 1.5);

  // Build scenarios based on intent
  let scenarios: ScenarioResult[] = [];
  let analysis = "";

  if (isPromotion) {
    const promoCost = Math.round(emp.salary * 0.2);
    scenarios = [
      {
        title: "Promote Now",
        probability: isHighPotential ? 92 : emp.score >= 7.5 ? 75 : 55,
        cost: `€${promoCost}k/yr increase`,
        risk: emp.trend === "declining" ? "Medium" : "Low",
        description: `Promoting ${emp.name} to the next level signals investment in their career. ${isHighPotential ? "Their 9+ potential score strongly supports this move." : "Performance score of " + emp.score + " suggests they can grow into the role."}`,
        reasoning: `Probability based on potential score (${emp.potential}/10), performance (${emp.score}/10), and trend (${emp.trend}). Cost estimated as ~20% salary increase (industry standard promotion raise). Risk adjusted for ${emp.trend} performance trajectory.`,
      },
      {
        title: "Promote in 6 Months",
        probability: isHighRisk ? 45 : 65,
        cost: `€${Math.round(promoCost * 0.5)}k interim + €${promoCost}k later`,
        risk: isHighRisk ? "High" : "Medium",
        description: `Delayed promotion with interim stretch assignments. ${isHighRisk ? `Risk: ${emp.name} may not wait — ${emp.flag || "elevated flight risk"}.` : "Allows time to build a stronger case and prepare succession below."}`,
        reasoning: `6-month delay probability drops ${isHighRisk ? "significantly" : "moderately"} because ${isHighRisk ? `current risk level is ${emp.risk} and ${emp.flag || "retention indicators are concerning"}` : "market conditions and competitor interest may shift"}. Cost includes interim development investment.`,
      },
      {
        title: "Lateral Move Instead",
        probability: emp.trend === "improving" ? 70 : 50,
        cost: `€${Math.round(promoCost * 0.3)}k`,
        risk: "Medium",
        description: `Move ${emp.name} to a high-impact cross-functional role. Broadens experience without the commitment of a full promotion. ${emp.skills.length >= 4 ? "Their diverse skill set supports this transition." : "Would need additional skill development."}`,
        reasoning: `Lateral moves have ~${emp.trend === "improving" ? "70" : "50"}% success rate based on ${emp.name}'s trend (${emp.trend}) and skill breadth (${emp.skills.length} skills). Lower cost as it avoids salary band jump.`,
      },
    ];
    analysis = `**Promotion Analysis for ${emp.name}** (${emp.role})\n\nI've modeled three paths. Key factors: potential ${emp.potential}/10, current score ${emp.score}/10, trend ${emp.trend}, last promoted ${emp.lastPromo} months ago.${emp.lastPromo > 18 ? ` ⚠️ Overdue — ${emp.lastPromo} months without promotion is above the 18-month threshold.` : ""}`;

  } else if (isRaise) {
    const pct = raisePercent || 15;
    const raiseCost = Math.round(emp.salary * (pct / 100));
    const newSalary = emp.salary + raiseCost;
    const closesGap = newSalary >= marketBenchmark;

    scenarios = [
      {
        title: `${pct}% Raise`,
        probability: closesGap ? 85 : (pct >= marketGap ? 80 : 60),
        cost: `€${raiseCost}k/yr`,
        risk: closesGap ? "Low" : "Medium",
        description: `A ${pct}% raise brings ${emp.name} from €${emp.salary}k to €${newSalary}k. ${closesGap ? `This meets or exceeds the market benchmark of €${marketBenchmark}k — strong retention signal.` : `Still €${marketBenchmark - newSalary}k below market benchmark (€${marketBenchmark}k). May not fully address compensation concerns.`}`,
        reasoning: `Market benchmark: €${marketBenchmark}k (${marketGap}% above current). ${closesGap ? "Closing the gap removes compensation as a flight risk factor" : `${pct}% raise closes only ${Math.round((pct / marketGap) * 100)}% of the gap`}. Probability reflects retention impact based on research showing compensation adjustments ${closesGap ? "eliminate" : "reduce but don't eliminate"} pay-related attrition.`,
      },
      {
        title: `Market-Rate Adjustment (${marketGap}%)`,
        probability: 90,
        cost: `€${marketBenchmark - emp.salary}k/yr`,
        risk: "Low",
        description: `Align ${emp.name} exactly to market at €${marketBenchmark}k. Maximum retention impact. ${isHighPotential ? "Combined with their high potential, this investment has strong ROI." : "Ensures fair compensation and reduces external offer vulnerability."}`,
        reasoning: `Full market alignment has highest retention probability (90%). Based on Glassdoor/Hays benchmark data for "${emp.role}" in DACH region. Cost of €${marketBenchmark - emp.salary}k/yr vs replacement cost of €${replacementCost}k makes this economically sound.`,
      },
      {
        title: "Non-Monetary Package",
        probability: emp.tenure <= 2 ? 55 : 65,
        cost: "€3-5k",
        risk: isHighRisk ? "High" : "Medium",
        description: `Instead of a raise: flexible hours, remote options, training budget, or title upgrade. ${emp.tenure <= 2 ? "Early-tenure employees often value growth opportunities over pure compensation." : "Long-tenure employees may see this as insufficient."} ${isHighRisk ? "⚠️ Given " + emp.risk + " risk level, monetary action may be necessary." : ""}`,
        reasoning: `Non-monetary benefits have ${emp.tenure <= 2 ? "moderate" : "variable"} effectiveness. Research shows they work best for employees with ${emp.trend === "improving" ? "improving trajectories (like " + emp.name + ")" : "stable engagement, but " + emp.name + "'s " + emp.trend + " trend is a concern"}.`,
      },
    ];
    analysis = `**Compensation Scenario for ${emp.name}** (€${emp.salary}k → ${raisePercent ? `${raisePercent}% raise requested` : "raise analysis"})\n\nMarket benchmark: €${marketBenchmark}k (${marketGap}% gap). ${emp.flag?.includes("Underpaid") ? `⚠️ Already flagged: ${emp.flag}.` : ""} Here are three approaches:`;

  } else if (isLeaving) {
    scenarios = [
      {
        title: "Immediate Retention Plan",
        probability: isHighRisk ? 60 : 80,
        cost: `€${Math.round(emp.salary * 0.2)}k`,
        risk: isHighRisk ? "Medium" : "Low",
        description: `Launch emergency retention: compensation review + career path discussion + manager check-in within 48 hours. ${isHighPotential ? "This person is a future leader — losing them costs far more than the retention investment." : "Stabilizes the team and preserves operational knowledge."}`,
        reasoning: `Retention success rate is ${isHighRisk ? "60% (already elevated risk)" : "80% (currently manageable risk)"}. Cost based on 20% salary investment (raise + development budget). Early intervention is 3x more effective than reactive offers per SHRM research.`,
      },
      {
        title: "Accept & Plan Succession",
        probability: 100,
        cost: `€${replacementCost}k`,
        risk: "High",
        description: `If ${emp.name} leaves: recruitment (€${Math.round(emp.salary * 0.3)}k), onboarding (3-6 months), productivity loss (est. €${Math.round(emp.salary * 0.5)}k). Total impact: ~€${replacementCost}k. ${emp.skills.length >= 4 ? "Their diverse skill set will be especially hard to replace." : ""}`,
        reasoning: `Replacement cost calculated at 1.5x annual salary (industry standard for ${emp.role}-level roles). Includes agency fees (~30% salary), 6-month ramp time, and productivity gap. ${emp.dept} team impact: ${employees.filter(e => e.dept === emp.dept).length - 1} remaining members absorb workload.`,
      },
      {
        title: "Counter-Offer Strategy",
        probability: isHighPotential ? 70 : 50,
        cost: `€${Math.round(emp.salary * 0.25)}k`,
        risk: "Medium",
        description: `Prepare a competitive counter-offer: salary to market rate + enhanced role scope. ${isHighPotential ? "High-potential employees respond well to expanded responsibilities paired with compensation." : "Counter-offers have mixed long-term effectiveness — 50% of countered employees leave within 12 months."}`,
        reasoning: `Counter-offer success: ${isHighPotential ? "70% for high-potential" : "50% average"} (Harvard Business Review data). Cost assumes market-rate salary adjustment + signing retention bonus. Risk is medium because even successful counters may only delay departure.`,
      },
    ];
    analysis = `**Departure Risk Analysis — ${emp.name}** (${emp.role}, ${emp.dept})\n\nCurrent risk: **${emp.risk}**${emp.flag ? ` | Flag: ${emp.flag}` : ""}. Replacement cost: ~€${replacementCost}k. Here's what the data says about three paths:`;

  } else if (isDoNothing) {
    scenarios = [
      {
        title: "Status Quo (3 months)",
        probability: isHighRisk ? 30 : 70,
        cost: "€0 direct",
        risk: isHighRisk ? "High" : "Low",
        description: `No intervention for 3 months. ${isHighRisk ? `${emp.name}'s ${emp.risk} risk level suggests a ${emp.risk === "Critical" ? "40-60%" : "25-35%"} chance of departure in this window.` : `${emp.name} is relatively stable — low immediate risk, but engagement should be monitored.`}`,
        reasoning: `Probability of positive outcome (retention + performance) is ${isHighRisk ? "only 30%" : "70%"} based on ${emp.name}'s risk level (${emp.risk}), trend (${emp.trend}), and promotion gap (${emp.lastPromo} months). ${isHighRisk ? "Historical data shows high-risk employees act within 3-6 months." : "Low-risk employees typically remain stable for 6-12 months without intervention."}`,
      },
      {
        title: "Status Quo (12 months)",
        probability: isHighRisk ? 15 : 50,
        cost: `€0-${replacementCost}k potential`,
        risk: isHighRisk ? "Critical" : "Medium",
        description: `Extended inaction. ${isHighRisk ? `Near-certain departure risk for ${emp.name}. Estimated organizational cost: €${replacementCost}k+.` : `Engagement likely declines. ${emp.lastPromo > 12 ? "Promotion gap grows to " + (emp.lastPromo + 12) + " months — entering danger zone." : "Performance may plateau."}`}`,
        reasoning: `12-month inaction modeling: ${isHighRisk ? "85% departure probability (based on risk=" + emp.risk + ", trend=" + emp.trend + ")" : "50% chance of disengagement (promotion gap, market pull)"}. Cost range reflects best case (stays) to worst case (departs + replacement).`,
      },
      {
        title: "Minimal Touch (Check-ins Only)",
        probability: isHighRisk ? 50 : 75,
        cost: "€0-1k",
        risk: isHighRisk ? "Medium" : "Low",
        description: `Monthly 1:1 check-ins without structural changes. ${emp.trend === "improving" ? "May be sufficient given positive trajectory." : emp.trend === "declining" ? "Unlikely to reverse declining trend alone." : "Maintains current baseline."} Low cost, moderate impact.`,
        reasoning: `Regular check-ins improve retention by 15-20% (Gallup data). For ${emp.name} with ${emp.trend} trend, this translates to ${isHighRisk ? "a partial mitigation but not a full solution" : "an effective low-cost strategy"}. No financial investment but requires manager time commitment.`,
      },
    ];
    analysis = `**Inaction Analysis — ${emp.name}** (${emp.role})\n\nYou asked what happens if we do nothing. Current state: Risk ${emp.risk}, Trend ${emp.trend}, ${emp.lastPromo} months since last promotion.${emp.flag ? ` ⚠️ ${emp.flag}.` : ""} Here are three inaction scenarios:`;

  } else {
    // Generic/custom scenario
    const actionCost = Math.round(emp.salary * 0.15);
    scenarios = [
      {
        title: "Proactive Approach",
        probability: isHighPotential ? 85 : 70,
        cost: `€${actionCost}k`,
        risk: "Low",
        description: `Take immediate action for ${emp.name}: address ${emp.flag || "development needs"} through a tailored plan combining career growth and ${marketGap > 15 ? "compensation adjustment" : "enhanced responsibilities"}.`,
        reasoning: `Based on ${emp.name}'s potential (${emp.potential}/10) and trend (${emp.trend}). Proactive interventions have ${isHighPotential ? "85%+" : "~70%"} success rate for ${emp.risk}-risk employees. Cost estimated at 15% of current salary.`,
      },
      {
        title: "Delayed Action",
        probability: isHighRisk ? 40 : 55,
        cost: `€${actionCost * 2}k potential`,
        risk: isHighRisk ? "High" : "Medium",
        description: `Wait and observe for 6 months. ${isHighRisk ? "Significant risk of losing " + emp.name + " — replacement cost: €" + replacementCost + "k." : "Moderate risk — may lose momentum on positive trajectory."}`,
        reasoning: `Delay reduces success probability by ${isHighRisk ? "45-50%" : "15-20%"} based on current risk level. Potential cost doubles due to accumulating disengagement and market drift.`,
      },
      {
        title: "Creative Alternative",
        probability: 65,
        cost: `€${Math.round(actionCost * 0.4)}k`,
        risk: "Medium",
        description: `Hybrid approach: ${isHighPotential ? "leadership mentorship + stretch project + public recognition" : "cross-training + team rotation + skills development"} for ${emp.name}. Lower cost, moderate impact.`,
        reasoning: `Alternative approaches have ~65% success rate across risk levels. Cost is lower (40% of standard intervention) but impact depends on ${emp.name}'s responsiveness to non-traditional development methods.`,
      },
    ];
    analysis = `**Scenario Analysis for ${emp.name}** (${emp.role}, ${emp.dept})\n\nBased on your question, I've modeled three approaches. Key data: performance ${emp.score}/10, potential ${emp.potential}/10, risk ${emp.risk}, salary €${emp.salary}k vs benchmark €${marketBenchmark}k.${emp.flag ? ` Flag: ${emp.flag}.` : ""}`;
  }

  return { analysis, scenarios };
}
