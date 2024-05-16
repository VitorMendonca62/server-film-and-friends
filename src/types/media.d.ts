  interface IMediaBasic {
    id: string;
    urlTrailer: string | undefined;
    genres: string | string[];
    idAPI: string;
    rating: number;
  }

  interface IMedia extends IMediaBasic {
    title: string;
    releaseDate: string;
    backgroundPath: string | undefined;
    description: string;
    posterPath?: string | undefined;
  }

  interface IMediaInput {
    id: string;
    APIName: TypeAPIName;
    type: TypeMedia;
  }
  interface ISeasonTMDB {
    episode_count: number;
    season_number: number;
  }

  interface IMovie extends IMedia {
    duration: number;
  }

  interface ISerie extends IMedia {
    seasons: string;
  }

interface IDataTakeAPI<T> {
  [key: string]: T;
}

type DataReturn = IMediaBasic | ISerie | IMovie;

type path = string;
type IDataOutput = Movie | Serie | (null & path);

type TypeObjectSeasons = {
  seasons: string[];
};
interface IGenreTMDB {
  id: number;
  name: string;
}
interface IGenreIMDB {
  type: "__typename";
  genre: {
    text: string;
    __typename: "GenreItem";
  };
}

type ObjectIndexMedias = { movies: Movie[]; series: Serie[] };

type DataShowMedia = Movie | Serie | null;

type TypeMedia = "movie" | "tv";

type TypeAPIName = "imdb" | "tmdb";

type KeysPatten =
  | title
  | release_date
  | runtime
  | backdrop_path
  | poster_path
  | overview
  | name
  | first_air_date;
