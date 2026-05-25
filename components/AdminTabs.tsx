'use client'

import { useState } from 'react'
import { publishAllChanges } from '@/app/admin/publish-actions'
import AdminProductForm from '@/components/AdminProductForm'
import ProductManager from '@/components/ProductManager'
import CategoryManager from '@/components/CategoryManager'
import OrderDeleteButton from '@/components/OrderDeleteButton'
import OrderStatusSelect from '@/components/OrderStatusSelect'
import OrderTrackingInput from '@/components/OrderTrackingInput'
import FinancialDashboard from '@/components/FinancialDashboard'
import OrderEmailSwitchboard from '@/components/OrderEmailSwitchboard'

const TABS = [
  { key: 'manage', label: 'Manage Products', icon: '⚙️' },
  { key: 'add', label: 'Add New', icon: '✚' },
  { key: 'orders', label: 'Orders & Analytics', icon: '📊' },
] as const

type TabKey = typeof TABS[number]['key']

export default function AdminTabs({ products, categories, orders }: { products: any[], categories: any[], orders: any[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>('manage')
  const [isPublishing, setIsPublishing] = useState(false)
  const [justPublished, setJustPublished] = useState(false)

  async function handlePublish() {
    setIsPublishing(true)
    await publishAllChanges()
    setIsPublishing(false)
    setJustPublished(true)
    setTimeout(() => setJustPublished(false), 3000)
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="bg-white/30 backdrop-blur-sm border border-[#2b2522]/8 rounded-2xl p-2 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(tab => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all rounded-xl flex items-center gap-2.5 ${
                  activeTab === tab.key 
                    ? 'bg-[#2b2522] text-[#F5EBE0] shadow-lg shadow-[#2b2522]/15 scale-[1.02]' 
                    : 'text-[#6e625c] hover:text-[#2b2522] hover:bg-white/50'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-6 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-all rounded-xl flex items-center justify-center gap-2.5 ${
              justPublished 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'btn-neon shadow-lg shadow-blue-500/10'
            } disabled:opacity-50`}
          >
            {isPublishing ? (
              <><span className="w-4 h-4 border-2 border-current/30 rounded-full border-t-current animate-spin" /> Publishing...</>
            ) : justPublished ? (
              <>✔ Live!</>
            ) : (
              <>🚀 Publish Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'manage' && (
        <section className="animate-fade-in-up">
          <ProductManager 
            products={products} 
            categories={categories} 
          />
        </section>
      )}

      {activeTab === 'add' && (
        <section className="animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Categories — narrow sidebar */}
            <div className="lg:col-span-2">
              <CategoryManager categories={categories} />
            </div>
            {/* Product Form — wider */}
            <div className="lg:col-span-3">
              <AdminProductForm categories={categories} />
            </div>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="animate-fade-in-up">
          <FinancialDashboard orders={orders} />
          
          <div className="bg-white/40 backdrop-blur-sm border border-[#2b2522]/8 p-6 md:p-8 shadow-lg rounded-2xl text-[#2b2522]">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#2b2522]/8">
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase text-[#2b2522]">Orders Ledger</h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6e625c] font-bold mt-1">Complete transaction history</p>
              </div>
              <span className="text-xs font-bold tracking-wider text-[#6e625c] bg-[#F5EBE0]/80 px-3 py-1.5 rounded-full border border-[#2b2522]/8">
                {orders?.length || 0} total
              </span>
            </div>
            
            {!orders || orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#2b2522]/10 rounded-xl">
                <div className="text-4xl mb-4 opacity-30">📋</div>
                <p className="text-sm uppercase tracking-widest text-[#6e625c] font-bold">
                  No orders yet
                </p>
                <p className="text-xs text-[#6e625c]/60 mt-2">Orders will appear here when customers make purchases</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="group border border-[#2b2522]/8 rounded-xl p-5 hover:border-[#2b2522]/20 hover:shadow-md transition-all bg-white/20 text-[#2b2522]">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                          <span className="text-[10px] font-mono text-[#6e625c] bg-[#F5EBE0]/80 px-2 py-0.5 rounded">
                            ORD-{order.id.split('-')[0].toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-base font-black tracking-tight truncate max-w-md text-[#2b2522]">
                          {order.customer_email}
                        </h3>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#6e625c] font-bold mt-1">
                          {new Date(order.created_at).toLocaleString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-black tracking-tight text-[#2b2522]">
                          ${parseFloat(String(order.total_amount)).toFixed(2)}
                        </p>
                        <OrderDeleteButton orderId={order.id} />
                      </div>
                    </div>

                    {/* Customer & Delivery Details */}
                    {(order.customer_name || order.shipping_address || order.phone_number) && (
                      <div className="bg-[#F5EBE0]/40 p-4 mb-4 border-l-4 border-[#2b2522] border border-[#2b2522]/8 rounded-r-xl">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#6e625c]">Delivery Details</p>
                          {order.shipping_speed && (
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                              order.shipping_speed === 'Rush' ? 'bg-red-500 text-white' :
                              order.shipping_speed === 'Express' ? 'bg-orange-500 text-white' :
                              'bg-[#2b2522] text-[#F5EBE0]'
                            }`}>
                              {order.shipping_speed}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 text-[11px] font-bold text-[#2b2522]">
                          {order.customer_name && <div><span className="text-[#6e625c] mr-2 uppercase tracking-wider text-[10px]">Name:</span> {order.customer_name}</div>}
                          {order.phone_number && <div><span className="text-[#6e625c] mr-2 uppercase tracking-wider text-[10px]">Phone:</span> {order.phone_number}</div>}
                          {order.shipping_address && <div className="lg:col-span-2 p-2.5 bg-white/30 border border-[#2b2522]/8 rounded-lg mt-1"><span className="text-[#6e625c] mr-2 uppercase tracking-wider text-[10px]">Address:</span> {order.shipping_address}</div>}
                        </div>
                      </div>
                    )}

                    {/* Tracking Section & Manual Emails */}
                    <div className="mb-4 p-4 bg-[#EDEDE9]/30 border border-[#2b2522]/8 rounded-xl">
                      <OrderTrackingInput orderId={order.id} initialValue={order.tracking_number} />
                      <OrderEmailSwitchboard orderId={order.id} currentTracking={order.tracking_number} />
                    </div>

                    {/* Items List */}
                    <div className="grid grid-cols-1 gap-2">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white/30 border border-[#2b2522]/6 p-3 hover:border-[#2b2522]/15 transition-all group rounded-lg">
                          <div className="w-12 h-14 bg-[#F5EBE0] flex-shrink-0 border border-[#2b2522]/8 overflow-hidden rounded-lg">
                            {item.products?.image_url ? (
                              <img 
                                src={item.products.image_url} 
                                alt="" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-[#6e625c]/30 font-bold">—</div>
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5 truncate text-[#2b2522]">
                              {item.products?.title || 'Unknown License'}
                            </h4>
                            <p className="text-[10px] text-[#6e625c] font-bold uppercase tracking-wider">
                              Qty: {item.quantity} · ${parseFloat(String(item.price_at_purchase)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
