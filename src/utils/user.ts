// TUDO OIK


// Libraries
import { jwtDecode } from "jwt-decode";

// Models
import User from "../database/models/User.model";

// Types
import { Response } from "express";

export async function foundUsername(
  res: Response,
  username: string,
): Promise<boolean> {
  const isUserWithUsername = await User.findOne({
    where: {
      username,
    },
  });

  if (isUserWithUsername) {
    res.status(400).json({
      msg: "Apelido já cadastrado, tente utilizar outro apelido!",
      error: true,
      data: {},
    });
    return true;
  }
  return false;
}

export async function foundEmail(
  res: Response,
  email: string,
): Promise<boolean> {
  const isUserWithEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (isUserWithEmail) {
    res.status(400).json({
      msg: "Email já cadastrado, tente fazer login!",
      error: true,
      data: {},
    });
    return true;
  }
  return false;
}

export async function foundUserByToken(
  authorization: string,
): Promise<User | null> {
  const token = authorization.split(" ")[1];
  const decodedToken = jwtDecode(token) as JwtPayload;
  const { id } = decodedToken;
  const user = await User.findOne({ where: { id } });
  return user;
}

export async function addToRoleInUser(
  authorization: string,
): Promise<"admin" | "user"> {
  const user = await foundUserByToken(authorization);
  return user?.role === "admin" ? "admin" : "user";
}

export function IDBodyNotUserID(
  res: Response,
  id: string,
  user_id: string,
): boolean {
  if (id !== user_id) {
    res.status(400).json({
      msg: "Algo deu errado!",
      error: true,
      data: {},
    });
    return true;
  }
  return false;
}
