import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonsView from '../../../views/pokemons/PokemonsView.vue';
import IconPokeball from '../../../assets/icons/IconPokeball.vue';
import PokemonList from '../../../components/pokemon/PokemonList.vue';
import { usePokemons } from '../../../composables/pokemons/usePokemons';
import { ref, computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { usePokemonStore } from '../../../store/usePokemonStore';

// Mock de los componentes y composables
vi.mock('../../../assets/icons/IconPokeball.vue', () => ({
  default: {
    name: 'IconPokeball',
    template: '<div data-testid="icon-pokeball"></div>'
  }
}));

vi.mock('../../../components/pokemon/PokemonList.vue', () => ({
  default: {
    name: 'PokemonList',
    props: {
      pokemons: Array
    },
    template: '<div data-testid="pokemon-list">{{ pokemons.length }} pokemons</div>'
  }
}));

vi.mock('../../../composables/pokemons/usePokemons', () => ({
  usePokemons: vi.fn()
}));

// Mock del store
vi.mock('../../../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn()
}));

// Crear un router mock para las pruebas
const createTestRouter = () => createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/pokemons', name: 'pokemons', component: { template: '<div></div>' } },
    { path: '/search', name: 'pokemon-search', component: { template: '<div></div>' } },
  ]
});

describe('PokemonsView', () => {
  let router;
  const mockGetFilteredPokemonList = vi.fn();
  const mockSetSearchTerm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Configurar Pinia para las pruebas
    setActivePinia(createPinia());
    // Configurar router para las pruebas
    router = createTestRouter();
    
    // Configurar mock del store por defecto
    mockGetFilteredPokemonList.mockReturnValue([]);
    vi.mocked(usePokemonStore).mockReturnValue({
      getFilteredPokemonList: mockGetFilteredPokemonList,
      setSearchTerm: mockSetSearchTerm
    } as any);
  });

  it('muestra el spinner de carga cuando initialLoad es true', () => {
    // Configurar el mock del composable para el estado de carga inicial
    vi.mocked(usePokemons).mockReturnValue({
      initialLoad: ref(true)
    } as any);

    const wrapper = mount(PokemonsView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.findComponent(IconPokeball).exists()).toBe(true);
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.findComponent(PokemonList).exists()).toBe(false);
  });

  it('muestra la lista de pokemons cuando initialLoad es false', () => {
    // Mock de la lista de Pokémons filtrada
    const pokemonList = ['bulbasaur', 'charmander', 'squirtle'];
    mockGetFilteredPokemonList.mockReturnValue(pokemonList);
    
    // Configurar el mock del composable para el estado cuando los datos están cargados
    vi.mocked(usePokemons).mockReturnValue({
      initialLoad: ref(false)
    } as any);

    const wrapper = mount(PokemonsView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    expect(wrapper.findComponent(PokemonList).props('pokemons')).toEqual(pokemonList);
  });

  it('muestra mensaje cuando la lista filtrada está vacía', () => {
    // Mock de la lista de Pokémons filtrada vacía
    mockGetFilteredPokemonList.mockReturnValue([]);
    
    // Configurar el mock del composable para el estado cuando no hay resultados
    vi.mocked(usePokemons).mockReturnValue({
      initialLoad: ref(false)
    } as any);

    const wrapper = mount(PokemonsView, {
      global: {
        plugins: [router]
      }
    });
    
    // Verificar que el PokemonList no se muestra
    expect(wrapper.findComponent(PokemonList).exists()).toBe(false);
    
    // Verificar que se muestra el mensaje de "Uh-oh!"
    expect(wrapper.text()).toContain('Uh-oh!');
    expect(wrapper.text()).toContain('You look lost on your journey!');
    
    // Verificar que existe el botón de "Go back home"
    expect(wrapper.find('button').text()).toContain('Go back home');
  });

  it('navega a home y limpia la búsqueda al hacer clic en "Go back home"', async () => {
    // Mock de la lista de Pokémons filtrada vacía
    mockGetFilteredPokemonList.mockReturnValue([]);
    
    // Configurar el mock del composable para el estado cuando no hay resultados
    vi.mocked(usePokemons).mockReturnValue({
      initialLoad: ref(false)
    } as any);

    // Espiar el método push del router
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(PokemonsView, {
      global: {
        plugins: [router]
      }
    });
    
    // Hacer clic en el botón "Go back home"
    await wrapper.find('button').trigger('click');
    
    // Verificar que se llamó a router.push con los parámetros correctos
    expect(pushSpy).toHaveBeenCalledWith({ name: 'home' });
    
    // Verificar que se limpió el término de búsqueda
    expect(mockSetSearchTerm).toHaveBeenCalledWith('');
  });
});
