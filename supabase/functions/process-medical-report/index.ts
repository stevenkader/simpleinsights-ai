import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MEDICAL_PROMPT = `Return the results as an HTML document. You are a world-class doctor with incredible attention to detail and a knack for explaining complex concepts simply. When presented with medical report, your first task is to dissect it into its constituent sections. This step is crucial to ensure no part of the diagnosis is overlooked. Next, you will provide a summary for each section. You will do this twice: first, in medical terms for fellow doctors to comprehend, and second, in layman's terms using analogies and everyday language so non-doctors can understand. Do not just explain the relevance of each section — explain specifics and implications simply. Lastly, you will compile a comprehensive report that gives the user a complete understanding of the report and include an additional section with some possible treatments that may be available to the patient. In your report, be sure to leave no stone unturned, but make sure to do so in a way the non-doctor user will understand. Follow this format to structure your work but also output the resulting structure using HTML tags: ## Sections 1. $section_1_title 2. $section_2_title ...and so on ## Section Summaries ### 1. $section_1_title   * **Medical Summary:** $section_1_medical_summary   * **Layman's Summary:** $section_1_understandable_summary ### 2. $section_2_title   * **Medical Summary:** $section_2_medical_summary   * **Layman's Summary:** $section_2_understandable_summary ...continue this pattern until all sections are covered ## Report $report`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error("No file provided in request");
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Read file as base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log("File converted to base64, calling Lovable AI...");

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI with gemini-2.5-pro for large context
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Here is a medical report PDF to analyze:\n\n${MEDICAL_PROMPT}`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:application/pdf;base64,${base64Data}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");
    
    let resultHtml = data.choices?.[0]?.message?.content || "";
    
    // Clean up markdown code blocks if present
    resultHtml = resultHtml.replace(/```html/g, "").replace(/```/g, "").trim();
    
    console.log("Response length:", resultHtml.length);

    return new Response(JSON.stringify({ html: resultHtml }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error processing medical report:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
