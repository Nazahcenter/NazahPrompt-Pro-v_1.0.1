const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regexPaymentSubmit = /const handlePaymentSubmit = async.*?const handleDownloadInvoice = \(\) => \{.*?\}, 1200\);\n  \};\n/s;
if (regexPaymentSubmit.test(appContent)) {
  console.log("Matched payment submit");
  appContent = appContent.replace(regexPaymentSubmit, "");
}

fs.writeFileSync('src/App.tsx', appContent);
