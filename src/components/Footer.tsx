import { Info } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card px-6 py-3">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Prototype — replace mock logic with real API endpoints</span>
      </div>
    </footer>
  );
};

export default Footer;
