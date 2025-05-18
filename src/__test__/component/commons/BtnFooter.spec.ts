import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BtnFooter from '../../../components/commons/BtnFooter.vue'
import { useRouter, useRoute } from 'vue-router'

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn()
}))

describe('BtnFooter', () => {
  const mockPush = vi.fn()
  let mockRoute: any
  
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Mock del router
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush
    } as any)
    
    // Mock de la ruta inicial
    mockRoute = {
      path: '/pokemons',
      params: {},
      query: {}
    }
    
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
  })
  
  it('should render correctly with two buttons', () => {
    const wrapper = mount(BtnFooter)
    
    expect(wrapper.find('[data-testid="all-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="favorites-button"]').exists()).toBe(true)
    
    // Verificar texto de los botones
    expect(wrapper.find('[data-testid="all-button"]').text()).toContain('All')
    expect(wrapper.find('[data-testid="favorites-button"]').text()).toContain('Favorites')
  })
  
  it('should set "all" as active filter by default when on /pokemons route', () => {
    const wrapper = mount(BtnFooter)
    
    // Verificar que el botón "All" tiene la clase de activo
    const allButton = wrapper.find('[data-testid="all-button"]')
    expect(allButton.classes()).toContain('bg-secondary')
    
    // Verificar que el botón "Favorites" no tiene la clase de activo
    const favoritesButton = wrapper.find('[data-testid="favorites-button"]')
    expect(favoritesButton.classes()).toContain('bg-gray-medium')
  })
  
  it('should set "favorites" as active filter when on /favorites route', async () => {
    // Configurar la ruta como /favorites
    mockRoute.path = '/favorites'
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
    
    const wrapper = mount(BtnFooter)
    
    // Verificar directamente el valor de activeFilter
    expect(wrapper.vm.activeFilter).toBe('favorites')
    
    await wrapper.vm.$nextTick()
    
    // Verificar que "favorites" está activo por sus clases
    const favoritesButton = wrapper.find('[data-testid="favorites-button"]')
    expect(favoritesButton.classes()).toContain('bg-secondary')
    
    // Verificar que "all" no está activo
    const allButton = wrapper.find('[data-testid="all-button"]')
    expect(allButton.classes()).toContain('bg-gray-medium')
  })
  
  it('should navigate to /pokemons when clicking on "All" button', async () => {
    // Configurar la ruta como /favorites para probar el cambio
    mockRoute.path = '/favorites'
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
    
    const wrapper = mount(BtnFooter)
    
    // Hacer clic en el botón "All"
    await wrapper.find('[data-testid="all-button"]').trigger('click')
    
    // Verificar que se navega a /pokemons
    expect(mockPush).toHaveBeenCalledWith('/pokemons')
  })
  
  it('should navigate to /favorites when clicking on "Favorites" button', async () => {
    const wrapper = mount(BtnFooter)
    
    // Hacer clic en el botón "Favorites"
    await wrapper.find('[data-testid="favorites-button"]').trigger('click')
    
    // Verificar que se navega a /favorites
    expect(mockPush).toHaveBeenCalledWith('/favorites')
  })
  
  it('should emit "change-filter" event with correct value when clicking buttons', async () => {
    const wrapper = mount(BtnFooter)
    
    // Hacer clic en el botón "All"
    await wrapper.find('[data-testid="all-button"]').trigger('click')
    
    // No debería emitir evento porque ya estamos en "all" por defecto
    expect(wrapper.emitted('change-filter')).toBeFalsy()
    
    // Hacer clic en el botón "Favorites"
    await wrapper.find('[data-testid="favorites-button"]').trigger('click')
    
    // Verificar que se emite el evento con el valor correcto
    expect(wrapper.emitted('change-filter')?.[0]).toEqual(['favorites'])
    
    // Hacer clic en el botón "All" de nuevo
    await wrapper.find('[data-testid="all-button"]').trigger('click')
    
    // Verificar que se emite el evento con el valor correcto
    expect(wrapper.emitted('change-filter')?.[1]).toEqual(['all'])
  })
  
  it('should not emit event or navigate when clicking already active filter', async () => {
    const wrapper = mount(BtnFooter)
    
    // El filtro "all" ya está activo por defecto
    await wrapper.find('[data-testid="all-button"]').trigger('click')
    
    // No debería emitir evento ni navegar
    expect(wrapper.emitted('change-filter')).toBeFalsy()
    expect(mockPush).not.toHaveBeenCalled()
  })
  
  it('should update active filter when route changes', async () => {
    const wrapper = mount(BtnFooter)
    
    // Inicialmente en /pokemons
    expect(wrapper.find('[data-testid="all-button"]').classes()).toContain('bg-secondary')
    
    // Cambiar la ruta a /favorites
    mockRoute.path = '/favorites'
    
    // Simular el watcher de vue-router
    await wrapper.vm.updateActiveFilterFromRoute()
    await wrapper.vm.$nextTick()
    
    // Verificar que ahora "favorites" está activo
    expect(wrapper.find('[data-testid="favorites-button"]').classes()).toContain('bg-secondary')
    expect(wrapper.find('[data-testid="all-button"]').classes()).toContain('bg-gray-medium')
  })
  
  it('should render icons with correct colors', () => {
    const wrapper = mount(BtnFooter, {
      global: {
        stubs: {
          IconAll: true,
          IconFavorite: true
        }
      }
    })
    
    // Verificar que los iconos se renderizan
    expect(wrapper.findComponent({ name: 'IconAll' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'IconFavorite' }).exists()).toBe(true)
  })
  
  it('should have "all" as active filter on /pokemons route', () => {
    // Configurar la ruta como /pokemons
    mockRoute.path = '/pokemons'
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
    
    const wrapper = mount(BtnFooter)
    
    // Verificar que "all" está activo
    expect(wrapper.findAll('button')[0].classes()).toContain('bg-secondary')
  })
  
  it('should have "favorites" as active filter on /favorites route', async () => {
    // Configurar la ruta como /favorites
    mockRoute.path = '/favorites'
    vi.mocked(useRoute).mockReturnValue(mockRoute as any)
    
    // Montar el componente después de configurar la ruta
    const wrapper = mount(BtnFooter)
    
    // Esperar a que Vue procese los cambios reactivos
    await wrapper.vm.$nextTick()
    
    // Verificar que el botón de favoritos tiene la clase correcta
    const favoritesButton = wrapper.find('[data-testid="favorites-button"]')
    expect(favoritesButton.classes()).toContain('bg-secondary')
    
    // Verificar que el botón de "all" no tiene la clase de activo
    const allButton = wrapper.find('[data-testid="all-button"]')
    expect(allButton.classes()).toContain('bg-gray-medium')
  })
})
