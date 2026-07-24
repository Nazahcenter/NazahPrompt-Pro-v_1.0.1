const fs = require('fs');

let resultContent = fs.readFileSync('src/components/features/ResultSection.tsx', 'utf8');

resultContent = resultContent.replace(/import \{ Card, CardContent, CardHeader, CardTitle, CardFooter \} from '@\/components\/ui\/card';/, "import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';");

if (!resultContent.includes("import { Progress }")) {
  resultContent = "import { Progress } from '@/components/ui/progress';\n" + resultContent;
}

resultContent = resultContent.replace(/resultFontSize\n\}: any\)/, "resultFontSize,\n  showRaw,\n  setShowRaw,\n  isLimitExceeded,\n  refineFeedback,\n  setRefineFeedback,\n  isGenerating,\n  progress\n}: any)");

fs.writeFileSync('src/components/features/ResultSection.tsx', resultContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/resultFontSize=\{resultFontSize\}/, "resultFontSize={resultFontSize}\n                showRaw={showRaw}\n                setShowRaw={setShowRaw}\n                isLimitExceeded={isLimitExceeded}\n                refineFeedback={refineFeedback}\n                setRefineFeedback={setRefineFeedback}\n                isGenerating={isGenerating}\n                progress={progress}");

fs.writeFileSync('src/App.tsx', appContent);
