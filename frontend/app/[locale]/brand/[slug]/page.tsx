import { notFound } from "next/navigation";
import { getBrandInfo } from "@/lib/products";
import { BrandPageClient } from "@/components/brand-page-client";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BASE_URL } from '@/lib/api';

// ✅ Allow ISR without static generation during build
export const revalidate = 60; // Revalidate every 60 seconds

type BrandSlug = "topicrem" | "novexpert";
type BrandName = "Topicrem" | "Novexpert";

export function generateStaticParams() {
  return [{ slug: "topicrem" }, { slug: "novexpert" }];
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  // ✅ FIX 1: unwrap params (Next.js 16 requirement)
  const { slug, locale } = await params;

  // ✅ FIX 2: set locale properly
  setRequestLocale(locale);

  if (slug !== "topicrem" && slug !== "novexpert") {
    notFound();
  }

  const brandSlug: BrandSlug = slug;

  const brandMap: Record<BrandSlug, BrandName> = {
    topicrem: "Topicrem",
    novexpert: "Novexpert",
  };

  const brand: BrandName = brandMap[brandSlug];

  const baseBrandInfo = getBrandInfo(brand);

  const t = await getTranslations("BrandPages");

  const brandInfo = {
    ...baseBrandInfo,
    name: baseBrandInfo.name,
    tagline: t(`${brandSlug}.tagline`),
    description: t(`${brandSlug}.description`),
  };

  // ✅ FIX: Use full backend URL for server-side fetch during build
  let products = [];
try {
  const url = `${BASE_URL}/api/products?brand=${brand}`
  console.log('Brand page fetching from:', url)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
  
  const response = await fetch(
    url,
    { 
      next: { revalidate: 60 },
      signal: controller.signal 
    }
  );
  clearTimeout(timeoutId)
  
  if (response.ok) {
    products = await response.json();
    console.log(`Loaded ${Array.isArray(products) ? products.length : 0} products for ${brand}`)
  } else {
    console.error(`Brand page fetch failed: ${response.status} ${response.statusText}`)
  }
} catch (err) {
  console.error('Error fetching products for brand page:', err instanceof Error ? err.message : err);
  products = [];
}
  const lines: string[] = [];

  return (
    <BrandPageClient
      brand={brandSlug}
      brandInfo={brandInfo}
      products={products}
      lines={lines}
    />
  );
}