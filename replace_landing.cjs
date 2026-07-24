const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appContent.indexOf("{showLanding ? (");
const endIndex = appContent.indexOf(") : (\n            <motion.div\n              key=\"main-app\"");

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{showLanding ? (
            <LandingScreen
              authMode={authMode}
              setAuthMode={setAuthMode}
              authUsername={authUsername}
              setAuthUsername={setAuthUsername}
              authEmail={authEmail}
              setAuthEmail={setAuthEmail}
              authPassword={authPassword}
              setAuthPassword={setAuthPassword}
              handleLogIn={handleLogIn}
              handleSignUp={handleSignUp}
            />
          `;
  appContent = appContent.slice(0, startIndex) + replacement + appContent.slice(endIndex);
  
  // Add import
  appContent = appContent.replace(
    /import { BillingDialog } from '.\/components\/features\/BillingDialog';/,
    "import { BillingDialog } from './components/features/BillingDialog';\nimport { LandingScreen } from './components/layout/LandingScreen';"
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Replaced LandingScreen successfully.");
} else {
  console.log("Could not find boundaries.");
}
