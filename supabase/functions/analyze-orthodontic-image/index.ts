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
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error('No images provided');
    }

    console.log(`Analyzing ${images.length} orthodontic image(s)...`);

    const systemPrompt = `You are a world-class orthodontist who analyzes panoramic radiographs and intraoral photographs. The user may upload between 1 and 8 images. These may include:
- Panoramic X-rays
- Lateral cephalograms
- Intraoral photos (front, left, right, upper occlusal, lower occlusal)
- Extraoral facial photos

Your job is to review all provided images together and generate a structured orthodontic report including:

1. Radiographic Findings
2. Intraoral Findings
3. Bite/occlusion observations
4. Missing teeth, impactions, asymmetry
5. Problem List
6. Treatment Objectives
7. Treatment Options
8. Clinical Limitations (due to photos only)

If any images are unclear or low quality, state that clearly.
Do not provide diagnoses; describe findings, implications, and orthodontic considerations.

Format your response in clean, semantic HTML:
- Use <h2> for main sections (e.g., "Radiographic Findings", "Problem List")
- Use <h3> for subsections when needed
- Use <ul> or <ol> for lists with proper <li> elements
- Use <p> for paragraphs with clear spacing
- Use <strong> for emphasis on key findings
- Keep the HTML clean and well-structured for professional readability`;

    const userPrompt = `Here are ${images.length} image(s) for orthodontic evaluation. Please analyze all images together and generate the full structured report.`;

    // Build the content array with text and all images
    const contentArray: any[] = [
      {
        type: 'text',
        text: userPrompt
      }
    ];

    // Add all images to the content
    images.forEach((imageUrl: string) => {
      contentArray.push({
        type: 'image_url',
        image_url: {
          url: imageUrl
        }
      });
    });

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
            content: contentArray
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

    // Remove markdown code block delimiters
    const cleanedAnalysis = analysis
      .replace(/```html\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log('Analysis complete');

    return new Response(
      JSON.stringify({ analysis: cleanedAnalysis }),
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
