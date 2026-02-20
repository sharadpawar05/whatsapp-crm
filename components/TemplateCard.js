'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Trash2, Check, MessageCircle } from 'lucide-react'

export default function TemplateCard({ template, onDelete }) {
    const [showCopiedAlert, setShowCopiedAlert] = useState(false)

    const copyToClipboard = () => {
        // --- THE FIX ---
        // This Regex looks for {anything} and replaces it with the text inside.
        // e.g. "Hi {Sharad Pawar}" becomes "Hi Sharad Pawar"
        const cleanContent = template.content.replace(/\{([^}]+)\}/g, '$1');
        
        navigator.clipboard.writeText(cleanContent)
        setShowCopiedAlert(true)
        setTimeout(() => setShowCopiedAlert(false), 2000)
    }

    return (
        <>
            {/* 1. THE ALERT: Modern Toast-style */}
            {showCopiedAlert && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-auto animate-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-900 shadow-2xl rounded-full px-6 py-2.5 flex items-center gap-3 border border-slate-800">
                        <div className="bg-green-500 rounded-full p-0.5">
                            <Check className="h-3 w-3 text-slate-900 stroke-[3px]" />
                        </div>
                        <span className="text-white text-sm font-bold whitespace-nowrap">
                            Ready to paste! 🚀
                        </span>
                    </div>
                </div>
            )}

            {/* 2. THE CARD */}
            <Card className="group hover:border-green-200 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <CardTitle className="text-sm font-bold truncate max-w-[120px]">
                            {template.title}
                        </CardTitle>
                    </div>
                    <span className="text-[10px] uppercase bg-green-50 px-2 py-0.5 rounded text-green-700 font-black tracking-wider">
                        {template.category}
                    </span>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-4">
                    {/* Visual Fix: Styled to look like a WhatsApp Bubble */}
                    <div className="relative bg-[#E7FFDB] p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border-l-2 border-green-400">
                        <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-4 font-medium italic">
                            {template.content}
                        </p>
                        {/* Little triangle for bubble effect */}
                        <div className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-[#E7FFDB] border-l-[8px] border-l-transparent"></div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`flex-1 h-9 text-xs font-bold rounded-lg transition-all ${
                                showCopiedAlert 
                                ? 'bg-green-600 text-white border-green-600' 
                                : 'hover:bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                            onClick={copyToClipboard}
                        >
                            {showCopiedAlert ? (
                                <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                            ) : (
                                <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Message</>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => onDelete(template.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}