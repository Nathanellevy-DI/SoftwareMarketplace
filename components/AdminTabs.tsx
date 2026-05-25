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

export default function AdminTabs({ products, categories, orders }: { products: any[], categories: any[], orders: any[] }) {
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'orders'>('manage')
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
      {/* Tab Navigation & Publish Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-800 pb-4 gap-6">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'manage' 
                ? 'bg-white text-black scale-105 shadow-xl' 
                : 'bg-black text-gray-400 border border-gray-800 hover:text-white hover:border-white'
            }`}
          >
            Manage Existing Items
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'add' 
                ? 'bg-white text-black scale-105 shadow-xl' 
                : 'bg-black text-gray-400 border border-gray-800 hover:text-white hover:border-white'
            }`}
          >
            Add New Items & Categories
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'orders' 
                ? 'bg-white text-black scale-105 shadow-xl' 
                : 'bg-black text-gray-400 border border-gray-800 hover:text-white hover:border-white'
            }`}
          >
            Orders Dashboard
          </button>
        </div>

        <button 
          onClick={handlePublish}
          disabled={isPublishing}
          className={`px-8 py-3 text-xs font-black uppercase tracking-widest transition-all ${
            justPublished ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
          } disabled:opacity-50 flex items-center gap-3`}
        >
          {isPublishing ? (
            <><span className="w-4 h-4 border-2 border-white/50 rounded-full border-t-white animate-spin"></span> Publishing...</>
          ) : justPublished ? (
            <>✔ Everything is Live!</>
          ) : (
            <>Save & Publish to Live Site</>
          )}
        </button>
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in-up items-start">
          <div className="w-full">
            <CategoryManager categories={categories} />
          </div>
          <div className="w-full">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-widest border-l-4 border-white pl-4 text-white">Add New Product</h2>
            <AdminProductForm categories={categories} />
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="animate-fade-in-up max-w-4xl">
          <FinancialDashboard orders={orders} />
          
          <div className="bg-white text-black p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 tracking-tighter uppercase border-b-2 border-black pb-4 flex justify-between items-center">
              <span>Orders Ledger</span>
              <span className="text-xs font-normal tracking-widest text-gray-400">Total: {orders?.length || 0}</span>
            </h2>
            
            {!orders || orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-200">
                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold animate-pulse">
                  System awaiting active orders stream...
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {orders.map((order) => (
                  <div key={order.id} className="group border-b border-gray-100 pb-12 last:border-0 text-black">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                            ORD-{order.id.split('-')[0].toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-xl font-black tracking-tighter truncate max-w-md">
                          {order.customer_email}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">
                          {new Date(order.created_at).toLocaleString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black tracking-tighter">
                          ${parseFloat(String(order.total_amount)).toFixed(2)}
                        </p>
                        <OrderDeleteButton orderId={order.id} />
                      </div>
                    </div>

                    {/* Shipping Details */}
                    {(order.customer_name || order.shipping_address || order.phone_number) && (
                      <div className="bg-gray-50 p-6 mb-4 border-l-4 border-black border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 bg-white inline-block px-2">Shipping Details</p>
                          {order.shipping_speed && (
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${
                              order.shipping_speed === 'Rush' ? 'bg-red-500 text-white animate-pulse' :
                              order.shipping_speed === 'Express' ? 'bg-orange-500 text-white' :
                              'bg-black text-white'
                            }`}>
                              {order.shipping_speed} Speed
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3 text-[11px] font-black uppercase tracking-tight">
                          {order.customer_name && <div><span className="text-gray-400 mr-2">NAME:</span> {order.customer_name}</div>}
                          {order.phone_number && <div><span className="text-gray-400 mr-2">PHONE:</span> {order.phone_number}</div>}
                          {order.shipping_address && <div className="lg:col-span-2 leading-relaxed p-3 bg-white border border-gray-100"><span className="text-gray-400 mr-2">DESTINATION:</span> {order.shipping_address}</div>}
                        </div>
                      </div>
                    )}

                    {/* Tracking Section & Manual Emails */}
                    <div className="mb-8 p-6 bg-gray-50/50 border border-gray-100">
                      <OrderTrackingInput orderId={order.id} initialValue={order.tracking_number} />
                      <OrderEmailSwitchboard orderId={order.id} currentTracking={order.tracking_number} />
                    </div>

                    {/* Items List */}
                    <div className="grid grid-cols-1 gap-4">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-6 bg-white border border-gray-100 p-4 hover:border-black transition-all group shadow-sm">
                          <div className="w-16 h-20 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden shadow-sm">
                            {item.products?.image_url ? (
                              <img 
                                src={item.products.image_url} 
                                alt="" 
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">VOID</div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-1 truncate">
                              {item.products?.title || 'Unknown Print'}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              QTY: {item.quantity} • UNIT PRICE: ${parseFloat(String(item.price_at_purchase)).toFixed(2)}
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
