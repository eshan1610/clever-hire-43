import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(199_89%_48%)]">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              RECRUIT.AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Intelligent candidate analysis for HR teams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            S
          </div>
          <span className="text-sm font-medium text-foreground">Sarah</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
