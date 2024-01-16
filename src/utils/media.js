import { JSDOM } from 'jsdom';

export default async function takePropsInSite(url) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'accept-language': 'pt-br',
    },
  };

  const response = await fetch(url, options);
  const html = await response.text();
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const scripts = document.scripts.namedItem('__NEXT_DATA__');

  if (!scripts) {
    return {
      error: true,
    };
  }

  const json = JSON.parse(scripts.textContent);

  return json;
}
