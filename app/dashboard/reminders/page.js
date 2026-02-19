'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, User, Calendar, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from "sonner" // 👈 Professional notifications
import { Skeleton } from "@/components/ui/skeleton" // 👈 Pulse loading

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          contacts (name, phone)
        `)
        .eq('status', 'pending')
        .order('reminder_date', { ascending: true })

      if (error) throw error
      setReminders(data || [])
    } catch (error) {
      toast.error("Failed to load reminders", {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsComplete = async (id) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ status: 'completed' })
        .eq('id', id)

      if (error) throw error

      toast.success("Reminder completed!", {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />
      })

      // Local update for instant UI feedback before re-fetching
      setReminders(prev => prev.filter(r => r.id !== id))
    } catch (error) {
      toast.error("Action failed", {
        description: "Could not mark as done. Please check your permissions."
      })
    }
  }

  // Helper for formatted date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date().toLocaleDateString()
    const reminderDate = date.toLocaleDateString()

    if (today === reminderDate) return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="text-blue-600" /> Upcoming Reminders
        </h1>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {reminders.length} Pending
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-100 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl bg-slate-50">
          <Clock className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600">All caught up!</h3>
          <p className="text-slate-400 text-sm">No pending follow-ups at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{reminder.contacts?.name || 'Unknown Contact'}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(reminder.reminder_date)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsComplete(reminder.id)}
                  className="w-full sm:w-auto text-green-600 hover:bg-green-50 border-green-200 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark as Done
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


    </div>
  )
}