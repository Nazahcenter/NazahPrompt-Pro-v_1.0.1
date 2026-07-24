const fs = require('fs');
let content = fs.readFileSync('src/components/features/AdminDialog.tsx', 'utf8');
content = content + '    </>\n  );\n}\n';
fs.writeFileSync('src/components/features/AdminDialog.tsx', content);
