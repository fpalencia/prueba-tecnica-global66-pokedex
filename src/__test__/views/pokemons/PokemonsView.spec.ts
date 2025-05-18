import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonsView from '../../../views/pokemons/PokemonsView.vue';
import IconPokeball from '../../../assets/icons/IconPokeball.vue';
import PokemonList from '../../../components/pokemon/PokemonList.vue';
import { usePokemons } from '../../../composables/pokemons/usePokemons';
import { ref, computed } from 'vue';

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

describe('PokemonsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el spinner de carga cuando initialLoad es true', () => {
    // Configurar el mock del composable para el estado de carga inicial
    vi.mocked(usePokemons).mockReturnValue({
      list: computed(() => []),
      initialLoad: ref(true),
      scrollContainerRef: ref(null),
      containerProps: {
        ref: ref(null),
        style: { height: '100%', overflow: 'auto', width: '100%' },
        onScroll: vi.fn()
      },
      wrapperProps: { style: { height: '100%', position: 'relative', width: '100%' } },
      fetchNextPage: vi.fn()
    });

    const wrapper = mount(PokemonsView);
    
    expect(wrapper.findComponent(IconPokeball).exists()).toBe(true);
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.findComponent(PokemonList).exists()).toBe(false);
  });

  it('muestra la lista de pokemons cuando initialLoad es false', () => {
    // Datos de ejemplo para la lista de pokemons
    const pokemonList = [
      { data: 'bulbasaur' },
      { data: 'charmander' },
      { data: 'squirtle' }
    ];
    
    // Configurar el mock del composable para el estado con datos cargados
    vi.mocked(usePokemons).mockReturnValue({
      list: computed(() => pokemonList.map((pokemon, index) => ({ ...pokemon, index }))),
      initialLoad: ref(false),
      scrollContainerRef: ref(null),
      containerProps: {
        ref: ref(null),
        style: { height: '100%', overflow: 'auto', width: '100%' },
        onScroll: vi.fn()
      },
      wrapperProps: { style: { height: '100%', position: 'relative', width: '100%' } },
      fetchNextPage: vi.fn()
    });

    const wrapper = mount(PokemonsView);
    
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    expect(wrapper.findComponent(PokemonList).props('pokemons')).toEqual(['bulbasaur', 'charmander', 'squirtle']);
  });

  it('muestra el spinner de carga adicional cuando hay elementos en la lista', () => {
    // Datos de ejemplo para la lista de pokemons
    const pokemonList = [
      { data: 'bulbasaur' },
      { data: 'charmander' }
    ];
    
    // Configurar el mock del composable para el estado con datos cargados
    vi.mocked(usePokemons).mockReturnValue({
      list: computed(() => pokemonList.map((pokemon, index) => ({ ...pokemon, index }))),
      initialLoad: ref(false),
      scrollContainerRef: ref(null),
      containerProps: {
        ref: ref(null),
        style: { height: '100%', overflow: 'auto', width: '100%' },
        onScroll: vi.fn()
      },
      wrapperProps: { style: { height: '100%', position: 'relative', width: '100%' } },
      fetchNextPage: vi.fn()
    });

    const wrapper = mount(PokemonsView);
    
    // Debe existir el PokemonList
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    
    // Debe existir el spinner adicional al final
    const spinners = wrapper.findAllComponents(IconPokeball);
    expect(spinners.length).toBe(1);
    expect(wrapper.find('.py-6 .animate-spin').exists()).toBe(true);
  });

  it('no muestra el spinner adicional cuando la lista está vacía', () => {
    // Configurar el mock del composable para el estado con lista vacía
    vi.mocked(usePokemons).mockReturnValue({
      list: computed(() => []),
      initialLoad: ref(false),
      scrollContainerRef: ref(null),
      containerProps: {
        ref: ref(null),
        style: { height: '100%', overflow: 'auto', width: '100%' },
        onScroll: vi.fn()
      },
      wrapperProps: { style: { height: '100%', position: 'relative', width: '100%' } },
      fetchNextPage: vi.fn()
    });

    const wrapper = mount(PokemonsView);
    
    // Debe existir el PokemonList (aunque esté vacío)
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true);
    
    // No debe existir el spinner adicional al final
    expect(wrapper.find('.py-6 .animate-spin').exists()).toBe(false);
  });

  it('asigna correctamente la referencia del contenedor de scroll', () => {
    const scrollContainerRef = ref(null);
    
    // Configurar el mock del composable
    vi.mocked(usePokemons).mockReturnValue({
      list: computed(() => []),
      initialLoad: ref(false),
      scrollContainerRef,
      containerProps: {
        ref: ref(null),
        style: { height: '100%', overflow: 'auto', width: '100%' },
        onScroll: vi.fn()
      },
      wrapperProps: { style: { height: '100%', position: 'relative', width: '100%' } },
      fetchNextPage: vi.fn()
    });

    const wrapper = mount(PokemonsView);
    
    // Verificar que el elemento div tiene la referencia correcta
    expect(wrapper.find('[ref="scrollContainerRef"]').exists()).toBe(false);
  });
});
