import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loading from '../../../components/commons/Loading.vue'
import IconPokeball from '../../../assets/icons/IconPokeball.vue'

describe('Loading', () => {
  it('should render correctly', () => {
    const wrapper = mount(Loading)
    
    // Verificar que el componente se renderiza
    expect(wrapper.exists()).toBe(true)
    
    // Verificar que contiene un div con las clases correctas
    const container = wrapper.find('div')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('justify-center')
    expect(container.classes()).toContain('h-screen')
  })
  
  it('should contain the IconPokeball component', () => {
    const wrapper = mount(Loading)
    
    // Verificar que contiene el componente IconPokeball
    const iconPokeball = wrapper.findComponent(IconPokeball)
    expect(iconPokeball.exists()).toBe(true)
  })
  
  it('should apply animation classes to the IconPokeball', () => {
    const wrapper = mount(Loading)
    
    // Verificar que el IconPokeball tiene las clases correctas
    const iconPokeball = wrapper.findComponent(IconPokeball)
    expect(iconPokeball.classes()).toContain('w-10')
    expect(iconPokeball.classes()).toContain('h-10')
    expect(iconPokeball.classes()).toContain('animate-bounce')
  })
})
