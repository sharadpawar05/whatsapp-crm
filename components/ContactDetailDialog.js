'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import SetReminderDialog from './SetReminderDialog'
import UseTemplateDialog from './UseTemplateDialog'
import { 
  Phone, 
  MessageCircle, 
  Calendar, 
  Edit2, 
  Check, 
  X, 
  Plus, 
  Bell, 
  MessageSquare,
  History
} from 'lucide-react'

const TAG_COLORS = {
  'hot-lead': 'bg-red-100 text-red-700 border-red-200',
  'warm-lead': 'bg-orange-100 text-orange-700 border-orange-200',
  'cold-lead': 'bg-blue-100 text-blue-700 border-blue-200',
  customer: 'bg-green-100 text-green-700 border-green-200',
  lost: 'bg-gray-100 text-gray-700 border-gray-200',
}

const TAG_LABELS = {
  'hot-lead': '🔥 Hot Lead',
  'warm-lead': '☀️ Warm Lead',
  'cold-lead': '❄️ Cold Lead',
  customer: '✅ Customer',
  lost: '❌ Lost',
}

export default function ContactDetailDialog({ contact, open, onClose, onUpdate }) {
  const [notesList, setNotesList] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')
  
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)

  useEffect(() => {
    if (contact && open) {
      setEditedName(contact.name)
      if (contact.notes) {
        // Split notes by the separator and reverse to show newest first
        const blocks = contact.notes.split('\n\n---\n').filter(Boolean).reverse()
        setNotesList(blocks)
      } else {
        setNotesList([])
      }
    }
  }, [contact, open])

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === contact.name) {
      setIsEditingName(false); return
    }
    try {
      const { error } = await supabase.from('contacts').update({ name: editedName }).eq('id', contact.id)
      if (error) throw error
      onUpdate(); setIsEditingName(false)
    } catch (error) { alert(error.message) }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    const tagToAdd = newTag.trim().toLowerCase()
    if (contact.tags?.includes(tagToAdd)) { setNewTag(''); return }
    const updatedTags = [...(contact.tags || []), tagToAdd]
    try {
      const { error } = await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contact.id)
      if (error) throw error
      setNewTag(''); onUpdate()
    } catch (error) { alert(error.message) }
  }

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = contact.tags?.filter(t => t !== tagToRemove) || []
    try {
      const { error } = await supabase.from('contacts').update({ tags: updatedTags }).eq('id', contact.id)
      if (error) throw error
      onUpdate()
    } catch (error) { alert(error.message) }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setLoading(true)
    try {
      const timestamp = new Date().toLocaleString()
      const newNoteBlock = `${timestamp}\n${newNote}`
      const updatedNotesString = contact.notes ? `${contact.notes}\n\n---\n${newNoteBlock}` : newNoteBlock
      const { error } = await supabase.from('contacts').update({ notes: updatedNotesString }).eq('id', contact.id)
      if (error) throw error
      setNotesList((prev) => [newNoteBlock, ...prev])
      setNewNote(''); onUpdate()
    } catch (error) { alert(error.message) } finally { setLoading(false) }
  }

  if (!contact) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full mr-6">
                  <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="h-8" autoFocus />
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleUpdateName}><Check className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setIsEditingName(false)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <DialogTitle className="flex items-center gap-2 group text-xl">
                  {contact.name}
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditingName(true)}>
                    <Edit2 className="w-3 h-3 text-slate-400" />
                  </Button>
                </DialogTitle>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6 overflow-y-auto pr-2 py-4">
            {/* Quick Actions */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
              <p className="text-slate-500 font-mono text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {contact.phone}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => window.location.href = `tel:${contact.phone}`} className="bg-white">
                  <Phone className="w-4 h-4 mr-1.5" /> Call
                </Button>
                <Button size="sm" variant="outline" onClick={() => setTemplateDialogOpen(true)} className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700">
                  <MessageSquare className="w-4 h-4 mr-1.5" /> Use Template
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${contact.phone.replace(/\D/g,'')}`, '_blank')} className="bg-white">
                  <MessageCircle className="w-4 h-4 mr-1.5 text-green-600" /> WhatsApp
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReminderDialogOpen(true)} className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700">
                  <Bell className="h-4 w-4 mr-1.5" /> Reminder
                </Button>
              </div>
            </div>

            {/* Tags Management */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</label>
              <div className="flex flex-wrap gap-2">
                {contact.tags?.length > 0 ? (
                  contact.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${TAG_COLORS[tag] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                    >
                      {TAG_LABELS[tag] || tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-black transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No tags assigned</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Add tag (e.g. VIP)" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="h-9 text-sm" onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} />
                <Button size="sm" variant="secondary" onClick={handleAddTag} className="h-9">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2"><History className="w-4 h-4 text-slate-400" /> Interaction History</h3>
              </div>
              
              <div className="space-y-3">
                <Textarea 
                  placeholder="Type a new update about this lead..." 
                  value={newNote} 
                  onChange={(e) => setNewNote(e.target.value)} 
                  className="min-h-[100px] bg-slate-50 border-slate-200 focus:bg-white transition-all" 
                />
                <Button onClick={handleAddNote} disabled={loading || !newNote.trim()} className="w-full bg-slate-900 text-white hover:bg-slate-800">
                  {loading ? 'Saving...' : 'Add Note to History'}
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                {notesList.map((noteText, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-green-500 transition-colors" />
                    <p className="whitespace-pre-line text-sm text-slate-700 leading-relaxed">
                      {noteText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Helper Dialogs */}
      <SetReminderDialog 
        contact={contact} 
        open={reminderDialogOpen} 
        onClose={() => setReminderDialogOpen(false)} 
        onSuccess={onUpdate} 
      />

      <UseTemplateDialog
        contact={contact}
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
      />
    </>
  )
}