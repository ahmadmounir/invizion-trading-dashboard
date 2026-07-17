# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on http://localhost:3001
npm run build     # Type-check (tsc -b) then bundle → dist/
npm run lint      # ESLint on all TS/TSX files
npm run preview   # Preview production build locally
```

No test runner is configured.

## Stack

React 19 + TypeScript 5.8 (strict) + Vite 7, styled with TailwindCSS v4 + shadcn/ui (Radix UI primitives). State via Zustand. Forms via React Hook Form + Zod. Routing via React Router 7 with lazy code-splitting. i18n via i18next (Turkish by default; English and Arabic also supported, Arabic renders RTL).

## Architecture

### Directory Layout

```
src/
├── features/          # Domain modules — each owns its UI, API calls, and hooks
│   ├── auth/
│   ├── dashboard/
│   ├── services/
│   └── settings/
│       ├── MyAccount/ # Personal profile, security, notifications
│       └── Admin/     # User management (admin/owner only)
├── shared/
│   ├── components/
│   │   ├── guards/    # ProtectedRoute, AuthProtectedRoute, AdminProtectedRoute, OwnerProtectedRoute
│   │   ├── navigation/
│   │   ├── theme/
│   │   └── ui/        # shadcn/ui components
│   ├── hooks/         # useI18n, useAdmin, useOwner, useTenant, useProfileHydration, …
│   ├── services/      # apiClient.ts (fetcher), profileService, listsService
│   ├── stores/        # Zustand stores: profileStore, breadcrumbStore, countriesStore
│   ├── types/api.ts   # All API interfaces (ApiResponse<T>, Profile, UserRole, paging, …)
│   └── utils/         # cn, roles, i18n init, appLinks, formatDate, …
├── locales/en/, tr/, ar/  # i18n namespaces: common, auth, settings (ar renders RTL)
└── styles/index.css   # CSS variables + Tailwind @theme bridge + animations
```

### API Client (`src/shared/services/apiClient.ts`)

All requests go through `fetcher<T>(path, method, body?, useSystemBase?)`:
- Auto-attaches `Authorization: Bearer {token}` and `Accept-Language` headers.
- Returns `ApiResponse<T>` — always check `response.success`.
- On 401: clears token + Zustand profile, redirects to `/auth/login`.

Base URLs from env vars:
- `VITE_API_URL` — system API (default arg)
- `VITE_COMMON_API_URL` — common/shared API (pass `false` as 4th arg)

Standard server envelope:
```ts
{ success: boolean; statusCode: number; message: string | null; data: T; paging?: PagingInfo }
```

### Auth & Profile Flow

1. `login()` → stores JWT in `localStorage['inviziontenantui-token']`.
2. `fetchAndStoreProfile()` → stores profile in **Zustand only** (never localStorage).
3. `useProfileHydration()` runs on app mount — re-fetches profile if token exists but store is empty (handles page refreshes).
4. Route guards read the token for authentication and Zustand profile for role checks.

localStorage keys: `inviziontenantui-token`, `inviziontenantui-language`, `inviziontenantui-theme`.

### RBAC

Roles (from `src/shared/utils/roles.ts`): `tenant_owner`, `tenant_admin`, `tenant_operator`.

```ts
import { useIsAdmin } from '@/shared/hooks/useAdmin';
const { isAdmin } = useIsAdmin(); // true for owner or admin
```

Route-level: wrap with `<AdminProtectedRoute>` or `<OwnerProtectedRoute>`.

There is a single account type — every authenticated user gets the same experience, no onboarding
gate or account-type branching.

### i18n

```ts
const { t, changeLanguage, isRTL } = useI18n();
t('auth:login')        // namespace:key
t('common:save')
```

Three languages are supported — `tr` (default), `en`, and `ar` (renders RTL) — switchable at any time
via `<LanguageSwitcher />`, rendered in the auth header (`AuthLayout`), the main app header
(`Header.tsx`), and Settings → Preferences. `useI18n().isRTL` and `document.documentElement.dir` are
derived live from the current language (see `src/shared/utils/i18n.ts`).

Add keys to **all three** of `locales/tr/`, `locales/en/`, and `locales/ar/`.

### Styling

- Merge classes with `cn()` (clsx + tailwind-merge) from `@/shared/utils/cn`.
- Component variants via CVA (`class-variance-authority`).
- Dark mode uses `class` strategy on `<html>`; CSS variables bridged to Tailwind in `src/styles/index.css`.
- Default text size is `text-base`; avoid `text-sm` unless necessary.
- Use Tailwind directional utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`). Avoid `ml-`, `mr-`, `text-left`, `text-right`.

### Forms

```ts
const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
```

Use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` components.

### Key Patterns

**Error state** — hide interactive elements when `error` is set:
```tsx
{!error && <Button>Add</Button>}
{error ? <DataError onRetry={load} /> : <DataTable />}
```

**Modal data** — always re-fetch by ID when opening an edit modal; never rely on stale list row data.

**Navigation links** — edit `src/shared/utils/appLinks.ts` to add sidebar items.

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/shared/stores/profileStore.ts` | Zustand store for profile (setProfile, clearProfile, updateProfile) |
| `src/shared/services/listsService.ts` | Shared lookups: industries, countries, colors |
| `src/shared/services/profileImageService.ts` | Profile avatar GET/POST/DELETE |
| `src/shared/services/apiClient.ts` | `fetcher()`, `handleResponse()`, 401 auto-logout logic |
| `src/shared/hooks/useProfileHydration.ts` | Auto-fetch profile on mount if token exists |
| `src/shared/hooks/useAdmin.ts` | `useIsAdmin()` hook for role checking |
| `src/shared/hooks/useI18n.ts` | `useI18n()` hook for translations (t, i18n, isRTL, changeLanguage) |
| `src/shared/utils/i18n.ts` | i18next init, `tr`/`en`/`ar` resources, RTL direction handling |
| `src/shared/components/ui/LanguageSwitcher.tsx` | Language dropdown (tr/en/ar), used in auth header, app header, Settings → Preferences |
| `src/shared/types/api.ts` | All TypeScript interfaces for API data |
| `src/shared/utils/linksInfo.ts` | Navigation config for sidebar/mobile |
| `src/shared/utils/cn.ts` | `cn()` utility for className merging (tailwind-merge + clsx) |
| `src/styles/index.css` | TailwindCSS v4 config, theme variables, dark mode |
| `src/App.tsx` | Root routes, lazy loading, ThemeProvider, Toaster |
| `vite.config.ts` | Vite config (port 3001, @/ alias, Tailwind plugin) |

## Environment Variables
```env
VITE_API_URL=https://api.inviziontenantui-platform.com/v1
VITE_COMMON_API_URL=https://api.inviziontenantui-platform.com/v1
```

## Coding Rules

## whenever you change anything, check if translation keys are needed and add them to locales/tr/, locales/en/, and locales/ar/ files.

## If you update the breadcrumb make sure to update the breadcrumb for the mobile nav.

## Do not use text-sm ever! Always use the default size (base).

## When adding a section card, table, or any component see the design and structure used in other parts of the app and follow the same structure and spacing. The UI should be consistent across the app.

## Use FormFieldWrapper component to wrap form fields instead of using div with grid gap-2 classes or any other wrapper classes.

## Always design the structure mobile first and then add larger screen styles using TailwindCSS responsive utilities.

## File Uploads
For file uploads with drag-and-drop support, use the `FileDropzone` component.

## Price Input Component
For all price/currency input fields, use the `PriceInput` component instead of regular `Input`:
```typescript
import { PriceInput } from '@/shared/components/ui';

<PriceInput
  id="costPrice"
  value={price}  // number type
  onChange={(value) => setPrice(value)}  // receives number
  placeholder="0"  // optional
/>
```
This component automatically displays "SAR" suffix and handles number conversion.

## Close Confirmation Dialog
When a modal or form has unsaved changes, always confirm before closing to prevent data loss. Use the shared `CloseConfirmDialog` component:

```typescript
import { CloseConfirmDialog } from '@/shared/components/ui';

const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [showCloseConfirm, setShowCloseConfirm] = useState(false);

const handleClose = () => {
  if (hasUnsavedChanges) {
    setShowCloseConfirm(true);
  } else {
    onOpenChange(false);
  }
};

const handleConfirmClose = () => {
  setShowCloseConfirm(false);
  setHasUnsavedChanges(false);
  onOpenChange(false);
};
```

The `CloseConfirmDialog` component is at `src/shared/components/ui/CloseConfirmDialog.tsx` and uses keys `common:unsavedChanges` and `common:unsavedChangesDescription`.

## For updating data, open a modal and always re-fetch the record by ID — never pass stale list-row data to the modal.

## Always check if words already exist in the locale files before adding new keys. Reuse existing keys where possible.
