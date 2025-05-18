<script setup lang="ts">
import BtnAddFavorite from '../commons/BtnAddFavorite.vue';
import PokemonCardDetails from '../commons/modal/PokemonCardDetails.vue';
import { ref } from 'vue';

type Props = {
  pokemon: string
}

const { pokemon } = defineProps<Props>()

const showModal = ref(false)

const onClickShowModal = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <div class="flex justify-between items-center p-2 bg-white rounded-md shadow-sm w-full max-w-xl transition-all duration-200 hover:shadow-md cursor-pointer" @click="onClickShowModal">
    <span class="text-[22px] pl-[10px] font-normal text-dark capitalize">{{ pokemon }}</span>
    <BtnAddFavorite :name="pokemon" @click.stop />
  </div>
  <Teleport to="body">
    <Transition name="favorite-transition" mode="out-in">
      <PokemonCardDetails :pokemon="pokemon" v-if="showModal" @close="onClickShowModal" />
    </Transition>
  </Teleport>
</template>
