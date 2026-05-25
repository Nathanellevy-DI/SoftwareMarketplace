'use client'

import { useCart } from './CartProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CartButton() {
  const { totalItems } = useCart()
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <Link
      href="/cart"
      className="fixed top-6 right-6 z-50 bg-[#2b2522] text-[#F5EBE0] border border-[#2b2522]/10 hover:bg-[#EDEDE9] hover:text-[#2b2522] transition-all duration-300 flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      <span className="text-xs font-bold uppercase tracking-widest">Cart</span>
      {totalItems > 0 && (
        <span className="bg-[#D5BDAF] text-[#2b2522] w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full shadow-inner">
          {totalItems}
        </span>
      )}
    </Link>
  )
}
