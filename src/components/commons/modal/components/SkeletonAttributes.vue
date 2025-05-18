<template>
  <div class="space-y-4">
    <div v-for="i in 4" :key="i" class="py-2 border-b border-gray-200 flex items-center animate-pulse">
      <div class="bg-gray-200 h-5 w-20 rounded"></div>
      <div class="bg-gray-200 h-5 w-40 ml-2 rounded"></div>
    </div>
  </div>
</template>
