// Libraries
import * as Yup from "yup";

// Models
import Movie from "../../database/models/Movie.model";
import Serie from "../../database/models/Serie.model";
// Types
import { Request, Response } from "express";

// Utils
import { errorInServer } from "../../utils/general";
import { verifySchema } from "../../utils/user";
import fetchAPIMedia from "../../api/media";

export default {
  async index(req: Request, res: Response) {
    try {
      const medias: ObjectIndexMedias = { movies: [], series: [] };

      const movies = await Movie.findAll();
      const series = await Serie.findAll();

      medias.movies = movies;
      medias.series = series;

      const response: IResponse = {
        msg: "Aqui estão todos nossos filmes e séries!",
        error: false,
        data: medias,
      };

      return res.status(201).json(response);
    } catch (err) {
      return errorInServer(res, err);
    }
  },
  async show(req: Request, res: Response) {
    const type: string = String(req.query.type);
    const id: string = String(req.query.id);

    const where = {
      where: {
        id,
      },
    };

    try {
      const data: DataShowMedia =
        type == "movie"
          ? await Movie.findOne(where)
          : await Serie.findOne(where);

      const response: IResponse = {
        msg: "Aqui estão o filme ou série.",
        error: false,
        data,
      };

      return res.status(200).json(response);
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async store(req: Request, res: Response) {
    const mediaStoreSchema = Yup.object().shape({
      id: Yup.string().required("O ID é obrigatório"),
      APIName: Yup.string().required("O nome da API é obrigatório"),
      type: Yup.string()
        .required("O tipo da mídia é obrigatório")
        .oneOf(["movie", "tv"]),
    });

    if (verifySchema(req.body, res, mediaStoreSchema)) return;

    try {
      const { id, APIName, type } = req.body;

      const fluxOfData = async (model: TypeModel) => {
        const data = await model.findOne({
          where: {
            idAPI: id,
          },
        });

        if (!data) {
          const returned = await fetchAPIMedia(res, APIName, id, type);

          if (returned[1] !== null) {
            const dataReturn = returned[1];

            await model.create(dataReturn);
          }
          return res.status(200).send(returned[0]);
        }
        const response: IResponse = {
          error: false,
          msg: "Obra encontado com sucesso no DB",
          data,
        };
        return res.status(200).send(response);
      };

      return type === "movie"
        ? await fluxOfData(Movie)
        : await fluxOfData(Serie);
    } catch (err) {
      return errorInServer(res, err);
    }
  },
};
