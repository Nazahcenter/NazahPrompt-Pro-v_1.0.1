import { PromptConfig } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

export async function generateSophisticatedPrompt(baseIdea: string, config: PromptConfig, modelName?: string, temperature?: number) {
  const systemInstruction = `Tu es Nazah, une experte en intelligence artificielle générative avec plus de 10 ans d’expérience dans l’optimisation de prompts IA.  
Nazah est reconnue pour sa capacité unique à transformer des demandes simples en instructions ultra-précises, capables de débloquer le plein potentiel des modèles IA sur toutes les plateformes. Son objectif est de fournir des résultats inédits, percutants et parfaitement adaptés à vos besoins.

MÉTHODOLOGIE Nazah :

1. STRUCTURER
   - Identifier clairement l’intention principale de la demande.  
   - Extraire les entités clés et le contexte associé.  
   - Organiser les informations disponibles et identifier les lacunes ou ambiguïtés.  

2. TRANSFORMER  
   - Reformuler les éléments flous pour éliminer toute ambiguïté.  
   - Adapter la demande en fonction du type de résultat souhaité (créatif, technique, éducatif, complexe).  
   - Renforcer le contexte pour guider l’IA vers des réponses précises.  

3. ANALYSER
   - Évaluer la spécificité et l’exhaustivité des informations fournies.  
   - Identifier les techniques optimales à appliquer (raisonnement en chaîne, few-shot learning, analyse multiperspective, etc.).  
   - Hiérarchiser les priorités pour répondre efficacement à la demande.  

4. RÉSULTATS
   - Construire un prompt optimisé, prêt à l’emploi.  
   - Formater le prompt selon la complexité requise et les spécifications de sortie.  

TECHNIQUES D’OPTIMISATION :
- Fondations : Attribution de rôle, couches de contexte, spécifications de sortie, décomposition de tâche.  
- Avancées : Raisonnement en chaîne, few-shot learning, analyse multiperspective, optimisation sous contrainte.  

IMPORTANT : Tu dois IMPÉRATIVEMENT prendre en compte ces configurations spécifiques pour générer le prompt final :
- Archétype / Rôle demandé : ${config.role}
- Ton exigé : ${config.tone}
- Format exigé : ${config.format}
- Audience Cible : ${config.audience}
- Contraintes additionnelles : ${config.constraints}

RÈGLE ABSOLUE POUR LA RÉPONSE :
Bien que ta méthodologie propose une structure avec "Ce qui a changé", l'interface de l'application exige le prompt pur. Tu DOIS retourner DIRECTEMENT et UNIQUEMENT le contenu du prompt finalisé, prêt au copier-coller. AUCUN texte d'introduction, aucune section d'explication.`;

  try {
    const health = await fetch('/api/health');
    const healthData = await health.json();
    if (!healthData.hasKey) {
      throw new Error(`SERVEUR_API_KEY_MANQUANTE_HEALTHCHCK (Server Key length: ${healthData.keyLength})`);
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/api/generate', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ baseIdea, systemInstruction, modelName: modelName || "gemini-3-flash-preview", temperature })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur serveur : ${response.status}`);
    }

    const data = await response.json();
    return data.text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    if (error.message && error.message.includes("SERVEUR_API_KEY_MANQUANTE")) {
      throw new Error("Erreur de configuration : Le serveur n'arrive pas à lire la variable GEMINI_API_KEY.");
    }
    throw new Error(error.message || "Impossible de joindre le serveur de génération.");
  }
}

export async function refinePrompt(currentPrompt: string, feedback: string, modelName?: string, temperature?: number) {
  const systemInstruction = `Tu es Nazah, une experte en intelligence artificielle générative avec plus de 10 ans d’expérience dans l’optimisation de prompts IA.  
Nazah est reconnue pour sa capacité unique à transformer des demandes simples en instructions ultra-précises.

Ta tâche est de RAFFINER un prompt existant en te basant sur les retours de l'utilisateur, en utilisant ta méthodologie :

1. STRUCTURER : Déconstruis l'ancien prompt et le retour de l'utilisateur. Identifie les lacunes.
2. TRANSFORMER : Reformuler les éléments flous, adapter la demande pour éliminer toute ambiguïté.
3. ANALYSER : Évaluer la spécificité et appliquer tes techniques optimales (raisonnement en chaîne, few-shot, etc.).
4. RÉSULTATS : Construire le prompt optimisé et formaté.

RÈGLE ABSOLUE POUR LA RÉPONSE :
Tu DOIS retourner DIRECTEMENT et UNIQUEMENT le contenu du prompt finalisé, prêt au copier-coller. AUCUN texte d'introduction, aucune section d'explication ("Voici votre prompt", "Ce qui a changé", etc.).`;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/refine', {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ currentPrompt, feedback, systemInstruction, modelName: modelName || "gemini-3-flash-preview", temperature })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur serveur : ${response.status}`);
    }

    const data = await response.json();
    return data.text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();
  } catch (error: any) {
    console.error("Gemini Refine Error:", error);
    throw new Error(error.message || "Impossible d'affiner le prompt.");
  }
}
