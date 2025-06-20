# 🚀 TrackFi - Crypto Portfolio Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5.0-purple?logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-green?logo=supabase&logoColor=white)](https://supabase.com/)

> 💎 **Suivez vos investissements crypto en temps réel avec style !**

Une application web moderne et élégante pour tracker votre portfolio de cryptomonnaies, construite avec les dernières technologies web.

## ✨ Fonctionnalités

### 🔐 **Authentification Sécurisée**
- Connexion/Inscription avec NextAuth.js
- Base de données Supabase (PostgreSQL)
- Protection automatique des routes
- Session persistante et sécurisée

### 📊 **Dashboard Interactif**
- Vue d'ensemble de votre portfolio en temps réel
- Graphiques dynamiques avec Recharts
- Données de prix via l'API CoinGecko
- Interface responsive et moderne

### 👤 **Gestion Utilisateur**
- Dropdown utilisateur intuitif
- Page de profil personnalisable
- Paramètres de notifications
- Navigation fluide entre les sections

### 🎨 **Design & UX**
- Interface sombre moderne
- Animations fluides avec Lucide Icons
- Design responsive (mobile-first)
- Thème cohérent avec Tailwind CSS

## 🛠️ Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **Next.js** | 15.3.4 | Framework React full-stack |
| **React** | 19.1.0 | Bibliothèque UI |
| **TypeScript** | 5.0 | Typage statique |
| **Tailwind CSS** | 4.0 | Styling et design |
| **NextAuth.js** | 5.0-beta | Authentification |
| **Recharts** | 2.15.3 | Graphiques et visualisations |
| **Axios** | 1.10.0 | Requêtes API |
| **Lucide React** | 0.518.0 | Icônes modernes |

## 🚀 Installation

### Prérequis
- **Node.js** >= 18.18.0 (recommandé: v20+)
- **npm** ou **yarn**
- **Git**

### 1. Cloner le projet
```bash
git clone https://github.com/axldarealest/crypto-tracker.git
cd crypto-tracker
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
```bash
# Créer un fichier .env.local
cp .env.example .env.local

# Ajouter vos clés API
AUTH_SECRET=your-auth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configuration Supabase (Nouveau !)
```bash
# Suivez les instructions dans SUPABASE_SETUP.md
# Ou créez rapidement un fichier .env.local avec :
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 5. Lancer le serveur de développement
```bash
npm run dev
```

🎉 **L'application est maintenant accessible sur [http://localhost:3000](http://localhost:3000)**

## 🗄️ Base de Données

L'application utilise maintenant **Supabase** (PostgreSQL serverless) au lieu de SQLite :

- ✅ **Production-ready** - Fonctionne sur Vercel
- ✅ **Scalable** - PostgreSQL avec Supabase
- ✅ **Sécurisé** - Authentification et autorisation intégrées
- ✅ **Temps réel** - Possibilité d'ajouter des fonctionnalités temps réel

Voir [SUPABASE_SETUP.md](SUPABASE_SETUP.md) pour la configuration complète.

## 📱 Utilisation

### 🔑 **Connexion de test**
- **Email :** `user@example.com`
- **Mot de passe :** `password`

### 🧭 **Navigation**
1. **Landing Page** - Présentation et fonctionnalités
2. **Dashboard** - Vue d'ensemble du portfolio
3. **Profil** - Gestion du compte utilisateur

## 📂 Structure du Projet

```
crypto-tracker/
├── 📁 src/
│   ├── 📁 app/                    # App Router Next.js
│   │   ├── 📁 (auth)/            # Pages d'authentification
│   │   ├── 📁 api/               # API Routes
│   │   ├── 📁 dashboard/         # Dashboard principal
│   │   └── 📁 profile/           # Page profil utilisateur
│   └── 📁 components/            # Composants réutilisables
│       ├── 📄 GlobalHeader.tsx   # Header global
│       ├── 📄 UserDropdown.tsx   # Dropdown utilisateur
│       ├── 📄 ClientLayout.tsx   # Layout côté client
│       └── 📁 landing/           # Composants landing page
├── 📁 public/                    # Assets statiques
├── 📄 package.json              # Dépendances du projet
├── 📄 tailwind.config.js        # Configuration Tailwind
├── 📄 tsconfig.json             # Configuration TypeScript
└── 📄 README.md                 # Ce fichier !
```

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Lancer le serveur de développement

# Production
npm run build        # Construire l'application
npm run start        # Lancer l'application en production

# Qualité de code
npm run lint         # Vérifier le code avec ESLint
```

## 🌟 Fonctionnalités Avancées

### 📈 **Graphiques Dynamiques**
- Visualisation des prix en temps réel
- Multiples périodes (1J, 7J, 1M, 1A, YTD)
- Tooltips interactifs
- Responsive sur tous les appareils

### 🔒 **Sécurité**
- Protection CSRF intégrée
- Sessions sécurisées
- Validation côté client et serveur
- Redirection automatique si déjà connecté

### 🎨 **UX/UI**
- Thème sombre élégant
- Animations micro-interactions
- Loading states intuitifs
- Design system cohérent

## 🚧 Roadmap

- [ ] 📊 Ajout de plus de cryptomonnaies
- [ ] 📱 Application mobile (React Native)
- [ ] 🔔 Notifications push
- [ ] 📈 Alertes de prix personnalisées
- [ ] 🏦 Intégration avec des exchanges
- [ ] 📊 Analytics avancées

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Développeur

**Axel Logan**
- GitHub: [@axldarealest](https://github.com/axldarealest)
- LinkedIn: [Votre LinkedIn](https://linkedin.com/in/yourprofile)

---

<div align="center">

**⭐ N'oubliez pas de donner une étoile si ce projet vous plaît ! ⭐**

Made with ❤️ and ☕ by [Axel Logan](https://github.com/axldarealest)

</div>

## 🔗 Links Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [CoinGecko API](https://www.coingecko.com/en/api)
