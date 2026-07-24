import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/60 py-8 mt-12 relative z-10 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary opacity-80">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold">Propulsé par Gemini 2.5 Flash</span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-zinc-400 font-medium">© 2026 NazahPrompt Pro™. Conçu pour être réconfortant et doux pour vos yeux.</p>
          </div>
        </footer>
  );
}
