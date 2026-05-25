'use client'

import { useState, useMemo } from 'react'

interface Order {
  id: string
  created_at: string
  total_amount: number | string
  status: string
}

export default function FinancialDashboard({ orders }: { orders: Order[] }) {
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | 'YTD' | 'ALL'>('30D')

  const stats = useMemo(() => {
    const now = new Date()
    
    let filteredOrders = orders.filter(o => o.status !== 'cancelled')
    
    if (timeFilter === '7D') {
      const cutoff = new Date()
      cutoff.setDate(now.getDate() - 7)
      filteredOrders = filteredOrders.filter(o => new Date(o.created_at) >= cutoff)
    } else if (timeFilter === '30D') {
      const cutoff = new Date()
      cutoff.setDate(now.getDate() - 30)
      filteredOrders = filteredOrders.filter(o => new Date(o.created_at) >= cutoff)
    } else if (timeFilter === 'YTD') {
      const cutoff = new Date(now.getFullYear(), 0, 1)
      filteredOrders = filteredOrders.filter(o => new Date(o.created_at) >= cutoff)
    }

    const totalOrders = filteredOrders.length
    const grossRevenue = filteredOrders.reduce((sum, o) => sum + parseFloat(String(o.total_amount || 0)), 0)

    let chartArray: { label: string, value: number, tooltip: string }[] = []
    
    if (timeFilter === '7D' || timeFilter === '30D') {
      const days = timeFilter === '7D' ? 7 : 30
      const tempMap = new Map<string, number>()
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        tempMap.set(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 0)
      }
      filteredOrders.forEach(o => {
        const dateStr = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (tempMap.has(dateStr)) {
          tempMap.set(dateStr, tempMap.get(dateStr)! + parseFloat(String(o.total_amount || 0)))
        }
      })
      chartArray = Array.from(tempMap.entries()).map(([label, value]) => ({ 
        label, 
        value,
        tooltip: `$${value.toFixed(2)}`
      }))
    } else if (timeFilter === 'YTD') {
      const tempMap = new Map<string, number>()
      const currentMonth = now.getMonth()
      for (let i = 0; i <= currentMonth; i++) {
        const d = new Date(now.getFullYear(), i, 1)
        tempMap.set(d.toLocaleDateString('en-US', { month: 'short' }), 0)
      }
      filteredOrders.forEach(o => {
        const dateStr = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short' })
        if (tempMap.has(dateStr)) {
          tempMap.set(dateStr, tempMap.get(dateStr)! + parseFloat(String(o.total_amount || 0)))
        }
      })
      chartArray = Array.from(tempMap.entries()).map(([label, value]) => ({ 
        label, 
        value,
        tooltip: `$${value.toFixed(2)}` 
      }))
    } else {
      const tempMap = new Map<string, number>()
      filteredOrders.forEach(o => {
        const d = new Date(o.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
        tempMap.set(key, (tempMap.get(key) || 0) + parseFloat(String(o.total_amount || 0)))
      })
      const sortedKeys = Array.from(tempMap.keys()).sort()
      chartArray = sortedKeys.map(k => {
        const [y, m] = k.split('-')
        const label = new Date(parseInt(y), parseInt(m)-1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        return { 
          label, 
          value: tempMap.get(k)!,
          tooltip: `$${tempMap.get(k)!.toFixed(2)}` 
        }
      })
    }

    const maxVal = Math.max(...chartArray.map(c => c.value), 1)

    return { totalOrders, grossRevenue, chartArray, maxVal }
  }, [orders, timeFilter])

  return (
    <div className="bg-white text-black border border-gray-200 mb-12 shadow-sm rounded-none">
      <div className="p-6 md:p-10">
        
        {/* Header Ribbon & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Gross Metrics</h2>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Operational Analytics Engine</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 border border-gray-200">
            {(['7D', '30D', 'YTD', 'ALL'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`py-2 px-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  timeFilter === filter 
                    ? 'bg-black text-white shadow-md' 
                    : 'text-gray-500 hover:text-black hover:bg-white'
                }`}
              >
                {filter === 'ALL' ? 'All-Time' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 border border-gray-200 mb-10">
          <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Total Volume</span>
            <span className="text-4xl md:text-5xl font-black tracking-tighter">
              {stats.totalOrders} <span className="text-lg text-gray-300 font-bold uppercase tracking-widest">Orders</span>
            </span>
          </div>
          <div className="bg-white p-6 md:p-8 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Gross Revenue</span>
            <span className="text-4xl md:text-5xl font-black tracking-tighter text-blue-600">
              ${stats.grossRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CSS Chart */}
        <div className="h-[250px] w-full flex items-end gap-1 px-2 border-b-2 border-black pb-4 relative mt-16 overflow-x-auto no-scrollbar pt-6">
          {/* Y-Axis lines (optional decorative) */}
          <div className="absolute inset-0 border-t border-gray-100 pointer-events-none" />
          <div className="absolute inset-x-0 top-1/2 border-t border-gray-50 border-dashed pointer-events-none" />
          
          {stats.chartArray.length === 0 ? (
            <div className="w-full text-center text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">No data generated in this period</div>
          ) : (
            stats.chartArray.map((bar, idx) => {
              const heightPercentage = (bar.value / stats.maxVal) * 100
              // Determine width of bars based on how many
              const isDense = stats.chartArray.length > 15
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group min-w-[30px] relative z-10 cursor-crosshair">
                  {/* Tooltip Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white text-[10px] font-black tracking-widest px-2 py-1 pointer-events-none z-20">
                    {bar.tooltip}
                  </div>
                  
                  {/* Main Column */}
                  <div 
                    className="w-full bg-black hover:bg-blue-600 transition-colors duration-300 border-t-2 border-x border-black hover:border-blue-600"
                    style={{ height: `${Math.max(heightPercentage, 1)}%`, minHeight: bar.value === 0 ? '0' : '4px' }}
                  />
                  
                  {/* X-Axis Label */}
                  <span className={`text-[8px] uppercase tracking-wider font-bold text-gray-400 mt-2 truncate max-w-[90%] transform ${isDense ? '-rotate-45 -ml-2 origin-top-left' : ''}`}>
                    {bar.label}
                  </span>
                </div>
              )
            })
          )}
        </div>
        
      </div>
    </div>
  )
}
