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
    console.log("Fetching available models...");
    // For listing models, we don't need a specific model yet.
    // Actually the SDK doesn't have a direct 'listModels' on the instance easily accessible in all versions,
    // but let's try a direct fetch if the SDK method isn't evident, or just rely on a simple generation test.
    // Wait, the new SDK might not expose listModels directly on the client class in all versions.
    // Let's try a known "gemini-1.5-flash" again but print the error fully if it fails.
    
    // Better strategy: Try to generate content with 'gemini-1.5-flash' and print the FULL error body.
    // Sometimes 404 means the endpoint region is not supported or something else.
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash!", result.response.text());
  } catch (error) {
    console.error("Error details:", error);
    if (error.response) {
      console.error("Response:", await error.response.json());
    }
  }
}

listModels();
