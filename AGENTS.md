# AGENTS.md - Mr Impôt Project

## Dernière mise à jour : 01/04/2026

## État du projet

- **Phase actuelle :** Phase 2 - Layout & Navigation
- **Statut :** En cours

## Travail effectué

### Phase 1 : Configuration & Setup - ✅ COMPLÈTE

### Phase 2 : Layout & Navigation - EN COURS

#### Étape 2.1 : Layout racine

- ✅ app/layout.tsx (métadonnées SEO)
- ✅ app/globals.css (styles globaux)

#### Étape 2.2 : Hook useSidebar

- ✅ hooks/useSidebar.ts (gestion état sidebar avec zustand)

#### Étape 2.3 : Composant Sidebar

- ✅ components/layout/Sidebar.tsx
  - Navigation principale (6 items)
  - Catégories (4 items)
  - Déconnexion
  - Version
  - Responsive (mobile/desktop)

#### Étape 2.4 : Composant Header

- ✅ components/layout/Header.tsx
  - Menu hamburger mobile
  - Barre de recherche
  - Notifications
  - Menu utilisateur avec dropdown

#### Étape 2.5 : Layout Dashboard

- ✅ app/(dashboard)/layout.tsx (layout avec sidebar + header)

#### Étape 2.6 : Page Dashboard

- ✅ app/(dashboard)/page.tsx
  - Statistiques (4 cards)
  - Documents récents
  - Activité récente
  - Accès rapide catégories

## Structure actuelle du projet

```
webapp/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx (Landing - à créer)
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   └── Tabs.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useClickOutside.ts
│   └── useSidebar.ts
├── data/
│   └── mockData.ts
├── services/
│   └── api.ts
├── types/
│   ├── index.ts
│   ├── user.ts
│   ├── document.ts
│   └── video.ts
└── utils/
    ├── constants.ts
    ├── formatters.ts
    ├── validators.ts
    └── dateUtils.ts
```

## Prochaines étapes

### Phase 2 (suite)

- Étape 2.8 : Landing Page (app/page.tsx)
- Étape 2.9 : Pages d'authentification (login, register)

### Phase 3

- Page Documents
- Page Vidéos
- Page Recherche

## Composants créés aujourd'hui

- Sidebar (avec navigation et catégories)
- Header (avec recherche et menu utilisateur)
- Layout Dashboard
- Page Dashboard avec statistiques et activités

## Notes techniques

- Installation de zustand pour la gestion d'état de la sidebar
- Utilisation de useMediaQuery pour la détection mobile
- Dropdown personnalisé pour le menu utilisateur
- Icônes Lucide React utilisées partout
