const fs = require('fs');

let billingContent = fs.readFileSync('src/components/features/BillingDialog.tsx', 'utf8');

// Add missing lucide icons
billingContent = billingContent.replace(/import \{ Crown, CreditCard, ArrowRight, ShieldAlert, Check \} from 'lucide-react';/, "import { Crown, CreditCard, ArrowRight, ShieldAlert, Check, FileText, RotateCcw, Lock } from 'lucide-react';");

// Add props to the function signature
billingContent = billingContent.replace(/currentUser\n\}: any\)/, "currentUser,\n  handleDownloadInvoice,\n  handlePaymentSubmit\n}: any)");

fs.writeFileSync('src/components/features/BillingDialog.tsx', billingContent);

// Fix App.tsx to pass them
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(/currentUser=\{currentUser\}/, "currentUser={currentUser}\n                handleDownloadInvoice={handleDownloadInvoice}\n                handlePaymentSubmit={handlePaymentSubmit}");

fs.writeFileSync('src/App.tsx', appContent);
