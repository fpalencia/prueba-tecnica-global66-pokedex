import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

export const usePokemonSearch = (
  customRoute?: RouteLocationNormalizedLoaded,
  customRouter?: Router
) => {
  const route = customRoute || useRoute()
  const router = customRouter || useRouter()

  const searchValue = ref(route.query.name as string || '')

  watchEffect(() => {
    searchValue.value = route.query.name as string || ''
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

  return {
    searchValue,
    handleSearch,
    clearSearch
  }
} 