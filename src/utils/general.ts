// TUDO OK

// Types
import { Response } from "express";
import { ZodSchema, ZodError } from "zod";

export default function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return error as string;
}

export function errorInServer(res: Response, error: unknown) {
  const errorMessage = getErrorMessage(error);

  return res.status(500).json({
    msg: "Algo de errado com o servidor! Tente novamente!",
    error: true,
    data: errorMessage,
  });
}

export function notFound(res: Response) {
  return res.status(404).json({
    msg: "Não conseguimos encontrar!",
    error: true,
    data: {},
  });
}

export function verifySchema(
  data: unknown,
  res: Response,
  schema: ZodSchema,
): boolean {
  try {
    schema.parse(data);
    return false;
  } catch (err) {
    if (err instanceof ZodError) {
      const firstError = err.errors[0];
      res.status(400).json({
        msg: firstError.message,
        error: true,
        type: firstError.path[0],
      });
    }
    return true;
  }
}
