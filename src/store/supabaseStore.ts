import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n/translations';
import type { User as SupabaseUser, Donor as SupabaseDonor } from '../lib/supabase';
import { loginUser, registerUser } from '../services/authService';
import {
  fetchAllDonors,
  createDonor,
  updateDonor as updateDonorService,
  deleteDonor as deleteDonorService,
  toggleDonorVerification,
  toggleDonorAvailability,
  getDonorByUserId,
} from '../services/donorService';

export const LOCATIONS = [
  { en: 'Urkirchar Shanti Sangha', bn: 'উরকিরচর শান্তি সংঘ' },
  { en: 'Urkirchar Moromi Sangha', bn: 'উরকিরচর মরমী সংঘ' },
  { en: 'Urkirchar Agrani Sangha', bn: 'উরকিরচর অগ্রণী সংঘ' },
  { en: 'Urkirchar Agrani Sangha (Notun Mosjid)', bn: 'উরকিরচর অগ্রণী সংঘ (নতুন মসজিদ)' },
  { en: 'Urkirchar Jono Kollyan Chatra Sangha', bn: 'উরকিরচর জনকল্যাণ ছাত্র সংঘ' },
  { en: 'Urkirchar Mitali Sangha', bn: 'উরকিরচর মিতালী সংঘ' },
  { en: 'Urkirchar Somaj Kollyan Sangha', bn: 'উরকিরচর সমাজকল্যাণ সংঘ' },
  { en: 'Outside Urkirchar', bn: 'উরকিরচরের বাইরে' },
];

export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  phone: string;
  email: string;
  location: string;
  lastDonation: string;
  available: boolean;
  verified: boolean;
  image: string;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

function transformSupabaseDonor(d: SupabaseDonor): Donor {
  return {
    id: d.id,
    name: d.name,
    bloodGroup: d.blood_group,
    phone: d.phone,
    email: d.email,
    location: d.location,
    lastDonation: d.last_donation || 'N/A',
    available: d.available,
    verified: d.verified,
    image: d.image,
    createdAt: d.created_at.split('T')[0],
    userId: d.user_id || '',
  };
}

function transformSupabaseUser(u: SupabaseUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.created_at.split('T')[0],
  };
}

interface StoreState {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUserAndDonor: (userData: {
    name: string;
    email: string;
    password: string;
  }, donorData: {
    phone: string;
    bloodGroup: string;
    location: string;
    lastDonation: string;
    available: boolean;
    image: string;
  }) => Promise<User>;
  donors: Donor[];
  loadDonors: () => Promise<void>;
  addDonor: (donor: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    bloodGroup: string;
    location: string;
    lastDonation: string;
    available: boolean;
    image: string;
  }) => Promise<Donor>;
  updateDonor: (id: string, data: Partial<Donor>) => Promise<void>;
  deleteDonor: (id: string) => Promise<void>;
  toggleVerified: (id: string) => Promise<void>;
  toggleAvailable: (id: string) => Promise<void>;
  getDonorByUserId: (userId: string) => Donor | undefined;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      currentUser: null,

      login: async (email, password) => {
        try {
          const user = await loginUser(email, password);
          if (user) {
            set({ currentUser: transformSupabaseUser(user) });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: () => set({ currentUser: null }),

      registerUserAndDonor: async (userData, donorData) => {
        try {
          const user = await registerUser(userData);
          if (!user) throw new Error('Registration failed');

          const donor = await createDonor({
            user_id: user.id,
            name: userData.name,
            email: userData.email,
            phone: donorData.phone,
            blood_group: donorData.bloodGroup,
            location: donorData.location,
            last_donation: donorData.lastDonation || undefined,
            available: donorData.available,
            image: donorData.image,
          });

          if (!donor) throw new Error('Donor creation failed');

          const transformedUser = transformSupabaseUser(user);
          set({ currentUser: transformedUser });

          await get().loadDonors();

          return transformedUser;
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        }
      },

      donors: [],

      loadDonors: async () => {
        try {
          const donors = await fetchAllDonors();
          set({ donors: donors.map(transformSupabaseDonor) });
        } catch (error) {
          console.error('Load donors failed:', error);
        }
      },

      addDonor: async (donorData) => {
        try {
          const donor = await createDonor({
            user_id: donorData.userId,
            name: donorData.name,
            email: donorData.email,
            phone: donorData.phone,
            blood_group: donorData.bloodGroup,
            location: donorData.location,
            last_donation: donorData.lastDonation || undefined,
            available: donorData.available,
            image: donorData.image,
          });

          if (!donor) throw new Error('Failed to create donor');

          await get().loadDonors();
          return transformSupabaseDonor(donor);
        } catch (error) {
          console.error('Add donor failed:', error);
          throw error;
        }
      },

      updateDonor: async (id, data) => {
        try {
          const updateData: any = {};
          if (data.name) updateData.name = data.name;
          if (data.phone) updateData.phone = data.phone;
          if (data.location) updateData.location = data.location;
          if (data.lastDonation) updateData.last_donation = data.lastDonation;
          if (data.image !== undefined) updateData.image = data.image;
          if (data.available !== undefined) updateData.available = data.available;

          await updateDonorService(id, updateData);
          await get().loadDonors();
        } catch (error) {
          console.error('Update donor failed:', error);
          throw error;
        }
      },

      deleteDonor: async (id) => {
        try {
          await deleteDonorService(id);
          await get().loadDonors();
        } catch (error) {
          console.error('Delete donor failed:', error);
          throw error;
        }
      },

      toggleVerified: async (id) => {
        try {
          await toggleDonorVerification(id);
          await get().loadDonors();
        } catch (error) {
          console.error('Toggle verified failed:', error);
          throw error;
        }
      },

      toggleAvailable: async (id) => {
        try {
          await toggleDonorAvailability(id);
          await get().loadDonors();
        } catch (error) {
          console.error('Toggle available failed:', error);
          throw error;
        }
      },

      getDonorByUserId: (userId) => {
        return get().donors.find(d => d.userId === userId);
      },
    }),
    {
      name: 'urkirchar-blood-bank',
      partialize: (state) => ({
        language: state.language,
        currentUser: state.currentUser,
      }),
    }
  )
);
