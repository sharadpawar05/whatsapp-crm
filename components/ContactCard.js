'use client'

import { Phone, MessageCircle, Copy, Trash2, MoreVertical,Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const TAG_COLORS = {
  'hot-lead': 'bg-red-100 text-red-700',
  'warm-lead': 'bg-orange-100 text-orange-700',
  'cold-lead': 'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
  lost: 'bg-gray-100 text-gray-700',
}

export default function ContactCard({ contact, onDelete, onClick }) {
  const handleCall = (e) => {
    e.stopPropagation()
    window.location.href = `tel:${contact.phone}`
  }

  const handleWhatsApp = (e) => {
    e.stopPropagation()
    const phone = contact.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(contact.phone)
  }

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-lg transition cursor-pointer group relative"
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.phone}</p>

          </div>
          {contact.next_followup && (
            <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded w-fit">
              <Bell className="w-3 h-3" />
              Follow-up: {new Date(contact.next_followup).toLocaleDateString()}
            </div>
          )}

          {/* Requirement: Click Edit (3 dots) -> Opens Modal */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-100"
            onClick={(e) => {
              e.stopPropagation();
              onClick(); // Triggers the detail/edit modal
            }}
          >
            <MoreVertical className="w-4 h-4 text-slate-500" />
          </Button>
        </div>

        {/* Tag Support (Including fallback for custom tags like "VIP") */}
        {contact.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${TAG_COLORS[tag] || 'bg-purple-100 text-purple-700'
                  }`}
              >
                {tag === 'hot-lead' ? `🔥 ${tag}` : tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-1" /> Call
          </Button>

          <Button variant="outline" size="sm" className="flex-1" onClick={handleWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
          </Button>

          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-50 border-red-100">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {contact.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the contact and all their notes permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(contact);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}