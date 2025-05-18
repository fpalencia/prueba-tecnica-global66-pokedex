import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, h } from 'vue'
import { useCustomVirtualList } from '../../../composables/custom/useCustomVirtualList'

describe('useCustomVirtualList', () => {
  // Mock para clientHeight
  const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
  
  beforeEach(() => {
    // Restaurar el mock después de cada prueba
    if (originalClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
    }
  })

  it('should initialize with empty list', () => {
    const TestComponent = defineComponent({
      setup() {
        const list = ref([])
        const { list: visibleItems, containerProps, wrapperProps } = useCustomVirtualList(list, { itemHeight: 30 })
        
        return { visibleItems, containerProps, wrapperProps }
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.visibleItems).toEqual([])
  })

  it('should render visible items based on container height', async () => {
    // Mock clientHeight
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get: function() {
        return 300 // Altura para mostrar 10 elementos (300/30)
      }
    })

    const mockItems = Array.from({ length: 100 }, (_, i) => ({ id: i, text: `Item ${i}` }))
    
    const TestComponent = defineComponent({
      setup() {
        const list = ref(mockItems)
        const { list: visibleItems, containerProps, wrapperProps, fullList } = useCustomVirtualList(list, { 
          itemHeight: 30,
          overscan: 2
        })
        
        return { visibleItems, containerProps, wrapperProps, fullList }
      },
      render() {
        return h('div', {
          ...this.containerProps
        }, [
          h('div', {
            ...this.wrapperProps
          })
        ])
      }
    })

    const wrapper = mount(TestComponent)
    
    // Verificar que la lista completa tiene todos los elementos
    expect(wrapper.vm.fullList.length).toBe(100)
    
    // Verificar que solo se muestran los elementos visibles + overscan
    // Con altura 300, itemHeight 30, y overscan 2, deberíamos ver 10 + 2 = 12 elementos
    expect(wrapper.vm.visibleItems.length).toBe(12)
  })

  it('should update visible items on scroll', async () => {
    // Mock clientHeight
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      get: function() {
        return 300
      }
    })

    const mockItems = Array.from({ length: 100 }, (_, i) => ({ id: i, text: `Item ${i}` }))
    
    const TestComponent = defineComponent({
      setup() {
        const list = ref(mockItems)
        const { list: visibleItems, containerProps, wrapperProps } = useCustomVirtualList(list, { 
          itemHeight: 30,
          overscan: 2
        })
        
        return { visibleItems, containerProps, wrapperProps }
      },
      render() {
        return h('div', {
          ...this.containerProps
        }, [
          h('div', {
            ...this.wrapperProps
          })
        ])
      }
    })

    const wrapper = mount(TestComponent)
    
    // Simular scroll
    const container = wrapper.find('div').element
    Object.defineProperty(container, 'scrollTop', { value: 300, configurable: true })
    
    await wrapper.find('div').trigger('scroll')
    
    // Después del scroll, deberíamos ver elementos diferentes
    // Con scrollTop 300 y itemHeight 30, deberíamos empezar desde el índice 10
    expect(wrapper.vm.visibleItems[0].index).toBe(8) // 10 (scroll position) - 2 (overscan)
  })

  it('should update when list changes', async () => {
    const TestComponent = defineComponent({
      setup() {
        const list = ref([{ id: 1, text: 'Item 1' }])
        const { list: visibleItems, containerProps, wrapperProps, fullList } = useCustomVirtualList(list, { 
          itemHeight: 30
        })
        
        return { list, visibleItems, containerProps, wrapperProps, fullList }
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.fullList.length).toBe(1)
    
    // Actualizar la lista directamente modificando la ref
    wrapper.vm.list = [
      { id: 1, text: 'Item 1' },
      { id: 2, text: 'Item 2' },
      { id: 3, text: 'Item 3' }
    ]
    
    await wrapper.vm.$nextTick()
    
    // Verificar que la lista interna se actualizó
    expect(wrapper.vm.fullList.length).toBe(3)
  })

  it('should calculate correct wrapper style', () => {
    const mockItems = Array.from({ length: 50 }, (_, i) => ({ id: i, text: `Item ${i}` }))
    
    const TestComponent = defineComponent({
      setup() {
        const list = ref(mockItems)
        const { wrapperProps } = useCustomVirtualList(list, { itemHeight: 30 })
        
        return { wrapperProps }
      },
      render() {
        return h('div')
      }
    })

    const wrapper = mount(TestComponent)
    
    // La altura del wrapper debe ser el número de elementos * altura del elemento
    expect(wrapper.vm.wrapperProps.style.height).toBe('1500px') // 50 * 30
    expect(wrapper.vm.wrapperProps.style.position).toBe('relative')
    expect(wrapper.vm.wrapperProps.style.width).toBe('100%')
  })
})
