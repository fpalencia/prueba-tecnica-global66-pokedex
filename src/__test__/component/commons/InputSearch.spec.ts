import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InputSearch from '../../../components/commons/InputSearch.vue'
import { usePokemonSearch } from '../../../composables/pokemons/usePokemonSearch'
import { ref, nextTick } from 'vue'

// Mock del composable usePokemonSearch
vi.mock('../../../composables/pokemons/usePokemonSearch', () => ({
  usePokemonSearch: vi.fn()
}))

describe('InputSearch', () => {
  const mockHandleSearch = vi.fn()
  const mockClearSearch = vi.fn()
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Configuración por defecto del mock
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue: ref(''),
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
  })
  
  it('should render correctly with empty search value', () => {
    const wrapper = mount(InputSearch)
    
    // Verificar que el input existe
    const input = wrapper.find('input[name="search"]')
    expect(input.exists()).toBe(true)
    
    // Verificar que el botón de limpiar no se muestra cuando searchValue está vacío
    const clearButton = wrapper.find('button[aria-label="Limpiar búsqueda"]')
    expect(clearButton.exists()).toBe(false)
  })
  
  it('should show clear button when searchValue is not empty', async () => {
    // Mock con un valor de búsqueda
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue: ref('pikachu'),
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
    
    const wrapper = mount(InputSearch)
    
    // Verificar que el botón de limpiar se muestra
    const clearButton = wrapper.find('button[aria-label="Limpiar búsqueda"]')
    expect(clearButton.exists()).toBe(true)
  })
  
  it('should call handleSearch when Enter key is pressed', async () => {
    // Mock con un valor de búsqueda
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue: ref('pikachu'),
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
    
    const wrapper = mount(InputSearch)
    
    // Simular presionar Enter en el input
    await wrapper.find('input[name="search"]').trigger('keyup.enter')
    
    // Verificar que se llamó a handleSearch
    expect(mockHandleSearch).toHaveBeenCalledTimes(1)
  })
  
  it('should call clearSearch when clear button is clicked', async () => {
    // Mock con un valor de búsqueda para que se muestre el botón de limpiar
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue: ref('pikachu'),
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
    
    const wrapper = mount(InputSearch)
    
    // Hacer clic en el botón de limpiar
    await wrapper.find('button[aria-label="Limpiar búsqueda"]').trigger('click')
    
    // Verificar que se llamó a clearSearch
    expect(mockClearSearch).toHaveBeenCalledTimes(1)
  })
  
  it('should update input value when searchValue changes', async () => {
    // Crear un ref reactivo para searchValue
    const searchValue = ref('')
    
    // Configurar el mock para usar el ref
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue,
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
    
    const wrapper = mount(InputSearch)
    
    // Verificar valor inicial
    expect(wrapper.find('input[name="search"]').element.value).toBe('') 
    
    // Actualizar el valor del ref
    searchValue.value = 'bulbasaur'
    
    // Esperar a que Vue procese los cambios reactivos
    await nextTick()
    
    // Verificar que el input se actualiza
    expect(wrapper.find('input[name="search"]').element.value).toBe('bulbasaur')
  })
  
  it('should have the correct placeholder text', () => {
    const wrapper = mount(InputSearch)
    
    const input = wrapper.find('input[name="search"]')
    expect(input.attributes('placeholder')).toBe('Search')
  })
  
  it('should have the correct accessibility attributes', () => {
    // Mock con un valor de búsqueda para que se muestre el botón de limpiar
    vi.mocked(usePokemonSearch).mockReturnValue({
      searchValue: ref('pikachu'),
      handleSearch: mockHandleSearch,
      clearSearch: mockClearSearch
    })
    
    const wrapper = mount(InputSearch)
    
    // Verificar atributo aria-label del botón de limpiar
    const clearButton = wrapper.find('button')
    expect(clearButton.attributes('aria-label')).toBe('Limpiar búsqueda')
  })
})
