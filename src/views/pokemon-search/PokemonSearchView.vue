<script setup lang="ts">
import IconPokeball from '../../assets/icons/IconPokeball.vue'
import PokemonItem from '../../components/pokemon/PokemonItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, watchEffect } from 'vue'
import { usePokemonItem } from '../../composables/pokemons/usePokemonItem'

const route = useRoute()
const router = useRouter()

const searchValue = ref<string>(route.query.name as string)

const { isError, pokemon, isLoading } = usePokemonItem(searchValue)

const goBack = () => {
  searchValue.value = ''
  router.push({ name: 'home' })
}
watchEffect(() => {
  searchValue.value = route.query.name as string
})
</script>

<template>
  <div class="flex items-center justify-center h-[calc(95vh-200px)]" v-if="isLoading">
    <div class="w-18 h-18 animate-spin flex items-center justify-center">
      <IconPokeball />
    </div>
  </div>
  <div class="flex flex-col items-center justify-center gap-4 p-4 text-center" v-if="isError">
    <p class="text-4xl font-bold">Uh-oh!</p>
    <span class="text-gray-600">You look lost on your journey!</span>
    <button @click="goBack" class="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors cursor-pointer">Go back home</button>
  </div>
  <div class="flex items-center justify-center p-4" v-if="pokemon">
    <PokemonItem :pokemon="pokemon?.name ?? ''" />
  </div>
</template>

