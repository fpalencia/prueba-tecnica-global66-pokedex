import { useQuery } from '@tanstack/vue-query'
import { getPokemonById } from '../../services/getPokemonsServices'
import type { Ref } from 'vue'

export const usePokemonItem = (name: string | Ref<string>) => {
  const {
    isLoading,
    data: pokemon,
    isError,
    error: errorMessage,
    isFetching
  } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => getPokemonById(typeof name === 'string' ? name.toLowerCase() : name.value.toLowerCase()),
    staleTime: 1000 * 60 * 30,
    retry: 2
  })

  return {
    isLoading,
    isError,
    pokemon,
    errorMessage,
    isFetching
  }
}