'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/admin/order-actions'

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = async (newStatus: string) => {
    setIsUpdating(true)
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setStatus(newStatus)
    } else {
      alert('Error: ' + result.error)
    }
    setIsUpdating(false)
  }

  const statuses = [
    { id: 'pending', label: 'Pending' },
    { id: 'paid', label: 'Paid' },
    { id: 'ordered', label: 'Ordered from Vista' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isUpdating}
        className="text-[10px] font-black uppercase tracking-widest bg-gray-100 border-none outline-none py-1 px-2 cursor-pointer hover:bg-black hover:text-white transition-colors disabled:opacity-50"
      >
        {statuses.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      {isUpdating && <span className="animate-spin text-[10px]">◌</span>}
    </div>
  )
}
