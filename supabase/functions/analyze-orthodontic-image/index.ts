import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    console.log('Analyzing orthodontic image...');

    const systemPrompt = `You are a world-class orthodontist with advanced diagnostic skills. You specialize in reading panoramic radiographs (panorex / OPG) and generating clear, accurate, professional orthodontic evaluations and treatment plans.

Your job is to analyze a single panoramic radiograph uploaded by the user. You must carefully evaluate:
• Presence or absence of permanent teeth
• Crowding and spacing
• Wisdom teeth position
• Root morphology and length
• Bony lesions, cysts, or abnormalities
• Impacted teeth
• Occlusal plane issues
• Symmetry and arch form
• Eruption sequencing
• Pathology

Your output must be structured like a real orthodontic consultation report.
If the pano is low quality, say so.
If you cannot see something clearly, state it clearly rather than guessing.
Never invent teeth that are not visible.

Use clear language suitable for both clinicians and patients.
Provide:
1. Radiographic Findings
2. Problem List
3. Predicted Bite Classification (approximate)
4. Treatment Objectives
5. Recommended Treatment Plan (braces vs aligners, elastics, extractions, wisdom teeth, etc.)
6. Risks or limitations due to pano-only evaluation

Format your response in HTML with proper headings and lists for easy reading.`;

    const userPrompt = `Here is a panoramic X-ray for orthodontic evaluation. Please analyze this pano in detail following the structure in your system prompt.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Analysis complete');

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-orthodontic-image function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
