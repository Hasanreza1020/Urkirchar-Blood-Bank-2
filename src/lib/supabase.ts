/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      donors: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          email: string;
          phone: string;
          blood_group: string;
          location: string;
          last_donation: string | null;
          available: boolean;
          verified: boolean;
          image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          email: string;
          phone: string;
          blood_group: string;
          location: string;
          last_donation?: string | null;
          available?: boolean;
          verified?: boolean;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          email?: string;
          phone?: string;
          blood_group?: string;
          location?: string;
          last_donation?: string | null;
          available?: boolean;
          verified?: boolean;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      donation_requests: {
        Row: {
          id: string;
          requester_name: string;
          requester_phone: string;
          blood_group: string;
          location: string;
          urgency: 'low' | 'medium' | 'high' | 'critical';
          units_needed: number;
          notes: string;
          status: 'pending' | 'fulfilled' | 'cancelled';
          created_at: string;
          fulfilled_at: string | null;
        };
        Insert: {
          id?: string;
          requester_name: string;
          requester_phone: string;
          blood_group: string;
          location: string;
          urgency?: 'low' | 'medium' | 'high' | 'critical';
          units_needed?: number;
          notes?: string;
          status?: 'pending' | 'fulfilled' | 'cancelled';
          created_at?: string;
          fulfilled_at?: string | null;
        };
        Update: {
          id?: string;
          requester_name?: string;
          requester_phone?: string;
          blood_group?: string;
          location?: string;
          urgency?: 'low' | 'medium' | 'high' | 'critical';
          units_needed?: number;
          notes?: string;
          status?: 'pending' | 'fulfilled' | 'cancelled';
          created_at?: string;
          fulfilled_at?: string | null;
        };
      };
    };
  };
};

export type User = Database['public']['Tables']['users']['Row'];
export type Donor = Database['public']['Tables']['donors']['Row'];
export type DonationRequest = Database['public']['Tables']['donation_requests']['Row'];
