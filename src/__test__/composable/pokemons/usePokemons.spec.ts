import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemons } from '../../../composables/pokemons/usePokemons'
import { usePokemonsList } from '../../../composables/pokemons/usePokemonsList'
import { usePokemonStore } from '../../../store/usePokemonStore'
import { useInfinityScroll } from '../../../composables/custom/useInfinityScroll'
import { useCustomVirtualList } from '../../../composables/custom/useCustomVirtualList'
import { ref } from 'vue'

// Mock de los módulos
vi.mock('../../../composables/pokemons/usePokemonsList', () => ({
  usePokemonsList: vi.fn()
}))

vi.mock('../../../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn()
}))

vi.mock('../../../composables/custom/useInfinityScroll', () => ({
  useInfinityScroll: vi.fn()
}))

vi.mock('../../../composables/custom/useCustomVirtualList', () => ({
  useCustomVirtualList: vi.fn()
}))

describe('usePokemons', () => {
  const mockSetPokemons = vi.fn()
  const mockSetInitialLoad = vi.fn()
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Mock del store
    vi.mocked(usePokemonStore).mockReturnValue({
      pokemons: {},
      initialLoad: true,
      setPokemons: mockSetPokemons,
      setInitialLoad: mockSetInitialLoad
    } as any)
    
    // Mock de usePokemonsList
    vi.mocked(usePokemonsList).mockReturnValue({
      pokemons: ref({})
    } as any)
    
    // Mock de useCustomVirtualList
    vi.mocked(useCustomVirtualList).mockReturnValue({
      list: ref([]),
      containerProps: {},
      wrapperProps: {}
    } as any)
    
    // Mock de useInfiniteScroll
    vi.mocked(useInfinityScroll).mockImplementation(() => ({
      isLoading: ref(false),
      reset: vi.fn()
    }) as any)
  })
  
  it('should initialize with correct values', () => {
    const { initialLoad, list, containerProps, wrapperProps, scrollContainerRef } = usePokemons()
    
    expect(initialLoad.value).toBe(true)
    expect(list.value).toEqual([])
    expect(containerProps).toBeDefined()
    expect(wrapperProps).toBeDefined()
    expect(scrollContainerRef.value).toBeNull()
    expect(usePokemonsList).toHaveBeenCalledWith(expect.any(Object))
  })
  
  it('should update initialLoad when pokemons are loaded', async () => {
    // Simular que el store ya tiene pokemons
    vi.mocked(usePokemonStore).mockReturnValue({
      pokemons: { pikachu: {}, charizard: {} },
      initialLoad: true,
      setPokemons: mockSetPokemons,
      setInitialLoad: mockSetInitialLoad
    } as any)
    
    const { initialLoad } = usePokemons()
    
    // Verificar que initialLoad se actualiza a false
    expect(mockSetInitialLoad).toHaveBeenCalledWith(false)
    expect(initialLoad.value).toBe(false)
  })
  
  it('should fetch next page correctly', async () => {
    // Simular que hay pokemons en el store
    vi.mocked(usePokemonStore).mockReturnValue({
      pokemons: { pikachu: {}, charizard: {} },
      initialLoad: false,
      setPokemons: mockSetPokemons,
      setInitialLoad: mockSetInitialLoad
    } as any)
    
    const { fetchNextPage } = usePokemons()
    
    // Espiar setTimeout
    vi.spyOn(window, 'setTimeout')
    
    await fetchNextPage()
    
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100)
  })
  
  it('should not fetch next page if page > 40', async () => {
    // Configurar para que page sea > 40 después de la primera llamada
    let pageRef: any
    vi.mocked(usePokemonsList).mockImplementation((page) => {
      pageRef = page
      return { pokemons: ref({}) } as any
    })
    
    vi.mocked(usePokemonStore).mockReturnValue({
      pokemons: { pikachu: {}, charizard: {} },
      initialLoad: false,
      setPokemons: mockSetPokemons,
      setInitialLoad: mockSetInitialLoad
    } as any)
    
    const { fetchNextPage } = usePokemons()
    
    // Primera llamada para incrementar page a 1
    await fetchNextPage()
    
    // Forzar page a 41
    pageRef.value = 41
    
    // Espiar setTimeout
    const timeoutSpy = vi.spyOn(window, 'setTimeout')
    
    // Segunda llamada no debería llamar a setTimeout
    await fetchNextPage()
    
    expect(timeoutSpy).not.toHaveBeenCalled()
  })
})
