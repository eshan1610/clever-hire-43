export interface ResumeFile {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
}

export interface ExtractedSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface Mismatch {
  type: 'missing_skill' | 'experience_gap' | 'qualification_mismatch';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CandidateAnalysis {
  id: string;
  resumeId: string;
  candidateName: string;
  email?: string;
  phone?: string;
  fitScore: number;
  skills: ExtractedSkill[];
  totalExperience: number;
  experienceBreakdown: string[];
  education: string[];
  mismatches: Mismatch[];
  strengths: string[];
  rawContent: string;
  analyzedAt: Date;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  currentStep: string;
}
