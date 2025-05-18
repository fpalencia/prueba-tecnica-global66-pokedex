import { ref, watch, onMounted, type Ref } from 'vue';

export const useCustomLocalStorage = <T>(key: string, defaultValue: T = null as unknown as T): Ref<T> => {
  const storedValue = localStorage.getItem(key);
  const data = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue);

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  onMounted(() => {
    const initialValue = localStorage.getItem(key);
    if (initialValue) {
      data.value = JSON.parse(initialValue);
    }
  });

  return data as Ref<T>;
}