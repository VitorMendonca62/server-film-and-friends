import { z } from "zod";

const textsMediaSchemaerrors = {
  title: { min: "Titulo muito curto" },
  releaseDate: { length: "Há algo de errado na data de lançamento" },
  backgroundPath: { min: "Não há foto para background" },
  genres: { min: "Não há gêneros" },
  description: { min: "Não há descrição" },
  urlTrailer: {},
  posterPath: {},
  seasons: { min: "Está faltando as temporadas" },
  duration: { min: "Está faltando a duração" },
  id: "Não conseguimos encontrar" ,
  type: {
    oneOf: "Não conseguimos encontrar",
  },
  APIName: {
    oneOf: "Não conseguimos encontrar",
  },
};

const basicMediaSchemaObject = {
  title: z.string().min(2, textsMediaSchemaerrors.title.min),
  releaseDate: z.string().length(10, textsMediaSchemaerrors.releaseDate.length),
  genres: z.array(z.string()).min(1, textsMediaSchemaerrors.genres.min),
  description: z.string().min(1, textsMediaSchemaerrors.description.min),
};

const mediaInputSchema = {
  id: z.string().min(1, textsMediaSchemaerrors.id),
  type: z
    .string()
    .refine(
      (value) => ["movie", "tv"].includes(value),
      textsMediaSchemaerrors.type.oneOf,
    ),
  APIName: z
    .string()
    .refine(
      (value) => ["imdb", "tmdb"].includes(value),
      textsMediaSchemaerrors.APIName.oneOf,
    ),
};
const schemasMediaObject = {
  tv: {
    ...basicMediaSchemaObject,
    seasons: z
      .array(z.object({ seasonNumber: z.number(), episodeCount: z.number() }))
  },
  movie: {
    ...basicMediaSchemaObject,
    duration: z.number().min(1, textsMediaSchemaerrors.duration.min),
  },
};

export const mediasSchemas = {
  tv: z.object(schemasMediaObject.tv),
  movie: z.object(schemasMediaObject.movie),
};

export const basicMediaShowInputSchema = z.object({
  id: mediaInputSchema.id,
  type: mediaInputSchema.type,
});

export const basicMediaStoreInputSchema = z.object({
  id: mediaInputSchema.id,
  type: mediaInputSchema.type,
  APIName: mediaInputSchema.APIName,
});

export const basicMediaSchema = z.object(basicMediaSchemaObject);
