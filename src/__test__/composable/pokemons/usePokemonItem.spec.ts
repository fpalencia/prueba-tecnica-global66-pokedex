import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonItem } from '../../../composables/pokemons/usePokemonItem'
import { useQuery } from '@tanstack/vue-query'
import { getPokemonById } from '../../../services/getPokemonsServices'
import { ref } from 'vue'

// Mock de las dependencias
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn()
}))

vi.mock('../../../services/getPokemonsServices', () => ({
  getPokemonById: vi.fn()
}))

describe('usePokemonItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call useQuery with correct parameters when name is a string', () => {
    // Configurar el mock de useQuery
    const mockQueryResult = {
      isLoading: false,
      data: { id: 25, name: 'pikachu', height: 4, weight: 60 },
      isError: false,
      error: null,
      isFetching: false
    }
    
    vi.mocked(useQuery).mockReturnValue(mockQueryResult)
    
    // Llamar al composable con un nombre como string
    const result = usePokemonItem('Pikachu')
    
    // Verificar que useQuery fue llamado con los parámetros correctos
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['pokemon', 'Pikachu'],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 30,
      retry: 2
    })
    
    // Verificar que el resultado es correcto
    expect(result).toEqual({
      isLoading: false,
      isError: false,
      pokemon: { id: 25, name: 'pikachu', height: 4, weight: 60 },
      errorMessage: null,
      isFetching: false
    })
  })

  it('should call useQuery with correct parameters when name is a ref', () => {
    // Configurar el mock de useQuery
    const mockQueryResult = {
      isLoading: false,
      data: { id: 25, name: 'pikachu', height: 4, weight: 60 },
      isError: false,
      error: null,
      isFetching: false
    }
    
    vi.mocked(useQuery).mockReturnValue(mockQueryResult)
    
    // Crear una ref para el nombre
    const nameRef = ref('Pikachu')
    
    // Llamar al composable con un nombre como ref
    const result = usePokemonItem(nameRef)
    
    // Verificar que useQuery fue llamado con los parámetros correctos
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['pokemon', nameRef],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 30,
      retry: 2
    })
    
    // Verificar que el resultado es correcto
    expect(result).toEqual({
      isLoading: false,
      isError: false,
      pokemon: { id: 25, name: 'pikachu', height: 4, weight: 60 },
      errorMessage: null,
      isFetching: false
    })
  })

  it('should convert pokemon name to lowercase in queryFn', () => {
    // Configurar el mock de useQuery para capturar la función queryFn
    vi.mocked(useQuery).mockImplementation((options) => {
      // Ejecutar la función queryFn para verificar que convierte el nombre a minúsculas
      if (options.queryFn) {
        options.queryFn()
      }
      
      return {
        isLoading: false,
        data: null,
        isError: false,
        error: null,
        isFetching: false
      }
    })
    
    // Llamar al composable
    usePokemonItem('PIKACHU')
    
    // Verificar que getPokemonById fue llamado con el nombre en minúsculas
    expect(getPokemonById).toHaveBeenCalledWith('pikachu')
  })

  it('should handle loading state', () => {
    // Configurar el mock de useQuery para un estado de carga
    const mockQueryResult = {
      isLoading: true,
      data: null,
      isError: false,
      error: null,
      isFetching: true
    }
    
    vi.mocked(useQuery).mockReturnValue(mockQueryResult)
    
    // Llamar al composable
    const result = usePokemonItem('pikachu')
    
    // Verificar que el estado de carga se devuelve correctamente
    expect(result.isLoading).toBe(true)
    expect(result.isFetching).toBe(true)
    expect(result.pokemon).toBeNull()
  })

  it('should handle error state', () => {
    // Configurar el mock de useQuery para un estado de error
    const mockError = new Error('Failed to fetch pokemon')
    const mockQueryResult = {
      isLoading: false,
      data: null,
      isError: true,
      error: mockError,
      isFetching: false
    }
    
    vi.mocked(useQuery).mockReturnValue(mockQueryResult)
    
    // Llamar al composable
    const result = usePokemonItem('pikachu')
    
    // Verificar que el estado de error se devuelve correctamente
    expect(result.isError).toBe(true)
    expect(result.errorMessage).toBe(mockError)
    expect(result.pokemon).toBeNull()
  })
})
