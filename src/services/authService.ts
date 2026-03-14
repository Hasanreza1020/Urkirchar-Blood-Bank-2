import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;

    if (!user) return null;

    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<User | null> {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .maybeSingle();

    if (existingUser) {
      throw new Error('User already exists');
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        name: userData.name,
        role: 'user',
      })
      .select()
      .single();

    if (error) throw error;

    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return updatedUser;
  } catch (error) {
    console.error('Update user error:', error);
    return null;
  }
}
