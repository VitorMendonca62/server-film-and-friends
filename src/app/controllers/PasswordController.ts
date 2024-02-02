/* eslint-disable consistent-return */
// Modules
import * as Yup from "yup";

import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// Models

import { errorInServer, notFound } from "../../utils/general.js";
import User from "../../database/models/User.model.js";
import { Response, Request } from "express";
import { verifySchema } from "../../utils/user.js";

// import {
//   verifySchema,,
//   foundUserByToken,
//   IDBodyNotUserID,
// } from '../../utils/user';

// Config
import takeHTMLEmail from '../../../pages/email';
import transporterEmail from '../../config/email';

interface IUsersAcessCode {
  email: string
}

const usersAcessCode: IUsersAcessCode = {};
const usersAcess = {};

async function updatePass(res: Response, user: User, newPassword: string) {
  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.update({ passwordHash: newPasswordHash });

    const response: IResponse = {
      error: false,
      msg: "Senha atualizada com sucesso!",
      data: {},
    };
    return res.status(200).json(response);
  } catch (error) {
    return errorInServer(res, error);
  }
}

export default {
  async sendEmailForgotPass(req: Request, res: Response) {
    const emailSchema = Yup.object().shape({
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Email inválido"),
    });

    if (verifySchema(req.body, res, emailSchema)) return;

    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) return notFound(res);

      const acessCode = nanoid(6);
      const { username } = user;

      const mailOptions = {
        from: "no.reply.movie.and.friends@gmail.com",
        to: email,
        subject: "Seu código de acesso para redefinir senha é...",
        html: takeHTMLEmail(username, acessCode),
      };

      transporterEmail.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(400).json({
            msg: "Algo deu errado!",
            error: true,
            data: err,
          });
        }
        usersAcessCode[email] = acessCode;

        return res.status(200).json({
          msg: "Em breve, você vai receber um e-mail para redefinir sua senha. Se não conseguir encontrar o e-mail, lembre-se de procurar na pasta de spam ou lixo eletrônico.",
          error: false,
          data: [],
        });
      });
    } catch (error) {
      errorInServer(res, error);
    }
  },

  async verifyCodeForgotPass(req, res) {
    const codeSchema = Yup.object().shape({
      code: Yup.string()
        .required("Código é obrigatório")
        .length(6, "Códido incorreto"),
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Email inválido"),
    });

    if (verifySchema(req, res, codeSchema)) return;

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

  async forgotPass(req, res) {
    const { email, newPassword } = req.body;

    const userSchema = Yup.object().shape({
      newPassword: Yup.string()
        .required("Senha nova é obrigatória")
        .min(8, "A senha nova é curta demais!"),
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Email inválido"),
    });

    if (verifySchema(req, res, userSchema)) return;

    try {
      if (usersAcess[email]) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return notFound(res, "Usuário não encontrado");
        }

        updatePass(res, user, newPassword);
        delete usersAcess[email];
      } else {
        return res.status(400).json({
          msg: "Tempo para redefinir a senha expirou, tente novamente!",
          data: {},
          error: true,
        });
      }
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async updatePassword(req, res) {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    const userSchema = Yup.object().shape({
      password: Yup.string()
        .required("Senha antiga é obrigatória")
        .min(8, "A senha antiga é curta demais!"),
      newPassword: Yup.string()
        .required("Senha nova é obrigatória")
        .min(8, "A senha nova é curta demais!"),
    });

    if (verifySchema(req, res, userSchema)) return;

    try {
      const user = await foundUserByToken(req);
      const user_id = user?.id;

      if (!user) {
        return notFound(res, "Usuário não encontrado");
      }
      if (IDBodyNotUserID(res, id, user_id)) return;

      const passwordIsCorrect = await user.verifyPassword(
        password,
        user.passwordHash,
      );
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
