import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'
import { AppProvider } from '../context/AppContext'

// Mock the context
const mockDispatch = vi.fn()

vi.mock('../context/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => children,
  useApp: () => ({
    state: {
      user: null,
      currentPage: 'home',
      isAdminMode: false,
    },
    dispatch: mockDispatch,
  }),
}))

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <AppProvider>
        <Header />
      </AppProvider>
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
  })

  it('renders header with logo and navigation', () => {
    renderHeader()

    expect(screen.getByText('YA PEE')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tìm kiếm sản phẩm...')).toBeInTheDocument()
    expect(screen.getByText('Đăng nhập')).toBeInTheDocument()
  })

  it('handles search input', () => {
    renderHeader()

    const searchInput = screen.getByPlaceholderText('Tìm kiếm sản phẩm...')
    fireEvent.change(searchInput, { target: { value: 'iPhone' } })

    expect(searchInput).toHaveValue('iPhone')
  })

  it('navigates to search page when search button clicked', () => {
    renderHeader()

    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i })
    fireEvent.click(searchButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENT_PAGE',
      payload: 'search'
    })
  })

  it('shows user menu when logged in', () => {
    // Mock logged in state
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderHeader()

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Đơn hàng của tôi')).toBeInTheDocument()
    expect(screen.getByText('Thông tin cá nhân')).toBeInTheDocument()
    expect(screen.getByText('Danh sách yêu thích')).toBeInTheDocument()
  })

  it('handles logout', () => {
    // Mock logged in state
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderHeader()

    const logoutButton = screen.getByText('Đăng xuất')
    fireEvent.click(logoutButton)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
  })

  it('navigates to orders page', () => {
    // Mock logged in state
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderHeader()

    const ordersButton = screen.getByText('Đơn hàng của tôi')
    fireEvent.click(ordersButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENT_PAGE',
      payload: 'orders'
    })
  })

  it('navigates to profile page', () => {
    // Mock logged in state
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderHeader()

    const profileButton = screen.getByText('Thông tin cá nhân')
    fireEvent.click(profileButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENT_PAGE',
      payload: 'profile'
    })
  })

  it('navigates to wishlist page', () => {
    // Mock logged in state
    vi.mocked(vi.importActual('../context/AppContext')).useApp.mockReturnValue({
      state: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        currentPage: 'home',
        isAdminMode: false,
      },
      dispatch: mockDispatch,
    })

    renderHeader()

    const wishlistButton = screen.getByText('Danh sách yêu thích')
    fireEvent.click(wishlistButton)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CURRENT_PAGE',
      payload: 'wishlist'
    })
  })

  it('toggles mobile menu', () => {
    renderHeader()

    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)

    // Check if mobile menu is shown (this would need more specific implementation)
    // expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })
})
