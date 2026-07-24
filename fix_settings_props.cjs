const fs = require('fs');

// Fix SettingsDialog.tsx
let settingsContent = fs.readFileSync('src/components/features/SettingsDialog.tsx', 'utf8');

// Replace setAiModel with handleAiModelChange etc in props
settingsContent = settingsContent
  .replace(/setAiModel:\s*\(val:\s*string\)\s*=>\s*void;/g, "handleAiModelChange: (val: string) => void;")
  .replace(/setAiTemperature:\s*\(val:\s*number\)\s*=>\s*void;/g, "handleAiTemperatureChange: (val: number) => void;")
  .replace(/setSoundEnabled:\s*\(val:\s*boolean\)\s*=>\s*void;/g, "handleSoundEnabledChange: (val: boolean) => void;")
  .replace(/setResultFontSize:\s*\(val:\s*any\)\s*=>\s*void;/g, "handleFontSizeChange: (val: string) => void;")
  .replace(/setAiModel/g, "handleAiModelChange")
  .replace(/setAiTemperature/g, "handleAiTemperatureChange")
  .replace(/setSoundEnabled/g, "handleSoundEnabledChange")
  .replace(/setResultFontSize/g, "handleFontSizeChange");

// add playZenChime to props
if (!settingsContent.includes("playZenChime")) {
  settingsContent = settingsContent.replace(/handleResetAll: \(\) => void;/, "handleResetAll: () => void;\n  playZenChime: () => void;");
  settingsContent = settingsContent.replace(/handleResetAll,/, "handleResetAll,\n  playZenChime,");
}

// Add imports
settingsContent = "import { Separator } from '@/components/ui/separator';\n" + 
                  "import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';\n" + 
                  settingsContent;

fs.writeFileSync('src/components/features/SettingsDialog.tsx', settingsContent);

// Fix App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent
  .replace(/setAiModel={setAiModel}/g, "handleAiModelChange={handleAiModelChange}")
  .replace(/setAiTemperature={setAiTemperature}/g, "handleAiTemperatureChange={handleAiTemperatureChange}")
  .replace(/setSoundEnabled={setSoundEnabled}/g, "handleSoundEnabledChange={handleSoundEnabledChange}")
  .replace(/setResultFontSize={setResultFontSize}/g, "handleFontSizeChange={handleFontSizeChange}");

if (!appContent.includes("playZenChime={playZenChime}")) {
  appContent = appContent.replace(/handleResetAll={handleResetAll}/, "handleResetAll={handleResetAll}\n                playZenChime={playZenChime}");
}

fs.writeFileSync('src/App.tsx', appContent);
