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

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   ├── Navigation.tsx
│   └── Logo.tsx
├── pages/
│   ├── LandingPage.tsx
│   ├── AppPrototype.tsx
│   └── app/              # Individual app screens
├── hooks/
│   ├── useGuardModeState.ts
│   └── useAppUser.ts
├── services/
│   └── mockData.ts       # Mock user and alert data
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
```

## App Routes

### Marketing
- `/` - Landing page with hero, features, and CTAs

### App Prototype
- `/app/onboarding` - Onboarding slides
- `/app/account-creation` - Account setup
- `/app/permissions` - Permission requests
- `/app/home` - Main dashboard
- `/app/start-guard-mode` - Configure and start Guard Mode
- `/app/guard-mode-active` - Active session screen
- `/app/safe-phrases` - SafePhrase builder
- `/app/trusted-circle` - Manage trusted contacts
- `/app/escalation` - Build escalation plans
- `/app/incoming-alert` - Receive alerts from contacts
- `/app/journey-mode` - Set travel expectations
- `/app/history` - View past sessions
- `/app/settings` - Account and privacy settings

## Key Features

### Interactive Prototype

The prototype is fully functional with:
- State management for Guard Mode sessions
- SafePhrase creation and management
- Trusted contact management
- Real-time session timers
- Alert demonstrations
- Session history tracking

### Design System

**Colors**
- Dark: `#0a0e27`
- Charcoal: `#1a2139`
- Ivory: `#f5f3f0`
- Gold: `#d4af91`
- Teal: `#3fb8a0`
- Amber: `#d99d3f`

**Premium Features**
- Smooth animations and transitions
- Glassmorphism effects
- Soft shadows and rounded corners
- Responsive mobile-first design
- Accessibility-first approach

## Important Disclaimers

- Guard Mode does not directly contact emergency services
- This is a demonstration prototype
- Voice recognition, location sharing, and background operation may vary by device and location
- Not a replacement for emergency services (911, etc.)

## Development Notes

### Mock Services

All data is currently stored in local state using React hooks. For production, integrate:
- Supabase or Firebase for authentication
- Real location services (Google Maps API)
- Push notifications service
- Voice recognition API
- Real emergency service integrations (with proper legal compliance)

### Browser Support

- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design optimized for 320px - 1920px

## License

Private project. Not for public distribution.
