'use client'

import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Users, Flame, Clock, MessageSquare } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-green-700">
          Dashboard
        </h1>
        <p className="text-slate-600 mt-2">
          Welcome back{user?.email ? `, ${user.email}` : ''}! Here's your overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Total Contacts</p>
            <h2 className="text-2xl font-bold mt-2">0</h2>
          </div>
          <Users className="text-green-600" />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Hot Leads</p>
            <h2 className="text-2xl font-bold mt-2">0</h2>
          </div>
          <Flame className="text-orange-500" />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Follow-ups Today</p>
            <h2 className="text-2xl font-bold mt-2">0</h2>
          </div>
          <Clock className="text-blue-500" />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm">Templates</p>
            <h2 className="text-2xl font-bold mt-2">0</h2>
          </div>
          <MessageSquare className="text-purple-500" />
        </Card>

      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition">
            ➕ Add Contact
          </button>

          <button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg transition">
            💬 New Template
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
            ⏰ Set Reminder
          </button>
        </div>
      </div>

    </div>
  )
}
