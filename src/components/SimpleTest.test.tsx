import { describe, it, expect } from 'vitest'

describe('Simple Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    const result = 'Hello World'
    expect(result).toContain('Hello')
    expect(result.length).toBe(11)
  })

  it('should work with arrays', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr).toHaveLength(5)
    expect(arr).toContain(3)
  })

  it('should handle objects', () => {
    const obj = { name: 'Test', value: 42 }
    expect(obj.name).toBe('Test')
    expect(obj.value).toBe(42)
  })
})
