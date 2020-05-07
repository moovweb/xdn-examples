"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const authenticate = require('../prompts/authenticate');

const project = require('../utils/project');

exports.command = 'cache-clear [options]';
exports.describe = 'Clears your project cache';

exports.builder = yargs => {
  yargs.usage('$0 cache-clear [options]').example('$0 cache-clear --site site-name --path /products/1', 'Clear "/products/1" for "site-name" project under user\'s personal team').example('$0 cache-clear --team team-name [site] --path /products/*', 'Clear all urls on the domains in this project under "team-name" team that match the prefix "/products"').example('$0 cache-clear --surrogate-key key', 'Clear all domains in this project under user\'s personal team that have the surrogate key "key"').describe('team', 'Slug of the team where the site belongs. Using your personal team by default').describe('site', 'Slug of the site to deploy to, using package.json name property by default').describe('path', 'A path to clear. Use "*" as a wildcard.').default('path', '.').describe('surrogate-key', 'Clears all responses assigned to the specified surrogate key.').nargs('surrogate-key', 1).alias('s', 'surrogate-key').describe('prefix', 'Url prefix to clear in the domain path. Can be either a complete resource path, ex: "/category/1" or a path prefix with a wildcard "/category/*"').nargs('prefix', 1).alias('p', 'prefix') // Arguments pattern and surrogate-key are mutually exclusive
  .conflicts('prefix', 'surrogate-key');
};

exports.handler = async (_ref) => {
  let {
    context
  } = _ref,
      yargs = _objectWithoutProperties(_ref, ["context"]);

  await authenticate(context);
  const {
    logger
  } = context;
  const {
    team: teamSlug,
    site,
    path: projectPath,
    prefix,
    surrogateKey
  } = yargs;
  let siteSlug = site;

  if (!site) {
    // If site slug was not provided, use the name in package.json
    // Check that package.json is existing or fail the deployment
    try {
      const packageJson = project.loadPackageJson(projectPath);
      siteSlug = packageJson.name;
    } catch (e) {
      logger.error(e.message, {
        bold: true
      });
      process.exit(1);
    }
  }

  let commandCount = (surrogateKey ? 1 : 0) + (prefix ? 1 : 0);

  if (commandCount !== 1) {
    logger.error('You must specify one of the following options: --surrogate-key, --prefix. Options are mutually exclusive.', {
      bold: true
    });
    process.exit(1);
  }

  await logger.step('📡️ Purging the cache...', async () => {
    return await context.api.purgeCache({
      teamSlug,
      siteSlug,
      path: prefix,
      surrogateKey
    });
  });
  logger.success('🚀 Cache has been successfully purged.', {
    bold: true
  });
};