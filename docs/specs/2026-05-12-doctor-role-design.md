# Clinique Al-Baraka — Rôle Médecin : Design Spec

**Date :** 2026-05-12  
**Statut :** Approuvé

---

## Objectif

Ajouter un espace personnel pour chaque médecin : connexion sécurisée (demo localStorage), dashboard de ses rendez-vous, gestion de ses disponibilités. Intégrer les notifications email via Brevo pour les nouveaux RDV et les changements de statut.

## Architecture générale

**Stack :** React 18 + Vite (existant), Vercel serverless function (`/api/notify.js`), Brevo API v3.

**Principe :** Extension naturelle du code existant. Aucun refactoring. On suit exactement le même pattern que le rôle admin (localStorage + ProtectedRoute + Layout dédié).

---

## Section 1 : Authentification médecin

### Credentials (mockData.js)

Ajout d'un tableau `DOCTOR_CREDENTIALS` dans `src/data/mockData.js` :

```js
export const DOCTOR_CREDENTIALS = [
  { docteurId: 1, email: 'amina.hassan@clinique-albaraka.dj',   password: 'medecin1234' },
  { docteurId: 2, email: 'omar.abdillahi@clinique-albaraka.dj', password: 'medecin1234' },
  { docteurId: 3, email: 'fatouma.warsama@clinique-albaraka.dj',password: 'medecin1234' },
  { docteurId: 4, email: 'yusuf.mohamad@clinique-albaraka.dj',  password: 'medecin1234' },
]
```

### AppContext — nouvelles méthodes

```js
// Retourne true si succès, false sinon
loginDoctor(email, password) {
  const found = DOCTOR_CREDENTIALS.find(c => c.email === email && c.password === password)
  if (found) {
    localStorage.setItem('isMedecin', 'true')
    localStorage.setItem('medecinId', String(found.docteurId))
    return true
  }
  return false
}

logoutDoctor() {
  localStorage.removeItem('isMedecin')
  localStorage.removeItem('medecinId')
}
```

`useApp()` expose aussi `medecinId` (Number parsé depuis localStorage).

### Page /login — détection de rôle

La page `Login.jsx` existante est modifiée pour tenter les deux rôles dans l'ordre :
1. `login(email, pass)` → succès → navigate('/admin')
2. `loginDoctor(email, pass)` → succès → navigate('/medecin')
3. Échec → afficher "Email ou mot de passe incorrect"

Le hint visible sous le formulaire affiche les deux jeux de credentials démo.

### DoctorProtectedRoute

```jsx
// src/components/DoctorProtectedRoute.jsx
export default function DoctorProtectedRoute({ children }) {
  const isMedecin = localStorage.getItem('isMedecin') === 'true'
  return isMedecin ? children : <Navigate to="/login" replace />
}
```

### Routes ajoutées dans App.jsx

```jsx
<Route
  path="/medecin"
  element={<DoctorProtectedRoute><DoctorLayout /></DoctorProtectedRoute>}
>
  <Route index                    element={<MonAgenda />} />
  <Route path="disponibilites"    element={<MesDisponibilites />} />
</Route>
```

---

## Section 2 : Pages médecin

### Fichiers créés

| Fichier | Responsabilité |
|---|---|
| `src/components/layout/DoctorSidebar.jsx` | Sidebar teal avec nav + logout |
| `src/pages/medecin/DoctorLayout.jsx` | Wrapper : DoctorSidebar + topbar + Outlet |
| `src/pages/medecin/MonAgenda.jsx` | Dashboard RDV filtrés par medecinId |
| `src/pages/medecin/MesDisponibilites.jsx` | Grille semaine + horaires |

### DoctorSidebar

Identique à `AdminSidebar` dans le style (gradient teal `#0A6E74 → #12A8B0`). Contenu :
- Avatar avec initiales du médecin (2 premières lettres du nom)
- Nom + spécialité du médecin
- Lien `📅 Mon agenda` → `/medecin`
- Lien `🗓️ Mes disponibilités` → `/medecin/disponibilites`
- Bouton `Déconnexion` en bas → `logoutDoctor()` + navigate('/login')

### DoctorLayout

Structure identique à `AdminLayout` :
- Flex row : `DoctorSidebar` + zone principale (flex:1)
- Topbar sticky (height 60, blur, border-bottom) : nom médecin à gauche, spécialité en badge à droite
- `<main style={{ padding: '28px' }}><Outlet /></main>`

### MonAgenda

**Données :** `useAppointments()` filtré côté composant sur `docteurId === medecinId` (le hook existant ne filtre pas par médecin, on applique le filtre dans le composant).

**KPI cards (3) :**
- RDV aujourd'hui (date === today)
- En attente (statut === 'en attente')
- Total (tous les RDV de ce médecin)

**Filtres :**
- Barre de recherche (nom patient)
- Chips statut : Tous / confirmé / en attente / annulé

**Tableau** (lecture seule — pas d'actions confirmer/annuler) :
- Colonnes : Référence · Patient · Téléphone · Date · Heure · Motif · Statut
- Motion.tr avec stagger, zebra striping
- Empty state si aucun RDV

### MesDisponibilites

**Données initiales :** chargées depuis `doctors.find(d => d.id === medecinId)`.

**Layout :**
- Grille 5 colonnes (Lun / Mar / Mer / Jeu / Ven)
- Chaque bloc : jour abrégé + ✓/✗ — teal si actif, gris si inactif, toggle au clic
- Champ texte horaires unique (ex: `08h00 – 17h00`) — appliqué à tous les jours actifs
- Bouton **Enregistrer les modifications** → `updateDoctor(medecinId, { disponibilites, horaires })` + `toast.success`
- Toast info si aucun changement

---

## Section 3 : Notifications Brevo

### Architecture

La clé API Brevo ne doit jamais être dans le bundle frontend. On utilise une **Vercel serverless function** : `/api/notify.js`.

Le frontend appelle `fetch('/api/notify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...}) })` de manière **non bloquante** (pas d'await dans le flux principal — si l'email échoue, le RDV est quand même enregistré).

### `/api/notify.js`

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { type, rdv, docteur, statut } = req.body

  const emails = buildEmails(type, rdv, docteur, statut)
  
  for (const email of emails) {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    })
  }

  res.status(200).json({ ok: true })
}
```

### Types d'emails

**`nouveau_rdv`** — déclenché dans `addAppointment()` :
1. Email au **médecin** (`ADMIN_EMAIL` en démo) :
   - Sujet : `Nouveau rendez-vous — ${rdv.ref}`
   - Corps : patient, date, heure, motif, téléphone
2. Email au **patient** (`rdv.email`) :
   - Sujet : `Votre rendez-vous ${rdv.ref} est enregistré`
   - Corps : médecin, date, heure, référence, note "en attente de confirmation"

**`statut_change`** — déclenché dans `updateAppointmentStatus()` :
1. Email au **patient** uniquement :
   - Sujet : `Votre RDV ${rdv.ref} a été ${statut === 'confirmé' ? 'confirmé ✅' : 'annulé ❌'}`
   - Corps : détails RDV + instructions selon statut

### Variables d'environnement

Fichier `.env` (local) et variables Vercel (production) :
```
BREVO_API_KEY=<votre_clé>
BREVO_SENDER_EMAIL=mosalam2019@gmail.com
ADMIN_EMAIL=mosalam2019@gmail.com
```

`.env` est déjà dans `.gitignore` — la clé ne sera jamais committée.

### Fallback local (npm run dev)

En développement, `/api/notify.js` n'est pas accessible (pas de Vercel local). On détecte `import.meta.env.DEV` dans AppContext et on skip l'appel fetch. Les emails ne sont envoyés qu'en production Vercel.

---

## Fichiers modifiés / créés

### Nouveaux fichiers
| Fichier | Description |
|---|---|
| `api/notify.js` | Vercel serverless — Brevo email sender |
| `src/components/DoctorProtectedRoute.jsx` | Guard route médecin |
| `src/components/layout/DoctorSidebar.jsx` | Sidebar teal médecin |
| `src/pages/medecin/DoctorLayout.jsx` | Layout wrapper médecin |
| `src/pages/medecin/MonAgenda.jsx` | Dashboard RDV du médecin |
| `src/pages/medecin/MesDisponibilites.jsx` | Gestion disponibilités |

### Fichiers modifiés
| Fichier | Modification |
|---|---|
| `src/data/mockData.js` | + `DOCTOR_CREDENTIALS` |
| `src/context/AppContext.jsx` | + `loginDoctor`, `logoutDoctor`, `medecinId` dans context |
| `src/pages/Login.jsx` | Détection rôle admin vs médecin |
| `src/App.jsx` | + routes `/medecin/*` avec DoctorProtectedRoute |

---

## Ce qui n'est PAS dans cette phase

- Modifier/annuler ses propres RDV (reste admin uniquement)
- Rappels automatiques 24h (cron job — phase future)
- SMS via Brevo (configuré plus tard)
- Vrai Supabase Auth (phase future)
- Interface patient (hors scope)
