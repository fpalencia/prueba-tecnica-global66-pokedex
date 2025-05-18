import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../../views/HomeView.vue'
import IconPikachu from '../../assets/icons/IconPikachu.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mocks para los módulos
const mockRouterPush = vi.fn()
const mockSetInitialLoad = vi.fn()

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

// Mock del store
vi.mock('../../store/usePokemonStore', () => ({
  usePokemonStore: () => ({
    setInitialLoad: mockSetInitialLoad
  })
}))

describe('HomeView', () => {
  // Configurar Pinia antes de cada prueba
  beforeEach(() => {
    setActivePinia(createPinia())
    // Limpiar los mocks entre pruebas
    vi.clearAllMocks()
  })

  it('renderiza correctamente', () => {
    const wrapper = mount(HomeView, {
      global: {
        components: { IconPikachu }
      }
    })

    // Verificar que el título está presente
    expect(wrapper.find('h1').text()).toBe('Welcome to Pokédex')
    
    // Verificar que el párrafo descriptivo está presente
    expect(wrapper.find('p').text()).toContain('The digital encyclopedia created by Professor Oak')
    
    // Verificar que el botón está presente
    expect(wrapper.find('button').text()).toBe('Get started')
    
    // Verificar que el icono de Pikachu está presente
    expect(wrapper.findComponent(IconPikachu).exists()).toBe(true)
  })

  it('navega a /pokemons y establece initialLoad cuando se hace clic en el botón', async () => {
    const wrapper = mount(HomeView, {
      global: {
        components: { IconPikachu }
      }
    })
    
    // Hacer clic en el botón "Get started"
    await wrapper.find('button').trigger('click')
    
    // Verificar que se llamaron los métodos correctos
    expect(mockSetInitialLoad).toHaveBeenCalledWith(true)
    expect(mockRouterPush).toHaveBeenCalledWith('/pokemons')
  })
})
