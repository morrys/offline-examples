// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import {schema} from './data/schema';
// import {renderToString} from 'react-dom/server';
// import App from './js/app';
// import html from './html';
/* eslint no-console: 0 */
import next from 'next';

const app = next({dev: process.env.NODE_ENV !== 'production'});
const handle = app.getRequestHandler();

const port = 3000;

// https://github.com/hanford/next-offline#now-10
app.prepare().then(() => {
  const server = express();

  server.use(
    '/graphql',
    graphQLHTTP({
      schema,
      graphiql: false,
      pretty: true,
    }),
  );

  server.get('/service-worker.js', (req, res) => {
    console.log('entro', req);
    res.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.set('Content-Type', 'application/javascript');
    return app.serveStatic(
      req,
      res,
      path.resolve(__dirname, '.next', 'public', 'service-worker.js'),
    );
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
