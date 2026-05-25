import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GlobalTrackPage({ searchParams }: { searchParams: Promise<{ email?: string, error?: string }> }) {
  const { email, error } = await searchParams
  let ordersList: any[] = []

  // If email was requested, fetch all orders bound to that email address
  if (email) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('id, created_at, status, total_amount, tracking_number, order_items(quantity, products(title))')
      .ilike('customer_email', email)
      .order('created_at', { ascending: false })
    
    if (data) ordersList = data
  }

  // The Omni-Search Server Action
  async function searchOrder(formData: FormData) {
    'use server'
    const query = (formData.get('orderId') as string)?.trim()
    if (!query) return

    // 1. Is it an email address?
    if (query.includes('@')) {
      redirect(`/track?email=${encodeURIComponent(query)}`)
    } else {
      // 2. It is an Order ID formatting. Securely strip any "ORD-" formatting.
      const supabase = await createClient()
      const searchId = query.toLowerCase().replace('ord-', '').trim()
      
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .ilike('id', `${searchId}%`)
        .limit(1)
        .single()
        
      if (order) {
        redirect(`/track/${order.id}`)
      } else {
        redirect(`/track?error=notfound`)
      }
    }
  }
  
  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522] pb-24 flex flex-col items-center relative">
      <div className="absolute top-0 w-full border-b border-[#2b2522]/10 bg-[#EDEDE9]/30">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#2b2522] transition-colors">
            ← Back to Catalog
          </Link>
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
        </div>
      </div>

      {email ? (
        // Rendering the complete Order History List View
        <div className="w-full max-w-4xl px-8 mt-40">
          <div className="mb-16">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-4">Purchase History</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#6e625c] font-mono">
              Associated with: {email}
            </p>
          </div>

          {ordersList.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#2b2522]/20 rounded-xl bg-[#EDEDE9]/30">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">No purchase history found for this email address.</p>
              <Link href="/track" className="btn-neon inline-block text-[10px] font-bold uppercase tracking-wider px-8 py-4 rounded-lg">
                Try Another Search
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersList.map(order => (
                <Link key={order.id} href={`/track/${order.id}`} className="block border border-[#2b2522]/10 p-6 md:p-8 hover:border-[#2b2522]/30 rounded-xl transition-all group shadow-sm bg-[#EDEDE9]/40 hover:bg-[#EDEDE9]/75 duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#2b2522] text-[#F5EBE0] px-2 py-1 rounded">
                          {order.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold tracking-tight text-[#2b2522] mb-1 truncate max-w-xs md:max-w-md">
                        {order.order_items?.[0]?.products?.title || 'Software License'}
                        {order.order_items?.length > 1 && ` + ${order.order_items.length - 1} more tools`}
                      </h3>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        Purchase ID: ORD-{order.id.split('-')[0].toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-8 border-t border-[#2b2522]/5 md:border-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xl font-black tracking-tight text-[#2b2522]">${parseFloat(String(order.total_amount)).toFixed(2)}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Total Charged</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-[#2b2522] transition-colors text-base font-black">
                        ➔
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="pt-16 text-center">
                <Link href="/track" className="text-[10px] font-bold uppercase tracking-widest text-[#2b2522] border-b border-[#2b2522]/30 pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  ← Search Again
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Rendering the Primary Search Field
        <div className="w-full max-w-xl px-8 text-center mt-auto mb-auto">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-[#2b2522] mb-4">Access Purchases</h1>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-12 leading-relaxed">
            Enter your email to retrieve software license keys and downloads.
          </p>
          
          <form action={searchOrder} className="flex flex-col gap-6">
            <input 
              name="orderId" 
              placeholder="customer@example.com or ORD-1A2B3C4D" 
              className={`w-full border-b-2 ${error === 'notfound' ? 'border-red-500' : 'border-[#2b2522]/10'} text-lg py-4 bg-transparent text-[#2b2522] outline-none font-mono text-center focus:border-[#2b2522]/40 transition-colors placeholder:text-gray-400`}
              required
              autoComplete="off"
              spellCheck="false"
            />
            {error === 'notfound' && (
              <p className="text-red-600 text-[10px] font-bold uppercase tracking-wider">License reference not found. Please verify your reference ID.</p>
            )}
            <button 
              type="submit" 
              className="w-full btn-neon font-bold uppercase tracking-wider py-5 rounded-lg transition-all shadow-lg mt-4"
            >
              Access License Portal ➔
            </button>
          </form>
        </div>
      )}
    </main>
  )
}
