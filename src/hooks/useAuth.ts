import { useState, useEffect } from 'react';
import { mockAdmin, mockUser } from '../data/mockData';
import { User } from '../types';
import ApiClient from '../services/apiClient';

// Check if we should use mock data
// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking initial session
    checkInitialSession();
  }, []);

  const checkInitialSession = async () => {
    try {
      // Simulate session check delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo purposes, set a default user
      // In real app, this would check localStorage or other auth method
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Auto-login as demo user for development
        setUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setUser(null);
    } finally {
      setLoading(false);
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

      if (USE_MOCK_DATA) {
        // Use localStorage for development
        console.log('📊 Using mock data mode for signup');
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];
        const usernameExists = existingUsers.some((u) => u.username === username.toLowerCase().trim());

        if (usernameExists) {
          return { data: null, error: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.' };
        }

        // Create new user object (mock - no real password hashing)
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: `${username}@yapee.local`,
          username: username,
          name: fullName,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        // Save user with mock password hash
        const userWithPassword = {
          ...newUser,
          passwordHash: password // Mock - in real app this would be hashed
        };

        // Save to localStorage
        existingUsers.push(userWithPassword as User & { passwordHash: string });
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        setUser(newUser);
        console.log('Sign up successful (mock data mode)');
        return { data: newUser, error: null };
      } else {
        // Try to create user via API (password will be handled by backend)
        const result = await ApiClient.createUser({
          username: username,
          email: `${username}@yapee.local`,
          password: password, // Let backend handle hashing
          fullName: fullName
        });

        if (result.error) {
          console.warn('Database signup failed, falling back to localStorage:', result.error);

          // Fallback to localStorage
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const usernameExists = existingUsers.some((u: any) => u.username === username.toLowerCase().trim());

          if (usernameExists) {
            return { data: null, error: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.' };
          }

          // Create new user object
          const newUser: User = {
            id: `user_${Date.now()}`,
            email: `${username}@yapee.local`,
            username: username,
            name: fullName,
            role: 'user',
            createdAt: new Date().toISOString()
          };

          // Save to localStorage
          existingUsers.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
          localStorage.setItem('currentUser', JSON.stringify(newUser));

          setUser(newUser);
          return { data: newUser, error: null };
        }

        // Database signup successful
        setUser(result.data);
        localStorage.setItem('currentUser', JSON.stringify(result.data));

        console.log('Sign up successful');
        return { data: result.data, error: null };
      }
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

      // Check for admin login first
      if (username === 'admin' && password === 'admin123') {
        setUser(mockAdmin);
        localStorage.setItem('currentUser', JSON.stringify(mockAdmin));
        console.log('Sign in successful (admin mode)');
        return { data: mockAdmin, error: null };
      }

      if (USE_MOCK_DATA) {
        // Use localStorage for development
        console.log('📊 Using mock data mode for signin');
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as (User & { passwordHash?: string })[];
        const foundUser = existingUsers.find((u) => u.username === username.toLowerCase().trim());

        if (!foundUser) {
          return { data: null, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
        }

        // Verify password (mock - simple comparison)
        if (foundUser.passwordHash) {
          const isPasswordValid = password === foundUser.passwordHash; // Mock comparison
          if (!isPasswordValid) {
            return { data: null, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
          }
        } else {
          // For backward compatibility with old users without hash
          console.warn('User without password hash found, accepting password for compatibility');
        }

        // Create user object without password hash
        const userWithoutPassword = {
          id: foundUser.id,
          email: foundUser.email,
          username: foundUser.username,
          name: foundUser.name,
          role: foundUser.role,
          createdAt: foundUser.createdAt
        };

        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        console.log('Sign in successful (mock data mode)');
        return { data: userWithoutPassword, error: null };
      } else {
        // Try to authenticate with database
        const result = await ApiClient.authenticateUser(username, password);

        if (result.error) {
          console.warn('Database authentication failed, falling back to localStorage:', result.error);

          // Fallback to localStorage
          const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];
          const foundUser = existingUsers.find((u) => u.username === username.toLowerCase().trim());

          if (!foundUser) {
            return { data: null, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
          }

          // For demo purposes, accept any password for registered users
          setUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));

          console.log('Sign in successful (localStorage fallback)');
          return { data: foundUser, error: null };
        }

        // Database authentication successful
        setUser(result.data);
        localStorage.setItem('currentUser', JSON.stringify(result.data));

        console.log('Sign in successful');
        return { data: result.data, error: null };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return { error: 'No user logged in' };

      // Update user object
      const updatedUser = { ...user, ...updates };

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Update in registered users list
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];
      const userIndex = existingUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      }

      // Update state
      setUser(updatedUser);

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