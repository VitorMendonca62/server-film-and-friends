// TUDO OK, 08/04

// Libraries
import { v4 } from "uuid";

// Models
import User from "../../database/models/User.model";

// Types
import { Request, Response } from "express";

// Utils
import { errorInServer, notFound } from "../../utils/general";
import {
  foundUserByToken,
  foundUsername,
  foundEmail,
  addToRoleInUser,
  IDBodyNotUserID,
} from "../../utils/user";
import { verifySchema } from "../../utils/general";

// Schemas
import {
  userPostSchema,
  userUpdateNameOrUsername,
} from "../../utils/schemas/user";

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
    const username = req.query.username as string | undefined;

    try {
      if (username === undefined) {
        return notFound(res);
      }

      const user = await User.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        return notFound(res);
      }

      return res.status(200).json({
        msg: "Usuário encontrado com sucesso!",
        data: {
          name: user.name,
          username: user.username,
        },
        error: false,
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async store(req: Request, res: Response) {
    if (verifySchema(req.body, res, userPostSchema)) return;

    try {
      const { name, password, username, email, passwordHash } = req.body;

      const authorization = req.headers.authorization;

      const role =
        authorization === undefined
          ? "user"
          : await addToRoleInUser(authorization);

      if (await foundUsername(res, username)) return;
      if (await foundEmail(res, email)) return;

      await User.create({
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
        data: {},
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const authorization = req.headers.authorization;
      const user =
        authorization === undefined
          ? null
          : await foundUserByToken(authorization);

      if (!user) {
        return notFound(res);
      }

      if (IDBodyNotUserID(res, id, user.id)) return;

      await user.destroy();

      return res.status(200).json({
        msg: "Usuário deletado com sucesso!",
        error: false,
        data: {},
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;

    if (verifySchema(req.body, res, userUpdateNameOrUsername)) return;

    try {
      const authorization = req.headers.authorization;
      const user =
        authorization === undefined
          ? null
          : await foundUserByToken(authorization);

      if (!user) {
        return notFound(res);
      }

      if (IDBodyNotUserID(res, id, user.id)) return;

      const { name, username }: NameAndUsername = req.body;

      const isUserWithUsername = await User.findOne({
        where: {
          username: user.username === username ? "" : username,
        },
      });

      if (isUserWithUsername) {
        return res.status(400).json({
          msg: "Apelido já cadastrado, tente utilizar outro apelido!",
          error: true,
          data: {},
        });
      }

      user.update({
        name: name || user.name,
        username: username || user.username,
      });

      return res.status(200).json({
        error: false,
        msg: "Usuário atualizado com sucesso!",
        data: {},
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },
};
