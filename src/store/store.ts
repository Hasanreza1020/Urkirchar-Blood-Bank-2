import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../i18n/translations';

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
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
}

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

const seedDonors: Donor[] = [
  { id: '1', name: 'Rafiq Ahmed', bloodGroup: 'A+', phone: '+8801712345678', email: 'rafiq@example.com', location: 'Urkirchar Shanti Sangha', lastDonation: '2024-08-15', available: true, verified: true, image: '', createdAt: '2024-11-15', userId: 'u1' },
  { id: '2', name: 'Fatema Begum', bloodGroup: 'B+', phone: '+8801812345678', email: 'fatema@example.com', location: 'Urkirchar Moromi Sangha', lastDonation: '2024-07-20', available: true, verified: true, image: '', createdAt: '2024-11-10', userId: 'u2' },
  { id: '3', name: 'Kamal Hossain', bloodGroup: 'O+', phone: '+8801912345678', email: 'kamal@example.com', location: 'Urkirchar Agrani Sangha', lastDonation: '2024-06-10', available: false, verified: true, image: '', createdAt: '2024-11-08', userId: 'u3' },
  { id: '4', name: 'Nasrin Akter', bloodGroup: 'AB+', phone: '+8801612345678', email: 'nasrin@example.com', location: 'Urkirchar Jono Kollyan Chatra Sangha', lastDonation: '2024-09-01', available: true, verified: true, image: '', createdAt: '2024-11-05', userId: 'u4' },
  { id: '5', name: 'Shahidul Islam', bloodGroup: 'A-', phone: '+8801512345678', email: 'shahidul@example.com', location: 'Urkirchar Shanti Sangha', lastDonation: '2024-05-25', available: true, verified: false, image: '', createdAt: '2024-10-28', userId: 'u5' },
  { id: '6', name: 'Rina Akter', bloodGroup: 'O-', phone: '+8801312345678', email: 'rina@example.com', location: 'Urkirchar Mitali Sangha', lastDonation: '2024-04-12', available: true, verified: true, image: '', createdAt: '2024-10-20', userId: 'u6' },
  { id: '7', name: 'Md. Hanif', bloodGroup: 'B-', phone: '+8801412345678', email: 'hanif@example.com', location: 'Urkirchar Moromi Sangha', lastDonation: '2024-03-18', available: false, verified: true, image: '', createdAt: '2024-10-15', userId: 'u7' },
  { id: '8', name: 'Sumaiya Khan', bloodGroup: 'AB-', phone: '+8801712345999', email: 'sumaiya@example.com', location: 'Urkirchar Somaj Kollyan Sangha', lastDonation: '2024-09-10', available: true, verified: true, image: '', createdAt: '2024-10-10', userId: 'u8' },
  { id: '9', name: 'Abdul Karim', bloodGroup: 'A+', phone: '+8801812345999', email: 'karim@example.com', location: 'Urkirchar Agrani Sangha (Notun Mosjid)', lastDonation: '2024-08-28', available: true, verified: true, image: '', createdAt: '2024-10-05', userId: 'u9' },
  { id: '10', name: 'Momena Khatun', bloodGroup: 'O+', phone: '+8801912345999', email: 'momena@example.com', location: 'Urkirchar Jono Kollyan Chatra Sangha', lastDonation: '2024-07-05', available: true, verified: false, image: '', createdAt: '2024-09-28', userId: 'u10' },
  { id: '11', name: 'Jamal Uddin', bloodGroup: 'B+', phone: '+8801612345999', email: 'jamal@example.com', location: 'Outside Urkirchar', lastDonation: '2024-06-22', available: false, verified: true, image: '', createdAt: '2024-09-20', userId: 'u11' },
  { id: '12', name: 'Salma Akter', bloodGroup: 'A+', phone: '+8801512345999', email: 'salma@example.com', location: 'Urkirchar Shanti Sangha', lastDonation: '2024-09-05', available: true, verified: true, image: '', createdAt: '2024-09-15', userId: 'u12' },
  { id: '13', name: 'Tarek Rahman', bloodGroup: 'O+', phone: '+8801712346000', email: 'tarek@example.com', location: 'Urkirchar Moromi Sangha', lastDonation: '2024-10-01', available: true, verified: true, image: '', createdAt: '2024-09-10', userId: 'u13' },
  { id: '14', name: 'Nusrat Jahan', bloodGroup: 'B-', phone: '+8801812346000', email: 'nusrat@example.com', location: 'Urkirchar Agrani Sangha', lastDonation: '2024-09-20', available: true, verified: true, image: '', createdAt: '2024-09-05', userId: 'u14' },
  { id: '15', name: 'Mizanur Rahman', bloodGroup: 'AB+', phone: '+8801912346000', email: 'mizan@example.com', location: 'Urkirchar Mitali Sangha', lastDonation: '2024-08-10', available: false, verified: true, image: '', createdAt: '2024-08-25', userId: 'u15' },
];

const seedUsers: User[] = [
  { id: 'admin1', name: 'Admin', email: 'admin@urkirchar.com', password: 'admin123', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u1', name: 'Rafiq Ahmed', email: 'rafiq@example.com', password: 'pass123', role: 'user', createdAt: '2024-01-15' },
];

interface StoreState {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerUser: (user: Omit<User, 'id' | 'createdAt' | 'role'>) => User;
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'createdAt' | 'verified'>) => Donor;
  updateDonor: (id: string, data: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;
  toggleVerified: (id: string) => void;
  toggleAvailable: (id: string) => void;
  getDonorByUserId: (userId: string) => Donor | undefined;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      currentUser: null,
      users: seedUsers,

      login: (email, password) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      registerUser: (userData) => {
        const user: User = {
          ...userData,
          id: 'u' + Date.now(),
          role: 'user',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ users: [...state.users, user], currentUser: user }));
        return user;
      },

      donors: seedDonors,

      addDonor: (donorData) => {
        const donor: Donor = {
          ...donorData,
          id: 'd' + Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
          verified: false,
        };
        set(state => ({ donors: [...state.donors, donor] }));
        return donor;
      },

      updateDonor: (id, data) => {
        set(state => ({
          donors: state.donors.map(d => d.id === id ? { ...d, ...data } : d),
        }));
      },

      deleteDonor: (id) => {
        set(state => ({ donors: state.donors.filter(d => d.id !== id) }));
      },

      toggleVerified: (id) => {
        set(state => ({
          donors: state.donors.map(d => d.id === id ? { ...d, verified: !d.verified } : d),
        }));
      },

      toggleAvailable: (id) => {
        set(state => ({
          donors: state.donors.map(d => d.id === id ? { ...d, available: !d.available } : d),
        }));
      },

      getDonorByUserId: (userId) => {
        return get().donors.find(d => d.userId === userId);
      },
    }),
    {
      name: 'urkirchar-blood-bank',
    }
  )
);
