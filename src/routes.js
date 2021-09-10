const host = 'https://hacker-news.firebaseio.com';
const prefix = 'v0';

const proxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`;

const newStoriesURL = () => [host, prefix, 'newstories.json'].join('/'); // TODO: refactor query params
const itemURL = (id) => [host, prefix, 'item', `${id}.json`].join('/');

const routes = {
  newStoriesPath: () => proxyUrl(newStoriesURL()),
  itemPath: (id) => proxyUrl(itemURL(id)),
};

export default routes;
