'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

// 1. Define what the Auth Context contains
interface AuthContextType {
    user: User | null;
    loading: boolean;
}

// 2. Initialize with the correct type
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (mounted) {
                    setUser(session?.user ?? null)
                }
            } catch (error) {
                console.error('Error getting session:', error)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        getInitialSession()

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            })

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. Add a safety check to the hook
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}