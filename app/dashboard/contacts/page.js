'use client'

import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { toast } from "sonner"
import { 
  Download, 
  Users, 
  MessageCircle, 
  Search, 
  Filter, 
  Phone, 
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import AddContactDialog from '@/components/AddContactDialog'
import ContactDetailDialog from '@/components/ContactDetailDialog'
import ImportCSVDialog from '@/components/ImportCSVDialog'
import ContactsSkeleton from "@/components/ContactsSkeleton"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export default function ContactsPage() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 

  useEffect(() => {
    if (user) fetchContacts()
  }, [user])

  // Reset to page 1 when searching or filtering
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedTag])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContacts(data || [])
      setAvailableTags(Array.from(new Set((data || []).flatMap(c => c.tags || []))).sort())
    } catch (error) {
      toast.error("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, contact) => {
    e.stopPropagation()
    if (!confirm(`Delete ${contact.name}?`)) return
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', contact.id)
      if (error) throw error
      setContacts(prev => prev.filter(c => c.id !== contact.id))
      toast.success("Contact removed")
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  const handleExport = () => {
    try {
      const exportData = filteredContacts.map(c => ({
        Name: c.name,
        Phone: c.phone,
        Tags: c.tags?.join(', ') || '',
        Notes: c.notes || '',
        Date: new Date(c.created_at).toLocaleDateString()
      }))
      const csv = Papa.unparse(exportData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `contacts_export.csv`
      link.click()
    } catch (err) {
      toast.error("Export failed")
    }
  }

  // --- Filter Logic ---
  const filteredContacts = contacts.filter((contact) => {
    const searchTerm = search.toLowerCase().trim();
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm) || contact.phone?.includes(searchTerm);
    const matchesTag = selectedTag === 'all' || (contact.tags && contact.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  })

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="flex flex-col h-full space-y-4 pb-10">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <Users className="text-green-600 w-6 h-6" /> 
            Contacts
            <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600 font-medium">
              {filteredContacts.length} Total
            </Badge>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} size="sm" className="hidden sm:flex gap-2 h-9">
            <Download className="w-4 h-4" /> Export
          </Button>
          <ImportCSVDialog onImportComplete={fetchContacts} />
          <AddContactDialog onContactAdded={fetchContacts} />
        </div>
      </div>

      {/* 2. FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white h-10 border-slate-200"
          />
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full md:w-[220px] bg-white h-10 border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <SelectValue placeholder="All Tags" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {availableTags.map((tag) => (
              <SelectItem key={tag} value={tag} className="capitalize">{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. TABLE AREA */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <ContactsSkeleton /> 
          ) : filteredContacts.length === 0 ? (
            <div className="py-24 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No contacts found</p>
              <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Recent Notes</th>
                  <th className="px-6 py-4 hidden md:table-cell">Tags</th>
                  <th className="px-6 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="group hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                          {contact.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{contact.name}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {contact.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell max-w-[200px]">
                      <p className="text-xs text-slate-400 truncate italic">
                        {contact.notes || "No notes yet..."}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {contact.tags?.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-none px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <a 
                          href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-slate-400 hover:text-red-600"
                            onClick={(e) => handleDelete(e, contact)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-slate-400"
                            onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 4. PAGINATION FOOTER */}
        {!loading && filteredContacts.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white gap-4">
            <p className="text-xs text-slate-500 order-2 sm:order-1">
              Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(startIndex + itemsPerPage, filteredContacts.length)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{filteredContacts.length}</span> contacts
            </p>
            
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs gap-1" 
                onClick={() => setCurrentPage(prev => prev - 1)} 
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </Button>
              
              <div className="flex items-center justify-center min-w-[70px] text-xs font-semibold text-slate-600">
                {currentPage} / {totalPages}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs gap-1" 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="w-3 h-3" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2" 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 5. DIALOGS */}
      <ContactDetailDialog
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdate={fetchContacts}
      />
    </div>
  )
}