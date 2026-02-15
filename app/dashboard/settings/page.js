export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Settings
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        
        <div>
          <h2 className="font-semibold text-lg mb-2">
            Profile Settings
          </h2>
          <p className="text-slate-600">
            Update your account details and preferences.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">
            WhatsApp Integration
          </h2>
          <p className="text-slate-600">
            Connect your WhatsApp Business API here.
          </p>
        </div>

      </div>
    </div>
  )
}
