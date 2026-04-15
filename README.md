# Skincare E-Commerce Platform

A fullstack skincare e-commerce project for Topicrem and Novexpert products with Arabic/English multilingual support, built using Next.js 15, React, Express.js, MongoDB, Recharts analytics, and Cloudinary.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Admin Dashboard](#admin-dashboard)
- [Analytics & Metrics](#analytics--metrics)
- [Internationalization (i18n)](#internationalization-i18n)
- [Environment Variables](#environment-variables)
- [Setup and Run](#setup-and-run)
- [Development Workflow](#development-workflow)
- [Production Build](#production-build)
- [Architecture and Data Flow](#architecture-and-data-flow)
- [Conventions and Notes](#conventions-and-notes)

## Project Overview

This repository contains two main applications:

- `backend/`: Express.js + TypeScript API server with MongoDB persistence
- `frontend/`: Next.js 15 + React user-facing storefront with Tailwind CSS, analytics, and admin dashboard

The system is designed for a skincare storefront with product browsing, order placement, coupon validation, comprehensive analytics, and admin management interfaces.

## Key Features

- **Product Catalog**: Browse Topicrem and Novexpert brands with descriptions, benefits, ingredients, usage
- **Shopping**: Product detail pages, cart functionality, WhatsApp order flow with prefilled messages
- **Coupon System**: Global enable/disable toggle, coupon validation, price calculation
- **Order Management**: Order processing, status tracking (pending/completed), customer details capture
- **Analytics Dashboard**: Real-time visitor metrics, 7-day trend bar charts, page visit breakdown, growth indicators
- **Message System**: Contact form submissions with admin review
- **Admin Interface**: Dashboard for products, orders, messages, coupons, and real-time analytics
- **JWT Authentication**: Secure admin authentication for protected routes
- **Multi-Language**: Arabic (RTL) and English (LTR) with locale-aware routing
- **Image Management**: Cloudinary integration for product uploads
- **Visitor Tracking**: Automatic visitor counting and analytics
- **Data Persistence**: MongoDB for products, orders, coupons, messages, visits, analytics

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.15 with App Router
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **Components**: Radix UI (Button, Card, Badge, Input, Select, Textarea)
- **Charts**: Recharts (BarChart, LineChart, Area, XAxis, YAxis, Tooltip, Legend)
- **Icons**: Lucide React
- **i18n**: next-intl with custom locale routing
- **State**: React hooks + Context API
- **Package Manager**: pnpm

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Auth**: JWT tokens
- **File Upload**: Multer + Cloudinary
- **Port**: 5000

### Deployment
- **Frontend**: Netlify with Next.js
- **Database**: MongoDB Atlas
- **Media**: Cloudinary CDN

## Repository Structure

```
Skincare/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── analyticsController.ts
│   │   │   ├── authController.ts
│   │   │   ├── categoriesController.ts
│   │   │   ├── couponController.ts
│   │   │   ├── messageController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── productController.ts
│   │   │   └── visitController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── Admin.ts
│   │   │   ├── Category.ts
│   │   │   ├── Coupon.ts
│   │   │   ├── CouponSettings.ts
│   │   │   ├── Message.ts
│   │   │   ├── Order.ts
│   │   │   ├── PageVisit.ts
│   │   │   ├── Product.ts
│   │   │   ├── Visit.ts
│   │   │   └── Visitor.ts
│   │   ├── routes/
│   │   │   ├── analytics.ts
│   │   │   ├── auth.ts
│   │   │   ├── categories.ts
│   │   │   ├── coupon.ts
│   │   │   ├── messages.ts
│   │   │   ├── orders.ts
│   │   │   ├── products.ts
│   │   │   ├── upload.ts
│   │   │   └── visitor.ts
│   │   ├── utils/
│   │   │   ├── convertImages.ts
│   │   │   ├── password.ts
│   │   │   ├── seedAdmin.ts
│   │   │   └── seedProducts.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── data/
│   │   └── store.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── api/ (Next.js API routes)
│   │   ├── [locale]/ (Locale-prefixed routes)
│   │   │   ├── admin/ (Dashboard pages)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── brand/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   ├── order-confirmed/
│   │   │   └── product/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/ (React components)
│   ├── data/
│   │   └── store.json
│   ├── hooks/ (React hooks)
│   ├── lib/ (Utilities)
│   ├── messages/ (i18n)
│   ├── public/ (Static assets)
│   ├── src/i18n/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── middleware.ts
│   └── pnpm-lock.yaml
├── netlify.toml
├── PROJECT_ARCHITECTURE.md
├── README.md
└── structure.txt
```

## Frontend

Next.js 15 application with App Router, multi-locale support, and admin dashboard.

### Key Pages
- **Home** (`/[locale]`): Featured products
- **Products** (`/[locale]/product/[id]`): Product details
- **Brands** (`/[locale]/brand/[brand]`): Category browsing
- **Shopping**: Cart, checkout, order confirmation
- **Admin Dashboard** (`/[locale]/admin/dashboard`): Analytics and metrics
- **Admin Management**: Coupons, products, messages

### Frontend Scripts
```bash
cd frontend
npm install        # or pnpm install
npm run dev       # Dev server on port 3000
npm run build     # Production build
npm start         # Serve production build
npm run lint      # Run ESLint
```

## Backend

Express.js API server with MongoDB and JWT authentication.

### API Endpoints
- **Auth**: `/api/auth/login`, `/api/auth/logout`
- **Products**: `/api/products`, `/api/products/:id`
- **Orders**: `/api/orders`, `/api/orders/:id`
- **Coupons**: `/api/coupons`, `/api/coupons/toggle-global`, `/api/coupons/validate`
- **Messages**: `/api/messages`
- **Analytics**: `/api/analytics`
- **Visits**: `/api/visitors`
- **Categories**: `/api/categories`

### Backend Scripts
```bash
cd backend
npm install            # Install dependencies
npm run dev           # Dev server (port 5000, nodemon)
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled server
npm run seed          # Create first admin
```

## Admin Dashboard

Comprehensive management interface with:

- **Analytics**: Visitor trends (7-day bar chart), weekly totals, page visits, growth indicators
- **Orders**: View all orders, customer details, status tracking, completion
- **Products**: CRUD operations, multilingual support, image uploads, category assignment
- **Coupons**: Create/manage coupons, global system toggle, usage tracking
- **Messages**: Review contact form submissions

### Admin Authentication
- Login with admin email/password
- JWT token in localStorage
- Protected routes with token verification
- Auto-logout on token expiration

## Analytics & Metrics

Features include:

- **KPI Cards**: Today's visitors, pending orders, total products, total messages
- **7-Day Bar Chart**: Daily visitor counts from 3 days ago to 3 days future
- **Weekly Totals**: Sum of all 7 days
- **Growth**: Daily percentage change vs. previous day
- **Page Visits**: Breakdown with counts and percentages
- **Safe Date Handling**: ISO format (YYYY-MM-DD) to prevent "Invalid Date"
- **Real-time Updates**: Auto-refresh on page load

## Internationalization (i18n)

- **Default Locale**: `/en`
- **Supported**: `en` (LTR), `ar` (RTL)
- **Translation Files**: `frontend/messages/ar.json`, `frontend/messages/en.json`
- **Root Redirect**: `/` → `/en` (via middleware)
- **RTL Support**: Automatic for Arabic locale

## Environment Variables

### Backend `.env`
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skincare
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PORT=5000
NODE_ENV=development
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production (on Netlify), use your deployed backend URL.

## Setup and Run

### Backend Setup
```bash
cd backend
npm install
# Edit .env with MongoDB URI and Cloudinary credentials
npm run seed          # Creates admin account
npm run dev          # Start server
```

### Frontend Setup
```bash
cd frontend
npm install           # or pnpm install
# Create .env.local with NEXT_PUBLIC_API_URL
npm run dev          # Start dev server
```

### Access
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`
- **Admin**: `http://localhost:3000/en/admin` (after login)

## Development Workflow

Run both in separate terminals:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Browser
open http://localhost:3000
```

Git workflow:
```bash
git add .
git commit -m "Fix: description"
git push origin main
```

## Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

Netlify auto-deploys on push to main.

## Architecture and Data Flow

### Frontend → Backend

Frontend calls API routes which proxy to backend or read local data.

**Product Fetch**:
```
Component → fetch('/api/products') →
Next.js Route → Backend API →
Returns Product[]
```

**Coupon Validation**:
```
Checkout → fetch('/api/coupons/validate', {code, productIds}) →
Backend → Returns {discount, applicableProductIds}
```

**Order Placement**:
```
Form → fetch('/api/orders', {POST}) →
Backend MongoDB → WhatsApp link →
Returns {orderId}
```

### Backend Structure

MVC pattern with:
- **Models**: Mongoose schemas with TypeScript
- **Controllers**: Business logic and request handlers
- **Routes**: Express route definitions with auth
- **Middleware**: JWT verification
- **Utils**: Helper functions (hashing, seeding)

### Database (MongoDB Atlas)

Collections:
- `products`: Details, prices, images, ingredients
- `orders`: Customer orders with items, status
- `coupons`: Discount codes with applicability
- `couponsettings`: Global coupon system toggle
- `messages`: Contact form submissions
- `visits`: Visitor tracking
- `visitors`: Unique visitor identifiers
- `admins`: Admin accounts
- `categories`: Product categories per brand
- `pagevisits`: Page analytics

## Conventions and Notes

### Backend Conventions
- **Variables**: `camelCase`
- **Files**: `camelCase.ts` (models, controllers)
- **Validation**: In controllers
- **Async**: async/await always
- **Errors**: Console with `[functionName]` context
- **Multilingual**: `{ en: string, ar: string }` objects

### Frontend Conventions
- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase` or `useCamelCase`
- **Styling**: Tailwind CSS classes
- **Translations**: Use translation files
- **Client Markers**: `"use client"` when needed
- **Locale Links**: Always include `/${locale}` in navigation

### Project Details
- **Brands**: `Topicrem`, `Novexpert`
- **Currency**: JOD
- **Languages**: English (default), Arabic
- **Admin**: Single account per instance
- **Coupons**: Global toggle disables all
- **Analytics**: 7-day rolling window
- **Images**: Cloudinary CDN
- **Orders**: WhatsApp integration (no payments)

## Troubleshooting

- **Backend won't start**: Check MongoDB URI, verify Atlas is accessible
- **Image upload fails**: Verify Cloudinary credentials
- **404 on routes**: Ensure locale prefix (`/en` or `/ar`)
- **Arabic not displaying**: Check RTL styles, verify fonts load
- **Admin login fails**: Verify credentials against seeded admin
- **Analytics shows 0**: Check visitor tracking is enabled
- **Coupons don't apply**: Verify global toggle is ON, coupon is active
- **Missing translations**: Check `frontend/messages/[locale].json`

## Recommended Improvements

- Payment gateway (Stripe, Paddle)
- Email notifications for orders
- Customer accounts & order history
- Inventory management
- Advanced search & filtering
- Automated tests (Jest, RTL)
- Performance monitoring
- SEO optimization
- Cookie consent
- Dark mode support

---

For detailed architecture, see [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md).
