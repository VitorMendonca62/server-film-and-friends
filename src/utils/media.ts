import { JSDOM } from "jsdom";
import { v4 } from "uuid";
import * as Yup from "yup";

export async function takePropsInSite(url: string) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "accept-language": "pt-br",
    },
  };

  const response = await fetch(url, options);
  const html = await response.text();
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const scripts = { ...document.scripts.namedItem("__NEXT_DATA__") };

  if (Object.keys(scripts).length === 0) {
    return {
      error: true,
    };
  }

  const json = JSON.parse(String(scripts.textContent));

  return json;

}

export async function getSeasonWithIMDB(id: string, seasons: number) {
  const objectSeasons: TypeObjectSeasons = {
    seasons: [],
  };

  for (let season = 1; season <= seasons; season++) {
    const host = `https://www.imdb.com/title/${id}/episodes?season=${season}`;

    const json = await takePropsInSite(host);
    const props = json.props.pageProps;

    const episodes = props.contentData.section.episodes.items;

    objectSeasons.seasons.push({
      seasonNumber: season,
      episodeCount: episodes.length,
    });
  }
  return objectSeasons;
}

const basicSchema = {
  title: Yup.string().required("Não há um titulo").min(2, "Titulo muito curto"),
  releaseDate: Yup.string()
    .required("Não tem data de lançamento")
    .length(10, "Há algo de errado na data de lançamento"),
  backgroundPath: Yup.string().required("Não há foto para background"),
  genres: Yup.string().required("Não há gêneros"),
  description: Yup.string().required("Não há descrição"),
  urlTrailer: Yup.string(),
  posterPath: Yup.string(),
};

export const schemasMedia = {
  tv: {
    ...basicSchema,
    seasons: Yup.string().required("Está faltando as temporadas"),
  },
  movie: {
    ...basicSchema,
    duration: Yup.number().required("Está faltando a duração"),
  },
};

export const formatMovieTMDB = (
  data: IDataObject,
  urlTrailer: string | undefined,
  genres: string[],
  idAPI: string,
) => {
  const {
    title,
    release_date: releaseDate,
    runtime: duration,
    backdrop_path: backgroundPath,
    poster_path: posterPath,
    overview: description,
  } = data;

  const dataReturn: IMovieSchema = {
    id: v4(),
    title,
    releaseDate,
    backgroundPath,
    posterPath,
    description,
    urlTrailer,
    genres: JSON.stringify(genres),
    idAPI,
    duration: Number(duration),
    rating: 0,
  };

  return dataReturn;
};

export const formatSerieTMDB = (
  data: IDataObject,
  urlTrailer: string | undefined,
  genres: string[],
  idAPI: string,
) => {
  const {
    name: title,
    first_air_date: releaseDate,
    backdrop_path: backgroundPath,
    poster_path: posterPath,
    overview: description,
  } = data;

  const { seasons: seasonsObject } = data;

  const seasons = seasonsObject.map((season: ISeasonTMDB) => {
    if (season.season_number > 0) {
      return {
        seasonNumber: season.season_number,
        episodeCount: season.episode_count,
      };
    }
    return {};
  });

  const dataReturn: ISerieSchema = {
    id: v4(),
    title,
    releaseDate,
    backgroundPath,
    posterPath,
    description,
    urlTrailer,
    genres: JSON.stringify(genres),
    idAPI,
    rating: 0,
    seasons: JSON.stringify({ seasons: seasons }),
  };

  return dataReturn;
};

export const formatMovieIMDB = (
  data: IMedia,
  infoMedia: { runtime: { seconds: number } },
) => {
  const { seconds } = infoMedia.runtime;
  const duration = seconds / 60;

  const dataReturn: IMovieSchema = {
    id: data.id,
    idAPI: data.idAPI,
    title: data.title,
    releaseDate: data.releaseDate,
    genres: data.genres,
    description: data.description,
    urlTrailer: data.urlTrailer,
    posterPath: data.posterPath,
    backgroundPath: data.backgroundPath,
    rating: 0,
    duration,
  };

  return dataReturn;
};

export const formatSerieIMDB = async (data: IMedia, numberSeasons: number) => {
  const seasons = JSON.stringify(
    await getSeasonWithIMDB(data.idAPI, numberSeasons),
  );

  const dataReturn: ISerieSchema = {
    id: data.id,
    idAPI: data.idAPI,
    title: data.title,
    releaseDate: data.releaseDate,
    genres: data.genres,
    description: data.description,
    urlTrailer: data.urlTrailer,
    posterPath: data.posterPath,
    backgroundPath: data.backgroundPath,
    rating: 0,
    seasons,
  };

  return dataReturn;
};
