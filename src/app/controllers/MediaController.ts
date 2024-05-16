// TYD OK

// Libraries

// Models
import Movie from "../../database/models/Movie.model";
import Serie from "../../database/models/Serie.model";
// Types
import { Request, Response } from "express";

// Utils
import { errorInServer, notFound, verifySchema } from "../../utils/general";
import fetchAPIMedia from "../../api/media";
import {
  basicMediaShowInputSchema,
  basicMediaStoreInputSchema,
} from "../../schemas/media";

export default {
  async index(req: Request, res: Response) {
    try {
      const page = Number(req.params.page);
      const type = req.params.type;

      const medias =
        type === "movie"
          ? await Movie.findAll()
          : type === "serie"
            ? await Serie.findAll()
            : [];
      const data: (Serie | Movie)[] = [];

      for (let i = 12 * (page - 1); i < 12 * page; i++) {
        if (medias.length > i) data.push(medias[i]);
      }

      return res.status(200).json({
        msg: "Aqui estão todos nossos filmes e séries!",
        error: false,
        data,
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async show(req: Request, res: Response) {
    const type = req.query.type as TypeMedia | undefined;
    const id = req.query.id as string | undefined;

    if (verifySchema(req.query, res, basicMediaShowInputSchema)) return;

    const where = {
      where: {
        idAPI: id,
      },
    };

    try {
      const data: DataShowMedia =
        type == "movie"
          ? await Movie.findOne(where)
          : await Serie.findOne(where);

      if (data === null) {
        return notFound(res);
      }

      return res.status(200).json({
        msg: "Aqui estão o filme ou série.",
        error: false,
        data,
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },

  async store(req: Request, res: Response) {
    if (verifySchema(req.body, res, basicMediaStoreInputSchema)) return;

    try {
      const { id, APIName, type } = req.body;

      const fluxOfData = async (model: TypeModel) => {
        const data: IDataOutput = await model.findOne({
          where: {
            idAPI: id,
          },
        });
        let episode: string = "sea=1&epi=1";
        if (type === "tv" && req.body.episode) {
          episode = req.body.episode;
        }

        const path = `https://embedder.net/e/${type === "tv" ? "series" : "movie"}?${APIName}=${id}&${type === "tv" ? episode : ""}`;

        if (!data) {
          const returned = await fetchAPIMedia(res, APIName, id, type);

          if (!returned[0]) {
            return;
          }

          if (returned[1] !== null) {
            const dataReturn = returned[1];

            await model.create(dataReturn);
          }
          return res
            .status(returned[0].error ? 404 : 200)
            .json({ ...returned[0], path });
        }

        return res.status(200).json({
          error: false,
          msg: "Obra encontado com sucesso no DB",
          data,
          path,
        });
      };

      return type === "movie"
        ? await fluxOfData(Movie)
        : await fluxOfData(Serie);
    } catch (err) {
      return errorInServer(res, err);
    }
  },
};
