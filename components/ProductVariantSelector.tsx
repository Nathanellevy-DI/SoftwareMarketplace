'use client'

import { useState } from 'react'
import { useCart } from './CartProvider'

interface Variant {
  id: string
  size_name: string
  price: number | string
}

export default function ProductVariantSelector({ product, variants }: { product: any, variants: Variant[] }) {
  const { addItem, setIsOpen } = useCart()
  
  // Default to the first variant if available
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants && variants.length > 0 ? variants[0] : null
  )

  const handleAdd = () => {
    // If variants exist, use the selected variant's ID and price
    const cartId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id
    const price = selectedVariant ? selectedVariant.price : product.price
    const name = selectedVariant ? `${product.title} - ${selectedVariant.size_name}` : product.title
    
    addItem({
      id: cartId,
      original_product_id: product.id,
      variant_id: selectedVariant?.id,
      variant_name: selectedVariant?.size_name,
      title: name,
      price: price,
      image_url: product.image_urls?.[0] || '',
    })
    setIsOpen(true)
  }

  // Display price based on selection or fallback
  const displayPrice = selectedVariant ? parseFloat(String(selectedVariant.price)) : parseFloat(String(product.price))

  return (
    <div>
      <div className="border-t border-b border-[#2b2522]/10 py-6 mb-8">
        <p className="text-4xl font-black tracking-tight text-[#2b2522]">
          ${displayPrice.toFixed(2)}
        </p>
      </div>

      {variants && variants.length > 0 && (
        <div className="mb-8">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#6e625c] mb-3 block">
            Select Licensing Option
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-[#EDEDE9] border border-[#2b2522]/10 rounded-lg p-4 font-bold text-sm outline-none focus:ring-0 uppercase tracking-widest cursor-pointer text-[#2b2522] hover:bg-[#E3D5CA] transition-colors"
              value={selectedVariant?.id || ''}
              onChange={(e) => {
                const v = variants.find((v) => v.id === e.target.value)
                if (v) setSelectedVariant(v)
              }}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.size_name} — ${parseFloat(String(v.price)).toFixed(2)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2b2522]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleAdd}
          disabled={!product.is_available}
          className="flex-1 bg-[#EDEDE9] border border-[#2b2522]/10 rounded-lg px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#2b2522] hover:bg-[#E3D5CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAdd}
          disabled={!product.is_available}
          className="flex-1 btn-neon rounded-lg px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy License Now
        </button>
      </div>
    </div>
  )
}
