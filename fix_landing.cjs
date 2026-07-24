const fs = require('fs');
let landingContent = fs.readFileSync('src/components/layout/LandingScreen.tsx', 'utf8');
landingContent = landingContent.replace(/import \{ Terminal, Lock, UserCircle, ArrowRight \} from 'lucide-react';/, "import { Terminal, Lock, UserCircle, ArrowRight, Sparkles } from 'lucide-react';");
fs.writeFileSync('src/components/layout/LandingScreen.tsx', landingContent);
