/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import Yup from 'yup';
import authConfig from '../../config/auth.js';

// Models
import User from '../models/User.js';

export default {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        msg: 'Usuário não encontrado, tente fazer o cadastro!',
        error: true,
      });
    }

    const loginSchema = Yup.object().shape({
      email: Yup.string()
        .required('Email é obrigatório')
        .email('Email inválido'),
      password: Yup.string().required('Senha é obrigatória').min(6),
    });

    try {
      loginSchema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ msg: err.errors[0], error: true, type: err.inner[0].path });
    }

    try {
      const passwordIsRight = await user.verifyPassword(password);

      if (user && passwordIsRight) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
          },
          authConfig.secret,
          { expiresIn: authConfig.expiresIn },
        );
        req.headers.authorization = token;

        return res.json({
          username: user.username,
          auth: true,
          token,
          msg: 'Usuário logado com sucesso!',
          error: false,
        });
      }

      if (!user || !passwordIsRight) {
        return res.status(200).json({
          msg: 'Usuário ou senha estão incorretos. Tente novamenete',
          error: true,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: 'Algo de errado com o servidor. Tente novamente!',
        error: true,
        data: err,
      });
    }
  },
};
