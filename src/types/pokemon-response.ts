import { z } from 'zod';
import { PokemonResponseSchema } from '../schema/pokemon-response-schema';

export type PokemonResponse = z.infer<typeof PokemonResponseSchema>;
