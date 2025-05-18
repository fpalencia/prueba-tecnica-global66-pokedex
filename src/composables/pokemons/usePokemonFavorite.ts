import { usePokemonStore } from "../../store/usePokemonStore";
import { ref, watchEffect } from "vue";

export const usePokemonFavorite = () => {
  const store = usePokemonStore()

  const pokemonsList = ref<string[]>(Object.keys(store.favorites))

  watchEffect(() => {
    pokemonsList.value = Object.keys(store.favorites)
  })

  return {
    pokemonsList
  }
}
