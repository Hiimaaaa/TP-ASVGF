import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = import.meta.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateAvatarSvg(prompt: string, styleConfig: any) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not set");
  }


  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const systemInstruction = `
  You are an expert SVG artist specialized in creating geometric, flat-design avatars.
  
  STRICT RULES:
  1. Output ONLY the raw SVG code. No markdown.
  2. The SVG must be clean, semantic, and scalable. 
  3. MANDATORY: The root <svg> tag MUST have 'viewBox="0 0 512 512"' and 'preserveAspectRatio="xMidYMid meet"'.
  4. IMPORTANT: Draw the subject fully visible within the center. Leave a 10% margin on all sides. DO NOT CROP THE HEAD.
  5. The style should be: Flat Vector Art, Minimalist, Geometric shapes.
  6. COLOR COMPLIANCE: If specific HEX colors are requested in the prompt, you MUST use ONLY those colors plus black and white.
  7. DO NOT use <script> tags or onclick events.
  `;

  const userMessage = `
  Generate an avatar based on this configuration:
  Base Prompt: ${prompt}
  Style JSON: ${JSON.stringify(styleConfig)}

  Focus on facial features, accessories, and expression.
  `;

  try {
    const result = await model.generateContent([systemInstruction, userMessage]);
    const response = await result.response;
    let text = response.text();


    text = text.replace(/```xml/g, '')
               .replace(/```svg/g, '')
               .replace(/```/g, '')
               .trim();


    const svgStart = text.indexOf('<svg');
    const svgEnd = text.lastIndexOf('</svg>');

    if (svgStart === -1 || svgEnd === -1) {
      throw new Error("Invalid SVG output from model");
    }

    return text.substring(svgStart, svgEnd + 6);
  } catch (error) {
    console.error("Error generating avatar:", error);
    throw error;
  }
}
