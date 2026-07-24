const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Find all the old states and handlers and replace them with a call to the hook.
const regex = /const \[theme, setTheme\] = useState.*?const handleResetAll = \(\) => \{.*?\};/s;
if (regex.test(appContent)) {
  console.log("Matched the giant settings block!");
} else {
  console.log("Did not match settings block");
}

appContent = appContent.replace(regex, `const {
    theme,
    handleThemeChange,
    aiModel,
    handleAiModelChange,
    aiTemperature,
    handleAiTemperatureChange,
    autoCopy,
    handleAutoCopyChange,
    resultFontSize,
    handleFontSizeChange,
    soundEnabled,
    handleSoundEnabledChange,
    confirmReset,
    setConfirmReset,
    handleResetAll
  } = useSettings();`);

if (!appContent.includes("import { useSettings }")) {
  appContent = appContent.replace("import { LandingScreen }", "import { useSettings } from './hooks/useSettings';\nimport { LandingScreen }");
}

fs.writeFileSync('src/App.tsx', appContent);
