// Centralized API utilities for production-safe fetching
// Use environment variable for backend URL, with correct production fallback

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://skincare-website-production-be30.up.railway.app";

export async function apiGet(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      cache: 'no-store',
      ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error(`API GET ${endpoint} failed:`, error)
    throw error
  }
}

export async function apiPost(endpoint: string, data: any, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
      ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error(`API POST ${endpoint} failed:`, error)
    throw error
  }
}

export async function apiPut(endpoint: string, data: any, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
      ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error(`API PUT ${endpoint} failed:`, error)
    throw error
  }
}

export async function apiDelete(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      cache: 'no-store',
      ...options,
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error(`API DELETE ${endpoint} failed:`, error)
    throw error
  }
}