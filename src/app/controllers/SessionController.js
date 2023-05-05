
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
const Yup = require('yup');
const bcrypt = require('bcryptjs');

const { admin, usersRef } = require('../../firebase');

function verifyPassword(password,password_hash) {
  return bcrypt.compare(password, password_hash);
}

module.exports = {
  async store(req, res) {
    const { email, password } = req.body;

    const snapshot = await usersRef.where('email', '==', email)?.get();

    if (snapshot.empty) {
      return res.status(200).json({
        msg: 'Usuário não encontrado. Tente se cadastrar',
        error: true,
      });
    }
    const user = snapshot.docs[0].data();

    const loginSchema = Yup.object().shape({
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string().required('Senha é obrigatória').min(6),
    });

    try {
      loginSchema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(200).json({ erro: err.errors });
    }

    const passwordIsRight = verifyPassword(password,user.password_hash);

    if (user && passwordIsRight) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );
      req.headers.authorization = token;

      return res.json({
        id: user.id,
        name: user.name,
        username: user.username,
        rule: user.rule,
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
  },
};
