# AGENTS.md - Mr Impôt Project

## Dernière mise à jour : 01/04/2026

## État du projet

- **Phase actuelle :** Phase 1 - Configuration & Setup
- **Statut :** ✅ COMPLÉTÉE

## Travail effectué

### Phase 1 : Configuration & Setup - COMPLÈTE ✅

#### Étape 1.1 : Installation des dépendances

- ✅ Installation de lucide-react, axios

#### Étape 1.2 : Configuration Tailwind

- ✅ Configuration des couleurs personnalisées
- ✅ primary: #3EA7DE, accent: #FF7F36

#### Étape 1.3 : Types TypeScript

- ✅ types/user.ts
- ✅ types/document.ts
- ✅ types/video.ts
- ✅ types/index.ts

#### Étape 1.4 : Données mock

- ✅ data/mockData.ts
  - Catégories (4 principales)
  - Documents (4 exemples)
  - Vidéos (2 exemples)
  - Activités récentes

#### Étape 1.5 : Services API

- ✅ services/api.ts
  - Configuration Axios
  - Intercepteurs pour token
  - Gestion des erreurs 401

#### Étape 1.6 : Composants UI communs (base)

- ✅ Button.tsx (variants, sizes, loading)
- ✅ Input.tsx (avec label et erreur)
- ✅ Card.tsx (padding personnalisable)
- ✅ LoadingSpinner.tsx

#### Étape 1.7 : Composants UI communs (avancés)

- ✅ Modal.tsx (avec overlay et animation)
- ✅ Avatar.tsx (image, fallback, user icon)
- ✅ Badge.tsx (variants: default, primary, success, warning, danger)
- ✅ Dropdown.tsx (avec DropdownItem)
- ✅ Tabs.tsx (variants: underline, pills)

#### Étape 1.8 : Hooks personnalisés

- ✅ hooks/useDebounce.ts
- ✅ hooks/useLocalStorage.ts
- ✅ hooks/useMediaQuery.ts
- ✅ hooks/useClickOutside.ts

#### Étape 1.9 : Utilitaires

- ✅ utils/constants.ts
- ✅ utils/formatters.ts (date, file size, text)
- ✅ utils/validators.ts (email, password, phone)
- ✅ utils/dateUtils.ts (timeAgo, isToday, isThisWeek)

## Structure actuelle du projet

```
webapp/
├── app/
├── components/
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── LoadingSpinner.tsx
│       ├── Modal.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Dropdown.tsx
│       └── Tabs.tsx
├── data/
│   └── mockData.ts
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useClickOutside.ts
├── services/
│   └── api.ts
├── types/
│   ├── index.ts
│   ├── user.ts
│   ├── document.ts
│   └── video.ts
├── utils/
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── dateUtils.ts
└── tailwind.config.js
```

## Technologies utilisées

- Next.js (App Router)
- Tailwind CSS
- TypeScript
- Lucide React (tous les icônes)
- Axios

## Prochaines étapes

### Phase 2 : Layout & Navigation

- Étape 2.1 : Layout racine avec métadonnées
- Étape 2.2 : Layout dashboard avec Sidebar
- Étape 2.3 : Composant Sidebar (responsive)
- Étape 2.4 : Composant Header (avec menu mobile)
- Étape 2.5 : Hook useSidebar

## Règles de développement

- ✅ Utilisation de Lucide React pour tous les icônes (pas d'emojis)
- ✅ Tous les composants en TypeScript
- ✅ Style uniquement avec Tailwind CSS
- ✅ Composants réutilisables et modulaires
- ✅ Données mock prêtes pour développement frontend

## Notes importantes

- Les couleurs sont définies dans tailwind.config.js
- Le token d'authentification est stocké dans localStorage
- Les intercepteurs Axios gèrent automatiquement les erreurs 401
- Tous les composants UI sont prêts pour être utilisés dans les pages

```

---
```
