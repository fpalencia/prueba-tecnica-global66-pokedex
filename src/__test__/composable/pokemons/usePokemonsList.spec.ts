import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonsList } from '../../../composables/pokemons/usePokemonsList'
import { useQuery } from '@tanstack/vue-query'
import { getPokemons } from '../../../services/getPokemonsServices'
import { ref } from 'vue'

// Mock de @tanstack/vue-query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
  keepPreviousData: Symbol('keepPreviousData')
}))

// Mock del servicio
vi.mock('../../../services/getPokemonsServices', () => ({
  getPokemons: vi.fn()
}))

describe('usePokemonsList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should call useQuery with correct parameters', () => {
    // Configurar el mock de useQuery
    const mockQueryResult = {
      isLoading: false,
      data: { pikachu: {}, charizard: {} },
      isError: false,
      error: null,
      isFetching: false
    }
    
    vi.mocked(useQuery).mockReturnValue(mockQueryResult as any)
    
    // Crear un ref para la página
    const page = ref(1)
    
    // Llamar al composable
    const result = usePokemonsList(page)
    
    // Verificar que useQuery fue llamado con los parámetros correctos
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['pokemons', page],
      queryFn: expect.any(Function),
      placeholderData: expect.any(Symbol),
      retry: 2
    })
    
    // Verificar que el resultado es correcto
    expect(result).toEqual({
      pokemons: { pikachu: {}, charizard: {} },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false
    })
  })
  
  it('should call getPokemons with correct page value', () => {
    // Configurar el mock de useQuery para capturar y ejecutar queryFn
    vi.mocked(useQuery).mockImplementation(({ queryFn }: any) => {
      // Ejecutar la función queryFn
      queryFn()
      
      return {
        isLoading: false,
        data: {},
        isError: false,
        error: null,
        isFetching: false
      } as any
    })
    
    // Mock de getPokemons
    vi.mocked(getPokemons).mockResolvedValue({})
    
    // Crear un ref para la página
    const page = ref(5)
    
    // Llamar al composable
    usePokemonsList(page)
    
    // Verificar que getPokemons fue llamado con el valor correcto de page
    expect(getPokemons).toHaveBeenCalledWith(5)
  })
  
  it('should handle loading state correctly', () => {
    // Configurar el mock de useQuery para estado de carga
    vi.mocked(useQuery).mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
      error: null,
      isFetching: true
    } as any)
    
    // Llamar al composable
    const { isLoading, isFetching } = usePokemonsList(ref(1))
    
    // Verificar estado de carga
    expect(isLoading).toBe(true)
    expect(isFetching).toBe(true)
  })
  
  it('should handle error state correctly', () => {
    const testError = new Error('Failed to fetch pokemons')
    
    // Configurar el mock de useQuery para estado de error
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
      error: testError,
      isFetching: false
    } as any)
    
    // Llamar al composable
    const { isError, error } = usePokemonsList(ref(1))
    
    // Verificar estado de error
    expect(isError).toBe(true)
    expect(error).toBe(testError)
  })
  
  it('should handle successful data fetch', () => {
    const mockPokemonsData = {
      bulbasaur: { id: 1, name: 'bulbasaur' },
      ivysaur: { id: 2, name: 'ivysaur' }
    }
    
    // Configurar el mock de useQuery para datos exitosos
    vi.mocked(useQuery).mockReturnValue({
      isLoading: false,
      data: mockPokemonsData,
      isError: false,
      error: null,
      isFetching: false
    } as any)
    
    // Llamar al composable
    const { pokemons, isLoading, isError } = usePokemonsList(ref(1))
    
    // Verificar datos y estado
    expect(pokemons).toEqual(mockPokemonsData)
    expect(isLoading).toBe(false)
    expect(isError).toBe(false)
  })
})
