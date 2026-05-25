'use client'

import { useState } from 'react'
import { createCategory, deleteCategory, renameCategory } from '@/app/admin/category-actions'

interface Category {
  id: string
  name: string
  created_at: string
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [newCat, setNewCat] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newCat.trim() || loading) return
    setLoading(true)
    const res = await createCategory(newCat.trim())
    if (!res.success) alert(res.error)
    else setNewCat('')
    setLoading(false)
  }

  async function executeDelete(id: string, name: string) {
    if (name === 'Uncategorized' || name === 'Fine Art Print') {
      alert("Cannot delete system default categories.")
      return
    }
    setLoading(true)
    const res = await deleteCategory(id)
    if (!res.success) alert(res.error)
    setLoading(false)
    setConfirmDeleteId(null)
  }

  async function handleRenameSubmit(e: React.FormEvent, id: string) {
    e.preventDefault()
    if (!editName.trim() || loading) return
    setLoading(true)
    const res = await renameCategory(id, editName.trim())
    if (!res.success) alert(res.error)
    else setEditingId(null)
    setLoading(false)
  }

  return (
    <div className="border border-gray-800 p-6 opacity-90 hover:opacity-100 transition-opacity">
      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Manage Categories</h3>
      
      <form onSubmit={handleAdd} className="flex gap-4 mb-6">
        <input 
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New Category (e.g. New York)"
          className="flex-1 bg-black border border-gray-800 p-3 text-sm focus:outline-none focus:border-white transition-colors"
          maxLength={50}
        />
        <button 
          disabled={loading || !newCat.trim()}
          type="submit"
          className="bg-white text-black font-black uppercase tracking-widest px-6 text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {categories.map(c => (
          <div key={c.id}>
            {editingId === c.id ? (
              <form onSubmit={(e) => handleRenameSubmit(e, c.id)} className="flex items-center gap-2 bg-black border border-white px-2 py-1">
                <input 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  autoFocus 
                  className="bg-black text-xs font-bold uppercase tracking-widest text-white p-1 outline-none w-32 md:w-48" 
                  maxLength={50}
                />
                <button type="submit" disabled={loading} className="text-green-500 hover:text-green-400 font-bold px-1 transition-colors">✓</button>
                <button type="button" disabled={loading} onClick={() => setEditingId(null)} className="text-gray-500 hover:text-red-400 font-bold px-1 transition-colors">✕</button>
              </form>
            ) : (
              <div className="group flex items-center gap-2 bg-gray-900 border border-gray-800 px-3 py-2">
                <span className="text-xs uppercase tracking-widest font-bold">{c.name}</span>
                {c.name !== 'Uncategorized' && c.name !== 'Printful Auto-Sync' && (
                  <div className={`flex items-center gap-3 ml-2 transition-opacity ${confirmDeleteId === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={() => { setEditingId(c.id); setEditName(c.name); }}
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                      title="Rename Category"
                    >
                      ✎
                    </button>
                    {confirmDeleteId === c.id ? (
                      <div className="flex items-center gap-2 bg-red-900 text-white px-2 py-0.5 ml-1 absolute right-0 top-0 bottom-0 z-10 w-max shadow-xl pr-4">
                        <span className="text-[9px] uppercase font-black tracking-widest pl-2">Delete?</span>
                        <button onClick={() => executeDelete(c.id, c.name)} className="text-[9px] font-bold hover:text-red-200 uppercase px-1">Yes</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-[9px] font-bold hover:text-gray-300 uppercase px-1">No</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(c.id)}
                        disabled={loading}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete Category"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
