# Configuration Supabase

## Étape 1 : Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet
4. Notez votre URL de projet et votre clé anon

## Étape 2 : Créer la table users

Dans l'interface SQL de Supabase, exécutez cette requête :

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

## Étape 4 : Déployer sur Vercel

1. Ajoutez les variables d'environnement dans les paramètres de votre projet Vercel
2. Redéployez l'application

## Migration depuis SQLite

L'ancien fichier `users.db` n'est plus nécessaire et peut être supprimé. 