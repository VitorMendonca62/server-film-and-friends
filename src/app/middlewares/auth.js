// Modules
import jwt from 'jsonwebtoken';

// Config
import authConfig from '../../config/auth.js';

export default (req, res, next) => {
  // Take token in header
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(403).json({ msg: 'Token não fornecido', error: true });
  }

  const token = authToken.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(500).json({
          msg: 'Algo de errado com o servidor! Tente novamente!',
          error: true,
          data: err,
        });
      }
      req.userId = decoded.id;
      req.username = decoded.name;
      return next();
    });
    return false;
  } catch (error) {
    return res.status(401).json({
      msg: 'Token inválido!',
      error: true,
      data: error.message,
    });
  }
};
