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

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4 md:px-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              Frame &amp; Focus — Admin
            </h1>
            <p className="text-sm uppercase tracking-widest text-gray-400 mt-2">Executive Operations</p>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="text-xs uppercase tracking-widest text-gray-600 hover:text-white border border-gray-800 px-6 py-3 transition-colors">
              Logout System
            </button>
          </form>
        </header>

        <div className="mt-8">
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
