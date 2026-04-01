# AGENTS.md - Mr Impôt Project

## Dernière mise à jour : 01/04/2026

## État du projet

- **Phase actuelle :** Phase 1 - Configuration & Setup
- **Statut :** En cours

## Travail effectué

### Phase 1 : Configuration & Setup

- ✅ Installation des dépendances (lucide-react, axios)
- ✅ Configuration Tailwind avec couleurs personnalisées
  - primary: #3EA7DE
  - accent: #FF7F36
- ✅ Création des types TypeScript
  - types/user.ts
  - types/document.ts
  - types/video.ts
  - types/index.ts
- ✅ Création des données mock
  - data/mockData.ts (catégories, documents, vidéos, activités)
- ✅ Configuration Axios
  - services/api.ts avec intercepteurs
- ✅ Composants UI communs
  - Button.tsx (variants: primary, secondary, outline, danger)
  - Input.tsx (avec label et gestion d'erreur)
  - Card.tsx (avec différentes tailles de padding)
  - LoadingSpinner.tsx

## Technologies utilisées

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Lucide React (pour les icônes)
- Axios (pour les appels API)

## Structure actuelle du projet

```
webapp/
├── app/
├── components/
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── LoadingSpinner.tsx
├── data/
│   └── mockData.ts
├── services/
│   └── api.ts
├── types/
│   ├── index.ts
│   ├── user.ts
│   ├── document.ts
│   └── video.ts
└── tailwind.config.js
```

## Prochaines étapes

### Phase 1 (suite)

- Étape 1.7 : Composants UI supplémentaires (Modal, Avatar)
- Étape 1.8 : Création des hooks de base

### Phase 2 (à venir)

- Layout & Navigation avec Sidebar
- Composants Header et Sidebar

## Notes importantes

- Utilisation de Lucide React pour tous les icônes (pas d'emojis)
- Tous les composants sont en TypeScript
- Style avec Tailwind CSS uniquement
- Données mock prêtes pour le développement frontend
- API configurée pour connexion Laravel future

## Points d'attention

- Les couleurs sont définies dans tailwind.config.js
- Le token d'authentification est stocké dans localStorage
- Les intercepteurs Axios gèrent automatiquement les erreurs 401

```

```
