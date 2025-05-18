<script setup lang="ts">
import IconFavorite from '../../assets/icons/IconFavorite.vue';
import { usePokemonStore } from '../../store/usePokemonStore';
import { computed } from 'vue';

type Props = {
  name: string
}

const { name } = defineProps<Props>()

const { isFavorite, addFavorite, removeFavorite } = usePokemonStore();

const normalizedName = computed(() => name.toLowerCase());

const isPokemonFavorite = computed(() => isFavorite(normalizedName.value));

const handleToggleFavorite = () => {
  if (isPokemonFavorite.value) {
    removeFavorite(normalizedName.value);
  } else {
    addFavorite(normalizedName.value);
  }
};
</script>

<template>
  <button
    class="w-[44px] h-[44px] rounded-full border-none cursor-pointer bg-gray-light flex items-center justify-center"
    @click="handleToggleFavorite">
    <IconFavorite :color="isPokemonFavorite ? '#ECA539' : '#BFBFBF'" />
  </button>
</template>