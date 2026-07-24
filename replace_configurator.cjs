const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = appContent.indexOf("                    <motion.div\n                      initial={{ opacity: 0, y: 15 }}\n                      animate={{ opacity: 1, y: 0 }}\n                      transition={{ delay: 0.1, duration: 0.5, ease: \"easeOut\" }}");
const endIndex = appContent.indexOf("                    {/* History Section (Mobile/Tablet) */}");

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `                    <PromptConfigurator
                      config={config}
                      setConfig={setConfig}
                      isLimitExceeded={isLimitExceeded}
                      subscription={subscription}
                      isAdminUser={isAdminUser}
                      totalUsage={totalUsage}
                      baseIdea={baseIdea}
                      setBaseIdea={setBaseIdea}
                      handleGenerate={handleGenerate}
                      isGenerating={isGenerating}
                      handleResetApp={handleResetApp}
                    />
`;
  appContent = appContent.slice(0, startIndex) + replacement + appContent.slice(endIndex);
  
  // Add import
  appContent = appContent.replace(
    /import { BillingDialog } from '.\/components\/features\/BillingDialog';/,
    "import { BillingDialog } from './components/features/BillingDialog';\nimport { PromptConfigurator } from './components/features/PromptConfigurator';"
  );
  
  fs.writeFileSync('src/App.tsx', appContent);
  console.log("Replaced PromptConfigurator successfully.");
} else {
  console.log("Could not find boundaries.");
}
