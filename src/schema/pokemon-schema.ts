import { z } from "zod";

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  weight: z.number(),
  height: z.number(),
  frontSprite: z.string().nullish(),
  types: z.array(
    z.object({
      type: z.object({
        name: z.string()
      })
    }).transform(typeObj => typeObj.type.name)
  )
});
