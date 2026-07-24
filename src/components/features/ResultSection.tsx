import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Download, Copy, FileText, File, Share2, Wand2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ResultSection({
  result,
  isRefining,
  refineInput,
  setRefineInput,
  handleRefine,
  handleResetApp,
  copyToClipboard,
  copyCleanToClipboard,
  exportAsTxt,
  exportAsPdf,
  exportAsMd,
  resultFontSize,
  showRaw,
  setShowRaw,
  isLimitExceeded,
  refineFeedback,
  setRefineFeedback,
  isGenerating,
  progress
}: any) {
  return (
    <>
              <Tabs defaultValue="result" className="w-full">
                <TabsList className="inline-flex w-fit bg-secondary/60 p-1 rounded-xl">
                  <TabsTrigger value="result" className="px-5 py-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-300 font-semibold text-xs text-foreground/85">
                    Résultat
                  </TabsTrigger>
                  <TabsTrigger value="refine" className="px-5 py-1.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-300 font-semibold text-xs text-foreground/85">
                    Affiner
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="result" className="mt-6 space-y-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Card className="border-border shadow-[0_8px_30px_rgba(110,142,117,0.05)] min-h-[500px] flex flex-col overflow-hidden bg-card/95 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4 bg-secondary/20">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold text-foreground">Prompt Sophistiqué</CardTitle>
                          <CardDescription className="text-muted-foreground dark:text-zinc-400 font-medium text-xs">Prêt à être utilisé avec votre IA préférée.</CardDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                          {result && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowRaw(!showRaw)}
                              className="text-xs text-primary hover:bg-secondary/40 font-semibold"
                            >
                              {showRaw ? "Vue Document" : "Vue Brut"}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger 
                              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "border-border/80 hover:bg-secondary/35")}
                              disabled={!result}
                            >
                              <Copy className="w-4 h-4 text-primary" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">Copie</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer font-semibold text-xs" onClick={() => copyToClipboard(result)}>
                                📋 Standard (Markdown)
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-semibold text-xs" onClick={() => copyCleanToClipboard(result)}>
                                ✍️ Paragraphe (épuré)
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">Exporter</DropdownMenuLabel>
                              <DropdownMenuItem className="cursor-pointer font-semibold text-xs" onClick={() => exportAsTxt(result)}>
                                📝 Fichier Texte (.txt)
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-semibold text-xs" onClick={() => exportAsPdf(result)}>
                                📄 Document PDF (.pdf)
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-semibold text-xs" onClick={() => exportAsMd(result)}>
                                📓 Bloc-notes (.md)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow pt-6 bg-card/40 overflow-hidden">
                        <AnimatePresence mode="wait">
                          {result ? (
                            <motion.div
                              key={showRaw ? "raw" : "rendered"}
                              layout
                              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                              transition={{ duration: 0.4 }}
                              className="h-full"
                            >
                              {showRaw ? (
                                <pre className="p-6 bg-secondary/20 rounded-2xl border border-border/50 whitespace-pre-wrap font-mono text-xs text-foreground/80 leading-relaxed h-[600px] overflow-auto">
                                  {result}
                                </pre>
                              ) : (
                                <div className="p-8 md:p-12 bg-white dark:bg-zinc-900/50 rounded-2xl border border-border/50 h-full overflow-auto max-h-[600px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)]">
                                  <div className="max-w-[800px] mx-auto">
                                    <div className="mb-12 pb-8 border-b border-border/50 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-secondary/30">Livrable Stratégique</Badge>
                                        <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-mono uppercase tracking-tighter">REF: {new Date().getTime().toString(16).toUpperCase()}</span>
                                      </div>
                                      <h2 className="text-xl font-bold tracking-tight text-foreground">Spécifications du Prompt</h2>
                                    </div>
                                    <div className={cn(
                                      "prose prose-slate max-w-none prose-headings:text-primary prose-headings:font-bold prose-h2:text-lg prose-h3:text-base prose-p:text-foreground/80 prose-li:text-foreground/80 prose-code:text-primary prose-code:bg-secondary/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-foreground prose-pre:text-background leading-relaxed",
                                      resultFontSize === 'text-xs' ? 'prose-xs text-xs' :
                                      resultFontSize === 'text-sm' ? 'prose-sm text-sm' :
                                      resultFontSize === 'text-base' ? 'prose-base text-base' :
                                      'prose-lg text-lg'
                                    )}>
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {result}
                                      </ReactMarkdown>
                                    </div>
                                    <div className="mt-20 pt-8 border-t border-border/40 flex justify-between items-center opacity-40">
                                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground dark:text-zinc-400">Généré par NazahPrompt Pro™</span>
                                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground dark:text-zinc-400/60 space-y-4 py-24">
                              <motion.div 
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                className="p-5 bg-secondary/50 rounded-full"
                              >
                                <Sparkles className="w-12 h-12 text-primary opacity-50" />
                              </motion.div>
                              <p className="text-sm font-semibold tracking-tight">Aucun prompt généré pour le moment.</p>
                            </div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                      {result && (
                        <CardFooter className="border-t border-border/50 bg-secondary/10 py-4 gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger 
                              className={cn(
                                buttonVariants({ variant: "default" }),
                                "flex-grow bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center gap-2 group transition-all duration-300 h-11 px-4 py-2 rounded-xl font-bold shadow-md active:scale-98"
                              )}
                            >
                              <Download className="w-4 h-4 transition-transform group-active:scale-95" />
                              Copier / Exporter le Prompt™
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[260px]">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider px-2 py-1.5 text-left">Options de copie</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => copyToClipboard(result)}>
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">📋 Copie Standard</span>
                                    <span className="text-[9px] text-muted-foreground dark:text-zinc-400 whitespace-normal leading-tight">Garder le Markdown & icônes structurées</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => copyCleanToClipboard(result)}>
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">✍️ Copie Épurée</span>
                                    <span className="text-[9px] text-muted-foreground dark:text-zinc-400 whitespace-normal leading-tight">Paragraphe brut et fluide sans Markdown</span>
                                  </div>
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider px-2 py-1.5 text-left">Options d'exportation</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => exportAsTxt(result)}>
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">📝 Fichier Texte (.txt)</span>
                                    <span className="text-[9px] text-muted-foreground dark:text-zinc-400 whitespace-normal leading-tight">Télécharger sous format texte brut standard</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => exportAsPdf(result)}>
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">📄 Document PDF (.pdf)</span>
                                    <span className="text-[9px] text-muted-foreground dark:text-zinc-400 whitespace-normal leading-tight">Mise en page pro, prêt à imprimer</span>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => exportAsMd(result)}>
                                  <div className="flex flex-col gap-0.5 text-left">
                                    <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">📓 Bloc-notes (.md)</span>
                                    <span className="text-[9px] text-muted-foreground dark:text-zinc-400 whitespace-normal leading-tight">Bloc-notes universel Markdown / Obsidian / Notion</span>
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      )}
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="refine" className="mt-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Card className="border-border shadow-[0_8px_30px_rgba(110,142,117,0.05)] overflow-hidden bg-card/95 backdrop-blur-sm">
                      <CardHeader className="bg-secondary/20 border-b border-border/60 pb-4">
                        <CardTitle className="text-lg font-bold text-foreground">Optimisation Continue</CardTitle>
                        <CardDescription className="text-muted-foreground dark:text-zinc-400 font-medium text-xs">Donnez des instructions supplémentaires pour ajuster le prompt.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <Textarea 
                          placeholder={isLimitExceeded ? "Limite de 5 prompts gratuits atteinte. Saisie bloquée. Veuillez passer au forfait Premium ! 👑" : "Ex: Rends-le plus court, ajoute un exemple de code..."} 
                          className="min-h-[120px] bg-white dark:bg-zinc-900/50 border-border/80 rounded-xl leading-relaxed text-sm focus-visible:ring-primary"
                          value={refineFeedback}
                          onChange={(e) => setRefineFeedback(e.target.value)}
                          disabled={!result || isLimitExceeded}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isGenerating && (result || isLimitExceeded)) {
                              e.preventDefault();
                              handleRefine();
                            }
                          }}
                        />
                        {isGenerating && progress > 0 && (
                          <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] text-primary font-bold uppercase tracking-wider">
                              <span className="animate-pulse">Affinage en cours...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-1.5 bg-secondary" />
                          </div>
                        )}
                        <Button 
                          className={cn(
                            "w-full font-bold h-11 rounded-xl shadow-md transition-all duration-300",
                            isLimitExceeded
                              ? "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.01] border-amber-500 shadow-amber-200"
                              : "bg-primary hover:bg-primary/95 text-primary-foreground"
                          )}
                          onClick={handleRefine}
                          disabled={isGenerating || (!result && !isLimitExceeded)}
                        >
                          {isGenerating 
                            ? "Action en cours..." 
                            : isLimitExceeded
                            ? "Passer Premium (Limite atteinte)" 
                            : "Appliquer les modifications de l'expert"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>

    </>
  );
}
