/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseEnv) {
  console.warn('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Falling back to local data.');
}

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export type DonorInsert = {
  name: string;
  phone: string;
  blood_group: string;
  location: string;
  last_donation?: string | null;
  created_at?: string;
  is_approved?: boolean;
};

export async function insertDonor(data: DonorInsert) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    ...data,
    created_at: data.created_at ?? new Date().toISOString(),
  };

  const { error, data: inserted } = await supabase
    .from('donors')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return inserted;
}

export type SupabaseDonor = {
  id: string;
  name: string;
  phone: string;
  blood_group: string;
  location: string;
  last_donation: string | null;
  created_at: string;
  is_approved?: boolean;
};

export async function fetchApprovedDonors() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SupabaseDonor[];
}
