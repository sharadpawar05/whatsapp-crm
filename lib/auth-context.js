'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let mounted = true

		// Get initial session
		const getInitialSession = async () => {
			const { data: { session } } = await supabase.auth.getSession()

			if (mounted) {
				setUser(session?.user ?? null)
				setLoading(false)
			}
		}

		getInitialSession()

		// Listen for auth changes
		const { data: { subscription } } =
			supabase.auth.onAuthStateChange((_event, session) => {
				setUser(session?.user ?? null)
				setLoading(false) // 🔥 THIS WAS MISSING
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

export const useAuth = () => useContext(AuthContext)
