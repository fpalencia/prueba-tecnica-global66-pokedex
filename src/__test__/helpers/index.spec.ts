import { describe, it, expect } from 'vitest'
import { capitalize } from '../../helpers'

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('pikachu')).toBe('Pikachu')
    expect(capitalize('charizard')).toBe('Charizard')
    expect(capitalize('bulbasaur')).toBe('Bulbasaur')
  })

  it('should return the same string if already capitalized', () => {
    expect(capitalize('Pikachu')).toBe('Pikachu')
    expect(capitalize('Charizard')).toBe('Charizard')
  })

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(capitalize('p')).toBe('P')
    expect(capitalize('c')).toBe('C')
  })

  it('should handle strings with numbers and special characters', () => {
    expect(capitalize('pikachu25')).toBe('Pikachu25')
    expect(capitalize('pikachu-25')).toBe('Pikachu-25')
    expect(capitalize('25pikachu')).toBe('25pikachu')
  })

  it('should handle undefined or null values', () => {
    // @ts-ignore - Testing runtime behavior with invalid input
    expect(capitalize(undefined)).toBe('')
    // @ts-ignore - Testing runtime behavior with invalid input
    expect(capitalize(null)).toBe('')
  })
})
