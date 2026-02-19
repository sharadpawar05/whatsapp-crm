import { supabase } from './supabase'

export const globalSearch = async (query, userId) => {
  if (!query || !userId) return { contacts: [], templates: [] }

  const [contacts, templates] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, name, phone')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(5),
    
    supabase
      .from('templates')
      .select('id, title, category')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%`)
      .limit(5)
  ])

  return {
    contacts: contacts.data || [],
    templates: templates.data || []
  }
}