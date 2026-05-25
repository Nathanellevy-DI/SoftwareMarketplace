'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function StorefrontGrid({ products, categories = [] }: { products: any[], categories?: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('ALL')

  const newArrivals = products.slice(0, 3)
  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category_id === activeCategory || p.category === activeCategory)

  // Filter out internal backend categories from the public nav bar
  const displayCategories = categories.filter(c => c.name !== 'Uncategorized' && c.name !== 'Printful Auto-Sync')

  // Get categories from products if database categories is empty
  const uniqueProductCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  const ProductCard = ({ product }: { product: any }) => {
    // Parse tech stack and features
    const techStack = Array.isArray(product.tech_stack) 
      ? product.tech_stack 
      : (product.tech_stack ? String(product.tech_stack).split(',').map(s => s.trim()) : [])
      
    return (
      <article className="group relative glass-panel glass-panel-hover rounded-xl overflow-hidden p-6 flex flex-col justify-between">
        <div>
          <Link href={`/product/${product.id}`}>
            <div className="w-full aspect-[16/10] bg-[#25201d] rounded-lg mb-6 overflow-hidden relative border border-[#2b2522]/10 cursor-pointer">
              <img
                src={product.image_urls?.[0] || product.image_url || '/logo.png'}
                alt={product.title}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
              {product.category && (
                <span className="absolute top-3 left-3 badge-cyber px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                  {product.category}
                </span>
              )}
            </div>
          </Link>
          
          <div className="flex justify-between items-start gap-4 mb-4">
            <Link href={`/product/${product.id}`} className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-[#2b2522] hover:text-[#6e625c] transition-colors line-clamp-1">
                {product.title}
              </h2>
              <p className="text-sm text-[#6e625c] mt-1 line-clamp-2 min-h-[40px]">
                {product.description || 'No description provided.'}
              </p>
            </Link>
            <div className="text-right shrink-0">
              <p className="text-[10px] uppercase tracking-wider text-[#6e625c] font-bold mb-0.5">Starting at</p>
              <p className="text-xl font-black text-[#2b2522] tracking-tighter">
                ${parseFloat(String(product.price)).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Tech Stack Badges */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {techStack.slice(0, 4).map((tech: string, idx: number) => (
                <span key={idx} className="bg-[#EDEDE9] text-[#6e625c] text-[10px] px-2 py-0.5 rounded border border-[#2b2522]/10 font-mono">
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="text-[10px] text-[#6e625c] self-center font-mono">+{techStack.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[#2b2522]/5 pt-6">
          <div className="flex gap-3">
            <Link
              href={`/product/${product.id}`}
              className="flex-1 bg-[#EDEDE9] text-[#2b2522] hover:bg-[#E3D5CA] border border-[#2b2522]/10 font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all text-xs text-center flex items-center justify-center"
            >
              Get License
            </Link>
            <Link
              href={`/product/${product.id}`}
              className="flex-1 btn-neon font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all text-xs text-center flex items-center justify-center"
            >
              Details &amp; Specs
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div>
      {/* Category Navigation Bar & Utility Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-[#2b2522]/10 pb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 rounded-lg ${
              activeCategory === 'ALL' 
                ? 'bg-[#2b2522] text-[#F5EBE0] shadow-sm' 
                : 'bg-[#EDEDE9]/80 text-[#6e625c] border border-[#2b2522]/10 hover:text-[#2b2522] hover:bg-[#EDEDE9]'
            }`}
          >
            All Software
          </button>
          
          {/* Support both schema categories or product unique categories */}
          {categories.length > 0 ? (
            displayCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 rounded-lg ${
                  activeCategory === cat.id 
                    ? 'bg-[#2b2522] text-[#F5EBE0] shadow-sm' 
                    : 'bg-[#EDEDE9]/80 text-[#6e625c] border border-[#2b2522]/10 hover:text-[#2b2522] hover:bg-[#EDEDE9]'
                }`}
              >
                {cat.name}
              </button>
            ))
          ) : (
            uniqueProductCategories.map((catName: any) => (
              <button 
                key={catName}
                onClick={() => setActiveCategory(catName)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 rounded-lg ${
                  activeCategory === catName 
                    ? 'bg-[#2b2522] text-[#F5EBE0] shadow-sm' 
                    : 'bg-[#EDEDE9]/80 text-[#6e625c] border border-[#2b2522]/10 hover:text-[#2b2522] hover:bg-[#EDEDE9]'
                }`}
              >
                {catName}
              </button>
            ))
          )}
        </div>

        {/* Aligned Utility Links */}
        <nav className="flex items-center gap-3 shrink-0">
          <Link 
            href="/track" 
            className="text-xs font-bold uppercase tracking-wider bg-[#EDEDE9]/80 text-[#2b2522] border border-[#2b2522]/10 px-5 py-2.5 rounded-lg hover:bg-[#E3D5CA] transition-colors shadow-sm"
          >
            Access Purchases
          </Link>
          <Link 
            href="/contact" 
            className="text-xs font-bold uppercase tracking-wider btn-neon px-5 py-2.5 rounded-lg text-center flex items-center justify-center shadow-sm"
          >
            Get Custom Support
          </Link>
        </nav>
      </div>

      {/* New Arrivals Section */}
      {activeCategory === 'ALL' && newArrivals.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#2b2522]">Featured Projects</h2>
            <div className="h-[1px] bg-[#2b2522]/10 flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Main Gallery */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#6e625c] flex-shrink-0">
          {activeCategory === 'ALL' ? 'Complete Catalog' : (categories.find(c => c.id === activeCategory)?.name || activeCategory)}
        </h2>
        <div className="h-[1px] bg-[#2b2522]/10 flex-grow"></div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#2b2522]/20 rounded-xl">
          <p className="text-sm uppercase tracking-wider text-[#6e625c] font-bold">No software items found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

