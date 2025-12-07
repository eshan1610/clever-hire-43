import { ResumeFile, CandidateAnalysis, ExtractedSkill, Mismatch } from '@/types/resume';

const skillDatabase = [
  'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js', 'Node.js',
  'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'MongoDB', 'PostgreSQL',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD',
  'Machine Learning', 'Data Analysis', 'Agile', 'Scrum', 'Git',
  'REST API', 'GraphQL', 'Microservices', 'HTML', 'CSS', 'SASS',
  'Redux', 'Webpack', 'Testing', 'Jest', 'Cypress', 'Communication',
  'Leadership', 'Problem Solving', 'Team Management', 'Project Management'
];

const names = [
  'Priya Sharma', 'Rahul Patel', 'Anita Verma', 'Vikram Singh', 'Deepika Nair',
  'Amit Kumar', 'Sneha Reddy', 'Rajesh Gupta', 'Kavita Menon', 'Suresh Iyer',
  'Pooja Joshi', 'Arun Krishnan', 'Neha Saxena', 'Manoj Pillai', 'Ritu Agarwal'
];

const educationOptions = [
  'B.Tech in Computer Science - IIT Delhi',
  'B.E. in Information Technology - NIT Trichy',
  'MCA - Delhi University',
  'M.Tech in Software Engineering - IISc Bangalore',
  'B.Sc in Computer Science - Mumbai University',
  'MBA in IT Management - IIM Ahmedabad',
  'B.Tech in Electronics - BITS Pilani'
];

const experienceDescriptions = [
  'Software Developer at TCS (2019-2021)',
  'Senior Engineer at Infosys (2020-2023)',
  'Full Stack Developer at Wipro (2018-2022)',
  'Tech Lead at HCL Technologies (2017-2023)',
  'Junior Developer at Cognizant (2021-2023)',
  'Backend Developer at Tech Mahindra (2019-2022)',
  'Frontend Developer at Mindtree (2020-2023)',
  'DevOps Engineer at Accenture (2018-2021)'
];

function extractNameFromContent(content: string): string {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 2 && firstLine.length < 50 && !firstLine.includes('@')) {
      return firstLine;
    }
  }
  return names[Math.floor(Math.random() * names.length)];
}

function extractEmailFromContent(content: string): string | undefined {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = content.match(emailRegex);
  return match ? match[0] : undefined;
}

function extractPhoneFromContent(content: string): string | undefined {
  const phoneRegex = /(\+91[-\s]?)?[6-9]\d{9}/;
  const match = content.match(phoneRegex);
  return match ? match[0] : undefined;
}

function extractSkillsFromContent(content: string, jobDescription: string): ExtractedSkill[] {
  const contentLower = content.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  
  const foundSkills: ExtractedSkill[] = [];
  
  skillDatabase.forEach(skill => {
    if (contentLower.includes(skill.toLowerCase())) {
      const isInJD = jdLower.includes(skill.toLowerCase());
      const level = isInJD 
        ? (['intermediate', 'advanced', 'expert'] as const)[Math.floor(Math.random() * 3)]
        : (['beginner', 'intermediate'] as const)[Math.floor(Math.random() * 2)];
      
      foundSkills.push({
        name: skill,
        level,
        yearsOfExperience: Math.floor(Math.random() * 5) + 1
      });
    }
  });
  
  // Add some random skills if too few found
  if (foundSkills.length < 5) {
    const additionalCount = 5 - foundSkills.length;
    const unusedSkills = skillDatabase.filter(
      s => !foundSkills.some(fs => fs.name === s)
    );
    
    for (let i = 0; i < additionalCount && i < unusedSkills.length; i++) {
      const randomIndex = Math.floor(Math.random() * unusedSkills.length);
      foundSkills.push({
        name: unusedSkills[randomIndex],
        level: (['beginner', 'intermediate', 'advanced'] as const)[Math.floor(Math.random() * 3)],
        yearsOfExperience: Math.floor(Math.random() * 3) + 1
      });
      unusedSkills.splice(randomIndex, 1);
    }
  }
  
  return foundSkills.slice(0, 10);
}

function calculateFitScore(skills: ExtractedSkill[], jobDescription: string): number {
  const jdLower = jobDescription.toLowerCase();
  let matchCount = 0;
  let totalWeight = 0;
  
  skills.forEach(skill => {
    if (jdLower.includes(skill.name.toLowerCase())) {
      const levelWeight = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }[skill.level];
      matchCount += levelWeight;
    }
    totalWeight += 4;
  });
  
  const baseScore = totalWeight > 0 ? (matchCount / totalWeight) * 100 : 50;
  const variance = (Math.random() - 0.5) * 20;
  
  return Math.min(100, Math.max(20, Math.round(baseScore + variance)));
}

function generateMismatches(skills: ExtractedSkill[], jobDescription: string, fitScore: number): Mismatch[] {
  const mismatches: Mismatch[] = [];
  const jdLower = jobDescription.toLowerCase();
  
  // Check for missing skills from JD
  const requiredSkills = skillDatabase.filter(skill => jdLower.includes(skill.toLowerCase()));
  const candidateSkillNames = skills.map(s => s.name.toLowerCase());
  
  requiredSkills.forEach(skill => {
    if (!candidateSkillNames.includes(skill.toLowerCase())) {
      if (Math.random() > 0.5) {
        mismatches.push({
          type: 'missing_skill',
          description: `Missing required skill: ${skill}`,
          severity: Math.random() > 0.5 ? 'high' : 'medium'
        });
      }
    }
  });
  
  if (fitScore < 60 && Math.random() > 0.3) {
    mismatches.push({
      type: 'experience_gap',
      description: 'Experience level may not meet senior role requirements',
      severity: 'medium'
    });
  }
  
  if (fitScore < 50 && Math.random() > 0.4) {
    mismatches.push({
      type: 'qualification_mismatch',
      description: 'Educational background may not align with technical requirements',
      severity: 'low'
    });
  }
  
  return mismatches.slice(0, 4);
}

function generateStrengths(skills: ExtractedSkill[], fitScore: number): string[] {
  const strengths: string[] = [];
  
  const expertSkills = skills.filter(s => s.level === 'expert' || s.level === 'advanced');
  if (expertSkills.length > 0) {
    strengths.push(`Strong expertise in ${expertSkills.slice(0, 2).map(s => s.name).join(' and ')}`);
  }
  
  if (fitScore > 70) {
    strengths.push('Excellent overall fit for the role requirements');
  }
  
  if (skills.length > 7) {
    strengths.push('Diverse technical skill set');
  }
  
  const experienceYears = skills.reduce((sum, s) => sum + (s.yearsOfExperience || 0), 0) / skills.length;
  if (experienceYears > 3) {
    strengths.push('Solid industry experience');
  }
  
  if (strengths.length < 2) {
    strengths.push('Demonstrates learning potential');
    strengths.push('Good foundational skills');
  }
  
  return strengths.slice(0, 4);
}

export async function analyzeResume(
  resume: ResumeFile,
  jobDescription: string,
  onProgress?: (progress: number, step: string) => void
): Promise<CandidateAnalysis> {
  // Simulate processing delay
  onProgress?.(10, 'Parsing resume...');
  await new Promise(resolve => setTimeout(resolve, 300));
  
  onProgress?.(30, 'Extracting information...');
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const candidateName = extractNameFromContent(resume.content);
  const email = extractEmailFromContent(resume.content);
  const phone = extractPhoneFromContent(resume.content);
  
  onProgress?.(50, 'Analyzing skills...');
  await new Promise(resolve => setTimeout(resolve, 350));
  
  const skills = extractSkillsFromContent(resume.content, jobDescription);
  
  onProgress?.(70, 'Calculating fit score...');
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const fitScore = calculateFitScore(skills, jobDescription);
  const totalExperience = Math.floor(Math.random() * 8) + 1;
  
  onProgress?.(85, 'Generating insights...');
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const mismatches = generateMismatches(skills, jobDescription, fitScore);
  const strengths = generateStrengths(skills, fitScore);
  
  // Generate random experience and education
  const numExperiences = Math.floor(Math.random() * 3) + 1;
  const experienceBreakdown = Array.from({ length: numExperiences }, () => 
    experienceDescriptions[Math.floor(Math.random() * experienceDescriptions.length)]
  );
  
  const numEducation = Math.floor(Math.random() * 2) + 1;
  const education = Array.from({ length: numEducation }, () =>
    educationOptions[Math.floor(Math.random() * educationOptions.length)]
  );
  
  onProgress?.(100, 'Complete');
  
  return {
    id: crypto.randomUUID(),
    resumeId: resume.id,
    candidateName,
    email,
    phone,
    fitScore,
    skills,
    totalExperience,
    experienceBreakdown: [...new Set(experienceBreakdown)],
    education: [...new Set(education)],
    mismatches,
    strengths,
    rawContent: resume.content,
    analyzedAt: new Date()
  };
}

export async function analyzeAllResumes(
  resumes: ResumeFile[],
  jobDescription: string,
  onProgress?: (progress: number, step: string) => void
): Promise<CandidateAnalysis[]> {
  const results: CandidateAnalysis[] = [];
  
  for (let i = 0; i < resumes.length; i++) {
    const resume = resumes[i];
    const baseProgress = (i / resumes.length) * 100;
    
    const analysis = await analyzeResume(
      resume,
      jobDescription,
      (p, s) => onProgress?.(baseProgress + (p / resumes.length), `Resume ${i + 1}/${resumes.length}: ${s}`)
    );
    
    results.push(analysis);
  }
  
  // Sort by fit score descending
  return results.sort((a, b) => b.fitScore - a.fitScore);
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
