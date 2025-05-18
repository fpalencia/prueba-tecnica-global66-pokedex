import { z } from "zod";
import type { ResultSchema, PokemonsListResponseSchema } from "../schema/pokemon-list-response-schema";

export type Result = z.infer<typeof ResultSchema>;
export type PokemonsListResponse = z.infer<typeof PokemonsListResponseSchema>;