const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appContent.indexOf("              <Tabs defaultValue=\"result\" className=\"w-full\">");
const endIndex = appContent.indexOf("              {/* History Section (Desktop) */}");

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `              <ResultSection
                result={result}
                isRefining={isRefining}
                refineInput={refineInput}
                setRefineInput={setRefineInput}
                handleRefine={handleRefine}
                copyToClipboard={copyToClipboard}
                copyCleanToClipboard={copyCleanToClipboard}
                exportAsTxt={exportAsTxt}
                exportAsPdf={exportAsPdf}
                exportAsMd={exportAsMd}
                resultFontSize={resultFontSize}
              />
`;
  appContent = appContent.slice(0, startIndex) + replacement + appContent.slice(endIndex);
  
  // Add import
  appContent = appContent.replace(
    /import { PromptConfigurator } from '.\/components\/features\/PromptConfigurator';/,
    "import { PromptConfigurator } from './components/features/PromptConfigurator';\nimport { ResultSection } from './components/features/ResultSection';"
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Replaced ResultSection successfully.");
} else {
  console.log("Could not find boundaries.");
}
