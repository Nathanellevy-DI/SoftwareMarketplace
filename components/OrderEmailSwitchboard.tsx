'use client'

import { useState } from 'react'
import { fireManualEmail } from '@/app/admin/email-actions'

export default function OrderEmailSwitchboard({ orderId, currentTracking }: { orderId: string, currentTracking?: string }) {
    const [sending, setSending] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const handleSend = async (type: 'received' | 'production' | 'shipped' | 'delivered', label: string) => {
        setSending(type)
        const res = await fireManualEmail(orderId, type, currentTracking)
        setSending(null)
        if (res.success) {
            setSuccessMsg(`Sent: ${label}`)
            setTimeout(() => setSuccessMsg(null), 3000)
        } else {
            alert('Error sending email: ' + res.error)
        }
    }

    return (
        <div className="flex flex-col gap-3 mt-4 border-t border-gray-100 pt-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Manual Email Override
            </span>
            <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSend('received', 'Order Received')}
                  disabled={!!sending}
                  className="bg-black text-white hover:bg-gray-800 text-[9px] font-black uppercase tracking-widest px-4 py-3 transition-colors disabled:opacity-50"
                >
                    {sending === 'received' ? 'Sending...' : 'Mail: Received'}
                </button>
                <button 
                  onClick={() => handleSend('production', 'In Production')}
                  disabled={!!sending}
                  className="bg-indigo-600 text-white hover:bg-indigo-500 text-[9px] font-black uppercase tracking-widest px-4 py-3 transition-colors disabled:opacity-50"
                >
                    {sending === 'production' ? 'Sending...' : 'Mail: Production'}
                </button>
                <button 
                  onClick={() => handleSend('shipped', 'Shipped')}
                  disabled={!!sending}
                  className="bg-blue-600 text-white hover:bg-blue-500 text-[9px] font-black uppercase tracking-widest px-4 py-3 transition-colors disabled:opacity-50"
                >
                    {sending === 'shipped' ? 'Sending...' : 'Mail: Shipped'}
                </button>
                <button 
                  onClick={() => handleSend('delivered', 'Delivered')}
                  disabled={!!sending}
                  className="bg-green-600 text-white hover:bg-green-500 text-[9px] font-black uppercase tracking-widest px-4 py-3 transition-colors disabled:opacity-50"
                >
                    {sending === 'delivered' ? 'Sending...' : 'Mail: Delivered'}
                </button>
            </div>
            {successMsg && (
                <div className="text-[10px] bg-green-50 text-green-700 px-3 py-2 font-bold uppercase tracking-widest inline-block border border-green-200">
                    ✓ {successMsg}
                </div>
            )}
        </div>
    )
}
