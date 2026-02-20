'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Flame, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  UserPlus, 
  TrendingUp, 
  CheckCircle2,
  CalendarDays,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner" 
import { Skeleton } from "@/components/ui/skeleton"
import WelcomeModal from '@/components/WelcomeModal'

export default function DashboardPage() {
  const { user } = useAuth()
  const [showWelcome, setShowWelcome] = useState(false)
  const [stats, setStats] = useState({
    totalContacts: 0,
    hotLeads: 0,
    followupsToday: 0,
    templates: 0,
    overdueCount: 0,
    recentContacts: []
  })
  const [loading, setLoading] = useState(true)

  // Extract user's name or use email as fallback
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  useEffect(() => { if (user) fetchDashboardData() }, [user])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const now = new Date().toISOString()
      const today = new Date()
      const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString()

      const [contacts, hotLeads, todayReminders, overdue, templates, recent] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).contains('tags', ['hot-lead']),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending').gte('reminder_date', todayStart).lte('reminder_date', todayEnd),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending').lt('reminder_date', now),
        supabase.from('templates').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('id, name, created_at, phone').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ])

      setStats({
        totalContacts: contacts.count || 0,
        hotLeads: hotLeads.count || 0,
        followupsToday: todayReminders.count || 0,
        templates: templates.count || 0,
        overdueCount: overdue.count || 0,
        recentContacts: recent.data || []
      })

      if (contacts.count === 0 && !loading) setShowWelcome(true)

    } catch (error) { 
      toast.error("Failed to load dashboard")
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 pb-12">
      <WelcomeModal open={showWelcome} setOpen={setShowWelcome} onAddSample={fetchDashboardData} />

      {/* 1. URGENT NOTIFICATIONS */}
      {!loading && stats.overdueCount > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 shadow-sm">
          <AlertCircle className="h-4 w-4" />
          <div className="flex w-full items-center justify-between ml-2">
            <AlertDescription className="text-xs font-medium">
              You have {stats.overdueCount} overdue follow-ups.
            </AlertDescription>
            <Link href="/dashboard/reminders">
              <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-red-700 hover:bg-red-100 p-2">Fix Now</Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* 2. PERSONALIZED HEADER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
             Hello, <span className="text-green-600 capitalize">{displayName}</span>!
           </h1>
           <Sparkles className="w-5 h-5 text-yellow-500 hidden md:block" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Here's what is happening with your leads today.</p>
      </div>

      {/* 3. KEY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Leads" value={stats.totalContacts} icon={<Users className="w-4 h-4 text-green-600" />} />
        <StatCard label="Hot" value={stats.hotLeads} icon={<Flame className="w-4 h-4 text-orange-500" />} />
        <StatCard label="Due" value={stats.followupsToday} icon={<CalendarDays className="w-4 h-4 text-blue-500" />} />
        <StatCard label="Drafts" value={stats.templates} icon={<MessageSquare className="w-4 h-4 text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200 overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Recent Activity
              </h2>
              <Link href="/dashboard/contacts">
                <Button variant="ghost" className="text-xs font-bold text-green-600 h-8 px-2">View All</Button>
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="p-4 flex gap-4"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-3 w-3/4 mt-2" /></div>)
              ) : stats.recentContacts.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs">No contacts yet.</div>
              ) : (
                stats.recentContacts.map(c => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold group-hover:bg-green-100 group-hover:text-green-700">
                        {c.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{c.phone}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* COMPACT SIDEBAR */}
        <div className="space-y-4">
          <OnboardingChecklist stats={stats} />
          
          <Card className="p-5 shadow-sm border-slate-200 bg-white">
            <h2 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Growth Funnel
            </h2>
            <div className="space-y-4">
              <DistributionRow label="Hot leads" count={stats.hotLeads} total={stats.totalContacts} color="bg-orange-500" />
              <DistributionRow label="Total" count={stats.totalContacts} total={stats.totalContacts} color="bg-green-600" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="p-4 bg-white shadow-sm border-slate-200 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <h2 className="text-xl font-black text-slate-900">{value}</h2>
    </Card>
  )
}

function OnboardingChecklist({ stats }) {
  const steps = [
    { label: "Add leads", done: stats.totalContacts > 0 },
    { label: "Templates", done: stats.templates > 0 },
    { label: "Tasks", done: stats.totalContacts > 0 && stats.overdueCount === 0 },
  ]
  const completed = steps.filter(s => s.done).length
  const progress = (completed / steps.length) * 100

  return (
    <Card className="p-5 bg-slate-900 text-white border-none shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold tracking-tight">Setup Guide</h3>
        <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
          {completed}/{steps.length}
        </span>
      </div>
      
      <div className="w-full bg-slate-800 h-1 rounded-full mb-4">
        <div className="bg-green-400 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 className={`w-3.5 h-3.5 ${s.done ? 'text-green-400' : 'text-slate-600'}`} />
            <span className={`text-[11px] font-medium ${s.done ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function DistributionRow({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-slate-500 uppercase">{label}</span>
        <span className="text-slate-900">{count}</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}