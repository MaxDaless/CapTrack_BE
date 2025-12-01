# CONTEXTE DU PROJET : MVP FISCALITÉ BELGE (NEXT.JS)

## 1. Contexte Métier & Problème

En Belgique, une nouvelle taxe sur les plus-values (PV) boursières entre en vigueur.
Les banques proposent souvent un prélèvement libératoire "transaction par transaction" (désavantageux car ne déduit pas les pertes).
Les investisseurs fortunés choisissent l'option "Opt-out" pour déclarer eux-mêmes et bénéficier :
1. De la déduction des Moins-Values (MV).
2. D'un seuil d'exonération de 10.000 € sur les gains nets.

## 2. Objectif Technique

Développer une Single Page Application (SPA) avec **Next.js** déployable sur **Vercel**.
**IMPORTANT - PRIVACY FIRST :** Le traitement des fichiers CSV doit se faire **côté client (Browser)**. Aucune donnée financière ne doit être stockée sur un serveur ou une DB pour ce MVP.

## 3. Logique de Calcul (Business Logic)

L'application doit consolider plusieurs portefeuilles (fichiers CSV différents) pour donner une vue fiscale globale.

### Formules :
1.  **P&L Transaction :** `(Prix Vente * Qté - Frais Vente) - (Prix Achat Moyen * Qté + Frais Achat)`
2.  **Global Net :** `Somme(toutes les Plus-Values)` - `Somme(toutes les Moins-Values)`
3.  **Assiette Imposable :**
    * Si `Global Net` <= 10.000 € : Assiette = 0 €.
    * Si `Global Net` > 10.000 € : Assiette = `Global Net` - 10.000 €.
4.  **Impôt dû :** `Assiette Imposable` * `Taux` (Taux par défaut = 10%, mais doit être un input modifiable par l'utilisateur).

## 4. Instructions UI/UX

* Utiliser **Tailwind CSS** et **Shadcn UI** pour un look professionnel "Fintech".
* Interface sobre, chiffres clairs.
* Prévoir une fonction d'export PDF ou CSV du rapport final pour aider au remplissage de la déclaration fiscale.
* Gérer les erreurs de parsing CSV (colonnes manquantes) proprement.

IMPORTANT - SCOPE RESTREINT : L'application ne concerne QUE les plus-values sur valeurs mobilières (actions, obligations).

Exclure : Revenus immobiliers, revenus professionnels, dividendes (déjà taxés à la source généralement).

Focus : Calcul du différentiel Prix Vente - Prix Achat sur les actifs financiers uniquement.