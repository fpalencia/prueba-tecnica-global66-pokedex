import { ref, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

export const usePokemonSearch = (
  customRoute?: RouteLocationNormalizedLoaded,
  customRouter?: Router
) => {
  const route = customRoute || useRoute()
  const router = customRouter || useRouter()

  const searchValue = ref(route.query.name as string || '')
  const localPokemonList = ref<string[]>([])

  watchEffect(() => {
    searchValue.value = route.query.name as string || ''
  })

  const filteredPokemons = computed(() => {
    if (!searchValue.value.trim()) return localPokemonList.value
    
    return localPokemonList.value.filter(pokemon => 
      pokemon.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  })

  const handleSearch = () => {
    if (searchValue.value.trim()) {
      router.push({
        name: 'pokemon-search',
        query: { name: searchValue.value }
      })
    }
  }

  const clearSearch = () => {
    searchValue.value = ''
    router.push({
      name: 'pokemons'
    })
  }

  const updatePokemonList = (pokemons: string[]) => {
    localPokemonList.value = pokemons
  }

  return {
    searchValue,
    filteredPokemons,
    handleSearch,
    clearSearch,
    updatePokemonList
  }
} 