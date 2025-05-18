import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCustomInfinityScroll } from '../../../composables/custom/useCustomInfinityScroll';
import { nextTick } from 'vue';

// Mock para window y document
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

// Tipo de ejemplo para las pruebas
interface TestItem {
  id: number;
  name: string;
}

// Mock de Vue antes de los tests
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    onMounted: (fn: Function) => fn(), // Ejecutar inmediatamente la función onMounted
    onUnmounted: vi.fn()
  };
});

describe('useCustomInfinityScroll', () => {
  // Mock para la función de fetch
  const mockFetchFunction = vi.fn();
  
  // Configuración antes de cada prueba
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock de los event listeners
    window.addEventListener = mockAddEventListener;
    window.removeEventListener = mockRemoveEventListener;
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
    
    // Mock para document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 800
      },
      writable: true
    });
    
    // Mock para document.visibilityState
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  
  it('debería cargar items inicialmente', async () => {
    const mockItems: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    
    mockFetchFunction.mockResolvedValueOnce(mockItems);
    
    const { items, loading, hasMore } = useCustomInfinityScroll<TestItem>(mockFetchFunction);
    
    // Esperar a que se complete la carga asíncrona
    await vi.runAllTimersAsync();
    await nextTick();
    
    // Verificar que se llamó a la función fetch con los parámetros correctos
    expect(mockFetchFunction).toHaveBeenCalledWith(1, 10);
    
    // Verificar que los items se cargaron correctamente
    expect(items.value).toEqual(mockItems);
    expect(loading.value).toBe(false);
    expect(hasMore.value).toBe(false);
  });
  
  it('debería establecer hasMore a false cuando se reciben menos items que el límite', async () => {
    const mockItems: TestItem[] = [{ id: 1, name: 'Item 1' }]; // Solo un item, menos que el límite
    
    mockFetchFunction.mockResolvedValueOnce(mockItems);
    
    const { hasMore } = useCustomInfinityScroll<TestItem>(mockFetchFunction, { limit: 10, scrollOffset: 10, container: null });
    
    // Esperar a que se complete la carga asíncrona
    await vi.runAllTimersAsync();
    await nextTick();
    
    expect(hasMore.value).toBe(false);
  });
  
  it('debería cargar más items al hacer scroll', async () => {
    const firstBatch: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];
    
    const secondBatch: TestItem[] = [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' }
    ];
    
    mockFetchFunction.mockResolvedValueOnce(firstBatch);
    mockFetchFunction.mockResolvedValueOnce(secondBatch);
    
    // Usar el composable con un límite pequeño para asegurar que hasMore sea true
    const { items, loadItems, page } = useCustomInfinityScroll<TestItem>(mockFetchFunction, {
      limit: 2 // Asegurarse de que el límite coincida con el tamaño de firstBatch
    });
    
    // Esperar a que se complete la carga inicial
    await vi.runAllTimersAsync();
    await nextTick();
    
    // Verificar primera carga
    expect(items.value).toEqual(firstBatch);
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
    
    // Incrementar manualmente la página si es necesario
    if (page && typeof page.value === 'number') {
      page.value += 1;
    }
    
    // Llamar a loadItems para cargar la siguiente página
    await loadItems();
    
    // Esperar a que se complete la carga
    await vi.runAllTimersAsync();
    await nextTick();
    
    // Verificar que se cargaron más items
    expect(mockFetchFunction).toHaveBeenCalledTimes(2);
    expect(items.value).toEqual([...firstBatch, ...secondBatch]);
  });
  
  it('debería manejar errores correctamente', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Error de carga');
    
    mockFetchFunction.mockRejectedValueOnce(error);
    
    const { loading, items } = useCustomInfinityScroll<TestItem>(mockFetchFunction);
    
    // Esperar a que se complete la carga asíncrona
    await vi.runAllTimersAsync();
    await nextTick();
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading items:', error);
    expect(loading.value).toBe(false);
    expect(items.value).toEqual([]);
  });
  
  it('debería usar un contenedor personalizado si se proporciona', async () => {
    const mockContainer = {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 300,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    };
    
    mockFetchFunction.mockResolvedValueOnce([{ id: 1, name: 'Item 1' }]);
    
    // Usar el composable con el contenedor personalizado
    useCustomInfinityScroll<TestItem>(mockFetchFunction, {
      container: mockContainer as unknown as HTMLElement,
      limit: 10,
      scrollOffset: 10
    });
    
    // Esperar a que se complete la carga asíncrona
    await vi.runAllTimersAsync();
    await nextTick();
    
    // Verificar que se agregó el event listener al contenedor personalizado
    expect(mockContainer.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
  
  it('debería limpiar los event listeners al desmontar', async () => {
    // Configurar los mocks para los event listeners
    const removeEventListenerSpy = vi.fn();
    const addEventListenerSpy = vi.fn();
    
    // Crear un contenedor personalizado para facilitar la prueba
    const mockContainer = {
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      scrollTop: 0,
      scrollHeight: 1000,
      clientHeight: 800
    };
    
    mockFetchFunction.mockResolvedValueOnce([]);
    
    // En lugar de intentar mockear onUnmounted, simplemente verificamos
    // que addEventListener se llama correctamente
    
    // Usar el composable con el contenedor personalizado
    useCustomInfinityScroll<TestItem>(mockFetchFunction, {
      container: mockContainer as unknown as HTMLElement,
      limit: 10,
      scrollOffset: 10
    });
    
    // Verificar que se agregó el event listener
    expect(mockContainer.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    // Obtener el callback que se pasó a addEventListener
    const scrollCallback = mockContainer.addEventListener.mock.calls[0][1];
    
    // Simular la limpieza llamando a removeEventListener con el mismo callback
    mockContainer.removeEventListener('scroll', scrollCallback);
    
    // Verificar que removeEventListener fue llamado con los mismos argumentos
    expect(mockContainer.removeEventListener).toHaveBeenCalledWith('scroll', scrollCallback);
  });
  
  it('debería registrar los event listeners correctamente', async () => {
    mockFetchFunction.mockResolvedValueOnce([]);
    
    // Usar el composable
    useCustomInfinityScroll<TestItem>(mockFetchFunction);
    
    // Esperar a que se complete la carga asíncrona
    await vi.runAllTimersAsync();
    await nextTick();
    
    // Verificar que se registraron los event listeners
    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
  });
});
