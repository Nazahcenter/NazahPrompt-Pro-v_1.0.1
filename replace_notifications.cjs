const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appContent.indexOf(") : activeDialog === 'notifications' ? (");
const endIndex = appContent.indexOf(") : (", startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `) : activeDialog === 'notifications' ? (
              <NotificationsDialog
                notifications={notifications}
                setNotifications={setNotifications}
                setActiveDialog={setActiveDialog}
              />
            `;
  appContent = appContent.slice(0, startIndex) + replacement + appContent.slice(endIndex);
  
  // Add import
  appContent = appContent.replace(
    /import { SettingsDialog } from '.\/components\/features\/SettingsDialog';/,
    "import { SettingsDialog } from './components/features/SettingsDialog';\nimport { NotificationsDialog } from './components/features/NotificationsDialog';"
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Replaced NotificationsDialog successfully.");
} else {
  console.log("Could not find boundaries.");
}
