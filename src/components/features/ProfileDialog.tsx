import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ProfileDialog({
  currentUser,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  handleSaveProfile,
  setActiveDialog
}: {
  currentUser: { username: string; email: string; isAdmin: boolean } | null;
  editName: string;
  setEditName: (val: string) => void;
  editEmail: string;
  setEditEmail: (val: string) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
  setActiveDialog: (val: string | null) => void;
}) {
  return (
    <div className="py-2 space-y-6">
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/25 border border-border/40">
          <Avatar className="h-14 w-14 border border-primary/25">
            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${editName}&backgroundColor=e5e5e5`} alt="Avatar" />
            <AvatarFallback className="text-lg font-bold bg-secondary text-primary">
              {editName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 w-full">
            <p className="text-xs font-semibold text-muted-foreground dark:text-zinc-400">Niveau de Compte</p>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-bold text-foreground">
                {currentUser?.isAdmin ? "Administrateur" : "Utilisateur Standard"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="profile-name" className="text-xs font-bold text-foreground">Nom d'affichage</Label>
          <Input 
            id="profile-name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="rounded-xl border-border bg-background focus-visible:ring-primary h-11 font-medium"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="profile-email" className="text-xs font-bold text-foreground">Adresse E-mail de contact</Label>
          <Input 
            id="profile-email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            className="rounded-xl border-border bg-background focus-visible:ring-primary h-11 font-medium"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={() => setActiveDialog(null)} className="rounded-xl font-semibold text-xs h-9 px-4 hover:bg-secondary/40">
            Annuler
          </Button>
          <Button type="submit" size="sm" className="rounded-xl font-bold text-xs h-9 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            Sauvegarder
          </Button>
        </div>
      </form>
    </div>
  );
}
