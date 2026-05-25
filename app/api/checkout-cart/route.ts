import { NextResponse } from 'next/server'
import { SquareClient, SquareEnvironment } from 'square'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'
import { sendOrderReceivedEmail } from '@/lib/email-service'

export async function POST(req: Request) {
  try {
    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN!,
      environment: SquareEnvironment.Production,
    })

    const { items, email, shippingData, shippingPlan, shippingCost } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    const idempotencyKey = crypto.randomUUID()
    const ourOrderId = crypto.randomUUID() // Generate our DB ID upfront

    // Build Square order line items
    const lineItems = items.map((item: any) => ({
      name: item.title,
      quantity: String(item.qty),
      basePriceMoney: {
        amount: BigInt(Math.round(parseFloat(String(item.price)) * 100)),
        currency: 'USD',
      },
    }))

    // Add shipping fee as a distinct line item on the Square receipt
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        name: `Shipping: ${shippingPlan || 'Standard'}`,
        quantity: '1',
        basePriceMoney: {
          amount: BigInt(Math.round(parseFloat(String(shippingCost)) * 100)),
          currency: 'USD',
        },
      })
    }

    const totalAmount = items.reduce(
      (sum: number, i: any) => sum + parseFloat(String(i.price)) * i.qty, 0
    ) + (parseFloat(String(shippingCost)) || 0)

    // Create Square Checkout link
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey,
      order: {
        locationId: process.env.SQUARE_LOCATION_ID!,
        lineItems,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/success?order_id=${ourOrderId}`,
        askForShippingAddress: true,
      },
    })

    const paymentLink = response.paymentLink

    // Record pending order in DB
    if (paymentLink?.id) {
      const supabase = await createClient()
      
      // 1. Create the main order
      const mockKey = `FLS-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: ourOrderId,
          customer_email: email || 'pending@checkout',
          customer_name: email ? email.split('@')[0] : 'Customer',
          stripe_session_id: paymentLink.id,
          total_amount: totalAmount,
          status: 'pending',
          license_key: mockKey
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 2. Create the itemized records
      const itemRecords = items.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.original_product_id || item.id,
        variant_id: item.variant_id || null,
        quantity: item.qty,
        price_at_purchase: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemRecords)

      if (itemsError) throw itemsError

      // 3. Automated emails have been deactivated per Admin security requirements.
      // E-Mails are now exclusively handled via explicit Manual Push Triggers in the Admin Dashboard.
    }

    return NextResponse.json({ url: paymentLink?.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ 
      error: error.message || 'Server error during checkout.',
      details: error.response?.text || error.toString()
    }, { status: 500 })
  }
}
