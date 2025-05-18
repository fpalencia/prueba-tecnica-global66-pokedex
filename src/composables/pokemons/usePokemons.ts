import { ref, watchEffect } from "vue";
import { usePokemonsList } from "../pokemons/usePokemonsList";
import { usePokemonStore } from "../../store/usePokemonStore";
import { useCustomVirtualList } from "../custom/useCustomVirtualList";
import { useInfinityScroll } from "../custom/useInfinityScroll";

export const usePokemons = (
  pokemonListProvider = usePokemonsList, 
  storeProvider = usePokemonStore,
  options = { maxPages: 40, limit: 10, scrollOffset: 10 }
) => {
  
  const store = storeProvider();
  const page = ref<number>(0);
  const pokemonsList = ref<string[]>([])
  const scrollContainerRef = ref<HTMLElement | null>(null);
  const { pokemons } = pokemonListProvider(page);

  const initialLoad = ref<boolean>(store.initialLoad);

  watchEffect(() => {
    store.setPokemons(pokemons.value ?? {});
  })

  watchEffect(() => {
    if (Object.keys(store.pokemons).length !== 0) {
      store.setInitialLoad(false)
      initialLoad.value = false
    }
    pokemonsList.value = Object.keys(store.pokemons)
  })

  const { list, containerProps, wrapperProps } = useCustomVirtualList(pokemonsList, {
    itemHeight: 40
  })

  const fetchNextPage = async (_page?: number, _limit?: number) => {
    if (pokemonsList.value.length === 0 && page.value === 0) return Promise.resolve()
    if (page.value > options.maxPages) return Promise.resolve()

    page.value = page.value + 1

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 100)
    })
  }

  const scrollOptions = {
    limit: options.limit,
    scrollOffset: options.scrollOffset,
    container: null as HTMLElement | null
  }

  watchEffect(() => {
    scrollOptions.container = scrollContainerRef.value
  })

  useInfinityScroll(fetchNextPage, scrollOptions)

  return {
    list,
    containerProps,
    wrapperProps,
    initialLoad,
    fetchNextPage,
    scrollContainerRef
  }
}