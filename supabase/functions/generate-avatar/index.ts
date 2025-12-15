// supabase/functions/generate-avatar/index.ts
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { prompt } = await req.json();

        const apiKey = Deno.env.get('OPENAI_API_KEY');
        if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `A professional avatar of ${prompt}. Flat vector art style.`,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        if (data.error) throw new Error(data.error.message);

        return new Response(JSON.stringify({ url: data.data[0].url }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
