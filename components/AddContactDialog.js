'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Plus, X, Loader2 } from 'lucide-react'
import { toast } from "sonner" // 👈 Added Sonner for professional feedback

const TAG_OPTIONS = [
  { value: 'hot-lead', label: '🔥 Hot Lead', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'warm-lead', label: '☀️ Warm Lead', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'cold-lead', label: '❄️ Cold Lead', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'customer', label: '✅ Customer', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'lost', label: '❌ Lost', color: 'bg-gray-100 text-gray-700 border-gray-200' },
]

export default function AddContactDialog({ onContactAdded }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tags: [],
    notes: '',
  })

  const isInvalid = !formData.name.trim() || !formData.phone.trim()

  const toggleTag = (tagValue) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter((t) => t !== tagValue)
        : [...prev.tags, tagValue],
    }))
  }

  const handleClose = () => {
    setOpen(false)
    setFormData({ name: '', phone: '', tags: [], notes: '' }) 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isInvalid || !user) return

    setLoading(true)
    try {
      const { error } = await supabase.from('contacts').insert([
        {
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          tags: formData.tags,
          notes: formData.notes,
        },
      ])

      if (error) throw error

      // 🚀 SUCCESS TOAST
      toast.success("Contact Added", {
        description: `${formData.name} has been successfully saved.`
      })

      onContactAdded?.()
      handleClose()
    } catch (error) {
      // ❌ ERROR TOAST
      toast.error("Save Failed", {
        description: error.message || "Something went wrong while saving."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium shadow-sm"
      >
        <Plus size={18} />
        Add Contact
      </button>

      {open && (
        <div
          // 🛠️ MODIFIED: backdrop-blur-[1px] for a cleaner look and bg-black/40 for less darkness
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-[100] p-4 transition-all"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full max-w-md rounded-xl shadow-2xl relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Add New Contact</h2>
              <p className="text-sm text-slate-500 mb-6">Enter details to save a new lead.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Full Name</label>
                  <input
                    placeholder="e.g. John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Phone Number</label>
                  <input
                    placeholder="+1 234 567 890"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase text-slate-500 ml-1 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        type="button"
                        key={tag.value}
                        onClick={() => toggleTag(tag.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${formData.tags.includes(tag.value)
                          ? `${tag.color} scale-105 shadow-sm`
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Notes (Optional)</label>
                  <textarea
                    placeholder="Add specific details about this contact..."
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg hover:bg-slate-200 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isInvalid}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition shadow-md ${loading || isInvalid
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}