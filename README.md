# Guard Mode

A premium, mobile-first personal safety app that allows users to activate discreet safety sessions with natural-sounding SafePhrases.

## Features

- **Guard Mode Sessions**: Activate temporary safety sessions (30 min, 1 hour, 2 hours, or manual)
- **SafePhrases**: Create natural-sounding phrases that trigger private responses
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

Open the **Supabase SQL Editor** (Database → SQL Editor in your project dashboard) and run the contents of:

```
supabase/migrations/001_profiles.sql
```

This creates the `profiles` table, RLS policies, and the trigger that auto-creates a profile row on sign-up.

### 3. Configure environment variables

```bash
cp .env.example .env.local
# Then edit .env.local and fill in your Supabase URL and anon key
```

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

### App routes (protected — require sign-in)

| Path | Description |
|---|---|
| `/app/onboarding` | Onboarding slides |
| `/app/home` | Main dashboard |
| `/app/start-guard-mode` | Configure and start Guard Mode |
| `/app/guard-mode-active` | Active session screen |
| `/app/safe-phrases` | SafePhrase builder |
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
│   └── ProtectedRoute.tsx  # Auth gate for /app/* routes
├── contexts/
│   └── AuthContext.tsx   # Supabase auth state + session restore
├── lib/
│   └── supabase.ts       # Supabase client (reads Vite env vars)
├── pages/
│   ├── LandingPage.tsx
│   ├── AppPrototype.tsx
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
supabase/
└── migrations/
    └── 001_profiles.sql  # profiles table + RLS policies
.env.example              # Required environment variables
```

## Important Disclaimers

- Guard Mode does not directly contact emergency services
- Voice recognition, location sharing, and background operation may vary by device and location
- Not a replacement for emergency services (911, etc.)

## Development Notes

### Data Persistence

App-level profile state now persists to Supabase in `profiles.app_state` (trusted contacts, safe phrases, escalation plans, session history, permissions, and privacy settings). When a user signs in, the app restores this state and overlays it onto the default client profile.

### Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design optimized for 320 px – 1920 px

## License

Private project. Not for public distribution.
