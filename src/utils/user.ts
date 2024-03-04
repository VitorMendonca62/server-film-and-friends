// Modules
import { jwtDecode } from "jwt-decode";
import { Schema, ValidationError } from "yup";

// Models
import User from "../database/models/User.model";
import { Response } from "express";

interface JwtPayload {
  id: string;
}

export function verifySchema(
  data: IUserSchema,
  res: Response,
  schema: Schema,
): boolean {
  try {
    schema.validateSync(data, { abortEarly: false });
    return false;
  } catch (err) {
    if (err instanceof ValidationError) {
      const message: IErrorMessage = {
        msg: err.errors[0],
        error: true,
        type: err.inner[0].path,
      };
      res.status(400).json(message);
    }
    return true;
  }
}
export async function foundUsername(res: Response, username: string) {
  const isUserWithUsername = await User.findOne({
    where: {
      username,
    },
  });
  if (isUserWithUsername) {
    const response: IResponse = {
      msg: "Apelido já cadastrado, tente utilizar outro apelido!",
      error: true,
      data: {},
    };
    res.status(400).json(response);
    return true;
  }
  return false;
}
export async function foundEmail(res: Response, email: string) {
  const isUserWithEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (isUserWithEmail) {
    const response: IResponse = {
      msg: "Email já cadastrado, tente fazer login!",
      error: true,
      data: {},
    };
    return res.status(400).json(response);
  }
  return false;
}

export async function foundUserByToken(authorization: string | undefined) {
  if (typeof authorization === "string") {
    const token = authorization.split(" ")[1];
    const decodedToken = jwtDecode(token) as JwtPayload;
    const { id } = decodedToken;
    const user = await User.findOne({ where: { id } });
    return user;
  }
}

export async function addToRoleInUser(authorization: string | undefined) {
  if (typeof authorization === "string") {
    const user = await foundUserByToken(authorization);
    return user?.role === "admin" ? "admin" : "user";
  }
  return "user";
}

export function IDBodyNotUserID(res: Response, id: string, user_id: string | undefined) {
  if (id !== user_id) {
    const response: IResponse = {
      msg: "Algo deu errado!",
      error: true,
      data: {},
    };
    return res.status(400).json(response);
  }
  return false;
}