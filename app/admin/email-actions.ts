'use server'

import { createClient } from '@/utils/supabase/server'
import { sendOrderReceivedEmail, sendOrderStatusEmail, sendOrderTrackingEmail } from '@/lib/email-service'

export async function fireManualEmail(orderId: string, type: 'received' | 'production' | 'shipped' | 'delivered', customTrackingNumber?: string) {
  try {
    const supabase = await createClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('customer_email, customer_name, tracking_number')
      .eq('id', orderId)
      .single()

    if (error || !order || !order.customer_email || !order.customer_email.includes('@') || order.customer_email === 'pending@checkout') {
      return { success: false, error: 'Valid customer email not found.' }
    }

    const email = order.customer_email
    
    if (type === 'received') {
        await sendOrderReceivedEmail(email, orderId, order.customer_name || 'Valued Customer')
    } else if (type === 'production') {
        await sendOrderStatusEmail(email, orderId, 'ordered')
    } else if (type === 'shipped') {
        const tracking = customTrackingNumber || order.tracking_number
        if (tracking) {
            await sendOrderTrackingEmail(email, orderId, tracking)
        } else {
            await sendOrderStatusEmail(email, orderId, 'shipped')
        }
    } else if (type === 'delivered') {
        await sendOrderStatusEmail(email, orderId, 'delivered')
    }
    
    return { success: true }
  } catch (err: any) {
    console.error("Manual Email Dispatch Error:", err)
    return { success: false, error: err.message || 'Server error dispatching email' }
  }
}
