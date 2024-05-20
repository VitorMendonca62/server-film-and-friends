// TYD OK

// Libraries

// Models
import Movie from "../../database/models/Movie.model";
import Serie from "../../database/models/Serie.model";
// Types
import { Request, Response } from "express";

// Utils
import { errorInServer, notFound, verifySchema } from "../../utils/general";
import { basicMediaShowInputSchema } from "../../schemas/media";

export default {
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
};
