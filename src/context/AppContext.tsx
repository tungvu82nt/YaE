import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Product, CartItem, User } from '../types';

interface AppState {
  cart: CartItem[];
  user: User | null;
  searchQuery: string;
  selectedCategory: string;
  isAdminMode: boolean;
  products: Product[];
  categories: any[];
  loading: boolean;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'TOGGLE_ADMIN_MODE' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  cart: JSON.parse(localStorage.getItem('yapee_cart') || '[]'),
  user: JSON.parse(localStorage.getItem('yapee_user') || 'null'),
  searchQuery: '',
  selectedCategory: '',
  isAdminMode: false,
  products: [],
  categories: [],
  loading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { product: action.payload, quantity: 1 }];
      }
      
      localStorage.setItem('yapee_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.product.id !== action.payload);
      localStorage.setItem('yapee_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    
    case 'UPDATE_CART_QUANTITY': {
      const newCart = state.cart.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      localStorage.setItem('yapee_cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    }
    
    case 'CLEAR_CART': {
      localStorage.removeItem('yapee_cart');
      return { ...state, cart: [] };
    }
    
    case 'SET_USER': {
      if (action.payload) {
        localStorage.setItem('yapee_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('yapee_user');
      }
      return { ...state, user: action.payload };
    }
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'TOGGLE_ADMIN_MODE':
      return { ...state, isAdminMode: !state.isAdminMode };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const auth = useAuth();
  const { products, loading: productsLoading } = useProducts(state.selectedCategory, state.searchQuery);
  const { categories, loading: categoriesLoading } = useCategories();

  // Update state when data changes
  React.useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, [products]);

  React.useEffect(() => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  }, [categories]);

  React.useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: productsLoading || categoriesLoading });
  }, [productsLoading, categoriesLoading]);

  React.useEffect(() => {
    if (auth.user) {
      dispatch({ type: 'SET_USER', payload: auth.user });
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [auth.user]);

  return (
    <AppContext.Provider value={{ state, dispatch, auth }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}