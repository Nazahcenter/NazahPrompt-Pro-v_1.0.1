const fs = require('fs');
let configContent = fs.readFileSync('src/components/features/PromptConfigurator.tsx', 'utf8');

if (!configContent.includes("progress\n}: any)")) {
  configContent = configContent.replace(/isGenerating\n\}: any\)/, "isGenerating,\n  progress\n}: any)");
  fs.writeFileSync('src/components/features/PromptConfigurator.tsx', configContent);
}

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
if (!appContent.includes("progress={progress}")) {
  appContent = appContent.replace(/isGenerating=\{isGenerating\}/, "isGenerating={isGenerating}\n                      progress={progress}");
  fs.writeFileSync('src/App.tsx', appContent);
}
