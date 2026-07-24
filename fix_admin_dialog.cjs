const fs = require('fs');
let content = fs.readFileSync('src/components/features/AdminDialog.tsx', 'utf8');

// The file has a duplicate export/return or mismatched tags.
// Let's just regenerate it from scratch cleanly using tmp_admin_dialog.txt
let dialogContent = fs.readFileSync('tmp_admin_dialog.txt', 'utf8');

// Clean up dialogContent: remove the first line if it's `) : activeDialog === 'admin' ? (`
if (dialogContent.startsWith("            ) : activeDialog === 'admin' ? (")) {
  dialogContent = dialogContent.replace(/^            \) : activeDialog === 'admin' \? \(\n/m, '');
}

const componentContent = `import { useState } from 'react';
import { Search, Terminal, Wand2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AdminDialog({
  adminTab,
  setAdminTab,
  adminSearchQuery,
  setAdminSearchQuery,
  dailyStats,
  userIp,
  setActiveDialog
}: {
  adminTab: 'stats' | 'connections';
  setAdminTab: (val: 'stats' | 'connections') => void;
  adminSearchQuery: string;
  setAdminSearchQuery: (val: string) => void;
  dailyStats: Record<string, number>;
  userIp: string;
  setActiveDialog: (val: string | null) => void;
}) {
  return (
    <>
${dialogContent}
    </>
  );
}
`;
fs.writeFileSync('src/components/features/AdminDialog.tsx', componentContent);
console.log("Fixed AdminDialog.tsx");
