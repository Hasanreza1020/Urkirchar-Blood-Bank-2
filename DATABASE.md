# Urkirchar Blood Bank - Database Documentation

## Overview

The Urkirchar Blood Bank application uses **Supabase** as its database backend. The database is fully configured and includes:

- Complete schema with 3 tables
- Row Level Security (RLS) policies
- Seed data with 15 donors and 3 users
- Indexes for optimal performance

## Database Schema

### Tables

#### 1. `users` Table
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| email | text | Unique email address |
| name | text | Full name |
| role | text | User role ('user' or 'admin') |
| created_at | timestamptz | Account creation timestamp |
| updated_at | timestamptz | Last update timestamp |

#### 2. `donors` Table
Stores blood donor information.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| user_id | uuid | Foreign key to users table (nullable) |
| name | text | Donor full name |
| email | text | Donor email |
| phone | text | Contact number |
| blood_group | text | Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| location | text | Area in Urkirchar |
| last_donation | date | Date of last donation (nullable) |
| available | boolean | Availability status (default: true) |
| verified | boolean | Admin verification status (default: false) |
| image | text | Profile photo (base64 or URL) |
| created_at | timestamptz | Registration timestamp |
| updated_at | timestamptz | Last update timestamp |

#### 3. `donation_requests` Table
Stores blood donation requests (future feature).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| requester_name | text | Name of person requesting blood |
| requester_phone | text | Contact number |
| blood_group | text | Required blood type |
| location | text | Location where blood is needed |
| urgency | text | Urgency level (low/medium/high/critical) |
| units_needed | integer | Number of units required |
| notes | text | Additional information |
| status | text | Request status (pending/fulfilled/cancelled) |
| created_at | timestamptz | Request creation time |
| fulfilled_at | timestamptz | When request was fulfilled |

## Security - Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

### Users Table Policies
- ✅ Users can view their own profile
- ✅ Users can update their own profile

### Donors Table Policies
- ✅ Public can view verified donors (for search page)
- ✅ Authenticated users can view all donors (for admin panel)
- ✅ Users can create their own donor profile
- ✅ Users can update their own donor profile
- ✅ Admins can update any donor
- ✅ Admins can delete donors

### Donation Requests Policies
- ✅ Anyone can view donation requests
- ✅ Anyone can create donation requests
- ✅ Authenticated users can update/delete requests

## Seed Data

### Users (3 total)
1. **Admin User**
   - Email: admin@urkirchar.com
   - Role: admin
   - Access: Full admin privileges

2. **Rafiq Ahmed**
   - Email: rafiq@example.com
   - Role: user

3. **Fatema Begum**
   - Email: fatema@example.com
   - Role: user

### Donors (15 total)
- **13 verified** donors
- **11 available** donors
- Blood groups distributed across A+, A-, B+, B-, AB+, AB-, O+, O-
- Locations across all 8 areas in Urkirchar

## Database Operations

### Frontend Integration

The application uses Supabase client library with the following services:

#### Auth Service (`src/services/authService.ts`)
- `loginUser()` - Authenticate users
- `registerUser()` - Create new users
- `getUserById()` - Fetch user details
- `updateUser()` - Update user information

#### Donor Service (`src/services/donorService.ts`)
- `fetchAllDonors()` - Get all donors (admin)
- `fetchVerifiedDonors()` - Get verified donors (public)
- `getDonorByUserId()` - Get donor by user ID
- `createDonor()` - Register new donor
- `updateDonor()` - Update donor information
- `deleteDonor()` - Remove donor
- `toggleDonorVerification()` - Admin verify/unverify
- `toggleDonorAvailability()` - Toggle availability status
- `searchDonors()` - Search with filters

### State Management

The application uses Zustand for state management with Supabase integration:

```typescript
// src/store/supabaseStore.ts
- language: Language preference
- currentUser: Logged in user
- donors: Cached donor list
- login(): Authenticate
- logout(): Sign out
- registerUserAndDonor(): Register new user with donor profile
- loadDonors(): Fetch donors from database
- updateDonor(): Update donor
- toggleVerified(): Admin verification
- toggleAvailable(): Toggle availability
```

## Database Indexes

Performance indexes are created on:
- `donors.blood_group` - Fast blood group searches
- `donors.location` - Fast location filters
- `donors.available` - Fast availability filters
- `donors.verified` - Fast verified status checks
- `donors.user_id` - Fast user lookups
- `donation_requests.blood_group` - Fast request searches
- `donation_requests.status` - Fast status filters
- `users.email` - Fast email lookups

## Testing the Database

### Admin Login
```
Email: admin@urkirchar.com
Note: Password not set in demo (authentication pending)
```

### Verify Database Connection
Check the browser console for:
- Successful Supabase client initialization
- Donor data loading on app start
- Real-time updates on admin actions

### Database Statistics
- 3 users
- 15 donors
- 13 verified donors
- 11 available donors
- 8 blood group types

## Environment Variables

Required environment variables (already configured in `.env`):

```env
VITE_SUPABASE_URL=https://xcbbfbjtkusiisvtjsse.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Migration History

### Migration: `create_complete_blood_bank_schema`
- Created `users`, `donors`, and `donation_requests` tables
- Enabled RLS on all tables
- Created comprehensive security policies
- Added performance indexes
- Set up automatic `updated_at` triggers

## Future Enhancements

Potential database improvements:
1. Add `donation_history` table for tracking donations
2. Implement `notifications` table for alerts
3. Add `blood_stock` table for inventory management
4. Create views for common queries
5. Set up database backups and point-in-time recovery

## Support

For database issues:
- Check Supabase dashboard for logs
- Verify RLS policies are working correctly
- Test queries in Supabase SQL editor
- Check browser console for client errors
