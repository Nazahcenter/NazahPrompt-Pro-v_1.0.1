const fs = require('fs');

let notifContent = fs.readFileSync('src/components/features/NotificationsDialog.tsx', 'utf8');

// Needs AlertCircle and Crown
notifContent = notifContent.replace(/import \{ Bell, Info, Check, ShieldAlert, X \} from 'lucide-react';/, "import { Bell, Info, Check, ShieldAlert, X, AlertCircle, Crown } from 'lucide-react';");

fs.writeFileSync('src/components/features/NotificationsDialog.tsx', notifContent);
