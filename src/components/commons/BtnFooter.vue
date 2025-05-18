<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IconAll from '../../assets/icons/IconAll.vue';
import IconFavorite from '../../assets/icons/IconFavorite.vue';

const emit = defineEmits(['change-filter']);
const router = useRouter();
const route = useRoute();

const activeFilter = ref('all');

const updateActiveFilterFromRoute = () => {
  activeFilter.value = route.path.includes('/favorites') ? 'favorites' : 'all';
};

const changeFilter = (filter: string) => {
  if (activeFilter.value === filter) return;
  
  activeFilter.value = filter;
  emit('change-filter', filter);
  
  const path = filter === 'favorites' ? '/favorites' : '/pokemons';
  router.push(path);
};

onMounted(updateActiveFilterFromRoute);

watch(() => route.path, updateActiveFilterFromRoute);
</script>

<template>
  <div class="w-full flex gap-2 px-2 py-2 max-w-xl mx-auto">
    <button 
      data-testid="all-button"
      @click="changeFilter('all')" 
      class="flex-1 py-2 flex justify-center items-center gap-2 rounded-full cursor-pointer"
      :class="activeFilter === 'all' ? 'bg-secondary' : 'bg-gray-medium'"
      aria-label="Show all pokemons"
    >
      <IconAll class="w-6 h-6" />
      <span class="text-lg font-medium text-white">All</span>
    </button>
    
    <button 
      data-testid="favorites-button"
      @click="changeFilter('favorites')" 
      class="flex-1 py-2 flex justify-center items-center gap-2 rounded-full cursor-pointer text-white"
      :class="activeFilter === 'favorites' ? 'bg-secondary' : 'bg-gray-medium'"
      aria-label="Show favorite pokemons"
    >
      <IconFavorite :color="activeFilter === 'favorites' ? 'white' : 'white'" class="w-6 h-6" />
      <span class="text-lg font-medium">Favorites</span>
    </button>
  </div>
</template>
