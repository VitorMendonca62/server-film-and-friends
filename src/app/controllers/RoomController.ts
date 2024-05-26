import { Request, Response } from "express";
import { errorInServer, verifySchema } from "../../utils/general";
import { basicMediaStoreInputSchema } from "../../schemas/media";
import fetchAPIMedia from "../../api/media";
import Movie from "../../database/models/Movie.model";
import Serie from "../../database/models/Serie.model";
import { v4 } from "uuid";
import { foundUserByToken } from "../../utils/user";
import { rooms } from "../../app";

export default {
  async index(req: Request, res: Response) {
    try {
      const page = Number(req.params.page);
      const type = req.params.type;

      const data: [Serie | Movie, IRoom][] = [];
      if (type == "tv" || type == "movie") {
        const roomFilteredType = rooms.filter((room) => room.type === type);
        for (let i = 12 * (page - 1); i < 12 * page; i++) {
          if (roomFilteredType.length > i) {
            const room = roomFilteredType[i];
            const where = { where: { idAPI: room.idAPI } };
            const dataMovieOrSerie =
              type == "tv"
                ? await Serie.findOne(where)
                : await Movie.findOne(where);

            if (dataMovieOrSerie) {
              data.push([dataMovieOrSerie, room]);
            }
          }
        }
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
        const idMedia = v4();
        const authorization = req.headers.authorization as string;

        const user = await foundUserByToken(authorization);
        const username = user?.username as string;

        if (!user)
          return res.status(400).json({
            error: true,
            msg: "Algo deu errado",
            data: {},
          });

        rooms.push({
          id: idMedia,
          idAPI: id,
          author: username,
          participants: [],
          path,
          type,
        });

        if (!data) {
          const returned = await fetchAPIMedia(res, APIName, id, type, idMedia);

          // Erro de validacao de input
          if (!returned[0]) {
            return;
          }

          // quando encontra no TMDB ou IMDB
          if (returned[1] !== null) {
            const dataReturn = returned[1];

            await model.create(dataReturn);
          }
          // Midia nao encontrada, algo deu errad

          return res.status(returned[0].error ? 404 : 200).json({
            error: returned[0].error,
            data: { id: returned[0].data.id },
            msg: returned[0].msg,
          });
        }

        // Obra encontrada
        return res.status(200).json({
          error: false,
          msg: "Obra encontado com sucesso no DB",
          data: { id: idMedia },
        });
      };

      return type === "movie"
        ? await fluxOfData(Movie)
        : await fluxOfData(Serie);
    } catch (err) {
      return errorInServer(res, err);
    }
  },
  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = rooms.find((room) => room.id === id);

      if (!data) {
        return res.status(404).json({
          msg: "Sala não encontrada",
          data: null,
          error: true,
        });
      }

      return res.status(200).json({
        msg: "Sala encontrada",
        data,
        error: false,
      });
    } catch (error) {
      errorInServer(res, error);
    }
  },
};
