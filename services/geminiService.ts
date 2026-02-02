
import { GoogleGenAI, Type } from "@google/genai";
import { DailyLog, WeeklyInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWeeklyInsights = async (logs: DailyLog[]): Promise<WeeklyInsight | null> => {
  if (logs.length === 0) return null;

  const relevantLogs = logs.slice(0, 7);
  const logsContext = JSON.stringify(relevantLogs);

  const prompt = `Analyze the following daily logs for a personal rhythm tracker app.
  Logs: ${logsContext}
  
  Instructions:
  1. Identify "Cause -> Effect" relationships (e.g., low sleep leading to high workload stress).
  2. Evaluate "Threads" (Stress, Fatigue, Conflict, Success) and their current statuses.
  3. Generate a "Thread Story": A warm narrative summary of the week's flow.
  4. Generate a "Gentle Forecast": Provide a non-deterministic suggestion about the next day's potential emotional or stress level. 
     CRITICAL: This MUST be based specifically on current trends in sleep quality, stress levels, and energy. 
     Example: "Tomorrow might be a high-conflict day if sleep stays low." or "Energy looks to be rebounding, making tomorrow a good day for a 'Small Win'."
  5. Provide 2-3 gentle suggestions for mindfulness.
  6. Tone: Observant, suggestive, non-clinical. Use words like "might," "potential," and "rhythm."`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weekStart: { type: Type.STRING },
            summary: { type: Type.STRING },
            story: { type: Type.STRING, description: "A narrative story of the week's trends." },
            forecast: { type: Type.STRING, description: "A gentle suggestion for the upcoming day based on sleep, stress, and energy trends." },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["title", "description", "type"]
              }
            },
            threadStatuses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  status: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["type", "status", "description"]
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["weekStart", "summary", "story", "forecast", "cards", "threadStatuses", "suggestions"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};
