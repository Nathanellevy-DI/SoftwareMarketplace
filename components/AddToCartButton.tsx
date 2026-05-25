'use client'

import { useCart } from './CartProvider'

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()

  return (
    <div className="flex gap-3 mt-8">
      <button
        onClick={() => addItem(product)}
        className="flex-1 bg-white text-black hover:bg-gray-200 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-sm"
      >
        Add to Bag
      </button>
      <button
        onClick={() => {
          addItem(product)
          window.location.href = '/cart'
        }}
        className="flex-1 bg-black text-white hover:bg-gray-900 border-2 border-black font-black uppercase tracking-widest py-4 transition-colors text-sm"
      >
        Buy Now
      </button>
    </div>
  )
}
