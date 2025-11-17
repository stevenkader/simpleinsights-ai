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

    const systemPrompt = `You are a world-class orthodontist specializing in panoramic radiograph (panorex/OPG) interpretation. Your job is to analyze the image and produce a professional orthodontic evaluation.

Evaluate:
- Tooth presence or absence
- Missing teeth, supernumerary teeth
- Wisdom teeth position and pathology
- Crowding, spacing, rotations
- Eruption sequencing
- Root morphology & length
- Impacted teeth
- Condylar symmetry
- Alveolar bone levels (approx)
- Pathology, cysts, lesions
- Occlusal plane analysis
- Arch form, symmetry
- Any abnormalities

Your output must follow this structure:

1. Radiographic Findings
2. Problem List
3. Estimated Bite Classification
4. Treatment Objectives
5. Recommended Treatment Plan
6. Risks & Limitations (due to pano-only)

If the pano is unclear or too low-resolution, say so explicitly.
Never guess a tooth or pathology that cannot be seen clearly.

Format your response in HTML with proper headings and lists for easy reading.`;

    const userPrompt = `Here is a panoramic X-ray for orthodontic evaluation. Please analyze this pano in detail following the structure in your system prompt.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: userPrompt
              },
              {
                type: 'input_image',
                image_url: image
              }
            ]
          }
        ],
        max_completion_tokens: 2000
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
