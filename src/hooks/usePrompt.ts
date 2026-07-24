import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { generateSophisticatedPrompt, refinePrompt } from '@/lib/gemini';
import { stripEmojisAndMarkdown } from '@/lib/utils';
import { INITIAL_CONFIG } from '@/types';
import type { PromptConfig, GeneratedPrompt } from '@/types';

export function usePrompt({ subscription, isAdminUser, aiModel, aiTemperature, soundEnabled, autoCopy, addNotification, playZenChime, setCheckoutPlan, setActiveDialog, currentUserEmail }: any) {
  const [config, setConfig] = useState<PromptConfig>(INITIAL_CONFIG);
  const [baseIdea, setBaseIdea] = useState('');
  const [result, setResult] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [isRefining, setIsRefining] = useState(false);
  const [refineInput, setRefineInput] = useState('');
  const [refineFeedback, setRefineFeedback] = useState('');

  const getHistoryKey = () => `prompt_history_${currentUserEmail || 'guest'}`;
  const getUsageKey = () => `prompt_total_usage_${currentUserEmail || 'guest'}`;
  const getStatsKey = () => `prompt_daily_stats_${currentUserEmail || 'guest'}`;

  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [dailyStats, setDailyStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem(getHistoryKey());
      if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
      } else {
        setHistory([]);
      }

      setTotalUsage(parseInt(localStorage.getItem(getUsageKey()) || '0', 10));

      const savedStats = localStorage.getItem(getStatsKey());
      if (savedStats) {
        try { setDailyStats(JSON.parse(savedStats)); } catch (e) {}
      } else {
        setDailyStats({});
      }
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (history.length > 0 || localStorage.getItem(getHistoryKey())) {
      localStorage.setItem(getHistoryKey(), JSON.stringify(history));
    }
  }, [history, currentUserEmail]);

  const isLimitExceeded = subscription.plan === 'free' && totalUsage >= 5 && !isAdminUser;

  const recordGenerationLog = () => {
    if (typeof window !== 'undefined') {
      const todayKey = new Date().toISOString().split('T')[0];
      setDailyStats(prev => {
        const updated = {
          ...prev,
          [todayKey]: (prev[todayKey] || 0) + 1
        };
        localStorage.setItem(getStatsKey(), JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleGenerate = async () => {
    if (isLimitExceeded) {
      toast.error("Limite globale de 5 générations atteinte ! Passez à NazahPrompt Premium pour continuer sans limite. 👑");
      setCheckoutPlan(null);
      setActiveDialog('billing');
      return;
    }

    if (!baseIdea.trim()) {
      toast.error("Veuillez d'abord entrer une idée de base.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return Math.min(95, prev + Math.random() * 15);
      });
    }, 300);
    
    try {
      const generated = await generateSophisticatedPrompt(baseIdea, config, aiModel, aiTemperature);
      setResult(generated);
      setProgress(100);

      const newEntry: GeneratedPrompt = {
        id: Date.now().toString(),
        originalIdea: baseIdea,
        config: { ...config },
        result: generated,
        timestamp: Date.now()
      };

      if (subscription.plan === 'free' && !isAdminUser) {
        const nextCount = totalUsage + 1;
        localStorage.setItem(getUsageKey(), String(nextCount));
        setTotalUsage(nextCount);
      }

      recordGenerationLog();
      setHistory(prev => [newEntry, ...prev].slice(0, 20));
      toast.success("Prompt généré avec succès !");
      addNotification("Prompt généré", `Votre prompt pour l'idée "${baseIdea.substring(0, 30)}${baseIdea.length > 30 ? '...' : ''}" est disponible.`, 'success');

      if (soundEnabled) {
        playZenChime();
      }
      if (autoCopy) {
        navigator.clipboard.writeText(generated);
        toast.info("Copié automatiquement dans le presse-papier ! 📋");
      }
    } catch (error: any) {
      if (error.message && (error.message.includes('503') || error.message.includes('high demand'))) {
        toast.error("Le service IA est actuellement très sollicité. Veuillez patienter un instant et réessayer. ⏳");
      } else {
        toast.error(error.message || "Erreur lors de la génération.");
      }
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleRefine = async () => {
    if (isLimitExceeded) {
      toast.error("Limite globale de 5 générations atteinte ! Passez à NazahPrompt Premium pour continuer sans limite. 👑");
      setCheckoutPlan(null);
      setActiveDialog('billing');
      return;
    }

    if (!result || !refineFeedback.trim()) {
      toast.error("Générez d'abord un prompt et entrez un retour.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return Math.min(95, prev + Math.random() * 15);
      });
    }, 300);

    try {
      const refined = await refinePrompt(result, refineFeedback, aiModel, aiTemperature);
      setResult(refined);
      setProgress(100);
      setRefineFeedback('');
      recordGenerationLog();
      toast.success("Prompt affiné !");
      
      if (soundEnabled) {
        playZenChime();
      }
      if (autoCopy) {
        navigator.clipboard.writeText(refined);
        toast.info("Copié automatiquement dans le presse-papier ! 📋");
      }
    } catch (error: any) {
      if (error.message && (error.message.includes('503') || error.message.includes('high demand'))) {
        toast.error("Le service IA est actuellement très sollicité. Veuillez patienter un instant et réessayer. ⏳");
      } else {
        toast.error(error.message || "Erreur lors de l'affinage.");
      }
    } finally {
      setIsGenerating(false);
      clearInterval(interval);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleResetApp = () => {
    setConfig(INITIAL_CONFIG);
    setBaseIdea('');
    setResult('');
    setRefineFeedback('');
    setShowRaw(false);
    toast.success("Tout a été réinitialisé.");
  };

  const clearHistory = () => {
    if (subscription.plan === 'free' && !isAdminUser) {
      toast.error("Option Premium : La suppression de l'historique est désactivée pour les membres gratuits. Passez à la formule PRO pour débloquer cette option ! 👑");
      setActiveDialog('billing');
      return;
    }
    setHistory([]);
    localStorage.removeItem(getHistoryKey());
    toast.info("Historique effacé.");
  };

  const loadFromHistory = (entry: GeneratedPrompt) => {
    setBaseIdea(entry.originalIdea);
    setConfig(entry.config);
    setResult(entry.result);
    toast.info("Ancien prompt chargé.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier !");
  };

  const copyCleanToClipboard = (text: string) => {
    const cleaned = stripEmojisAndMarkdown(text);
    navigator.clipboard.writeText(cleaned);
    toast.success("Copié au format paragraphe épuré !");
  };

  const exportAsTxt = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nazah-prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exporté au format TXT !");
  };

  const exportAsPdf = () => {
    if (!result) return;
    if (subscription.plan === 'free' && !isAdminUser) {
      toast.error("Format PDF exclusif Premium");
      return;
    }
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(result, 180);
      doc.text(lines, 15, 20);
      doc.save(`nazah-prompt-${Date.now()}.pdf`);
      toast.success("Exporté au format PDF !");
    }).catch(() => {
      toast.error("Erreur lors de la création du PDF");
    });
  };

  const exportAsMd = () => {
    if (!result) return;
    if (subscription.plan === 'free' && !isAdminUser) {
      toast.error("Format Markdown exclusif Premium");
      return;
    }
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nazah-prompt-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exporté au format Markdown !");
  };

  return {
    config, setConfig,
    baseIdea, setBaseIdea,
    result, setResult,
    showRaw, setShowRaw,
    isGenerating, setIsGenerating,
    progress, setProgress,
    isRefining, setIsRefining,
    refineInput, setRefineInput,
    refineFeedback, setRefineFeedback,
    history,
    totalUsage,
    dailyStats,
    isLimitExceeded,
    handleGenerate,
    handleRefine,
    handleResetApp,
    clearHistory,
    loadFromHistory,
    copyToClipboard,
    copyCleanToClipboard,
    exportAsTxt,
    exportAsPdf,
    exportAsMd
  };
}
