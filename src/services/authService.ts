import { supabase } from '../lib/supabase';

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<{ id: string; email: string; name: string } | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name,
        },
      },
    });

    if (authError) throw authError;

    if (!authData.user?.id) {
      throw new Error('Auth user creation failed - no user ID returned');
    }

    return {
      id: authData.user.id,
      email: authData.user.email || userData.email,
      name: userData.name,
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.message?.includes('already registered')) {
      throw new Error('Email already registered');
    }
    throw error;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ id: string; email: string; name: string } | null> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) return null;

    return {
      id: authData.user.id,
      email: authData.user.email || email,
      name: authData.user.user_metadata?.full_name || email,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? { id: user.id, email: user.email || '' } : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
