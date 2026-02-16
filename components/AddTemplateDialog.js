'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Code } from 'lucide-react'

const CATEGORIES = [
    { value: 'greeting', label: '👋 Greeting' },
    { value: 'followup', label: '📞 Follow-up' },
    { value: 'closing', label: '✅ Closing' },
    { value: 'other', label: '📝 Other' },
]

export default function AddTemplateDialog({ onTemplateAdded }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'other',
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        try {
            const { error } = await supabase.from('templates').insert([
                {
                    user_id: user.id,
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                },
            ])

            if (error) throw error

            setFormData({ title: '', content: '', category: 'other' })
            setOpen(false)
            onTemplateAdded?.()
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const insertVariable = (variable) => {
        const textarea = document.getElementById('template-content')
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = formData.content
        const before = text.substring(0, start)
        const after = text.substring(end)

        setFormData({ ...formData, content: before + variable + after })

        // Restore focus and move cursor after the variable
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + variable.length, start + variable.length)
        }, 0)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Template
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Message Template</DialogTitle>
                    <DialogDescription>
                        Create reusable messages with variables. Use the buttons below to insert placeholders.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium leading-none">Template Title</label>
                        <Input
                            id="title"
                            placeholder="e.g. First Greeting"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium leading-none">Category</label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <div className="flex justify-between items-center">

                            <label htmlFor="title" className="text-sm font-medium leading-none">Message Content</label>
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xs"
                                    className="h-7 text-[10px] px-2"
                                    onClick={() => insertVariable('{name}')}
                                >
                                    + Name
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xs"
                                    className="h-7 text-[10px] px-2"
                                    onClick={() => insertVariable('{phone}')}
                                >
                                    + Phone
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            id="template-content"
                            placeholder="Hi {name}, I'm following up regarding..."
                            className="min-h-[120px] font-sans"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Template'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}