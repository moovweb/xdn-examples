import { _shopifyCustomClient } from '../../../index';
import { ProductSearchParams, ProductsByCollectionSearchParams, ProductsByCollection } from '../../../types';

/**
 * Fetch collection by handle with products on the shop.
 *
 * @example
 * collectionByHandleQuery(options).then((collection) => {
 *   // Do something with the collection
 * });
 *
 * @param {collectionByHandleQuery} options contains { handle, products filter query data: first, last, after, etc.. }
 * @return {collectionByHandleQuery} A Query for collection by handle.
 */
const collectionByHandleQuery = (options) => {
  const productArgs: ProductSearchParams = {
    first: 20,
    sortKey: 'CREATED_AT'
  };

  if (options.products?.last) productArgs.last = options.products?.last;
  if (options.products?.first) productArgs.first = options.products?.first;
  if (options.products?.after) productArgs.after = options.products?.after;
  if (options.products?.before) productArgs.before = options.products?.before;
  if (options.products?.reverse) productArgs.reverse = options.products?.reverse;
  if (options.products?.sortKey) productArgs.sortKey = options.products?.sortKey;

  return _shopifyCustomClient.graphQLClient.query((root) => {
    root.add(
      'collectionByHandle',
      { args: { handle: options.handle } },
      (collection) => {
        collection.add('id');
        collection.add('handle');
        collection.add('description');
        collection.add('descriptionHtml');
        collection.add('updatedAt');
        collection.add('title');
        collection.add('image', (image) => {
          image.add('id');
          image.add('originalSrc', {
            alias: 'src'
          });
          image.add('altText');
        });
        collection.add(
          'products',
          {
            args: productArgs
          },
          (products) => {
            products.add('pageInfo', (pageInfo) => {
              pageInfo.add('hasNextPage');
              pageInfo.add('hasPreviousPage');
            });
            products.add('edges', (edges) => {
              edges.add('cursor');
              edges.add('node', (node) => {
                node.add('id');
                node.add('availableForSale');
                node.add('createdAt');
                node.add('updatedAt');
                node.add('descriptionHtml');
                node.add('description');
                node.add('handle');
                node.add('productType');
                node.add('title');
                node.add('vendor');
                node.add('publishedAt');
                node.add('onlineStoreUrl');
                node.add('options', (options) => {
                  options.add('name');
                  options.add('values');
                });
                node.add(
                  'images',
                  {
                    args: {
                      first: 250
                    }
                  },
                  (images) => {
                    images.add('pageInfo', (pageInfo) => {
                      pageInfo.add('hasNextPage');
                      pageInfo.add('hasPreviousPage');
                    });
                    images.add('edges', (edges) => {
                      edges.add('cursor');
                      edges.add('node', (node) => {
                        node.add('id');
                        node.add('src');
                        node.add('altText');
                      });
                    });
                  }
                );
                node.add(
                  'variants',
                  {
                    args: {
                      first: 250
                    }
                  },
                  (variants) => {
                    variants.add('pageInfo', (pageInfo) => {
                      pageInfo.add('hasNextPage');
                      pageInfo.add('hasPreviousPage');
                    });
                    variants.add('edges', (edges) => {
                      edges.add('cursor');
                      edges.add('node', (node) => {
                        node.add('id');
                        node.add('title');
                        node.add('price');
                        node.add('priceV2', (priceV2) => {
                          priceV2.add('amount');
                          priceV2.add('currencyCode');
                        });
                        node.add(
                          'presentmentPrices',
                          {
                            args: {
                              first: 20
                            }
                          },
                          (presentmentPrices) => {
                            presentmentPrices.add('pageInfo', (
                              pageInfo
                            ) => {
                              pageInfo.add('hasNextPage');
                              pageInfo.add('hasPreviousPage');
                            });
                            presentmentPrices.add('edges', (edges) => {
                              edges.add('node', (node) => {
                                node.add('price', (price) => {
                                  price.add('amount');
                                  price.add('currencyCode');
                                });
                                node.add('compareAtPrice', (
                                  compareAtPrice
                                ) => {
                                  compareAtPrice.add('amount');
                                  compareAtPrice.add('currencyCode');
                                });
                              });
                            });
                          }
                        );
                        node.add('weight');
                        node.add('availableForSale', {
                          alias: 'available'
                        });
                        node.add('sku');
                        node.add('compareAtPrice');
                        node.add('compareAtPriceV2', (
                          compareAtPriceV2
                        ) => {
                          compareAtPriceV2.add('amount');
                          compareAtPriceV2.add('currencyCode');
                        });
                        node.add('image', (image) => {
                          image.add('id');
                          image.add('originalSrc', {
                            alias: 'src'
                          });
                          image.add('altText');
                        });
                        node.add('selectedOptions', (selectedOptions) => {
                          selectedOptions.add('name');
                          selectedOptions.add('value');
                        });
                        node.add('unitPrice', (unitPrice) => {
                          unitPrice.add('amount');
                          unitPrice.add('currencyCode');
                        });
                        node.add('unitPriceMeasurement', (
                          unitPriceMeasurement
                        ) => {
                          unitPriceMeasurement.add('measuredType');
                          unitPriceMeasurement.add('quantityUnit');
                          unitPriceMeasurement.add('quantityValue');
                          unitPriceMeasurement.add('referenceUnit');
                          unitPriceMeasurement.add('referenceValue');
                        });
                      });
                    });
                  }
                );
              });
            });
          }
        );
      }
    );
  });
};

/**
 * Fetch products by collection handle with pagination & sorting on the shop.
 *
 * @example
 * fetchProductsByCollection(options).then((collection) => {
 *   // Do something with the collection
 * });
 *
 * @param {ProductsByCollectionSearchParams} options contains { handle, products filter query data: first, last, after, etc.. }
 * @return {Promise|ProductsByCollection} A promise resolving with an products `ProductsByCollection`.
 */
async function fetchProductsByCollection(options: ProductsByCollectionSearchParams): Promise<ProductsByCollection> {
  const collection = await _shopifyCustomClient.graphQLClient.send(collectionByHandleQuery(options))
    .then((collections) => {
      return collections;
    });
  const returnData: ProductsByCollection = {};
  if (collection && collection.data && collection.data.collectionByHandle) returnData.category = collection.data.collectionByHandle;
  if (collection && collection.data && collection.data.collectionByHandle) returnData.products = collection.data.collectionByHandle.products.edges;
  if (collection && collection.data && collection.data.collectionByHandle) returnData.pageInfo = collection.data.collectionByHandle.products.pageInfo;
  return returnData;
}

export default fetchProductsByCollection;
