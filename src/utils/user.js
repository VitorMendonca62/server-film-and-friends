// Modules
import { jwtDecode } from 'jwt-decode';

// Models
import User from '../app/models/User.js';

// Check if the ID in req is the same as the user ID
export function IDBodyNotUserID(res, id, user_id) {
  if (id !== user_id) {
    return res.status(400).json({
      msg: 'Algo deu errado!',
      error: true,
    });
  }
  return false;
}

// Take user by token in req
export async function foundUserByToken(req) {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwtDecode(token);
  const user = await User.findOne({ where: { id: decodedToken.id } });
  return user;
}

// Found user bu username
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

// Found user bu username by email
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

// Show message of error in server
export function errorInServer(res, error) {
  return res.status(500).json({
    msg: 'Algo de errado com o servidor! Tente novamente!',
    error: true,
    data: error.message,
  });
}

// Verify erro in req.body
export function verifySchema(req, res, schema) {
  try {
    schema.validateSync(req.body, { abortEarly: false });
    return false;
  } catch (err) {
    res.status(400).json({
      msg: err.errors[0],
      error: true,
      type: err.inner[0].path,
    });
    return true;
  }
}
