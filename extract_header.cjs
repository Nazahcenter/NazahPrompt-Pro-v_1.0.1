const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const headerStart = '<header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">';
const headerEnd = '</header>';

const startIndex = appContent.indexOf(headerStart);
const endIndex = appContent.indexOf(headerEnd) + headerEnd.length;

const headerJSX = appContent.substring(startIndex, endIndex);

console.log(headerJSX.length);
