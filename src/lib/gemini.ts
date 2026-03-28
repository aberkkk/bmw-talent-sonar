import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCsgx-J26r3eEo-QuI4j0Dg3GSoDaRYmlM");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function deepDiveAnalysis(employeeInfo: string): Promise<string> {
  const result = await model.generateContent([
    `You are BMW's Talent Intelligence Agent. Analyze the employee profile and give: 1) Key Strengths, 2) Hidden Potential, 3) Risk Factors, 4) Recommended Action. Max 200 words. Always note final decisions rest with humans.\n\nEmployee Profile:\n${employeeInfo}`
  ]);
  return result.response.text();
}

export async function simulateScenarios(prompt: string): Promise<{
  scenarioA: { title: string; probability: number; cost: string; risk: string; description: string };
  scenarioB: { title: string; probability: number; cost: string; risk: string; description: string };
  scenarioC: { title: string; probability: number; cost: string; risk: string; description: string };
}> {
  const result = await model.generateContent([
    `You are an HR scenario simulator. Given the following employee decision context, respond ONLY with this exact JSON format, no markdown, no code fences, just raw JSON:\n{"scenarioA":{"title":"...","probability":number,"cost":"€...","risk":"Low|Medium|High|Critical","description":"Two sentence outcome."},"scenarioB":{"title":"...","probability":number,"cost":"€...","risk":"Low|Medium|High|Critical","description":"Two sentence outcome."},"scenarioC":{"title":"...","probability":number,"cost":"€...","risk":"Low|Medium|High|Critical","description":"Two sentence outcome."}}\n\nContext:\n${prompt}`
  ]);
  const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(text);
}

export async function advisorChat(message: string, history: { role: string; content: string }[]): Promise<string> {
  const contextMessages = history.map(m => `${m.role}: ${m.content}`).join("\n");
  const result = await model.generateContent([
    `You are BMW Workforce Oracle AI assistant. Help HR managers make smarter people decisions. Max 150 words. Always remind final decisions rest with humans.\n\n${contextMessages ? `Conversation so far:\n${contextMessages}\n\n` : ""}User: ${message}`
  ]);
  return result.response.text();
}
