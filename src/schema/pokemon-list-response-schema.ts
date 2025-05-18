import { z } from "zod";

export const ResultSchema = z.object({
  name: z.string(),
  url: z.string()
});

export const PokemonsListResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ResultSchema)
});
