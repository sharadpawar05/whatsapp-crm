'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, User, Calendar, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select(`
          *,
          contacts (name, phone)
        `)
        .eq('status', 'pending')
        .order('reminder_date', { ascending: true })

      if (error) throw error
      setReminders(data)
    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsComplete = async (id) => {
    const { error } = await supabase
      .from('reminders')
      .update({ status: 'completed' })
      .eq('id', id)
    
    if (!error) fetchReminders()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="text-blue-600" /> Upcoming Reminders
      </h1>

      {loading ? (
        <p>Loading follow-ups...</p>
      ) : reminders.length === 0 ? (
        <p className="text-muted-foreground">No pending reminders found.</p>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{reminder.contacts?.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(reminder.reminder_date).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => markAsComplete(reminder.id)}
                  className="text-green-600 hover:bg-green-50 border-green-200"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Done
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}