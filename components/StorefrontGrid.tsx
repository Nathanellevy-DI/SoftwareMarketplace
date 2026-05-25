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
            <div className="w-full aspect-[16/10] bg-[#0c0d12] rounded-lg mb-6 overflow-hidden relative border border-white/5 cursor-pointer">
              <img
                src={product.image_urls?.[0] || product.image_url || '/logo.png'}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
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
              <h2 className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors line-clamp-1">
                {product.title}
              </h2>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2 min-h-[40px]">
                {product.description || 'No description provided.'}
              </p>
            </Link>
            <div className="text-right shrink-0">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Starting at</p>
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter">
                ${parseFloat(String(product.price)).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Tech Stack Badges */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {techStack.slice(0, 4).map((tech: string, idx: number) => (
                <span key={idx} className="bg-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded border border-white/5 font-mono">
                  {tech}
                </span>
              ))}
              {techStack.length > 4 && (
                <span className="text-[10px] text-gray-500 self-center font-mono">+{techStack.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        <div>
          {/* Quick Action Links */}
          <div className="flex items-center gap-4 mb-6 border-t border-white/5 pt-4 text-xs font-semibold">
            {product.github_url && (
              <a 
                href={product.github_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
                GitHub
              </a>
            )}
            {product.demo_url && (
              <a 
                href={product.demo_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                Live Demo
              </a>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              href={`/product/${product.id}`}
              className="flex-1 bg-white/5 text-white hover:bg-white/10 border border-white/10 font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all text-xs text-center flex items-center justify-center"
            >
              Get License
            </Link>
            <Link
              href={`/product/${product.id}`}
              className="flex-1 btn-neon font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all text-xs text-center flex items-center justify-center"
            >
              Details & Specs
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <div>
      {/* Category Navigation Bar & Utility Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/10 pb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 rounded-lg ${
              activeCategory === 'ALL' 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white hover:bg-white/10'
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
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white hover:bg-white/10'
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
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white hover:bg-white/10'
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
            className="text-xs font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10 px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors shadow-sm"
          >
            Access Purchases
          </Link>
          <Link 
            href="/contact" 
            className="text-xs font-bold uppercase tracking-wider bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Get Custom Support
          </Link>
        </nav>
      </div>

      {/* New Arrivals Section */}
      {activeCategory === 'ALL' && newArrivals.length > 0 && (
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Featured Projects</h2>
            <div className="h-[1px] bg-white/10 flex-grow"></div>
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
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-400 flex-shrink-0">
          {activeCategory === 'ALL' ? 'Complete Catalog' : (categories.find(c => c.id === activeCategory)?.name || activeCategory)}
        </h2>
        <div className="h-[1px] bg-white/10 flex-grow"></div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <p className="text-sm uppercase tracking-wider text-gray-500 font-bold">No software items found in this section.</p>
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

