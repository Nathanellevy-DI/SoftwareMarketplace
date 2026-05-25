import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import StorefrontGrid from '@/components/StorefrontGrid'
import { FALLBACK_PRODUCTS } from '@/lib/products-fallback'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const supabase = await createClient()
    
    const { data: catData } = await supabase.from('categories').select('*').order('name')
    if (catData) categories = catData

    const { data: pData, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    if (pData) products = pData
  } catch (err) {
    console.error("Database error:", err);
  }

  // Fallback to static portfolio seed products if database is not set up
  if (products.length === 0) {
    products = FALLBACK_PRODUCTS;
  }

  return (
    <main className="min-h-screen bg-[#F5EBE0] text-[#2b2522] p-8 md:p-16 selection:bg-[#D5BDAF] selection:text-[#2b2522]">
      <header className="mb-20 border-b border-[#2b2522]/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center gap-6 md:gap-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#2b2522] text-[#F5EBE0] flex items-center justify-center font-black text-2xl md:text-3xl rounded-xl shadow-md uppercase">
            FS
          </div>
          <div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-[#2b2522]">
              Software MP
            </h1>
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#6e625c] mt-2">
              Premium Software Studio &amp; Marketplace
            </p>
          </div>
        </div>
      </header>
      
      {products.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-[#2b2522]/20 bg-[#EDEDE9]/30 rounded-xl">
          <h2 className="text-2xl font-black uppercase tracking-wider mb-4 text-[#2b2522]">Catalog Empty</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Configure the database connection and populate the marketplace via the Admin console to display your software licenses.
          </p>
        </div>
      ) : (
        <StorefrontGrid 
          products={JSON.parse(JSON.stringify(products))} 
          categories={JSON.parse(JSON.stringify(categories))}
        />
      )}
    </main>
  )
}
