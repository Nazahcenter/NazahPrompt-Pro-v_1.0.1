const fs = require('fs');

let configContent = fs.readFileSync('src/components/features/PromptConfigurator.tsx', 'utf8');

// Add missing imports
configContent = configContent.replace(/import \{ Sparkles, SlidersHorizontal, Settings2, RotateCcw, Target, Layout, MessageSquare, UserCircle, ShieldAlert, Wand2, Crown \} from 'lucide-react';/, "import { Sparkles, SlidersHorizontal, Settings2, RotateCcw, Target, Layout, MessageSquare, UserCircle, ShieldAlert, Wand2, Crown, Send } from 'lucide-react';");
configContent = configContent.replace(/import \{ Card, CardContent, CardHeader, CardTitle \} from '@\/components\/ui\/card';/, "import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';");

if (!configContent.includes("import { Progress }")) {
  configContent = "import { Progress } from '@/components/ui/progress';\n" + configContent;
}

// Add progress to props
configContent = configContent.replace(/handleResetApp\n\}: any\)/, "handleResetApp,\n  progress\n}: any)");

fs.writeFileSync('src/components/features/PromptConfigurator.tsx', configContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/handleResetApp=\{handleResetApp\}/, "handleResetApp={handleResetApp}\n                      progress={progress}");
fs.writeFileSync('src/App.tsx', appContent);
