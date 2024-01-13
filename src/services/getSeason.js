/* eslint-disable camelcase */
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';

config();

export default async function getSeason(id, season) {
  const hostIMDB = `https://www.imdb.com/title/${id}/episodes?season=${season}`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'accept-language': 'pt-BR',
    },
  };
  const responseIMDB = await fetch(hostIMDB, options);
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

  const episodes = props.contentData.section.episodes.items;

  return {
    seasons: [{ season_number: season, episode_count: episodes.lenght }],
  };
}

getSeason('tt2306299', 3);
