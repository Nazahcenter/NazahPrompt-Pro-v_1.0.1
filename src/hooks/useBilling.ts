import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useBilling(setActiveDialog: (val: string | null) => void) {
  const [subscription, setSubscription] = useState<{ plan: string; expiry: string | null; expiryIso?: string | null }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prompt_subscription');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          if (parsed.expiryIso) {
            const expiryDate = new Date(parsed.expiryIso);
            if (expiryDate.getTime() < Date.now()) {
              return { plan: 'free', expiry: null };
            }
          }
          
          return parsed;
        } catch (e) {
          console.error("Failed to parse subscription", e);
        }
      }
    }
    return { plan: 'free', expiry: null };
  });

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentOperator, setPaymentOperator] = useState('');
  const [paymentCountry, setPaymentCountry] = useState('BJ');
  const [paymentOtp, setPaymentOtp] = useState('');
  const [operators, setOperators] = useState<any[]>([]);
  const [isLoadingOperators, setIsLoadingOperators] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);

  useEffect(() => {
    const fetchOperators = async () => {
      setIsLoadingOperators(true);
      try {
        const res = await fetch(`/api/sebpay/operators?country=${paymentCountry}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOperators(data.data);
          if (data.data.length > 0) {
             const defaultOp = data.data[0];
             setPaymentOperator(defaultOp.slug);
             setOtpRequired(defaultOp.otp_required);
          } else {
             setPaymentOperator('');
             setOtpRequired(false);
          }
        } else {
          setOperators([]);
          setPaymentOperator('');
          setOtpRequired(false);
        }
      } catch (err) {
        console.error("Erreur de récupération des opérateurs:", err);
        setOperators([]);
      } finally {
        setIsLoadingOperators(false);
      }
    };
    if (paymentCountry) {
      fetchOperators();
    }
  }, [paymentCountry]);

  useEffect(() => {
     if (operators.length > 0 && paymentOperator) {
        const op = operators.find(o => o.slug === paymentOperator);
        setOtpRequired(op ? op.otp_required : false);
     }
  }, [paymentOperator, operators]);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone.trim()) {
      toast.error("Veuillez saisir votre numéro de téléphone.");
      return;
    }
    
    setIsProcessingPayment(true);
    setPaymentProgress(15);
    
    try {
      const amount = billingPeriod === 'yearly' ? 31500 : 3000; // Montant en XOF
      
      const response = await fetch('/api/sebpay/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'XOF',
          payment_method: paymentOperator,
          customer_phone: paymentPhone,
          otp: paymentOtp
        })
      });
      
      const result = await response.json();
      setPaymentProgress(50);
      
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Le paiement a échoué");
      }
      
      setPaymentProgress(75);
      
      const checkStatus = async () => {
        let attempts = 0;
        const maxAttempts = 12; // wait 60s maximum (12 * 5s)
        
        while (attempts < maxAttempts) {
          try {
            const statusRes = await fetch(`/api/sebpay/status?transaction_id=${result.data.transaction_id}`);
            const statusData = await statusRes.json();
            
            if (statusData.success) {
               if (statusData.data.status === 'COMPLETED' || statusData.data.status === 'SUCCESS') {
                  return true;
               } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'CANCELLED') {
                  throw new Error(statusData.data.message || "Le paiement n'a pas abouti");
               }
            }
          } catch(err) {
             console.error("Erreur check status", err);
          }
          attempts++;
          setPaymentProgress(75 + (attempts * 2));
          await new Promise(r => setTimeout(r, 5000));
        }
        throw new Error("Délai d'attente dépassé. Veuillez vérifier votre solde ou réessayer.");
      };
      
      await checkStatus();
      setPaymentProgress(100);
      
      const expiry = new Date();
      if (billingPeriod === 'yearly') {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }
      
      const newSubscription = {
        plan: checkoutPlan || 'pro_monthly',
        expiry: expiry.toLocaleDateString('fr-FR'),
        expiryIso: expiry.toISOString()
      };
      
      setSubscription(newSubscription);
      localStorage.setItem('prompt_subscription', JSON.stringify(newSubscription));
      
      toast.success("Paiement réussi ! Bienvenue dans NazahPrompt Premium. 🎉");
      setActiveDialog(null);
      setCheckoutPlan(null);
    } catch (error: any) {
      toast.error(error.message || "Une erreur inattendue est survenue");
    } finally {
      setIsProcessingPayment(false);
      setPaymentProgress(0);
      setPaymentOtp('');
    }
  };

  const handleCancelSubscription = () => {
    setSubscription({ plan: 'free', expiry: null });
    toast.success("Votre abonnement a été résilié avec succès. Vous êtes repassé au plan gratuit.");
    localStorage.removeItem('prompt_subscription');
    setShowCancelConfirm(false);
  };

  const handleDownloadInvoice = () => {
    toast.loading("Préparation de la facture PDF...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Facture téléchargée (simulation)");
    }, 1500);
  };

  return {
    subscription, setSubscription,
    billingPeriod, setBillingPeriod,
    checkoutPlan, setCheckoutPlan,
    paymentPhone, setPaymentPhone,
    paymentOperator, setPaymentOperator,
    paymentCountry, setPaymentCountry,
    paymentOtp, setPaymentOtp,
    operators, isLoadingOperators,
    otpRequired,
    isProcessingPayment,
    paymentProgress,
    showCancelConfirm, setShowCancelConfirm,
    handlePaymentSubmit,
    handleCancelSubscription,
    handleDownloadInvoice
  };
}
