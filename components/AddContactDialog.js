'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Plus } from 'lucide-react'

const TAG_OPTIONS = [
  { value: 'hot-lead', label: '🔥 Hot Lead', color: 'bg-red-100 text-red-700' },
  { value: 'warm-lead', label: '☀️ Warm Lead', color: 'bg-orange-100 text-orange-700' },
  { value: 'cold-lead', label: '❄️ Cold Lead', color: 'bg-blue-100 text-blue-700' },
  { value: 'customer', label: '✅ Customer', color: 'bg-green-100 text-green-700' },
  { value: 'lost', label: '❌ Lost', color: 'bg-gray-100 text-gray-700' },
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

  const toggleTag = (tagValue) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter((t) => t !== tagValue)
        : [...prev.tags, tagValue],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Not authenticated')

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

      setFormData({ name: '', phone: '', tags: [], notes: '' })
      setOpen(false)
      onContactAdded?.()
      alert('Contact added successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        <Plus size={16} />
        Add Contact
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <input
                placeholder="Phone"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <div>
                <p className="text-sm mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      type="button"
                      key={tag.value}
                      onClick={() => toggleTag(tag.value)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        formData.tags.includes(tag.value)
                          ? tag.color
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Notes"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {loading ? 'Adding...' : 'Add Contact'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
