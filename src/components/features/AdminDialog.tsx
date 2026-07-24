import { useState } from 'react';
import { Search, Terminal, Wand2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function AdminDialog({
  adminTab,
  setAdminTab,
  adminSearchQuery,
  setAdminSearchQuery,
  dailyStats,
  userIp,
  setActiveDialog,
  getAdminStats
}: {
  adminTab: 'stats' | 'connections';
  setAdminTab: (val: 'stats' | 'connections') => void;
  adminSearchQuery: string;
  setAdminSearchQuery: (val: string) => void;
  dailyStats: Record<string, number>;
  userIp: string;
  setActiveDialog: (val: string | null) => void;
  getAdminStats: (filter: 'week' | 'month' | 'custom') => any;
}) {
  const [statsFilter, setStatsFilter] = useState<'week' | 'month' | 'custom'>('week');
  const stats = getAdminStats(statsFilter);
  return (
    <div className="w-full max-w-full flex flex-col py-2 space-y-6">
      {/* Filter Options */}
      <div className="flex gap-2 mb-4">
        {(['week', 'month', 'custom'] as const).map((filter) => (
          <Button
            key={filter}
            variant={statsFilter === filter ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatsFilter(filter)}
            className="rounded-xl font-bold text-xs h-8"
          >
            {filter === 'week' ? 'Cette semaine' : filter === 'month' ? 'Ce mois' : 'Personnalisé'}
          </Button>
        ))}
      </div>
      {/* 1. Bento Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-secondary/30 rounded-2xl border border-border/80 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest">Aujourd'hui</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-foreground">{stats.daily}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">↑ actif</span>
          </div>
          <p className="text-[10px] text-muted-foreground dark:text-zinc-400 mt-1">Générations d'IA</p>
        </div>

        <div className="p-4 bg-secondary/30 rounded-2xl border border-border/80 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest">Total Période</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-foreground">{stats.periodTotal}</span>
          </div>
          <p className="text-[10px] text-muted-foreground dark:text-zinc-400 mt-1">Suivi glissant {statsFilter === 'week' ? '7j' : statsFilter === 'month' ? '30j' : '60j'}</p>
        </div>

        <div className="p-4 bg-secondary/30 rounded-2xl border border-border/80 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest">Ce Mois</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-foreground">{stats.periodTotal}</span>
            <span className="text-[10px] text-primary dark:text-primary-foreground font-bold">Volume optimal</span>
          </div>
          <p className="text-[10px] text-muted-foreground dark:text-zinc-400 mt-1">Données consolidées</p>
        </div>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Total Historique</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-primary">{stats.total}</span>
            <Badge variant="outline" className="text-[9px] font-bold border-primary/20 bg-primary/10 text-primary">All-time</Badge>
          </div>
          <p className="text-[10px] text-muted-foreground dark:text-zinc-400 mt-1">Demandes de prompts</p>
        </div>
      </div>

      {/* 2. Usage Chart Bar */}
      <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Courbe d'activité glissante (prompts/jour)</h4>
            <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold">Trafic global consolidé sur les 10 derniers jours d'activité.</p>
          </div>
          <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold w-fit">Temps Réel</Badge>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAdminGenerations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6F52" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F6F52" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E3E3" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <RechartsTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur border border-border p-2.5 rounded-xl shadow-lg text-[11px] font-semibold space-y-1">
                        <p className="text-muted-foreground dark:text-zinc-400">{payload[0].payload.date}</p>
                        <p className="text-primary font-bold">Générations : {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="Generations" 
                stroke="#4F6F52" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAdminGenerations)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2b. Line Chart View */}
      <div className="p-4 sm:p-5 bg-card border border-border rounded-2xl">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Évolution quotidienne (Line Chart)</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3E3E3" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <RechartsTooltip />
              <Line 
                type="monotone" 
                dataKey="Generations" 
                stroke="#4F6F52" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Connections Logs Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Journal complet des accès & connexions</h4>
            <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold">Suivi en temps réel des tentatives de session sur la plateforme.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { localStorage.removeItem('prompt_login_logs'); window.location.reload(); }}
              className="rounded-xl border-border hover:bg-destructive/10 hover:text-destructive font-bold text-xs h-8 px-3"
            >
              Effacer tout
            </Button>
            <Badge className="bg-primary/10 border-primary/20 text-primary text-[10px] font-bold w-fit h-8 flex items-center">Sécurité active</Badge>
          </div>
        </div>

        {/* Filter and search bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-zinc-400" />
            <Input
              placeholder="Rechercher par adresse IP, e-mail, statut..."
              value={adminSearchQuery}
              onChange={(e) => setAdminSearchQuery(e.target.value)}
              className="bg-white dark:bg-zinc-900/50 border-border/80 rounded-xl pl-10 focus-visible:ring-primary h-10 text-xs font-semibold"
            />
          </div>
          {adminSearchQuery && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setAdminSearchQuery('')}
              className="rounded-xl text-xs font-bold text-muted-foreground dark:text-zinc-400 border border-border/40 hover:bg-secondary/40 h-10"
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Connections Logs Table List */}
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/40 border-b border-border/70 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground dark:text-zinc-400">
                  <th className="py-3.5 px-4">Utilisateur</th>
                  <th className="py-3.5 px-4">Adresse IP</th>
                  <th className="py-3.5 px-4">Date & Heure</th>
                  <th className="py-3.5 px-4">Machine & Source</th>
                  <th className="py-3.5 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const loginLogs = JSON.parse(localStorage.getItem('prompt_login_logs') || '[]');
                  
                  const filteredLogs = loginLogs.filter((log: any) => {
                    const q = adminSearchQuery.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (log.username || '').toLowerCase().includes(q) ||
                      (log.email || '').toLowerCase().includes(q) ||
                      (log.ip || '').includes(q) ||
                      (log.browser || '').toLowerCase().includes(q) ||
                      (log.status || '').toLowerCase().includes(q)
                    );
                  });

                  if (filteredLogs.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs font-medium text-muted-foreground dark:text-zinc-400">
                          {adminSearchQuery ? "Aucune ligne ne correspond à votre recherche." : "Historique de connexion vide."}
                        </td>
                      </tr>
                    );
                  }

                  return filteredLogs.slice(0, 10).map((log: any) => (
                    <tr key={log.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors text-xs font-semibold">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-foreground font-extrabold">{log.username || 'Utilisateur'}</span>
                          <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-medium leading-none">{log.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-primary bg-primary/5 px-2 py-0.5 rounded text-[11px] font-bold">
                          {log.ip}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground dark:text-zinc-400 font-medium text-[11px]">
                        {new Date(log.timestamp).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground dark:text-zinc-400 text-[11px] max-w-[150px] truncate">
                        {log.browser || 'Navigateur Standard'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase",
                          log.status.toUpperCase() === 'SUCCESS' 
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20" 
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                        )}>
                          {log.status.toUpperCase() === 'SUCCESS' ? 'Réussi' : 'Échec'}
                        </span>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          <div className="bg-secondary/10 px-4 py-2 border-t border-border/50 text-[10px] text-muted-foreground dark:text-zinc-400/80 flex justify-between items-center font-semibold">
            <span>Affichage des 10 dernières tentatives d'accès</span>
            <span>IP de session actuelle: {userIp}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={() => setActiveDialog(null)} className="rounded-xl border-border hover:bg-secondary/40 font-bold text-xs h-9 px-4">
          Fermer la console
        </Button>
      </div>
    </div>
  );
}
