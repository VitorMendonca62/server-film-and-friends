import { jwtDecode } from 'jwt-decode';
import User from '../app/models/User.js';

export function IDBodyNotUserID(res, id, user_id) {
  if (id !== user_id) {
    return res.status(400).json({
      msg: 'Algo deu errado!',
      error: true,
    });
  }
  return false;
}
export async function foundUserByToken(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwtDecode(token);
  const user = await User.findOne({ where: { id: decodedToken.id } });
  return user;
}
export function notFoundUser(res, user) {
  if (!user) {
    return res.status(404).json({
      msg: 'Usuário não encontrado no sistema.',
      error: true,
    });
  }
  return false;
}
export async function foundUsername(res, username) {
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
  return false;
}
export async function foundEmail(res, email) {
  const isUserWithEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (isUserWithEmail) {
    return res.status(400).json({
      msg: 'Usuário já cadastrado, tente fazer login!',
      error: true,
    });
  }
  return false;
}
export function errorInServer(res, error) {
  return res.status(500).json({
    msg: 'Algo de errado com o servidor! Tente novamente!',
    error: true,
    data: error.message,
  });
}
// eslint-disable-next-line consistent-return
export function verifySchema(req, res, schema) {
  try {
    schema.validateSync(req.body, { abortEarly: false });
  } catch (err) {
    res.status(400).json({
      msg: err.errors[0],
      error: true,
      type: err.inner[0].path,
    });
    return true;
  }
}
