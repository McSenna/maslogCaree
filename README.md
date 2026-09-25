# MaslogCare — mobile & web app

The client for MaslogCare, the Barangay 61 Maslog (Legazpi City) health-center system. It's one Expo / React Native codebase that ships to Android, iOS and the web. Residents book and track appointments, and staff (admin, doctor, midwife, BHW) run the queue, missions, inventory and records.

## Getting started

```bash
npm install
cp .env.example .env        # or create .env — see "Environment" below
npm start                   # Expo dev server (press w for web, a for Android)
```

Run the API in `../backend` alongside it (`npm run backend` from here, or `npm run dev` there).

## Scripts

| Script | What it does |
| --- | --- |
| `npm start` / `npm run web` / `npm run android` | Start the Expo dev server |
| `npm run start:dev-client` | Start for a development build (`expo-dev-client`) |
| `npm run backend` | Start the API in `../backend` with nodemon |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (Expo config + React Compiler rules) |

Run `npm run typecheck && npm run lint` before you push. Both should be clean.

## Environment

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_API_URL` | API base URL. `/api` is appended if missing; defaults to `http://localhost:5000/api` |
| `EXPO_PUBLIC_RESIDENT_BARANGAY` / `_CITY_MUNICIPALITY` / `_PROVINCE` | Locality shown on sign-up. Must match the backend's `RESIDENT_*` values |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | Optional fallback for the push-notification project id |

Everything prefixed `EXPO_PUBLIC_` is bundled into the app, so never put secrets here.

## Project layout

```
app/                  Routes (expo-router). Files here are thin wrappers around screens.
  (public)/           Landing, about, announcements
  admin|doctor|midwife|bhw|resident/   One folder per role, each guarded by <RouteGuard>
src/
  features/<name>/    Feature modules: components, hooks, services, types, utils, screens
  components/         Shared UI — ui/ (primitives, sheets, dialogs, charts), layout/, navigation/
  hooks/              Cross-feature hooks (see below)
  services/           API client (axios + auth interceptors) and shared API calls
  contexts/           Auth, theme, notifications providers
  config/             Role routes, nav config, platform access, static content
  design/             Motion and theme tokens
  utils/              Pure helpers (dates, file sizes, API errors, storage)
```

New feature code goes in `src/features/<feature>/`. Only promote something to `src/components` or `src/hooks` once a second feature needs it.

## Conventions

- **Imports:** use the `@/` alias for anything under `src/`. Prefer named exports.
- **Roles and routes:** `UserRole` and the typed route helpers (`getDashboardPath`, `getProfilePath`, `getNotificationsPath`) live in `src/config/roleRoutes.ts`.
- **Animated values:** use `useAnimatedValue(initial)` from `@/hooks/useAnimatedValue`, not `useRef(new Animated.Value())`. It is web-safe and never reads refs during render.
- **Latest-callback refs:** use `useLatestRef(fn)` when a long-lived listener needs the current callback.
- **Resetting state when a modal opens or a prop changes:** use `useSyncOnChange(deps, sync)` instead of a `useEffect` that calls setters. The new state is in place before paint, so a reopened form never flashes old values.
- **Data fetching in effects** is fine. Mark the call with `// eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch …` so intentional cases stay distinguishable from accidental ones.
- **Images:** bundle right-sized assets. `assets/images/maslog-seal.png` (320 px) and `maslog-background.jpg` are for in-app use. The full-resolution `maslogicon.png` is only for app icons in `app.json`.
