// Libraries
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";

// Models
import User from "../../database/models/User.model";

// Types 
import { Response, Request } from "express";


// Utils
import { errorInServer, notFound } from "../../utils/general";
import {
IDBodyNotUserID,
foundUserByToken,
verifySchema,
} from "../../utils/user";
import { textsInputsErrors } from "../../utils/texts";

// Services
import sendMail from "../../services/mail";

interface IUsersAcessCode {
  [key: string]: string;
}
interface IUsersAcess {
  [key: string]: boolean;
}

export const usersAcessCode: IUsersAcessCode = {};
export const usersAcess: IUsersAcess = {};

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
  async takeCodeAndSendEmail(req: Request, res: Response) {
    const emailSchema = Yup.object().shape({
      email: textsInputsErrors.email.yup
    });

    if (verifySchema(req.body, res, emailSchema)) return;

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
    const codeSchema = Yup.object().shape({
      email: textsInputsErrors.email.yup,
      code: Yup.string()
        .required("Código é obrigatório")
        .length(6, "Códido incorreto"),
    });

    if (verifySchema(req.body, res, codeSchema)) return;

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
    const { email, newPassword } = req.body;

    const userSchema = Yup.object().shape({
      email: Yup.string()
        .required("Email é obrigatório")
        .email("Email inválido"),
      newPassword: Yup.string()
        .required("Senha nova é obrigatória")
        .min(8, "A senha nova é curta demais!"),
    });

    if (verifySchema(req.body, res, userSchema)) return;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return notFound(res);
      }

      if (usersAcess[email]) {
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

  async updatePassword(req: Request, res: Response) {
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
    
    if (verifySchema(req.body, res, userSchema)) return;

    try {
      const user = await foundUserByToken(req.headers.authorization);
      const user_id = user?.id;

      if (!user) {
        return notFound(res);
      }
      if (IDBodyNotUserID(res, id, user_id)) return;

      const passwordIsCorrect = await user.verifyPassword(password);
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
