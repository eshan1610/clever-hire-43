import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, resumes } = await req.json();
    
    console.log('Received analysis request');
    console.log('Job description length:', jobDescription?.length);
    console.log('Number of resumes:', resumes?.length);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const resumeText = resumes?.map((r: { name: string; content: string }) => 
      `--- ${r.name} ---\n${r.content}`
    ).join('\n\n') || '';

    const systemPrompt = `You are an expert HR analyst and resume screener. Analyze the provided resumes against the job description and return a structured JSON analysis.

For each resume, evaluate:
1. Overall fit score (0-100) based on how well the candidate matches the job requirements
2. Key skills that match the job requirements
3. Skills or requirements that are missing from the resume
4. Years of experience (estimate from resume content)
5. Education level and relevance
6. A brief summary of the candidate's strengths

Return your analysis as a valid JSON array with the following structure for each candidate:
{
  "name": "Candidate name extracted from resume",
  "fitScore": 85,
  "skills": ["skill1", "skill2", "skill3"],
  "mismatches": ["missing requirement 1", "missing requirement 2"],
  "experience": "X years",
  "education": "Degree/Certification details",
  "summary": "Brief assessment of the candidate"
}`;

    const userPrompt = `Job Description:
${jobDescription}

Resumes to analyze:
${resumeText}

Analyze each resume and return a JSON array with the analysis for each candidate.`;

    console.log('Calling Lovable AI for analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI analysis failed: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim();
    }

    let candidates;
    try {
      candidates = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', jsonContent);
      throw new Error('Failed to parse AI analysis response');
    }

    // Ensure it's an array
    if (!Array.isArray(candidates)) {
      candidates = [candidates];
    }

    // Sort by fit score descending
    candidates.sort((a: any, b: any) => (b.fitScore || 0) - (a.fitScore || 0));

    console.log('Analysis complete, returning', candidates.length, 'candidates');

    return new Response(
      JSON.stringify(candidates),
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
