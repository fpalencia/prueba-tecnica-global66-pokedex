import { ref, computed, type Ref, onMounted, watch } from 'vue'

type VirtualListOptions = {
  itemHeight: number
  overscan?: number
}

export const useCustomVirtualList = <T = any>(list: Ref<T[]>, options: VirtualListOptions) => {
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)
  const internalList = ref<T[]>([])

  const overscan = options.overscan || 5
  const itemHeight = options.itemHeight

  // Observar cambios en la lista y actualizar la lista interna
  watch(list, (newList) => {
    internalList.value = Array.isArray(newList) ? newList : []
  }, { immediate: true, deep: true })

  onMounted(() => {
    if (containerRef.value) {
      viewportHeight.value = containerRef.value.clientHeight
    }
  })

  const visibleItems = computed(() => {
    if (!containerRef.value || !internalList.value || internalList.value.length === 0) {
      return internalList.value ? internalList.value.map((item, index) => ({
        data: item,
        index: index
      })) : []
    }
    
    const start = Math.floor(scrollTop.value / itemHeight)
    const visibleCount = Math.ceil(viewportHeight.value / itemHeight)
    
    const startIndex = Math.max(0, start - overscan)
    const endIndex = Math.min(internalList.value.length, start + visibleCount + overscan)
    
    return internalList.value.slice(startIndex, endIndex).map((item, index) => ({
      data: item,
      index: startIndex + index
    }))
  })

  const wrapperStyle = computed(() => {
    const length = internalList.value?.length || 0
    return {
      height: `${length * itemHeight}px`,
      position: 'relative' as const,
      width: '100%'
    }
  })

  const containerStyle = computed(() => ({
    height: '100%',
    overflow: 'auto',
    width: '100%'
  }))

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
    viewportHeight.value = target.clientHeight
  }

  const containerProps = {
    ref: containerRef,
    style: containerStyle.value,
    onScroll: handleScroll
  }

  const wrapperProps = {
    style: wrapperStyle.value
  }

  return {
    list: visibleItems,
    containerProps,
    wrapperProps,
    fullList: internalList
  }
} 