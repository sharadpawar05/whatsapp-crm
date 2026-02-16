// components/TemplateCard.js
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Trash2, MessageSquare } from 'lucide-react'

export default function TemplateCard({ template, onDelete }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(template.content)
    alert('Template copied to clipboard!')
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
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
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={copyToClipboard}>
            <Copy className="w-3 h-3 mr-1" /> Copy
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => onDelete(template.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}