/* eslint-disable camelcase */
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';

import getSeason from './getSeason.js';

config();

const API_KEY = process.env.API_KEY_TMDB;

export default async function fetchAPI(APIName, id, type) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'Accept-Language': 'pt-BR',
    },
  };

  const host = 'https://api.themoviedb.org/3';
  const language = 'language=pt-br';

  let id_imdb;
  if (APIName === 'imdb') {
    // Caso o id original seja do imdb, ele vai procurar se tem no tmdb,
    // se tiver, ele pega o id do filme/serie no tmdb original e
    // não com o id do imdb
    // (isso acontece pois o tmdb é gratis e o imdb é pago, essa foi a solução para abranger mais
    // filmes, porem bem menos eficiente)


    const urlIMDB = `${host}/find/${id}?external_source=imdb_id&${language}`;

    const responseIMDB = await fetch(urlIMDB, options);
    const dataIMDB = await responseIMDB.json();

    if (dataIMDB.movie_results[0]?.id) {
      // eslint-disable-next-line no-param-reassign
      id_imdb = dataIMDB.movie_results[0].id;
    }
    if (dataIMDB.tv_results[0]?.id) {
      // eslint-disable-next-line no-param-reassign
      id_imdb = dataIMDB.tv_results[0].id;
    }
  }
  
  const url = `${host}/${type}/${id_imdb || id}?${language}`;
  const response = await fetch(url, options);
  const data = await response.json();

  if (data) {
    // Aqui ele pega a url do trailer e vai fazer uma nova requesiçao para conseguir achar
    const urlTrailer = `${host}/${type}/${id}/videos?${language}`;
    const responseTrailer = await fetch(urlTrailer, options);
    const dataTrailer = await responseTrailer.json();
    const keyTrailer = dataTrailer.results[0].key;
    const trailer = `https://www.youtube.com/watch?v=${keyTrailer}`;

    // eslint-disable-next-line object-curly-newline
    const { backdrop_path, poster_path, overview } = data;

    const dataReturn = {
      background_path: backdrop_path,
      poster_path,
      description: overview,
      url_trailer: trailer,
    };
    dataReturn.genres = JSON.stringify({ genres: data.genres });

    if (type === 'movie' || type === 'tv') {
      if (type === 'movie') {
        const { release_date, runtime, title } = data;

        dataReturn.release_date = release_date;
        dataReturn.duration = runtime;
        dataReturn.title = title;
      }

      if (type === 'tv') {
        const { first_air_date, seasons, name } = data;

        dataReturn.release_date = first_air_date;
        dataReturn.title = name;

        const seasonsReturn = seasons.map((season) => {
          if (season.season_number > 0) {
            return {
              season_number: season.season_number,
              episode_count: season.episode_count,
            };
          }
          return {};
        });
        dataReturn.seasons = JSON.stringify({ seasons: seasonsReturn });
      }

      return {
        error: false,
        msg: 'Obra encontado com sucesso no TMDB',
        data: dataReturn,
        code: 200,
      };
    }
  }
  if (APIName === 'imdb') {
    // Sim, isso é uma gambiarra enorme. Mas é pra ter mais dados caso seja do IMDB
    // E não tenha do TMDB, é apenas em ultimos casos.
    // Isso aqui deve ser o apice de ineficiencia, mas é o que temos para hoeje <(

    // NOTA: Eu não fiz isso, eu achei em um repositorio no github:
    // https://github.com/tuhinpal/imdb-api/tree/master

    const hostIMDB = `https://www.imdb.com/title/${id}`;

    const optionsElse = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'Accept-Language': 'pt-BR',
      },
    };
    const responseIMDB = await fetch(hostIMDB, optionsElse);
    const htmlIMDB = await responseIMDB.text();
    const dom = new JSDOM(htmlIMDB);
    const { document } = dom.window;

    const scripts = document.scripts.namedItem('__NEXT_DATA__');

    if (!scripts) {
      return {
        error: true,
        data: {},
        msg: 'Obra não encontrada',
        code: 404,
      };
    }

    const json = JSON.parse(scripts.textContent);
    const props = json.props.pageProps;

    const title = props.aboveTheFoldData.titleText.text;
    const { day, month, year } = props.aboveTheFoldData.releaseDate;
    const release_date = `${year}-${month}-${day}`;
    const { genres } = props.aboveTheFoldData.titleGenres;
    const nameGenres = genres.map((genre) => genre.genre.text);
    const description = props.aboveTheFoldData.plot.plotText.plainText;
    const url_trailer =
      props.aboveTheFoldData.primaryVideos.edges[0].node.playbackURLs[0].url;
    const poster_path = props.aboveTheFoldData.primaryImage.url;
    const background_path = props.mainColumnData.titleMainImages.edges
      // eslint-disable-next-line no-underscore-dangle
      .filter((e) => e.__typename === 'ImageEdge')
      .map((e) => e.node.url)[0];

    const dataReturn = {
      title,
      release_date,
      genres: nameGenres,
      description,
      url_trailer,
      poster_path,
      background_path,
    };

    if (type === 'movie') {
      const { seconds } = props.aboveTheFoldData.runtime;
      const duration = seconds / 60;
      dataReturn.duration = duration;
    }
    if (type === 'tv') {
      dataReturn.season = 1;
      dataReturn.episode = 1;
      dataReturn.seasons = await getSeason(id, 1);
    }

    return {
      error: false,
      data: dataReturn,
      msg: 'Obra encontada com sucesso no IMDB',
      code: 200,
    };
  }

  return {
    error: true,
    data: {},
    msg: 'Obra não encontrada',
    code: 404,
  };
}
