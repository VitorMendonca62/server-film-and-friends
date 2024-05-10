import { JSDOM } from "jsdom";
import { v4 } from "uuid";

const patternObject = {
  movie: {
    title: "title",
    release_date: "releaseDate",
    runtime: "duration",
    backdrop_path: "backgroundPath",
    poster_path: "posterPath",
    overview: "description",
  },
  tv: {
    name: "title",
    first_air_date: "releaseDate",
    backdrop_path: "backgroundPath",
    poster_path: "posterPath",
    overview: "description",
  },
};

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
    if (!json.error) {
      const props = json.props.pageProps;

      const episodes = props.contentData.section.episodes.items;

      objectSeasons.seasons.push(
        JSON.stringify({
          seasonNumber: season,
          episodeCount: episodes.length,
        }),
      );
    }
  }
  return objectSeasons;
}

export function formatDataTMDB<T>(
  data: IDataTakeAPI<T>,
  type: TypeMedia,
  urlTrailer: string | undefined,
  idAPI: string,
  genres: string[],
) {
  const dataReturn = Object();

  console.log(data)

  dataReturn.id = v4();
  dataReturn.idAPI = idAPI;
  dataReturn.urlTrailer = urlTrailer;
  dataReturn.genres = genres;
  dataReturn.rating = 0;
  dataReturn.favorites = 0;
  dataReturn.raters = 0;

  const keysPattern = Object.keys(patternObject[type]);
  const pattern = patternObject[type];

  type KeysPattern = keyof typeof pattern;

  for (const key of keysPattern as KeysPattern[]) {
    if (key in data) {
      dataReturn[pattern[key]] = data[key];
    }
  }

  if (type === "tv") {
    const seasonsObject = data.seasons as ISeasonTMDB[];

    const seasons = seasonsObject.map((season: ISeasonTMDB) => {
      if (season.season_number > 0) {
        return {
          seasonNumber: season.season_number,
          episodeCount: season.episode_count,
        };
      }
      return { seasonNumber: 0, episodeCount: 0 };
    });

    dataReturn.seasons = seasons;
  }

  return dataReturn;
}
