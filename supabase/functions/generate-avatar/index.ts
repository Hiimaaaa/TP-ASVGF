// Supabase Edge Function - Generate Avatar
// Globally distributed TypeScript function for avatar generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { features = "Standard", color = "Vibrant" } = await req.json()

    // Sanitize inputs
    const cleanInput = (str: string, fallback: string): string => {
      if (typeof str !== 'string') return fallback
      return str.substring(0, 100).replace(/[<>{}]/g, '').trim() || fallback
    }

    const cleanFeatures = cleanInput(features, "Standard")
    const cleanColor = cleanInput(color, "Vibrant")

    // Initialize Gemini AI
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured')
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const basePrompt = "A flat vector art avatar of a MONKEY (Ape/Chimp). The monkey's face AND head must be fully visible and centered. NOT zoomed in. Leave space around the head. Simple geometric shapes. Cute and cool expression."

    const fullPrompt = `${basePrompt}
Style: Flat Vector Art
Features: ${cleanFeatures}
Color Theme: ${cleanColor}
Output: Only output the SVG code, nothing else. Start with <svg and end with </svg>.`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    let svgContent = response.text()

    // Extract SVG from response
    const svgMatch = svgContent.match(/<svg[\s\S]*<\/svg>/i)
    if (svgMatch) {
      svgContent = svgMatch[0]
    }

    // Sanitize SVG output
    svgContent = svgContent
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/ on\w+="[^"]*"/gim, "")
      .replace(/javascript:/gim, "")

    // Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const styleConfig = {
      features: cleanFeatures,
      colorTheme: cleanColor,
      style: "Flat Vector Art"
    }

    let avatarId = null
    const { data, error } = await supabase
      .from('avatars')
      .insert([
        {
          svg_content: svgContent,
          prompt: basePrompt,
          style_tags: styleConfig,
          color_palette: cleanColor
        }
      ])
      .select()
      .single()

    if (!error && data) {
      avatarId = data.id
    }

    return new Response(
      JSON.stringify({
        success: true,
        avatar: {
          id: avatarId,
          svg: svgContent
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (err) {
    console.error('Edge Function Error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
