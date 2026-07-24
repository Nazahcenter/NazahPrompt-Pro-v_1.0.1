const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              <AdminDialog
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                adminSearchQuery={adminSearchQuery}
                setAdminSearchQuery={setAdminSearchQuery}
                dailyStats={dailyStats}
                userIp={userIp}
                setActiveDialog={setActiveDialog}
              />`;

const replacementStr = `              <AdminDialog
                adminTab={adminTab}
                setAdminTab={setAdminTab}
                adminSearchQuery={adminSearchQuery}
                setAdminSearchQuery={setAdminSearchQuery}
                dailyStats={dailyStats}
                userIp={userIp}
                setActiveDialog={setActiveDialog}
                getAdminStats={getAdminStats}
              />`;

appContent = appContent.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', appContent);
