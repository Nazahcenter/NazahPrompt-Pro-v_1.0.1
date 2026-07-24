const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regexBillingState = /const \[subscription, setSubscription\].*?const \[showCancelConfirm, setShowCancelConfirm\] = useState\(false\);\n/s;
if (regexBillingState.test(appContent)) {
  console.log("Matched billing state");
  appContent = appContent.replace(regexBillingState, "");
}

const regexPaymentSubmit = /const handlePaymentSubmit = async.*?const handleDownloadInvoice = \(\) => \{.*?\}, 1500\);\n  \};\n/s;
if (regexPaymentSubmit.test(appContent)) {
  console.log("Matched payment submit");
  appContent = appContent.replace(regexPaymentSubmit, "");
}

if (!appContent.includes("import { useBilling }")) {
  appContent = appContent.replace("import { useAuth }", "import { useBilling } from './hooks/useBilling';\nimport { useAuth }");
}

fs.writeFileSync('src/App.tsx', appContent);
