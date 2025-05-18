import { z } from 'zod';
import type { PokemonSchema } from "../schema/pokemon-schema";

export type Pokemon = z.infer<typeof PokemonSchema>;
