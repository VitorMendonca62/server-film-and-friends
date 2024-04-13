import { Request, Response } from "express";
import UserMediaInfo from "../../database/models/UserMediaInfo.model";
import { errorInServer, notFound, verifySchema } from "../../utils/general";
import { infosSchema } from "../../utils/schemas/infos";
import Serie from "../../database/models/Serie.model";
import Movie from "../../database/models/Movie.model";

import { v4 } from "uuid";

export default {
  async index(req: Request, res: Response) {
    try {
      const infoId = req.params.id as string | undefined;
      const type = req.params.type as "user" | "media" | undefined;

      const inWhere =
        type === "media" ? { mediaId: infoId } : { userId: infoId };
      const data = await UserMediaInfo.findAll({ where: inWhere });

      return res.status(200).json({
        error: false,
        data,
        msg: "Aqui está todas as informações",
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },
  async store(req: Request, res: Response) {
    const type = req.body.type as "favorite" | "rating";
    if (type === "rating") {
      req.body.rating = Number(req.body.rating);
    }

    if (verifySchema(req.body, res, infosSchema[type])) return;

    try {
      const { userId, mediaId } = req.body as {
        userId: string;
        mediaId: string;
      };

      const whereMedia = { where: { id: mediaId } };
      const media =
        (await Serie.findOne(whereMedia)) || (await Movie.findOne(whereMedia));

      if (media === null) {
        return notFound(res);
      }

      const mediaInfo = await UserMediaInfo.findOne({
        where: { userId, mediaId },
      });

      if (mediaInfo == null) {
        if (type === "rating") {
          media.raters += 1;
          media.rating += Number(req.body.rating);
        }
        if (type === "favorite") {
          media.favorites += 1;
        }

        const inCreate =
          type === "favorite"
            ? { favorite: req.body.favorite == 1 }
            : { rating: Number(req.body.rating) };

        await UserMediaInfo.create({ ...inCreate, userId, mediaId, id: v4() });
      } else {
        if (type === "rating") {
          media.rating -= mediaInfo.rating;
          mediaInfo.rating = Number(req.body.rating);
          media.rating += mediaInfo.rating;
        }
        if (type === "favorite") {
          media.favorites =
            media.favorites + (req.body.favorite == "1" ? +1 : -1);
          mediaInfo.favorite = req.body.favorite == 1;
        }
        mediaInfo.save();
      }
      media.save();

      return res.status(201).json({
        error: false,
        data: {},
        msg:
          type === "favorite"
            ? "A midia foi favoritada"
            : "A mídia foi avaliada",
      });
    } catch (err) {
      return errorInServer(res, err);
    }
  },
};
