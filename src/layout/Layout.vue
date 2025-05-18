<script setup lang="ts">
import { ref } from 'vue';
import InputSearch from '../components/commons/InputSearch.vue';
import BtnFooter from '../components/commons/BtnFooter.vue';

const activeFilter = ref('all');

const handleFilterChange = (filter: string) => {
  activeFilter.value = filter;
};

</script>
<template>
  <div class="flex flex-col">
    <header class="w-full sticky top-0 bg-gray-light">
      <div class="container mx-auto px-4">
        <InputSearch />
      </div>
    </header>
      <main>
        <RouterView />
      </main>
    <footer class="fixed bottom-0 w-full bg-white z-10 py-4 shadow-lg">
      <div class="container mx-auto px-4">
        <BtnFooter @change-filter="handleFilterChange" />
      </div>
    </footer>
  </div>
</template>
