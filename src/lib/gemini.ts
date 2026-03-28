const API_KEY = "AIzaSyCsgx-J26r3eEo-QuI4j0Dg3GSoDaRYmlM";

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    }
  );
  const data = await response.json();
  console.log("Gemini response:", data);
  if (!response.ok) throw new Error(data.error?.message || "API error");
  return data.candidates[0].content.parts[0].text;
}

export async function deepDiveAnalysis(employeeInfo: string): Promise<string> {
  return callGemini(`You are BMW's Talent Intelligence Agent. Analyze the employee profile and give: 1) Key Strengths, 2) Hidden Potential, 3) Risk Factors, 4) Recommended Action. Max 200 words. Always note final decisions rest with humans.\n\nEmployee Profile:\n${employeeInfo}`);
}

export async function simulateScenarios(prompt: string) {
  const text = await callGemini(`You are an HR scenario simulator. Respond ONLY with raw JSON, no markdown, no code fences:\n{"scenarioA":{"title":"Act Now","probability":85,"cost":"€12,000","risk":"Low","description":"Two sentence outcome."},"scenarioB":{"title":"Wait 6 Months","probability":45,"cost":"€45,000","risk":"High","description":"Two sentence outcome."},"scenarioC":{"title":"Alternative Approach","probability":72,"cost":"€5,000","risk":"Medium","description":"Two sentence outcome."}}\n\nContext:\n${prompt}`);
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(clean);
}

export async function advisorChat(message: string, history: {role: string; content: string}[]): Promise<string> {
  const context = history.map(m => `${m.role}: ${m.content}`).join("\n");
  return callGemini(`You are BMW Workforce Oracle AI assistant. Help HR managers make smarter people decisions. Max 150 words. Always remind final decisions rest with humans.\n\n${context ? `Conversation:\n${context}\n\n` : ""}User: ${message}`);
}
