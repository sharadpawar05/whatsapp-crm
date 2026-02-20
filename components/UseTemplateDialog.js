// components/UseTemplateDialog.js
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, ExternalLink } from 'lucide-react'

export default function UseTemplateDialog({ contact, open, onClose }) {
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    if (open) fetchTemplates()
  }, [open])

  const fetchTemplates = async () => {
    const { data } = await supabase.from('templates').select('*').order('created_at', { ascending: false })
    setTemplates(data || [])
  }

const handleUse = (content) => {
  let finalMessage = content
    .replace(/\{\s*name\s*\}/gi, contact.name || 'there')
    .replace(/\{\s*phone\s*\}/gi, contact.phone || '');

  finalMessage = finalMessage.replace(/\{|\}/g, '');

  navigator.clipboard.writeText(finalMessage);
  
  // --- THE DIRECT WEB FIX ---
  // Using web.whatsapp.com/send instead of api.whatsapp.com 
  // forces the browser to target the web interface directly.
  const cleanPhone = contact.phone.replace(/\D/g,'');
  const encodedMsg = encodeURIComponent(finalMessage);
  
  const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
  
  window.open(waUrl, '_blank');
  onClose();
}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Select a Template for {contact?.name}</DialogTitle></DialogHeader>
        <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
          {templates.map(t => (
            <button key={t.id} onClick={() => handleUse(t.content)} className="text-left p-3 border rounded-lg hover:bg-slate-50 transition-colors group">
              <p className="font-bold text-sm mb-1">{t.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{t.content}</p>
              <div className="mt-2 flex items-center text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-3 h-3 mr-1" /> USE & OPEN WHATSAPP
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}