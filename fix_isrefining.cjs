const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const anchor = "const [baseIdea, setBaseIdea] = useState('');";
if (!appContent.includes("const [isRefining, setIsRefining]")) {
  appContent = appContent.replace(anchor, anchor + "\n  const [isRefining, setIsRefining] = useState(false);\n  const [refineInput, setRefineInput] = useState('');");
  fs.writeFileSync('src/App.tsx', appContent);
}
