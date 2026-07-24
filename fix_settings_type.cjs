const fs = require('fs');

let settingsContent = fs.readFileSync('src/components/features/SettingsDialog.tsx', 'utf8');

if (!settingsContent.includes("playZenChime: () => void;")) {
  settingsContent = settingsContent.replace(/handleResetAll: \(\) => void;/, "handleResetAll: () => void;\n  playZenChime: () => void;");
  fs.writeFileSync('src/components/features/SettingsDialog.tsx', settingsContent);
}

