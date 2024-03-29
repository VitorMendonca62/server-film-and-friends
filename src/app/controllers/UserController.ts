// Libraries
import * as Yup from "yup";
import { Op } from "sequelize";
import { v4 } from "uuid";

// Models
import User from "../../database/models/User.model";

// Types 
import { Request, Response } from "express";

// Utils
import { errorInServer, notFound } from "../../utils/general";
import {
  verifySchema,
  foundUserByToken,
  foundUsername,
  foundEmail,
  addToRoleInUser,
  IDBodyNotUserID,
} from "../../utils/user";
import { textsInputsErrors } from "../../utils/texts";

export default {
  async index(req: Request, res: Response) {
    try {
      const users = await User.findAll();

      return res.status(200).json({
        msg: "Aqui estão todos nossos usuários!",
        error: false,
        data: users,
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async show(req: Request, res: Response) {
    const username: string = String(req.query.username);
    const id: string = String(req.query.id);

    try {
      if (id === "undefined" && username === "undefined") {
        return notFound(res);
      }

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: username || "" }, { id: id || "" }],
        },
      });

      if (!user) {
        return notFound(res);
      }
      const response: IResponse = {
        msg: "Usuário encontrado com sucesso!",
        data: {
          name: user.name,
          username: user.username,
        },
        error: false,
      };

      return res.status(200).json(response);
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async store(req: Request, res: Response) {
    const userSchema = Yup.object().shape({
      name: textsInputsErrors.name.yup,
      username: textsInputsErrors.username.yup,
      email: textsInputsErrors.email.yup,
      password: textsInputsErrors.password.yup,
    });

    if (verifySchema(req.body, res, userSchema)) return;

    try {
      const { name, password, username, email, passwordHash } = req.body;

      const authorization = req.headers.authorization;

      const role = await addToRoleInUser(authorization);

      if (await foundUsername(res, username)) return;
      if (await foundEmail(res, email)) return;

      const user = await User.create({
        id: v4(),
        name,
        username,
        email,
        password,
        passwordHash,
        role,
      });
      return res.status(201).json({
        msg: "Usuário cadastrado com sucesso!",
        error: false,
        data: process.env.ENVIRONMENT === "test" ? user : {},
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const authorization = req.headers.authorization;
      const user = await foundUserByToken(authorization);

      if (!user) {
        return notFound(res);
      }

      const user_id = user?.id;

      if (IDBodyNotUserID(res, id, user_id)) return;

      await user.destroy();

      const response: IResponse = {
        msg: "Usuário deletado com sucesso!",
        error: false,
        data: {},
      };

      return res.status(200).json(response);
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, username } = req.body;

    const userSchema = Yup.object().shape({
      name: textsInputsErrors.name.yup,
      username: textsInputsErrors.username.yup,
    });

    if (verifySchema(req.body, res, userSchema)) return;

    try {
      const user = await foundUserByToken(req.headers.authorization);
      const user_id = user?.id;

      if (!user) {
        return notFound(res);
      }
      if (IDBodyNotUserID(res, id, user_id)) return;

      const isUserWithUsername = await User.findOne({
        where: {
          username: user.username === username ? "" : username,
        },
      });

      if (isUserWithUsername) {
        return res.status(400).json({
          msg: "Apelido já cadastrado, tente utilizar outro apelido!",
          error: true,
        });
      }

      user.update({
        name: name || user.name,
        username: username || user.username,
      });

      return res
        .status(200)
        .json({ error: false, msg: "Usuário atualizado com sucesso!" });
    } catch (error) {
      return errorInServer(res, error);
    }
  },
};
