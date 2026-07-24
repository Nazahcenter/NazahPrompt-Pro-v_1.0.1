import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Lock, UserCircle, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function LandingScreen(props: any) {
  console.log("LandingScreen props:", props);
  const {
    authMode, setAuthMode, authUsername, setAuthUsername, authEmail, setAuthEmail,
    authPassword, setAuthPassword, handleLogIn, handleSignUp, handleEmailLogIn
  } = props;
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
        toast.error("Veuillez saisir votre e-mail et votre mot de passe.");
        return;
    }
    if (props.handleEmailLogIn) {
        props.handleEmailLogIn(authEmail, authPassword);
    } else {
        console.error("handleEmailLogIn is undefined in props", props);
    }
  };
  return (
    <>

            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -25, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center min-h-screen p-6 text-center bg-transparent relative overflow-hidden z-10"
            >
              {/* Top Section */}
              <div className="flex-grow flex flex-col items-center justify-end pb-6 w-full max-w-4xl">
                <motion.div
                  initial={{ scale: 0.93, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <div className="p-3 bg-card rounded-3xl mb-1 inline-block shadow-xl shadow-primary/5 border border-border">
                    <img src="/logo.png" alt="NazahPrompt Logo" className="w-[72px] h-[72px]" />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                    NazahPrompt <span className="text-primary font-light">Pro™</span>
                  </h1>
                  <p className="text-muted-foreground dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
                    L'excellence tranquille dans l'ingénierie du prompt. Optimisez et façonnez vos instructions avec une douceur absolue.
                  </p>
                </motion.div>
              </div>

              {/* Center Section (Interactive Authentication Cards) */}
              <div className="z-10 flex flex-col items-center w-full max-w-sm px-4">
                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full bg-card/90 backdrop-blur-md border border-border/85 rounded-2xl p-5 shadow-xl space-y-5"
                >
                  <div className="flex border-b border-border">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={cn(
                        "flex-1 pb-2.5 text-xs font-extrabold text-center uppercase tracking-wider transition-all border-b-2",
                        authMode === 'login' 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground dark:text-zinc-400 hover:text-foreground"
                      )}
                    >
                      Connexion
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={cn(
                        "flex-1 pb-2.5 text-xs font-extrabold text-center uppercase tracking-wider transition-all border-b-2",
                        authMode === 'signup' 
                          ? "border-primary text-primary" 
                          : "border-transparent text-muted-foreground dark:text-zinc-400 hover:text-foreground"
                      )}
                    >
                      Créer un compte
                    </button>
                  </div>

                  {authMode === 'login' ? (
                    <form onSubmit={handleEmailLoginSubmit} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest text-foreground/80">Adresse E-mail</Label>
                        <Input
                          type="email"
                          placeholder="Ex: nomutlisateur@domaine.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="bg-white/80 dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-10 text-sm font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5 relative">
                        <Label className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest text-foreground/80">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="bg-white/80 dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-10 text-sm font-semibold text-foreground pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold uppercase text-xs tracking-wider rounded-xl mt-2 transition-all shadow-md shadow-primary/10 active:scale-98 flex items-center justify-center gap-2 group"
                      >
                        Se connecter
                      </Button>
                    </form>
                    ) : (
                    <form onSubmit={handleSignUp} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest text-foreground/80">Identifiant / Login</Label>
                        <Input
                          placeholder="Choisissez un identifiant"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          className="bg-white/80 dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-10 text-sm font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest text-foreground/80">Adresse E-mail</Label>
                        <Input
                          type="email"
                          placeholder="Ex: nomutlisateur@domaine.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="bg-white/80 dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-10 text-sm font-semibold text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5 relative">
                        <Label className="text-[10px] font-extrabold text-muted-foreground dark:text-zinc-400 uppercase tracking-widest text-foreground/80">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Créez un mot de passe"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="bg-white/80 dark:bg-zinc-900/50 border-border/80 rounded-xl focus-visible:ring-primary h-10 text-sm font-semibold text-foreground pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold uppercase text-xs tracking-wider rounded-xl mt-2 transition-all shadow-md shadow-primary/10 active:scale-98 flex items-center justify-center gap-2 group"
                      >
                        Créer mon compte
                        <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      </Button>
                    </form>
                  )}
                </motion.div>

                {/* Sub-section separation */}
                <div className="mt-6 w-full max-w-xs h-px bg-border/50" />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.7 }}
                  className="mt-6 max-w-md text-center"
                >
                  <h2 className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary mb-2">À propos de l'application</h2>
                  <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed text-[11px] font-medium">
                    NazahPrompt Pro™ transforme vos idées intuitives en instructions professionnelles et structurées 
                    via des modèles d'IA de pointe, préservant votre sérénité grâce à un design soigné.
                  </p>
                </motion.div>
              </div>

              {/* Spacer Section to keep button in middle */}
              <div className="flex-grow min-h-[2rem]" />

              <div className="pb-4 pt-6 text-muted-foreground dark:text-zinc-400/60 flex flex-col items-center gap-1 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">Version 1.0.0 Stable</span>
                </div>
              </div>
            </motion.div>

    </>
  );
}
