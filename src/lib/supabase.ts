import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
} 