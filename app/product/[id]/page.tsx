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
                <div className="w-8 h-8 bg-[#2b2522] text-[#F5EBE0] flex items-center justify-center font-black text-sm rounded-lg uppercase">
                  MP
                </div>
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
              
              {/* Added: Quick install command/terminal snippet for premium dev feel */}
              <div className="mt-8 code-terminal p-5 rounded-xl shadow-lg font-mono text-xs text-[#f5ebe0]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                  </div>
                  <span>bash</span>
                </div>
                <p className="text-emerald-400"># Install & start {product.title.toLowerCase().replace(/\s+/g, '-')}</p>
                <p className="mt-1"><span className="text-blue-400">git clone</span> {product.github_url || 'https://github.com/nathanellevy/repo.git'}</p>
                <p className="mt-1"><span className="text-purple-400">cd</span> {product.title.toLowerCase().replace(/\s+/g, '-')}</p>
                <p className="mt-1"><span className="text-yellow-400">npm install</span> &amp;&amp; <span className="text-yellow-400">npm run dev</span></p>
              </div>
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

              {/* Added: External Link Actions */}
              {(product.github_url || product.demo_url) && (
                <div className="flex gap-3 mb-8">
                  {product.github_url && (
                    <a
                      href={product.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 btn-warm-secondary text-xs uppercase tracking-wider font-bold py-3 px-6 rounded-lg text-center flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
                      GitHub Repo
                    </a>
                  )}
                  {product.demo_url && (
                    <a
                      href={product.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 btn-warm-secondary text-xs uppercase tracking-wider font-bold py-3 px-6 rounded-lg text-center flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                      Try Live Demo
                    </a>
                  )}
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
