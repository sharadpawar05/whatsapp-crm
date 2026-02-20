import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- CHANGE THIS SECTION ---
export const metadata: Metadata = {
  title: 'LeadFlow', // This updates the browser tab
  description: 'The simple CRM to track leads, schedule follow-ups, and close deals on WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-slate-900`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors closeButton /> 
        </AuthProvider>
      </body>
    </html>
  );
}