<script setup lang="ts">
import { capitalize } from '../../../../helpers';

type PokemonData = {
  name: string;
  weight?: number;
  height?: number;
  types?: string[];
  [key: string]: string | number | string[] | undefined;
}

defineProps<{
  pokemon: PokemonData;
}>();

const attributes = [
  { key: 'name', label: 'Name' },
  { key: 'weight', label: 'Weight' },
  { key: 'height', label: 'Height' },
  { key: 'types', label: 'Types' }
];
</script>

<template>
  <div v-for="attr in attributes" :key="attr.key" class="py-2 border-b border-gray-200 flex items-center">
    <span class="font-semibold w-20 text-gray-dark">{{ attr.label }}:</span>
    <span class="text-gray-800">
      <template v-if="attr.key === 'types' && Array.isArray(pokemon[attr.key]) && pokemon[attr.key]">
        {{ pokemon[attr.key]?.map(type => capitalize(type)).join(', ') }}
      </template>
      <template v-else-if="attr.key === 'name' && pokemon[attr.key]">
        {{ capitalize(pokemon[attr.key]) }}
      </template>
      <template v-else>
        {{ pokemon[attr.key] || '' }}
      </template>
    </span>
  </div>
</template>

