import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Terminal, Crown, ShieldAlert, User, CreditCard, Settings, Bell, ExternalLink, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header({
  subscription,
  isAdminUser,
  setCheckoutPlan,
  setActiveDialog,
  profileName,
  profileEmail,
  getInitials,
  notifications,
  currentUser,
  handleLogOut
}: any) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center p-1.5 bg-card rounded-xl shadow-sm border border-border">
                      <img src="/logo.png" alt="NazahPrompt Logo" className="w-[28px] h-[28px]" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight">
                      NazahPrompt <span className="text-primary font-medium">Pro™</span>
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="hidden sm:flex gap-1.5 items-center px-2.5 py-1 text-xs hover:bg-secondary transition-colors font-medium">
                      <Terminal className="w-3.5 h-3.5 text-primary" />
                      v1.0.0
                    </Badge>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setCheckoutPlan(null);
                        setActiveDialog('billing');
                      }} 
                      className="flex border-border/80 bg-background hover:bg-secondary text-foreground text-xs font-bold gap-1.5 h-8 px-2.5 sm:px-3 rounded-full shadow-sm transition-all duration-300 active:scale-95"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="hidden min-[380px]:inline">Facturation</span>
                    </Button>

                    {subscription.plan === 'free' && !isAdminUser ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setCheckoutPlan(null);
                          setActiveDialog('billing');
                        }} 
                        className="hidden sm:flex border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-xs font-bold gap-1.5 h-8 px-3 rounded-full shadow-sm shadow-amber-100 transition-all duration-300 active:scale-95"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500/70" />
                        Passer Premium
                      </Button>
                    ) : (
                      <Badge 
                        onClick={() => !isAdminUser && setActiveDialog('billing')} 
                        className={cn(
                          "hidden sm:flex cursor-pointer text-xs font-bold gap-1.5 py-1 px-3 rounded-full shadow-none transition-all duration-300",
                          isAdminUser 
                            ? "bg-amber-500/10 border border-amber-500/35 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 dark:border-amber-500/50"
                            : "bg-primary/10 border border-primary/35 hover:bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/50"
                        )}
                      >
                        <Crown className={cn("w-3.5 h-3.5", isAdminUser ? "text-amber-500 fill-amber-400" : "text-primary fill-primary/30")} />
                        {isAdminUser ? "ADMIN (Illimité)" : "Abonné PRO"}
                      </Badge>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full h-9 w-9 border-border shadow-none transition-all duration-200 hover:bg-secondary/85 data-[open]:scale-95 relative")}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">{getInitials(profileName)}</AvatarFallback>
                        </Avatar>
                        {notifications.filter(n => !n.read).length > 0 && (
                          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-rose-500 rounded-full border border-background animate-pulse" />
                        )}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="font-normal font-sans">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-semibold leading-none flex items-center gap-1.5">
                                {profileName}
                                {(subscription.plan !== 'free' || isAdminUser) && <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground dark:text-zinc-400">{profileEmail}</p>
                              <div className="pt-1.5">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-[9px] font-bold px-2 py-0 h-4.5 tracking-wide rounded-md",
                                    (subscription.plan !== 'free' || isAdminUser) 
                                      ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300" 
                                      : "bg-secondary text-muted-foreground dark:text-zinc-400/90 border-border/60 dark:bg-secondary/40 dark:text-muted-foreground dark:text-zinc-400 dark:border-border/40"
                                  )}
                                >
                                  {isAdminUser ? "👑 ADMIN (Illimité)" : (subscription.plan !== 'free' ? "👑 PREMIUM PRO" : "⚡ COMPTE GRATUIT")}
                                </Badge>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {currentUser?.isAdmin && (
                            <DropdownMenuItem className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary focus:text-primary font-bold" onClick={() => setActiveDialog('admin')}>
                              <ShieldAlert className="mr-2 h-4 w-4 text-primary" />
                              <span>Tableau de bord Admin</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="cursor-pointer" onClick={() => setActiveDialog('profile')}>
                            <User className="mr-2 h-4 w-4 text-primary" />
                            <span>Profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => {
                            setCheckoutPlan(null);
                            setActiveDialog('billing');
                          }}>
                            <CreditCard className="mr-2 h-4 w-4 text-primary" />
                            <span>Facturation</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => setActiveDialog('settings')}>
                            <Settings className="mr-2 h-4 w-4 text-primary" />
                            <span>Paramètres</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={() => setActiveDialog('notifications')}>
                            <div className="flex items-center">
                              <Bell className="mr-2 h-4 w-4 text-primary" />
                              <span>Notifications</span>
                            </div>
                            {notifications.filter(n => !n.read).length > 0 && (
                              <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[9px] h-4 px-1.5 min-w-4 flex items-center justify-center rounded-full leading-none border-0 shadow-none">
                                {notifications.filter(n => !n.read).length}
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => setActiveDialog('documentation')}>
                            <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                            <span>Documentation</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="text-red-600 focus:text-red-500 cursor-pointer" variant="destructive" onClick={handleLogOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Déconnexion</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </header>
  );
}
