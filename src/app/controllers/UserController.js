/* eslint-disable object-curly-newline */
// Modulos
import Yup from 'yup';
import { Op } from 'sequelize';
import { v4 } from 'uuid';

// Models
import User from '../models/User.js';

export default {
  async index(req, res) {
    try {
      const users = await User.findAll();
      return res.status(200).json({
        msg: 'Aqui estão todos nossos usuários!',
        error: false,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Algo de errado com o servidor! Tente novamente!',
        error: true,
        data: error,
      });
    }
  },

  async store(req, res) {
    const userSchema = Yup.object().shape({
      name: Yup.string()
        .required('Nome é obrigatório')
        .max(50, 'Nome muito longo')
        .min(8, 'Nome muito cuito'),
      username: Yup.string()
        .required('Apelido é obrigatório')
        .max(50, 'Apelido muito longo')
        .min(4, 'Apelido muito cuito'),
      email: Yup.string()
        .required('Email é obrigatório')
        .email('Email inválido'),
      password: Yup.string()
        .required('Senha é obrigatória')
        .min(6, 'A senha é curta demais!'),
    });

    try {
      userSchema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({
        msg: err.errors[0],
        error: true,
        type: err.inner[0].path,
      });
    }
    try {
      // eslint-disable-next-line camelcase
      const { name, password, username, email, password_hash } = req.body;
      const role = 'user';

      const isUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });

      if (isUser) {
        return res.status(400).json({
          msg: 'Usuário já cadastrado, tente fazer login!',
          error: true,
        });
      }

      await User.create({
        id: v4(),
        name,
        username,
        email,
        password,
        // eslint-disable-next-line camelcase
        password_hash,
        role,
      });

      return res.status(201).json({
        msg: 'Usuário cadastrado com sucesso!',
        error: false,
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Algo de errado com o servidor. Tente novamente!',
        error: true,
        data: error,
      });
    }
  },
};
