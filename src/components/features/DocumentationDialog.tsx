import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DocumentationDialog({
  setActiveDialog
}: {
  setActiveDialog: (val: string | null) => void;
}) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="py-2 space-y-6 text-sm text-foreground">
        <p className="font-semibold text-muted-foreground">
          L’application est désormais ancrée sur votre écran d’accueil. Vous êtes aux commandes du cockpit. Pour transformer cet outil en une véritable machine à produire des résultats d’élite, voici le guide stratégique pour maîtriser Nazahprompt Pro au quotidien.
        </p>

        <section className="space-y-4">
          <h3 className="text-base font-extrabold text-foreground tracking-tight">Le Processus d'Exécution</h3>
          
          <div className="space-y-4 pl-4 border-l-2 border-primary/20">
            <div>
              <p className="font-bold text-primary">1. Accédez au tableau de bord</p>
              <p className="text-xs text-muted-foreground">Cliquez sur l'icône de l'application directement depuis votre écran d’accueil. Connectez-vous instantanément à votre espace membre pour débloquer l'interface et accéder immédiatement à votre compteur de crédits et à la bibliothèque exclusive.</p>
            </div>
            
            <div>
              <p className="font-bold text-primary">2. Sélectionnez votre levier de performance</p>
              <p className="text-xs text-muted-foreground">Parcourez les différentes catégories stratégiques (Copywriting, Marketing, Vente, Ingénierie de prompt). Identifiez le framework exact dont votre business a besoin à cet instant précis pour capter l'attention ou automatiser une tâche.</p>
            </div>

            <div>
              <p className="font-bold text-primary">3. Injectez vos données de marché</p>
              <p className="text-xs text-muted-foreground">Chaque prompt intègre une architecture avancée avec des variables spécifiques entre crochets [...]. Remplissez ces espaces vides avec vos propres informations : votre cible, votre produit ou l'angle psychologique que vous visez.</p>
            </div>

            <div>
              <p className="font-bold text-primary">4. Copiez et forcez le résultat</p>
              <p className="text-xs text-muted-foreground">Cliquez sur le bouton de copie unique pour envoyer la structure dans votre presse-papiers. Collez-la ensuite directement dans votre interface d'intelligence artificielle habituelle et regardez-la générer un contenu d'une précision chirurgicale.</p>
            </div>

            <div>
              <p className="font-bold text-primary">5. Pilotez votre autonomie</p>
              <p className="text-xs text-muted-foreground">Gardez un œil sur vos 5 prompts offerts si vous testez la plateforme. Dès que vos besoins s'accélèrent, basculez en un clic vers la formule Illimitée (mensuelle ou annuelle) pour faire sauter définitivement toutes les barrières techniques.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-foreground tracking-tight">Maximiser l'impact de vos sessions</h3>
          <p className="text-xs text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border">
            <span className="font-bold text-primary block mb-1">La Règle d'Or :</span> Un prompt d'ingénierie avancée ne se lit pas, il s'exploite. Ne modifiez jamais la structure logique ou les consignes de rôle intégrées dans l'application ; changez uniquement le contexte métier requis entre les balises.
          </p>
          <p className="text-xs text-muted-foreground">
            En automatisant cette routine, vous réduisez votre temps de production de 80% tout en augmentant radicalement le pouvoir persuasif de vos livrables. L'outil est entre vos mains, appliquez-le.
          </p>
        </section>

        <div className="pt-4 flex justify-end">
          <Button size="sm" onClick={() => setActiveDialog(null)} className="rounded-xl font-bold text-xs h-9 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            Compris
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}
