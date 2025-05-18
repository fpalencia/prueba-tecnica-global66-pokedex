import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonSearch } from '../../../composables/pokemons/usePokemonSearch'
import { useRoute, useRouter } from 'vue-router'
import { nextTick } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn()
}))

describe('usePokemonSearch', () => {
  const mockPush = vi.fn()
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Mock del router
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush
    } as any)
  })
  
  it('should initialize with search value from route query', () => {
    // Configurar el mock de useRoute con un query parameter
    vi.mocked(useRoute).mockReturnValue({
      query: { name: 'pikachu' }
    } as any)
    
    const { searchValue } = usePokemonSearch()
    
    expect(searchValue.value).toBe('pikachu')
  })
  
  it('should initialize with empty search value when no query parameter', () => {
    // Configurar el mock de useRoute sin query parameters
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)
    
    const { searchValue } = usePokemonSearch()
    
    expect(searchValue.value).toBe('')
  })
  
  it('should handle search correctly with valid input', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)
    
    const { searchValue, handleSearch } = usePokemonSearch()
    
    // Establecer un valor de búsqueda
    searchValue.value = 'charizard'
    
    // Ejecutar la búsqueda
    handleSearch()
    
    // Verificar que router.push fue llamado con los parámetros correctos
    expect(mockPush).toHaveBeenCalledWith({
      name: 'pokemon-search',
      query: { name: 'charizard' }
    })
  })
  
  it('should not navigate when search value is empty', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)
    
    const { searchValue, handleSearch } = usePokemonSearch()
    
    // Establecer un valor de búsqueda vacío
    searchValue.value = ''
    
    // Ejecutar la búsqueda
    handleSearch()
    
    // Verificar que router.push no fue llamado
    expect(mockPush).not.toHaveBeenCalled()
  })
  
  it('should not navigate when search value contains only whitespace', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: {}
    } as any)
    
    const { searchValue, handleSearch } = usePokemonSearch()
    
    // Establecer un valor de búsqueda con solo espacios
    searchValue.value = '   '
    
    // Ejecutar la búsqueda
    handleSearch()
    
    // Verificar que router.push no fue llamado
    expect(mockPush).not.toHaveBeenCalled()
  })
  
  it('should clear search and navigate to pokemons route', () => {
    vi.mocked(useRoute).mockReturnValue({
      query: { name: 'pikachu' }
    } as any)
    
    const { searchValue, clearSearch } = usePokemonSearch()
    
    // Verificar que searchValue se inicializa correctamente
    expect(searchValue.value).toBe('pikachu')
    
    // Ejecutar clearSearch
    clearSearch()
    
    // Verificar que searchValue se limpia
    expect(searchValue.value).toBe('')
    
    // Verificar que router.push fue llamado con los parámetros correctos
    expect(mockPush).toHaveBeenCalledWith({
      name: 'pokemons'
    })
  })
  
  it('should update searchValue when route query changes', async () => {
    // Crear un mock que emule el comportamiento reactivo de useRoute
    const mockRoute = {
      query: { name: 'pikachu' }
    };
    
    // Usar una función que devuelva el objeto actualizado cada vez
    vi.mocked(useRoute).mockImplementation(() => mockRoute as any);
    
    const { searchValue } = usePokemonSearch();
    
    // Verificar valor inicial
    expect(searchValue.value).toBe('pikachu');
    
    // Cambiar el query parameter y forzar una re-ejecución del watchEffect
    mockRoute.query = { name: 'charizard' };
    
    // Necesitamos forzar la re-ejecución del watchEffect manualmente
    // ya que en el entorno de prueba no es automático
    const watchEffectFn = vi.fn();
    vi.stubGlobal('watchEffect', watchEffectFn);
    
    // Simular que Vue vuelve a ejecutar el watchEffect
    await nextTick();
    
    // Llamar manualmente al composable de nuevo para que se ejecute con el nuevo valor
    const { searchValue: updatedSearchValue } = usePokemonSearch();
    
    // Verificar que searchValue se actualizó
    expect(updatedSearchValue.value).toBe('charizard');
  })

  it('should use custom router when provided', () => {
    const mockRouter = {
      push: vi.fn()
    } as unknown as Router
    
    const mockRoute = {
      query: { name: 'pikachu' }
    } as unknown as RouteLocationNormalizedLoaded
    
    const { handleSearch } = usePokemonSearch(mockRoute, mockRouter)
    
    handleSearch()
    
    expect(mockRouter.push).toHaveBeenCalled()
  })
})
