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
    <div className="bg-black p-8 border border-white max-w-lg mx-auto mt-10">
      <h2 className="text-white text-2xl font-bold mb-6 tracking-tighter uppercase">
        Add New Art Print
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
          alert("Product added successfully!")
          formRef.current?.reset()
          setPreviews([])
          setImageUrls([])
        }} 
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Title</label>
          <input 
            name="title" 
            className="bg-transparent border-b border-white text-white p-2 outline-none focus:border-gray-500 transition-colors"
            placeholder="E.g. Midnight in Tel Aviv"
            required 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Category Bucket</label>
          <select 
            name="category_id" 
            defaultValue=""
            className="bg-black border-b border-white text-white p-2 outline-none focus:border-gray-500 transition-colors uppercase tracking-widest text-sm"
          >
            <option value="" disabled>Select a Bucket</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Description</label>
          <input 
            name="description" 
            className="bg-transparent border-b border-white text-white p-2 outline-none focus:border-gray-500 transition-colors"
            placeholder="E.g. A beautiful night scene."
          />
        </div>

        {/* Multi-Image Upload Zone */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Artwork Images</label>
          <div
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onClick={() => document.getElementById('file-input')?.click()}
            className={`border-2 border-dashed cursor-pointer transition-all duration-300 min-h-[140px] flex items-center justify-center relative overflow-hidden ${
              dragActive ? 'border-white bg-white/10' : 'border-gray-600 hover:border-gray-400'
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
                  <div key={i} className="relative aspect-[3/4] bg-gray-900 border border-gray-700">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                {uploading && (
                  <div className="aspect-[3/4] border-2 border-dashed border-gray-600 flex items-center justify-center bg-black/50">
                    <span className="text-white text-[9px] uppercase tracking-widest animate-pulse">Wait...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="text-gray-500 text-3xl mb-3">↑</div>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest">
                  Drop multiple images here
                </p>
                {uploading && <p className="text-green-400 text-[10px] mt-2 animate-pulse uppercase tracking-widest">Uploading...</p>}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="imageUrls" value={imageUrls.join(',')} />

        <div className="flex flex-col gap-2">
          <label className="text-white text-xs uppercase tracking-widest">Price ($)</label>
          <input 
            name="price" 
            type="number"
            step="0.01"
            className="bg-transparent border-b border-white text-white p-2 outline-none"
            placeholder="250.00"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={imageUrls.length === 0 || uploading}
          className={`font-bold py-4 mt-4 transition-all uppercase text-sm tracking-widest ${
            imageUrls.length === 0 || uploading
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {uploading ? 'Processing Images...' : 'Publish to Gallery'}
        </button>
      </form>
    </div>
  )
}
