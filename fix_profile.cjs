const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/                handleSaveProfile=\{handleSaveProfile\}\n                setActiveDialog=\{setActiveDialog\}\n                getAdminStats=\{getAdminStats\}/, "                handleSaveProfile={handleSaveProfile}\n                setActiveDialog={setActiveDialog}");
fs.writeFileSync('src/App.tsx', appContent);
