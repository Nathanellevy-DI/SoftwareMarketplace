'use client'

import { addProduct } from '@/app/actions'
import { useRef, useState, ChangeEvent, DragEvent } from 'react'
import imageCompression from 'browser-image-compression'

interface Category {
  id: string
  name: string
}

export default function AdminProductForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState<boolean>(false)

  async function processFile(file: File) {
    if (!file || !file.type.startsWith('image/')) return null
    return new Promise<{preview: string, url: string}>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const previewResult = (e.target?.result as string) || ''
        try {
          const options = { maxSizeMB: 4, maxWidthOrHeight: 1600, useWebWorker: true, fileType: 'image/webp' }
          const compressedFile = await imageCompression(file, options)
          const formData = new FormData()
          formData.append('file', compressedFile, 'image.webp')
          const res = await fetch('/api/upload', { method: 'POST', body: formData })
          if (!res.ok) throw new Error('Upload failed')
          const data = await res.json()
          if (data.url) resolve({ preview: previewResult, url: data.url })
          else reject(data.error)
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  async function handleFiles(files: FileList | null | undefined) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const results = await Promise.all(Array.from(files).map(f => processFile(f)))
      const valid = results.filter(Boolean) as {preview: string, url: string}[]
      setPreviews(prev => [...prev, ...valid.map(v => v.preview)])
      setImageUrls(prev => [...prev, ...valid.map(v => v.url)])
    } catch (err) {
      console.error(err)
      alert("Error uploading images.")
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleDrag(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  return (
    <div className="glass-panel bg-[#EDEDE9]/70 border border-[#2b2522]/10 p-8 max-w-lg mx-auto mt-10 rounded-2xl shadow-xl text-[#2b2522]">
      <h2 className="text-[#2b2522] text-2xl font-black mb-6 tracking-tighter uppercase">
        Add New Software
      </h2>
      
      <form 
        ref={formRef}
        action={async (formData) => {
          formData.set('imageUrls', imageUrls.join(','))
          const result = await addProduct(formData)
          if (!result.success) {
            alert(`Error: ${result.error}`)
            return
          }
          alert("Software product added successfully!")
          formRef.current?.reset()
          setPreviews([])
          setImageUrls([])
        }} 
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">Title</label>
          <input 
            name="title" 
            className="bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] transition-colors placeholder:text-[#6e625c]/30"
            placeholder="E.g. StreamBox"
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">Category Bucket</label>
          <select 
            name="category_id" 
            defaultValue=""
            className="bg-[#EDEDE9]/90 border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] transition-colors uppercase tracking-widest text-sm font-bold"
          >
            <option value="" disabled>Select Category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">Description</label>
          <input 
            name="description" 
            className="bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] transition-colors placeholder:text-[#6e625c]/30"
            placeholder="E.g. High-performance sports streaming dashboard."
          />
        </div>

        {/* Multi-Image Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">Screenshots &amp; Logo</label>
          <div
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed cursor-pointer transition-all duration-300 min-h-[140px] flex items-center justify-center relative overflow-hidden rounded-xl ${
              dragActive ? 'border-[#2b2522] bg-[#2b2522]/5' : 'border-[#2b2522]/20 hover:border-[#2b2522]/60'
            }`}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
            />

            {previews.length > 0 ? (
              <div className="p-4 grid grid-cols-3 gap-2 w-full">
                {previews.map((preview, i) => (
                  <div key={i} className="relative aspect-[3/4] bg-[#F5EBE0] border border-[#2b2522]/10 rounded overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-1" />
                  </div>
                ))}
                {uploading && (
                  <div className="aspect-[3/4] border-2 border-dashed border-[#2b2522]/20 flex items-center justify-center bg-[#EDEDE9]/60 rounded animate-pulse">
                    <span className="text-[#2b2522] text-[9px] uppercase tracking-widest">Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-[#6e625c] text-3xl mb-3">↑</div>
                <p className="text-[#6e625c] text-[10px] uppercase tracking-widest font-bold">
                  Drop screenshot / logo here
                </p>
                {uploading && <p className="text-[#2b2522] text-[10px] mt-2 animate-pulse uppercase tracking-widest font-black">Uploading...</p>}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="imageUrls" value={imageUrls.join(',')} />

        <div className="flex flex-col gap-2">
          <label className="text-[#2b2522] text-xs uppercase tracking-widest font-bold">Price ($)</label>
          <input 
            name="price" 
            type="number"
            step="0.01"
            className="bg-transparent border-b border-[#2b2522]/20 text-[#2b2522] p-2 outline-none focus:border-[#2b2522] transition-colors placeholder:text-[#6e625c]/30"
            placeholder="19.00"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={imageUrls.length === 0 || uploading}
          className={`font-black py-4 mt-4 transition-all uppercase text-sm tracking-widest rounded-xl shadow-md ${
            imageUrls.length === 0 || uploading
              ? 'bg-[#EDEDE9]/80 text-[#6e625c]/40 cursor-not-allowed border border-[#2b2522]/10'
              : 'btn-neon'
          }`}
        >
          {uploading ? 'Processing Images...' : 'Create Software Product'}
        </button>
      </form>
    </div>
  )
}
