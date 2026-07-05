# Expense Tracker — Build Plan

Next.js 16 · Neon Postgres · Prisma · custom JWT auth · Tailwind + shadcn/ui

## Features
- Auth: email + password, custom JWT in httpOnly cookie, Next 16 `proxy.ts` gate
- Core CRUD + categories (expense/income)
- Budgets + monthly limits with over-limit warnings
- Charts / dashboard (recharts)
- Recurring transactions + income

## Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TS, Server Actions) |
| DB | Neon serverless Postgres |
| ORM | Prisma + `@prisma/adapter-neon` + `@neondatabase/serverless` |
| Auth | `jose` (JWT), `bcryptjs` (hash), httpOnly cookie |
| UI | Tailwind, shadcn/ui, `lucide-react` |
| Charts | `recharts` |
| Forms/validation | `react-hook-form`, `@hookform/resolvers`, `zod` |
| Dates | `date-fns` |

Versions: latest of everything (resolve via Context7 / `npm view`).

## Data model (Prisma)
- **User** — id, email(unique), passwordHash, name, createdAt
- **Category** — id, userId, name, type(EXPENSE|INCOME), color, icon
- **Transaction** — id, userId, categoryId, amount(Decimal), type, note, date, createdAt; index(userId,date)
- **Budget** — id, userId, categoryId, amount, month; unique(userId,categoryId,month)
- **RecurringTransaction** — id, userId, categoryId, amount, type, interval(DAILY|WEEKLY|MONTHLY), nextRunDate, active
- Enums: `TransactionType`, `RecurrenceInterval`. Cascade on user delete.

## Structure
```
app/
  (auth)/login, (auth)/register
  (app)/layout.tsx  (sidebar, requires session)
  (app)/dashboard, transactions, budgets, recurring, categories
  api/auth/{register,login,logout}/route.ts
  api/cron/recurring/route.ts
lib/
  db.ts                     Prisma client + Neon adapter
  auth/{password,jwt,session}.ts
  queries/{transactions,budgets,dashboard}.ts
components/
  transaction-form, transaction-table, budget-card, summary-cards
  charts/{spending-trend, category-breakdown}
proxy.ts                    Next 16 auth gate (replaces middleware.ts)
prisma/schema.prisma
```

## Env
```
DATABASE_URL=postgres://...neon...pooled
JWT_SECRET=<32+ random bytes>
```

## Build steps — checklist
- [x] 0. Create PLAN.md + resolve latest versions
- [x] 1. Scaffold Next.js 16 (TS, Tailwind, App Router) + git init — Next 16.2.10
- [x] 2. Install deps at latest — Prisma 7.8, jose 6.2, zod 4.4, recharts 3.9, etc.
- [x] 3. shadcn init (preset `b6G5PrBFp`, style base-lyra, hugeicons) + 13 components. NOTE: drop `--pointer .` (caused `..json` registry bug); form.tsx pulled from std registry
### Phase A — UI first (mock data, no backend)
- [x] 4. App shell: sidebar nav + `(app)` layout + placeholder pages. Dark default (next-themes), theme toggle. NOTE: shadcn preset = **base-ui** (`@base-ui/react`) + hugeicons — use `render={<Comp/>}` prop NOT `asChild`; add `nativeButton={false}` when Button renders an anchor.
- [x] 5. Auth pages UI: login + register forms (rhf + zod, mock submit → /dashboard). `(auth)` layout, shared `lib/validation/auth.ts`.
- [x] 6. Dashboard UI: summary cards + area chart (income/expense) + category donut + recent list. Data layer `lib/data/dashboard.ts` (async, reads mock now → Prisma in Phase B). Types `lib/types.ts`, fixtures `lib/mock/data.ts`, `lib/format.ts`.
- [x] 7. Transactions UI: table + add/edit dialog (rhf/zod) + filters (type/category/month), in-memory CRUD + toasts. `lib/data/transactions.ts`, `components/transactions/*`. NOTE: base-ui Select `onValueChange` value is `string|null` (guard it); use `items` map for label display; avoid `z.coerce` in RHF schemas (breaks resolver typing).
- [x] 8. Budgets UI: summary + per-category cards (spent/limit progress, over-limit red badge), add/edit/delete dialog. `lib/data/budgets.ts`, `components/budgets/*`.
- [x] 9. Recurring UI: table + active switch + add/edit/delete dialog. `lib/data/recurring.ts`.
- [x] 10. Categories UI: expense/income sections + color-swatch form + CRUD. `lib/data/categories.ts`.
- [x] 11. Data layer: `lib/types.ts`, `lib/data/*` (async; now Prisma-backed). Mock fixtures removed after wiring.

### Phase B — backend wiring
- [x] 12. Prisma 7 schema + migrate (Neon) + `lib/db.ts` (PrismaNeon adapter + ws). NOTE: Prisma 7 — no `url` in schema datasource (use `prisma.config.ts` + dotenv); run `prisma generate` (postinstall).
- [x] 13. Auth: `lib/auth/{jwt,password,session}.ts` (jose + bcryptjs, httpOnly cookie), register/login/logout routes, `proxy.ts` gate. Forms wired to endpoints; `LogoutButton`.
- [x] 14. Categories → Prisma + server actions; default categories seeded on register (`lib/default-categories.ts`). NOTE: client-safe consts in `lib/colors.ts` (data files import `next/headers`).
- [x] 15. Transactions → Prisma + server actions; views render from server props + `router.refresh()`.
- [x] 16. Budgets → Prisma (groupBy spent) + actions; real current-month via `lib/month.ts`.
- [x] 17. Dashboard → Prisma aggregates (summary, 6-mo trend, breakdown, recent).
- [x] 18. Recurring → Prisma + actions; cron route `GET /api/cron/recurring` (materialize due, advance nextRun) + "Run now" button.
- [x] 19. Polish: `postinstall: prisma generate`, db scripts, gitignore test artifacts. Verified E2E (register→add tx→dashboard).
- [x] 20. Polish: currency symbol before amount (`Intl` `currencyDisplay: "narrowSymbol"`); category-breakdown container-query layout (no clip); global top loader bar (`components/top-loader.tsx`, `useLinkStatus`-era anchor/`pushState`/`popstate` tracking — quiet on `router.refresh`).

Each step: implement → verify → check off → next.
UI phase uses typed mock fixtures so swapping to real Prisma queries later is drop-in.

## Verify (end-to-end)
- register → auto-login → dashboard
- add/edit/delete expense+income persists (`npx prisma studio`)
- budget below spend → over-limit badge
- charts reflect data
- logout clears cookie; `/dashboard` → `/login`
- `GET /api/cron/recurring` materializes due items
- `npm run build` clean
