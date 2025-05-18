import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PokemonItem from '../../../components/pokemon/PokemonItem.vue';
import BtnAddFavorite from '../../../components/commons/BtnAddFavorite.vue';
import PokemonCardDetails from '../../../components/commons/modal/PokemonCardDetails.vue';

// Mock de los componentes dependientes
vi.mock('../../../components/commons/BtnAddFavorite.vue', () => ({
  default: {
    name: 'BtnAddFavorite',
    props: {
      name: String
    },
    template: '<button data-testid="btn-add-favorite">Add {{ name }}</button>'
  }
}));

vi.mock('../../../components/commons/modal/PokemonCardDetails.vue', () => ({
  default: {
    name: 'PokemonCardDetails',
    props: {
      pokemon: String
    },
    emits: ['close'],
    template: '<div data-testid="pokemon-modal">{{ pokemon }} <button @click="$emit(\'close\')">Close</button></div>'
  }
}));

describe('PokemonItem', () => {
  it('renderiza correctamente el nombre del pokemon', () => {
    const pokemon = 'pikachu';
    const wrapper = mount(PokemonItem, {
      props: {
        pokemon
      }
    });
    
    expect(wrapper.text()).toContain(pokemon);
    expect(wrapper.find('span').text()).toBe(pokemon);
  });

  it('renderiza el botón de añadir a favoritos con el nombre correcto', () => {
    const pokemon = 'charmander';
    const wrapper = mount(PokemonItem, {
      props: {
        pokemon
      }
    });
    
    const btnAddFavorite = wrapper.findComponent(BtnAddFavorite);
    expect(btnAddFavorite.exists()).toBe(true);
    expect(btnAddFavorite.props('name')).toBe(pokemon);
  });

  it('muestra el modal al hacer clic en el item', async () => {
    const pokemon = 'bulbasaur';
    const wrapper = mount(PokemonItem, {
      props: {
        pokemon
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    });
    
    // Inicialmente el modal no debería estar visible
    expect(wrapper.findComponent(PokemonCardDetails).exists()).toBe(false);
    
    // Hacer clic en el item para mostrar el modal
    await wrapper.find('div').trigger('click');
    
    // Ahora el modal debería estar visible
    expect(wrapper.findComponent(PokemonCardDetails).exists()).toBe(true);
    expect(wrapper.findComponent(PokemonCardDetails).props('pokemon')).toBe(pokemon);
  });

  it('cierra el modal cuando se emite el evento close', async () => {
    const pokemon = 'squirtle';
    const wrapper = mount(PokemonItem, {
      props: {
        pokemon
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    });
    
    // Mostrar el modal
    await wrapper.find('div').trigger('click');
    expect(wrapper.findComponent(PokemonCardDetails).exists()).toBe(true);
    
    // Emitir el evento close desde el modal
    await wrapper.findComponent(PokemonCardDetails).vm.$emit('close');
    
    // El modal debería cerrarse
    expect(wrapper.findComponent(PokemonCardDetails).exists()).toBe(false);
  });

  it('evita que el clic en el botón de favoritos abra el modal', async () => {
    const pokemon = 'mewtwo';
    const wrapper = mount(PokemonItem, {
      props: {
        pokemon
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    });
    
    // Hacer clic en el botón de favoritos
    await wrapper.findComponent(BtnAddFavorite).trigger('click');
    
    // El modal no debería abrirse
    expect(wrapper.findComponent(PokemonCardDetails).exists()).toBe(false);
  });
});
