import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonAttributes from '../../../../../components/commons/modal/components/SkeletonAttributes.vue'

describe('SkeletonAttributes', () => {
  it('renders 4 skeleton items', () => {
    const wrapper = mount(SkeletonAttributes)
    
    // Check if component renders
    expect(wrapper.exists()).toBe(true)
    
    // Check if it renders 4 skeleton items
    const skeletonItems = wrapper.findAll('.py-2.border-b')
    expect(skeletonItems.length).toBe(4)
    
    // Check if each item has the expected structure
    skeletonItems.forEach(item => {
      expect(item.find('.bg-gray-200.w-20').exists()).toBe(true)
      expect(item.find('.bg-gray-200.w-40').exists()).toBe(true)
    })
  })
  
  it('has animate-pulse class for loading animation', () => {
    const wrapper = mount(SkeletonAttributes)
    const animatedElements = wrapper.findAll('.animate-pulse')
    expect(animatedElements.length).toBe(4)
  })
})
