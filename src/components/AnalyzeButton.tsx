import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnalysisState } from '@/types/resume';

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  analysisState: AnalysisState;
}

const AnalyzeButton = ({ onClick, disabled, analysisState }: AnalyzeButtonProps) => {
  const { isAnalyzing, progress, currentStep } = analysisState;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <Button
        onClick={onClick}
        disabled={disabled || isAnalyzing}
        variant="gradient"
        className="w-full gap-2"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Run AI Analysis
          </>
        )}
      </Button>
      
      {isAnalyzing && (
        <div className="mt-4 animate-fade-in">
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {currentStep}
          </p>
        </div>
      )}
      
      {disabled && !isAnalyzing && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Upload resumes and add a job description to start
        </p>
      )}
    </div>
  );
};

export default AnalyzeButton;
