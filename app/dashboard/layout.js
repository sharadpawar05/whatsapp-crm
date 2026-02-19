// app/dashboard/layout.js
import Sidebar from '@/components/Sidebar'
// import GlobalSearch from '@/components/GlobalSearch'
import UserNav from '@/components/UserNav'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* --- THE TOPBAR --- */}
        {/* <header className="h-16 border-b bg-white flex items-center justify-between px-8 shrink-0"> */}
          {/* <div className="flex-1 max-w-md">
            <GlobalSearch />
          </div> */}

          {/* <div className="ml-4 flex items-center gap-4">
            <UserNav />
          </div> */}
        {/* </header> */}

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  )
}