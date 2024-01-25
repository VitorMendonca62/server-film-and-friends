/* eslint-disable consistent-return */
import jwt from "jsonwebtoken";
import * as Yup from "yup";
import authConfig from "../../config/auth";
import User from "../../database/models/User.model";

import { Request, Response } from "express";
import { errorInServer, notFound } from "../../utils/general";
import { verifySchema } from "../../utils/user";

// Models
interface IDataUser {
  id: string;
  email: string;
  name: string;
  username: string;
}

interface IResponseSession {
  username: string;
  auth: boolean;
  token: string | undefined;
  msg: string;
  error: boolean;
}

export default {
  async store(req: Request, res: Response) {
    const loginSchema = Yup.object().shape({
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Email inválido"),
      password: Yup.string()
        .required("Senha é obrigatória")
        .min(6, "A senha é curta demais!"),
    });

    if (verifySchema(req.body, res, loginSchema)) return;

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return notFound(res);

      const passwordIsRight = await user.verifyPassword(password);

      if (passwordIsRight) {
        const dataUser: IDataUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        };

        const { secret, expiresIn } = authConfig;

        if (typeof secret !== "string") {
          return errorInServer(
            res,
            "Ou não existe secret, ou algo está muito errado",
          );
        }

        const token = jwt.sign(dataUser, String(secret), { expiresIn });

        const response: IResponseSession = {
          username: user.username,
          auth: true,
          token,
          msg: "Usuário logado com sucesso!",
          error: false,
        };
        res.setHeader("authorization", token);
        return res.status(201).json(response);
      }

      const response: IResponseSession = {
        username: user.username,
        auth: false,
        token: undefined,
        msg: "Usuário ou senha estão incorretos. Tente novamenete",
        error: true,
      };

      return res.status(400).json(response);
    } catch (err) {
      return errorInServer(res, err);
    }
  },
};
