export interface ProductFallback {
  id: string
  title: string
  description: string
  price: number
  image_urls: string[]
  category: string
  tech_stack: string[]
  github_url?: string
  demo_url?: string
  download_url?: string
  features: string[]
  is_available: boolean
  product_variants?: {
    id: string
    size_name: string
    price: number
    license_details: string[]
  }[]
}

// Empty — all products are now managed via the Admin dashboard
export const FALLBACK_PRODUCTS: ProductFallback[] = []
