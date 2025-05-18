import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonsFavoriteView from '../../../views/pokemons-favorite/PokemonsFavoriteView.vue';
import PokemonList from '../../../components/pokemon/PokemonList.vue';
import { usePokemonFavorite } from '../../../composables/pokemons/usePokemonFavorite';
import { ref } from 'vue';

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

describe('PokemonsFavoriteView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra mensaje cuando no hay pokémon favoritos', () => {
    // Configurar el mock del composable para retornar una lista vacía
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref([])
    });

    const wrapper = mount(PokemonsFavoriteView);
    
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

    const wrapper = mount(PokemonsFavoriteView);
    
    // Verificar que no se muestra el mensaje de lista vacía
    expect(wrapper.text()).not.toContain("You haven't caught any Pokémon yet!");
    
    // Verificar que se muestra el componente PokemonList
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    
    // Verificar que se pasan los pokémon correctos como props
    expect(wrapper.findComponent(PokemonList).props('pokemons')).toEqual(favoritePokemons);
  });

  it('tiene la clase correcta para el contenedor con scroll', () => {
    vi.mocked(usePokemonFavorite).mockReturnValue({
      pokemonsList: ref([])
    });

    const wrapper = mount(PokemonsFavoriteView);
    
    // Verificar que el contenedor principal tiene las clases correctas
    const container = wrapper.find('div');
    expect(container.classes()).toContain('custom-scrollbar');
    expect(container.classes()).toContain('overflow-y-auto');
  });
});
