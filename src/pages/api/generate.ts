import type { APIRoute } from 'astro';
import { generateAvatarSvg } from '../../lib/gemini';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { status: 400 });
  }

  try {
    const body = await request.json();
    let { features, color } = body; 

    const cleanInput = (str: any, fallback: string) => {
      if (typeof str !== 'string') return fallback;
      return str.substring(0, 100).replace(/[<>{}]/g, '').trim() || fallback;
    };

    features = cleanInput(features, "Standard");
    color = cleanInput(color, "Vibrant");

    const basePrompt = "A flat vector art avatar of a MONKEY (Ape/Chimp). The monkey's face AND head must be fully visible and centered. NOT zoomed in. Leave space around the head. Simple geometric shapes. Cute and cool expression.";
    
    const styleConfig = {
      features: features,
      colorTheme: color,
      style: "Flat Vector Art"
    };

    let svgContent = await generateAvatarSvg(basePrompt, styleConfig);

    svgContent = svgContent
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/ on\w+="[^"]*"/gim, "")
      .replace(/javascript:/gim, "");

    let avatarId = null;
    
    try {
      const { data, error } = await supabase
        .from('avatars')
        .insert([
          { 
            svg_content: svgContent,
            prompt: basePrompt,
            style_tags: styleConfig,
            color_palette: color
          }
        ])
        .select()
        .single();
        
      if (!error && data) {
        avatarId = data.id;
      } else {
        console.warn("Supabase save failed (continuing anyway):", error);
      }
    } catch (dbErr) {
      console.warn("Supabase connection error (continuing anyway):", dbErr);
    }

    return new Response(JSON.stringify({ 
      success: true,
      avatar: {
        id: avatarId,
        svg: svgContent
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), { status: 500 });
  }
}
