'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import AddTemplateDialog from '@/components/AddTemplateDialog'
import TemplateCard from '@/components/TemplateCard'
import { MessageSquare, LayoutGrid, Filter, MessageSquarePlus } from 'lucide-react'
import { toast } from "sonner" // 👈 Added Sonner
import { Skeleton } from "@/components/ui/skeleton" // 👈 Added Skeleton
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchTemplates()
  }, [user])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (error) {
      toast.error("Failed to load templates", {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    // Note: In a production app, you might use a Radix/Shadcn UI Alert Dialong instead of confirm()
    // For now, we'll keep the logic but upgrade the feedback
    try {
      const { error } = await supabase.from('templates').delete().eq('id', id)
      if (error) throw error

      setTemplates(prev => prev.filter(t => t.id !== id))
      toast.success("Template deleted")
    } catch (error) {
      toast.error("Delete failed", {
        description: error.message
      })
    }
  }

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter(t => t.category === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="text-green-600" />
            Message Templates
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage reusable messages with {`{name}`} variables.
          </p>
        </div>

        <AddTemplateDialog onTemplateAdded={fetchTemplates} />
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="greeting">👋 Greetings</SelectItem>
            <SelectItem value="followup">📞 Follow-ups</SelectItem>
            <SelectItem value="closing">✅ Closings</SelectItem>
            <SelectItem value="other">📝 Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-xs text-slate-400 ml-auto">
          {!loading && `${filteredTemplates.length} templates found`}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-5 border rounded-xl bg-white space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center animate-in fade-in zoom-in">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No templates found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">
            {filter !== 'all'
              ? `You don't have any templates in the ${filter} category yet.`
              : "Start by creating your first template to save time on repetitive messages."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={() => handleDelete(template.id)}
            />
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && !loading && (
        <EmptyState
          illustration="✍️"
          title="Write your first template"
          description="Tired of typing the same message? Create templates with {name} variables to personalize your outreach in seconds."
          actionLabel="Create Template"
          onAction={() => setOpenTemplateDialog(true)}
        />
      )}
    </div>
  )
}