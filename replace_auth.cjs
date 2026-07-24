const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regexUser = /const \[currentUser, setCurrentUser\].*?const \[userIp, setUserIp\] = useState\('192\.168\.1\.1'\);/s;
if (regexUser.test(appContent)) {
  console.log("Matched currentUser -> userIp block");
  appContent = appContent.replace(regexUser, `const {
    currentUser,
    showLanding,
    authMode,
    setAuthMode,
    authUsername,
    setAuthUsername,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    userIp,
    profileName,
    profileEmail,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    handleSignUp,
    handleLogIn,
    handleLogOut,
    handleSaveProfile
  } = useAuth(activeDialog, setActiveDialog);`);
}

const regexProfile = /const \[profileName, setProfileName\].*?const \[editEmail, setEditEmail\] = useState\(profileEmail\);/s;
if (regexProfile.test(appContent)) {
  console.log("Matched profileName block");
  appContent = appContent.replace(regexProfile, '');
}

const regexHandlers = /const handleSignUp = \(e: React\.FormEvent\) => \{.*?const handleSaveProfile = \(e: React\.FormEvent\) => \{.*?\};/s;
if (regexHandlers.test(appContent)) {
  console.log("Matched auth handlers block");
  appContent = appContent.replace(regexHandlers, '');
}

// Remove useEffect for Profile and IP
const regexEffectProfile = /useEffect\(\(\) => \{\s*if \(activeDialog === 'profile'\) \{.*?\}, \[activeDialog, profileName, profileEmail\]\);/s;
if (regexEffectProfile.test(appContent)) {
  console.log("Matched profile effect");
  appContent = appContent.replace(regexEffectProfile, '');
}

const regexEffectIp = /useEffect\(\(\) => \{\s*\/\/ Generate a random IP.*?\}, \[\]\);/s;
if (regexEffectIp.test(appContent)) {
  console.log("Matched IP effect");
  appContent = appContent.replace(regexEffectIp, '');
}

if (!appContent.includes("import { useAuth }")) {
  appContent = appContent.replace("import { useSettings }", "import { useSettings } from './hooks/useSettings';\nimport { useAuth }");
}

fs.writeFileSync('src/App.tsx', appContent);
