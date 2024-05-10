// Tudo OK

// Libraries
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

// Models
import User from "../../database/models/User.model";

// Types
import { Response, Request } from "express";

// Utils
import { errorInServer, notFound, verifySchema } from "../../utils/general";
import { IDBodyNotUserID, foundUserByToken } from "../../utils/user";

// Services
import sendMail from "../../services/mail";
import {
  userForgotPasswordSchema,
  emailTakeCodeAcessSchema,
  userVerifyCodeSchema,
  userUpdatePasswordSchema,
} from "../../schemas/user";

export const usersAcessCode: IUsersAcessCode = {};
export const usersAcess: IUsersAcess = {};

async function updatePass(res: Response, user: User, newPassword: string) {
  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.update({ passwordHash: newPasswordHash, password: newPassword });

    return res.status(200).json({
      error: false,
      msg: "Senha atualizada com sucesso!",
      data: {},
    });
  } catch (error) {
    return errorInServer(res, error);
  }
}

export default {
  async takeCodeAndSendEmail(req: Request, res: Response) {
    if (verifySchema(req.body, res, emailTakeCodeAcessSchema)) return;

    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) return notFound(res);

      const acessCode = v4().substring(0, 6);
      const { username } = user;

      if (sendMail(res, email, username, acessCode)) return;

      usersAcessCode[email] = acessCode;

      return res.status(200).json({
        msg: "Em breve, você vai receber um e-mail para redefinir sua senha. Se não conseguir encontrar o e-mail, lembre-se de procurar na pasta de spam ou lixo eletrônico.",
        error: false,
        data: [],
      });
    } catch (error) {
      errorInServer(res, error);
    }
  },

  async verifyCode(req: Request, res: Response) {
    if (verifySchema(req.body, res, userVerifyCodeSchema)) return;

    try {
      const { code, email } = req.body;

      if (usersAcessCode[email] !== code) {
        return res.status(400).json({
          msg: "Código incorreto!",
          data: {},
          error: true,
        });
      }

      usersAcess[email] = true;

      setTimeout(() => {
        usersAcess[email] = false;
      }, 50000);

      delete usersAcessCode[email];
      return res.status(200).json({
        msg: "Código correto!",
        data: {},
        error: false,
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async forgotPass(req: Request, res: Response) {
    if (verifySchema(req.body, res, userForgotPasswordSchema)) return;

    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return notFound(res);
      }

      if (usersAcess[email]) {
        updatePass(res, user, newPassword);
        delete usersAcess[email];
        return;
      }
      return res.status(400).json({
        msg: "Tempo para redefinir a senha expirou, tente novamente!",
        data: {},
        error: true,
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async updatePassword(req: Request, res: Response) {
    const { id } = req.params;

    const userSchema = userUpdatePasswordSchema;

    if (verifySchema(req.body, res, userSchema)) return;

    try {
      const authorization = req.headers.authorization;
      const user =
        authorization === undefined
          ? null
          : await foundUserByToken(authorization);

      if (!user) {
        return notFound(res);
      }

      if (IDBodyNotUserID(res, id, user.id)) return;

      const { oldPassword, newPassword } = req.body;

      const passwordIsCorrect = await user.verifyPassword(oldPassword);

      if (!passwordIsCorrect) {
        return res.status(400).json({
          msg: "A senha antiga está incorreta!",
          error: true,
        });
      }

      updatePass(res, user, newPassword);
    } catch (error) {
      return errorInServer(res, error);
    }
  },
};
