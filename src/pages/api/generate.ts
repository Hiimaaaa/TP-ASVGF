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

    const basePrompt = "Generate an original avatar in a minimalist vector style, framed from the bust to the shoulders: character seen from the front (male or female) with a round head, very simple eyes and mouth, stylized hair in a few shapes, body reduced to the shoulders and upper torso, flat colors with a maximum of 3-4 colors, sharp outlines, plain colored background, no text or logo.";
    
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
