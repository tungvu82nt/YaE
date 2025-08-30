import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    checkInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const transformedUser: User = {
          id: data.id,
          email: data.email,
          username: data.username || data.email.split('@')[0],
          name: data.full_name || data.email.split('@')[0],
          avatar: data.avatar_url || undefined,
          role: data.role as 'user' | 'admin',
          createdAt: data.created_at
        };
        setUser(transformedUser);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (username: string, password: string, fullName: string) => {
    try {
      console.log('Starting sign up process for username:', username);
      
      // Basic validation
      if (!username || !password || !fullName) {
        return { data: null, error: 'Vui lòng điền đầy đủ thông tin' };
      }

      // Username format validation
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return { data: null, error: 'Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ, số, _ và -' };
      }

      if (password.length < 6) {
        return { data: null, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
      }

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase().trim())
        .single();

      if (existingUser) {
        return { data: null, error: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.' };
      }

      // Create email format for Supabase auth (since Supabase requires email)
      const email = `${username.toLowerCase().trim()}@yapee.local`;
      console.log('Creating account with email:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          },
          emailRedirectTo: undefined // Disable email confirmation
        }
      });

      console.log('Supabase signup response:', { data: !!data, error: error?.message });

      if (error) {
        // Translate common errors to Vietnamese
        let errorMessage = error.message;
        if (error.message.includes('User already registered')) {
          errorMessage = 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Tên đăng nhập không hợp lệ.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
        } else if (error.message.includes('Database error')) {
          errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau ít phút.';
        }
        console.error('Sign up error:', errorMessage);
        return { data: null, error: errorMessage };
      }

      console.log('Sign up successful');
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Starting sign in process for username:', username);
      
      // Basic validation
      if (!username || !password) {
        return { data: null, error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' };
      }

      // Username format validation
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return { data: null, error: 'Tên đăng nhập không hợp lệ' };
      }

      if (password.length < 6) {
        return { data: null, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
      }

      // First, try to find the user by username in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username.toLowerCase().trim())
        .single();

      if (profileError) {
        console.log('Profile lookup error:', profileError.message);
        if (profileError.code === 'PGRST116') {
          return { data: null, error: 'Tên đăng nhập không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.' };
        }
        return { data: null, error: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
      }

      if (!profile?.email) {
        return { data: null, error: 'Tên đăng nhập không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.' };
      }

      console.log('Found user email for username:', username, '-> email:', profile.email);

      // Now sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password
      });

      console.log('Supabase auth response:', { data: !!data, error: error?.message });

      if (error) {
        // Translate common Supabase errors to Vietnamese
        let errorMessage = error.message;
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Mật khẩu không đúng. Vui lòng kiểm tra lại.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Tài khoản chưa được kích hoạt.';
        } else if (error.message.includes('too many requests')) {
          errorMessage = 'Quá nhiều lần thử. Vui lòng đợi ít phút rồi thử lại.';
        }
        console.error('Sign in error:', errorMessage);
        return { data: null, error: errorMessage };
      }

      console.log('Sign in successful');
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return { error: 'No user logged in' };

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name,
          phone: updates.phone,
          avatar_url: updates.avatar
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refresh user data
      await fetchUserProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Update failed' };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
}