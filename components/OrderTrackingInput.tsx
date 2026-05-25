'use client'

import { useState } from 'react'
import { updateOrderTracking } from '@/app/admin/order-actions'

export default function OrderTrackingInput({ orderId, initialValue }: { orderId: string, initialValue?: string }) {
  const [tracking, setTracking] = useState(initialValue || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    const result = await updateOrderTracking(orderId, tracking)
    setIsUpdating(false)
    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      alert('Error: ' + result.error)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking Number</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="e.g. UPS-12345"
          className="flex-grow bg-gray-50 border border-gray-100 text-[11px] font-bold uppercase tracking-tight p-2 outline-none focus:border-black transition-colors"
        />
        <button
          onClick={handleUpdate}
          disabled={isUpdating || !tracking}
          className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          {isUpdating ? 'Saving...' : 'Save'}
        </button>
      </div>
      {showSuccess && <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Saved Successfully</span>}
    </div>
  )
}
