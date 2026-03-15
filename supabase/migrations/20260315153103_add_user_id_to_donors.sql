/*
  # Add user_id to donors table

  ## Changes
  - Add `user_id` column to donors table (links to Supabase auth.users.id)
  - Add unique constraint to ensure one donor per user
  - Add index for fast user lookups
  - Create RLS policy for donor creation

  ## Notes
  - user_id is nullable to support standalone donor registrations
  - Existing donors have NULL user_id
*/

DO $$
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'donors' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE donors ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX idx_donors_user_id ON donors(user_id);
    CREATE UNIQUE INDEX idx_donors_user_id_unique ON donors(user_id) WHERE user_id IS NOT NULL;
  END IF;
END $$;

-- Add RLS policy for users to create their own donor profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'donors' AND policyname = 'Users can create own donor profile'
  ) THEN
    CREATE POLICY "Users can create own donor profile"
      ON donors FOR INSERT
      TO anon, authenticated
      WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
  END IF;
END $$;

-- Add RLS policy for users to update their own donor profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'donors' AND policyname = 'Users can update own donor profile'
  ) THEN
    CREATE POLICY "Users can update own donor profile"
      ON donors FOR UPDATE
      TO authenticated
      USING (user_id IS NULL OR auth.uid() = user_id)
      WITH CHECK (user_id IS NULL OR auth.uid() = user_id);
  END IF;
END $$;
