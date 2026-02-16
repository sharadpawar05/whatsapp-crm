'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Flame, Clock, MessageSquare, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalContacts: 0,
    hotLeads: 0,
    followupsToday: 0,
    templates: 0,
    overdueCount: 0,
    recentContacts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (user) fetchDashboardData() }, [user])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const now = new Date().toISOString()
      const todayStart = new Date().setHours(0,0,0,0)
      const todayEnd = new Date().setHours(23,59,59,999)

      // Parallel data fetching for speed
      const [contacts, hotLeads, todayReminders, overdue, templates, recent] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).contains('tags', ['hot-lead']),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', false).gte('reminder_date', new Date(todayStart).toISOString()).lte('reminder_date', new Date(todayEnd).toISOString()),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', false).lt('reminder_date', now),
        supabase.from('templates').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('id, name, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ])

      setStats({
        totalContacts: contacts.count || 0,
        hotLeads: hotLeads.count || 0,
        followupsToday: todayReminders.count || 0,
        templates: templates.count || 0,
        overdueCount: overdue.count || 0,
        recentContacts: recent.data || []
      })
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      {/* 1. Overdue Alert Banner */}
      {stats.overdueCount > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            You have {stats.overdueCount} overdue reminders that need attention.
            <Link href="/dashboard/reminders" className="font-bold underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your real-time performance.</p>
        </div>
      </div>

      {/* 2. Stats Cards (As built before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Contacts" value={stats.totalContacts} icon={<Users className="text-green-600" />} loading={loading} />
        <StatCard label="Hot Leads" value={stats.hotLeads} icon={<Flame className="text-orange-500" />} loading={loading} />
        <StatCard label="Follow-ups Today" value={stats.followupsToday} icon={<Clock className="text-blue-500" />} loading={loading} />
        <StatCard label="Templates" value={stats.templates} icon={<MessageSquare className="text-purple-500" />} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Recent Activity Feed */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Contacts Added</h2>
          <div className="space-y-4">
            {stats.recentContacts.length === 0 ? (
              <p className="text-slate-400 italic text-sm">No contacts added yet.</p>
            ) : (
              stats.recentContacts.map(c => (
                <div key={c.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/contacts">
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* 4. Lead Distribution (Visual Placeholder) */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lead Status</h2>
          <div className="space-y-4 pt-4">
            <DistributionRow label="Hot Leads" count={stats.hotLeads} total={stats.totalContacts} color="bg-orange-500" />
            <DistributionRow label="Total Database" count={stats.totalContacts} total={stats.totalContacts} color="bg-green-500" />
            <p className="text-[11px] text-slate-400 mt-6 italic text-center">
              Target: Convert 20% of database to Hot Leads
            </p>
          </div>
        </Card>
      </div>

      {/* 5. Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/contacts"><button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition shadow-sm">➕ Add Contact</button></Link>
          <Link href="/dashboard/templates"><button className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg transition shadow-sm">💬 New Template</button></Link>
          <Link href="/dashboard/reminders"><button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-sm">⏰ View Reminders</button></Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, loading }) {
  return (
    <Card className="p-6 flex justify-between items-center bg-white shadow-sm border-slate-100">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300 mt-2" /> : <h2 className="text-3xl font-bold mt-2 text-slate-800">{value}</h2>}
      </div>
      <div className="bg-slate-50 p-3 rounded-full">{icon}</div>
    </Card>
  )
}

function DistributionRow({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold">{count}</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}