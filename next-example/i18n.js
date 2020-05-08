const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['hu'],
  localeSubpaths: {
    hu: 'hu',
  },
});

// getinitial props getting i18n context object
// https://github.com/GuideToIceland/monorepo/blob/7e1b01a1c2353e39dc484b4c92a43d4f16e37fe7/src/js/web/src/pages/accommodation.tsx#L81
