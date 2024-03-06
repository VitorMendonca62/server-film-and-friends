import { Response } from "express";
import { connection } from "../database";

export default function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function errorInServer(res: Response, error: unknown) {
  const errorMessage = getErrorMessage(error);

  const response: IResponse = {
    msg: "Algo de errado com o servidor! Tente novamente!",
    error: true,
    data: errorMessage,
  };
  return res.status(500).json(response);
}

export function notFound(res: Response) {
  const response: IResponse = {
    msg: "Não conseguimos encontrar!",
    error: true,
    data: {},
  };
  return res.status(404).json(response);
}

export async function deleteAllData(){
    await connection.query("DELETE FROM users; ");
}
