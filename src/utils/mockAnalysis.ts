import { ResumeFile, CandidateAnalysis, ExtractedSkill, Mismatch } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';

export async function analyzeAllResumes(
  resumes: ResumeFile[],
  jobDescription: string,
  onProgress?: (progress: number, step: string) => void
): Promise<CandidateAnalysis[]> {
  onProgress?.(10, 'Preparing data for analysis...');
  
  const payload = {
    jobDescription,
    resumes: resumes.map(r => ({
      id: r.id,
      name: r.name,
      content: r.content,
      type: r.type
    }))
  };

  onProgress?.(30, 'Sending to AI analysis...');

  try {
    console.log('Sending analysis request to edge function');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const { data, error } = await supabase.functions.invoke('analyze-resumes', {
      body: payload
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }

    console.log('Response data:', data);

    if (data?.error) {
      console.error('API error response:', data.error);
      throw new Error(`API error: ${data.error}`);
    }

    onProgress?.(70, 'Processing results...');
    
    onProgress?.(90, 'Formatting candidates...');

    // Map the API response to CandidateAnalysis format
    const results: CandidateAnalysis[] = (data.candidates || data || []).map((candidate: any, index: number) => ({
      id: candidate.id || crypto.randomUUID(),
      resumeId: candidate.resumeId || resumes[index]?.id || crypto.randomUUID(),
      candidateName: candidate.candidateName || candidate.name || 'Unknown',
      email: candidate.email,
      phone: candidate.phone,
      fitScore: candidate.fitScore ?? candidate.score ?? 0,
      skills: (candidate.skills || []).map((skill: any) => ({
        name: typeof skill === 'string' ? skill : skill.name,
        level: skill.level || 'intermediate',
        yearsOfExperience: skill.yearsOfExperience || skill.years || 0
      })) as ExtractedSkill[],
      totalExperience: typeof candidate.totalExperience === 'number' 
        ? candidate.totalExperience 
        : parseFloat(candidate.experience) || 0,
      experienceBreakdown: Array.isArray(candidate.experienceBreakdown) 
        ? candidate.experienceBreakdown 
        : (candidate.experienceBreakdown ? [candidate.experienceBreakdown] : []),
      education: Array.isArray(candidate.education) 
        ? candidate.education 
        : (candidate.education ? [candidate.education] : []),
      mismatches: (candidate.mismatches || []).map((m: any) => ({
        type: m.type || 'missing_skill',
        description: typeof m === 'string' ? m : m.description,
        severity: m.severity || 'medium'
      })) as Mismatch[],
      strengths: Array.isArray(candidate.strengths) 
        ? candidate.strengths 
        : (candidate.summary ? [candidate.summary] : []),
      rawContent: candidate.rawContent || resumes.find(r => r.id === candidate.resumeId)?.content || '',
      analyzedAt: new Date(candidate.analyzedAt || Date.now())
    }));

    onProgress?.(100, 'Complete');

    // Sort by fit score descending
    return results.sort((a, b) => b.fitScore - a.fitScore);
  } catch (error) {
    console.error('API call failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach the analysis server. This may be a CORS issue or the server is unavailable.');
    }
    throw error;
  }
}

export function exportToCSV(candidates: CandidateAnalysis[]): string {
  const headers = [
    'Rank',
    'Candidate Name',
    'Email',
    'Phone',
    'Fit Score',
    'Total Experience (Years)',
    'Top Skills',
    'Strengths',
    'Mismatches',
    'Education'
  ];
  
  const rows = candidates.map((c, index) => [
    index + 1,
    c.candidateName,
    c.email || 'N/A',
    c.phone || 'N/A',
    c.fitScore,
    c.totalExperience,
    c.skills.slice(0, 5).map(s => s.name).join('; '),
    c.strengths.join('; '),
    c.mismatches.map(m => m.description).join('; '),
    c.education.join('; ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  return csvContent;
}
