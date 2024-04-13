import { z } from "zod";

const textsInfosSchemaErrors = {
  userId: "ID inválido",
  mediaId: "ID inválido",
  rating: "A avalição tem que ser entre 0 e 5",
  favorite: "Você tem que favoritar ou não favoritar",
  type: "Os tipos de informações estão errados",
};

const infosSchemaObject = {
  userId: z.string().uuid(textsInfosSchemaErrors.userId),
  mediaId: z.string().uuid(textsInfosSchemaErrors.mediaId),
  type: z
    .string()
    .refine(
      (value) => ["user", "media"].includes(value),
      textsInfosSchemaErrors.type,
    ),
  rating: z
    .number()
    .positive(textsInfosSchemaErrors.rating)
    .min(0, textsInfosSchemaErrors.rating)
    .max(5, textsInfosSchemaErrors.rating),
  favorite: z
    .string()
    .refine(
      (value) => ["0", "1"].includes(value),
      textsInfosSchemaErrors.favorite,
    ),
};

export const infosSchema = {
  favorite: z.object({
    userId: infosSchemaObject.userId,
    mediaId: infosSchemaObject.mediaId,
    favorite: infosSchemaObject.favorite,
  }),
  rating: z.object({
    userId: infosSchemaObject.userId,
    mediaId: infosSchemaObject.mediaId,
    rating: infosSchemaObject.rating,
  }),
};
