/* eslint-disable camelcase */
// Modules
import Yup from 'yup';
import { v4 } from 'uuid';

// Modules
import Film from '../models/Film.js';

// APi
import fetchAPIFilm from '../../services/api_movies.js';

// Utils
import { errorInServer, verifySchema } from '../../utils/user.js';

export default {
  async index(req, res) {
    try {
      const films = await Film.findAll({
        attributes: [
          'title',
          'id',
          'genres',
          'release_date',
          'duration',
          'numbers_participants',
          'rating',
          'poster_path',
        ],
      });
      return res.status(200).json({
        msg: 'Aqui estão todas as obras!',
        error: false,
        data: films,
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },
  async show(req, res) {
    try {
      const { id } = req.params;

      const film = await Film.findByPk(id);

      return res.status(200).json({
        msg: 'Aqui esta a obra!',
        error: false,
        data: film,
      });
    } catch (error) {
      return errorInServer(res, error);
    }
  },

  async store(req, res) {
    const filmSchema = Yup.object().shape({
      apiName: Yup.string()
        .required('Nome da API é obrigatório')
        .length(4, 'Nome muito longo ou muito curto'),
      id: Yup.string().required('ID é obrigatório'),
      type: Yup.string().required('Tipo é obrigatório'),
    });

    if (verifySchema(req, res, filmSchema)) return;

    try {
      const { apiName, id, type } = req.body;

      const film = await fetchAPIFilm(apiName, id, type);

      if (!film.error) {
        await Film.create({
          id: v4(),
          id_api: id,
          ...film.data,
        });
        film.code = 201;
      }

      const { error, msg } = film;
      // eslint-disable-next-line consistent-return
      return res.status(film.code).json({
        error,
        msg,
        data: {},
      });
    } catch (error) {
      errorInServer(res, error);
    }
  },
};
