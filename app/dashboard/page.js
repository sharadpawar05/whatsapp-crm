'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Flame, Clock, MessageSquare, AlertCircle, ArrowRight, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner" 
import { Skeleton } from "@/components/ui/skeleton"
import WelcomeModal from '@/components/WelcomeModal' // 👈 Create this file next

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

  useEffect(() => { if (user) fetchDashboardData() }, [user])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const now = new Date().toISOString()
      const todayStart = new Date().setHours(0, 0, 0, 0)
      const todayEnd = new Date().setHours(23, 59, 59, 999)

      const [contacts, hotLeads, todayReminders, overdue, templates, recent] = await Promise.all([
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).contains('tags', ['hot-lead']),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending').gte('reminder_date', new Date(todayStart).toISOString()).lte('reminder_date', new Date(todayEnd).toISOString()),
        supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'pending').lt('reminder_date', now),
        supabase.from('templates').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('contacts').select('id, name, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
      ])

      const totalContacts = contacts.count || 0;
      
      setStats({
        totalContacts,
        hotLeads: hotLeads.count || 0,
        followupsToday: todayReminders.count || 0,
        templates: templates.count || 0,
        overdueCount: overdue.count || 0,
        recentContacts: recent.data || []
      })

      // 🚀 FTUE Trigger: Show welcome if brand new
      if (totalContacts === 0 && !loading) {
        setShowWelcome(true)
      }

    } catch (error) { 
      console.error(error)
      toast.error("Failed to load dashboard data")
    } finally { setLoading(false) }
  }

  const addSampleData = async () => {
    const samples = [
      { name: "John Smith (Sample)", phone: "+1234567890", tags: ["hot-lead"], notes: "Interested in the Premium Plan." },
      { name: "Sarah Miller (Sample)", phone: "+1987654321", tags: ["warm-lead"], notes: "Follow up next Tuesday." }
    ]

    try {
      const { error } = await supabase.from('contacts').insert(
        samples.map(s => ({ ...s, user_id: user.id }))
      )
      if (error) throw error
      toast.success("Sample contacts added!")
      setShowWelcome(false)
      fetchDashboardData()
    } catch (e) {
      toast.error("Could not add sample data")
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-0">
      <WelcomeModal open={showWelcome} setOpen={setShowWelcome} onAddSample={addSampleData} />

      {/* 1. Overdue Alert Banner */}
      {!loading && stats.overdueCount > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription className="flex justify-between items-center text-sm md:text-base">
            You have {stats.overdueCount} overdue reminders.
            <Link href="/dashboard/reminders" className="font-bold underline flex items-center gap-1">
              View <ArrowRight className="w-4 h-4" />
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your pipeline and outreach.</p>
        </div>
        <Link href="/dashboard/contacts">
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">Add Contact</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Stats & Recent */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Contacts" value={stats.totalContacts} icon={<Users className="text-green-600" />} loading={loading} />
            <StatCard label="Hot Leads" value={stats.hotLeads} icon={<Flame className="text-orange-500" />} loading={loading} />
            <StatCard label="Today" value={stats.followupsToday} icon={<Clock className="text-blue-500" />} loading={loading} />
            <StatCard label="Templates" value={stats.templates} icon={<MessageSquare className="text-purple-500" />} loading={loading} />
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-1/2" /></div>)
              ) : stats.recentContacts.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl border-slate-100">
                  <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No recent contacts found.</p>
                </div>
              ) : (
                stats.recentContacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between border-b pb-3 last:border-0 border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">{c.name[0]}</div>
                      <div>
                        <p className="font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/contacts#contact-${c.id}`}><Button variant="ghost" size="sm">View</Button></Link>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Onboarding & Funnel */}
        <div className="space-y-6">
          <OnboardingChecklist stats={stats} />
          
          <Card className="p-6">
            <h2 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider">Conversion Funnel</h2>
            <div className="space-y-6">
              {stats.totalContacts === 0 && !loading ? (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 italic">Add contacts to see your funnel visualization.</p>
                </div>
              ) : (
                <>
                  <DistributionRow label="Hot Leads" count={stats.hotLeads} total={stats.totalContacts} color="bg-orange-500" />
                  <DistributionRow label="Total Database" count={stats.totalContacts} total={stats.totalContacts} color="bg-green-500" />
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OnboardingChecklist({ stats }) {
  const steps = [
    { label: "Add first contact", done: stats.totalContacts > 0 },
    { label: "Create a template", done: stats.templates > 0 },
    { label: "Check reminders", done: true }, // Simplified for UI
  ]
  const completed = steps.filter(s => s.done).length
  const progress = (completed / steps.length) * 100

  return (
    <Card className="p-6 bg-green-50/50 border-green-100">
      <h3 className="text-sm font-bold text-green-800 mb-1">Getting Started</h3>
      <p className="text-xs text-green-600 mb-4">{completed}/{steps.length} steps completed</p>
      <div className="w-full bg-green-200 h-1.5 rounded-full mb-4">
        <div className="bg-green-600 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            {s.done ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4 rounded-full border border-green-300" />}
            <span className={`text-xs ${s.done ? 'text-green-700 line-through opacity-50' : 'text-green-900 font-medium'}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function StatCard({ label, value, icon, loading }) {
  return (
    <Card className="p-4 flex justify-between items-center bg-white shadow-sm border-slate-100">
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-tight">{label}</p>
        {loading ? <Skeleton className="h-7 w-12 mt-1" /> : <h2 className="text-2xl font-bold text-slate-800">{value}</h2>}
      </div>
      <div className="bg-slate-50 p-2 rounded-lg">{icon}</div>
    </Card>
  )
}

function DistributionRow({ label, count, total, color }) {
  const percentage = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-500">{label}</span>
        <span>{count}</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full transition-all duration-700`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}