import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { SquareClient, SquareEnvironment } from 'square'

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })

    const supabase = await createClient()

    // 1. Fetch Order and its Printful Sync IDs
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*, product_variants(*))')
      .eq('id', order_id)
      .single()

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.status === 'paid' || order.status === 'fulfilled') {
      return NextResponse.json({ success: true, message: 'Already fulfilled' })
    }

    // 2. Verify Square Payment state to prevent fake Success page visits
    const sqClient = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment: SquareEnvironment.Production,
    })

    const linkRes = await sqClient.checkout.paymentLinks.get({ id: order.stripe_session_id })
    const sqOrderId = linkRes.paymentLink?.orderId

    if (!sqOrderId) return NextResponse.json({ error: 'Square logic error' }, { status: 400 })

    const orderRes = await sqClient.orders.get({ orderId: sqOrderId })
    const sqOrder = orderRes.order

    if (sqOrder?.state !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment not completed or pending' }, { status: 402 })
    }

    // 3. Payment Confirmed. Dispatch to Printful!
    let successfullyDispatched = false

    // Identify which items in the bag are actual Printful dropships vs manual fulfillment
    const printfulItems = order.order_items.filter((item: any) => item.product_variants?.printful_sync_variant_id)

    if (printfulItems.length > 0) {
      // Parse shipping address (Format is: `123 Main St, New York, NY 10001`)
      const addressParts = (order.shipping_address || '').split(',')
      const address1 = addressParts[0]?.trim() || 'Unknown'
      const city = addressParts[1]?.trim() || 'Unknown'
      const stateZip = addressParts[2]?.trim() || ''
      const stateCode = stateZip.split(' ')[0] || ''
      const zip = stateZip.split(' ')[1] || ''

      const pfPayload = {
        external_id: order.id,
        recipient: {
          name: order.customer_name || 'Valued Customer',
          address1,
          city,
          state_code: stateCode,
          country_code: 'US', // Printful needs valid 2-letter codes. Hardcoding US for MVP.
          zip,
          email: order.customer_email || 'info@framefocus.com',
          phone: order.phone_number || undefined
        },
        items: printfulItems.map((item: any) => ({
          sync_variant_id: parseInt(item.product_variants.printful_sync_variant_id),
          quantity: item.quantity,
          retail_price: item.price_at_purchase
        }))
      }

      console.log('Sending to Printful API:', JSON.stringify(pfPayload))

      const pfRes = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pfPayload)
      })

      const pfData = await pfRes.json()
      console.log('Printful Response:', pfData)

      if (pfRes.ok) successfullyDispatched = true
    }

    // 4. Update Supabase so Admin UI knows the money is secure
    await supabase.from('orders').update({
      status: 'paid',
      tracking_number: successfullyDispatched ? 'Pending Printful' : null 
    }).eq('id', order.id)

    return NextResponse.json({ success: true, dispatched: successfullyDispatched })

  } catch (err: any) {
    console.error('Trigger Hook Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
