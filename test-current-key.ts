import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'; // try loading dotenv just in case

async function checkKey() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, '');
  console.log("Key extracted. Length:", apiKey.length, "Starts width:", apiKey.substring(0, 4));
  
  if (!apiKey) {
    console.log("No API key found in env.");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
    });
    console.log("SUCCESS. Response:", response.text);
  } catch (err: any) {
    console.log("FAILED.");
    console.log("Error details:", JSON.stringify(err, null, 2));
    console.log("Error message:", err.message);
  }
}

checkKey();
