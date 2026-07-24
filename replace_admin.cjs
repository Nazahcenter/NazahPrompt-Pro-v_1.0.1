const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appContent.indexOf(") : activeDialog === 'admin' ? (");
const endIndex = appContent.indexOf(") : activeDialog === 'settings' ? (");

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `) : activeDialog === 'admin' ? (
              <AdminDialog
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                adminSearchQuery={adminSearchQuery}
                setAdminSearchQuery={setAdminSearchQuery}
                dailyStats={dailyStats}
                userIp={userIp}
                setActiveDialog={setActiveDialog}
              />
            `;
  appContent = appContent.slice(0, startIndex) + replacement + appContent.slice(endIndex);
  
  // Add import
  appContent = appContent.replace(
    /import { ProfileDialog } from '.\/components\/features\/ProfileDialog';/,
    "import { ProfileDialog } from './components/features/ProfileDialog';\nimport { AdminDialog } from './components/features/AdminDialog';"
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Replaced AdminDialog successfully.");
} else {
  console.log("Could not find boundaries.");
}
