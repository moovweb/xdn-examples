import { setup } from '@vue-storefront/shopify-api';

export default async function init() {
  // const { app } = context;
  // const { locales: availableLocales, locale: defaultLocale } = app.i18n;
  // // const selectedLocale = availableLocales.find((locale) => locale.code === defaultLocale);

  const config = {
    domain: process.env.SHOPIFY_STORE_URL || 'testimonial-aula.myshopify.com',
    storefrontAccessToken: process.env.SHOPIFY_STORE_TOKEN || '29d77b8cb02a1b019fb50e57c7249936',
    countries: [
      {
        code: 'us',
        label: 'US'
      },
      {
        code: 'in',
        label: 'IN'
      }
    ],
    currencies: [
      {
        code: 'us',
        label: 'US',
        prefixSign: true,
        sign: '$'
      },
      {
        code: 'in',
        label: 'IN',
        prefixSign: true,
        sign: 'Rs.'
      }
    ],
    locales: [
      {
        code: 'en',
        label: 'EN'
      }
    ]
  };

  setup(config);
}
