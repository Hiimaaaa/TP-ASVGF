import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No API KEY found in env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("Fetching all models (v1beta)...");
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await result.json();
    
    if (data.models) {
        data.models.forEach(m => {
            console.log(`- ${m.name} (${m.displayName}) - Supported Actions: ${m.supportedGenerationMethods.join(', ')}`);
        });
    } else {
        console.log("No models found or error:", data);
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

listModels();