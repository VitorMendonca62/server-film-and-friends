// Modules
import { config } from "dotenv";
import { Response } from "express";

// Utils
import {
  formatDataTMDB,
  getSeasonWithIMDB,
  takePropsInSite,
} from "../utils/media";

import { v4 } from "uuid";
import { verifySchema } from "../utils/general";
import { mediasSchemas } from "../utils/schemas/media";
config();

const API_KEY = process.env.API_KEY_TMDB;

const host = "https://api.themoviedb.org/3";
const languagePtBr = "pt-br";
const languageEsUS = "en-US";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
    "accept-language": languagePtBr,
  },
};

async function takeWithIMDB(id: string, type: TypeMedia) {
  // Sim, isso é uma gambiarra enorme. Mas é pra ter mais dados caso seja do IMDB
  // E não tenha do TMDB, é apenas em ultimos casos.
  // Isso aqui deve ser o apice de ineficiencia, mas é o que temos para hoeje <(

  // NOTA: Eu não fiz isso, eu achei em um repositorio no github:
  // https://github.com/tuhinpal/imdb-api/tree/master

  const host = `https://www.imdb.com/title/${id}`;
  const jsonMediaIMDB = await takePropsInSite(host);

  if (jsonMediaIMDB.error) {
    return [{ error: true, msg: "Midia não encontrada", data: {} }, null];
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
    (genre: IGenreIMDB) => genre.genre.text,
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
      id: v4(),
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
      raters: 0,
      favorites: 0
    };
    
    let dataReturn;

    if (type == "movie") {
      const { seconds } = infoMedia.runtime;
      const duration = seconds / 60;

      dataReturn = { ...data, duration };
    } else {
      const seasons = await getSeasonWithIMDB(
        data.idAPI,
        props.mainColumnData.episodes.seasons.length,
      );
      dataReturn = { ...data, seasons };
    }
    
    return [
      {
        error: false,
        data: dataReturn,
        msg: "Obra encontada com sucesso no IMDB",
      },
      dataReturn,
    ];
  }
  return [
    {
      error: false,
      data: {},
      msg: "Algo deu errado!",
    },
    null,
  ];
}

async function takeWithTMDB<T>(
  res: Response,
  id: string,
  idTMDB: string | undefined,
  type: TypeMedia,
  data: IDataTakeAPI<T>,
) {
  // trailer
  async function takeTrailer(language: string) {
    const urlTrailer = `${host}/${type}/${idTMDB || id}/videos?language=${language}`;
    options.headers["accept-language"] = language;

    const responseTrailer = await fetch(urlTrailer, options);
    const dataTrailer = await responseTrailer.json();
    // console.log(dataTrailer);
    if (dataTrailer.results?.length > 0) {
      const keyTrailer = dataTrailer.results[0].key;
      return keyTrailer;
    }
    return null;
  }
  const keyTrailer = await takeTrailer(languagePtBr);
  console.log(keyTrailer)
  let trailer: string | undefined =
  `https://www.youtube.com/watch?v=${keyTrailer === null ? await takeTrailer(languageEsUS) : keyTrailer}`;

  console.log(trailer)
  if (trailer.endsWith("null")) {
    trailer = undefined;
  }
  
  const genresArray = data.genres as IGenreTMDB[];
  const genres = genresArray.map((genre: IGenreTMDB) => genre.name);
  
  if (type == "tv" || type == "movie") {
    const dataReturn = formatDataTMDB(data, type, trailer, id, genres);

    if (verifySchema(dataReturn, res, mediasSchemas[type])) return [null, null];

    return [
      {
        error: false,
        msg: "Obra encontado com sucesso no TMDB",
        data: dataReturn,
      },
      dataReturn,
    ];
  }
  return [
    {
      error: false,
      data: {},
      msg: "Algo deu errado!",
    },
    null,
  ];
}

export default async function fetchAPIMedia(
  res: Response,
  APIName: string,
  id: string,
  type: TypeMedia,
) {
  let idTMDB;

  if (APIName === "imdb") {
    // Caso o id original seja do imdb, ele vai procurar se tem no tmdb,
    // se tiver, ele pega o id do filme/serie no tmdb original e
    // não com o id do imdb
    // (isso acontece pois o tmdb é gratis e o imdb é pago, essa foi a solução para abranger mais
    // filmes, porem bem menos eficiente)

    const urlIMDB = `${host}/find/${id}?external_source=imdb_id&${languagePtBr}`;

    const responseIMDB = await fetch(urlIMDB, options);
    const dataIMDB = await responseIMDB.json();

    if (dataIMDB.movie_results[0]?.id) {
      idTMDB = dataIMDB.movie_results[0].id as string;
    }
    if (dataIMDB.tv_results[0]?.id) {
      idTMDB = dataIMDB.tv_results[0].id as string;
    }
  }

  const url = `${host}/${type}/${idTMDB || id}?language=${languagePtBr}`;
  const responseAPI = await fetch(url, options);
  const data = await responseAPI.json();

  if (data.id) {
    const response = await takeWithTMDB(res, id, idTMDB, type, data);
    return response;
  }
  if (APIName === "imdb") {
    const response = await takeWithIMDB(id, type);
    return response;
  }

  return [{ error: true, data: {}, msg: "Midia não encontrada" }, null];
}
