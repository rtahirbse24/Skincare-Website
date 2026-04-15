# Skincare E-Commerce Fullstack Project Architecture

**Project**: French luxury skincare e-commerce platform (Topicrem & Novexpert) with English/Arabic i18n support.  
**Stack**: Next.js 15 + Express.js + MongoDB + Recharts + Cloudinary

---

## 1. SYSTEM ARCHITECTURE

### Deployment Diagram
```
┌────────────────────────────────────────────┐
│  Netlify (Frontend)                        │
│  ├── Next.js 15 App Router                │
│  ├── [locale] routing (/en, /ar)          │
│  ├── Admin Dashboard                      │
│  └── API Routes (proxy to backend)        │
└──────────────┬─────────────────────────────┘
               │ HTTPS
               ↓
┌────────────────────────────────────────────┐
│  Railway/Heroku/Vercel (Backend)          │
│  ├── Express.js API Server                │
│  ├── JWT Authentication                   │
│  ├── MongoDB Connection                   │
│  └── Cloudinary Integration               │
└──────────────┬─────────────────────────────┘
               │ HTTPS
               ↓
┌────────────────────────────────────────────┐
│  MongoDB Atlas (Database)                  │
│  ├── Collections (Products, Orders, etc.) │
│  └── Indexes & Schemas                    │
└────────────────────────────────────────────┘
                  ↑
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────────┐
│ Cloudinary CDN  │  │ JWT Tokens     │
│ (Images)        │  │ (localStorage) │
└─────────────────┘  └────────────────┘
```

### Data Flow

**1. User Browsing Products**
```
Frontend Component (React)
    ↓ fetch('/api/products')
Next.js API Route (proxy)
    ↓ fetch('http://backend:5000/api/products')
Express Backend
    ↓ Mongoose Query
MongoDB Atlas
    ↓ Product[]
Frontend ← Renders Products
```

**2. Admin Validating Coupon**
```
Checkout Component
    ↓ fetch('/api/coupons/validate', {code, productIds})
Next.js API Route
    ↓ POST to backend with auth header
Express Backend
    ↓ Check CouponSettings.globalEnabled
    ↓ Find Coupon by code
    ↓ Filter applicable products
Backend → {discount, applicableProductIds}
Frontend ← Update Order Total
```

**3. Placing Order**
```
Customer Form (Cart Item Details)
    ↓ fetch('/api/orders', {POST, orderData})
Next.js API Route
    ↓ POST to Express backend with auth
Express Backend
    ↓ Create Order in MongoDB
    ↓ Generate WhatsApp Link
Backend → {orderId, whatsappLink}
Frontend ← Redirects to WhatsApp
```

**4. Admin Viewing Analytics**
```
Admin Dashboard Component (React)
    ↓ fetch('/api/analytics')
Next.js API Route
    ↓ GET from Express backend
Express Backend
    ↓ Query Analytics collection
    ↓ Aggregate visitor trends
    ↓ Count orders by date
    ↓ Collect page visits
Backend → {visitorTrends[], orders[], pageVisits{}}
Frontend ← BarChart (Recharts)
         ← KPI Cards (Daily visitors, etc.)
         ← Page stats
```

---

## 2. PROJECT STRUCTURE

### Frontend (`frontend/`)

```
frontend/
├── app/
│   ├── api/                          # Next.js API routes (proxy layer)
│   │   ├── coupons/
│   │   │   ├── route.ts
│   │   │   ├── validate/route.ts
│   │   │   ├── delete/route.ts
│   │   │   ├── toggle-global/route.ts
│   │   │   └── toggle/route.ts
│   │   ├── orders/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── products/route.ts
│   │   ├── messages/route.ts
│   │   ├── analytics/route.ts
│   │   └── ...
│   ├── [locale]/                     # Locale-prefixed routes (en, ar)
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Home
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Admin login
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Analytics, orders, products, messages
│   │   │   ├── coupons/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── page.tsx
│   │   │   └── messages/
│   │   │       └── page.tsx
│   │   ├── product/
│   │   │   └── [id]/page.tsx         # Product detail
│   │   ├── brand/
│   │   │   └── [brand]/page.tsx      # Brand category
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── order-confirmed/page.tsx
│   │   └── about/page.tsx
│   ├── globals.css
│   └── layout.tsx                    # Root layout
├── components/                       # React components
│   ├── admin-dashboard.tsx
│   ├── brand-page-client-new.tsx
│   ├── brand-page-client.tsx
│   ├── cart-button.tsx
│   ├── cart-provider.tsx
│   ├── product-card.tsx
│   ├── site-footer.tsx
│   ├── site-header.tsx
│   ├── theme-provider.tsx
│   ├── visit-tracker.tsx
│   ├── VisitTracker.tsx
│   └── ui/                           # Radix UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       └── ...
├── data/
│   └── store.json                    # Fallback local data
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── api.ts                        # API utility functions
│   ├── categories.ts
│   ├── config.ts
│   ├── products.ts
│   ├── products-data.ts
│   ├── store.ts
│   └── utils.ts
├── messages/
│   ├── ar.json                       # Arabic translations
│   └── en.json                       # English translations
├── public/
│   ├── fonts/
│   ├── novexpertimage/
│   ├── skincareimages/
│   └── topicremimage/
├── src/
│   └── i18n/
├── styles/
│   └── globals.css
├── middleware.ts                     # Root → /en redirect
├── next.config.mjs
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

### Backend (`backend/`)

```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts            # Cloudinary SDK setup
│   │   └── database.ts              # MongoDB connection
│   ├── controllers/
│   │   ├── analyticsController.ts   # Visitor trends, page visits
│   │   ├── authController.ts        # Admin login/logout
│   │   ├── categoriesController.ts  # Category CRUD
│   │   ├── couponController.ts      # Coupon CRUD + validation
│   │   ├── messageController.ts     # Message CRUD
│   │   ├── orderController.ts       # Order CRUD
│   │   ├── productController.ts     # Product CRUD
│   │   └── visitController.ts       # Visitor tracking
│   ├── middleware/
│   │   └── auth.ts                  # JWT verification
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Category.ts
│   │   ├── Coupon.ts
│   │   ├── CouponSettings.ts        # Global toggle
│   │   ├── Message.ts
│   │   ├── Order.ts
│   │   ├── PageVisit.ts
│   │   ├── Product.ts
│   │   ├── Visit.ts
│   │   └── Visitor.ts
│   ├── routes/
│   │   ├── analytics.ts
│   │   ├── auth.ts
│   │   ├── categories.ts
│   │   ├── coupon.ts
│   │   ├── messages.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   ├── upload.ts
│   │   └── visitor.ts
│   ├── utils/
│   │   ├── convertImages.ts
│   │   ├── password.ts              # Bcrypt hashing
│   │   ├── seedAdmin.ts             # Create first admin
│   │   └── seedProducts.ts
│   └── server.ts                    # Express app & startup
├── uploads/                          # Local image storage
├── data/
│   └── store.json
├── dist/                            # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── .env                             # Secrets (MongoDB, JWT, Cloudinary)
```

---

## 3. KEY COMPONENTS & MODULES

### Frontend Admin Dashboard (`app/[locale]/admin/dashboard/page.tsx`)

**State**:
- `analytics`: Fetched visitor trends, page visits, order counts
- `orders`: All orders from backend
- `messages`: Contact submissions
- `products`: Product list
- `activeTab`: Tabs (analytics, orders, products, messages)

**Sections**:
1. **Analytics Tab** (default view)
   - KPI Cards: Today's visitors, pending orders, total products, messages
   - 7-Day Visitor Trends: Recharts BarChart with dynamic date range
   - Weekly Visitors: Sum of 7-day window
   - Growth: Percentage change calculation
   - Page Visits: Breakdown with percentages

2. **Orders Tab**
   - Table of all orders with customer name, email, date, total, status
   - Search/filter functionality
   - View modal for order details
   - Completion toggle

3. **Products Tab**
   - Add product form
   - Product list with image, name, brand, price
   - Edit/delete actions
   - Cloudinary image upload

4. **Messages Tab**
   - Contact form submissions
   - Name, email, message, date
   - Delete action

### Backend Analytics Controller (`controllers/analyticsController.ts`)

**Endpoints**:
- `GET /api/analytics`: Returns visitor trends, orders, page visits
- Aggregates:
  - `visitorTrends`: Array of objects with {date, visitors}
  - `recentOrders`: Latest orders
  - `pageVisits`: Object {page: count}

### Coupon System

**Flow**:
1. Admin sets global toggle: `CouponSettings.globalEnabled`
2. When OFF: `/api/coupons/validate` returns error "Coupon system disabled"
3. When ON: Customer enters code in checkout
4. Frontend calls `/api/coupons/validate` with code + productIds
5. Backend:
   - Finds coupon by code
   - Checks `appliesToAll` or filters products
   - Returns discount % and applicable product IDs
6. Frontend calculates new totals

**Toggle Fix** (Explicit State):
- Frontend sends: `{enabled: !globalEnabled}` (desired state)
- Backend sets: `settings.globalEnabled = enabled` (not toggle)
- Prevents desync from race conditions

### Visit Tracking

**Automatic**: `frontend/components/visit-tracker.tsx`
- Fires on page load
- POSTs to `/api/visitors` (creates Visit + Visitor records)
- Backend aggregates into analytics

---

## 4. DEVELOPMENT & BUILD COMMANDS

### Backend

```bash
cd backend

# Install & setup
npm install
npm run seed                 # Create admin account from .env

# Development
npm run dev                 # nodemon watch mode (port 5000)

# Production
npm run build               # Compile src/ → dist/
npm start                  # Run from dist/server.js
```

**nodemon Config** (auto-reload on file changes):
- Watches: `src/**/*.ts`
- Ignored: `node_modules`, `dist/`
- Runs: `npm run build && node dist/server.js`

### Frontend

```bash
cd frontend

# Install & setup
npm install                 # or pnpm install
npm run dev                # Hot-reload dev server (port 3000)

# Production
npm run build              # Build .next/ folder
npm start                  # Start from .next/ (requires build first)

# Code quality
npm run lint               # ESLint check
```

### Combined Development

**Terminal 1 - Backend**:
```bash
cd backend && npm run dev
# Output: Server listening on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend && npm run dev
# Output: ▲ Next.js ... ◆ ready
#         ➜  Local:    http://localhost:3000
```

**Terminal 3 - Browser**:
```bash
open http://localhost:3000
```

### Production Build & Deploy

**Backend** (Docker or self-hosted):
```bash
cd backend
npm run build
npm start
# Runs on PORT from .env (default 5000)
```

**Frontend** (Netlify auto-deploy):
```bash
cd frontend
npm run build
npm start     # Local testing only
# Push to main → Netlify auto-builds & deploys
```

---

## 5. NAMING CONVENTIONS

### Backend (Express + TypeScript)

**Files**:
- Models: `ProductName.ts` (PascalCase)
- Controllers: `resourceController.ts` (camelCase + suffix)
- Routes: `resource.ts` (camelCase)
- Middleware: `auth.ts` (kebab/camel)
- Utils: `utilName.ts` (camelCase)

**Functions**:
- `getProducts()`, `createOrder()`, `validateCoupon()` (camelCase)
- Async always: `async function ... { await ... }`

**Collections** (MongoDB):
- Singular: `Product`, `Order`, `Admin`, `Coupon`, `Visit`, `Visitor`

**Enums/Literals**:
- Brands: `'Topicrem' | 'Novexpert'` (exact case)
- Order Status: `'pending' | 'completed'`
- Coupon Scope: `'appliesToAll' | 'products'`

### Frontend (Next.js + React)

**Files**:
- Pages: `page.tsx`, `layout.tsx`
- Components: `kebab-case-name.tsx`
- Hooks: `use-kebab-case.ts`
- Utils: `utilName.ts`

**Components**:
- PascalCase: `ProductCard`, `SiteHeader`, `AdminDashboard`

**Functions**:
- camelCase: `fetchProducts()`, `calculateTotal()`, `formatDate()`
- Constants: `CONSTANT_CASE` or camelCase

**Directories**:
- kebab-case: `components/`, `lib/`, `hooks/`, `[locale]`, `admin/`

---

## 6. DATABASE MODELS (MongoDB)

### Admin
```typescript
{
  _id: ObjectId
  email: string
  password: string (bcrypt hashed)
  createdAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId
  name: string | {en, ar}
  brand: 'Topicrem' | 'Novexpert'
  price: number
  images: string[] (URLs)
  description: string | {en, ar}
  benefits: string | {en, ar}
  ingredients: string | {en, ar}
  howToUse: string | {en, ar}
  category: string
  type: string
  skinType: string
  texture: string
}
```

### Order
```typescript
{
  _id: ObjectId
  customerName: string
  phone: string
  email: string
  address: string
  items: [{productName, brand, quantity, price}]
  total: number
  status: 'pending' | 'completed'
  notes: string (optional)
  createdAt: Date
  timestamp: Date
}
```

### Coupon
```typescript
{
  _id: ObjectId
  code: string (uppercase)
  discount: number (1-100)
  appliesToAll: boolean
  products: ObjectId[] (Product references)
  isActive: boolean
}
```

### CouponSettings
```typescript
{
  _id: ObjectId
  globalEnabled: boolean
}
```

### Visit
```typescript
{
  _id: ObjectId
  visitorId: ObjectId (Visitor reference)
  page: string (URL or path)
  timestamp: Date
}
```

### Visitor
```typescript
{
  _id: ObjectId
  sessionId: string (generated or from cookie)
  firstVisit: Date
  lastVisit: Date
  visitCount: number
}
```

### Analytics (computed from visits & orders)
```typescript
{
  totalVisitors: number
  totalOrders: number
  totalProducts: number
  totalMessages: number
  pendingOrders: number
  visitorTrends: [{date, visitors}]
  pageVisits: {[page]: count}
  recentOrders: Order[]
}
```

---

## 7. ENVIRONMENT & SECRETS

### Backend `.env`
```
MONGODB_URI=mongodb+srv://user:pass@cluster...
JWT_SECRET=your-secret-key-minimum-32-chars
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword123
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
NODE_ENV=development
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production (Netlify):
```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

---

## 8. KEY FEATURES & IMPLEMENTATION

### Multi-Language (i18n)

- **Framework**: `next-intl`
- **Route Structure**: `app/[locale]/...`
- **Middleware**: Redirects `/` → `/en`
- **Translation Files**: `frontend/messages/{en,ar}.json`
- **Usage**: `useTranslations()` hook in components
- **RTL Support**: Applied automatically for Arabic

### Analytics Dashboard

- **Data Source**: `/api/analytics` endpoint
- **Chart Library**: Recharts
- **7-Day Window**: Dynamic generation (3 before, today, 3 after)
- **Date Handling**: ISO format (YYYY-MM-DD) to prevent "Invalid Date"
- **Metrics**:
  - KPI cards (visitors today, pending orders, products, messages)
  - 7-day bar chart (visitor counts per day)
  - Weekly visitor total
  - Growth percentage
  - Page visit breakdown

### Admin Authentication

- **Token Storage**: localStorage `adminToken`
- **Protected Routes**: Check token in layout/page components
- **API Calls**: Include `Authorization: Bearer {token}` header
- **Middleware**: Backend `auth.ts` verifies JWT
- **Session**: Lasts until token expiration

### Image Upload

- **Service**: Cloudinary
- **Frontend**: Multer file input → Form data
- **Backend**: `upload.ts` route handles POST
- **Flow**: File → Cloudinary → URL stored in Product
- **Display**: Direct Cloudinary URL with CDN delivery

### Order Processing

- **Creation**: Customer fills form → POST to `/api/orders`
- **Data Stored**: Customer info + items + total
- **Link Generated**: WhatsApp with prefilled message
- **Follow-up**: No email/payment, customer self-manages via WhatsApp

---

## 9. COMMON PATTERNS

### API Route Pattern (Frontend)

```typescript
// app/api/resource/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${backendUrl}/api/resource`, {
      headers: { Authorization: req.headers.get('Authorization') || '' },
    });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Controller Pattern (Backend)

```typescript
// controllers/resourceController.ts
export const getResources = async (req: Request, res: Response) => {
  try {
    const items = await Resource.find();
    res.json(items);
  } catch (e) {
    console.error('[getResources] error:', e);
    res.status(500).json({ error: 'Failed to fetch' });
  }
};
```

### Protected Route (Frontend)

```typescript
// app/[locale]/admin/page.tsx
'use client';

export default function AdminPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) router.push(`/${locale}/admin`);
  }, []);

  // Protected content here
}
```

---

## 10. DEPLOYMENT CHECKLIST

- [ ] Backend `.env` configured (MongoDB URI, Cloudinary, secrets)
- [ ] Frontend `.env.local` set to deployed backend URL
- [ ] Backend compiled: `npm run build` ✓
- [ ] Backend started: `npm start` ✓ (running on PORT)
- [ ] Frontend built: `npm run build` ✓
- [ ] MongoDB Atlas network access includes deployment IP
- [ ] Cloudinary API key/secret valid
- [ ] JWT_SECRET is strong & stored securely
- [ ] Admin seeded: `npm run seed`
- [ ] Middleware set for root redirect
- [ ] NEXT_PUBLIC_API_URL points to live backend
- [ ] Test: Admin can log in & load analytics
- [ ] Test: Products display correctly
- [ ] Test: Coupons validate & apply discounts
- [ ] Monitor logs for errors

---

## 11. TROUBLESHOOTING

| Problem | Cause | Solution |
|---------|-------|----------|
| 404 on `/` | No locale handling | Check middleware.ts redirect |
| API calls fail | Wrong API URL | Set NEXT_PUBLIC_API_URL |
| Analytics shows 0 | No visitors recorded | Check VisitTracker component, analytics endpoint |
| Images missing | Cloudinary creds | Verify API key/secret in backend |
| Admin can't log in | Token invalid | Seed admin, check JWT_SECRET |
| Dates show "Invalid" | Wrong date formatting | Use ISO format (YYYY-MM-DD) |
| Coupon won't apply | Global toggle OFF | Admin must enable global coupon system |
| Arabic text not RTL | Missing CSS | Check theme-provider applies dir="rtl" |

---

## 12. FUTURE ENHANCEMENTS

- [ ] Payment gateway (Stripe, Paddle)
- [ ] Email notifications (order confirm, shipping)
- [ ] Customer accounts & order history
- [ ] Inventory management & low-stock alerts
- [ ] Advanced product search & filtering
- [ ] Automated tests (Jest, Playwright)
- [ ] Performance monitoring (Sentry, New Relic)
- [ ] SEO optimization & sitemap
- [ ] Cookie consent banner
- [ ] Dark mode toggle
- [ ] GraphQL API migration
- [ ] API rate limiting & caching

---

**Current Status**: Production-ready skincare e-commerce platform with admin dashboard, analytics, and multilingual support.
