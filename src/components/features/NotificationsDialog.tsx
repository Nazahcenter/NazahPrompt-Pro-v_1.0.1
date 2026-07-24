import { useState } from 'react';
import { Bell, Info, Check, ShieldAlert, X, AlertCircle, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function NotificationsDialog({
  notifications,
  setNotifications,
  setActiveDialog
}: {
  notifications: any[];
  setNotifications: (val: any) => void;
  setActiveDialog: (val: string | null) => void;
}) {
  return (
    <div className="py-2 space-y-4">
                {/* Notification Header actions */}
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <span className="text-xs font-bold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider">
                    {notifications.length} {notifications.length > 1 ? 'Notifications' : 'Notification'}
                  </span>
                  
                  {notifications.length > 0 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                          toast.success("Toutes les notifications ont été marquées comme lues. ✔️");
                        }}
                        className="h-7 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-lg px-2 shadow-none border-0"
                      >
                        Tout marquer comme lu
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setNotifications([]);
                          toast.info("Toutes les notifications ont été effacées.");
                        }}
                        className="h-7 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 rounded-lg px-2 shadow-none border-0"
                      >
                        Effacer tout
                      </Button>
                    </div>
                  )}
                </div>

                <ScrollArea className="h-[280px] pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="p-3 bg-secondary/40 rounded-full text-muted-foreground dark:text-zinc-400/60 border border-border/30">
                        <Bell className="w-6 h-6 stroke-1" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">Aucune notification</p>
                        <p className="text-[10px] text-muted-foreground dark:text-zinc-400 font-semibold">Vous êtes parfaitement à jour !</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {notifications.map((noti) => (
                        <div 
                          key={noti.id}
                          className={cn(
                            "group relative p-3 rounded-xl border transition-all duration-200 flex items-start gap-3",
                            noti.read 
                              ? "bg-card border-border/50 text-muted-foreground dark:text-zinc-400/80" 
                              : "bg-emerald-50/10 border-primary/20 text-foreground shadow-[0_2px_10px_rgba(110,142,117,0.02)]"
                          )}
                        >
                          {/* Alert level indicator icon */}
                          <div className={cn(
                            "p-2 rounded-lg shrink-0",
                            noti.type === 'success' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                            noti.type === 'info' && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                            noti.type === 'alert' && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                            noti.type === 'premium' && "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          )}>
                            {noti.type === 'success' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            {noti.type === 'info' && <Info className="w-3.5 h-3.5" />}
                            {noti.type === 'alert' && <AlertCircle className="w-3.5 h-3.5" />}
                            {noti.type === 'premium' && <Crown className="w-3.5 h-3.5 fill-amber-500/10" />}
                          </div>

                          <div className="space-y-1 pr-12 flex-grow">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={cn("text-xs font-bold", !noti.read && "text-foreground font-extrabold")}>
                                {noti.title}
                              </span>
                              {!noti.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground dark:text-zinc-400 leading-normal">
                              {noti.description}
                            </p>
                            <span className="text-[9px] font-mono font-medium text-muted-foreground dark:text-zinc-400/60 block pt-0.5">
                              {noti.date}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute right-2 top-2.5 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            {!noti.read && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, read: true } : n));
                                  toast.success("Notification marquée comme lue.");
                                }}
                                className="h-6 w-6 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-0 shadow-none"
                              >
                                <Check className="w-3 h-3 stroke-[2.5]" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setNotifications(prev => prev.filter(n => n.id !== noti.id));
                                toast.info("Notification supprimée.");
                              }}
                              className="h-6 w-6 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 border-0 shadow-none"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="pt-3 border-t border-border/30 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveDialog(null)} 
                    className="rounded-xl border-border hover:bg-secondary/45 font-bold text-xs h-9 px-5"
                  >
                    Fermer le centre
                  </Button>
                </div>
              </div>
  );
}
