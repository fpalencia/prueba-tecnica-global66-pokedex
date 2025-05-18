import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useCustomLocalStorage } from '../../../composables/custom/useCustomLocalStorage';
import { nextTick } from 'vue';

describe('useCustomLocalStorage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: () => {
        store = {};
      }
    };
  })();

  // Replace the global localStorage with our mock
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use default value when localStorage is empty', () => {
    const defaultValue = { name: 'test' };
    const value = useCustomLocalStorage('testKey', defaultValue);
    
    expect(value.value).toEqual(defaultValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should use value from localStorage when available', () => {
    const storedValue = { name: 'stored' };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(storedValue));
    
    const value = useCustomLocalStorage('testKey', { name: 'default' });
    
    expect(value.value).toEqual(storedValue);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should update localStorage when value changes', async () => {
    const value = useCustomLocalStorage('testKey', { name: 'initial' });
    
    value.value = { name: 'updated' };
    await nextTick();
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify({ name: 'updated' })
    );
  });

  it('should handle primitive values', async () => {
    const value = useCustomLocalStorage<string>('stringKey', 'default');
    
    expect(value.value).toBe('default');
    
    value.value = 'changed';
    await nextTick();
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'stringKey',
      JSON.stringify('changed')
    );
  });

  it('should handle null default values', () => {
    const value = useCustomLocalStorage<null>('nullKey');
    expect(value.value).toBeNull();
  });
});
