import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  compare: vi.fn().mockResolvedValue(true),
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()

    // Reset environment (for testing purposes)
    // Note: In test environment, we can still use process.env safely
    process.env.NODE_ENV = 'development'
    process.env.USE_MOCK_DATA = 'true'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with no user', () => {
    localStorageMock.getItem.mockReturnValue(null)

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('loads user from localStorage on mount', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('handles signUp successfully', async () => {
    const { result } = renderHook(() => useAuth())

    const signUpData = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123'
    }

    await act(async () => {
      await result.current.signUp(signUpData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      expect.stringContaining('"name":"New User"')
    )
    expect(result.current.user?.name).toBe('New User')
    expect(result.current.user?.email).toBe('newuser@example.com')
  })

  it('handles signIn successfully', async () => {
    const { result } = renderHook(() => useAuth())

    const signInData = {
      email: 'test@example.com',
      password: 'password123'
    }

    await act(async () => {
      await result.current.signIn(signInData)
    })

    expect(localStorageMock.setItem).toHaveBeenCalled()
    expect(result.current.user?.email).toBe('test@example.com')
  })

  it('handles signIn with wrong password', async () => {
    // Mock bcrypt compare to return false
    const bcrypt = await import('bcryptjs')
    bcrypt.compare.mockResolvedValue(false)

    const { result } = renderHook(() => useAuth())

    const signInData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }

    await act(async () => {
      const success = await result.current.signIn(signInData)
      expect(success).toBe(false)
    })

    expect(result.current.user).toBeNull()
  })

  it('handles logout', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }))

    const { result } = renderHook(() => useAuth())

    act(() => {
      result.current.logout()
    })

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('validates email format', async () => {
    const { result } = renderHook(() => useAuth())

    const invalidSignUpData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    }

    await act(async () => {
      const success = await result.current.signUp(invalidSignUpData)
      expect(success).toBe(false)
    })

    expect(result.current.user).toBeNull()
  })

  it('validates password length', async () => {
    const { result } = renderHook(() => useAuth())

    const invalidSignUpData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123' // Too short
    }

    await act(async () => {
      const success = await result.current.signUp(invalidSignUpData)
      expect(success).toBe(false)
    })

    expect(result.current.user).toBeNull()
  })

  it('handles duplicate email registration', async () => {
    // First registration
    const { result } = renderHook(() => useAuth())

    const signUpData = {
      name: 'First User',
      email: 'test@example.com',
      password: 'password123'
    }

    await act(async () => {
      await result.current.signUp(signUpData)
    })

    // Try to register with same email
    await act(async () => {
      const success = await result.current.signUp(signUpData)
      expect(success).toBe(false)
    })
  })

  it('persists authentication state', () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser))

    const { result, rerender } = renderHook(() => useAuth())

    // Rerender to test persistence
    rerender()

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('handles localStorage errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
