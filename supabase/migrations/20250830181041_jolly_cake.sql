/*
  # Reset users and create new account

  1. Cleanup
    - Delete all existing profiles
    - Delete all auth users (if possible)
  
  2. New User Creation
    - Create user kk1213 with password 123456
    - Set up profile with proper username mapping
  
  3. Security
    - Maintain RLS policies
    - Ensure proper user isolation
*/

-- First, delete all existing profiles
DELETE FROM public.profiles;

-- Create the new user account
-- Note: We'll use the trigger to create profile automatically
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'kk1213@yapee.local',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "kk1213", "full_name": "User KK1213"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('123456', gen_salt('bf')),
  updated_at = now(),
  raw_user_meta_data = '{"username": "kk1213", "full_name": "User KK1213"}';

-- Get the user ID for profile creation
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'kk1213@yapee.local';
  
  -- Create or update profile
  INSERT INTO public.profiles (
    id,
    email,
    username,
    full_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    'kk1213@yapee.local',
    'kk1213',
    'User KK1213',
    'user',
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    username = 'kk1213',
    full_name = 'User KK1213',
    updated_at = now();
END $$;