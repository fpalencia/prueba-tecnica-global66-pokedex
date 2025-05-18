import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePokemonFavorite } from '../../../composables/pokemons/usePokemonFavorite'
import { usePokemonStore } from '../../../store/usePokemonStore'
import { reactive, nextTick } from 'vue'

// Mock del store
vi.mock('../../../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn(() => ({
    // Propiedades básicas de Pinia
    $id: 'pokemons',
    $state: {},
    $patch: vi.fn(),
    $reset: vi.fn(),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
    // Propiedades específicas del store
    favorites: {
      'pikachu': true,
      'charizard': true,
      'bulbasaur': true
    }
  }))
}))

describe('usePokemonFavorite', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    vi.clearAllMocks()
    // Usar temporizadores falsos para controlar el tiempo
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restaurar temporizadores reales después de cada prueba
    vi.useRealTimers()
  })

  it('should initialize with favorites from store', () => {
    // Configurar el mock del store con algunos favoritos
    const mockStore = {
      favorites: {
        'pikachu': true,
        'charizard': true,
        'bulbasaur': true
      }
    }
    
    vi.mocked(usePokemonStore).mockReturnValue(mockStore as any)
    
    // Usar el composable
    const { pokemonsList } = usePokemonFavorite()
    
    // Verificar que la lista inicial contiene las claves de los favoritos
    expect(pokemonsList.value).toHaveLength(3)
    expect(pokemonsList.value).toContain('pikachu')
    expect(pokemonsList.value).toContain('charizard')
    expect(pokemonsList.value).toContain('bulbasaur')
  })

  it('should update when store favorites change', async () => {
    // Crear un objeto reactivo para los favoritos con tipo Record<string, boolean>
    const favorites = reactive<Record<string, boolean>>({
      'pikachu': true,
      'charizard': true
    })
    
    // Configurar el mock del store
    const mockStore = {
      favorites
    }
    
    vi.mocked(usePokemonStore).mockReturnValue(mockStore as any)
    
    // Usar el composable
    const { pokemonsList } = usePokemonFavorite()
    
    // Verificar estado inicial
    expect(pokemonsList.value).toHaveLength(2)
    
    // Modificar directamente el objeto reactivo
    favorites['bulbasaur'] = true
    
    // Forzar la actualización del ciclo de Vue
    await nextTick()
    // Avanzar todos los temporizadores pendientes
    vi.runAllTimers()
    
    // Verificar que la lista se actualizó
    expect(pokemonsList.value).toHaveLength(3)
    expect(pokemonsList.value).toContain('bulbasaur')
  })

  it('should handle empty favorites', () => {
    // Configurar el mock del store sin favoritos
    const mockStore = {
      favorites: {}
    }
    
    vi.mocked(usePokemonStore).mockReturnValue(mockStore as any)
    
    // Usar el composable
    const { pokemonsList } = usePokemonFavorite()
    
    // Verificar que la lista está vacía
    expect(pokemonsList.value).toHaveLength(0)
    expect(pokemonsList.value).toEqual([])
  })

  it('should handle removing favorites', async () => {
    // Crear un objeto reactivo para los favoritos
    const favorites = reactive({
      'pikachu': true,
      'charizard': true,
      'bulbasaur': true
    })
    
    // Configurar el mock del store
    const mockStore = {
      // Propiedades básicas de Pinia
      $id: 'pokemons',
      $state: {},
      $patch: vi.fn(),
      $reset: vi.fn(),
      $subscribe: vi.fn(),
      $dispose: vi.fn(),
      // Usar el objeto reactivo
      favorites
    }
    
    vi.mocked(usePokemonStore).mockReturnValue(mockStore as any)
    
    // Usar el composable
    const { pokemonsList } = usePokemonFavorite()
    
    // Verificar estado inicial
    expect(pokemonsList.value).toHaveLength(3)
    
    // Reemplazar completamente el objeto reactivo
    Object.keys(favorites).forEach(key => {
      delete favorites[key as keyof typeof favorites]
    })
    
    const newFavorites = {
      'pikachu': true,
      'bulbasaur': true
    }
    
    Object.entries(newFavorites).forEach(([key, value]) => {
      favorites[key as keyof typeof favorites] = value
    })
    
    // Forzar la actualización del ciclo de Vue
    await nextTick()
    // Avanzar todos los temporizadores pendientes
    vi.runAllTimers()
    // Otra actualización del ciclo de Vue
    await nextTick()
    
    // Verificar que la lista se actualizó
    expect(pokemonsList.value).toHaveLength(2)
    expect(pokemonsList.value).toContain('pikachu')
    expect(pokemonsList.value).toContain('bulbasaur')
    expect(pokemonsList.value).not.toContain('charizard')
  })
})
