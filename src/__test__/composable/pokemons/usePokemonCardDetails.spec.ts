import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonCardDetails } from '../../../composables/pokemons/usePokemonCardDetails'
import { usePokemonItem } from '../../../composables/pokemons/usePokemonItem'
import { useClipboard } from '@vueuse/core'
import { ref } from 'vue'

// Mock de los composables que utiliza
vi.mock('../../../composables/pokemons/usePokemonItem', () => ({
  usePokemonItem: vi.fn()
}))

vi.mock('@vueuse/core', () => ({
  useClipboard: vi.fn()
}))

describe('usePokemonCardDetails', () => {
  beforeEach(() => {
    // Resetear los mocks antes de cada prueba
    vi.clearAllMocks()
  })

  it('should return loading state from usePokemonItem', () => {
    // Configurar el mock de usePokemonItem
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(true),
      isFetching: ref(false),
      isError: ref(false),
      errorMessage: ref(null),
      pokemon: ref({
        name: 'pikachu',
        id: 25,
        weight: 60,
        height: 4,
        types: ['electric']
      })
    })

    // Configurar el mock de useClipboard
    vi.mocked(useClipboard).mockReturnValue({
      copy: vi.fn(),
      copied: ref(false)
    })

    const { isLoading, isFetching } = usePokemonCardDetails('pikachu')
    
    expect(isLoading.value).toBe(true)
    expect(isFetching.value).toBe(false)
    expect(usePokemonItem).toHaveBeenCalledWith('pikachu')
  })

  it('should capitalize first letter correctly', () => {
    // Configurar mocks
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isFetching: ref(false),
      isError: ref(false),
      errorMessage: ref(null),
      pokemon: ref({
        name: 'pikachu',
        id: 25,
        weight: 60,
        height: 4,
        types: ['electric']
      })
    })

    vi.mocked(useClipboard).mockReturnValue({
      copy: vi.fn(),
      copied: ref(false)
    })

    const { capitalizeFirstLetter } = usePokemonCardDetails('pikachu')
    
    expect(capitalizeFirstLetter('hello')).toBe('Hello')
    expect(capitalizeFirstLetter('world')).toBe('World')
    expect(capitalizeFirstLetter('a')).toBe('A')
    expect(capitalizeFirstLetter('')).toBe('')
  })

  it('should format pokemon info correctly', () => {
    // Mock de datos de Pokémon
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      frontSprite: 'url/to/sprite.png',
      type: 'electric'
    }

    // Configurar el mock de usePokemonItem
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isFetching: ref(false),
      isError: ref(false),
      errorMessage: ref(null),
      pokemon: ref(mockPokemon)
    })

    // Mock para useClipboard
    const mockCopy = vi.fn()
    vi.mocked(useClipboard).mockReturnValue({
      copy: mockCopy,
      copied: ref(false)
    })

    // Llamar al composable después de configurar los mocks
    usePokemonCardDetails('pikachu')
    
    // Verificar que useClipboard fue llamado
    expect(useClipboard).toHaveBeenCalled()
    
    // Obtener los argumentos con los que fue llamado
    const clipboardArgs = vi.mocked(useClipboard).mock.calls[0][0]
    
    // Verificar que el argumento source existe
    expect(clipboardArgs).toHaveProperty('source')
    
    // Si source es un objeto con una propiedad value (como un ref)
    if (typeof clipboardArgs.source === 'object' && clipboardArgs.source !== null) {
      expect(clipboardArgs.source.value).toContain('Name: Pikachu')
      expect(clipboardArgs.source.value).toContain('Height: 4')
      expect(clipboardArgs.source.value).toContain('Weight: 60')
      expect(clipboardArgs.source.value).toContain('Type: electric')
    } else {
      // Si source es directamente un string
      expect(typeof clipboardArgs.source).toBe('string')
      expect(clipboardArgs.source).toContain('Name: pikachu')
      expect(clipboardArgs.source).toContain('Height: 4')
      expect(clipboardArgs.source).toContain('Weight: 60')
      expect(clipboardArgs.source).toContain('Type: electric')
    }
  })

  it('should handle empty pokemon data', () => {
    // Configurar el mock de usePokemonItem con datos vacíos
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isFetching: ref(false),
      isError: ref(false),
      errorMessage: ref(null),
      pokemon: ref(null)
    })

    // Mock para useClipboard
    const mockCopy = vi.fn()
    vi.mocked(useClipboard).mockReturnValue({
      copy: mockCopy,
      copied: ref(false)
    })

    // Llamar al composable después de configurar los mocks
    usePokemonCardDetails('pikachu')
    
    // Verificar que useClipboard fue llamado
    expect(useClipboard).toHaveBeenCalled()
    
    // Obtener los argumentos con los que fue llamado
    const clipboardArgs = vi.mocked(useClipboard).mock.calls[0][0]
    
    // Verificar que el argumento source existe
    expect(clipboardArgs).toHaveProperty('source')
    
    // Si source es un objeto con una propiedad value (como un ref)
    if (typeof clipboardArgs.source === 'object' && clipboardArgs.source !== null) {
      expect(clipboardArgs.source.value).toBe('')
    } else {
      // Si source es directamente un string
      expect(clipboardArgs.source).toBe('')
    }
  })

  it('should expose copied state from useClipboard', () => {
    // Configurar mocks
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isFetching: ref(false),
      isError: ref(false),
      errorMessage: ref(null),
      pokemon: ref({
        name: 'pikachu',
        id: 25,
        weight: 60,
        height: 4,
        types: ['electric']
      })
    })

    const copiedRef = ref(true)
    vi.mocked(useClipboard).mockReturnValue({
      copy: vi.fn(),
      copied: copiedRef
    })

    const { copied } = usePokemonCardDetails('pikachu')
    
    // Verificar que copied es exactamente la misma referencia que copiedRef
    expect(copied).toBe(copiedRef)
  })
})
