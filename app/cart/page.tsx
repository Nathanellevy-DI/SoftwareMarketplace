'use client'

import { useState } from 'react'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    setLoading(true)
    setError(null)

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email for delivery updates.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/checkout-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items, 
          email,
          shippingData: {
            name: email.split('@')[0],
            address: 'Digital Delivery',
            city: 'Cloud',
            state: 'NET',
            zip: '00000',
            phone: '0000000000'
          },
          shippingPlan: 'Instant Download',
          shippingCost: 0
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed. Please check your connection.')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      console.error('Checkout failed:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522]">
      {/* Header */}
      <div className="border-b border-[#2b2522]/10 bg-[#EDEDE9]/30">
        <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-sm font-bold uppercase tracking-wider text-[#2b2522] hover:text-[#6e625c] transition-colors">
            ← Continue Browsing
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

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-12 border-b border-[#2b2522]/10 pb-6">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#2b2522]/20 bg-[#EDEDE9]/30 rounded-xl">
            <p className="text-xl font-bold uppercase tracking-widest mb-4 text-[#2b2522]">Your cart is empty</p>
            <p className="text-xs text-[#6e625c] mb-8">Discover our premium range of developer tools and licenses.</p>
            <Link
              href="/"
              className="btn-neon inline-block font-bold uppercase tracking-widest px-8 py-4 rounded-lg text-xs"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 border-b border-[#2b2522]/10 items-center justify-between">
                  {/* Thumbnail / Project Logo Icon */}
                  <div className="w-20 h-20 bg-[#25201d] text-[#F5EBE0] flex items-center justify-center font-bold text-xl rounded-xl shadow-md uppercase shrink-0">
                    {item.title.substring(0, 2)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#2b2522] tracking-tight truncate">{item.title}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1 font-mono">
                      {item.variant_name || 'Standard License'}
                    </p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-[#2b2522]/10 rounded bg-[#EDEDE9]">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#2b2522] hover:bg-[#E3D5CA] transition-colors rounded-l"
                        >
                          −
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-xs font-mono font-bold text-[#2b2522]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-[#2b2522] hover:bg-[#E3D5CA] transition-colors rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black tracking-tight text-[#2b2522]">
                      ${(parseFloat(String(item.price)) * item.qty).toFixed(2)}
                    </p>
                    {item.qty > 1 && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ${parseFloat(String(item.price)).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Checkout Column */}
            <div className="glass-panel p-8 rounded-xl h-fit">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#2b2522] mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#2b2522]/10 pb-3 text-xs">
                  <span className="uppercase tracking-widest text-[#6e625c] font-semibold">Subtotal</span>
                  <span className="font-bold text-[#2b2522]">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[#2b2522]/10 pb-3 text-xs">
                  <span className="uppercase tracking-widest text-[#6e625c] font-semibold">Digital Delivery</span>
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">Free (Instant)</span>
                </div>

                <div className="flex justify-between items-center pt-2 pb-6 border-b border-[#2b2522]/20">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2b2522]">Total Due</span>
                  <span className="text-2xl font-black tracking-tight text-[#2b2522]">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Secure Delivery Info */}
                <div className="space-y-4 pt-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#2b2522]">License &amp; Download Email</h3>
                  
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#EDEDE9] border border-[#2b2522]/10 rounded-lg p-4 font-bold text-xs outline-none focus:border-[#2b2522]/30 transition-colors text-[#2b2522]"
                  />
                  <p className="text-[9px] text-[#6e625c] leading-relaxed">
                    * Make sure you use a valid email. Your license activation keys and secure binary download paths will be dispatched instantly upon purchase.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-500/20 p-4 text-[10px] font-mono text-red-600 rounded-lg">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || !email || !email.includes('@') || items.length === 0}
                  className="w-full btn-neon py-4 rounded-lg text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all mt-4"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-[#F5EBE0] border-t-transparent rounded-full animate-spin" />
                  )}
                  {items.length === 0 ? 'Cart is Empty' : loading ? 'Securing Portal...' : 'Proceed to Purchase'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors py-2 text-center"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
