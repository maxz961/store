# Store — Next.js + NestJS Интернет-магазин (Turborepo)

## Как работать с этим проектом (правила для Claude)

### 1. Чеклист перед каждой задачей
Перед написанием кода явно сообщать:
- Что собираюсь сделать
- Какие файлы будут затронуты
- Какие тесты напишу или обновлю
- Ждать подтверждения перед началом

### 2. Ветки и коммиты
- Каждый новый функционал — новая ветка, checkout от `develop`
- Формат имени ветки: `feature/название-фичи`
- Один коммит = одна завершённая фича или модуль
- Не делать коммит пока тесты не проходят
- Формат: `feat: описание` / `fix: описание` / `refactor: описание`
- После завершения фичи — merge в `develop`, потом `develop` → `release-candidate` → `main`

### 3. Swagger документация
- Установлен `@nestjs/swagger`
- Документация доступна: http://localhost:3001/api/docs
- Все контроллеры должны иметь `@ApiTags()` и описания

### 4. Стиль кода (можно изменить в любой момент)
- Одинарные кавычки везде
- Точка с запятой в конце строк
- Отступ: 2 пробела
- Именование: camelCase для переменных, PascalCase для классов/типов
- Async/await вместо .then()/.catch()
- Не использовать `any` без крайней необходимости

### 5. Качество кода
- Писать чистый профессиональный код без костылей
- Код должен быть понятен и лаконичен — никаких обходных решений ради скорости
- Если решение выглядит как "костыль" — остановиться и найти правильный подход

### 6. Тесты
- Перед написанием тестов подумать: покрывает ли тест реальное поведение?
- Тестировать happy path, ошибки (404, 403, 409) и граничные случаи
- Не писать тесты "для галочки" — каждый тест должен ловить реальный баг
- После каждой новой фичи запускать `pnpm test` и убеждаться что всё зелёное
- **Smoke-тесты для каждой страницы**: при создании новой страницы обязательно писать `page.spec.tsx` рядом, который проверяет:
  - Страница рендерится без ошибок (не крашится)
  - Ключевой контент виден (заголовки, кнопки, labels)
  - Состояния: загрузка, ошибка, пустое, авторизация/не авторизован
  - Основные действия работают (клик кнопок вызывает нужные функции)
- **Smoke-тесты для компонентов**: переиспользуемые компоненты (Header, Breadcrumbs и т.д.) тоже покрываются `*.spec.tsx`

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
- Route groups `(auth)`, `(shop)`, `(admin)` НЕ попадают в URL — внутри нужна папка с реальным именем (`admin/`, `account/`)
- shadcn/ui компоненты в `components/ui/` — добавлять через `npx shadcn@latest add <name>`
- Корзина (Zustand) хранится только в localStorage, синхронизация с БД только при оформлении заказа
- Analytics API: только для роли ADMIN, проверяется через `RolesGuard`

## Supabase + Prisma — критически важно

- `DATABASE_URL` с портом `6543` (transaction pooler) **ОБЯЗАТЕЛЬНО** требует `?pgbouncer=true` иначе Prisma падает с ошибкой `prepared statement does not exist`
- `db.ts` автоматически добавляет `?pgbouncer=true` если его нет — не убирать эту логику
- `env.ts` в backend загружает `.env` с `override: true` ДО инициализации Prisma — не убирать
- Перед запуском `pnpm dev` убить старые процессы: `pkill -f "nest.js start"; pkill -f "next dev"`
- Никогда не запускать `pnpm dev` дважды — накапливаются зомби-процессы на портах 3000/3001

## Next.js 15 — важные изменения

- `searchParams` в Server Components теперь `Promise<{...}>` — нужно `await searchParams`
- `params` в динамических роутах тоже `Promise<{slug: string}>` — нужно `await params`
- Пример: `({ searchParams }: { searchParams: Promise<{ q?: string }> })` → `const sp = await searchParams`
- `Content-Type: application/json` на GET-запросах вызывает 500 в NestJS — не ставить заголовок если нет тела запроса

## MCP серверы (активны автоматически)

- **postgres**: прямые SQL запросы к Supabase — "Покажи все заказы за эту неделю"
- **context7**: актуальные доки Next.js, NestJS, Prisma, Zustand — "use context7 — как сделать Guard?"
- **memory**: граф знаний, факты сохраняются между сессиями

## Design System

### Философия
- **Минимализм**: только необходимое, без декоративных элементов
- **Ясность**: одно главное действие на экране, CTA всегда очевиден
- **Лёгкость**: много воздуха (generous whitespace), мягкие приятные цвета
- **Интуитивность**: пользователь не должен думать — где нажать и так понятно

### Цветовая палитра
| Роль | Light | Dark | Назначение |
|------|-------|------|-----------|
| background | `#f8fafc` (slate-50) | `#0f172a` (slate-900) | Фон страниц |
| card | `#ffffff` | `#1e293b` (slate-800) | Карточки, панели |
| primary | `#4361ee` (indigo) | `#6366f1` (indigo-500) | Кнопки, акценты, ссылки |
| muted | `#f1f5f9` (slate-100) | `#1e293b` (slate-800) | Второстепенные фоны |
| border | `#e2e8f0` (slate-200) | `#334155` (slate-700) | Разделители, границы |
| text | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | Основной текст |
| muted-text | `#64748b` (slate-500) | `#94a3b8` (slate-400) | Подписи, вторичный текст |

HSL значения для globals.css:
- background light: `210 40% 98%` / dark: `222 47% 11%`
- primary light: `231 82% 60%` / dark: `239 84% 67%`
- border light: `214 32% 91%` / dark: `215 28% 27%`
- muted light: `210 40% 96%` / dark: `217 33% 17%`

### Типографика
- Шрифт: **Inter** (уже подключён)
- H1 (страница): `text-2xl font-semibold` — НЕ bold, bold выглядит тяжело
- H2 (секция): `text-lg font-medium`
- Тело: `text-sm` (14px) или `text-base` (16px)
- Подписи: `text-xs text-muted-foreground`
- НЕ использовать `text-4xl` / `font-black` — слишком громко

### Компоненты
- **Кнопки**: `rounded-lg` (не `rounded-full`), одна `primary` кнопка на экран
- **Карточки**: `rounded-xl border border-border bg-card shadow-sm` — тонкая граница, лёгкая тень
- **Инпуты**: `rounded-lg border border-input bg-background` — без лишнего
- **Бейджи/теги**: `rounded-full` допустимо (маленькие пилюли)
- **Иконки**: lucide-react, `h-4 w-4` (inline) или `h-5 w-5` (кнопки)

### Переиспользование компонентов (строгое правило)
- **Перед созданием** нового компонента — проверить `components/ui/`, `components/product/`, `components/layout/`
- **Общие UI** (Button, Badge, Input, Card) — только из `components/ui/`, никакого inline дублирования
- **Если похожий есть** — расширять через props, не создавать копию
- **Правило 3**: один и тот же JSX встречается 3+ раза → выносить в компонент
- **Страницы** содержат только логику и композицию, не стили напрямую
- Структура: `ui/` — атомарные, `product/` — доменные, `layout/` — структурные, `admin/` — админские

### Отступы и сетка
- Padding страницы: `px-4 py-8` мобайл → `px-6 py-12` десктоп
- Gap в сетке: `gap-4` (16px) стандарт, `gap-6` (24px) для карточек
- Padding карточки: `p-4` мобайл, `p-6` десктоп
- Секции разделять: `mt-12` или `mt-16`, НЕ `mt-4`

### UX правила
- Максимум **1 primary button** на экран — остальные `ghost` или `outline`
- Empty state: иконка + заголовок + описание + action кнопка
- Загрузка: skeleton-плейсхолдеры, НЕ спиннеры
- Ошибки валидации: inline под полем, красный текст `text-destructive text-xs`
- Hover эффекты: мягкие (`hover:bg-accent`), без резких переходов
- Transitions: `transition-colors duration-150` на интерактивных элементах
