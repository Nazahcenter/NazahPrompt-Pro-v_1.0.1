const fs = require('fs');

let settingsContent = fs.readFileSync('src/components/features/SettingsDialog.tsx', 'utf8');

if (!settingsContent.includes("  playZenChime\n}: {")) {
  settingsContent = settingsContent.replace(/  setActiveDialog\n\}: \{/, "  setActiveDialog,\n  playZenChime\n}: {");
  fs.writeFileSync('src/components/features/SettingsDialog.tsx', settingsContent);
}

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes("getAdminStats={getAdminStats}")) {
  appContent = appContent.replace(/setActiveDialog=\{setActiveDialog\}\n              \/>\n            \) : activeDialog === 'settings' \? \(/, "setActiveDialog={setActiveDialog}\n                getAdminStats={getAdminStats}\n              />\n            ) : activeDialog === 'settings' ? (");
  fs.writeFileSync('src/App.tsx', appContent);
}

