import { createApolloURL } from '@xdn/apollo'
import { apolloClient, getSettings } from '@vue-storefront/commercetools-api'
import defaultQuery from '@vue-storefront/commercetools-api/src/api/getCategory/defaultQuery'

const buildCategoryWhere = (search, acceptLanguage) => {
  if (search?.catId) {
    return `id="${search.catId}"`;
  }

  if (search?.slug) {
    const predicate = acceptLanguage.map(locale => `${locale}="${search.slug}"`).join(' or ');
    return `slug(${predicate})`;
  }

  return undefined;
};

const getVariables = (params) => {
  const { acceptLanguage } = getSettings();
  return params ? {
    where: buildCategoryWhere(params, acceptLanguage),
    limit: params.limit,
    offset: params.offset,
    acceptLanguage
  } : { acceptLanguage };
}

export default function createCategoryURL(category) {
  return createApolloURL(apolloClient, defaultQuery, getVariables(category))
}