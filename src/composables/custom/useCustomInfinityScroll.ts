import { ref, onMounted, onUnmounted } from 'vue';

export const useCustomInfinityScroll = <T>(
  fetchFunction: (page: number, limit: number) => Promise<T[] | void>,
  options = {
    limit: 10,
    scrollOffset: 100,
    container: null as HTMLElement | null
  }
) => {
  const page = ref(1);
  const loading = ref(false);
  const items = ref<T[]>([]);
  const hasMore = ref(true);
  
  const loadItems = async () => {
    if (loading.value || !hasMore.value) return;
    
    loading.value = true;
    
    try {
      const newItems = await fetchFunction(page.value, options.limit);
      
      if (newItems) {
        if (Array.isArray(newItems)) {
          if (newItems.length < options.limit) {
            hasMore.value = false;
          }
          items.value = [...items.value, ...newItems] as T[];
        }
      }
      
      page.value++;
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const checkScroll = () => {
    const element = options.container || document.documentElement;
    const windowHeight = window.innerHeight;
    const documentHeight = element.scrollHeight;
    const scrollTop = window.scrollY || element.scrollTop;
    
    const scrolledToBottom = (windowHeight + scrollTop + options.scrollOffset) >= documentHeight;
    
    if (scrolledToBottom && !loading.value) {
      loadItems();
    }
  };
  
  onMounted(() => {
    loadItems();
    
    const scrollTarget = options.container || window;
    scrollTarget.addEventListener('scroll', checkScroll);
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        setTimeout(checkScroll, 100);
      }
    });
  });
  
  onUnmounted(() => {
    const scrollTarget = options.container || window;
    scrollTarget.removeEventListener('scroll', checkScroll);
    document.removeEventListener('visibilitychange', () => {});
  });
  
  return {
    items,
    loading,
    hasMore,
    loadItems
  };
};
