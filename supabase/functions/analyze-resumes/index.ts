import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_WEBHOOK_URL = 'https://eshant16.app.n8n.cloud/webhook/3c6692fb-f45c-44b9-b04b-c5dbaef668eb';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, resumes } = await req.json();
    
    console.log('Received analysis request');
    console.log('Job description length:', jobDescription?.length);
    console.log('Number of resumes:', resumes?.length);

    // Combine all resume texts for the n8n webhook
    const resumeText = resumes?.map((r: { name: string; content: string }) => 
      `--- ${r.name} ---\n${r.content}`
    ).join('\n\n') || '';

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        resume_text: resumeText,
        job_desc: jobDescription 
      })
    });

    console.log('n8n response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n error:', errorText);
      return new Response(
        JSON.stringify({ error: `n8n webhook error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('n8n response data:', JSON.stringify(data).slice(0, 500));

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
