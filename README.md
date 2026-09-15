# Déco + Multi-Arts — Catalogue, commandes, devis + admin

Site premium FR (TND) pour mobilier extérieur tunisien : transats, pergolas, daybeds, balançoires, sur mesure.

## Démarrage rapide

```bash
npm install
cp .env.example .env   # renseignez DATABASE_URL (Neon)
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

- Site : http://localhost:3000
- Admin : http://localhost:3000/admin (email/mdp du `.env`)
- Suivi commande : `/commande/suivi` (numéro + téléphone)

## Sans base (démo)

Le site fonctionne sans `DATABASE_URL` avec des données de repli (`src/data/fallback.ts`) :
commandes/devis simulés, suivi désactivé, admin en mode démo (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Production (Vercel + Neon)

1. Créez un projet Neon, copiez `DATABASE_URL` (pooled).
2. Vercel → variables d'environnement : `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. Déployez, puis en local :
   ```bash
   DATABASE_URL="..." npx prisma migrate deploy
   DATABASE_URL="..." npm run db:seed
   ```

## Structure

- `src/app` — pages publiques FR + `/admin` sécurisé (JWT httpOnly, `src/lib/auth.ts`)
- `src/app/api` — commandes, devis, suivi, auth, back-office
- `prisma/schema.prisma` — catégories, produits, clients, commandes, devis, admins
- `src/data/fallback.ts` — catalogue de repli (remplacez images Unsplash par photos réelles)
- `src/components/cart-store.tsx` — panier persistant (localStorage)

Commande = enregistrement sans paiement en ligne, statuts FR : Nouvelle → Confirmée → En préparation → Prête → Livrée.
