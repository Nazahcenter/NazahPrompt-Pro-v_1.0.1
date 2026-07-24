import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

// Features & Layout
import { PromptConfigurator } from './components/features/PromptConfigurator';
import { ResultSection } from './components/features/ResultSection';
import { HistorySection } from './components/features/HistorySection';
import { AdminDialog } from './components/features/AdminDialog';
import { SettingsDialog } from './components/features/SettingsDialog';
import { BillingDialog } from './components/features/BillingDialog';
import { ProfileDialog } from './components/features/ProfileDialog';
import { NotificationsDialog } from './components/features/NotificationsDialog';
import { DocumentationDialog } from './components/features/DocumentationDialog';
import { InstallPWA } from './components/InstallPWA';
import { LandingScreen } from './components/layout/LandingScreen';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Hooks
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';
import { useBilling } from './hooks/useBilling';
import { usePrompt } from './hooks/usePrompt';

export default function App() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const {
    theme, handleThemeChange,
    aiModel, handleAiModelChange,
    aiTemperature, handleAiTemperatureChange,
    autoCopy, handleAutoCopyChange,
    resultFontSize, handleFontSizeChange,
    soundEnabled, handleSoundEnabledChange,
    confirmReset, setConfirmReset,
    handleResetAll
  } = useSettings();

  const {
    currentUser, showLanding,
    authMode, setAuthMode,
    authUsername, setAuthUsername,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    userIp, profileName, profileEmail,
    editName, setEditName,
    editEmail, setEditEmail,
    handleSignUp, handleLogIn, handleEmailLogIn,
    handleLogOut, handleSaveProfile
  } = useAuth(activeDialog, setActiveDialog);

  const {
    subscription, setSubscription,
    billingPeriod, setBillingPeriod,
    checkoutPlan, setCheckoutPlan,
    paymentPhone, setPaymentPhone,
    paymentOperator, setPaymentOperator,
    paymentCountry, setPaymentCountry,
    paymentOtp, setPaymentOtp,
    operators, isLoadingOperators,
    otpRequired,
    isProcessingPayment, paymentProgress,
    showCancelConfirm, setShowCancelConfirm,
    handlePaymentSubmit, handleCancelSubscription, handleDownloadInvoice
  } = useBilling(setActiveDialog);

  const isAdminUser = currentUser?.isAdmin || 
                      currentUser?.email?.toLowerCase() === 'admin@nazah.tech' || 
                      currentUser?.email?.toLowerCase() === 'habibstely@gmail.com';

  const playZenChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(864, ctx.currentTime + 1.5);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  const [notifications, setNotifications] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prompt_notifications');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return [
      {
        id: 'noti-init-1',
        title: 'Bienvenue sur NazahPrompt Pro™',
        description: 'Votre espace de création est maintenant fonctionnel et configuré.',
        date: new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'success'
      }
    ];
  });

  const addNotification = (title: string, description: string, type: 'info' | 'success' | 'alert' | 'premium') => {
    const newNoti = {
      id: `noti-${Date.now()}`,
      title,
      description,
      date: new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setNotifications(prev => [newNoti, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem('prompt_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const {
    config, setConfig,
    baseIdea, setBaseIdea,
    result, setResult,
    showRaw, setShowRaw,
    isGenerating, setIsGenerating,
    progress, setProgress,
    isRefining, setIsRefining,
    refineInput, setRefineInput,
    refineFeedback, setRefineFeedback,
    history, totalUsage, dailyStats,
    isLimitExceeded,
    handleGenerate, handleRefine, handleResetApp,
    clearHistory, loadFromHistory, copyToClipboard, copyCleanToClipboard,
    exportAsTxt, exportAsPdf, exportAsMd
  } = usePrompt({
    subscription, isAdminUser, aiModel, aiTemperature, soundEnabled, autoCopy,
    addNotification, playZenChime, setCheckoutPlan, setActiveDialog,
    currentUserEmail: currentUser?.email
  });

  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminTab, setAdminTab] = useState<'stats' | 'connections'>('stats');

  const getAdminStats = (filter: 'week' | 'month' | 'custom' = 'week') => {
    let daysToLookBack = filter === 'month' ? 30 : filter === 'custom' ? 60 : 7;
    const data = [];
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      const count = dailyStats[key] || 0;
      data.push({
        date: key,
        displayDate: dayLabel,
        "Generations": count,
      });
    }
    const periodTotal = data.reduce((acc, val) => acc + val["Generations"], 0);
    const todayTotal = data[data.length - 1]["Generations"];

    return {
      daily: todayTotal,
      periodTotal: periodTotal,
      total: totalUsage,
      chartData: data
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'NP';
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 relative overflow-hidden">
        {/* Soft floating background blobs for relaxation and eye-friendliness */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{ x: [0, 40, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[oklch(0.93_0.03_140)]/30 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0], scale: [1, 0.95, 1.05, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[oklch(0.96_0.03_85)]/40 blur-[120px]"
          />
          <motion.div
            animate={{ y: [0, 60, -60, 0], scale: [0.9, 1.05, 0.9, 0.9] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[oklch(0.94_0.02_140)]/20 blur-[90px]"
          />
        </div>

        <Toaster position="top-center" />
        
        <AnimatePresence mode="wait">
          {showLanding ? (
            <LandingScreen
              authMode={authMode} setAuthMode={setAuthMode}
              authUsername={authUsername} setAuthUsername={setAuthUsername}
              authEmail={authEmail} setAuthEmail={setAuthEmail}
              authPassword={authPassword} setAuthPassword={setAuthPassword}
              handleLogIn={handleLogIn} 
              handleEmailLogIn={handleEmailLogIn}
              handleSignUp={handleSignUp}
            />
          ) : (
            <motion.div key="main-app" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative z-10">
              <Header 
                subscription={subscription} isAdminUser={isAdminUser}
                setCheckoutPlan={setCheckoutPlan} setActiveDialog={setActiveDialog}
                profileName={profileName} profileEmail={profileEmail}
                getInitials={getInitials} notifications={notifications}
                currentUser={currentUser} handleLogOut={handleLogOut}
              />

              <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Configuration & Input */}
                  <div className="lg:col-span-5 space-y-6">
                    <PromptConfigurator
                      config={config} setConfig={setConfig}
                      isLimitExceeded={isLimitExceeded} subscription={subscription}
                      isAdminUser={isAdminUser} totalUsage={totalUsage}
                      baseIdea={baseIdea} setBaseIdea={setBaseIdea}
                      handleGenerate={handleGenerate} isGenerating={isGenerating}
                      handleResetApp={handleResetApp} progress={progress}
                    />
                    <div className="lg:hidden">
                      <HistorySection history={history} onLoad={loadFromHistory} onClear={clearHistory} onCopy={copyToClipboard} onCopyClean={copyCleanToClipboard} isFree={subscription.plan === 'free' && !isAdminUser} />
                    </div>
                  </div>

                  {/* Right Column: Result & Refinement */}
                  <div className="lg:col-span-7 space-y-6">
                    <ResultSection
                      result={result} isRefining={isRefining}
                      refineInput={refineInput} setRefineInput={setRefineInput}
                      handleRefine={handleRefine}
                      handleResetApp={handleResetApp}
                      copyToClipboard={copyToClipboard} copyCleanToClipboard={copyCleanToClipboard}
                      exportAsTxt={exportAsTxt} exportAsPdf={exportAsPdf} exportAsMd={exportAsMd}
                      resultFontSize={resultFontSize} showRaw={showRaw} setShowRaw={setShowRaw}
                      isLimitExceeded={isLimitExceeded} refineFeedback={refineFeedback}
                      setRefineFeedback={setRefineFeedback} isGenerating={isGenerating} progress={progress}
                    />
                    <div className="hidden lg:block">
                      <HistorySection history={history} onLoad={loadFromHistory} onClear={clearHistory} onCopy={copyToClipboard} onCopyClean={copyCleanToClipboard} isFree={subscription.plan === 'free' && !isAdminUser} />
                    </div>
                  </div>
                </div>
              </main>

              <Footer />

              <Dialog open={activeDialog !== null} onOpenChange={(open) => {
                if (!open) { setActiveDialog(null); setConfirmReset(false); }
              }}>
                <DialogContent className={cn(
                  "font-sans border-border rounded-xl bg-card/95 backdrop-blur-md transition-all duration-300 max-h-[90vh] overflow-y-auto outline-none py-6 px-6",
                  activeDialog === 'billing' ? "sm:max-w-[620px]" : activeDialog === 'admin' ? "sm:max-w-[850px]" : "sm:max-w-[480px]"
                )}>
                  <DialogHeader className="space-y-1.5">
                    <DialogTitle className="capitalize text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
                      {activeDialog === 'profile' && "Gérer votre Profil"}
                      {activeDialog === 'billing' && (checkoutPlan !== null ? "🔐 Paiement Sécurisé SSL" : "Facturation & Abonnement")}
                      {activeDialog === 'settings' && "Paramètres du Compte"}
                      {activeDialog === 'notifications' && "Centre de Notifications"}
                      {activeDialog === 'admin' && "🛡️ Console d'Administration"}
                      {activeDialog === 'documentation' && "📚 Documentation & Guide"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground dark:text-zinc-400 text-xs font-semibold">
                      {activeDialog === 'profile' && "Mettez à jour vos informations personnelles et votre avatar."}
                      {activeDialog === 'billing' && (checkoutPlan !== null ? "Saisissez vos coordonnées de carte bancaire pour activer votre abonnement instantanément." : "Gérez vos formules et accédez aux capacités prioritaires de l'IA.")}
                      {activeDialog === 'settings' && "Configurez vos préférences d'utilisation et de sécurité."}
                      {activeDialog === 'notifications' && "Choisissez comment vous souhaitez être informé des activités."}
                      {activeDialog === 'admin' && "Consultez l'adresse IP des connexions d'administrateurs, suivez l'activité par jour, semaine et mois, et analysez les statistiques d'utilisation."}
                      {activeDialog === 'documentation' && "Apprenez à maîtriser NazahPrompt Pro et transformez votre productivité."}
                    </DialogDescription>
                  </DialogHeader>
                    
                  {activeDialog === 'billing' ? (
                    <BillingDialog
                      subscription={subscription} checkoutPlan={checkoutPlan} setCheckoutPlan={setCheckoutPlan}
                      billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod}
                      paymentPhone={paymentPhone} setPaymentPhone={setPaymentPhone}
                      paymentOperator={paymentOperator} setPaymentOperator={setPaymentOperator}
                      paymentCountry={paymentCountry} setPaymentCountry={setPaymentCountry}
                      paymentOtp={paymentOtp} setPaymentOtp={setPaymentOtp}
                      operators={operators} isLoadingOperators={isLoadingOperators} otpRequired={otpRequired}
                      isProcessingPayment={isProcessingPayment} paymentProgress={paymentProgress}
                      showCancelConfirm={showCancelConfirm} setShowCancelConfirm={setShowCancelConfirm}
                      handleCancelSubscription={handleCancelSubscription} setActiveDialog={setActiveDialog}
                      currentUser={currentUser} handleDownloadInvoice={handleDownloadInvoice}
                      handlePaymentSubmit={handlePaymentSubmit}
                    />
                  ) : activeDialog === 'profile' ? (
                    <ProfileDialog
                      currentUser={currentUser} editName={editName} setEditName={setEditName}
                      editEmail={editEmail} setEditEmail={setEditEmail}
                      handleSaveProfile={handleSaveProfile} setActiveDialog={setActiveDialog}
                    />
                  ) : activeDialog === 'admin' ? (
                    <AdminDialog
                      adminTab={adminTab} setAdminTab={setAdminTab}
                      adminSearchQuery={adminSearchQuery} setAdminSearchQuery={setAdminSearchQuery}
                      dailyStats={dailyStats} userIp={userIp} setActiveDialog={setActiveDialog}
                      getAdminStats={getAdminStats}
                    />
                  ) : activeDialog === 'settings' ? (
                    <SettingsDialog
                      theme={theme} handleThemeChange={handleThemeChange}
                      resultFontSize={resultFontSize} handleFontSizeChange={handleFontSizeChange}
                      autoCopy={autoCopy} handleAutoCopyChange={handleAutoCopyChange}
                      soundEnabled={soundEnabled} handleSoundEnabledChange={handleSoundEnabledChange}
                      aiModel={aiModel} handleAiModelChange={handleAiModelChange}
                      aiTemperature={aiTemperature} handleAiTemperatureChange={handleAiTemperatureChange}
                      confirmReset={confirmReset} setConfirmReset={setConfirmReset}
                      handleResetAll={handleResetAll} playZenChime={playZenChime}
                      setActiveDialog={setActiveDialog}
                    />
                  ) : activeDialog === 'notifications' ? (
                    <NotificationsDialog
                      notifications={notifications} setNotifications={setNotifications} setActiveDialog={setActiveDialog}
                    />
                  ) : activeDialog === 'documentation' ? (
                    <DocumentationDialog
                      setActiveDialog={setActiveDialog}
                    />
                  ) : (
                    <div className="py-6 min-h-[200px] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-secondary/60 rounded-full text-primary border border-border/40">
                        {activeDialog === 'notifications' && <Bell className="w-8 h-8" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Module en cours de développement</p>
                        <p className="text-xs text-muted-foreground dark:text-zinc-400 font-medium">Cette fonctionnalité sera disponible dans la version 1.1.0</p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
        <InstallPWA />
      </div>
    </TooltipProvider>
  );
}
