import { Response } from "express";
import IResponse from "../types/response";

export function errorInServer(res: Response, error: Error) {
  const response: IResponse<T> = {
    msg: "Algo de errado com o servidor! Tente novamente!",
    error: true,
    data: error.message,
  };
  return res.status(500).json(response);
}

export function notFound(res: Response) {
  const response: IResponse<T> = {
    msg: "Não conseguimos encontrar!",
    error: true,
    data: {},
  };
  return res.status(404).json(response);
}
