const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Find where <NotificationsDialog is
const startIdx = appContent.indexOf("<NotificationsDialog");

// Find the fallback dialog
const fallbackIdx = appContent.indexOf(") : (\n              <div className=\"py-6 min-h-[200px] flex flex-col items-center justify-center text-center space-y-4\">");

if (startIdx !== -1 && fallbackIdx !== -1) {
  // We want to delete from the end of <NotificationsDialog /> up to the fallback
  const endOfDialog = appContent.indexOf("/>\n            ", startIdx) + 16;
  
  if (endOfDialog !== -1) {
    appContent = appContent.slice(0, endOfDialog) + appContent.slice(fallbackIdx);
    fs.writeFileSync('src/App.tsx', appContent);
    console.log("Fixed App.tsx");
  }
}
