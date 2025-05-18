import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonsFavoriteView from '../../../views/pokemons-favorite/PokemonsFavoriteView.vue';
import PokemonList from '../../../components/pokemon/PokemonList.vue';
import { usePokemonFavorite } from '../../../composables/pokemons/usePokemonFavorite';
import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { usePokemonStore } from '../../../store/usePokemonStore';

// Mock del componente PokemonList
vi.mock('../../../components/pokemon/PokemonList.vue', () => ({
  default: {
    name: 'PokemonList',
    props: {
      pokemons: Array
    },
    template: '<div data-testid="pokemon-list">{{ pokemons.length }} pokemons</div>'
  }
}));

// Mock del composable usePokemonFavorite
vi.mock('../../../composables/pokemons/usePokemonFavorite', () => ({
  usePokemonFavorite: vi.fn()
}));

// Mock del store Pinia
vi.mock('../../../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn()
}));

// Crear un router mock para las pruebas
const createTestRouter = () => createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div></div>' } },
    { path: '/pokemons', name: 'pokemons', component: { template: '<div></div>' } },
    { path: '/favorites', name: 'pokemons-favorite', component: { template: '<div></div>' } },
  ]
});

describe('PokemonsFavoriteView', () => {
  let router;
  const mockSetSearchTerm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Configurar Pinia para las pruebas
    setActivePinia(createPinia());
    // Configurar router para las pruebas
    router = createTestRouter();
    
    // Mock básico del store
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: '', // Proporcionamos un valor para searchTerm
      setSearchTerm: mockSetSearchTerm
    } as any);
  });

  it('muestra mensaje cuando no hay pokémon favoritos', () => {
    // Configurar el mock del composable para retornar una lista vacía
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref([])
    });

    const wrapper = mount(PokemonsFavoriteView, {
      global: {
        plugins: [router]
      }
    });
    
    // Verificar que se muestra el mensaje de lista vacía
    expect(wrapper.text()).toContain("You haven't caught any Pokémon yet!");
    expect(wrapper.text()).toContain("Add your favorite Pokémon to see them here");
    
    // Verificar que no se muestra el componente PokemonList
    expect(wrapper.findComponent(PokemonList).exists()).toBe(false);
  });

  it('muestra la lista de pokémon favoritos cuando hay elementos', () => {
    // Lista de ejemplo de pokémon favoritos
    const favoritePokemons = ['pikachu', 'charizard', 'bulbasaur'];
    
    // Configurar el mock del composable para retornar la lista con elementos
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref(favoritePokemons)
    });

    const wrapper = mount(PokemonsFavoriteView, {
      global: {
        plugins: [router]
      }
    });
    
    // Verificar que no se muestra el mensaje de lista vacía
    expect(wrapper.text()).not.toContain("You haven't caught any Pokémon yet!");
    
    // Verificar que se muestra el componente PokemonList
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    
    // Verificar que se pasan los pokémon correctos como props
    expect(wrapper.findComponent(PokemonList).props('pokemons')).toEqual(favoritePokemons);
  });

  it('muestra mensaje cuando hay favoritos pero no coinciden con la búsqueda', () => {
    // Lista de ejemplo de pokémon favoritos
    const favoritePokemons = ['pikachu', 'charizard', 'bulbasaur'];
    
    // Configurar el mock del composable para retornar la lista con elementos
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref(favoritePokemons)
    });
    
    // Mock del store con un término de búsqueda que no coincide con ningún pokémon
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: 'mewtwo',
      setSearchTerm: mockSetSearchTerm
    } as any);

    const wrapper = mount(PokemonsFavoriteView, {
      global: {
        plugins: [router]
      }
    });
    
    // Verificar que se muestra el mensaje de "no encontrado"
    expect(wrapper.text()).toContain("Uh-oh!");
    expect(wrapper.text()).toContain("You look lost on your journey!");
    
    // Verificar que existe el botón de "Go back home"
    expect(wrapper.find('button').text()).toContain('Go back home');
    
    // Verificar que no se muestra el PokemonList
    expect(wrapper.findComponent(PokemonList).exists()).toBe(false);
  });

  it('tiene la clase correcta para el contenedor con scroll', () => {
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref([])
    });

    const wrapper = mount(PokemonsFavoriteView, {
      global: {
        plugins: [router]
      }
    });
    
    // Verificar que el contenedor principal tiene las clases correctas
    const container = wrapper.find('div');
    expect(container.classes()).toContain('custom-scrollbar');
    expect(container.classes()).toContain('overflow-y-auto');
  });
  
  it('navega a home y limpia la búsqueda al hacer clic en "Go back home"', async () => {
    // Lista de ejemplo de pokémon favoritos
    const favoritePokemons = ['pikachu', 'charizard', 'bulbasaur'];
    
    // Configurar el mock del composable para retornar la lista con elementos
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref(favoritePokemons)
    });
    
    // Mock del store con un término de búsqueda que no coincide con ningún pokémon
    vi.mocked(usePokemonStore).mockReturnValue({
      searchTerm: 'mewtwo',
      setSearchTerm: mockSetSearchTerm
    } as any);
    
    // Espiar el método push del router
    const pushSpy = vi.spyOn(router, 'push');

    const wrapper = mount(PokemonsFavoriteView, {
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
