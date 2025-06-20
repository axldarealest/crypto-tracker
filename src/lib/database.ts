import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

// Create database file in project root
const dbPath = path.join(process.cwd(), 'users.db');
const db = new Database(dbPath);

// Initialize users table
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createUsersTable);

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

// Get user by email
export function getUserByEmail(email: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | null;
}

// Get user by id
export function getUserById(id: number): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | null;
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
  const { email, name, password } = userData;
  
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Insert user
  const stmt = db.prepare('INSERT INTO users (email, name, password) VALUES (?, ?, ?)');
  const result = stmt.run(email, name, hashedPassword);

  // Return created user (without password)
  const newUser = getUserById(result.lastInsertRowid as number);
  if (!newUser) {
    throw new Error('Erreur lors de la création de l\'utilisateur');
  }

  return newUser;
}

// Verify user credentials
export async function verifyUser(credentials: LoginUserData): Promise<User | null> {
  const { email, password } = credentials;
  
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
}

// Close database connection
export function closeDatabase() {
  db.close();
}

export default db; 