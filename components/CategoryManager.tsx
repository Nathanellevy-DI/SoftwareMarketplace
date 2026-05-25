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
    <div className="glass-panel bg-[#EDEDE9]/70 border border-[#2b2522]/10 p-6 rounded-2xl shadow-xl text-[#2b2522]">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#6e625c] mb-6">Manage Categories</h3>
      
      <form onSubmit={handleAdd} className="flex gap-Form mb-6 items-center gap-3">
        <input 
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New Category (e.g. Desktop App)"
          className="flex-1 bg-[#F5EBE0]/60 border border-[#2b2522]/20 text-[#2b2522] rounded p-3 text-sm focus:outline-none focus:border-[#2b2522] transition-colors placeholder:text-[#6e625c]/30"
          maxLength={50}
        />
        <button 
          disabled={loading || !newCat.trim()}
          type="submit"
          className="btn-neon font-black uppercase tracking-widest px-6 py-3 rounded-lg text-xs disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {categories.map(c => (
          <div key={c.id}>
            {editingId === c.id ? (
              <form onSubmit={(e) => handleRenameSubmit(e, c.id)} className="flex items-center gap-2 bg-[#F5EBE0]/90 border border-[#2b2522]/40 rounded px-2 py-1">
                <input 
                  value={editName} 
                  onChange={e => setEditName(e.target.value)}
                  autoFocus 
                  className="bg-transparent text-xs font-bold uppercase tracking-widest text-[#2b2522] p-1 outline-none w-32 md:w-48" 
                  maxLength={50}
                />
                <button type="submit" disabled={loading} className="text-green-600 hover:text-green-500 font-bold px-1 transition-colors">✓</button>
                <button type="button" disabled={loading} onClick={() => setEditingId(null)} className="text-gray-500 hover:text-red-400 font-bold px-1 transition-colors">✕</button>
              </form>
            ) : (
              <div className="group flex items-center gap-2 bg-[#EDEDE9]/80 border border-[#2b2522]/15 px-3 py-2 rounded-lg relative">
                <span className="text-xs uppercase tracking-widest font-bold text-[#2b2522]">{c.name}</span>
                {c.name !== 'Uncategorized' && c.name !== 'Printful Auto-Sync' && (
                  <div className={`flex items-center gap-3 ml-2 transition-opacity ${confirmDeleteId === c.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                      onClick={() => { setEditingId(c.id); setEditName(c.name); }}
                      className="text-[#6e625c] hover:text-[#2b2522] transition-colors"
                      title="Rename Category"
                    >
                      ✎
                    </button>
                    {confirmDeleteId === c.id ? (
                      <div className="flex items-center gap-2 bg-red-900 text-white px-2 py-0.5 ml-1 absolute right-0 top-0 bottom-0 z-10 w-max shadow-xl pr-4 rounded-lg">
                        <span className="text-[9px] uppercase font-black tracking-widest pl-2">Delete?</span>
                        <button onClick={() => executeDelete(c.id, c.name)} className="text-[9px] font-bold hover:text-red-200 uppercase px-1">Yes</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-[9px] font-bold hover:text-gray-300 uppercase px-1">No</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDeleteId(c.id)}
                        disabled={loading}
                        className="text-[#6e625c] hover:text-red-500 transition-colors"
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
