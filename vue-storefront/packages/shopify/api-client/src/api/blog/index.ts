import fetchAll from './fetchAll';
import fetchByHandle from './fetchByHandle';
import fetchNext from './fetchNext';

const getArticle = {
  fetchAll: fetchAll,
  fetchNext: fetchNext,
  fetchByHandle: fetchByHandle
};

export default getArticle;
