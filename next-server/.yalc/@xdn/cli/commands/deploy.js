"use strict";

const path = require('path');

const fse = require('fs-extra');

const {
  compact,
  get
} = require('lodash');

const {
  EOL
} = require('os');

const sleep = require('../utils/sleep');

const packageProject = require('../utils/packageProject');

const git = require('../utils/git');

const project = require('../utils/project');

const buildProject = require('../utils/build');

const {
  readXdnVersion
} = require('../utils/xdn');

const authenticate = require('../prompts/authenticate');

const detectFramework = require('../frameworks/detectFramework');

exports.command = 'deploy [team]';
exports.describe = 'Deploys your project to XDN 2.0';
exports.builder = {
  site: {
    type: 'string',
    alias: 's',
    describe: 'Slug of the site to deploy to, using package.json name property by default'
  },
  'skip-build': {
    type: 'boolean',
    describe: 'Skips rebuilding your app and deploys the previous build instead.'
  },
  path: {
    type: 'string',
    describe: "Path to your site's root director. Uses current directory by default",
    default: '.'
  },
  team: {
    type: 'string',
    alias: 't',
    describe: 'The name of the team under which the site will be deployed. The site will be deployed to your private space will be used if omitted.'
  },
  branch: {
    type: 'string',
    alias: 'b',
    describe: 'The name of the source control branch. This is automatically set when using Git.'
  },
  environment: {
    type: 'string',
    alias: 'e',
    describe: 'Environment to deploy to. Uses default environment otherwise'
  }
};

exports.handler = async yargs => {
  const {
    context,
    path: givenPath,
    team: teamSlug,
    site,
    branch,
    environment,
    skipBuild
  } = yargs;
  const {
    logger
  } = context;
  const framework = await detectFramework();
  await authenticate(context);

  if (!skipBuild) {
    await buildProject(yargs);
  }

  const absolutePath = path.resolve(process.cwd(), givenPath); // Check that package.json is existing or fail the deployment

  const packageJson = project.loadPackageJson(givenPath);
  const xdnVersion = await readXdnVersion(absolutePath); // If --site is provided override default $npm_package_name

  const siteSlug = site || packageJson.name;
  const branchName = branch || (await git.currentBranch(absolutePath, {
    logger
  }));
  logger.title('📋 Deploying to:');
  logger.info(`> team=${teamSlug || 'Private space'}${EOL}> site=${siteSlug}${EOL}> branch=${branchName}${EOL}> environment=${environment || 'default'}${EOL}> xdn-version=${xdnVersion}`); // Puts projectRoot/.xdn folder into zip

  const projectZipFile = await packageProject(absolutePath, yargs);
  const buildId = await logger.step('📡️ Uploading...', async () => {
    logger.info('> Initializing deployment'); // TODO: inject xdnVersion from lambdas.json parckaged in @xdn/core

    const {
      build: {
        id: buildId
      },
      s3SelfSignedProjectPost,
      deprecationWarning
    } = await context.api.createBuild({
      siteSlug,
      teamSlug,
      environment,
      xdnVersion,
      branch: branchName,
      framework: get(framework, 'key')
    });

    if (deprecationWarning) {
      logger.warning(deprecationWarning);
    }

    logger.info('> Uploading package');
    const zipFileStream = fse.createReadStream(projectZipFile);
    await context.api.presignedUploadToS3(s3SelfSignedProjectPost, zipFileStream);
    await context.api.updateBuild(buildId, {
      status: 'uploaded'
    });
    return buildId;
  });
  const build = await logger.step('⌛ Deploying to the Moovweb XDN...', async () => {
    // TODO: use subscriptions?
    const LOG_PULL_DELAY = 5000;
    let build;
    let displayedLogsCount = 0;

    while (!build || !['failed', 'completed'].includes(build.status)) {
      await sleep(LOG_PULL_DELAY);
      build = await context.api.getBuild(buildId);
      const logs = compact(build.logs.split('\n'));
      const newLogs = logs.slice(displayedLogsCount);
      newLogs.forEach(newLog => logger.info(newLog));
      displayedLogsCount = logs.length;
    }

    return build;
  });

  if (build.status === 'completed') {
    const successMsg = `Site deployed on ${build.environment.name} environment ${build.environment.url}`;
    logger.success(`🚀 ${successMsg}`, {
      bold: true
    });
  }

  if (build.status === 'failed') {
    logger.error('Something went wrong while deploying, please check the logs and contact the support if the problem persists', {
      bold: true
    });
  }
};