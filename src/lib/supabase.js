import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://ygzhejflwworgdneukkz.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_O31o2KwfIw75_Ac1MG-eFg_J63GV2Th'

export const supabase = createClient(url, key)

export const isConfigured = Boolean(url && key)
