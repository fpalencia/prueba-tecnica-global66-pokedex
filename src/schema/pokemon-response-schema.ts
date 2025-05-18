import { z } from "zod";

// Esquemas base
const SpeciesSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const AbilitySchema = z.object({
  ability: SpeciesSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

const GameIndexSchema = z.object({
  game_index: z.number(),
  version: SpeciesSchema,
});

const VersionGroupDetailSchema = z.object({
  level_learned_at: z.number(),
  move_learn_method: SpeciesSchema,
  version_group: SpeciesSchema,
});

const MoveSchema = z.object({
  move: SpeciesSchema,
  version_group_details: z.array(VersionGroupDetailSchema),
});

const DreamWorldSchema = z.object({
  front_default: z.string(),
  front_female: z.null(),
});

const HomeSchema = z.object({
  front_default: z.string(),
  front_female: z.null(),
  front_shiny: z.string(),
  front_shiny_female: z.null(),
});

const OfficialArtworkSchema = z.object({
  front_default: z.string(),
  front_shiny: z.string(),
});

const RedBlueSchema = z.object({
  back_default: z.string(),
  back_gray: z.string(),
  back_transparent: z.string(),
  front_default: z.string(),
  front_gray: z.string(),
  front_transparent: z.string(),
});

const CrystalSchema = z.object({
  back_default: z.string(),
  back_shiny: z.string(),
  back_shiny_transparent: z.string(),
  back_transparent: z.string(),
  front_default: z.string(),
  front_shiny: z.string(),
  front_shiny_transparent: z.string(),
  front_transparent: z.string(),
});

const GoldSchema = z.object({
  back_default: z.string(),
  back_shiny: z.string(),
  front_default: z.string(),
  front_shiny: z.string(),
  front_transparent: z.string().optional(),
});

// Esquemas con referencias circulares
const SpritesSchema: z.ZodType<Sprites> = z.lazy(() => 
  z.object({
    back_default: z.string(),
    back_female: z.null(),
    back_shiny: z.string(),
    back_shiny_female: z.null(),
    front_default: z.string(),
    front_female: z.null(),
    front_shiny: z.string(),
    front_shiny_female: z.null(),
    other: z.object({
      dream_world: DreamWorldSchema,
      home: HomeSchema,
      "official-artwork": OfficialArtworkSchema,
    }).optional(),
    versions: VersionsSchema.optional(),
    animated: SpritesSchema.optional(),
  })
);

const GenerationISchema = z.object({
  "red-blue": RedBlueSchema,
  yellow: RedBlueSchema,
});

const GenerationIISchema = z.object({
  crystal: CrystalSchema,
  gold: GoldSchema,
  silver: GoldSchema,
});

const GenerationIIISchema = z.object({
  emerald: OfficialArtworkSchema,
  "firered-leafgreen": GoldSchema,
  "ruby-sapphire": GoldSchema,
});

const GenerationIVSchema = z.object({
  "diamond-pearl": SpritesSchema,
  "heartgold-soulsilver": SpritesSchema,
  platinum: SpritesSchema,
});

const GenerationVSchema = z.object({
  "black-white": SpritesSchema,
});

const GenerationVIISchema = z.object({
  icons: DreamWorldSchema,
  "ultra-sun-ultra-moon": HomeSchema,
});

const GenerationVIIISchema = z.object({
  icons: DreamWorldSchema,
});

const VersionsSchema = z.object({
  "generation-i": GenerationISchema,
  "generation-ii": GenerationIISchema,
  "generation-iii": GenerationIIISchema,
  "generation-iv": GenerationIVSchema,
  "generation-v": GenerationVSchema,
  "generation-vi": z.record(HomeSchema),
  "generation-vii": GenerationVIISchema,
  "generation-viii": GenerationVIIISchema,
});

const StatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: SpeciesSchema,
});

const TypeSchema = z.object({
  slot: z.number(),
  type: SpeciesSchema,
});

// Esquema principal de respuesta Pokémon
export const PokemonResponseSchema = z.object({
  abilities: z.array(AbilitySchema),
  base_experience: z.number(),
  forms: z.array(SpeciesSchema),
  game_indices: z.array(GameIndexSchema),
  height: z.number(),
  held_items: z.array(z.any()),
  id: z.number(),
  is_default: z.boolean(),
  location_area_encounters: z.string(),
  moves: z.array(MoveSchema),
  name: z.string(),
  order: z.number(),
  past_types: z.array(z.any()),
  species: SpeciesSchema,
  sprites: SpritesSchema,
  stats: z.array(StatSchema),
  types: z.array(TypeSchema),
  weight: z.number(),
});

// Tipos de TypeScript para referencia
type Sprites = {
  back_default: string;
  back_female: null;
  back_shiny: string;
  back_shiny_female: null;
  front_default: string;
  front_female: null;
  front_shiny: string;
  front_shiny_female: null;
  other?: {
    dream_world: {
      front_default: string;
      front_female: null;
    };
    home: {
      front_default: string;
      front_female: null;
      front_shiny: string;
      front_shiny_female: null;
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
  };
  versions?: any;
  animated?: any;
};

