import { computed } from 'vue';
import { usePokemonItem } from '../pokemons/usePokemonItem';
import { useClipboard } from '@vueuse/core';

  
export const usePokemonCardDetails = (pokemonName: string) => {

  const { isLoading, pokemon, isFetching } = usePokemonItem(pokemonName)

  function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const capitalizedPokemon = computed(() => {
    if (!pokemon.value) return null
    return {
      ...pokemon.value,
      name: capitalizeFirstLetter(pokemon.value.name),
      types: pokemon.value.types?.map(type => capitalizeFirstLetter(type))
    }
  })

  const pokemonInfo = computed(() => {
    if (!pokemon.value) return ''
    const excludedProperties = ['id', 'frontSprite']
    
    return Object.entries(pokemon.value)
      .filter(([key]) => !excludedProperties.includes(key))
      .map(([key, value]) => {
        let displayValue = value
        if (key === 'name') {
          displayValue = capitalizeFirstLetter(value as string)
        } else if (key === 'types' && Array.isArray(value)) {
          displayValue = (value as string[]).map(type => capitalizeFirstLetter(type)).join(', ')
        }
        return `${capitalizeFirstLetter(key)}: ${displayValue}`
      })
      .join(', ')
  })

  const { copy, copied } = useClipboard({ source: pokemonInfo })

  return {
    copied,
    copy,
    pokemon: capitalizedPokemon,
    isLoading,
    capitalizeFirstLetter,
    isFetching
  }
}
