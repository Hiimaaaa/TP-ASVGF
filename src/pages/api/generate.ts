import type { APIRoute } from 'astro';
import { generateAvatarSvg } from '../../lib/gemini';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ error: "Content-Type must be application/json" }), { status: 400 });
  }

  try {
    const body = await request.json();
    let { gender, colors } = body; 

    const genderText = gender === 'female' ? 'female' : 'male';
    const colorsText = Array.isArray(colors) && colors.length > 0 
      ? `using specifically this color palette: ${colors.join(', ')}` 
      : "using a vibrant and harmonious color palette";

    const basePrompt = `Generate a minimalist vector avatar of a ${genderText} character 
    from the front. Style: round head, very simple eyes and mouth, stylized hair. 
    Frame: from bust to shoulders. Colors: ${colorsText}. Background: solid color. 
    Style: Sharp outlines, flat design, maximum 4 colors.`;
    
    const styleConfig = {
      gender: genderText,
      requestedColors: colors,
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
            color_palette: colors?.join(', ') || 'Vibrant'
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
