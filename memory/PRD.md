# Y-Store Marketplace - PRD v8.0

## Дата оновлення: 01.03.2026

---

## Статус проекту: ПРАЦЮЄ ✅

### URL
- **Frontend**: https://full-stack-setup-19.preview.emergentagent.com
- **API**: https://full-stack-setup-19.preview.emergentagent.com/api
- **Admin**: /admin (после авторизации)

### Credentials
- Admin: admin@ystore.com / admin123
- Telegram Bot: @YStore_a_bot

---

## Що реалізовано

### Оригінальна задача
Клонування репозиторію https://github.com/svetlanaslinko057/dddddddd, підняття фронтенд, бекенд, MongoDB, вивчення структури коду та адмінки.

### Виконано (01.03.2026)

#### 1. Клонування та розгортання ✅
- Склоновано репозиторій dddddddd
- Перенесено backend/frontend до /app
- Встановлено всі залежності (Python + Node.js)
- Створено admin користувача

#### 2. Backend запущено ✅
- FastAPI сервер на порту 8001
- MongoDB підключена (marketplace_db)
- Модульна архітектура з 40+ модулями
- Фоновий планувальник jobs (tracking, notifications, alerts, guard, analytics)

#### 3. Frontend запущено ✅
- React 19 з Tailwind CSS
- Модалка вибору мови (UA/RU)
- Адаптивний дизайн
- CRACO конфігурація

#### 4. Адмін-панель ✅
- Аналітика - статистика продаж, замовлень
- Користувачі - керування користувачами
- Категорії - дерево категорій
- Товари - CRUD товарів
- Замовлення - обробка замовлень
- Виплати - фінансові операції
- Слайдер - hero банери
- CRM - керування клієнтами
- Акції - промо-акції
- Популярні категорії
- Кастомні розділи

#### 5. Інтеграції налаштовані ✅
- **Telegram Bot Token**: 8239151803:AAFBBuflCH5JPWUxwN9UfifCeHgS6cqxYTg
- **Telegram Bot**: @YStore_a_bot
- **Nova Poshta API**: 5cb1e3ebc23e75d737fd57c1e056ecc9
- **Fondy Payment**: Merchant ID 1558123

#### 6. Дані засіяно ✅
- 58 категорій (10 головних + 48 підкатегорій)
- 40 товарів (смартфони, ноутбуки, техніка, аксесуари)

---

## Архітектура

### Backend Modules (/app/backend/modules/)
```
├── auth/            # JWT + Google OAuth
├── products/        # Products CRUD
├── orders/          # Order state machine
├── cart/            # Shopping cart
├── payments/        # Fondy provider
├── delivery/        # Nova Poshta TTN
├── bot/             # Telegram admin bot (aiogram)
├── analytics/       # Events, funnel tracking
├── analytics_intel/ # Business intelligence
├── crm/             # Customer management
├── admin/           # Admin operations
├── banners/         # Hero slides, banners
├── promo/           # Promo codes
├── reviews/         # Product reviews
├── search/          # Text search
├── notifications/   # Push, SMS, Email
├── guard/           # Fraud detection
├── growth/          # Automation engine
├── risk/            # Risk scoring
├── revenue/         # Revenue optimization
├── returns/         # Returns management
├── refunds/         # Refund processing
├── pickup_control/  # Parcel tracking
├── finance/         # Financial ledger
├── jobs/            # Background schedulers
├── site/            # Site settings
├── content/         # Static pages
├── ab/              # A/B testing
├── automation/      # Automation rules
├── cabinet/         # User cabinet
├── catalog/         # Catalog facets
├── compare/         # Product comparison
├── ops/             # Operations dashboard
├── seo/             # SEO routes
├── security/        # Rate limiter, middleware
├── timeline/        # Order timeline
├── wishlist/        # Wishlist feature
└── ...
```

### Frontend Structure (/app/frontend/src/)
```
├── pages/           # Route pages (Home, Admin, Catalog, etc.)
├── components/      # Reusable UI components
├── contexts/        # React contexts (Auth, Cart, Favorites)
├── hooks/           # Custom hooks
├── services/        # API services, analytics
├── utils/           # Utilities
├── i18n/            # Internationalization (UA/RU)
├── styles/          # CSS modules
├── api/             # API clients
└── layout/          # Layout components
```

---

## Головні фічі

| Фіча | Статус |
|------|--------|
| Auth (JWT + Google) | ✅ |
| Product Catalog | ✅ |
| Shopping Cart | ✅ |
| Checkout (Guest + Auth) | ✅ |
| Fondy Payments | ✅ Налаштовано |
| Nova Poshta TTN | ✅ Налаштовано |
| Telegram Bot | ✅ @YStore_a_bot |
| Admin Dashboard | ✅ |
| Multi-language (UA/RU) | ✅ |
| Product Reviews | ✅ |
| Promo Codes | ✅ |
| CRM | ✅ |
| Risk Scoring | ✅ |
| Analytics | ✅ |
| A/B Testing | ✅ |
| Pickup Control | ✅ |

---

## Environment Variables

```env
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=marketplace_db
JWT_SECRET_KEY=your-super-secret-key-y-store-2026
TELEGRAM_BOT_TOKEN=8239151803:AAFBBuflCH5JPWUxwN9UfifCeHgS6cqxYTg
NOVAPOSHTA_API_KEY=5cb1e3ebc23e75d737fd57c1e056ecc9
NP_API_KEY=5cb1e3ebc23e75d737fd57c1e056ecc9
FONDY_MERCHANT_ID=1558123
FONDY_MERCHANT_PASSWORD=i4FfBa1tX5yHnMgRJ2p9wSvDkE8cL3bD4
```

---

## Запуск бота

```bash
cd /app/backend
python -m modules.bot.bot_app
```

Команди бота:
- /start, /menu - Головне меню
- /wizards - Майстри (ТТН, розсилка)
- /debug - Debug info
- /help - Довідка

---

## Next Action Items

### P0 (Критичні)
- [ ] Запуск Telegram бота як постійного процесу (supervisor)
- [ ] Тестування платежів Fondy в режимі test
- [ ] Перевірка створення ТТН Nova Poshta

### P1 (Важливі)
- [ ] Налаштування Nova Poshta sender credentials
- [ ] Email сервіс (SendGrid/SMTP)
- [ ] Cloudinary для зображень товарів

### P2 (Бажані)
- [ ] Push notifications
- [ ] Реферальна система
- [ ] SEO оптимізація

---

## User Personas

1. **Покупець** - переглядає каталог, додає товари в кошик, оформлює замовлення
2. **Адміністратор** - керує товарами, замовленнями, клієнтами через адмін-панель
3. **Оператор** - обробляє замовлення через Telegram бота
