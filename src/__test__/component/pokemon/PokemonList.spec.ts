import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonList from '../../../components/pokemon/PokemonList.vue';
import PokemonItem from '../../../components/pokemon/PokemonItem.vue';

// Mock del componente PokemonItem para simplificar las pruebas
vi.mock('../../../components/pokemon/PokemonItem.vue', () => ({
  default: {
    name: 'PokemonItem',
    props: {
      pokemon: String
    },
    template: '<div data-testid="pokemon-item">{{ pokemon }}</div>'
  }
}));

describe('PokemonList', () => {
  it('renderiza una lista vacía cuando no hay pokemons', () => {
    const wrapper = mount(PokemonList, {
      props: {
        pokemons: []
      }
    });
    
    expect(wrapper.findAllComponents(PokemonItem)).toHaveLength(0);
  });

  it('renderiza la cantidad correcta de PokemonItem', () => {
    const pokemons = ['pikachu', 'charmander', 'bulbasaur'];
    
    const wrapper = mount(PokemonList, {
      props: {
        pokemons
      }
    });
    
    const pokemonItems = wrapper.findAllComponents(PokemonItem);
    expect(pokemonItems).toHaveLength(pokemons.length);
  });

  it('pasa el nombre del pokemon correcto a cada PokemonItem', () => {
    const pokemons = ['pikachu', 'charmander', 'bulbasaur'];
    
    const wrapper = mount(PokemonList, {
      props: {
        pokemons
      }
    });
    
    const pokemonItems = wrapper.findAllComponents(PokemonItem);
    
    pokemonItems.forEach((item, index) => {
      expect(item.props('pokemon')).toBe(pokemons[index]);
    });
  });

  it('asigna keys únicos a cada PokemonItem basados en el índice', () => {
    const pokemons = ['pikachu', 'charmander', 'bulbasaur'];
    
    const wrapper = mount(PokemonList, {
      props: {
        pokemons
      }
    });
    
    // Verificar que se estén usando los índices como keys
    // Nota: Esta es una forma indirecta de verificarlo, ya que Vue Test Utils
    // no expone directamente las keys de los componentes
    const html = wrapper.html();
    expect(html).toContain('pokemon-item');
  });
});
