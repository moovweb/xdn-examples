import getCategory from './api/category';
import getProduct from './api/product';
import { getCart, createCart, addToCart, updateProductQty, removeCart, updateCart } from './api/checkout/cart';
import getShop from './api/shop';
import getCustomer from './api/customer';
import getContent from './api/content';
import getArticle from './api/blog';
import { apiClientFactory } from '@vue-storefront/core';
import { ApiClientMethods, ApiClientSettings } from './types';
import Client from 'shopify-buy';

const CustomClient = require('shopify-buy/index.unoptimized.umd');
let _shopifyClient;
let _shopifyCustomClient;
let cookies = {
  cartCookieName: 'vsf-cart'
};

const { setup, override, getSettings } = apiClientFactory<ApiClientMethods, ApiClientSettings>({
  defaultSettings: {
    domain: 'testimonial-aula.myshopify.com',
    storefrontAccessToken: '29d77b8cb02a1b019fb50e57c7249936'
  },
  onSetup: (config: any) => {
    _shopifyClient = Client.buildClient(config);
    _shopifyCustomClient = CustomClient.buildClient(config);
    cookies = config.cookies || cookies;
  }
});

const settings = getSettings();

export {
  cookies,
  getProduct,
  getCategory,
  getCart,
  createCart,
  addToCart,
  updateProductQty,
  updateCart,
  removeCart,
  getShop,
  getCustomer,
  getContent,
  getArticle,
  _shopifyClient,
  _shopifyCustomClient,
  override,
  setup,
  settings
};
