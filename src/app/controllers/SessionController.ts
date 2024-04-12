// TUDO OK

// Libraries
import jwt from "jsonwebtoken";

// Models
import User from "../../database/models/User.model";

// Types
import { Request, Response } from "express";

// Utils
import { errorInServer, notFound, verifySchema } from "../../utils/general";

// Config
import authConfig from "../../config/auth";
import { userLoginSchema } from "../../utils/schemas/user";

export default {
  async store(req: Request, res: Response) {
    if (verifySchema(req.body, res, userLoginSchema)) return;

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return notFound(res);

      const passwordIsRight = await user.verifyPassword(password);

      if (passwordIsRight) {
        const dataUser: IUserBasicOutputcSchema = {
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

        const token = jwt.sign(dataUser, secret, { expiresIn });

        res.setHeader("authorization", token);
        return res.status(201).json({
          username: user.username,
          auth: true,
          token,
          msg: "Usuário logado com sucesso!",
          error: false,
        });
      }

      return res.status(400).json({
        username: user.username,
        auth: false,
        token: undefined,
        msg: "Usuário ou senha estão incorretos. Tente novamenete",
        error: true,
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },
};
