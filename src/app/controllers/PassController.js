/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
// Modulos
import Yup from 'yup';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import takeHTMLEmail from '../../../pages/email.js';
import transporterEmail from '../../config/email.js';

// Models
import User from '../models/User.js';
import {
  verifySchema,
  notFoundUser,
  errorInServer,
  foundUserByToken,
  IDBodyNotUserID,
} from '../../utils/user.js';

const users_acess_code = {};
const users_acess = {};

async function updatePass(res, user, newPassword) {
  try {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.update({ password_hash: newPasswordHash });

    return res.status(200).json({
      error: false,
      msg: 'Senha atualizada com sucesso!',
    });
  } catch (error) {
    return errorInServer(res, error);
  }
}
export default {
  async sendEmailForgotPass(req, res) {
    const emailSchema = Yup.object().shape({
      email: Yup.string()
        .required('Email é obrigatório')
        .email('Email inválido'),
    });

    if (verifySchema(req, res, emailSchema)) return;

    try {
      const { email } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (notFoundUser(res, user)) return;

      const acess_code = nanoid(6);
      const { username } = user;

      const mailOptions = {
        from: 'no.reply.movie.and.friends@gmail.com',
        to: email,
        subject: 'Seu código de acesso para redefinir senha é...',
        html: takeHTMLEmail(username, acess_code),
      };

      transporterEmail.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(400).json({
            msg: 'Algo deu errado!',
            error: true,
            data: err,
          });
        }
        users_acess_code[email] = acess_code;

        return res.status(200).json({
          msg: 'Em breve, você vai receber um e-mail para redefinir sua senha. Se não conseguir encontrar o e-mail, lembre-se de procurar na pasta de spam ou lixo eletrônico.',
          error: false,
          data: [],
        });
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async verifyCodeForgotPass(req, res) {
    const codeSchema = Yup.object().shape({
      code: Yup.string()
        .required('Código é obrigatório')
        .length(6, 'Códido incorreto'),
      email: Yup.string()
        .required('Email é obrigatório')
        .email('Email inválido'),
    });

    if (verifySchema(req, res, codeSchema)) return;

    try {
      const { code, email } = req.body;

      if (users_acess_code[email] !== code) {
        return res.status(400).json({
          msg: 'Código incorreto!',
          data: {},
          error: true,
        });
      }

      users_acess[email] = true;
      setTimeout(() => {
        users_acess[email] = false;
      }, 50000);

      if (!users_acess[email]) {
        return res.status(400).json({
          msg: 'Tempo para redefinir a senha expirou, tente novamente!',
          data: {},
          error: true,
        });
      }
      return res.status(200).json({
        msg: 'Código correto!',
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
        .required('Senha nova é obrigatória')
        .min(8, 'A senha nova é curta demais!'),
      email: Yup.string()
        .required('Email é obrigatório')
        .email('Email inválido'),
    });

    if (verifySchema(req, res, userSchema)) return;
    try {
      const user = await User.findOne({ where: { email } });

      if (notFoundUser(res, user)) return;

      updatePass(res, user, newPassword);
      users_acess[email] = false;
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async updatePassword(req, res) {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    const userSchema = Yup.object().shape({
      password: Yup.string()
        .required('Senha antiga é obrigatória')
        .min(8, 'A senha antiga é curta demais!'),
      newPassword: Yup.string()
        .required('Senha nova é obrigatória')
        .min(8, 'A senha nova é curta demais!'),
    });

    if (verifySchema(req, res, userSchema)) return;

    try {
      const user = await foundUserByToken(req);
      const user_id = user?.id;

      if (notFoundUser(res, user)) return;
      if (IDBodyNotUserID(res, id, user_id)) return;

      const passwordIsCorrect = await user.verifyPassword(
        password,
        user.password_hash
      );
      if (!passwordIsCorrect) {
        return res.status(400).json({
          msg: 'A senha antiga está incorreta!',
          error: true,
        });
      }

      updatePass(res, user, newPassword);
    } catch (error) {
      return errorInServer(res, error);
    }
  },
};
