import { useRef } from 'react';
import { Upload, File, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ResumeFile } from '@/types/resume';
import { toast } from '@/hooks/use-toast';

interface ResumeUploadPanelProps {
  resumes: ResumeFile[];
  onUpload: (files: ResumeFile[]) => void;
  onRemove: (id: string) => void;
}

const ResumeUploadPanel = ({ resumes, onUpload, onRemove }: ResumeUploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ['.pdf', '.docx', '.doc', '.txt'];
    
    const validFiles = files.filter(file => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(ext);
    });

    if (validFiles.length !== files.length) {
      toast({
        title: 'Some files skipped',
        description: 'Only PDF, DOCX, and TXT files are supported.',
        variant: 'destructive',
      });
    }

    const newResumes: ResumeFile[] = [];
    
    for (const file of validFiles) {
      try {
        const content = await readFileContent(file);
        newResumes.push({
          id: crypto.randomUUID(),
          name: file.name,
          content,
          type: file.type,
          size: file.size,
        });
      } catch (error) {
        console.error('Error reading file:', file.name, error);
      }
    }

    if (newResumes.length > 0) {
      onUpload(newResumes);
      toast({
        title: 'Resumes uploaded',
        description: `${newResumes.length} resume(s) added successfully.`,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        <Label className="text-sm font-semibold text-foreground">
          Upload Resumes
        </Label>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
      >
        <File className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Drop files or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, DOCX, TXT • Max 10MB each
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {resumes.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Uploaded ({resumes.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resumes.forEach(r => onRemove(r.id))}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
          <div className="max-h-[200px] space-y-2 overflow-y-auto scrollbar-thin">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5 transition-colors hover:bg-muted/50"
              >
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {resume.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(resume.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(resume.id)}
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadPanel;
