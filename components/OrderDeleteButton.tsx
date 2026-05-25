'use client'

import { useState } from 'react'
import { deleteOrder } from '@/app/admin/order-actions'

export default function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const executeDelete = async () => {
    setIsDeleting(true)
    const result = await deleteOrder(orderId)
    if (!result.success) {
      alert('Error: ' + result.error)
      setIsDeleting(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2 bg-red-900 text-white px-2 py-0.5 mt-2 justify-end">
        <span className="text-[9px] uppercase font-black tracking-widest pl-2">Delete?</span>
        <button onClick={executeDelete} className="text-[9px] font-bold hover:text-red-200 uppercase px-1">Yes</button>
        <button onClick={() => setConfirm(false)} className="text-[9px] font-bold hover:text-gray-300 uppercase px-1">No</button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      disabled={isDeleting}
      className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-red-500 font-bold transition-colors disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete Order'}
    </button>
  )
}
