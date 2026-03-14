import { supabase } from '../lib/supabase';
import type { Donor } from '../lib/supabase';

export async function fetchAllDonors(): Promise<Donor[]> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Fetch donors error:', error);
    return [];
  }
}

export async function fetchVerifiedDonors(): Promise<Donor[]> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Fetch verified donors error:', error);
    return [];
  }
}

export async function getDonorByUserId(userId: string): Promise<Donor | null> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get donor by user ID error:', error);
    return null;
  }
}

export async function getDonorById(donorId: string): Promise<Donor | null> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', donorId)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get donor by ID error:', error);
    return null;
  }
}

export async function createDonor(donorData: {
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  blood_group: string;
  location: string;
  last_donation?: string;
  available?: boolean;
  image?: string;
}): Promise<Donor | null> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .insert({
        ...donorData,
        verified: false,
        available: donorData.available ?? true,
        image: donorData.image || '',
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Create donor error:', error);
    throw error;
  }
}

export async function updateDonor(
  donorId: string,
  updates: Partial<Donor>
): Promise<Donor | null> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Update donor error:', error);
    throw error;
  }
}

export async function deleteDonor(donorId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('donors')
      .delete()
      .eq('id', donorId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Delete donor error:', error);
    return false;
  }
}

export async function toggleDonorVerification(donorId: string): Promise<boolean> {
  try {
    const donor = await getDonorById(donorId);
    if (!donor) return false;

    const { error } = await supabase
      .from('donors')
      .update({ verified: !donor.verified })
      .eq('id', donorId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Toggle verification error:', error);
    return false;
  }
}

export async function toggleDonorAvailability(donorId: string): Promise<boolean> {
  try {
    const donor = await getDonorById(donorId);
    if (!donor) return false;

    const { error } = await supabase
      .from('donors')
      .update({ available: !donor.available })
      .eq('id', donorId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Toggle availability error:', error);
    return false;
  }
}

export async function searchDonors(filters: {
  bloodGroup?: string;
  location?: string;
  availableOnly?: boolean;
}): Promise<Donor[]> {
  try {
    let query = supabase
      .from('donors')
      .select('*')
      .eq('verified', true);

    if (filters.bloodGroup) {
      query = query.eq('blood_group', filters.bloodGroup);
    }

    if (filters.location) {
      query = query.eq('location', filters.location);
    }

    if (filters.availableOnly) {
      query = query.eq('available', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Search donors error:', error);
    return [];
  }
}
