interface IMedia {
  title: string;
  releaseDate: string;
  backgroundPath: string | undefined; 
  genres: string | string[];
  description: string;
  urlTrailer: string | undefined;
  posterPath: string;
  idAPI: string;
  rating: number;
  id: string;
}

interface IGenreTMDB {
  id: number;
  name: string;
}

interface IGenreiMDB {
  type: "__typename";
  genre: {
    text: string;
    __typename: "GenreItem";
  };
}

interface ISeasonTMDB {
  episode_count: number;
  season_number: number;
}

interface IMovieSchema extends IMedia {
  duration: number;
}

interface ISerieSchema extends IMedia {
  seasons: string;
}

type TypeMedia = "movie" | "tv";

interface IDataObject {
  id: string;
  genres: IGenreTMDB[];
  title: string;
  name: string;
  first_air_date: string;
  release_date: string;
  backdrop_path: string;
  overview: string;
  urlTrailer: string | undefined;
  poster_path: string;
  seasons: ISeasonTMDB[];
  runtime: number;
}

type TypeObjectSeasons = {
  seasons: { seasonNumber: number; episodeCount: number }[];
};

type ObjectIndexMedias = { movies: Movie[]; series: Serie[] };

type DataShowMedia = Movie | Serie | null