"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  forEach,
  get,
  mapValues
} = require('lodash');

const axios = require('axios');

const FormData = require('form-data');

const util = require('util');

const {
  BadRequestError,
  AuthenticationError
} = require('./errors');

const CURRENT_ACTOR_QUERY =
/* GraphQL */
`
  query currentActor {
    currentActor {
      name
    }
  }
`;
const CREATE_BUILD_QUERY =
/* GraphQL */
`
  mutation createBuild(
    $teamSlug: String
    $siteSlug: String!
    $branch: String!
    $environment: String
    $xdnVersion: String!
    $framework: String
  ) {
    createBuild(
      teamSlug: $teamSlug
      siteSlug: $siteSlug
      branch: $branch
      environment: $environment
      xdnVersion: $xdnVersion
      framework: $framework
    ) {
      build {
        id
        status
      }
      s3SelfSignedProjectPost
      deprecationWarning
      userErrors {
        message
      }
    }
  }
`;
const UPDATE_BUILD_QUERY =
/* GraphQL */
`
  mutation updateBuild($build: UpdateBuildAttributes!) {
    updateBuild(build: $build) {
      build {
        id
        status
      }
      userErrors {
        message
      }
    }
  }
`;
const GET_BUILD_QUERY =
/* GraphQL */
`
  query build($buildId: ID!) {
    build(id: $buildId) {
      status
      url
      logs
      environment {
        name
        default
        url
      }
    }
  }
`;
const PURGE_BY_PATH = 'path';
const PURGE_BY_SURROGATE_KEY = 'surrogate_key';
const PURGE_CACHE_QUERY =
/* GraphQL */
`
  mutation purgeCache(
    $teamSlug: String
    $siteSlug: String!
    $purgeBy: PurgeByEnum!
    $values: [String!]!
  ) {
    purgeCache(teamSlug: $teamSlug, siteSlug: $siteSlug, purgeBy: $purgeBy, values: $values) {
      success
      userErrors {
        message
      }
    }
  }
`;

class Api {
  constructor(context) {
    this.context = context;
  }

  async _post(url, payload, {
    ignoreApiKey = false,
    headers = {}
  } = {}) {
    const {
      apiKey,
      apiUrl,
      logger
    } = this.context;
    const config = {
      baseURL: apiUrl,
      headers
    };

    if (apiKey && !ignoreApiKey) {
      config.headers['X-API-KEY'] = apiKey;
    }

    try {
      return await axios.post(url, payload, config);
    } catch (e) {
      if (e.response && e.response.status === 401) {
        throw new AuthenticationError(e.message);
      } // Axios throws an exception for 500s and connection issues


      logger.verbose(`Unexpected error from API: ${e.message}`);
      logger.error('Something went wrong while connecting to our server.\nPlease try again later with --verbose and contact the support if the problem persists.');
      process.exit(1);
    }
  }

  async _postGraphqlQuery(query, {
    variables = {},
    files = null,
    ignoreApiKey = false
  } = {}) {
    this.context.logger.graphqlQuery(query, variables, files);
    let res;

    if (files) {
      // Implementing spec https://github.com/jaydenseric/graphql-multipart-request-spec
      // to post FILES within a GraphQL mutation.
      const form = new FormData();
      form.append('operations', JSON.stringify({
        query,
        variables: _objectSpread({}, variables, {}, mapValues(files, () => null))
      }));
      const fileKeys = Object.keys(files);
      const fileMap = {};
      fileKeys.forEach((fileKey, index) => {
        const indexString = index.toString(10);
        fileMap[indexString] = [`variables.${fileKey}`];
        form.append(indexString, files[fileKey]);
      });
      form.append('map', JSON.stringify(fileMap));
      res = await this._post('/graphql', form, {
        ignoreApiKey,
        headers: form.getHeaders()
      });
    } else {
      res = await this._post('/graphql', {
        query,
        variables
      }, {
        ignoreApiKey
      });
    }

    const graphQlResponse = res.data;
    this.context.logger.graphqlResponse(graphQlResponse);

    if (graphQlResponse.errors) {
      throw new Error(`Unexpected API response: ${graphQlResponse.errors[0].message}`);
    }

    return graphQlResponse;
  }

  _onErrors(userErrors) {
    if (userErrors && userErrors.length) {
      // Just show the first error for now
      throw new BadRequestError(userErrors[0].message);
    }
  }

  async currentActor() {
    const res = await this._postGraphqlQuery(CURRENT_ACTOR_QUERY);
    return get(res, ['data', 'currentActor']);
  }
  /**
   * Creates and deploys a project build
   * @param {object} options
   * @param {string} options.siteSlug Slug of the Site to deploy to
   * @param {string} options.teamSlug Team where the Site belongs to. (default: personal team)
   * @param {string} options.branch Branch to deploy to. (default: 'cli' branch)
   * @param {string} options.framework Framework name.
   */


  async createBuild({
    siteSlug,
    teamSlug,
    branch,
    environment,
    xdnVersion,
    framework
  }) {
    const res = await this._postGraphqlQuery(CREATE_BUILD_QUERY, {
      variables: {
        siteSlug,
        // Uses personal team as a default
        teamSlug,
        branch: branch || 'cli',
        environment,
        xdnVersion,
        framework
      }
    });
    const {
      userErrors,
      build,
      s3SelfSignedProjectPost,
      deprecationWarning
    } = res.data.createBuild;

    this._onErrors(userErrors);

    return {
      build,
      s3SelfSignedProjectPost: JSON.parse(s3SelfSignedProjectPost),
      deprecationWarning
    };
  }

  async getBuild(buildId) {
    const res = await this._postGraphqlQuery(GET_BUILD_QUERY, {
      variables: {
        buildId
      }
    });
    return res.data.build;
  }

  async updateBuild(buildId, {
    status
  }) {
    const res = await this._postGraphqlQuery(UPDATE_BUILD_QUERY, {
      variables: {
        build: {
          id: buildId,
          status: status
        }
      }
    });
    const {
      userErrors,
      build
    } = res.data.updateBuild;

    this._onErrors(userErrors);

    return build;
  }
  /**
   * Purges project cache
   *
   * @param {object} options
   * @param {string} options.siteSlug Slug of the Site to deploy to
   * @param {string} options.teamSlug Team where the Site belongs to. (default: personal team)
   * @param {string} options.path Path pattern to look for when purging the cache
   * @param {string} options.surrogateKey Surrogate key to look for when purging the cache
   */


  async purgeCache({
    teamSlug,
    siteSlug,
    path,
    surrogateKey
  }) {
    let key;
    let values;

    if (path) {
      key = PURGE_BY_PATH;
      values = path;
    } else if (surrogateKey) {
      key = PURGE_BY_SURROGATE_KEY;
      values = surrogateKey;
    } // it should always be an array


    if (typeof values === 'string') {
      values = [values];
    }

    const res = await this._postGraphqlQuery(PURGE_CACHE_QUERY, {
      variables: {
        teamSlug: teamSlug,
        siteSlug: siteSlug,
        purgeBy: key,
        values: values
      }
    });
    const {
      success,
      userErrors
    } = res.data.purgeCache;

    this._onErrors(userErrors);

    return success;
  }

  async presignedUploadToS3(s3PresignedPost, file) {
    const form = new FormData();
    forEach(s3PresignedPost.fields, (value, key) => {
      form.append(key, value);
    });
    form.append('file', file);
    const contentLength = await util.promisify(form.getLength).bind(form)();
    this.context.logger.verbose(`POST file to ${s3PresignedPost.url}/${s3PresignedPost.fields.key}`);

    try {
      const res = await axios.post(s3PresignedPost.url, form, {
        // This line fixes: https://github.com/axios/axios/issues/1362#issuecomment-403002283
        maxContentLength: Infinity,
        headers: _objectSpread({
          'Content-Length': contentLength
        }, form.getHeaders())
      });
      this.context.logger.verbose(`Response ${res.status}`);
      return res;
    } catch (e) {
      this.context.logger.verbose(`Unexpected error from S3: ${e.message}`);
      this.context.logger.error('Something went wrong while uploading your package.\nPlease try again later with --verbose and contact the support if the problem persists.');
      process.exit(1);
    }
  }

}

module.exports = Api;