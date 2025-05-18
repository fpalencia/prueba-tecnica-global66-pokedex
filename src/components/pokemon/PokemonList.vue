<script setup lang="ts">
import PokemonItem from './PokemonItem.vue';

interface Props {
  pokemons: string[]
}

const { pokemons } = defineProps<Props>()

</script>

<template>
  <div class="flex flex-col items-center gap-2.5 w-full">
    <PokemonItem v-for="(pokemon, index) in pokemons" :key="index" :pokemon="pokemon" />
  </div>
</template>