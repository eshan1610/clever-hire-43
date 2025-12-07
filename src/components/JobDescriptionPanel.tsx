import { FileText, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface JobDescriptionPanelProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionPanel = ({ value, onChange }: JobDescriptionPanelProps) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      toast({
        title: 'Pasted successfully',
        description: 'Job description has been pasted from clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Paste failed',
        description: 'Could not access clipboard. Please paste manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <Label className="text-sm font-semibold text-foreground">
          Job Description
        </Label>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste or type the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud technologies (AWS/GCP). The ideal candidate should have strong problem-solving skills and experience with agile methodologies."
        className="min-h-[180px] resize-none border-border bg-background text-sm"
      />
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePaste}
          className="gap-2"
        >
          <Clipboard className="h-4 w-4" />
          Paste from Clipboard
        </Button>
      </div>
    </div>
  );
};

export default JobDescriptionPanel;
