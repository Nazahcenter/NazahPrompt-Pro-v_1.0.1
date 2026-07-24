const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const headerStart = '<header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">';
const headerEnd = '</header>';
const startIndex = appContent.indexOf(headerStart);
const endIndex = appContent.indexOf(headerEnd) + headerEnd.length;

const replacement = `<Header 
                subscription={subscription}
                isAdminUser={isAdminUser}
                setCheckoutPlan={setCheckoutPlan}
                setActiveDialog={setActiveDialog}
                profileName={profileName}
                profileEmail={profileEmail}
                getInitials={getInitials}
                notifications={notifications}
                currentUser={currentUser}
                handleLogOut={handleLogOut}
              />`;

appContent = appContent.substring(0, startIndex) + replacement + appContent.substring(endIndex);

if (!appContent.includes("import { Header }")) {
  appContent = appContent.replace("import { LandingScreen } from './components/layout/LandingScreen';", "import { LandingScreen } from './components/layout/LandingScreen';\nimport { Header } from './components/layout/Header';");
}

fs.writeFileSync('src/App.tsx', appContent);
