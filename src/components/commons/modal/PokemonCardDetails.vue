<script setup lang="ts">
import { defineEmits, ref, onMounted, watch } from 'vue';
import BtnAddFavorite from '../BtnAddFavorite.vue';
import { usePokemonCardDetails } from '../../../composables/pokemons/usePokemonCardDetails';
import IconPokeball from '../../../assets/icons/IconPokeball.vue';
import Attributes from './components/Attributes.vue';
import SkeletonAttributes from './components/SkeletonAttributes.vue';
import SkeletonButtons from './components/SkeletonButtons.vue';

type Props = {
  pokemon: string
}

const props = defineProps<Props>()
const isImageLoading = ref(true)
const isDataLoading = ref(true)

const { copied, copy, pokemon } = usePokemonCardDetails(props.pokemon)

onMounted(() => {
  if (pokemon.value) {
    isDataLoading.value = false
  }
})

watch(pokemon, (newValue) => {
  if (newValue) {
    isDataLoading.value = false
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const handleImageLoad = () => {
  isImageLoading.value = false
}
</script>

<template>
  <div class="fixed inset-0 bg-[#36415359] bg-opacity-70 flex items-center justify-center z-50 px-4 lg:px-0"
    @click="closeModal">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-xl overflow-hidden" @click.stop>

      <div class="h-56 relative overflow-hidden">
        <button @click="$emit('close')"
          class="absolute top-2 right-2 z-20 h-8 w-8 rounded-full flex items-center justify-center bg-white text-gray-500 hover:bg-gray-100 shadow-md cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src="../../../assets/images/background-image.webp" alt="background image"
          class="background-img absolute inset-0 w-full h-full object-cover" />
        <div v-if="isImageLoading && pokemon" class="absolute inset-0 flex items-center justify-center z-10">
          <IconPokeball class="w-12 h-12 animate-spin" />
        </div>
        <img v-if="pokemon" :src="pokemon.frontSprite ?? ''" :alt="pokemon.name"
          class="absolute inset-0 h-full w-full object-contain z-10" @load="handleImageLoad"
          :class="{ 'opacity-0': isImageLoading }">
      </div>

      <div class="p-5">
        <SkeletonAttributes v-if="isDataLoading" />
        <Attributes v-else-if="pokemon" :pokemon="pokemon" />
      </div>

      <div class="pt-0 pl-5 pr-5 pb-5 flex items-center justify-between">
        <SkeletonButtons v-if="isDataLoading" />
        <template v-else>
          <button @click="copy()"
            class="bg-secondary hover:bg-accent text-white font-bold py-2 px-6 rounded-full transition-colors cursor-pointer">
            {{ copied ? 'Copied!' : 'Share to my friends' }}
          </button>
          <BtnAddFavorite :name="pokemon?.name ?? ''" />
        </template>
      </div>
    </div>
  </div>
</template>
