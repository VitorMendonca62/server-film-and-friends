/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
// Modulos
import Yup from 'yup';
import { jwtDecode } from 'jwt-decode';
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

  async show(req, res) {
    const { username, id } = req.query;
    try {
      if (id === undefined && username === undefined) {
        return res.status(400).json({
          msg: 'Algo deu errado!',
          error: true,
        });
      }
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: username || '' }, { id: id || '' }],
        },
      });

      if (!user) {
        return res.status(404).json({
          msg: 'Usuário não encontrado no sistema.',
          error: true,
        });
      }
      return res.status(201).json({
        msg: 'Usuário encontrado com sucesso!',
        data: {
          name: user.name,
          username: user.username,
        },
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
      const { name, password, username, email, password_hash } = req.body;

      const role = { name: 'admin' };

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwtDecode(token);
        const user = await User.findOne({ where: { id: decodedToken.id } });
        role.name = user?.role === 'admin' ? 'admin' : 'user';
      } else role.name = 'user';

      const isUserWithEmail = await User.findOne({
        where: {
          email,
        },
      });
      const isUserWithUsername = await User.findOne({
        where: {
          username,
        },
      });

      if (isUserWithUsername) {
        return res.status(400).json({
          msg: 'Apelido já cadastrado, tente utilizar outro apelido!',
          error: true,
        });
      }
      if (isUserWithEmail) {
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
        password_hash,
        role: role.name,
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

  async delete(req, res) {
    const { id } = req.body;
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwtDecode(token);
      const user = await User.findOne({ where: { id: decodedToken.id } });
      const user_id = user?.id;

      if (!user) {
        return res.status(404).json({
          msg: 'Usuário não encontrado no sistema.',
          error: true,
        });
      }
      if (id !== user_id) {
        return res.status(400).json({
          msg: 'Algo deu errado!',
          error: true,
        });
      }

      user.destroy();
      return res
        .status(200)
        .json({ error: false, msg: 'Usuário deletado com sucesso!' });
    } catch (error) {
      return res.status(500).json({
        msg: 'Algo de errado com o servidor! Tente novamente!',
        error: true,
        data: error,
      });
    }
  },
};
