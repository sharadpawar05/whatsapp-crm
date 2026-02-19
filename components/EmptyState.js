import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  illustration // Optional: for custom SVG or Emoji
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-300">
      <div className="relative mb-6">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-green-100 blur-3xl opacity-30 rounded-full" />
        
        <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          {Icon && <Icon className="w-12 h-12 text-green-600" />}
          {illustration && <span className="text-5xl">{illustration}</span>}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-8 text-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        <Button onClick={onAction} className="bg-green-600 hover:bg-green-700 gap-2">
          <Plus className="w-4 h-4" /> {actionLabel}
        </Button>
      )}
    </div>
  )
}