'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import AddContactDialog from '@/components/AddContactDialog'
import ContactCard from '@/components/ContactCard'
import ContactDetailDialog from '@/components/ContactDetailDialog'
import ImportCSVDialog from '@/components/ImportCSVDialog'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ContactsPage() {
  const { user } = useAuth()

  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null) // 👈 Added

  useEffect(() => {
    if (user) fetchContacts()
  }, [user])

  const handleExport = () => {
    const exportData = filteredContacts.map(c => ({
      Name: c.name,
      Phone: c.phone,
      Tags: c.tags?.join(', ') || '',
      Notes: c.notes?.replace(/---/g, '') || '',
      Date_Added: new Date(c.created_at).toLocaleDateString()
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `crm_contacts_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching:", error)
      return
    }

    const updatedData = data || []
    setContacts(updatedData)

    // ✨ THE FIX: Update the selected contact so the modal refreshes immediately
    if (selectedContact) {
      const freshContactData = updatedData.find(c => c.id === selectedContact.id)
      if (freshContactData) {
        setSelectedContact(freshContactData)
      }
    }

    setLoading(false)
  }

  const handleDelete = async (contact) => {
    await supabase.from('contacts').delete().eq('id', contact.id)
    fetchContacts()
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone?.includes(search)

    const matchesTag =
      selectedTag === 'all' ||
      (contact.tags && contact.tags.includes(selectedTag))

    return matchesSearch && matchesTag
  })

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <AddContactDialog onContactAdded={fetchContacts} />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={selectedTag}
          onValueChange={(value) => setSelectedTag(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="hot-lead">Hot Lead</SelectItem>
            <SelectItem value="warm-lead">Warm Lead</SelectItem>
            <SelectItem value="cold-lead">Cold Lead</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Grid */}
      {filteredContacts.length === 0 ? (
        <p className="text-muted-foreground">No contacts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={handleDelete}
              onClick={() => setSelectedContact(contact)} // 👈 Added
            />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <ImportCSVDialog onImportComplete={fetchContacts} />
        </div>
      </div>

      {/* Detail Dialog */}
      <ContactDetailDialog
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdate={fetchContacts}
      />
    </div>
  )
}
