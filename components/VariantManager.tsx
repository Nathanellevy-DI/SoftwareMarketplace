'use client'

import { useState } from 'react'
import { addVariant, deleteVariant } from '@/app/admin/variant-actions'

interface Variant {
  id: string
  size_name: string
  price: number
  printful_sync_variant_id: string | null
}

export default function VariantManager({ productId, variants }: { productId: string, variants: Variant[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleAdd(formData: FormData) {
    const res = await addVariant(productId, formData)
    if (res.success) {
      setIsAdding(false)
    } else {
      alert(`Error adding size: ${res.error}`)
    }
  }

  async function handleDelete(variantId: string) {
    if (!confirm('Are you sure you want to delete this size from your store?')) return
    setRemoving(variantId)
    const res = await deleteVariant(variantId)
    if (!res.success) {
      alert(`Error deleting size: ${res.error}`)
    }
    setRemoving(null)
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-800 bg-black/40 p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Print Sizes ({variants?.length || 0})
        </h4>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[10px] uppercase font-black tracking-widest bg-gray-800 hover:bg-white hover:text-black px-3 py-1 transition-colors"
          >
            + Add Size
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {variants?.map(v => (
          <div key={v.id} className="flex justify-between items-center border border-gray-800 p-2 text-xs hover:border-gray-600 transition-colors">
            <div className="flex gap-4 items-center">
              <span className="font-bold w-24 truncate">{v.size_name}</span>
              <span className="text-gray-400 w-16">${parseFloat(String(v.price)).toFixed(2)}</span>
              {v.printful_sync_variant_id ? (
                <span className="text-[9px] bg-green-900/50 text-green-400 px-2 py-0.5 font-mono">
                  Sync: {v.printful_sync_variant_id}
                </span>
              ) : (
                <span className="text-[9px] bg-red-900/50 text-red-400 px-2 py-0.5 uppercase">
                  Unlinked
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(v.id)}
              disabled={removing === v.id}
              className="text-[10px] text-gray-500 hover:text-red-500 uppercase tracking-widest font-black transition-colors"
            >
              {removing === v.id ? '...' : 'Del'}
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <form action={handleAdd} className="bg-gray-900 p-3 border border-gray-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">Dimensions</label>
              <input name="size_name" placeholder="E.g. 24x36 Poster" className="w-full bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-white" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">Price ($)</label>
              <input name="price" type="number" step="0.01" placeholder="85.00" className="w-full bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-white" required />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-[#FF0000] mb-1 font-bold">Printful Variant ID (Crucial for Dropshipping)</label>
            <input name="printful_sync_variant_id" placeholder="E.g. 5247147021" className="w-full bg-black border border-[#FF0000]/50 text-xs p-2 text-white outline-none focus:border-[#FF0000]" />
            <p className="text-[10px] text-gray-500 mt-1">Leave blank if fulfilling manually.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-white text-black text-[10px] font-black uppercase tracking-widest py-2 hover:bg-gray-200">
              Save Size
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 border border-gray-600 text-gray-300 text-[10px] font-black uppercase tracking-widest py-2 hover:border-white">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
