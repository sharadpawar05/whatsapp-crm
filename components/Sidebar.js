'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Zap // Added for the LeadFlow logo feel
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Reminders', href: '/dashboard/reminders', icon: Bell },
  { name: 'Templates', href: '/dashboard/templates', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 
        bg-[#0f172a] text-slate-300
        border-r border-slate-800/50
        p-6 flex flex-col justify-between
        transform transition-transform duration-300 z-40
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Section */}
        <div>
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-green-600 p-2 rounded-lg shadow-lg shadow-green-900/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              LeadFlow
            </h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${
                    isActive
                      ? 'bg-green-600/10 text-green-500 border border-green-600/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 pt-6">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md lg:hidden z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}