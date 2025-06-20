import bcrypt from 'bcryptjs';
import { supabase, User, CreateUserData, LoginUserData } from './supabase';

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

// Get user by id
export async function getUserById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as User;
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
  const { email, name, password } = userData;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Insert user
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        name,
        password: hashedPassword,
      }
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }

  return data as User;
}

// Verify user credentials
export async function verifyUser(credentials: LoginUserData): Promise<User | null> {
  const { email, password } = credentials;
  
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
}

// Export types for compatibility
export type { User, CreateUserData, LoginUserData }; 