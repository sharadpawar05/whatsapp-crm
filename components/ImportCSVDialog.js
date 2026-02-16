'use client'
import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ImportCSVDialog({ onImportComplete }) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data } = results
        
        // Map the CSV headers to your database columns
        // Expecting CSV headers like "Name" and "Phone"
        const contactsToImport = data.map(row => ({
          user_id: user.id,
          name: row.Name || row.name || 'Unknown',
          phone: row.Phone || row.phone || '',
          tags: row.Tags ? row.Tags.split(',').map(t => t.trim()) : [],
        }))

        try {
          const { error } = await supabase.from('contacts').insert(contactsToImport)
          if (error) throw error
          
          alert(`Successfully imported ${contactsToImport.length} contacts!`)
          setOpen(false)
          onImportComplete?.()
        } catch (err) {
          alert("Import failed: " + err.message)
        } finally {
          setUploading(false)
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>
        <div className="p-6 border-2 border-dashed rounded-xl text-center space-y-4">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Upload your CSV file</p>
            <p className="text-xs text-slate-500">Ensure columns are named 'Name' and 'Phone'</p>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
            disabled={uploading}
          />
          <Button asChild disabled={uploading}>
            <label htmlFor="csv-upload" className="cursor-pointer">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {uploading ? 'Processing...' : 'Select File'}
            </label>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}