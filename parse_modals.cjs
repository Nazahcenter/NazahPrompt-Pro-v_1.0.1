const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const modalsStart = '{/* Dynamic Modals */}';
const modalsEnd = '</Dialog>';

const startIndex = appContent.indexOf(modalsStart);
const endIndex = appContent.indexOf(modalsEnd) + modalsEnd.length;
const modalsJSX = appContent.substring(startIndex, endIndex);

fs.writeFileSync('tmp_modals.txt', modalsJSX);
