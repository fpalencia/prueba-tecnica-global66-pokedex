import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonSearchView from '../../../views/pokemon-search/PokemonSearchView.vue';
import IconPokeball from '../../../assets/icons/IconPokeball.vue';
import PokemonItem from '../../../components/pokemon/PokemonItem.vue';
import { usePokemonItem } from '../../../composables/pokemons/usePokemonItem';
import { ref } from 'vue';

// Mock de los componentes y composables
vi.mock('../../../components/icons/IconPokeball.vue', () => ({
  default: {
    name: 'IconPokeball',
    template: '<div data-testid="icon-pokeball"></div>'
  }
}));

vi.mock('../../../components/pokemon/PokemonItem.vue', () => ({
  default: {
    name: 'PokemonItem',
    props: {
      pokemon: String
    },
    template: '<div data-testid="pokemon-item">{{ pokemon }}</div>'
  }
}));

vi.mock('../../../composables/pokemons/usePokemonItem', () => ({
  usePokemonItem: vi.fn()
}));

// Mock del router de Vue
const mockRouter = {
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    query: { name: 'pikachu' }
  })),
  useRouter: vi.fn(() => mockRouter)
}));

describe('PokemonSearchView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el estado de carga cuando isLoading es true', async () => {
    // Configurar el mock del composable para el estado de carga
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(true),
      isError: ref(false),
      pokemon: ref({ id: 25, name: 'pikachu', weight: 60, height: 4, types: ['electric'], frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }),
      errorMessage: ref(null),
      isFetching: ref(false)
    });

    const wrapper = mount(PokemonSearchView);
    
    expect(wrapper.findComponent(IconPokeball).exists()).toBe(true);
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.findComponent(PokemonItem).exists()).toBe(true);
  });

  it('muestra el mensaje de error cuando isError es true', async () => {
    // Configurar el mock del composable para el estado de error
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isError: ref(true),
      pokemon: ref({ id: 25, name: 'pikachu', weight: 60, height: 4, types: ['electric'], frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }),
      errorMessage: ref(null),
      isFetching: ref(false)
    });

    const wrapper = mount(PokemonSearchView);
    
    expect(wrapper.text()).toContain('Uh-oh!');
    expect(wrapper.text()).toContain('You look lost on your journey!');
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.findComponent(PokemonItem).exists()).toBe(true);
  });

  it('muestra el PokemonItem cuando se encuentra un pokemon', async () => {
    // Configurar el mock del composable para el estado de éxito
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      pokemon: ref({ id: 25, name: 'pikachu', weight: 60, height: 4, types: ['electric'], frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }),
      errorMessage: ref(null),
      isFetching: ref(false)
    });

    const wrapper = mount(PokemonSearchView);
    
    expect(wrapper.findComponent(PokemonItem).exists()).toBe(true);
    expect(wrapper.findComponent(PokemonItem).props('pokemon')).toBe('pikachu');
  });

  it('navega a la página principal al hacer clic en el botón de volver', async () => {
    // Configurar el mock del composable para el estado de error
    vi.mocked(usePokemonItem).mockReturnValue({
      isLoading: ref(false),
      isError: ref(true),
      pokemon: ref({ id: 25, name: 'pikachu', weight: 60, height: 4, types: ['electric'], frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }),
      errorMessage: ref(null),
      isFetching: ref(false)
    });

    const wrapper = mount(PokemonSearchView);
    
    // Hacer clic en el botón de volver
    await wrapper.find('button').trigger('click');
    
    // Verificar que se llamó al router con los parámetros correctos
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'home' });
  });

  it('actualiza searchValue cuando cambia el query parameter', async () => {
    // Configurar el mock del composable
    const mockUsePokemonItem = vi.fn().mockReturnValue({
      isLoading: ref(false),
      isError: ref(false),
      pokemon: ref({ id: 25, name: 'pikachu', weight: 60, height: 4, types: ['electric'], frontSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' }),
      errorMessage: ref(null),
      isFetching: ref(false)
    });
    
    vi.mocked(usePokemonItem).mockImplementation(mockUsePokemonItem);

    // Simular que el query parameter es 'pikachu'
    vi.mock('vue-router', () => ({
      useRoute: vi.fn(() => ({
        query: { name: 'pikachu' }
      })),
      useRouter: vi.fn(() => mockRouter)
    }));

    mount(PokemonSearchView);
    
    // Verificar que usePokemonItem fue llamado con el valor correcto
    expect(mockUsePokemonItem).toHaveBeenCalledWith(expect.objectContaining({
      value: 'pikachu'
    }));
  });
});
