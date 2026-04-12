export interface Product {
  id: string;
  brand: string;
  type?: string;
  category?: string;
  images: string[];
  price: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  howToUse: { en: string; ar: string };
  benefits?: { en: string; ar: string };
  ingredients?: { en: string; ar: string };
  texture?: string;
  skinType?: string;
}

// ✅ Safe field getter
function getField(
  val: string | { en: string; ar: string } | undefined,
  lang = "en"
): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return lang === "ar" ? val.ar : val.en;
}

import { BASE_URL } from './api';

// ✅ Fetch all products with timeout
export async function fetchProducts(brand?: string): Promise<Product[]> {
  try {
    const url = brand ? `${BASE_URL}/api/products?brand=${brand}` : `${BASE_URL}/api/products`
    console.log('fetchProducts:', url)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const res = await fetch(url, { 
      next: { revalidate: 60 },
      signal: controller.signal 
    })
    clearTimeout(timeoutId)
    
    if (!res.ok) {
      console.error('fetchProducts error:', res.status, res.statusText)
      return []
    }
    const data = await res.json()
    console.log('fetchProducts success:', Array.isArray(data) ? data.length : 'not array')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.error('fetchProducts error:', e instanceof Error ? e.message : e)
    return []
  }
}

// ✅ Fetch single product
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

// (Not used now but kept safe)
export function getProductsByBrand(brand: string) {
  return [];
}

export function getProductById(id: string) {
  return null;
}

// ✅ 🔥 FIXED FUNCTION (MAIN FIX)
export function getBrandInfo(brand: string) {
  const brands = {
    topicrem: {
      name: "Topicrem",
      tagline: "Dermatological Expertise for All Skin Types",
      description:
        "Topicrem offers dermatologically tested skincare solutions designed for sensitive and demanding skin. Trusted by dermatologists worldwide for over 20 years.",
      color: "primary",
      logo: "/topicremlogo.png",
      instagram:
        "https://www.instagram.com/topicrem_jordan?igsh=eDgxajhjc3BjZXU2",
    },
    novexpert: {
      name: "Novexpert",
      tagline: "Expert Science, Natural Innovation",
      description:
        "Novexpert combines scientific expertise with natural ingredients to create powerful anti-aging and skin health solutions. Made in France with proven efficacy.",
      color: "accent",
      logo: "/novexpert.png",
      instagram:
        "https://www.instagram.com/novexpertjo?igsh=c3B0eXJyZWU0b3pi",
    },
  };

  // ✅ normalize input (THIS FIXES YOUR 404)
  const key = brand.toLowerCase() as keyof typeof brands;

  return brands[key] || null; // prevent undefined crash
}