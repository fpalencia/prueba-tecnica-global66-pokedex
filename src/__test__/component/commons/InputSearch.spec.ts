import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InputSearch from '../../../components/commons/InputSearch.vue'
import { createPinia, setActivePinia } from 'pinia'
import { usePokemonStore } from '../../../store/usePokemonStore'

// Mock del store Pinia
vi.mock('../../../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn()
}))

describe('InputSearch', () => {
  const mockSetSearchTerm = vi.fn()
  
  beforeEach(() => {
    // Crear y establecer una instancia de Pinia para las pruebas
    setActivePinia(createPinia())
    
    vi.resetAllMocks()
    
    // Configuración por defecto del mock del store
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm
    } as any)
  })
  
  it('should render correctly with empty search value', () => {
    const wrapper = mount(InputSearch)
    
    // Verificar que el input existe
    const input = wrapper.find('input[name="search"]')
    expect(input.exists()).toBe(true)
    
    // Verificar que el botón de limpiar no se muestra cuando searchTerm está vacío
    const clearButton = wrapper.find('button[aria-label="Limpiar búsqueda"]')
    expect(clearButton.exists()).toBe(false)
  })
  
  it('should show clear button when searchTerm is not empty', async () => {
    // Mock con un valor de búsqueda
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: 'pikachu',
      setSearchTerm: mockSetSearchTerm
    } as any)
    
    const wrapper = mount(InputSearch)
    
    // Verificar que el botón de limpiar se muestra
    const clearButton = wrapper.find('button[aria-label="Limpiar búsqueda"]')
    expect(clearButton.exists()).toBe(true)
  })
  
  it('should call setSearchTerm when clearing search', async () => {
    // Mock con un valor de búsqueda para que se muestre el botón de limpiar
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: 'pikachu',
      setSearchTerm: mockSetSearchTerm
    } as any)
    
    const wrapper = mount(InputSearch)
    
    // Hacer clic en el botón de limpiar
    await wrapper.find('button[aria-label="Limpiar búsqueda"]').trigger('click')
    
    // Verificar que se llamó a setSearchTerm con una cadena vacía
    expect(mockSetSearchTerm).toHaveBeenCalledTimes(1)
    expect(mockSetSearchTerm).toHaveBeenCalledWith('')
  })
  
  it('should have the correct placeholder text', () => {
    const wrapper = mount(InputSearch)
    
    const input = wrapper.find('input[name="search"]')
    expect(input.attributes('placeholder')).toBe('Search')
  })
  
  it('should have the correct accessibility attributes', () => {
    // Mock con un valor de búsqueda para que se muestre el botón de limpiar
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: 'pikachu',
      setSearchTerm: mockSetSearchTerm
    } as any)
    
    const wrapper = mount(InputSearch)
    
    // Verificar atributo aria-label del botón de limpiar
    const clearButton = wrapper.find('button')
    expect(clearButton.attributes('aria-label')).toBe('Limpiar búsqueda')
  })
})
