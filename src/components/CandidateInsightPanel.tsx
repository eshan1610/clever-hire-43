import {
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CandidateAnalysis } from '@/types/resume';
import { cn } from '@/lib/utils';

interface CandidateInsightPanelProps {
  candidate: CandidateAnalysis | null;
}

const CandidateInsightPanel = ({ candidate }: CandidateInsightPanelProps) => {
  if (!candidate) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Candidate Insights</h2>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium text-foreground">No candidate selected</h3>
          <p className="text-sm text-muted-foreground">
            Click on a candidate from the ranking list to view detailed insights
          </p>
        </div>
      </div>
    );
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-success/20 to-success/5';
    if (score >= 60) return 'from-primary/20 to-primary/5';
    if (score >= 40) return 'from-warning/20 to-warning/5';
    return 'from-destructive/20 to-destructive/5';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-success/10 text-success border-success/30';
      case 'advanced':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'intermediate':
        return 'bg-warning/10 text-warning border-warning/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Candidate Insights</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-5 p-4">
          {/* Header with Score */}
          <div
            className={cn(
              'rounded-xl bg-gradient-to-br p-4',
              getScoreGradient(candidate.fitScore)
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-sm font-semibold text-foreground">
                    {candidate.candidateName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {candidate.candidateName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {candidate.totalExperience} years experience
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {candidate.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{candidate.email}</span>
                    </div>
                  )}
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    'text-4xl font-bold',
                    getScoreColor(candidate.fitScore)
                  )}
                >
                  {candidate.fitScore}
                </div>
                <p className="text-xs text-muted-foreground">Fit Score</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className={cn('capitalize', getSkillLevelColor(skill.level))}
                >
                  {skill.name}
                  <span className="ml-1 text-xs opacity-70">
                    ({skill.level})
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Strengths */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <h4 className="font-medium text-foreground">Strengths</h4>
            </div>
            <ul className="space-y-2">
              {candidate.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mismatches */}
          {candidate.mismatches.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <h4 className="font-medium text-foreground">
                    Areas of Concern
                  </h4>
                </div>
                <ul className="space-y-2">
                  {candidate.mismatches.map((mismatch, index) => (
                    <li
                      key={index}
                      className={cn(
                        'flex items-start gap-2 text-sm',
                        getSeverityColor(mismatch.severity)
                      )}
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>{mismatch.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Separator />

          {/* Experience */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">Experience</h4>
            </div>
            <ul className="space-y-2">
              {candidate.experienceBreakdown.map((exp, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Education */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">Education</h4>
            </div>
            <ul className="space-y-2">
              {candidate.education.map((edu, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Raw Resume Preview */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">Resume Preview</h4>
            </div>
            <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-muted/30 p-3 scrollbar-thin">
              <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                {candidate.rawContent.slice(0, 1500)}
                {candidate.rawContent.length > 1500 && '...'}
              </pre>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CandidateInsightPanel;
