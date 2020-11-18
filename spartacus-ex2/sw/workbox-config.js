module.exports = {
  globDirectory: 'dist/spartacus-ex2/browser/',
  globPatterns: [
    '**/*.{css,eot,html,ico,jpg,js,json,png,svg,ttf,txt,webmanifest,woff,woff2,webm,xml}',
  ],
  globFollow: true, // follow symlinks
  globStrict: true, // fail the build if anything goes wrong while reading the files
  globIgnores: [`**/*-es5.*.js`],
  // Look for a 20 character hex string in the file names
  // Allows to avoid using cache busting for Angular files because Angular already takes care of that!
  dontCacheBustURLsMatching: new RegExp('.+.[a-f0-9]{20}..+'),
  maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4Mb
  swSrc: 'dist/spartacus-ex2/browser/service-worker.js',
  swDest: 'dist/spartacus-ex2/browser/service-worker.js',
}
