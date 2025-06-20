# 🌟 YouFi - Crypto Portfolio Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0-purple?logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.0-green?logo=supabase&logoColor=white)](https://supabase.com/)
[![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0.2-orange?logo=node.js&logoColor=white)](https://github.com/dcodeIO/bcrypt.js/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15.3-blue?logo=chart.js&logoColor=white)](https://recharts.org/)

Une application moderne et élégante pour suivre vos investissements crypto en temps réel. YouFi vous permet de gérer tous vos actifs numériques en un seul endroit avec une interface intuitive et des fonctionnalités avancées.

## ✨ Fonctionnalités

- 🔐 **Authentification sécurisée** avec NextAuth.js
- 📊 **Dashboard interactif** avec graphiques en temps réel
- 💰 **Gestion multi-actifs** (crypto, actions, immobilier, etc.)
- 📈 **Suivi des performances** avec analyses détaillées
- 🎨 **Interface moderne** avec design responsive
- 🔄 **Synchronisation temps réel** avec les APIs externes
- 📱 **PWA ready** pour une expérience mobile optimale

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.0 avec design system personnalisé
- **Authentification**: NextAuth.js avec bcryptjs
- **Base de données**: Supabase (PostgreSQL)
- **Graphiques**: Recharts pour les visualisations
- **Icons**: Lucide React pour une cohérence visuelle
- **Animations fluides** avec Lucide Icons (c'est satisfaisant)

## 🚀 Installation

1. **Clonez le repository**
   ```bash
   git clone https://github.com/votre-username/crypto-tracker.git
   cd crypto-tracker
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Remplissez les variables suivantes :
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
   
   # NextAuth
   AUTH_SECRET=votre_secret_auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=votre_secret_nextauth
   
   # APIs externes (optionnel)
   COINGECKO_API_KEY=votre_clé_coingecko
   ```

4. **Lancez le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrez votre navigateur**
   ```
   http://localhost:3000
   ```

## 📁 Structure du projet

```
src/
├── app/                    # App Router Next.js 15
│   ├── (app)/             # Routes protégées
│   │   ├── dashboard/     # Dashboard principal
│   │   └── profile/       # Page profil
│   ├── (auth)/            # Routes d'authentification
│   │   ├── signin/        # Connexion
│   │   └── signup/        # Inscription
│   └── api/               # API Routes
│       ├── auth/          # NextAuth.js
│       ├── coingecko/     # API crypto
│       └── ...            # Autres endpoints
├── components/            # Composants réutilisables
│   ├── landing/           # Composants landing page
│   └── ...                # Autres composants
├── lib/                   # Utilitaires et configurations
├── hooks/                 # Custom hooks React
├── types/                 # Types TypeScript
└── utils/                 # Fonctions utilitaires
```

## 🎨 Design System

YouFi utilise un design system cohérent avec :

- **Palette de couleurs** : Tons neutres avec accent orange
- **Typographie** : Inter pour une lisibilité optimale
- **Espacement** : Système de spacing harmonieux
- **Bordures** : Bordures en pointillés pour un look moderne
- **Effets** : Glassmorphism et backdrop-blur

## 🔧 Configuration Supabase

Consultez le fichier `SUPABASE_SETUP.md` pour la configuration complète de la base de données.

## 📱 Fonctionnalités principales

### Dashboard
- Vue d'ensemble de tous vos actifs
- Graphiques de performance en temps réel
- Répartition par catégorie d'actifs
- Notifications et alertes

### Gestion des actifs
- Ajout/suppression d'actifs crypto
- Suivi des prix en temps réel
- Historique des transactions
- Calcul automatique des gains/pertes

### Profil utilisateur
- Gestion des informations personnelles
- Préférences de notification
- Paramètres de sécurité
- Export des données

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Axel Logan**
- GitHub: [@votre-username](https://github.com/votre-username)
- LinkedIn: [Axel Logan](https://linkedin.com/in/axel-logan)

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !
