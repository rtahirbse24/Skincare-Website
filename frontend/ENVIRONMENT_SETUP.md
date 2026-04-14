# Environment Configuration Guide

This guide explains how to properly configure environment variables for both development and production environments.

## 📁 File Structure

```
frontend/
├── .env.local          # Development environment (gitignored)
├── .env.production     # Production environment (committed)
├── lib/
│   └── config.ts       # Centralized configuration
└── package.json        # Updated scripts
```

## 🔧 Environment Files

### `.env.local` (Development)
```env
# Development Environment Variables
# Used when running locally with npm run dev

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5007
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Cloudinary (Development)
CLOUDINARY_CLOUD_NAME=db2tuzuim
CLOUDINARY_API_KEY=179647694267337
CLOUDINARY_API_SECRET=OsGjOuZ7wfj-SZgD2FZxxznqAmA

# Admin Credentials (Development)
ADMIN_EMAIL=a.altawil@mazayaunited.com
ADMIN_PASSWORD=Ammar

# JWT Secret (Development)
JWT_SECRET=dhkhdhdhd4f7dfdfdf44
```

### `.env.production` (Production)
```env
# Production Environment Variables
# Used when deployed to production (Railway/Netlify)

# API Configuration
NEXT_PUBLIC_API_URL=https://skincare-website-production-be30.up.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://zippy-kangaroo-914e14.netlify.app

# Cloudinary (Production - same as dev for now)
CLOUDINARY_CLOUD_NAME=db2tuzuim
CLOUDINARY_API_KEY=179647694267337
CLOUDINARY_API_SECRET=OsGjOuZ7wfj-SZgD2FZxxznqAmA

# Admin Credentials (Production)
ADMIN_EMAIL=a.altawil@mazayaunited.com
ADMIN_PASSWORD=Ammar

# JWT Secret (Production - should be different from dev)
JWT_SECRET=your-production-jwt-secret-here
```

## 🛠️ Centralized Configuration (`lib/config.ts`)

```typescript
import { z } from 'zod';

// Environment schema with defaults
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5007'),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  // ... other env vars with defaults
});

// Validate and export configuration
export const config = envSchema.parse(process.env);

// Legacy export for backward compatibility
export const API_BASE = config.NEXT_PUBLIC_API_URL;

// Environment-aware fetch helper
export async function fetchAPI(endpoint: string, options = {}) {
  const url = `${config.NEXT_PUBLIC_API_URL}${endpoint}`;
  return fetch(url, { cache: 'no-store', ...options });
}
```

## 🚀 Usage in Components

### Before (❌ Hardcoded)
```tsx
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://production-url...';

const response = await fetch(`${API_BASE}/api/analytics`);
```

### After (✅ Clean & Scalable)
```tsx
import { config, API_BASE, fetchAPI } from '@/lib/config';

// Method 1: Use config object
const response = await fetch(`${config.api.baseUrl}/api/analytics`);

// Method 2: Use legacy API_BASE
const response = await fetch(`${API_BASE}/api/analytics`);

// Method 3: Use fetchAPI helper (recommended)
const data = await fetchAPI('/api/analytics');
```

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3000",  // Runs on port 3000
    "build": "next build",
    "start": "next start"
  }
}
```

## 🔄 Environment Detection

The configuration automatically detects the environment:

- **Development**: `NODE_ENV === 'development'` → Uses `.env.local`
- **Production**: `NODE_ENV === 'production'` → Uses `.env.production`

## 🌐 CORS Configuration (Backend)

Update your backend to allow the correct origins:

```typescript
const allowedOrigins = [
  'http://localhost:3000',  // Development
  'https://zippy-kangaroo-914e14.netlify.app',  // Production
  process.env.FRONTEND_URL
];
```

## ✅ Benefits

1. **No hardcoded URLs** in components
2. **Automatic environment switching**
3. **Type-safe configuration** with Zod validation
4. **Centralized management** of all environment variables
5. **Production-ready** with proper fallbacks
6. **Backward compatible** with existing code

## 🚦 Running the Application

### Development
```bash
# Frontend (port 3000)
npm run dev

# Backend (port 5007)
npm start
```

### Production
```bash
# Build and deploy
npm run build
npm start
```

The app will automatically use the correct API URLs based on the environment!</content>
<parameter name="filePath">c:\Dev\Skincare\ENVIRONMENT_SETUP.md