<script setup lang="ts">
import IconPokeball from '../../assets/icons/IconPokeball.vue'
import PokemonList from '../../components/pokemon/PokemonList.vue'
import { usePokemons } from '../../composables/pokemons/usePokemons'
import { usePokemonStore } from '../../store/usePokemonStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const { initialLoad } = usePokemons()
const store = usePokemonStore()
const router = useRouter()

const filteredPokemons = computed(() => {
  return store.getFilteredPokemonList()
})

const goBack = () => {
  router.push({ name: 'home' })
  store.setSearchTerm('')
}

</script>

<template>
  <div class="px-4">
    <div v-if="initialLoad" class="h-full flex flex-col items-center justify-center">
      <IconPokeball class="w-16 h-16 animate-spin" />
    </div>
    <template v-else>
      <template v-if="filteredPokemons.length === 0">
        <div class="flex flex-col items-center justify-center text-center">
          <p class="text-4xl font-bold">Uh-oh!</p>
          <span class="text-gray-600 mt-2">You look lost on your journey!</span>
          <button @click="goBack"
            class="mt-6 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors cursor-pointer">
            Go back home
          </button>
        </div>
      </template>
      <template v-else>
        <PokemonList :pokemons="filteredPokemons" />
      </template>
    </template>
  </div>
</template>