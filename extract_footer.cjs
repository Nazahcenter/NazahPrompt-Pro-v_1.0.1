const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const footerStart = '<footer className="border-t border-border/40 bg-card/60 py-8 mt-12 relative z-10 backdrop-blur-sm">';
const footerEnd = '</footer>';

const startIndex = appContent.indexOf(footerStart);
const endIndex = appContent.indexOf(footerEnd) + footerEnd.length;
const footerJSX = appContent.substring(startIndex, endIndex);

const footerCode = `import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    ${footerJSX}
  );
}
`;

fs.writeFileSync('src/components/layout/Footer.tsx', footerCode);

appContent = appContent.substring(0, startIndex) + "<Footer />" + appContent.substring(endIndex);

if (!appContent.includes("import { Footer }")) {
  appContent = appContent.replace("import { Header } from './components/layout/Header';", "import { Header } from './components/layout/Header';\nimport { Footer } from './components/layout/Footer';");
}

fs.writeFileSync('src/App.tsx', appContent);
