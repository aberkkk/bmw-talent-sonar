const OPENROUTER_KEY = "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";

async function callAI(prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
      "HTTP-Referer": "https://bmw-workforce-oracle.lovable.app",
      "X-Title": "BMW Workforce Oracle"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  console.log("AI response:", data);
  if (!response.ok) throw new Error(data.error?.message || "API error");
  return data.choices[0].message.content;
}

export async function deepDiveAnalysis(employeeInfo: string): Promise<string> {
  return callAI(`You are BMW's Talent Intelligence Agent. Analyze the employee profile and give: 1) Key Strengths, 2) Hidden Potential, 3) Risk Factors, 4) Recommended Action. Max 200 words. Always note final decisions rest with humans.\n\nEmployee Profile:\n${employeeInfo}`);
}

export async function simulateScenarios(prompt: string) {
  const text = await callAI(`You are an HR scenario simulator. Respond ONLY with raw JSON, no markdown, no code fences, just the JSON object:\n{"scenarioA":{"title":"Act Now","probability":85,"cost":"€12,000","risk":"Low","description":"Two sentence outcome."},"scenarioB":{"title":"Wait 6 Months","probability":45,"cost":"€45,000","risk":"High","description":"Two sentence outcome."},"scenarioC":{"title":"Alternative Approach","probability":72,"cost":"€5,000","risk":"Medium","description":"Two sentence outcome."}}\n\nContext:\n${prompt}`);
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
}

export async function advisorChat(message: string, history: {role: string; content: string}[]): Promise<string> {
  const context = history.map(m => `${m.role}: ${m.content}`).join("\n");
  return callAI(`You are BMW Workforce Oracle AI assistant. Help HR managers make smarter people decisions. Max 150 words. Always remind final decisions rest with humans.\n\n${context ? `Conversation:\n${context}\n\n` : ""}User: ${message}`);
}
