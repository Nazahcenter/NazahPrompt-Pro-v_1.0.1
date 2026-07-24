import { Progress } from '@/components/ui/progress';
import { motion } from 'motion/react';
import { Sparkles, SlidersHorizontal, Settings2, RotateCcw, Target, Layout, MessageSquare, UserCircle, ShieldAlert, Wand2, Crown, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PromptConfig, PromptRole, PromptTone, PromptFormat } from '@/types';

export function PromptConfigurator({
  config,
  setConfig,
  isLimitExceeded,
  subscription,
  isAdminUser,
  totalUsage,
  baseIdea,
  setBaseIdea,
  handleGenerate,
  isGenerating,
  handleResetApp,
  progress
}: any) {
  return (
    <>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <Card className="border-border shadow-[0_4px_20px_rgba(110,142,117,0.04)] hover:shadow-[0_8px_30px_rgba(110,142,117,0.07)] overflow-hidden bg-card/95 backdrop-blur-sm transition-all duration-300">
                        <CardHeader className="bg-secondary/40 border-b border-border/60 pb-4">
                          <div className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-primary" />
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/80">Configuration</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                                <UserCircle className="w-3.5 h-3.5 text-primary" /> Rôle
                              </Label>
                              <Select 
                                value={config.role} 
                                onValueChange={(v) => setConfig({...config, role: v as PromptRole})}
                                disabled={isLimitExceeded}
                              >
                                <SelectTrigger className="bg-emerald-50/60 dark:bg-emerald-900/30 text-emerald-950 dark:text-emerald-100 hover:bg-emerald-50/90 dark:hover:bg-emerald-900/50 transition-all border-emerald-200/90 dark:border-emerald-800 rounded-xl h-10 text-xs font-bold shadow-sm">
                                  <SelectValue placeholder="Choisir un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expert">Expert</SelectItem>
                                  <SelectItem value="creative">Créatif</SelectItem>
                                  <SelectItem value="critic">Critique</SelectItem>
                                  <SelectItem value="assistant">Assistant</SelectItem>
                                  <SelectItem value="teacher">Enseignant</SelectItem>
                                  <SelectItem value="developer">Développeur</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                                <MessageSquare className="w-3.5 h-3.5 text-primary" /> Ton
                              </Label>
                              <Select 
                                value={config.tone} 
                                onValueChange={(v) => setConfig({...config, tone: v as PromptTone})}
                                disabled={isLimitExceeded}
                              >
                                <SelectTrigger className="bg-teal-50/60 dark:bg-teal-900/30 text-teal-950 dark:text-teal-100 hover:bg-teal-50/90 dark:hover:bg-teal-900/50 transition-all border-teal-200/90 dark:border-teal-800 rounded-xl h-10 text-xs font-bold shadow-sm">
                                  <SelectValue placeholder="Choisir un ton" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="professional">Professionnel</SelectItem>
                                  <SelectItem value="casual">Décontracté</SelectItem>
                                  <SelectItem value="academic">Académique</SelectItem>
                                  <SelectItem value="persuasive">Persuasif</SelectItem>
                                  <SelectItem value="concise">Concis</SelectItem>
                                  <SelectItem value="enthusiastic">Enthousiaste</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                              <Layout className="w-3.5 h-3.5 text-primary" /> Format de sortie
                            </Label>
                            <Select 
                              value={config.format} 
                              onValueChange={(v) => setConfig({...config, format: v as PromptFormat})}
                              disabled={isLimitExceeded}
                            >
                              <SelectTrigger className="bg-indigo-50/60 dark:bg-indigo-900/30 text-indigo-950 dark:text-indigo-100 hover:bg-indigo-50/90 dark:hover:bg-indigo-900/50 transition-all border-indigo-200/90 dark:border-indigo-800 rounded-xl h-10 text-xs font-bold shadow-sm">
                                <SelectValue placeholder="Choisir un format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="markdown">Markdown</SelectItem>
                                <SelectItem value="list">Liste à puces</SelectItem>
                                <SelectItem value="paragraph">Paragraphe</SelectItem>
                                <SelectItem value="step-by-step">Étape par étape</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                              <Target className="w-3.5 h-3.5 text-primary" /> Audience cible
                            </Label>
                            <Select 
                              value={config.audience} 
                              onValueChange={(v) => setConfig({...config, audience: v})}
                              disabled={isLimitExceeded}
                            >
                              <SelectTrigger className="bg-rose-50/60 dark:bg-rose-900/30 text-rose-950 dark:text-rose-100 hover:bg-rose-50/90 dark:hover:bg-rose-900/50 transition-all border-rose-200/90 dark:border-rose-800 rounded-xl h-10 text-xs font-bold shadow-sm">
                                <SelectValue placeholder="Choisir une audience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Tout public">Tout public</SelectItem>
                                <SelectItem value="Débutants">Débutants / Novices</SelectItem>
                                <SelectItem value="Experts">Experts / Spécialistes</SelectItem>
                                <SelectItem value="Clients">Clients / Consommateurs</SelectItem>
                                <SelectItem value="Décideurs">Décideurs / Direction</SelectItem>
                                <SelectItem value="Étudiants">Apprenants / Étudiants</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground/80">
                              <ShieldAlert className="w-3.5 h-3.5 text-primary" /> Contraintes
                            </Label>
                            <Input 
                              placeholder="Ex: Pas de jargon, max 200 mots..." 
                              value={config.constraints}
                              onChange={(e) => setConfig({...config, constraints: e.target.value})}
                              disabled={isLimitExceeded}
                              className="bg-white dark:bg-zinc-900/50 hover:bg-secondary/10 focus-visible:ring-primary border-border/80 transition-colors rounded-xl h-10 text-xs font-semibold"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    >
                      <Card className="border-border shadow-[0_4px_20px_rgba(110,142,117,0.04)] hover:shadow-[0_8px_30px_rgba(110,142,117,0.07)] overflow-hidden bg-card/95 backdrop-blur-sm transition-all duration-300">
                        <CardHeader className="bg-secondary/40 border-b border-border/60 pb-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Wand2 className="w-4 h-4 text-primary" />
                              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/80">Idée de base</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs font-bold px-2 rounded-lg hover:bg-secondary/50 text-muted-foreground"
                                onClick={handleResetApp}
                              >
                                Nouveau
                              </Button>
                            </div>
                            {(subscription.plan === 'free' || isAdminUser) && (
                              <Badge 
                                variant={isAdminUser ? "outline" : (totalUsage >= 5 ? "destructive" : "outline")} 
                                className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-lg border",
                                  isAdminUser
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold"
                                    : (totalUsage >= 5
                                      ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 animate-pulse"
                                      : "bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary dark:text-primary-foreground dark:bg-primary/20")
                                )}
                              >
                                {isAdminUser ? "👑 ADMIN (Illimité)" : `${Math.max(0, 5 - totalUsage)} / 5 prompts gratuits restants`}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <Textarea 
                            placeholder={isLimitExceeded ? "Limite de 5 prompts gratuits atteinte. Saisie bloquée. Veuillez passer au forfait Premium pour continuer à générer des prompts ! 👑" : "Décrivez ce que vous voulez que l'IA fasse..."} 
                            className="min-h-[150px] bg-white dark:bg-zinc-900/50 resize-none focus-visible:ring-primary border-border/80 transition-all rounded-lg text-sm leading-relaxed"
                            value={baseIdea}
                            onChange={(e) => setBaseIdea(e.target.value)}
                            disabled={isLimitExceeded}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                                e.preventDefault();
                                handleGenerate();
                              }
                            }}
                          />
                        </CardContent>
                        <CardFooter className="bg-secondary/10 border-t border-border/45 pt-4 flex-col gap-4">
                          {isGenerating && (
                            <div className="w-full space-y-2">
                              <div className="flex justify-between text-[10px] text-primary font-bold uppercase tracking-wider">
                                <span className="animate-pulse">Analyse et structuration...</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5 bg-secondary" />
                            </div>
                          )}
                          <Button 
                            className={cn(
                              "w-full transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md active:scale-98 h-11 rounded-lg",
                              isLimitExceeded
                                ? "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.01] border-amber-500 shadow-amber-200"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            )}
                            onClick={handleGenerate}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <RotateCcw className="w-4 h-4 animate-spin" />
                            ) : isLimitExceeded ? (
                              <Crown className="w-4 h-4 text-amber-100 fill-amber-300 animate-bounce" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            {isGenerating 
                              ? "Moulage du prompt..." 
                              : isLimitExceeded
                              ? "Passer Premium (Limite atteinte)" 
                              : "Générer le Prompt Réconfortant"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>

    </>
  );
}
