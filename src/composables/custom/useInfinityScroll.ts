import { ref, onMounted, onUnmounted } from 'vue';

export const useInfinityScroll = <T>(
  fetchFunction: (page: number, limit: number) => Promise<T[] | void>,
  options = {
    limit: 10,
    scrollOffset: 20,
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
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    if (scrollTop + clientHeight >= scrollHeight - options.scrollOffset) {
      loadItems();
    }
  };
  
  onMounted(() => {
    loadItems();
    window.addEventListener('scroll', checkScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll);
  });
  
  return {
    items,
    loading,
    hasMore,
    loadItems
  };
};
