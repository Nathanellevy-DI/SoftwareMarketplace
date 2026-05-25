'use client'

import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartProvider'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const { clearCart } = useCart()
  const [status, setStatus] = useState('Generating your software license keys...')
  const [licenseKey, setLicenseKey] = useState('')

  useEffect(() => {
    clearCart()

    // Mock license key generation
    const mockKey = `FLS-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    
    const timer = setTimeout(() => {
      setLicenseKey(mockKey)
      setStatus('License key generated successfully! Secure downloads are ready below. 🚀')
    }, 1500)

    return () => clearTimeout(timer)
  }, [clearCart])

  return (
    <div className="text-center max-w-xl px-8 py-16 glass-panel rounded-2xl shadow-xl border border-[#2b2522]/10 bg-[#EDEDE9]/45 backdrop-blur-md">
      <div className="text-5xl mb-6 text-emerald-600">✓</div>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-6">
        Purchase Successful
      </h1>
      <p className="text-sm text-[#6e625c] mb-6 leading-relaxed">
        Thank you for supporting our software studio. Your transaction is verified.
      </p>
      
      <div className="bg-[#EDEDE9] border border-[#2b2522]/10 p-5 rounded-lg mb-8 text-left">
        <p className="text-[10px] uppercase font-bold tracking-wider text-[#6e625c] mb-1">Order Identifier</p>
        <p className="text-xs font-mono font-bold text-[#2b2522] mb-4">{orderId}</p>
        
        <p className="text-[10px] uppercase font-bold tracking-wider text-[#6e625c] mb-1">Status</p>
        <p className="text-xs font-semibold text-[#2b2522] mb-4">{status}</p>

        {licenseKey && (
          <div className="mt-4 border-t border-[#2b2522]/10 pt-4">
            <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 mb-1.5">Your Software License Key</p>
            <div className="flex items-center justify-between bg-[#25201d] text-[#F5EBE0] p-3 rounded font-mono text-xs select-all">
              <span>{licenseKey}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(licenseKey)} 
                className="text-[9px] uppercase font-bold tracking-widest text-[#D5BDAF] hover:text-[#f5ebe0] ml-2"
              >
                Copy
              </button>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Secure download starting for " + orderId) }}
                className="flex-1 bg-[#2b2522] text-[#F5EBE0] text-center text-xs uppercase font-bold tracking-wider py-3 rounded hover:bg-[#6e625c] transition-all"
              >
                📥 Download Software Binary
              </a>
              <Link
                href="/track"
                className="flex-1 bg-white text-[#2b2522] border border-[#2b2522]/10 text-center text-xs uppercase font-bold tracking-wider py-3 rounded hover:bg-[#EDEDE9] transition-all"
              >
                🔑 Access Source Code
              </Link>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="btn-neon inline-block font-bold uppercase tracking-widest px-10 py-4 rounded-lg text-xs"
      >
        Return to Catalog
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] flex items-center justify-center selection:bg-[#D5BDAF] selection:text-[#2b2522] p-4">
      <Suspense fallback={<div className="text-xs uppercase tracking-widest text-[#6e625c]">Loading Order Data...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  )
}
