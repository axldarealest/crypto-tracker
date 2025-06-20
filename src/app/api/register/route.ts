import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/database';
import { isValidEmail, isValidPassword } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, confirmPassword } = body;

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({
      email: email.toLowerCase(),
      name: name.trim(),
      password
    });

    // Return success (without password)
    return NextResponse.json({
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
} 