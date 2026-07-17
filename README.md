# Invizion

> A **mobile-first** coin market platform — track live prices, manage a portfolio, and trade with
> confidence. Available in Turkish, English, and Arabic (full RTL support).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)

---

## Getting Started

**Prerequisites:** Node.js 18+, npm 9+

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3001`. No environment variables or backend setup are needed — auth
is local/demo only, and the dashboard calls the public CoinGecko API directly.

**Demo login:** `demo@invizion.com` / `Demo1234!` (also shown as a hint on the login page), or register
a new account — it's stored in `localStorage`, not a real database.

### Scripts

| Command           | Description                            |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the dev server                    |
| `npm run build`    | Type-check, then build for production   |
| `npm run lint`     | Run ESLint                              |
| `npm run preview`  | Preview the production build locally    |

---

## Overview

Every user gets the same single account experience — no roles, no onboarding gate. Two pages:

- **Dashboard** (`/`) — a "Market Watch" table of the top coins by market cap (CoinGecko), with
  search, a currency selector, pagination, and a details panel (modal on mobile) per coin.
- **Settings** (`/settings`) — edit profile info and avatar, plus language/theme preferences.
  Everything is persisted to `localStorage` — there's no backend.

Fully localized in Turkish (default), English, and Arabic (RTL), switchable via the language switcher
in the auth header, the main app header, and Settings → Preferences.

## Tech Stack

React 19 · TypeScript 5.8 · Vite 7 · TailwindCSS v4 + shadcn/ui (Radix UI) · Zustand · React Hook Form
+ Zod · TanStack Query · react-i18next

## Project Structure

```
src/
├── features/
│   ├── auth/          # Login, register (local/demo auth)
│   ├── dashboard/      # Market Watch: table, coin details, CoinGecko API
│   └── settings/       # Profile + avatar (localStorage), preferences
├── shared/
│   ├── components/     # guards/, navigation/, theme/, ui/ (shadcn components)
│   ├── stores/         # profileStore.ts (Zustand, mirrors to localStorage)
│   ├── hooks/          # useI18n, useDebounce, useIsMobile, …
│   ├── services/       # localAuth.ts (register/login/logout, local user list)
│   └── utils/          # cn, i18n.ts (tr/en/ar + RTL), formatCurrency, formatDate, …
├── locales/             # en/, tr/, ar/ — common, auth, settings namespaces
├── styles/              # Global CSS + Tailwind theme
└── App.tsx              # Routes, providers (QueryClient, Theme)
```

## Auth Model

There's no backend. `src/shared/services/localAuth.ts` keeps a list of users in
`localStorage['inviziontenantui-users']`. Login checks credentials against that list and writes a fake
token to `localStorage['inviziontenantui-token']`; the logged-in profile is mirrored to
`localStorage['inviziontenantui-profile']` via the Zustand `profileStore`. Register appends a new user
to the same list. This is a demo pattern only — not intended for real user data or production use.

## Route Guards (`src/shared/components/guards/`)

| Guard                 | Responsibility                                |
| ---------------------- | ----------------------------------------------- |
| `ProtectedRoute`       | Requires a token.                              |
| `AuthProtectedRoute`   | Keeps logged-in users out of the auth pages.   |
