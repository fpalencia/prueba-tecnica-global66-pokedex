<script setup lang="ts">
import IconPikachu from '../assets/icons/IconPikachu.vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '../store/usePokemonStore'

const router = useRouter()

const { setInitialLoad } = usePokemonStore()

const handleGetStarted = () => {
  setInitialLoad(true)
  router.push('/pokemons')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white p-4 overflow-x-hidden">
    <div class="w-100 h-100 mb-6">
      <IconPikachu class="w-full h-full" />
    </div>
    <h1 class="text-3xl font-bold text-dark mb-6">Welcome to Pokédex</h1>
    <p class="text-center text-gray-dark max-w-md mb-10">
      The digital encyclopedia created by Professor Oak is an invaluable tool
      to Trainers in the Pokémon world.
    </p>
    <button
      class="bg-secondary hover:bg-accent text-white font-medium py-2 px-6 rounded-full transition duration-300 cursor-pointer"
      @click="handleGetStarted">
      Get started
    </button>
  </div>
</template>