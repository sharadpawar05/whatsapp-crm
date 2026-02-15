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
import { Phone, MessageCircle, Calendar, Edit2, Check, X, Plus } from 'lucide-react'

const TAG_COLORS = {
  'hot-lead': 'bg-red-100 text-red-700',
  'warm-lead': 'bg-orange-100 text-orange-700',
  'cold-lead': 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-700',
}

const TAG_LABELS = {
  'hot-lead': '🔥 Hot Lead',
  'warm-lead': '☀️ Warm Lead',
  'cold-lead': '❄️ Cold Lead',
  customer: '✅ Customer',
  lost: '❌ Lost',
}

export default function ContactDetailDialog({
  contact,
  open,
  onClose,
  onUpdate,
}) {
  const [notesList, setNotesList] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    if (contact && open) {
      setEditedName(contact.name)
      if (contact.notes) {
        const blocks = contact.notes
          .split('\n\n---\n')
          .filter(Boolean)
          .reverse()
        setNotesList(blocks)
      } else {
        setNotesList([])
      }
    }
  }, [contact, open])

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName === contact.name) {
      setIsEditingName(false)
      return
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ name: editedName })
        .eq('id', contact.id)

      if (error) throw error
      onUpdate()
      setIsEditingName(false)
    } catch (error) {
      alert('Error updating name: ' + error.message)
    }
  }

  const handleAddTag = async () => {
    if (!newTag.trim()) return
    const tagToAdd = newTag.trim().toLowerCase()
    
    if (contact.tags?.includes(tagToAdd)) {
      setNewTag('')
      return
    }

    const updatedTags = [...(contact.tags || []), tagToAdd]

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ tags: updatedTags })
        .eq('id', contact.id)

      if (error) throw error
      setNewTag('')
      onUpdate()
    } catch (error) {
      alert('Error adding tag: ' + error.message)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    setLoading(true)

    try {
      const timestamp = new Date().toLocaleString()
      const newNoteBlock = `${timestamp}\n${newNote}`
      
      const updatedNotesString = contact.notes
        ? `${contact.notes}\n\n---\n${newNoteBlock}`
        : newNoteBlock

      const { error } = await supabase
        .from('contacts')
        .update({ notes: updatedNotesString })
        .eq('id', contact.id)

      if (error) throw error

      // Instant UI Update
      setNotesList((prev) => [newNoteBlock, ...prev])
      setNewNote('')
      onUpdate()
    } catch (error) {
      alert('Error adding note: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 w-full mr-6">
                <Input 
                  value={editedName} 
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-8"
                  autoFocus
                />
                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={handleUpdateName}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setIsEditingName(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <DialogTitle className="flex items-center gap-2 group">
                {contact.name}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </DialogTitle>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Phone Actions */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-mono">{contact.phone}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => window.location.href = `tel:${contact.phone}`}>
                <Phone className="w-4 h-4 mr-1" /> Call
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/${contact.phone.replace(/\D/g,'')}`, '_blank')}>
                <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
              </Button>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {contact.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    TAG_COLORS[tag] || 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {TAG_LABELS[tag] || `✨ ${tag}`}
                </span>
              ))}
            </div>
            
            {/* Requirement: Add "VIP" custom tag logic */}
            <div className="flex gap-2">
              <Input 
                placeholder="Add custom tag (e.g. VIP)" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button size="sm" variant="secondary" onClick={handleAddTag} className="h-8">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
          </div>

          <hr />

          {/* Notes History */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Notes History
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {notesList.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No notes yet.</p>
              ) : (
                notesList.map((noteText, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="whitespace-pre-line text-sm text-slate-700">{noteText}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add New Note */}
          <div className="pt-2 border-t space-y-3">
            <Textarea
              placeholder="Add a new update..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px]"
            />
            <Button
              onClick={handleAddNote}
              disabled={loading || !newNote.trim()}
              className="w-full bg-primary"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}