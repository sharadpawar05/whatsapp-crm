'use client'

import { Phone, MessageCircle, Copy, Trash2 } from 'lucide-react'
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

export default function ContactCard({ contact, onDelete }) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`
  }

  const handleWhatsApp = () => {
    const phone = contact.phone.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.phone)
  }

  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">{contact.phone}</p>
        </div>

        {contact.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {contact.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 text-xs rounded-full ${
                  TAG_COLORS[tag] || 'bg-gray-100'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-1" /> Call
          </Button>

          <Button variant="outline" size="sm" onClick={handleWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
          </Button>

          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {contact.name}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(contact)}
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
