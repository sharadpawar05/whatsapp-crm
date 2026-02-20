'use client'

import React from 'react'
import Link from 'next/link'
import { 
  MessageCircle, 
  Users, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg shadow-lg shadow-green-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">LeadFlow</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-green-600 transition-colors">How it Works</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-bold">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-sm font-bold rounded-lg shadow-md shadow-green-100">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative pt-32 pb-24 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-black mb-8 border border-green-100 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" /> NOW IN PRIVATE BETA FOR 50 USERS
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 leading-[1.1]">
          Close more deals <br />on WhatsApp.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          LeadFlow is the simple CRM built for teams who live on WhatsApp. 
          Organize leads, automate follow-ups, and stop losing prospects in messy chats.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-700 h-14 px-8 text-lg font-bold rounded-xl shadow-xl shadow-green-200 gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Start Your 7-Day Trial <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Everything you need, <span className="text-green-600">nothing you don't.</span></h2>
            <p className="text-slate-500 font-medium">Built specifically for high-speed sales workflows.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-green-600" />}
              title="Smart Pipelines"
              desc="Tag leads as Hot, Warm, or Follow-up. Filter your view to focus on the deals that matter right now."
            />
            <FeatureCard 
              icon={<MessageCircle className="w-6 h-6 text-blue-600" />}
              title="One-Tap Messaging"
              desc="Open WhatsApp chats directly from your dashboard. Use saved templates to respond in seconds."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-orange-500" />}
              title="Smart Reminders"
              desc="Never miss a follow-up. LeadFlow alerts you exactly when it's time to reach back out to a prospect."
            />
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-20 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Three steps to better sales</h2>
            <p className="text-slate-500 font-medium text-lg">LeadFlow fits into your workflow, not the other way around.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             {/* Step 1 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-black text-2xl mb-6 border border-green-100 shadow-sm">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Import Leads</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Add leads manually or import your existing spreadsheet. Organize them by status instantly.</p>
             </div>

             {/* Step 2 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black text-2xl mb-6 border border-blue-100 shadow-sm">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">Set Reminders</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Schedule follow-ups with one click. LeadFlow keeps your daily 'To-Do' list ready every morning.</p>
             </div>

             {/* Step 3 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-black text-2xl mb-6 border border-orange-100 shadow-sm">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Close the Deal</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Launch WhatsApp chats from the app. Use personalized templates to keep communication professional.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Ready to clean up your <br />WhatsApp pipeline?</h2>
            <p className="text-slate-400 mb-10 text-lg max-w-xl mx-auto">
              Join the 50 early-access users transforming their sales process with LeadFlow.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              <span className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 text-green-400" /> No credit card required
              </span>
              <span className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <Smartphone className="w-4 h-4 text-green-400" /> Mobile & Desktop ready
              </span>
            </div>
            <Link href="/login">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-105">
                Join the Private Beta
              </Button>
            </Link>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 blur-[120px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 blur-[120px]" />
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 border-t border-slate-100 text-center bg-slate-50/50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">LeadFlow</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">© 2026 LeadFlow CRM. All rights reserved.</p>
      </footer>
    </div>
  )
}

// --- SUBCOMPONENTS ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 group">
      <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  )
}