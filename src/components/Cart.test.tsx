import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Cart from './Cart'
import { AppProvider } from '../context/AppContext'
import { Product } from '../types'

// Mock data
const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max',
  price: 29990000,
  image: '/images/products/iphone15.jpg',
  category: 'Điện thoại',
  brand: 'Apple',
  inStock: true,
}

// Mock the context
const mockDispatch = vi.fn()
const mockOnCheckout = vi.fn()

vi.mock('../context/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  useApp: () => ({
    state: {
      cart: [
        {
          id: '1',
          product: mockProduct,
          quantity: 2,
          totalPrice: 59980000,
        }
      ],
      user: { id: '1', name: 'Test User' },
      currentPage: 'home',
      isAdminMode: false,
    },
    dispatch: mockDispatch,
  }),
}))

const renderCart = (onCheckout = mockOnCheckout) => {
  return render(
    <AppProvider>
      <Cart onCheckout={onCheckout} />
    </AppProvider>
  )
}

describe('Cart Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockOnCheckout.mockClear()
  })

  it('renders cart with items', () => {
    renderCart()

    expect(screen.getByText('Giỏ hàng')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
    expect(screen.getByText('29,990,000 đ')).toBeInTheDocument()
    expect(screen.getByText('Số lượng: 2')).toBeInTheDocument()
    expect(screen.getByText('59,980,000 đ')).toBeInTheDocument()
  })

  it('displays total items and price', () => {
    renderCart()

    expect(screen.getByText('2 sản phẩm')).toBeInTheDocument()
    expect(screen.getByText('Tổng tiền: 59,980,000 đ')).toBeInTheDocument()
  })

  it('handles quantity increase', () => {
    renderCart()

    const increaseButton = screen.getByRole('button', { name: /\+/i })
    fireEvent.click(increaseButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { productId: '1', quantity: 3 }
    })
  })

  it('handles quantity decrease', () => {
    renderCart()

    const decreaseButton = screen.getByRole('button', { name: /-/i })
    fireEvent.click(decreaseButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { productId: '1', quantity: 1 }
    })
  })

  it('handles item removal', () => {
    renderCart()

    const removeButton = screen.getByRole('button', { name: /xóa/i })
    fireEvent.click(removeButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_FROM_CART',
      payload: '1'
    })
  })

  it('handles checkout button click', () => {
    renderCart()

    const checkoutButton = screen.getByRole('button', { name: /thanh toán/i })
    fireEvent.click(checkoutButton)

    expect(mockOnCheckout).toHaveBeenCalled()
  })

  it('shows empty cart message when no items', () => {
    // Mock empty cart
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        cart: [],
        user: null,
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderCart()

    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument()
    expect(screen.getByText('Không có sản phẩm nào trong giỏ hàng')).toBeInTheDocument()
  })

  it('handles close button', () => {
    renderCart()

    const closeButton = screen.getByRole('button', { name: /đóng/i })
    fireEvent.click(closeButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_CART'
    })
  })

  it('prevents quantity from going below 1', () => {
    // Mock cart with quantity 1
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        cart: [
          {
            id: '1',
            product: mockProduct,
            quantity: 1,
            totalPrice: 29990000,
          }
        ],
        user: { id: '1', name: 'Test User' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderCart()

    const decreaseButton = screen.getByRole('button', { name: /-/i })
    fireEvent.click(decreaseButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_QUANTITY',
      payload: { productId: '1', quantity: 1 }
    })
  })

  it('calculates subtotal correctly', () => {
    // Mock cart with multiple items
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        cart: [
          {
            id: '1',
            product: mockProduct,
            quantity: 2,
            totalPrice: 59980000,
          },
          {
            id: '2',
            product: { ...mockProduct, id: '2', name: 'iPhone 14', price: 19990000 },
            quantity: 1,
            totalPrice: 19990000,
          }
        ],
        user: { id: '1', name: 'Test User' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderCart()

    expect(screen.getByText('Tổng tiền: 79,980,000 đ')).toBeInTheDocument()
  })

  it('displays product images', () => {
    renderCart()

    const productImage = screen.getByAltText('iPhone 15 Pro Max')
    expect(productImage).toBeInTheDocument()
    expect(productImage).toHaveAttribute('src', '/images/products/iphone15.jpg')
  })
})
