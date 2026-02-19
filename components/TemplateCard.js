'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Trash2, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createPortal } from 'react-dom' // We use portal to show alert over everything

export default function TemplateCard({ template, onDelete }) {
    const [showCopiedAlert, setShowCopiedAlert] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(template.content)
        setShowCopiedAlert(true)
        setTimeout(() => setShowCopiedAlert(false), 2000)
    }

    return (
        <>
            {/* 1. THE ALERT: Fixed at top of screen */}
            {showCopiedAlert && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-auto animate-in fade-in zoom-in duration-300">
                    <div className="bg-slate-900 shadow-2xl rounded-full px-6 py-2.5 flex items-center gap-3 border border-slate-800">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-white text-sm font-semibold whitespace-nowrap">
                            Copied to clipboard!
                        </span>
                    </div>
                </div>
            )}

            {/* 2. THE CARD */}
            <Card className="hover:shadow-md transition-shadow relative">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-bold truncate pr-4">
                        {template.title}
                    </CardTitle>
                    <span className="text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                        {template.category}
                    </span>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-3 font-mono bg-slate-50 p-2 rounded border border-dashed">
                        {template.content}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant={showCopiedAlert ? "default" : "outline"}
                            size="sm"
                            className={`flex-1 h-8 text-xs transition-colors ${showCopiedAlert ? 'bg-green-600 hover:bg-green-600' : ''}`}
                            onClick={copyToClipboard}
                        >
                            {showCopiedAlert ? (
                                <><Check className="w-3 h-3 mr-1" /> Copied!</>
                            ) : (
                                <><Copy className="w-3 h-3 mr-1" /> Copy</>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => onDelete(template.id)}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}