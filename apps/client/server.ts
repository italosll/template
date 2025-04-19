import express from 'express';
import {AngularNodeAppEngine, CommonEngine, createNodeRequestHandler, writeResponseToNodeResponse} from '@angular/ssr/node';

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use('*', (req, res, next) => {

  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Pass control to the next middleware
      }
    })
    .catch(next);
});
/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
