import pokemonApi from "../api/pokemonApi";
import { PokemonsListResponseSchema } from "../schema/pokemon-list-response-schema";
import { PokemonSchema } from "../schema/pokemon-schema";
import type { PokemonsListResponse } from "../types/pokemon-list";
import type { Pokemon } from "../types/pokemon";

export const getPokemons = async (page: number): Promise<Record<string, string>> => {
  const limit = 20;
  const offset = page * limit;
  try {
    const response = await pokemonApi.get<PokemonsListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);

    const { data } = response;

    const responseData = PokemonsListResponseSchema.safeParse(data);

    if (!responseData.success) {
      throw new Error("Datos inválidos");
    }
    
    const listPokemons = Object.fromEntries(
      responseData.data.results.map(pokemon => [pokemon.name, pokemon.name])
    );
    
    return listPokemons;
  } catch (error) {
    throw error;
  }
};

export const getPokemonById = async (name: string): Promise<Pokemon> => {

  const response = await pokemonApi.get(`/pokemon/${name}`);

  const { data } = response;

  const responseData = PokemonSchema.safeParse(data);

  if (!responseData.success) {
    throw new Error("Datos inválidos");
  }
  
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    types: data.types.map((type: { type: { name: string } }) => type.type.name),
    frontSprite: data.sprites.front_default
  }
};
