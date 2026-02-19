'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, MessageSquare, Users, Sparkles } from "lucide-react"

export default function WelcomeModal({ open, setOpen, onAddSample }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="text-green-600 w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl">Welcome to your CRM!</DialogTitle>
          <DialogDescription>
            Let's get your workspace ready in 30 seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-3 items-start p-3 rounded-lg border border-slate-100">
            <Users className="w-5 h-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm font-semibold">Step 1: Add Contacts</p>
              <p className="text-xs text-slate-500">Manual entry or bulk import via CSV.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start p-3 rounded-lg border border-slate-100">
            <MessageSquare className="w-5 h-5 text-purple-500 mt-1" />
            <div>
              <p className="text-sm font-semibold">Step 2: Save Templates</p>
              <p className="text-xs text-slate-500">Save your most-used WhatsApp messages.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => setOpen(false)} className="bg-green-600 hover:bg-green-700 w-full">
            I'm ready to start
          </Button>
          <Button variant="ghost" onClick={onAddSample} className="text-xs text-slate-400">
            Click here to add 3 sample contacts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}