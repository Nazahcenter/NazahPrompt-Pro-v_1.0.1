import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Sun, Moon, Laptop, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export function SettingsDialog({
  theme,
  handleThemeChange,
  resultFontSize,
  handleFontSizeChange,
  autoCopy,
  handleAutoCopyChange,
  soundEnabled,
  handleSoundEnabledChange,
  aiModel,
  handleAiModelChange,
  aiTemperature,
  handleAiTemperatureChange,
  confirmReset,
  setConfirmReset,
  handleResetAll,
  setActiveDialog,
  playZenChime
}: {
  theme: 'light' | 'dark' | 'system';
  handleThemeChange: (val: 'light' | 'dark' | 'system') => void;
  resultFontSize: string;
  handleFontSizeChange: (val: string) => void;
  autoCopy: boolean;
  handleAutoCopyChange: (val: boolean) => void;
  soundEnabled: boolean;
  handleSoundEnabledChange: (val: boolean) => void;
  aiModel: string;
  handleAiModelChange: (val: string) => void;
  aiTemperature: number;
  handleAiTemperatureChange: (val: number) => void;
  confirmReset: boolean;
  setConfirmReset: (val: boolean) => void;
  handleResetAll: () => void;
  playZenChime: () => void;
  setActiveDialog: (val: string | null) => void;
}) {
  return (
              <div className="py-2 space-y-6">
                
                {/* 1. Écran & Apparence */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">🖥️ Écran & Apparence</h4>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">Réglez la luminosité de l’écran pour votre confort de lecture.</p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 transition-all cursor-pointer gap-1.5 duration-300",
                        theme === 'light' 
                          ? "bg-primary/10 border-primary text-primary shadow-sm" 
                          : "bg-white dark:bg-zinc-900/50 dark:bg-zinc-900/50 hover:bg-secondary/40 text-muted-foreground dark:text-zinc-400 hover:text-foreground border-border/40"
                      )}
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-[11px] font-bold">Clair</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 transition-all cursor-pointer gap-1.5 duration-300",
                        theme === 'dark' 
                          ? "bg-primary/20 border-primary text-primary shadow-sm" 
                          : "bg-white dark:bg-zinc-900/50 dark:bg-zinc-900/50 hover:bg-secondary/40 text-muted-foreground dark:text-zinc-400 hover:text-foreground border-border/40"
                      )}
                    >
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="text-[11px] font-bold">Sombre</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleThemeChange('system')}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-xl border border-border/70 transition-all cursor-pointer gap-1.5 duration-300",
                        theme === 'system' 
                          ? "bg-primary/10 border-primary text-primary shadow-sm" 
                          : "bg-white dark:bg-zinc-900/50 dark:bg-zinc-900/50 hover:bg-secondary/40 text-muted-foreground dark:text-zinc-400 hover:text-foreground border-border/40"
                      )}
                    >
                      <Laptop className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-center leading-tight">Configuration Système</span>
                    </button>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* 2. Configuration de l'IA */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">🤖 Configuration de l'IA</h4>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">Contrôlez le modèle et la créativité pour façonner vos prompts.</p>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">Modèle par défaut</Label>
                    <Select 
                      value={aiModel} 
                      onValueChange={handleAiModelChange}
                    >
                      <SelectTrigger className="bg-white dark:bg-zinc-900/50 hover:bg-secondary/20 transition-colors border-border/80 rounded-xl h-10 text-xs font-semibold">
                        <SelectValue placeholder="Choisir un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-3-flash-preview">⚡ Gemini 2.5 Flash (Recommandé)</SelectItem>
                        <SelectItem value="gemini-3-pro-preview">👑 Gemini 2.5 Pro (Raisonnement Élevé)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-[11px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">Créativité (Température)</Label>
                      <span className="font-mono text-xs font-bold text-primary">{aiTemperature.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-muted-foreground dark:text-zinc-400">Précis</span>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.1"
                        value={aiTemperature || 0.7}
                        onChange={(e) => handleAiTemperatureChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <span className="text-[10px] font-bold text-muted-foreground dark:text-zinc-400">Créatif</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* 3. Ergonomie & Préférences */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">⚙️ Préférences d'Application</h4>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">Optimisez vos flux de travail et l'affichage des prompts.</p>
                  
                  {/* Toggle Auto Copy */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/15 border border-border/20">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">Copie automatique</p>
                      <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold">Copier automatiquement le prompt après sa génération.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutoCopyChange(!autoCopy)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        autoCopy ? "bg-primary" : "bg-neutral-200"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-100 shadow ring-0 transition duration-200 ease-in-out",
                          autoCopy ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {/* Toggle Play Chime Sound */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/15 border border-border/20">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">Sons de validation</p>
                      <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold">Jouer un joli carillon zen lors d'une génération finie.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !soundEnabled;
                        handleSoundEnabledChange(nextVal);
                        if (nextVal) playZenChime();
                      }}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        soundEnabled ? "bg-primary" : "bg-neutral-200"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-100 shadow ring-0 transition duration-200 ease-in-out",
                          soundEnabled ? "translate-x-4" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  {/* Font Size Selector */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">Taille de police globale du résultat</Label>
                    <Select 
                      value={resultFontSize} 
                      onValueChange={handleFontSizeChange}
                    >
                      <SelectTrigger className="bg-white dark:bg-zinc-900/50 hover:bg-secondary/20 transition-colors border-border/80 rounded-xl h-10 text-xs font-semibold">
                        <SelectValue placeholder="Sélectionner la taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-xs">Petit (compact - 12px)</SelectItem>
                        <SelectItem value="text-sm">Standard (confort - 14px)</SelectItem>
                        <SelectItem value="text-base">Grand (lisible - 16px)</SelectItem>
                        <SelectItem value="text-lg">Très Grand (doux pour les yeux - 18px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* 4. Zone de Danger & Réinitialisation d'usine */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">⚠️ Zone de Danger</h4>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">
                    Supprimez définitivement votre historique local, vos préférences et statistiques.
                  </p>

                  {!confirmReset ? (
                    <Button 
                      type="button"
                      variant="destructive"
                      onClick={() => setConfirmReset(true)}
                      className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-600 dark:text-red-400 font-extrabold text-xs h-9 rounded-xl transition-all"
                    >
                      Réinitialiser l'application d'usine
                    </Button>
                  ) : (
                    <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3 animate-fadeIn duration-300">
                      <p className="text-[10px] font-bold text-red-700 leading-tight">
                        Cette action est irréversible et effacera toutes les données personnalisées. Êtes-vous sûr ?
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="destructive"
                          onClick={handleResetAll}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs h-9 rounded-xl"
                        >
                          Confirmer la réinitialisation
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setConfirmReset(false)}
                          className="flex-1 border-border bg-white dark:bg-zinc-900/50 text-foreground hover:bg-secondary font-semibold text-xs h-9 rounded-xl"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-border/30">
                  <Button variant="outline" size="sm" onClick={() => setActiveDialog(null)} className="rounded-xl border-border hover:bg-secondary/40 font-bold text-xs h-10 px-6">
                    Fermer les paramètres
                  </Button>
                </div>
              </div>
  );
}
