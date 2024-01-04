/* eslint-disable camelcase */
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';

config();

const API_KEY = process.env.API_KEY_TMDB;

export default async function fetchAPI(APIName, id, type) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const host = 'https://api.themoviedb.org/3';
  const language = 'language=pt-br';

  if (APIName === 'imdb') {
    // Caso o id original seja do imdb, ele vai procurar se tem no tmdb,
    // se tiver, ele pega o id do filme/serie no tmdb original e
    // não com o id do imdb
    // (isso acontece pois o tmdb é gratis e o imdb é pago, essa foi a solução para abranger mais
    // filmes, porem bem menos eficiente)

    const urlIMDB = `${host}/find/${id}?external_source=imdb_id&${language}`;

    const responseIMDB = await fetch(urlIMDB, options);
    const dataIMDB = await responseIMDB.json();

    if (dataIMDB.movie_results[0].id) {
      // eslint-disable-next-line no-param-reassign
      id = dataIMDB.movie_results[0].id;
    }
    if (dataIMDB.tv_results.id) {
      // eslint-disable-next-line no-param-reassign
      id = dataIMDB.tv_results.i;
    }
  }
  const url = `${host}/${type}/${id}?${language}`;
  const response = await fetch(url, options);
  const data = await response.json();

  if (data) {
    // Aqui ele pega a url do trailer e vai fazer uma nova requesiçao para conseguir achar
    // const urlTrailer = `${host}/${type}/${id}/videos?language=pt-BR`;
    // const responseTrailer = await fetch(url, urlTrailer);
    // const dataTrailer = await responseTrailer.json();
    // const keyTrailer = dataTrailer.results[0].key;
    // const trailer = `https://www.youtube.com/watch?v=${keyTrailer}`;
    const trailer = 'a';

    // eslint-disable-next-line object-curly-newline
    const { backdrop_path, title, poster_path, overview } = data;

    const dataReturn = {
      background_path: backdrop_path,
      title,
      poster_path,
      description: overview,
      url_trailer: trailer,
    };

    if (type === 'movie' || type === 'tv') {
      if (type === 'movie') {
        const { release_date, runtime, genres } = data;

        dataReturn.release_date = release_date;
        dataReturn.duration = runtime;
        dataReturn.genres = JSON.stringify({ genres });
      }

      if (type === 'tv') {
        const { last_air_date, seasons } = data;

        dataReturn.last_air_date = last_air_date;
        dataReturn.seasons = seasons;
      }

      return {
        error: false,
        msg: 'Obra encontado com sucesso no TMDB',
        data: dataReturn,
        code: 200,
      };
    }
    // console.log(data);
    return {
      error: true,
      msg: 'Algo de errado com a obra',
      data: {},
      code: 404,
    };
  }
  if (APIName === 'imdb') {
    // Sim, isso é uma gambiarra enorme. Mas é pra ter mais dados caso seja do IMDB
    // Isso aqui deve ser o apice de ineficiencia, mas é o que temos para hoeje <(

    // NOTA: Eu não fiz isso, eu achei em um repositorio no github:
    // https://github.com/tuhinpal/imdb-api/tree/master
    const hostIMDB = `https://www.imdb.com/title/${id}`;
    const optionsElse = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const responseIMDB = await fetch(hostIMDB, optionsElse);
    const htmlIMDB = await responseIMDB.text();
    const dom = new JSDOM(htmlIMDB);
    const { document } = dom.window;
    const json = JSON.parse(
      document.scripts.namedItem('__NEXT_DATA__').textContent,
    );
    const props = json.props.pageProps.aboveTheFoldData;

    const title = props.titleText.text;
    const { year } = props.releaseDate;
    const { genres } = props.titleGenres;
    const description = props.plot.plotText.plainText;
    const { seconds } = props.runtime;
    const image = props.primaryImage.url;
    const trailer = props.primaryVideos.edges[0].node.previewURLs[0].url;
    const dataReturn = [
      title,
      year,
      genres,
      description,
      seconds,
      image,
      trailer,
    ];

    return {
      error: false,
      data: dataReturn,
      msg: 'Obra encontado com sucesso no TMDB',
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
