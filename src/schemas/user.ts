// T UDO OK

import { z } from "zod";

export const textsUserSchemaErrors = {
  name: {
    max: "Nome muito longo",
    min: "Nome muito curto",
  },
  username: {
    max: "Apelido muito longo",
    min: "Apelido muito curto",
  },
  email: { email: "Email inválido" },
  password: { min: "A senha é curta demais!" },
  newPassword: { min: "A senha nova é curta demais!" },
  oldPassword: { min: "A senha antiga é curta demais!" },
  code: { length: "Códido incorreto" },
};

const userSchemas = {
  name: z
    .string()
    .min(8, textsUserSchemaErrors.name.min)
    .max(40, textsUserSchemaErrors.name.max),
  username: z
    .string()
    .min(8, textsUserSchemaErrors.username.min)
    .max(40, textsUserSchemaErrors.username.max),
  email: z.string().email(textsUserSchemaErrors.email.email),
  password: z.string().min(8, textsUserSchemaErrors.password.min),
  newPassword: z.string().min(8, textsUserSchemaErrors.newPassword.min),
  oldPassword: z.string().min(8, textsUserSchemaErrors.oldPassword.min),
  code: z.string().length(6, textsUserSchemaErrors.code.length),
};

export const userPostSchema = z.object({
  name: userSchemas.name,
  username: userSchemas.username,
  email: userSchemas.email,
  password: userSchemas.password,
});

export const userUpdateNameOrUsername = z.object({
  name: userSchemas.name,
  username: userSchemas.username,
});

export const userLoginSchema = z.object({
  email: userSchemas.email,
  password: userSchemas.password,
});

export const emailTakeCodeAcessSchema = z.object({
  email: userSchemas.email,
});

export const userVerifyCodeSchema = z.object({
  email: userSchemas.email,
  code: userSchemas.code,
});

export const userForgotPasswordSchema = z.object({
  email: userSchemas.email,
  newPassword: userSchemas.newPassword,
});

export const userUpdatePasswordSchema = z.object({
  oldPassword: userSchemas.oldPassword,
  newPassword: userSchemas.newPassword,
});
