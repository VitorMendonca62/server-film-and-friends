import takePropsInSite from '../../utils/media.js';

export default async function getSeason(id, season) {
  const host = `https://www.imdb.com/title/${id}/episodes?season=${season}`;

  const json = await takePropsInSite(host);
  const props = json.props.pageProps;

  const episodes = props.contentData.section.episodes.items;

  return {
    // eslint-disable-next-line camelcase
    seasons: [{ season_number: season, episode_count: episodes.lenght }],
  };
}
