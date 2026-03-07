# Store — Next.js + NestJS Интернет-магазин (Turborepo)

## Команды

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запустить frontend (:3000) и backend (:3001) |
| `pnpm build` | Собрать все apps |
| `pnpm test` | Запустить все unit тесты |
| `pnpm lint` | ESLint по всему монорепо |
| `pnpm --filter backend test` | Тесты только backend |
| `pnpm --filter frontend dev` | Только frontend |
| `pnpm --filter backend dev` | Только backend |
| `pnpm --filter shared prisma:migrate` | Создать и применить миграцию |
| `pnpm --filter shared prisma:generate` | Регенерировать Prisma client |
| `pnpm --filter shared prisma:studio` | Открыть Prisma Studio (:5555) |
| `pnpm --filter shared prisma:seed` | Загрузить тестовые данные |

## Архитектура

```
store/                          ← монорепо корень
  apps/
    frontend/                   ← Next.js 14 App Router, порт 3000
    backend/                    ← NestJS, порт 3001
  packages/
    shared/                     ← Prisma client + schema, Zod схемы, общие типы
  turbo.json
  package.json
```

## Структура Frontend (apps/frontend/src/)

```
app/
  (auth)/login/          ← страница входа, кнопка Google OAuth
  (auth)/register/       ← регистрация (редирект на Google)
  (shop)/products/       ← каталог с фильтрами по тегам/категориям
  (shop)/products/[slug]/← страница товара + отзывы
  (shop)/cart/           ← корзина (Zustand, localStorage)
  (shop)/checkout/       ← форма доставки (COURIER|PICKUP|POST)
  (account)/profile/     ← профиль пользователя
  (account)/orders/[id]/ ← детали заказа
  (admin)/dashboard/     ← аналитика (Recharts графики)
  (admin)/products/      ← таблица товаров
  (admin)/products/new/  ← добавить товар + теги
  (admin)/products/[id]/ ← редактировать товар
  (admin)/orders/        ← все заказы с фильтрами
  (admin)/orders/[id]/   ← детали + смена статуса
components/
  ui/                    ← shadcn/ui (не редактировать вручную)
  layout/                ← Header, Footer
  product/               ← ProductCard, ProductGrid, ProductFilters
  cart/                  ← CartDrawer, CartItem
  checkout/              ← DeliveryMethodSelect, AddressForm
  admin/                 ← StatsCard, RevenueChart, OrderStatusPie
lib/
  api.ts                 ← fetch-клиент к backend (:3001)
  validations/           ← Zod схемы (импортировать из packages/shared)
store/
  cart.ts                ← Zustand + persist middleware
```

## Структура Backend (apps/backend/src/)

```
auth/
  auth.service.ts          ← Google OAuth flow, JWT выдача в httpOnly cookie
  auth.service.spec.ts     ← ТЕСТЫ
  strategies/
    google.strategy.ts     ← passport-google-oauth20
    jwt.strategy.ts        ← проверка JWT из cookie
  guards/
    jwt-auth.guard.ts
    roles.guard.ts
users/
  users.service.ts
  users.service.spec.ts    ← ТЕСТЫ
products/
  products.service.ts      ← CRUD, фильтры по тегам/категориям
  products.service.spec.ts ← ТЕСТЫ
  products.controller.ts
  dto/
categories/
  (аналогично products)
tags/
  tags.service.ts
  tags.service.spec.ts     ← ТЕСТЫ
  tags.controller.ts
orders/
  orders.service.ts        ← создание заказа, смена статуса
  orders.service.spec.ts   ← ТЕСТЫ
  orders.controller.ts
analytics/
  analytics.service.ts     ← агрегация: выручка, топ товары, статусы
  analytics.service.spec.ts← ТЕСТЫ
  analytics.controller.ts  ← @Roles(Role.ADMIN) только для админов
```

## Стек

- **Монорепо**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Zod
- **Backend**: NestJS, TypeScript, Passport, JWT (httpOnly cookie), class-validator
- **База данных**: Supabase (PostgreSQL) + Prisma ORM
- **Auth**: Google OAuth 2.0 → JWT (без паролей)
- **Аналитика**: Recharts (фронт) + Prisma aggregations (бэк)
- **Тесты**: Jest + `@nestjs/testing` + `jest-mock-extended`

## Правила кода

### Общие
- TypeScript strict mode везде
- `@/` алиас для импортов внутри каждого app

### Frontend
- Server Components по умолчанию, `"use client"` только для событий/браузерных API/Zustand
- Никаких прямых обращений к БД из frontend — только через Backend API
- `lib/api.ts` — единственное место для fetch к backend

### Backend
- НИКОГДА не создавать `new PrismaClient()` — импортировать `db` из `packages/shared/src/db`
- Один модуль = один домен (products, orders, users, auth, tags, categories, analytics)
- Каждый `*.service.ts` ОБЯЗАТЕЛЬНО имеет `*.service.spec.ts` рядом
- `@Roles(Role.ADMIN)` guard на всех admin-эндпоинтах

### Тесты (NestJS)
- Мокировать Prisma через `jest-mock-extended`: `mockDeep<PrismaClient>()`
- Тестировать: happy path, ошибки (404, 409, 403), граничные случаи
- Запускать перед каждым коммитом: `pnpm test`

## Переменные окружения

```bash
# Database (Supabase: Settings → Database → URI)
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="..."                        # openssl rand -base64 32

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_CALLBACK_URL="http://localhost:3001/api/auth/google/callback"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Файл `.env` — gitignored, `.env.example` — коммитится.
`DATABASE_URL` также должен быть в `~/.zshrc` для MCP postgres сервера.

## Gotchas

- Prisma singleton: `globalThis` паттерн в `packages/shared/src/db.ts` — не менять
- `NEXT_PUBLIC_*` переменные вшиваются при сборке, не в runtime
- Google OAuth callback URL в Google Console должен точно совпадать с `GOOGLE_CALLBACK_URL`
- JWT передаётся как `httpOnly` cookie — frontend не может читать его через JS, это нормально
- Route groups `(auth)`, `(shop)`, `(admin)` НЕ попадают в URL
- shadcn/ui компоненты в `components/ui/` — добавлять через `npx shadcn@latest add <name>`
- Корзина (Zustand) хранится только в localStorage, синхронизация с БД только при оформлении заказа
- Analytics API: только для роли ADMIN, проверяется через `RolesGuard`

## MCP серверы (активны автоматически)

- **postgres**: прямые SQL запросы к Supabase — "Покажи все заказы за эту неделю"
- **context7**: актуальные доки Next.js, NestJS, Prisma, Zustand — "use context7 — как сделать Guard?"
- **memory**: граф знаний, факты сохраняются между сессиями
