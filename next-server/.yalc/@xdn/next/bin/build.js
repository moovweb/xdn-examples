var _regeneratorRuntime = require("@babel/runtime/regenerator");

var glob = require('glob');

var _require = require('path'),
    join = _require.join;

var validateNextConfig = require('./validateNextConfig');

var _require2 = require('@xdn/core'),
    config = _require2.config;

var _require3 = require('@xdn/core/deploy'),
    DeploymentBuilder = _require3.DeploymentBuilder,
    resolveInPackage = _require3.resolveInPackage;

var appDir = process.cwd();
var nextDir = join(appDir, '.next');

var _require4 = require('fs'),
    writeFileSync = _require4.writeFileSync;

var builder = new DeploymentBuilder(appDir); // We use this to build the s3 directory based on the output of the serverless
// build, not the source code.  That way we can pick up static html pages.

process.env.NEXT_PAGES_DIR = join('.xdn', 'lambda', 'pages');

module.exports = function build() {
  var _ref,
      skipFramework,
      router,
      nextPlugin,
      _args = arguments;

  return _regeneratorRuntime.async(function build$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, skipFramework = _ref.skipFramework;
          builder.clearPreviousBuildOutput();
          builder.addDefaultAppResources(join(__dirname, '..', 'default-app'));

          if (skipFramework) {
            _context.next = 8;
            break;
          }

          // clear .next directory
          builder.emptyDirSync(nextDir); // ensure that next.config.js exists and has target: serverless

          validateNextConfig(appDir); // run the next.js build

          _context.next = 8;
          return _regeneratorRuntime.awrap(builder.exec(resolveInPackage('next', 'dist', 'bin', 'next'), ['build']));

        case 8:
          config.defaultTo('server', {
            path: join(__dirname, '..', 'lambda', 'server.js')
          });
          builder // next.js client assets
          .addStaticAsset(join(appDir, '.next', 'static'), join('.next', 'static')) // React components and api endpoints
          .addJSAsset(join(appDir, '.next', 'serverless', 'pages')) // needed for /api/routes
          .addJSAsset(join(appDir, '.next', 'serverless', 'pages-manifest.json'));
          _context.next = 12;
          return _regeneratorRuntime.awrap(builder.build());

        case 12:
          _context.next = 14;
          return _regeneratorRuntime.awrap(builder.getRouter());

        case 14:
          router = _context.sent;
          nextPlugin = router.getPlugins().find(function (plugin) {
            return plugin.type === 'NextRoutes';
          });
          console.log('writing static asset manifest...'); // write manifest for public dir so we know what static assets to serve in the cloud

          writeFileSync(join(builder.jsDir, 'static-asset-manifest.json'), JSON.stringify(nextPlugin ? nextPlugin.manifest : [], null, '  '), 'utf8'); // Remove all static pages from the lambda dir.  We don't need them in the lambda
          // since we're serving them from s3. so that @xdn/core doesn't.  Also, having them be present
          // in the lambda will make NextRoutes add duplicate routes for each.

          glob.sync('**/*.html', {
            nodir: true,
            cwd: builder.jsDir
          }).forEach(function (file) {
            return builder.removeSync(join(builder.jsDir, file));
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
};