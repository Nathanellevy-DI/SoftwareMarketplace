import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ProductVariantSelector from '@/components/ProductVariantSelector'
import ProductCarousel from '@/components/ProductCarousel'
import Link from 'next/link'
import { FALLBACK_PRODUCTS } from '@/lib/products-fallback'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product: any = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', id)
      .single()
    
    if (data) product = data
  } catch (err) {
    console.error("Database detail query failed:", err)
  }

  // Fallback to static seed data if product not found in Supabase
  if (!product) {
    product = FALLBACK_PRODUCTS.find(p => p.id === id)
  }

  if (!product) return notFound()

  // Sort variants by price ascending if they exist
  if (product.product_variants) {
    product.product_variants.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price))
  }

    const techStack = Array.isArray(product.tech_stack) 
      ? product.tech_stack 
      : (product.tech_stack ? String(product.tech_stack).split(',').map(s => s.trim()) : [])
    const featuresList = Array.isArray(product.features)
      ? product.features
      : (product.features ? String(product.features).split(',').map(s => s.trim()) : [])

    return (
      <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522]">
        {/* Back nav */}
        <div className="border-b border-[#2b2522]/10 bg-[#EDEDE9]/30">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-sm font-bold uppercase tracking-wider text-[#2b2522] hover:text-[#6e625c] transition-colors">
              ← Back to Catalog
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/track" className="text-[10px] font-bold uppercase tracking-wider text-[#6e625c] hover:text-[#2b2522] transition-colors">
                Access Purchases
              </Link>
              <Link href="/contact" className="text-[10px] font-bold uppercase tracking-wider text-[#6e625c] hover:text-[#2b2522] transition-colors">
                Support
              </Link>
              <Link href="/" className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  className="w-8 h-8 object-cover bg-[#2b2522] rounded-lg shadow-sm border border-[#2b2522]/10" 
                  alt="Software MP Logo" 
                />
                <span className="text-xl font-black uppercase tracking-tight text-[#2b2522]">
                  Software MP
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Product Image Carousel */}
            <div className="w-full">
              <ProductCarousel images={product.image_urls || (product.image_url ? [product.image_url] : [])} altText={product.title} />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge-cyber px-2.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest">
                  {product.category || 'Software Tool'}
                </span>
                
                {/* Tech Stack Mini Display */}
                {techStack.length > 0 && (
                  <div className="flex gap-1.5">
                    {techStack.slice(0, 3).map((tech: string, i: number) => (
                      <span key={i} className="text-[9px] uppercase font-bold tracking-wider text-[#6e625c] bg-[#EDEDE9] px-2 py-0.5 rounded border border-[#2b2522]/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-6">
                {product.title}
              </h1>
              
              {product.description && (
                <p className="text-base text-[#6e625c] leading-relaxed mb-8 border-l-4 border-[#2b2522]/10 pl-6">
                  {product.description}
                </p>
              )}

              {/* Added: Software Features List */}
              {featuresList.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2b2522] mb-4">Key Specs & Features:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6e625c]">
                    {featuresList.map((feat: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}



              <ProductVariantSelector 
                product={product} 
                variants={product.product_variants || []} 
              />

              <div className="mt-12 space-y-4 border-t border-[#2b2522]/10 pt-8">
                <div className="flex items-start gap-3">
                  <span className="text-sm">⚡️</span>
                  <p className="text-xs uppercase tracking-widest text-[#6e625c]">Instant digital licensing &amp; download links</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm">💻</span>
                  <p className="text-xs uppercase tracking-widest text-[#6e625c]">Full tech documentation and installation guides</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm">🛡</span>
                  <p className="text-xs uppercase tracking-widest text-[#6e625c]">Secure code access with lifetime updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
}
