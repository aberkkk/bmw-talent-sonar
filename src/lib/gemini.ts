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
