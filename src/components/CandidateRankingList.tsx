import { Trophy, Download, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CandidateAnalysis } from '@/types/resume';
import { cn } from '@/lib/utils';

interface CandidateRankingListProps {
  candidates: CandidateAnalysis[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onExport: () => void;
}

const CandidateRankingList = ({
  candidates,
  selectedId,
  onSelect,
  onExport,
}: CandidateRankingListProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/10 border-success/30';
    if (score >= 60) return 'text-primary bg-primary/10 border-primary/30';
    if (score >= 40) return 'text-warning bg-warning/10 border-warning/30';
    return 'text-destructive bg-destructive/10 border-destructive/30';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' };
    if (index === 1) return { icon: Star, color: 'text-slate-400', bg: 'bg-slate-400/10' };
    if (index === 2) return { icon: Star, color: 'text-amber-700', bg: 'bg-amber-700/10' };
    return null;
  };

  if (candidates.length === 0) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-card">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Candidate Ranking</h2>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-medium text-foreground">No candidates yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload resumes and run AI analysis to see ranked candidates here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">
              Candidate Ranking
            </h2>
            <Badge variant="secondary" className="ml-1">
              {candidates.length}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        <div className="space-y-2">
          {candidates.map((candidate, index) => {
            const rankBadge = getRankBadge(index);
            const isSelected = selectedId === candidate.id;

            return (
              <div
                key={candidate.id}
                onClick={() => onSelect(candidate.id)}
                className={cn(
                  'cursor-pointer rounded-lg border p-3 transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                    : 'border-border bg-background hover:border-primary/30 hover:bg-muted/50 hover:shadow-sm'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {rankBadge ? (
                      <rankBadge.icon className={cn('h-4 w-4', rankBadge.color)} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-foreground">
                        {candidate.candidateName}
                      </h3>
                    </div>
                    
                    <div className="mt-1 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {candidate.totalExperience} years experience
                    </p>
                  </div>

                  <div
                    className={cn(
                      'shrink-0 rounded-lg border px-2.5 py-1 text-sm font-semibold',
                      getScoreColor(candidate.fitScore)
                    )}
                  >
                    {candidate.fitScore}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidateRankingList;
