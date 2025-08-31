import { useState, useEffect, useCallback } from 'react';
import { UserProfile, Address, WishlistItem, Review } from '../types';
import {
  mockUserProfiles,
  getUserProfile,
  mockWishlistItems,
  getWishlistItems,
  mockReviews,
  isProductInWishlist
} from '../data/mockReviews';

// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      if (USE_MOCK_DATA) {
        const mockProfile = getUserProfile(userId);
        if (mockProfile) {
          setProfile(mockProfile);
        } else {
          // Create default profile if not exists
          const defaultProfile: UserProfile = {
            id: `profile_${userId}`,
            userId: userId,
            firstName: '',
            lastName: '',
            phone: '',
            preferences: {
              language: 'vi',
              currency: 'VND',
              notifications: {
                email: true,
                sms: false,
                push: false
              }
            },
            addresses: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setProfile(defaultProfile);
        }
      } else {
        // TODO: Implement real API call
        console.log('🔄 Loading profile from API');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load wishlist
  const loadWishlist = useCallback(async () => {
    if (!userId) return;

    try {
      if (USE_MOCK_DATA) {
        const items = getWishlistItems(userId);
        setWishlistItems(items);
      } else {
        // TODO: Implement real API call
        console.log('🔄 Loading wishlist from API');
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  }, [userId]);

  // Load user reviews
  const loadUserReviews = useCallback(async () => {
    if (!userId) return;

    try {
      if (USE_MOCK_DATA) {
        const reviews = mockReviews.filter(review => review.userId === userId);
        setUserReviews(reviews);
      } else {
        // TODO: Implement real API call
        console.log('🔄 Loading user reviews from API');
      }
    } catch (err) {
      console.error('Error loading user reviews:', err);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!profile) return false;

    try {
      if (USE_MOCK_DATA) {
        const updatedProfile = {
          ...profile,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        setProfile(updatedProfile);

        // Update localStorage
        localStorage.setItem(`yapee_profile_${profile.userId}`, JSON.stringify(updatedProfile));

        console.log('✅ Profile updated successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  }, [profile]);

  // Add address
  const addAddress = useCallback(async (address: Omit<Address, 'id'>): Promise<boolean> => {
    if (!profile) return false;

    try {
      if (USE_MOCK_DATA) {
        const newAddress = {
          ...address,
          id: `address_${Date.now()}`
        };

        const updatedAddresses = [...profile.addresses, newAddress];
        await updateProfile({ addresses: updatedAddresses });

        console.log('✅ Address added successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error adding address:', err);
      return false;
    }
  }, [profile, updateProfile]);

  // Update address
  const updateAddress = useCallback(async (addressId: string, updates: Partial<Address>): Promise<boolean> => {
    if (!profile) return false;

    try {
      if (USE_MOCK_DATA) {
        const updatedAddresses = profile.addresses.map(addr =>
          addr.id === addressId ? { ...addr, ...updates } : addr
        );

        await updateProfile({ addresses: updatedAddresses });
        console.log('✅ Address updated successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error updating address:', err);
      return false;
    }
  }, [profile, updateProfile]);

  // Delete address
  const deleteAddress = useCallback(async (addressId: string): Promise<boolean> => {
    if (!profile) return false;

    try {
      if (USE_MOCK_DATA) {
        const updatedAddresses = profile.addresses.filter(addr => addr.id !== addressId);
        await updateProfile({ addresses: updatedAddresses });

        console.log('✅ Address deleted successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      return false;
    }
  }, [profile, updateProfile]);

  // Add to wishlist
  const addToWishlist = useCallback(async (productId: string, product: any): Promise<boolean> => {
    if (!userId) return false;

    try {
      if (USE_MOCK_DATA) {
        if (isProductInWishlist(userId, productId)) {
          console.log('Product already in wishlist');
          return true; // Already in wishlist
        }

        const newItem: WishlistItem = {
          id: `wishlist_${Date.now()}`,
          userId: userId,
          productId: productId,
          product: product,
          category: product.category,
          price: product.price,
          addedAt: new Date().toISOString()
        };

        const updatedItems = [...wishlistItems, newItem];
        setWishlistItems(updatedItems);

        console.log('✅ Added to wishlist successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      return false;
    }
  }, [userId, wishlistItems]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        const updatedItems = wishlistItems.filter(item => item.productId !== productId);
        setWishlistItems(updatedItems);

        console.log('✅ Removed from wishlist successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      return false;
    }
  }, [wishlistItems]);

  // Check if product is in wishlist
  const checkWishlistStatus = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  // Auto-load data when userId changes
  useEffect(() => {
    if (userId) {
      loadProfile();
      loadWishlist();
      loadUserReviews();
    } else {
      setProfile(null);
      setWishlistItems([]);
      setUserReviews([]);
    }
  }, [userId, loadProfile, loadWishlist, loadUserReviews]);

  return {
    profile,
    wishlistItems,
    userReviews,
    loading,
    error,
    loadProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus,
    loadWishlist,
    loadUserReviews
  };
}
