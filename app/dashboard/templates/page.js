export default function TemplatesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Message Templates
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p className="text-slate-600">
          Create and manage reusable WhatsApp templates.
        </p>

        <div className="mt-6 border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-400">
          No templates created.
        </div>
      </div>
    </div>
  )
}
