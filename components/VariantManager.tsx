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
    <div className="mt-4 pt-4 border-t border-[#2b2522]/10 bg-[#F5EBE0]/40 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-[#6e625c]">
          License Tiers ({variants?.length || 0})
        </h4>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[10px] uppercase font-black tracking-widest bg-[#2b2522] hover:bg-[#6e625c] text-[#F5EBE0] px-3 py-1.5 transition-colors rounded"
          >
            + Add License
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {variants?.map(v => (
          <div key={v.id} className="flex justify-between items-center border border-[#2b2522]/10 p-2.5 rounded text-xs hover:border-[#2b2522]/30 bg-[#EDEDE9]/40 transition-colors text-[#2b2522]">
            <div className="flex gap-4 items-center">
              <span className="font-bold w-28 truncate">{v.size_name}</span>
              <span className="text-[#6e625c] w-16 font-semibold">${parseFloat(String(v.price)).toFixed(2)}</span>
              {v.printful_sync_variant_id ? (
                <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 font-mono rounded">
                  Sync ID: {v.printful_sync_variant_id}
                </span>
              ) : (
                <span className="text-[9px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 uppercase rounded font-bold">
                  Instant Key
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(v.id)}
              disabled={removing === v.id}
              className="text-[10px] text-[#6e625c] hover:text-red-600 uppercase tracking-widest font-black transition-colors"
            >
              {removing === v.id ? '...' : 'Del'}
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <form action={handleAdd} className="bg-[#EDEDE9] p-4 border border-[#2b2522]/10 rounded-lg space-y-3 mt-4 text-[#2b2522]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-[#6e625c] mb-1 font-bold">License Tier Name</label>
              <input name="size_name" placeholder="E.g. Developer Source License" className="w-full bg-[#F5EBE0]/60 border border-[#2b2522]/20 text-xs p-2 text-[#2b2522] outline-none focus:border-[#2b2522] rounded placeholder:text-[#6e625c]/30" required />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-[#6e625c] mb-1 font-bold">Price ($)</label>
              <input name="price" type="number" step="0.01" placeholder="19.00" className="w-full bg-[#F5EBE0]/60 border border-[#2b2522]/20 text-xs p-2 text-[#2b2522] outline-none focus:border-[#2b2522] rounded placeholder:text-[#6e625c]/30" required />
            </div>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-[#6e625c] mb-1 font-bold">External SKU / SKU Code (Optional)</label>
            <input name="printful_sync_variant_id" placeholder="E.g. SKU-ST-DEV" className="w-full bg-[#F5EBE0]/60 border border-[#2b2522]/20 text-xs p-2 text-[#2b2522] outline-none focus:border-[#2b2522] rounded placeholder:text-[#6e625c]/30" />
            <p className="text-[9px] text-[#6e625c]/70 mt-1">Leave blank if delivering digitally via active download keys.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 btn-neon text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg">
              Save License
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex-1 border border-[#2b2522]/20 text-[#6e625c] hover:text-[#2b2522] hover:bg-[#EDEDE9]/80 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
