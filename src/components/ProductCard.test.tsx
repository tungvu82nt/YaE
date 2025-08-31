import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from './ProductCard'
import { AppProvider } from '../context/AppContext'
import { Product } from '../types'

// Mock data
const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  price: 29990000,
  originalPrice: 32990000,
  image: '/images/products/iphone15.jpg',
  images: ['/images/products/iphone15.jpg'],
  category: 'Điện thoại',
  brand: 'Apple',
  description: 'iPhone 15 Pro Max 256GB',
  rating: 4.8,
  reviewCount: 125,
  inStock: true,
  tags: ['smartphone', 'apple', 'premium'],
  specifications: {
    storage: '256GB',
    color: 'Titanium Blue',
    screen: '6.7 inch Super Retina XDR'
  }
}

// Mock the context and hooks
const mockDispatch = vi.fn()
const mockUseUserProfile = vi.fn()

vi.mock('../context/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  useApp: () => ({
    state: {
      user: { id: '1', name: 'Test User' },
      currentPage: 'home',
      isAdminMode: false,
    },
    dispatch: mockDispatch,
  }),
}))

vi.mock('../hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    wishlist: [],
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
    checkWishlistStatus: vi.fn().mockReturnValue(false),
  }),
}))

const renderProductCard = (product = mockProduct) => {
  return render(
    <AppProvider>
      <ProductCard product={product} />
    </AppProvider>
  )
}

describe('ProductCard Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockUseUserProfile.mockReturnValue({
      wishlist: [],
      addToWishlist: vi.fn(),
      removeFromWishlist: vi.fn(),
      isInWishlist: vi.fn().mockReturnValue(false),
    })
  })

  it('renders product information correctly', () => {
    renderProductCard()

    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
    expect(screen.getByText('29,990,000 đ')).toBeInTheDocument()
    expect(screen.getByText('32,990,000 đ')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro Max 256GB')).toBeInTheDocument()
  })

  it('displays rating and review count', () => {
    renderProductCard()

    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('(125)')).toBeInTheDocument()
  })

  it('shows discount percentage when original price exists', () => {
    renderProductCard()

    expect(screen.getByText('-9%')).toBeInTheDocument()
  })

  it('handles add to cart', () => {
    renderProductCard()

    const addToCartButton = screen.getByRole('button', { name: /thêm vào giỏ hàng/i })
    fireEvent.click(addToCartButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_TO_CART',
      payload: expect.objectContaining({
        id: '1',
        name: 'iPhone 15 Pro Max',
        price: 29990000,
      })
    })
  })

  it('shows wishlist button and handles toggle', () => {
    renderProductCard()

    const wishlistButton = screen.getByRole('button', { name: /wishlist/i })
    fireEvent.click(wishlistButton)

    expect(mockUseUserProfile().addToWishlist).toHaveBeenCalledWith(mockProduct)
  })

  it('displays out of stock status', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    renderProductCard(outOfStockProduct)

    expect(screen.getByText('Hết hàng')).toBeInTheDocument()
  })

  it('shows quick view button', () => {
    renderProductCard()

    expect(screen.getByRole('button', { name: /xem nhanh/i })).toBeInTheDocument()
  })

  it('displays product tags', () => {
    renderProductCard()

    expect(screen.getByText('smartphone')).toBeInTheDocument()
    expect(screen.getByText('apple')).toBeInTheDocument()
    expect(screen.getByText('premium')).toBeInTheDocument()
  })

  it('formats price correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 99999999, originalPrice: 120000000 }
    renderProductCard(expensiveProduct)

    expect(screen.getByText('99,999,999 đ')).toBeInTheDocument()
    expect(screen.getByText('120,000,000 đ')).toBeInTheDocument()
  })

  it('handles product without original price', () => {
    const noDiscountProduct = { ...mockProduct, originalPrice: undefined }
    renderProductCard(noDiscountProduct)

    expect(screen.queryByText(/-%\d+/)).not.toBeInTheDocument()
  })

  it('handles product without rating', () => {
    const noRatingProduct = { ...mockProduct, rating: undefined, reviewCount: 0 }
    renderProductCard(noRatingProduct)

    expect(screen.queryByText(/\d+\.\d+/)).not.toBeInTheDocument()
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument()
  })
})
