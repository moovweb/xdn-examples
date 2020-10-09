import { createApolloURL } from '@xdn/apollo'
import { apolloClient, getSettings } from '@vue-storefront/commercetools-api'
import { buildProductWhere } from '@vue-storefront/commercetools-api/src/helpers/search'
import defaultQuery from '@vue-storefront/commercetools-api/src/api/getProduct/defaultQuery'

const getVariables = (params) => {
  const { locale, acceptLanguage, currency, country } = getSettings();
  return {
    where: buildProductWhere(params),
    skus: params.skus,
    limit: params.limit,
    offset: params.offset,
    locale,
    acceptLanguage,
    currency, 
    country
  }
}

export default function createProductURL({ _id }) {
  return createApolloURL(apolloClient, defaultQuery, getVariables({ id: _id }))
}