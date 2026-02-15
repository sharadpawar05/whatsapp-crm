'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Calendar as CalendarIcon } from 'lucide-react'

export default function SetReminderDialog({ contact, open, onClose, onSuccess }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('You must be logged in to set reminders.')
      return
    }

    setLoading(true)

    try {
      // Combine date and time into a single ISO string
      const reminderDateTime = new Date(`${date}T${time}:00`)

      // 1. Insert into reminders table
      const { error: reminderError } = await supabase
        .from('reminders')
        .insert([
          {
            user_id: user.id,
            contact_id: contact.id,
            reminder_date: reminderDateTime.toISOString(),
            status: 'pending' // Good practice to have a status
          },
        ])

      if (reminderError) throw reminderError

      // 2. Update next_followup in contacts table
      const { error: contactError } = await supabase
        .from('contacts')
        .update({ 
          next_followup: reminderDateTime.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contact.id)

      if (contactError) throw contactError

      onSuccess?.()
      onClose()
      alert(`Reminder set for ${contact.name} on ${date} at ${time}!`)
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Get today's date to prevent picking past dates
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Set Follow-up Reminder
          </DialogTitle>
          <DialogDescription>
            Schedule a time to follow up with <strong>{contact?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium leading-none">Date *</label>
            <Input
              id="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium leading-none">Date *</label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <CalendarIcon className="w-3 h-3 mt-0.5" />
              <span>
                You'll receive a reminder notification on 
                <strong> {date || '[date]'}</strong> at <strong>{time}</strong>.
              </span>
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !date}
            >
              {loading ? 'Setting...' : 'Set Reminder'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}