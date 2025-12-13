import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobDescriptionPanel from '@/components/JobDescriptionPanel';
import ResumeUploadPanel from '@/components/ResumeUploadPanel';
import AnalyzeButton from '@/components/AnalyzeButton';
import CandidateRankingList from '@/components/CandidateRankingList';
import CandidateInsightPanel from '@/components/CandidateInsightPanel';
import { ResumeFile, CandidateAnalysis, AnalysisState } from '@/types/resume';
import { analyzeAllResumes, exportToCSV } from '@/utils/mockAnalysis';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    currentStep: '',
  });

  const handleUploadResumes = useCallback((newResumes: ResumeFile[]) => {
    setResumes((prev) => [...prev, ...newResumes]);
  }, []);

  const handleRemoveResume = useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleAnalyze = async () => {
    if (resumes.length === 0 || !jobDescription.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add a job description and upload at least one resume.',
        variant: 'destructive',
      });
      return;
    }

    setAnalysisState({
      isAnalyzing: true,
      progress: 0,
      currentStep: 'Starting analysis...',
    });

    try {
      const results = await analyzeAllResumes(
        resumes,
        jobDescription,
        (progress, step) => {
          setAnalysisState((prev) => ({
            ...prev,
            progress,
            currentStep: step,
          }));
        }
      );

      setCandidates(results);
      setSelectedCandidateId(results[0]?.id || null);

      toast({
        title: 'Analysis complete',
        description: `${results.length} candidate(s) have been ranked.`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'An error occurred during analysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalysisState({
        isAnalyzing: false,
        progress: 0,
        currentStep: '',
      });
    }
  };

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      toast({
        title: 'No candidates to export',
        description: 'Run analysis first to generate candidate data.',
        variant: 'destructive',
      });
      return;
    }

    const csvContent = exportToCSV(candidates);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidate-ranking-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export successful',
      description: 'Candidate data has been exported to CSV.',
    });
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || null;

  const canAnalyze = resumes.length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 overflow-hidden p-4 lg:p-6">
        <div className="mx-auto grid h-full max-w-[1800px] gap-4 lg:grid-cols-[320px_1fr_380px] lg:gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin lg:gap-5">
            <JobDescriptionPanel
              value={jobDescription}
              onChange={setJobDescription}
            />
            <ResumeUploadPanel
              resumes={resumes}
              onUpload={handleUploadResumes}
              onRemove={handleRemoveResume}
            />
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              analysisState={analysisState}
            />
          </div>

          {/* Middle Column */}
          <div className="min-h-0 overflow-hidden">
            <CandidateRankingList
              candidates={candidates}
              selectedId={selectedCandidateId}
              onSelect={setSelectedCandidateId}
              onExport={handleExportCSV}
            />
          </div>

          {/* Right Column */}
          <div className="min-h-0 overflow-hidden">
            <CandidateInsightPanel candidate={selectedCandidate} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
