/* eslint-disable camelcase */
// Modules
import { config } from "dotenv";
import { Response } from "express";
import * as Yup from "yup";

// Utils
import {
  takePropsInSite,
  formatMovieTMDB,
  formatSerieTMDB,
  schemasMedia,
  formatMovieIMDB,
  formatSerieIMDB,
} from "../utils/media";
import { verifySchema } from "../utils/user";
import { v4 } from "uuid";

config();

const API_KEY = process.env.API_KEY_TMDB;

async function takeWithIMDB(res: Response, id: string, type: TypeMedia) {
  // Sim, isso é uma gambiarra enorme. Mas é pra ter mais dados caso seja do IMDB
  // E não tenha do TMDB, é apenas em ultimos casos.
  // Isso aqui deve ser o apice de ineficiencia, mas é o que temos para hoeje <(

  // NOTA: Eu não fiz isso, eu achei em um repositorio no github:
  // https://github.com/tuhinpal/imdb-api/tree/master

  const host = `https://www.imdb.com/title/${id}`;
  const jsonMediaIMDB = await takePropsInSite(host);

  if (jsonMediaIMDB.error) {
    const response: ResponseInAPIMedia = [
      { error: true, msg: "Midia não encontrada", data: {} },
      null,
    ];
    return response;
  }

  const props = jsonMediaIMDB.props.pageProps;
  const infoMedia = props.aboveTheFoldData;

  // title
  const title: string = infoMedia.titleText.text;
  // release_date
  const { day, month, year } = infoMedia.releaseDate;
  const releaseDate: string = `${year}-${month}-${day}`;

  // genres
  const { genres } = infoMedia.titleGenres;
  const nameGenres: string[] = genres.map(
    (genre: IGenreiMDB) => genre.genre.text,
  );

  // description
  const description: string = infoMedia.plot.plotText.plainText;

  // trailer
  const { primaryVideos } = infoMedia;
  let urlTrailer: string | undefined;

  if (primaryVideos.edges[0]) {
    urlTrailer = primaryVideos.edges[0].node.playbackURLs[0].url;
  }

  // poster and background
  const posterPath: string = infoMedia.primaryImage.url;

  const background_edges = props.mainColumnData.titleMainImages.edges;

  let backgroundPath: string | undefined;

  for (const edge of background_edges) {
    if (edge.__typename == "ImageEdge") {
      backgroundPath = edge.node.url;
      break;
    } else {
      backgroundPath = undefined;
    }
  }

  if (type == "tv" || type == "movie") {
    const data = {
      idAPI: id,
      genres: nameGenres,
      title,
      releaseDate,
      nameGenres,
      description,
      urlTrailer,
      posterPath,
      backgroundPath,
      rating: 0,
      id: v4()
    };

    const dataReturn =
      type == "movie"
        ? formatMovieIMDB(data, infoMedia)
        : await formatSerieIMDB(
            data,
            props.mainColumnData.episodes.seasons.length,
          );

    const response: ResponseInAPIMedia = [
      {
        error: false,
        data: dataReturn,
        msg: "Obra encontada com sucesso no IMDB",
      },
      dataReturn,
    ];
    return response;
  }
  const response: ResponseInAPIMedia = [
    {
      error: false,
      data: {},
      msg: "Algo deu errado!",
    },
    null,
  ];
  return response;
}

export default async function fetchAPIMedia(
  res: Response,
  APIName: string,
  id: string,
  type: TypeMedia,
) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "accept-language": "pt-br",
    },
  };

  const host = "https://api.themoviedb.org/3";
  const language = "language=pt-br";

  let idTMDB;

  if (APIName === "imdb") {
    // Caso o id original seja do imdb, ele vai procurar se tem no tmdb,
    // se tiver, ele pega o id do filme/serie no tmdb original e
    // não com o id do imdb
    // (isso acontece pois o tmdb é gratis e o imdb é pago, essa foi a solução para abranger mais
    // filmes, porem bem menos eficiente)

    const urlIMDB = `${host}/find/${id}?external_source=imdb_id&${language}`;

    const responseIMDB = await fetch(urlIMDB, options);
    const dataIMDB = await responseIMDB.json();

    if (dataIMDB.movie_results[0]?.id) {
      idTMDB = dataIMDB.movie_results[0].id;
    }
    if (dataIMDB.tv_results[0]?.id) {
      idTMDB = dataIMDB.tv_results[0].id;
    }
  }

  const url = `${host}/${type}/${idTMDB || id}?${language}`;
  const responseAPI = await fetch(url, options);
  const data: IDataObject = await responseAPI.json();

  if (data.id) {
    // trailer
    const urlTrailer = `${host}/${type}/${idTMDB || id}/videos?${language}`;
    const responseTrailer = await fetch(urlTrailer, options);
    const dataTrailer = await responseTrailer.json();

    let trailer;
    if (dataTrailer.results?.length > 0) {
      const keyTrailer = dataTrailer.results[0].key;
      trailer = `https://www.youtube.com/watch?v=${keyTrailer}`;
    } else {
      trailer = undefined;
    }

    const genres = data.genres.map((genre: IGenreTMDB) => genre.name);

    if (type == "tv" || type == "movie") {
      const dataReturn =
        type == "movie"
          ? formatMovieTMDB(data, trailer, genres, id)
          : formatSerieTMDB(data, trailer, genres, id);

      const mediaSCchema = Yup.object().shape(schemasMedia[type]);

      if (verifySchema(dataReturn, res, mediaSCchema)) return [null, null];

      const response: ResponseInAPIMedia = [
        {
          error: false,
          msg: "Obra encontado com sucesso no TMDB",
          data: dataReturn,
        },
        dataReturn,
      ];
      return response;
    }
  }
  if (APIName === "imdb") {
    const response = await takeWithIMDB(res, id, type);
    return response;
  }

  const response: ResponseInAPIMedia = [
    { error: true, data: {}, msg: "Mídia não encontrada" },
    null,
  ];
  return response;
}
