# PaddleMate

The all-in-one paddle sports platform. Book courts, find players, and manage clubs — all in one place.

## Stack

- **Monorepo**: Turborepo
- **Web**: Next.js 14 (App Router)
- **Mobile**: Expo (React Native — iOS & Android)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Shared**: TypeScript packages for types and Supabase client

## Project Structure

```
paddlemate/
├── apps/
│   ├── web/          # Next.js 14 web app
│   └── mobile/       # Expo React Native app
├── packages/
│   ├── shared/       # Shared TypeScript types
│   ├── supabase/     # Supabase client & schema helpers
│   └── ui/           # Shared UI components (web)
└── supabase/         # DB migrations & seed data
```

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Setup

```bash
# Install dependencies
npm install

# Copy env files
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local

# Start local Supabase
npx supabase start

# Run all apps in dev mode
npm run dev
```

## Features

- **Court Booking** — Search, reserve, and pay for paddle courts
- **Player Matching** — Find players by skill level and availability
- **Club Management** — Admin tools for clubs to manage courts and members
