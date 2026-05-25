import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TrackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch order with items and product details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        products (
          title,
          image_url
        )
      )
    `)
    .eq('id', id)
    .single()

  if (!order) return notFound()

  const statusSteps = [
    { id: 'pending', label: 'Order Received', icon: '📥' },
    { id: 'paid', label: 'Payment Confirmed', icon: '💳' },
    { id: 'delivered', label: 'Licenses Generated', icon: '🔑' },
  ]

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status)

  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522] pb-24">
      {/* Header */}
      <div className="border-b border-[#2b2522]/10 bg-[#EDEDE9]/30 sticky top-0 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              className="w-8 h-8 object-cover bg-[#2b2522] rounded-lg shadow-sm border border-[#2b2522]/10" 
              alt="Software MP Logo" 
            />
            <span className="text-xl font-black uppercase tracking-tight text-[#2b2522]">
              Software MP
            </span>
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-wider bg-[#2b2522] text-[#F5EBE0] px-3 py-1 rounded">
            Status: {order.status}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-20">
        <div className="mb-16">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-4">License Tracker</h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
            REFERENCE: {order.id.toUpperCase()} • {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-20">
          <div className="relative flex justify-between">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-[#2b2522]/10 -z-10"></div>
            
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex
              const isCurrent = idx === currentStepIndex

              return (
                <div key={step.id} className="flex flex-col items-center gap-3 w-24 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    isCompleted ? 'bg-[#2b2522] text-[#F5EBE0] shadow-md' : 'bg-white border border-[#2b2522]/10 text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-[#D5BDAF]/50 scale-110' : ''}`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest leading-tight ${
                    isCompleted ? 'text-[#2b2522]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Tracking Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Delivery Information</h2>
              {order.license_key ? (
                <div className="bg-[#EDEDE9] p-8 border-l-4 border-[#2b2522] rounded-r-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Secure License Key</p>
                  <p className="text-xl font-black font-mono tracking-tight text-[#2b2522] mb-4 select-all">{order.license_key}</p>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); alert("Secure download initialized.") }}
                    className="inline-block bg-[#2b2522] text-[#F5EBE0] text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded hover:bg-[#6e625c] transition-colors"
                  >
                    Download Binary 📥
                  </a>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#2b2522]/10 rounded-lg text-center bg-[#EDEDE9]/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    License details will be available once processed
                  </p>
                </div>
              )}
            </div>

            {order.customer_email && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">Registered Recipient</h2>
                <p className="text-sm font-bold leading-relaxed text-[#2b2522]">
                  {order.customer_name}<br />
                  <span className="font-mono text-gray-500 font-normal">{order.customer_email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6">License Summary</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center py-4 border-b border-[#2b2522]/10 last:border-0">
                  <div className="w-10 h-10 bg-[#25201d] text-[#F5EBE0] flex items-center justify-center font-bold text-sm rounded-lg uppercase shadow-sm">
                    {item.products?.title?.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2b2522]">{item.products?.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">QTY: {item.quantity}</p>
                  </div>
                </div>
              ))}
              <div className="pt-6">
                <p className="text-2xl font-black tracking-tight text-[#2b2522]">
                  Total Charged: ${parseFloat(String(order.total_amount)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-[#2b2522]/10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 italic">
            Thank you for deploying Software MP
          </p>
          <Link href="/" className="text-xs font-bold uppercase tracking-widest border-b border-[#2b2522]/30 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
            Return to Catalog
          </Link>
        </div>
      </div>
    </main>
  )
}
