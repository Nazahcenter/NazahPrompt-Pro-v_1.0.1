import { useState, useEffect } from 'react';
import { Crown, CreditCard, ArrowRight, ShieldAlert, Check, FileText, RotateCcw, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function BillingDialog({
  subscription,
  checkoutPlan,
  setCheckoutPlan,
  billingPeriod,
  setBillingPeriod,
  paymentPhone,
  setPaymentPhone,
  paymentOperator,
  setPaymentOperator,
  paymentCountry,
  setPaymentCountry,
  paymentOtp,
  setPaymentOtp,
  operators,
  isLoadingOperators,
  otpRequired,
  isProcessingPayment,
  paymentProgress,
  showCancelConfirm,
  setShowCancelConfirm,
  handleCancelSubscription,
  setActiveDialog,
  currentUser,
  handleDownloadInvoice,
  handlePaymentSubmit
}: any) {
  return (
    <>

              <div className="py-2 space-y-5">
                {subscription.plan !== 'free' ? (
                  /* SUB-VIEW 1: User is already premium subscribed */
                  <div className="space-y-5">
                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                        <Crown className="w-5 h-5 fill-amber-500/20 animate-bounce" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-amber-950 dark:text-amber-100">Abonnement Premium Actif</span>
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">
                          Vous bénéficiez d'un accès illimité et prioritaire aux serveurs de Gemini et de NazahPrompt Pro™.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-secondary/10 divide-y divide-border/40 overflow-hidden">
                      <div className="p-4 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground dark:text-zinc-400 font-bold text-xs">Formule active</span>
                        <Badge className="bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-200 font-extrabold text-xs hover:bg-amber-100/90 shadow-sm rounded-lg py-0.5 px-2">
                          {subscription.plan === 'pro_yearly' ? 'PRO Annuel' : 'PRO Mensuel'}
                        </Badge>
                      </div>
                      <div className="p-4 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground dark:text-zinc-400 font-bold text-xs">Tarif</span>
                        <span className="font-extrabold text-foreground">
                          {subscription.plan === 'pro_yearly' ? '52 500 FCFA / an' : '5 000 FCFA / mois'}
                        </span>
                      </div>
                      <div className="p-4 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground dark:text-zinc-400 font-bold text-xs">Date de renouvellement</span>
                        <span className="font-mono text-xs font-bold text-foreground">{subscription.expiry}</span>
                      </div>
                      <div className="p-4 flex justify-between items-center text-sm">
                        <span className="text-muted-foreground dark:text-zinc-400 font-bold text-xs">Moyen de paiement</span>
                        <span className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                          <CreditCard className="w-4 h-4 text-primary" /> Visa se terminant par **** 4242
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                      <Button 
                        onClick={handleDownloadInvoice} 
                        variant="outline" 
                        className="flex-grow rounded-xl h-11 border-border/80 hover:bg-secondary/40 text-xs font-bold gap-2"
                      >
                        <FileText className="w-4 h-4 text-primary" /> Télécharger la facture PDF
                      </Button>
                      
                      {showCancelConfirm ? (
                        <div className="flex-grow flex gap-2">
                          <Button 
                            onClick={handleCancelSubscription} 
                            variant="destructive" 
                            className="flex-1 rounded-xl h-11 text-xs font-bold"
                          >
                            Confirmer
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => setShowCancelConfirm(false)} 
                            variant="outline" 
                            className="flex-1 rounded-xl h-11 border-border text-xs font-bold"
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setShowCancelConfirm(true)} 
                          variant="ghost" 
                          className="flex-grow rounded-xl h-11 text-xs text-muted-foreground dark:text-zinc-400 hover:text-red-600 hover:bg-red-500/5 font-bold transition-all"
                        >
                          Résilier l'abonnement
                        </Button>
                      )}
                    </div>
                  </div>
                ) : checkoutPlan !== null ? (
                  /* SUB-VIEW 2: Secure Checkout Payment Form */
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground dark:text-zinc-400">Formule choisie</span>
                        <span className="text-xs font-black text-foreground">
                          👑 PREMIUM PRO ({billingPeriod === 'yearly' ? 'Annuel' : 'Mensuel'})
                        </span>
                      </div>
                      <div className="h-px bg-border/40" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground dark:text-zinc-400">Total à facturer</span>
                        <span className="text-sm font-black text-primary">
                          {billingPeriod === 'yearly' ? '52 500 FCFA / an' : '5 000 FCFA / mois'}
                        </span>
                      </div>
                    </div>

                    {isProcessingPayment ? (
                      <div className="py-8 text-center space-y-5 animate-pulse">
                        <div className="p-4 bg-primary/10 rounded-full inline-block">
                          <RotateCcw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <div className="space-y-3 max-w-xs mx-auto">
                          <p className="text-sm font-extrabold text-foreground">Validation sécurisée bancaire...</p>
                          <p className="text-[11px] text-muted-foreground dark:text-zinc-400 font-semibold leading-relaxed">Veuillez patienter pendant la connexion chiffrée SSL.</p>
                          <Progress value={paymentProgress} className="h-2 bg-secondary" />
                        </div>
                      </div>
                    ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-foreground/80">Pays</Label>
                            <Select value={paymentCountry} onValueChange={setPaymentCountry}>
                              <SelectTrigger className="bg-white dark:bg-zinc-900/50 border-border/80 h-11">
                                <SelectValue placeholder="Sélectionnez un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BJ">Bénin (BJ)</SelectItem>
                                <SelectItem value="CI">Côte d'Ivoire (CI)</SelectItem>
                                <SelectItem value="SN">Sénégal (SN)</SelectItem>
                                <SelectItem value="ML">Mali (ML)</SelectItem>
                                <SelectItem value="BF">Burkina Faso (BF)</SelectItem>
                                <SelectItem value="TG">Togo (TG)</SelectItem>
                                <SelectItem value="NE">Niger (NE)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-foreground/80">Opérateur Mobile Money</Label>
                            <Select value={paymentOperator} onValueChange={setPaymentOperator} disabled={isLoadingOperators}>
                              <SelectTrigger className="bg-white dark:bg-zinc-900/50 border-border/80 h-11">
                                <SelectValue placeholder={isLoadingOperators ? "Chargement..." : "Sélectionnez un opérateur"} />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map((op: any) => (
                                  <SelectItem key={op.slug} value={op.slug}>{op.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-foreground/80">Numéro de téléphone</Label>
                            <Input 
                              required
                              placeholder="Ex: 22997000000" 
                              value={paymentPhone}
                              onChange={(e) => setPaymentPhone(e.target.value.replace(/\D/g, ''))}
                              className="bg-white dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-11"
                            />
                            <p className="text-[10px] text-muted-foreground dark:text-zinc-500 mt-1">Format international sans le (+) ex: 229XXXXXXXX</p>
                          </div>

                          {otpRequired && (
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-foreground/80">Code OTP</Label>
                              <Input 
                                required
                                placeholder="Code d'autorisation (OTP)" 
                                value={paymentOtp}
                                onChange={(e) => setPaymentOtp(e.target.value)}
                                className="bg-white dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-11"
                              />
                              <p className="text-[10px] text-muted-foreground dark:text-zinc-500 mt-1">Veuillez générer ce code depuis votre téléphone.</p>
                            </div>
                          )}

                          <div className="pt-4 flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setCheckoutPlan(null)}
                              className="rounded-xl h-11 px-5 border-border text-xs font-bold"
                            >
                              Retour
                            </Button>
                            <Button 
                              type="submit" 
                              className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-md flex items-center justify-center gap-2"
                            >
                              <Lock className="w-4 h-4" /> Payer via SebPay
                            </Button>
                          </div>

                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground dark:text-zinc-400/80 font-bold pt-1.5">
                            <Lock className="w-3.5 h-3.5 text-primary fill-primary/10" /> Transaction sécurisée par SebPay
                          </div>
                        </div>
                    )}
                  </form>
                ) : (
                  /* SUB-VIEW 3: Choose pricing plan */
                  <div className="space-y-5">
                    {/* Billing Toggle Switch */}
                    <div className="flex justify-center pt-1">
                      <div className="bg-secondary/65 p-1 rounded-xl flex items-center border border-border/40">
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('monthly')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                            billingPeriod === 'monthly' 
                              ? "bg-card text-foreground shadow-sm" 
                              : "text-muted-foreground dark:text-zinc-400 hover:text-foreground"
                          )}
                        >
                          Mensuel
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingPeriod('yearly')}
                          className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer",
                            billingPeriod === 'yearly' 
                              ? "bg-card text-foreground shadow-sm" 
                              : "text-muted-foreground dark:text-zinc-400 hover:text-foreground"
                          )}
                        >
                          Annuel
                          <Badge className="bg-primary/10 border-none text-primary hover:bg-primary/15 text-[8px] font-black tracking-tighter px-1 rounded-md h-4 flex items-center">
                            ÉCONOMIE 33%
                          </Badge>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* FREE PLAN CARD */}
                      <div className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between relative overflow-hidden transition-all hover:border-border/80">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">Formule Standard</h3>
                            <p className="text-[11px] text-muted-foreground dark:text-zinc-400 font-semibold">Idéal pour s'initier aux prompts intelligents</p>
                          </div>
                          <div className="text-2xl font-black text-foreground">0 FCFA <span className="text-[11px] font-bold text-muted-foreground dark:text-zinc-400">/ 5 prompts offerts</span></div>
                          
                          <div className="space-y-2 text-xs text-muted-foreground dark:text-zinc-400 font-semibold">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="font-extrabold text-amber-600 dark:text-amber-400">5 prompts gratuits au total</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>Modèles structurés de base</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>Historique local (20 prompts)</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          disabled 
                          variant="secondary" 
                          className="w-full mt-6 rounded-xl border border-border/45 font-extrabold text-xs tracking-wide h-10"
                        >
                          Votre Formule Actuelle
                        </Button>
                      </div>

                      {/* PREMIUM PLAN CARD */}
                      <div className="p-5 rounded-2xl border border-amber-200 bg-amber-500/5 flex flex-col justify-between relative overflow-hidden shadow-sm shadow-amber-500/10">
                        <div className="absolute top-0 right-0">
                          <div className="bg-amber-100 border-l border-b border-amber-200 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-200 text-[8px] font-black tracking-widest px-2.5 py-1.5 uppercase rounded-bl-xl">
                            VALEUR MAX
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5 lg:text-xs">
                              Premium PRO <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                            </h3>
                            <p className="text-[11px] text-muted-foreground dark:text-zinc-400 font-semibold">Pour les ingénieurs et créateurs exigeants</p>
                          </div>
                          
                          <div className="text-2xl font-black text-amber-950 dark:text-amber-100">
                            {billingPeriod === 'yearly' ? '52 500 FCFA' : '5 000 FCFA'}
                            <span className="text-[11px] font-bold text-muted-foreground dark:text-zinc-400">
                              {billingPeriod === 'yearly' ? ' / an' : ' / mois'}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-xs text-foreground/85 font-semibold">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span className="font-bold text-amber-950 dark:text-amber-100">Accès ultra-rapide illimité</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>Gemini 2.5 Pro & Flash prioritaires</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>Modèles d'optimisation illimités</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>Export au format PDF, JSON & GFM</span>
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setCheckoutPlan(billingPeriod === 'yearly' ? 'pro_yearly' : 'pro_monthly')}
                          className="w-full mt-6 bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-xs rounded-xl shadow-md h-10 tracking-wide"
                        >
                          Activer l'abonnement
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                </>
  );
}
