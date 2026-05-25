import nodemailer from 'nodemailer'

const FROM_ADDRESS = process.env.EMAIL_USER || 'Framesfocusprints@mail.ru'

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Branded email wrapper for consistent styling across all emails.
 */
/**
 * Branded email wrapper for consistent styling across all emails.
 */
function emailLayout(content: string, orderId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  return `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F5EBE0; border: 1px solid rgba(43, 37, 34, 0.08); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(43, 37, 34, 0.03);">
      <!-- Header -->
      <div style="background: #2b2522; color: #F5EBE0; padding: 30px 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">Software MP</h1>
        <p style="margin: 6px 0 0; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #D5BDAF;">Premium Developer Studio</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px; background: #F5EBE0; color: #2b2522;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid rgba(43, 37, 34, 0.08); padding: 30px 40px; text-align: center; background: #EDEDE9;">
        <a href="${siteUrl}/track/${orderId}" style="display: inline-block; background: #2b2522; color: #F5EBE0; padding: 12px 28px; text-decoration: none; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 6px;">
          Access License Dashboard
        </a>
        <p style="margin: 20px 0 0; font-size: 9px; color: #6e625c; text-transform: uppercase; letter-spacing: 0.5px;">
          Order Reference: ${orderId.toUpperCase()}
        </p>
      </div>
    </div>
  `
}

/**
 * Sent immediately when a customer places an order.
 */
export async function sendOrderReceivedEmail(email: string, orderId: string, customerName: string) {
  if (!process.env.EMAIL_PASSWORD) {
    console.warn("⚠️ EMAIL_PASSWORD not set. Skipping order received email.")
    return
  }

  const content = `
    <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px; margin: 0 0 20px; color: #2b2522;">Your Order and License keys are confirmed!</h2>
    <p style="font-size: 14px; color: #6e625c; line-height: 1.6;">
      Hi ${customerName || 'there'},
    </p>
    <p style="font-size: 14px; color: #6e625c; line-height: 1.6;">
      We've successfully verified your payment. Your digital licenses have been compiled and are immediately ready for download and deployment.
    </p>
    <div style="margin: 30px 0; padding: 20px; background: #EDEDE9; border-left: 4px solid #2b2522; border-radius: 4px;">
      <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #6e625c; margin: 0;">Access Status</p>
      <p style="font-size: 18px; font-weight: 800; margin: 8px 0 0; color: #2b2522;">Digital Delivery Ready ✓</p>
    </div>
    <p style="font-size: 12px; color: #6e625c;">Click the button below to retrieve your license keys and download the secure binary package.</p>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Software MP" <${FROM_ADDRESS}>`,
      to: email,
      bcc: FROM_ADDRESS,
      subject: `License keys Ready — ${orderId.toUpperCase()}`,
      html: emailLayout(content, orderId)
    })
    console.log(`✅ License email sent to ${email}: ${info.messageId}`)
  } catch (err: any) {
    console.error("💥 Failed to send License Delivery email:", err)
    throw new Error(err.message)
  }
}

/**
 * Sent when admin changes the order status.
 */
export async function sendOrderStatusEmail(email: string, orderId: string, status: string) {
  if (!process.env.EMAIL_PASSWORD) {
    console.warn("⚠️ EMAIL_PASSWORD not set. Skipping status email.")
    return
  }

  const statusConfig: Record<string, { title: string; message: string; emoji: string }> = {
    'paid': {
      title: 'Payment Verified',
      message: 'Your payment was successfully processed. We are issuing your active license codes.',
      emoji: '💳'
    },
    'delivered': {
      title: 'License Keys Issued',
      message: 'All your purchased software binaries and active license keys have been generated and made available on your dashboard.',
      emoji: '🔑'
    },
    'cancelled': {
      title: 'Subscription/License Cancelled',
      message: 'Your software license access has been deactivated. If this was a mistake, please reach out.',
      emoji: '❌'
    }
  }

  const config = statusConfig[status] || {
    title: `License Status: ${status}`,
    message: `Your license activation status has changed to: ${status}.`,
    emoji: '📋'
  }

  const content = `
    <h2 style="font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px; margin: 0 0 20px; color: #2b2522;">${config.emoji} ${config.title}</h2>
    <div style="margin: 20px 0; padding: 20px; background: #EDEDE9; border-left: 4px solid #2b2522; border-radius: 4px;">
      <p style="font-size: 14px; font-weight: 500; color: #2b2522; line-height: 1.6; margin: 0;">${config.message}</p>
    </div>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Software MP" <${FROM_ADDRESS}>`,
      to: email,
      bcc: FROM_ADDRESS,
      subject: `${config.title} — ${orderId.toUpperCase()}`,
      html: emailLayout(content, orderId)
    })
    console.log(`✅ Status email (${status}) sent to ${email}: ${info.messageId}`)
  } catch (err: any) {
    console.error("💥 Failed to send status email:", err)
    throw new Error(err.message)
  }
}

/**
 * Sent when admin adds a tracking number.
 */
export async function sendOrderTrackingEmail(email: string, orderId: string, trackingNumber: string) {
  if (!process.env.EMAIL_PASSWORD) {
    console.warn("⚠️ EMAIL_PASSWORD not set. Skipping tracking email.")
    return
  }

  const content = `
    <h2 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 20px;">📦 Your Tracking Number</h2>
    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      Your order has been shipped! Here is your tracking number:
    </p>
    <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-left: 4px solid #000; text-align: center;">
      <p style="font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0; font-family: monospace;">${trackingNumber}</p>
    </div>
    <p style="font-size: 13px; color: #999;">Use the button below to view the full status of your delivery.</p>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Software MP" <${FROM_ADDRESS}>`,
      to: email,
      bcc: FROM_ADDRESS,
      subject: `Tracking Added — ORD-${orderId.split('-')[0].toUpperCase()}`,
      html: emailLayout(content, orderId)
    })
    console.log(`✅ Tracking email sent to ${email}: ${info.messageId}`)
  } catch (err: any) {
    console.error("💥 Failed to send tracking email:", err)
    throw new Error(err.message)
  }
}
