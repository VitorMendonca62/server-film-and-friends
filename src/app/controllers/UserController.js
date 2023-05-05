const { v4 } = require('uuid');
const bcrypt = require('bcryptjs');
const Yup = require('yup');
const User = require('../models/User');

const { admin, usersRef } = require('../../firebase');

module.exports = {
  async index(req, res) {
    try {
      const response = await usersRef.get();
      const docs = await response.docs;

      const users = docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));

      return res.json(users);
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, msg: 'Algo de errado com o servidor' });
    }
  },

  async showForUsername(req, res) {
    const { username } = req.params;
    const snapshot = await usersRef.where('username', '==', username).get();

    if (snapshot.empty) {
      return res.json({
        msg: 'Usuário não encontrado!',
        error: true,
      });
    }

    const user = snapshot.docs[0].data();

    return res.status(200).json({
      msg: 'Usuário encontrado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      error: false,
    });
  },

  async show(req, res) {
    const { id } = req.params;
    const snapshot = await usersRef.where('id', '==', id).get();

    if (snapshot.empty) {
      return res.json({
        msg: 'Usuário não encontrado, tente se cadastrar!',
        error: true,
      });
    }

    const user = snapshot.docs[0].data();

    return res.status(200).json({
      msg: 'Usuário encontrado com sucesso!',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
      },
      error: false,
    });
  },

  async store(req, res) {
    let role = 'user';

    const userSchema = Yup.object().shape({
      name: Yup.string()
        .required('Nome é obrigatório')
        .max(50, 'Nome muito longo')
        .min(8, 'Nome muito cuito'),
      username: Yup.string()
        .required('Apelido é obrigatório')
        .min(3, 'Apelido muito curto')
        .max(20, 'Nome muito longo'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória')
        .min(6, 'A senha é curta demais!'),
      role: Yup.string(),
    });

    try {
      userSchema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.json({
        msg: err.errors[0],
        error: true,
        type: err.inner[0].path,
      });
    }

    const { name, email, password, username } = req.body;

    const snapshot = await usersRef.where('email', '==', email)?.get();

    if (!snapshot.empty) {
      return res.json({
        msg: 'Usuário já cadastrado, tente fazer login!',
        error: true,
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    usersRef.add({
      id: v4(),
      name,
      username,
      email,
      password,
      password_hash,
      role,
    });

    return res.status(201).json({
      msg: 'Usuário cadastrado com sucesso!',
      error: false,
    });
  },

  async update(req, res) {
    // const { id } = req.params;
    // const { name, email, password, role } = req.body;
    // const user = await User.findOne({ where: { id } });
    // if (!user) {
    //   return res.json({
    //     msg: 'Usuário não encontrado, tente se cadastrar!',
    //     error: true,
    //   });
    // }
    // await user.update({ name, email, password, role });
    // return res
    //   .status(200)
    //   .json({ msg: 'Usuário editado com sucesso', user, error: false });
  },

  async delete(req, res) {
    //   const { id } = req.params;
    //   const user = await User.findOne({ where: { id } });
    //   if (!user) {
    //     return res.json({
    //       msg: 'Usuário não encontrado, tente se cadastrar!',
    //       error: true,
    //     });
    //   }
    //   await user.destroy();
    //   return res
    //     .status(200)
    //     .json({ msg: 'Usuário excluído com sucesso!', error: false });
  },
};
