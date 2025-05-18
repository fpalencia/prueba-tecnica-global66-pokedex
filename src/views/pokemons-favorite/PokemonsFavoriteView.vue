<script setup lang="ts">
import PokemonList from '../../components/pokemon/PokemonList.vue'
import { usePokemonFavorite } from '../../composables/pokemons/usePokemonFavorite'
import { usePokemonStore } from '../../store/usePokemonStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const { pokemonsList } = usePokemonFavorite()
const store = usePokemonStore()
const router = useRouter()

const filteredFavorites = computed(() => {
  if (!store.searchTerm.trim()) return pokemonsList.value

  return pokemonsList.value.filter(pokemon =>
    pokemon.toLowerCase().includes(store.searchTerm.toLowerCase())
  )
})

const goBack = () => {
  router.push({ name: 'home' })
  store.setSearchTerm('')
}
</script>

<template>
  <div class="px-4 h-[calc(95vh-200px)] overflow-y-auto custom-scrollbar">
    <div v-if="pokemonsList.length === 0" class="flex flex-col items-center justify-center h-[70vh] text-center">
      <h2 class="text-2xl font-bold text-gray-700 mb-4">You haven't caught any Pokémon yet!</h2>
      <p class="text-gray-500">Add your favorite Pokémon to see them here</p>
    </div>
    <div v-else-if="filteredFavorites.length === 0" class="flex flex-col items-center justify-center text-center">
      <div class="flex flex-col items-center justify-center gap-4 p-4 text-center">
        <p class="text-4xl font-bold">Uh-oh!</p>
        <span class="text-gray-600">You look lost on your journey!</span>
        <button @click="goBack"
          class="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors cursor-pointer">Go back
          home</button>
      </div>
    </div>
    <PokemonList v-else :pokemons="filteredFavorites" />
  </div>
</template>