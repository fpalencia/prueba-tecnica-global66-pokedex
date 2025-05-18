import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Attributes from '../../../../../components/commons/modal/components/Attributes.vue';

// Mock de la función capitalize si es necesario
vi.mock('../../../../../helpers', () => ({
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
}));

describe('Attributes.vue', () => {
  it('renderiza correctamente los atributos del pokemon', () => {
    const pokemon = {
      name: 'pikachu',
      weight: 60,
      height: 4,
      types: ['electric']
    };

    const wrapper = mount(Attributes, {
      props: {
        pokemon
      }
    });

    // Verificar que el componente renderiza todos los atributos
    const attributeElements = wrapper.findAll('.py-2');
    expect(attributeElements.length).toBe(4); // Debería haber 4 atributos

    // Verificar nombre
    expect(attributeElements[0].text()).toContain('Name:');
    expect(attributeElements[0].text()).toContain('Pikachu');

    // Verificar peso
    expect(attributeElements[1].text()).toContain('Weight:');
    expect(attributeElements[1].text()).toContain('60');

    // Verificar altura
    expect(attributeElements[2].text()).toContain('Height:');
    expect(attributeElements[2].text()).toContain('4');

    // Verificar tipos
    expect(attributeElements[3].text()).toContain('Types:');
    expect(attributeElements[3].text()).toContain('Electric');
  });

  it('maneja correctamente atributos faltantes', () => {
    const pokemon = {
      name: 'bulbasaur',
      // weight y height no definidos
      types: ['grass', 'poison']
    };

    const wrapper = mount(Attributes, {
      props: {
        pokemon
      }
    });

    const attributeElements = wrapper.findAll('.py-2');
    
    // Verificar que muestra cadena vacía para atributos faltantes
    expect(attributeElements[1].text()).toContain('Weight:');
    expect(attributeElements[1].text().trim().endsWith(':')).toBe(true); // Debería tener un espacio después de ":"
    
    expect(attributeElements[2].text()).toContain('Height:');
    expect(attributeElements[2].text().trim().endsWith(':')).toBe(true);

    // Verificar que muestra tipos múltiples correctamente
    expect(attributeElements[3].text()).toContain('Types:');
    expect(attributeElements[3].text()).toContain('Grass, Poison');
  });
});
