# Hush

*Safety in silence.*

A premium, mobile-first personal safety app that allows users to activate discreet safety sessions with natural-sounding safe phrases.

## Features

- **Hush Mode Sessions**: Activate temporary safety sessions (30 min, 1 hour, 2 hours, or manual)
- **Safe Phrases**: Create natural-sounding phrases that trigger private responses
- **Trusted Circle**: Alert people you trust with location sharing and custom messages
- **Journey Mode**: Set expected arrival times for travel with automatic check-ins
- **Escalation Plans**: Build stepped responses to alerts
- **Privacy First**: Full control over data, no background monitoring without activation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Auth + Database**: Supabase (Auth + Postgres)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- A free [Supabase](https://supabase.com) account

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once created, navigate to **Settings → API** and copy your:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon / public** key (`VITE_SUPABASE_ANON_KEY`)

### 2. Apply the database schema

Open the **Supabase SQL Editor** (Database → SQL Editor in your project dashboard) and run the contents of, in order:

```
supabase/migrations/001_profiles.sql
supabase/migrations/003_invites.sql
supabase/migrations/004_alerts_and_push.sql
```

`001_profiles.sql` creates the `profiles` table, RLS policies, and the trigger that auto-creates a profile row on sign-up. `003_invites.sql` creates `circle_invites`, used by the trusted-circle invite/linking flow below. `004_alerts_and_push.sql` creates `alerts` (the previously-planned "002" alerts table, delivered here since 002 was never created) and `push_subscriptions`, used by Web Push below.

### Deploy the edge functions

```bash
supabase functions deploy create-invite
supabase functions deploy accept-invite
supabase functions deploy push-test
```

`create-invite` and `accept-invite` read `APP_URL` (the deployed web app's origin, e.g. `https://hush.example.com`) from Supabase project secrets — the same secret already used by `send-alert`. `push-test` additionally needs the VAPID secrets described in **Web Push setup** below:

```bash
supabase secrets set APP_URL=https://your-deployed-app-url
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically into edge functions by Supabase — never set those yourself.

### 3. Configure environment variables

```bash
cp .env.example .env.local
# Then edit .env.local and fill in your Supabase URL and anon key
```

> **Security note:** an earlier commit in this repo's history accidentally checked in a real `.env` file with live Supabase credentials. That publishable/anon key must be treated as compromised — rotate it from **Settings → API → regenerate** in the Supabase dashboard before relying on this project.

### 4. Install and run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Authentication

### How it works

- **Sign up** at `/auth/sign-up` — creates a Supabase auth account and a matching `profiles` row.
- **Sign in** at `/auth/sign-in` — authenticates and persists the session in `localStorage` automatically (handled by the Supabase client).
- **Session restore** — on app reload the Supabase client restores the session from storage; the `AuthContext` picks this up and keeps React state in sync.
- **Sign out** — available from Settings → Sign Out; clears the persisted session.
- **Route protection** — all `/app/*` routes require an active session. Unauthenticated users are redirected to `/auth/sign-in`.

### Auth routes (public)

| Path | Description |
|---|---|
| `/auth/sign-in` | Email + password sign in |
| `/auth/sign-up` | Create a new account |
| `/join` / `/join/:token` | Accept a trusted-circle invite (see below) |

### App routes (protected — require sign-in)

| Path | Description |
|---|---|
| `/app/onboarding` | Onboarding slides |
| `/app/home` | Main dashboard |
| `/app/start-guard-mode` | Configure and start Hush Mode |
| `/app/guard-mode-active` | Active session screen |
| `/app/safe-phrases` | Safe Phrase builder |
| `/app/trusted-circle` | Manage trusted contacts |
| `/app/escalation` | Build escalation plans |
| `/app/incoming-alert` | Receive alerts from contacts |
| `/app/journey-mode` | Set travel expectations |
| `/app/history` | View past sessions |
| `/app/settings` | Account and privacy settings |

## Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   ├── Navigation.tsx
│   ├── Logo.tsx
│   ├── DemoModeBanner.tsx    # Persistent "demo, not monitoring" banner
│   ├── EnablePushButton.tsx  # Requests notification permission + subscribes
│   ├── DevPushTestButton.tsx # Dev-only push loop verification (hidden in prod)
│   └── ProtectedRoute.tsx    # Auth gate for /app/* routes
├── contexts/
│   └── AuthContext.tsx   # Supabase auth state + session restore
├── lib/
│   ├── supabase.ts       # Supabase client (reads Vite env vars)
│   ├── invites.ts        # create-invite / accept-invite edge function calls
│   └── push.ts           # Service worker registration + push subscription
├── pages/
│   ├── LandingPage.tsx
│   ├── AppPrototype.tsx
│   ├── JoinPage.tsx      # Public /join, /join/:token invite acceptance
│   ├── auth/
│   │   ├── SignInPage.tsx
│   │   └── SignUpPage.tsx
│   └── app/              # Individual app screens
├── hooks/
│   ├── useGuardModeState.ts
│   └── useAppUser.ts     # App user state (overlays auth user info)
├── services/
│   └── mockData.ts       # Default/mock user and alert data
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
public/
├── manifest.webmanifest  # PWA manifest (installability, iOS push prerequisite)
├── sw.js                 # Service worker: push display + notification click
├── icon-192.png / icon-512.png / apple-touch-icon.png
supabase/
├── migrations/
│   ├── 001_profiles.sql          # profiles table + RLS policies
│   ├── 003_invites.sql           # circle_invites table + RLS policies
│   └── 004_alerts_and_push.sql   # alerts + push_subscriptions tables + RLS
└── functions/
    ├── create-invite/    # Generates a trusted-circle invite code + link
    ├── accept-invite/    # Accepts an invite, connects the trusted contact
    ├── push-test/        # Dev loop: sends a real test push to the caller
    └── _shared/cors.ts
.env.example              # Required environment variables
```

## Important Disclaimers

- Hush does not directly contact emergency services
- Voice recognition, location sharing, and background operation may vary by device and location
- Not a replacement for emergency services (911, etc.)

## Development Notes

### Data Persistence

App-level profile state now persists to Supabase in `profiles.app_state` (trusted contacts, safe phrases, escalation plans, session history, permissions, and privacy settings). When a user signs in, the app restores this state and overlays it onto the default client profile.

### Trusted Circle Invites

Adding a trusted contact from `/app/trusted-circle` calls the `create-invite` edge function, which writes a row to `circle_invites` and returns a short code (`GRD-XXXXXX`) and a `/join/:token` link. The inviter can copy an invite message, share it via the native share sheet, or show the QR code.

The invited contact opens the link (or types the code at `/join`), signs in or creates an account, and the `accept-invite` edge function marks the invite accepted and flips that contact's entry in the inviter's `app_state.trustedContacts` from `'pending'` to `'connected'`. Both steps run with the service-role key server-side — the accepting contact never needs direct table access, and RLS on `circle_invites` only ever grants the inviter access to their own rows.

**Copy honesty:** there is no native app or app-store listing yet, so invite copy always says "Open Hush," never "Download the app." Once a Capacitor build and a registered universal-link domain association exist, `/join` links can be updated to deep-link into the installed app first and fall back to the app-store listing. Today they simply open the web app in the visitor's browser and auto-fill the invite code/token.

### Web Push setup

Hush can send real Web Push notifications (free — no FCM/APNs account needed) via VAPID. This app ships with no service worker or manifest by default in git; both were added under `public/` for this feature.

**1. Generate a VAPID key pair** (one-time, per environment):

```bash
npx web-push generate-vapid-keys
```

This prints a public and private key. Never commit the private key.

**2. Client — public key only:**

```bash
# .env.local (and in Vercel project settings → Environment Variables)
VITE_VAPID_PUBLIC_KEY=<the public key>
```

**3. Supabase secrets — used by the `push-test` edge function:**

```bash
supabase secrets set \
  VAPID_PUBLIC_KEY=<the public key> \
  VAPID_PRIVATE_KEY=<the private key> \
  VAPID_SUBJECT=mailto:you@yourdomain.com \
  APP_URL=https://your-deployed-app-url
```

**4. Deploy:**

```bash
supabase db push
supabase functions deploy push-test
```

**5. Verify the loop:** sign in, open `/app/home`, click **Enable safety alerts** (this registers `public/sw.js`, requests Notification permission, and upserts a row into `push_subscriptions`), then use the **Send test push** dev-only button (visible only in `npm run dev` / non-production builds) to call `push-test` and confirm a notification actually arrives.

**iOS note:** Safari on iOS only delivers Web Push to a PWA that has been installed to the home screen (Share → Add to Home Screen) — it will not work from a regular Safari tab. `EnablePushButton` reports this as "this device doesn't support it yet" until installed. Push delivery on any platform is best-effort: locked/low-power devices, OS-level notification settings, and battery optimizations can all delay or suppress delivery, so it is not a substitute for the in-app alert flow.

### Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design optimized for 320 px – 1920 px

## License

Private project. Not for public distribution.
