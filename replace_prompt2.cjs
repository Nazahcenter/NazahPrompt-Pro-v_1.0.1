const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regexPromptState = /const \[baseIdea, setBaseIdea\].*?const \[refineFeedback, setRefineFeedback\] = useState\(''\);\n/s;
if (regexPromptState.test(appContent)) {
  console.log("Matched prompt state");
  appContent = appContent.replace(regexPromptState, "");
}

const regexUsage = /const \[totalUsage, setTotalUsage\].*?const \[dailyStats, setDailyStats\] = useState<Record<string, number>>\(\(\) => \{.*?\}\);\n/s;
if (regexUsage.test(appContent)) {
  console.log("Matched usage");
  appContent = appContent.replace(regexUsage, "");
}

const regexIsLimit = /const isLimitExceeded =.*?\n/s;
if (regexIsLimit.test(appContent)) {
  console.log("Matched isLimitExceeded");
  appContent = appContent.replace(regexIsLimit, "");
}

const regexHandlers1 = /const recordGenerationLog = \(\) => \{.*?const exportAsMd = \(\) => \{.*?\};\n/s;
if (regexHandlers1.test(appContent)) {
  console.log("Matched handlers1");
  appContent = appContent.replace(regexHandlers1, "");
}

// Add the hook call for usePrompt, useSettings, useAuth, useBilling
// Oh wait, first let's see if we successfully removed them.
fs.writeFileSync('src/App.tsx', appContent);
