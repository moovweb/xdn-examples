import { createApolloURL } from '@xdn/apollo'
import { apolloClient, getSettings } from '@vue-storefront/commercetools-api'
import { buildCategoryWhere } from '@vue-storefront/commercetools-api/src/helpers/search'
import defaultQuery from '@vue-storefront/commercetools-api/src/api/getCategory/defaultQuery'

const getVariables = (params) => {
  const { acceptLanguage } = getSettings();
  return params ? {
    where: buildCategoryWhere(params),
    limit: params.limit,
    offset: params.offset,
    acceptLanguage
  } : { acceptLanguage };
}

export default function createCategoryURL({id}) {
  return createApolloURL(apolloClient, defaultQuery, getVariables({ id }))
}