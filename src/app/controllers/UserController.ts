/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
// Modulos
import Yup from "yup";
import { Op } from "sequelize";
import { v4 } from "uuid";

// Models
import User from "../../database/models/User.model";
import { Request, Response } from "express";
// Utils
// import { notFound } from "../../utils/general.js";

import { errorInServer, notFound } from "../../utils/general";
import IResponse from "../../types/response";
// import {
//   IDBodyNotUserID,
//   errorInServer,
//   foundEmail,
//   foundUserByToken,
//   foundUsername,
//   verifySchema,
// } from "../../utils/user.js";

export default {
  async index(req: Request, res: Response) {
    try {
      const users = await User.findAll();

      return res.status(200).json({
        msg: "Aqui estão todos nossos usuários!",
        error: false,
        data: users,
      });
    } catch (error: Error) {
      return errorInServer(res, error);
    }
  },

  async show(req: Request, res: Response) {
    const { username, id } = req.query;

    try {
      if (id === undefined && username === undefined) {
        const response: IResponse<T> = {
          msg: "Algo deu errado!",
          error: true,
          data: {},
        };
        return res.status(400).json(response);
      }

      const user: User = await User.findOne({
        where: {
          [Op.or]: [{ username: username || "" }, { id: id || "" }],
        },
      });
      const user: User = await User.findOne({
        where: {
          [Op.or]: [{ username: username || "" }, { id: id || "" }],
        },
      });

      if (!user) {
        return notFound(res);
      }
      const response: IResponse<T> = {
        msg: "Usuário encontrado com sucesso!",
        data: {
          name: user.name,
          username: user.username,
        },
        error: false,
      };

      return res.status(201).json(response);
    } catch (error: Error) {
      return errorInServer(res, error);
    }
  },

  // async store(req: Request, res: Response) {
  //   const userSchema = Yup.object().shape({
  //     name: Yup.string()
  //       .required("Nome é obrigatório")
  //       .max(50, "Nome muito longo")
  //       .min(8, "Nome muito cuito"),
  //     username: Yup.string()
  //       .required("Apelido é obrigatório")
  //       .max(50, "Apelido muito longo")
  //       .min(4, "Apelido muito cuito"),
  //     email: Yup.string()
  //       .required("Email é obrigatório")
  //       .email("Email inválido"),
  //     password: Yup.string()
  //       .required("Senha é obrigatória")
  //       .min(6, "A senha é curta demais!"),
  //   });

  //   if (verifySchema(req: Request, res: Response, userSchema)) return;

  //   try {
  //     const { name, password, username, email, password_hash } = req.body;

  //     const role = { name: "" };

  //     if (req.headers.authorization) {
  //       const user = await foundUserByToken(req);
  //       role.name = user?.role === "admin" ? "admin" : "user";
  //     } else role.name = "user";

  //     if (await foundUsername(res, username)) return;
  //     if (await foundEmail(res, email)) return;

  //     await User.create({
  //       id: v4(),
  //       name,
  //       username,
  //       email,
  //       password,
  //       password_hash,
  //       role: role.name,
  //     });

  //     return res.status(201).json({
  //       msg: "Usuário cadastrado com sucesso!",
  //       error: false,
  //     });
  //   } catch (error) {
  //     return errorInServer(res, error);
  //   }
  // },

  // async delete(req: Request, res: Response) {
  //   const { id } = req.params;
  //   try {
  //     const user = await foundUserByToken(req);
  //     const user_id = user?.id;

  //     if (!user) {
  //       return notFound(res, "Usuário não encontrado");
  //     }
  //     if (IDBodyNotUserID(res, id, user_id)) return;

  //     user.destroy();
  //     return res
  //       .status(200)
  //       .json({ error: false, msg: "Usuário deletado com sucesso!" });
  //   } catch (error) {
  //     return errorInServer(res, error);
  //   }
  // },

  // async update(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const { name, username } = req.body;

  //   const userSchema = Yup.object().shape({
  //     name: Yup.string().max(50, "Nome muito longo").min(8, "Nome muito cuito"),
  //     username: Yup.string()
  //       .max(50, "Apelido muito longo")
  //       .min(4, "Apelido muito cuito"),
  //   });

  //   if (verifySchema(req: Request, res: Response, userSchema)) return;

  //   try {
  //     const user = await foundUserByToken(req);
  //     const user_id = user?.id;

  //     if (!user) {
  //       return notFound(res, "Usuário não encontrado");
  //     }
  //     if (IDBodyNotUserID(res, id, user_id)) return;

  //     const isUserWithUsername = await User.findOne({
  //       where: {
  //         username: user.username === username ? "" : username,
  //       },
  //     });
  //     if (isUserWithUsername) {
  //       return res.status(400).json({
  //         msg: "Apelido já cadastrado, tente utilizar outro apelido!",
  //         error: true,
  //       });
  //     }

  //     user.update({
  //       name: name || user.name,
  //       username: username || user.username,
  //     });

  //     return res
  //       .status(200)
  //       .json({ error: false, msg: "Usuário atualizado com sucesso!" });
  //   } catch (error) {
  //     return errorInServer(res, error);
  //   }
  // },
};
