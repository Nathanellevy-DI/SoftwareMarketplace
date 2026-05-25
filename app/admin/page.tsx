import AdminProductForm from '@/components/AdminProductForm'
import ProductManager from '@/components/ProductManager'
import CategoryManager from '@/components/CategoryManager'
import { logoutAction } from '@/app/admin/auth-actions'
import { createClient } from '@/utils/supabase/server'
import OrderDeleteButton from '@/components/OrderDeleteButton'
import OrderStatusSelect from '@/components/OrderStatusSelect'
import OrderTrackingInput from '@/components/OrderTrackingInput'
import AdminTabs from '@/components/AdminTabs'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  
  // Fetch all products (including hidden) for catalog management
  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          title,
          image_url
        )
      )
    `)
    .order('created_at', { ascending: false })

  const totalProducts = products?.length || 0
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(String(o.total_amount || 0)), 0) || 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5EBE0] via-[#F0E6D8] to-[#EDEDE9] text-[#2b2522] selection:bg-[#D5BDAF] selection:text-[#2b2522]">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D5BDAF]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E3D5CA]/15 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 py-10 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
        {/* Premium Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-5">
              <img 
                src="/logo.png" 
                className="w-14 h-14 object-cover bg-[#2b2522] rounded-xl shadow-lg border border-[#2b2522]/10" 
                alt="Software MP Logo" 
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#2b2522]">
                  Software MP
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#6e625c] mt-1 font-bold">
                  Admin Dashboard
                </p>
              </div>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-[10px] uppercase tracking-[0.2em] text-[#6e625c] hover:text-[#2b2522] border border-[#2b2522]/15 hover:border-[#2b2522]/30 hover:bg-[#EDEDE9]/80 px-5 py-2.5 transition-all rounded-lg font-bold backdrop-blur-sm">
                ← Sign Out
              </button>
            </form>
          </div>
        </header>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/40 backdrop-blur-sm border border-[#2b2522]/8 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2b2522]/5 flex items-center justify-center text-lg">📦</div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#6e625c] font-bold">Products</p>
                <p className="text-2xl font-black tracking-tight text-[#2b2522]">{totalProducts}</p>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm border border-[#2b2522]/8 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2b2522]/5 flex items-center justify-center text-lg">🧾</div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#6e625c] font-bold">Orders</p>
                <p className="text-2xl font-black tracking-tight text-[#2b2522]">{totalOrders}</p>
              </div>
            </div>
            <div className="bg-white/40 backdrop-blur-sm border border-[#2b2522]/8 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2b2522]/5 flex items-center justify-center text-lg">💰</div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#6e625c] font-bold">Revenue</p>
                <p className="text-2xl font-black tracking-tight text-[#2b2522]">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content Area */}
        <div className="mt-4">
          <AdminTabs 
            products={JSON.parse(JSON.stringify(products || []))} 
            categories={categories || []} 
            orders={orders || []} 
          />
        </div>
      </div>
    </main>
  )
}
