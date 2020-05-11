import express from 'express';
import { join } from 'path';

import nextI18NextMiddleware from 'next-i18next/middleware';
const nextI18next = require('./i18n');

const server = express();

// const preparing = nextI18next.initPromise;

async function nextRouting(req, res, next) {
  console.log('custom routing', req.url);

  // await preparing;
  const page = req.headers['x-next-page'];

  console.log('language', req);

  try {
    const path = join(process.cwd(), 'pages', page);
    const mod = eval('require')(path);
    if (mod.render instanceof Function) {
      mod.render(req, res);
    } else {
      mod.default(req, res);
    }
  } catch (e) {
    next(e);
  }
}

server.use(nextI18NextMiddleware(nextI18next));
server.use(nextRouting);

export default server;
