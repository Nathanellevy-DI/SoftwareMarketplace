'use client'

import { useState } from 'react'
import { deleteProduct, updateProduct, toggleProductAvailability, removeProductImage, addProductImage } from '@/app/admin/product-actions'
import VariantManager from './VariantManager'
import imageCompression from 'browser-image-compression'

interface Product {
  id: string
  title: string
  description?: string
  price: number | string
  image_urls: string[]
  is_available: boolean
  product_variants?: any[]
  category_id?: string
}

interface Category {
  id: string
  name: string
}

export default function ProductManager({ products, categories }: { products: Product[], categories: Category[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [removingImage, setRemovingImage] = useState<string | null>(null)
  const [confirmRemoveImage, setConfirmRemoveImage] = useState<string | null>(null)
  const [uploadingImageFor, setUploadingImageFor] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  async function handleAddImage(productId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImageFor(productId)
    try {
      const options = { maxSizeMB: 4, maxWidthOrHeight: 1600, useWebWorker: true, fileType: 'image/webp' }
      const compressedFile = await imageCompression(file, options)
      
      const formData = new FormData()
      formData.append('file', compressedFile, 'image.webp')
      
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      
      const data = await res.json()
      if (data.url) {
        const actionRes = await addProductImage(productId, data.url)
        if (!actionRes.success) alert('Error appending image: ' + actionRes.error)
      } else {
        alert(data.error)
      }
    } catch (err: any) {
      alert("Error adding image: " + err.message)
    } finally {
      setUploadingImageFor(null)
      e.target.value = ''
    }
  }

  async function handleSyncPrintful() {
    setSyncing(true)
    try {
      const res = await fetch('/api/printful/sync', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        window.location.reload() // Refresh to see synced catalog
      } else alert(`Sync Error: ${data.error}`)
    } catch (err: any) {
      alert(`Sync Failed: ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }

  async function executeDelete(productId: string) {
    setDeleting(productId)
    const res = await deleteProduct(productId)
    if (!res.success) {
      alert(`Error deleting product: ${res.error}`)
    }
    setDeleting(null)
    setConfirmDeleteId(null)
  }

  async function executeRemoveImage(productId: string, imageUrl: string) {
    setRemovingImage(imageUrl)
    const res = await removeProductImage(productId, imageUrl)
    if (!res.success) {
      alert(`Error removing image: ${res.error}`)
    }
    setRemovingImage(null)
    setConfirmRemoveImage(null)
  }

  async function handleToggle(productId: string, currentState: boolean) {
    setToggling(productId)
    const res = await toggleProductAvailability(productId, currentState)
    if (!res.success) alert(`Error toggling availability: ${res.error}`)
    setToggling(null)
  }

  async function handleSaveEdit(productId: string, formData: FormData) {
    const result = await updateProduct(productId, formData)
    if (result.success) {
      setEditingId(null)
    } else {
      alert(`Failed to update: ${result.error}`)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 p-8 text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest">No products in catalog</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-[#2b2522]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-widest border-l-4 border-[#2b2522] pl-4 text-[#2b2522]">
          Software Inventory ({products.length})
        </h2>
        <button
          onClick={handleSyncPrintful}
          disabled={syncing}
          className="text-[10px] font-black uppercase tracking-widest btn-warm-secondary hover:bg-[#E3D5CA] text-[#2b2522] px-4 py-2 border border-[#2b2522]/15 shadow-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {syncing ? (
            <span className="animate-spin w-4 h-4 rounded-full border-t-2 border-[#2b2522] block"></span>
          ) : (
            '⚡ Auto-Sync from Printful'
          )}
        </button>
      </div>

      {products.map((product) => (
        <div key={product.id} className="border border-[#2b2522]/10 p-5 group hover:border-[#2b2522]/30 transition-colors rounded-xl bg-[#EDEDE9]/40 hover:bg-[#EDEDE9]/60 shadow-sm">
          {editingId === product.id ? (
            // Edit Mode
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleSaveEdit(product.id, formData)
              }}
              className="space-y-3"
            >
              <input
                name="title"
                defaultValue={product.title}
                className="w-full bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] text-sm font-bold"
                placeholder="Title"
              />
              <select
                name="category_id"
                defaultValue={product.category_id || ''}
                className="w-full bg-[#EDEDE9] border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] text-sm uppercase tracking-widest font-bold rounded"
              >
                <option value="" disabled>Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={product.price}
                className="w-full bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] text-sm"
                placeholder="Price"
              />
              <div className="flex gap-2 max-w-[240px] overflow-x-auto no-scrollbar pb-2 mb-2 items-center">
                {product.image_urls?.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-20 flex-shrink-0 border border-[#2b2522]/10 bg-[#F5EBE0] rounded overflow-hidden group">
                    <img src={img} alt={`Mockup ${idx + 1}`} className="w-full h-full object-contain p-1" />
                    {confirmRemoveImage === img ? (
                      <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center gap-2">
                        <button type="button" onClick={() => executeRemoveImage(product.id, img)} className="text-[10px] font-black text-white hover:text-red-200">YES</button>
                        <button type="button" onClick={() => setConfirmRemoveImage(null)} className="text-[10px] font-black text-gray-300 hover:text-white">NO</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveImage(img)}
                        disabled={removingImage === img}
                        className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 rounded-bl"
                        title="Delete Mockup"
                      >
                        {removingImage === img ? '...' : 'X'}
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Add Image Button */}
                <label className="w-16 h-20 bg-[#F5EBE0] border border-dashed border-[#2b2522]/30 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-[#EDEDE9]/80 transition-colors flex-shrink-0 relative group">
                  {uploadingImageFor === product.id ? (
                    <span className="w-4 h-4 border-2 border-[#2b2522] rounded-full border-t-transparent animate-spin"></span>
                  ) : (
                    <>
                      <span className="text-xl font-black text-[#6e625c] group-hover:text-[#2b2522]">+</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#6e625c]/60 group-hover:text-[#2b2522] mt-1">Add</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAddImage(product.id, e)} disabled={uploadingImageFor === product.id} />
                </label>
              </div>
              <input type="hidden" name="imageUrl" value="" />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 btn-neon text-xs font-black uppercase tracking-widest py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 border border-[#2b2522]/20 text-[#6e625c] hover:text-[#2b2522] hover:bg-[#EDEDE9]/80 text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="flex gap-4 items-start">
              <div className="flex gap-2 max-w-[240px] overflow-x-auto no-scrollbar pb-2">
                {product.image_urls?.map((img, idx) => (
                  <div key={idx} className="w-16 h-20 bg-[#F5EBE0] flex-shrink-0 overflow-hidden border border-[#2b2522]/10 rounded">
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[#2b2522] truncate uppercase tracking-tight">
                    {product.title}
                  </h3>
                  {!product.is_available && (
                    <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 uppercase tracking-widest font-black rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6e625c] font-black tracking-tight">
                  ${parseFloat(String(product.price)).toFixed(2)}
                </p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setEditingId(product.id)}
                    className="text-[10px] uppercase tracking-widest text-[#6e625c] hover:text-[#2b2522] transition-colors font-black"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleToggle(product.id, product.is_available)}
                    disabled={toggling === product.id}
                    className="text-[10px] uppercase tracking-widest text-[#6e625c] hover:text-[#2b2522] transition-colors font-black disabled:opacity-50"
                  >
                    {toggling === product.id ? '...' : product.is_available ? 'Hide' : 'Show'}
                  </button>
                  {confirmDeleteId === product.id ? (
                    <div className="flex items-center gap-2 bg-red-900 text-white px-2 py-0.5 ml-2 rounded">
                      <span className="text-[9px] uppercase font-black tracking-widest">Sure?</span>
                      <button onClick={() => executeDelete(product.id)} className="text-[9px] font-bold hover:text-red-200 uppercase px-1">Yes</button>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-[9px] font-bold hover:text-gray-300 uppercase px-1">No</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(product.id)}
                      disabled={deleting === product.id}
                      className="text-[10px] uppercase tracking-widest text-[#6e625c] hover:text-red-600 transition-colors font-black disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Variant Manager shows below the artwork details if not in edit mode */}
          {editingId !== product.id && (
            <VariantManager 
              productId={product.id} 
              variants={product.product_variants || []} 
            />
          )}

        </div>
      ))}
    </div>
  )
}
