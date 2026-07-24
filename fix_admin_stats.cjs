const fs = require('fs');

let adminContent = fs.readFileSync('src/components/features/AdminDialog.tsx', 'utf8');

adminContent = adminContent.replace(/setActiveDialog: \(val: string \| null\) => void;\n\}\)/, "setActiveDialog: (val: string | null) => void;\n  getAdminStats: () => any;\n})");
adminContent = adminContent.replace(/setActiveDialog\n\}: \{/, "setActiveDialog,\n  getAdminStats\n}: {");

// AdminDialog also had missing Badge component.
if (!adminContent.includes("import { Badge }")) {
  adminContent = adminContent.replace(/import \{ Input \} from '@\/components\/ui\/input';/, "import { Input } from '@/components/ui/input';\nimport { Badge } from '@/components/ui/badge';");
}

fs.writeFileSync('src/components/features/AdminDialog.tsx', adminContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/setActiveDialog=\{setActiveDialog\}/, "setActiveDialog={setActiveDialog}\n                getAdminStats={getAdminStats}");

fs.writeFileSync('src/App.tsx', appContent);
