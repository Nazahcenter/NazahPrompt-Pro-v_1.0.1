const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// The block to remove starts around line 112 (baseIdea) and goes to the export handlers
const regexPromptState = /const \[baseIdea, setBaseIdea\].*?const \[dailyStats, setDailyStats\] = useState<Record<string, number>>\(\(\) => \{.*?\}\);\n/s;
if (regexPromptState.test(appContent)) {
  console.log("Matched prompt state");
  appContent = appContent.replace(regexPromptState, "");
} else {
  console.log("No prompt state matched");
}

const regexHandlers = /const isLimitExceeded =.*?const exportAsMd = \(\) => \{.*?\};\n/s;
if (regexHandlers.test(appContent)) {
  console.log("Matched prompt handlers");
  appContent = appContent.replace(regexHandlers, "");
} else {
  console.log("No prompt handlers matched");
}

// Ensure usePrompt is imported
if (!appContent.includes("import { usePrompt }")) {
  appContent = appContent.replace("import { useSettings }", "import { usePrompt } from './hooks/usePrompt';\nimport { useSettings }");
}

// Let's add the hook call where the other hooks are (maybe after useAuth).
// Wait, we need the arguments. Let's see the context.
