const { v4 } = require('uuid');
const Yup = require('yup');
const User = require('../models/User');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    return res.json(users);
  },

  async show(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);

    return res
      .status(200)
      .json({ msg: 'Usuário encontrado com sucesso!', user });
  },

  async store(req, res) {
    let role = 'user';

    const userSchema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Nome é obrigatório'),
      password: Yup.string().required().min(6),
      role: Yup.string(),
    });

    try {
      userSchema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ erro: err.errors });
    }

    const { name, email, password, password_hash } = req.body;

    const isUser = await User.findOne({ where: { email } });

    if (isUser) {
      return res
        .status(422)
        .json({ msg: 'Usuário já cadastrado, tente fazer login!' });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      password_hash,
      role,
    });

    return res
      .status(201)
      .json({ msg: 'Usuário cadastrado com sucesso!', id: user.id });
  },

  async update(req, res) {
    const { id } = req.params;

    const { name, email, password, role } = req.body;

    await User.update(
      { name, email, password, role },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ msg: 'Usuário editado com sucesso' });
  },

  async delete(req, res) {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({ msg: 'Usuário excluído com sucesso!' });
  },
};
