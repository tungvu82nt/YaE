/*
  # Create authenticate_user function

  1. New Functions
    - `authenticate_user(p_username, p_password)` - Maps username to email for authentication
  
  2. Security
    - Grant execute permissions to anon and authenticated roles
    - Function uses SECURITY DEFINER for proper access to auth.users
  
  3. Purpose
    - Enables username-based login by finding the corresponding email
    - Returns email for successful username lookup
    - Returns error message for invalid usernames
*/

CREATE OR REPLACE FUNCTION public.authenticate_user(p_username TEXT, p_password TEXT)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Attempt to find the user by username stored in user_metadata
    SELECT id, email
    INTO user_record
    FROM auth.users
    WHERE (raw_user_meta_data->>'username') = p_username;

    IF NOT FOUND THEN
        -- Username not found
        RETURN json_build_object('error', 'Tên đăng nhập không tồn tại.');
    END IF;

    -- If user is found, return their email.
    -- The actual password verification will be handled by supabase.auth.signInWithPassword
    -- in the client-side code, so p_password is not used for verification here.
    RETURN json_build_object('email', user_record.email);

EXCEPTION
    WHEN OTHERS THEN
        -- Catch any other errors
        RETURN json_build_object('error', 'Lỗi hệ thống khi xác thực người dùng: ' || SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution privileges to anonymous and authenticated roles
GRANT EXECUTE ON FUNCTION public.authenticate_user(TEXT, TEXT) TO anon, authenticated;