# Sakena (Sakena) Frontend — Agent Rules

You are a **senior frontend engineer** working on **ساکنا**, a production Next.js App.
Read this file in full before writing or editing any code.


## Tech Stack (do NOT swap or add alternatives)

| Concern         | Library                                                 |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                                 |
| Language        | TypeScript 5, strict mode                               |
| React           | React 19                                                |
| Styling         | Tailwind CSS v4 + CSS variables                         |
| UI primitives   | shadcn/ui (→ `ui/`), Radix UI, Base UI                  |
| Data fetching   | TanStack Query v5                                       |
| Global state    | Zustand v5                                              |
| Forms           | React Hook Form + `@hookform/resolvers`                 |
| Validation      | Zod v4                                                  |
| HTTP client     | Axios (`services/http.ts`) — never use `fetch` directly |
| Icons           | `lucide-react` only                                     |
| Animations      | `motion` (Framer Motion v12)                            |
| Toasts          | `sonner`                                                |
| Package manager | `pnpm`                                                  |

---

## Folder Structure

```
app/                  # Next.js App Router — pages, layouts, route-level components
  (route-group)/
    page.tsx          # minimal: imports a _page component and re-exports
    _page.tsx         # actual page implementation (or co-located in app/)
    components/       # components used ONLY by this route
api/                  # pure async functions — no hooks, no React imports
queries/              # TanStack Query hooks (useQuery / useMutation wrappers)
stores/               # Zustand stores
hooks/                # custom React hooks not tied to a single store/query
components/           # shared components used across multiple routes
ui/                   # shadcn base components — modify sparingly
services/             # core infrastructure (http.ts, etc.)
lib/                  # pure utility functions and constants
types/                # TypeScript type definitions (.type.ts / .api.type.ts)
schemas/              # Zod validation schemas (.schema.ts)
providers/            # React context providers
```

### Naming Conventions

- **Files**: `kebab-case.tsx` / `kebab-case.ts`
- **Components**: `PascalCase` function, named export preferred
- **Types**: `PascalCase` — suffixed `.type.ts` for app types, `.api.type.ts` for API shapes
- **Schemas**: `camelCase` — suffixed `.schema.ts`
- **Query keys**: exported object `xyzKeys` in `api/xyz.ts` (e.g. `authKeys`)
- **Stores**: `useXyzStore` from `stores/xyz.store.ts`
- **Hooks**: `useXyz` from `hooks/use-xyz.ts`

---

## Layer Rules

### `api/` — API functions

- Pure `async` functions, no hooks
- Use `http` from `@/services/http`
- Export query key objects (`export const xyzKeys = { ... } as const`)
- One file per domain (`auth.ts`, `classes.ts`, etc.)

```ts
// CORRECT
export const courseKeys = {
  list: ["courses"] as const,
  detail: (id: string) => ["courses", id] as const,
};

export async function getCourse(id: string) {
  const { data } = await http.get<Course>(`/courses/${id}/`);
  return data;
}
```

### `queries/` — TanStack Query hooks

- One file per domain, mirrors `api/`
- `"use client"` at the top — queries run client-side
- Use query keys from `api/` — never define keys inline
- `staleTime` must be explicit on every `useQuery`

```ts
// CORRECT
export function useCourseQuery(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => getCourse(id),
    staleTime: 5 * 60 * 1000,
  });
}
```

### `stores/` — Zustand

- `"use client"` at the top
- Interface split: `XyzState` (data) + actions inline in `create<>()`
- Use `persist` + `createJSONStorage` only when data must survive reload
- Export constants for default/initial values (`const DEFAULT_XYZ = ...`)

### `schemas/` — Zod

- Define schemas here, not inside components
- Co-locate inferred types: `export type XyzForm = z.infer<typeof xyzSchema>`

### `components/` — shared components

- No direct API calls; receive data via props or call a query hook
- If only used in one route, place it inside `app/(route)/components/`

### `ui/` — shadcn primitives

- Do NOT modify unless you must extend a variant
- Compose them; don't re-implement

---

## Component Rules

### Server vs Client

- **Default to Server Components** — add `"use client"` only when needed (event handlers, hooks, browser APIs)
- Never add `"use client"` to layouts or pure display components that don't need it

### Structure

```tsx
// CORRECT — one concern per file
"use client";
import { ... } from "...";

interface Props { ... }

export function MyComponent({ ... }: Props) {
  // hooks first
  // derived values
  // handlers
  // render
}
```

### Props

- Always type props with a local `interface Props` — never use `any`
- Prefer specific types over `React.FC<Props>`

### Styling

- Use `cn()` from `@/lib/utils` for conditional class merging
- Use Tailwind utility classes — no inline `style={{}}` unless animating with `motion`
- Use CSS variables from `globals.css` for colors/tokens, not hardcoded hex values
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)

### No forbidden patterns

- No `useState` for data that belongs in a query or store
- No `useEffect` to sync state — derive or use `useMemo`
- No prop drilling beyond 2 levels — use a query hook or store
- No `console.log` left in committed code
- No magic strings — use enums or constants from `lib/`

---

## TypeScript Rules

- **No `any`** — use `unknown` and narrow, or define a proper type
- **No type assertions** (`as X`) unless after an explicit runtime check
- Use `type` for unions/intersections, `interface` for object shapes
- Import types with `import type { ... }`
- API response shapes go in `types/*.api.type.ts`; app-level types go in `types/*.type.ts`

---

## Forms

Always use React Hook Form + Zod resolver:

```tsx
const form = useForm<MyFormType>({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
});
```

- Never manage form state with raw `useState`
- Validation schema lives in `schemas/`, not inline

---

## Error Handling

- HTTP errors are handled globally in `services/http.ts` — do NOT add duplicate toast calls in query hooks unless you need custom behavior
- `useMutation` — use `onError` only for errors the global handler doesn't cover
- Never swallow errors silently

---

## Performance

- `reactCompiler: true` is enabled — do NOT manually add `useMemo`/`useCallback` to fight re-renders; the compiler handles it
- Code-split heavy components with `dynamic()` from `next/dynamic`
- Images: always use `next/image` with explicit `width`/`height` or `fill`

---

## Code Quality

- **No duplicated code** — extract shared logic to `lib/`, `hooks/`, or a shared component before copy-pasting
- **No dead code** — delete unused imports, variables, and components
- **No commented-out code** in committed files
- Comments: only write one when the **why** is non-obvious. Never describe what the code does.
- Keep files focused: if a file grows past ~200 lines, split it

---

## Do's and Don'ts

| Do                                                                | Don't                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| Use `http` from `@/services/http`                                 | Use raw `fetch` or a second Axios instance                      |
| Define query keys in `api/*.ts`                                   | Inline `queryKey` strings in components                         |
| Use `sonner` toast via `import { toast } from "sonner"`           | Use `alert()` or custom toast implementations                   |
| Use `lucide-react` icons                                          | Import from other icon libraries                                |
| Use `motion` for animations                                       | Use CSS `transition` classes for complex state-based animations |
| Use Zod schemas from `schemas/`                                   | Write ad-hoc validation logic in handlers                       |
| Use `cn()` for class merging                                      | String concatenation for conditional classes                    |
| Use `pnpm add` to install dependencies                            | Use `npm` or `yarn`                                             |
| Check if a `ui/` component already exists                         | Re-implement a shadcn primitive                                 |
| Keep pages thin (import from `components/` or co-located `_page`) | Put 200+ lines of JSX directly in `page.tsx`                    |

---

## Before Writing Code — Checklist

1. Does a `ui/` component already cover this? Use it.
2. Does this logic belong in `api/`, `queries/`, or `stores/`? Put it there.
3. Is this type already defined in `types/`? Reuse it.
4. Will this component be used in more than one route? Put it in `components/`.
5. Am I about to duplicate code that exists elsewhere? Extract first.
6. Does this need `"use client"`? Default to no.

---

## Running the Project

```bash
pnpm dev           # development server
pnpm format        # prettier format (run after writing code)
pnpm check         # TypeScript + ESLint + Prettier check (run before committing)
pnpm build         # production build
```

Always run `pnpm check` after changes and fix all errors before considering work done.
