import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonButtons from '../../../../../components/commons/modal/components/SkeletonButtons.vue'

describe('SkeletonButtons', () => {
  it('renders skeleton button placeholders correctly', () => {
    const wrapper = mount(SkeletonButtons)
    
    // Check if component renders
    expect(wrapper.exists()).toBe(true)
    
    // Check container has proper flex layout
    const container = wrapper.find('div')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('justify-between')
    expect(container.classes()).toContain('w-full')
    
    // Check if it renders two button placeholders
    const skeletonButtons = wrapper.findAll('.bg-gray-200')
    expect(skeletonButtons.length).toBe(2)
    
    // Check first button (share button placeholder)
    const shareButton = skeletonButtons[0]
    expect(shareButton.classes()).toContain('w-40')
    expect(shareButton.classes()).toContain('rounded-full')
    expect(shareButton.classes()).toContain('animate-pulse')
    
    // Check second button (favorite button placeholder)
    const favoriteButton = skeletonButtons[1]
    expect(favoriteButton.classes()).toContain('w-10')
    expect(favoriteButton.classes()).toContain('rounded-full')
    expect(favoriteButton.classes()).toContain('animate-pulse')
  })
})
