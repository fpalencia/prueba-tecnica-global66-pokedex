<script setup lang="ts">
import PokemonList from '../../components/pokemon/PokemonList.vue'
import { usePokemonFavorite } from '../../composables/pokemons/usePokemonFavorite'

const { pokemonsList } = usePokemonFavorite()
</script>

<template>
  <div class="px-4 h-[calc(95vh-200px)] overflow-y-auto custom-scrollbar">
    <div v-if="pokemonsList.length === 0" class="flex flex-col items-center justify-center h-[70vh] text-center">
      <h2 class="text-2xl font-bold text-gray-700 mb-4">You haven't caught any Pokémon yet!</h2>
      <p class="text-gray-500">Add your favorite Pokémon to see them here</p>
    </div>
    <PokemonList v-else :pokemons="pokemonsList" />
  </div>
</template>