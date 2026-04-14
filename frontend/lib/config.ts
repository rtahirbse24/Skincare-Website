/**
 * Centralized Configuration for Skincare App
 *
 * This file provides environment-aware configuration that automatically
 * switches between development and production environments.
 *
 * Environment Variables:
 * - Development: Uses .env.local
 * - Production: Uses .env.production (or Railway/Netlify env vars)
 */

import { z } from 'zod';

// Environment schema validation with defaults for development
const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5007'),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().default('db2tuzuim'),
  CLOUDINARY_API_KEY: z.string().default('179647694267337'),
  CLOUDINARY_API_SECRET: z.string().default('OsGjOuZ7wfj-SZgD2FZxxznqAmA'),

  // Admin Credentials
  ADMIN_EMAIL: z.string().email().default('a.altawil@mazayaunited.com'),
  ADMIN_PASSWORD: z.string().default('Ammar'),

  // JWT Secret
  JWT_SECRET: z.string().default('dhkhdhdhd4f7dfdfdf44'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

/**
 * Application Configuration
 */
export const config = {
  // API URLs
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    frontendUrl: env.NEXT_PUBLIC_FRONTEND_URL,
  },

  // Cloudinary
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },

  // Admin Credentials
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },

  // JWT
  jwt: {
    secret: env.JWT_SECRET,
  },

  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Legacy API_BASE export for backward compatibility
 * @deprecated Use config.api.baseUrl instead
 */
export const API_BASE = config.api.baseUrl;

/**
 * Environment-aware fetch helper
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${config.api.baseUrl}${endpoint}`;

  console.log(`[API ${options.method || 'GET'}] ${url}`);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Debug logging for environment configuration
 */
if (config.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: config.api.baseUrl,
    frontendUrl: config.api.frontendUrl,
    isDevelopment: config.isDevelopment,
    cloudinary: config.cloudinary.cloudName,
  });
}