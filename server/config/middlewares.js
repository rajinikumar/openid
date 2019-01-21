import bodyParser from "body-parser";
import expressSession from 'express-session';
var rs = require('connect-redis')(expressSession),
  logger = require('morgan'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  errorHandler = require('errorhandler'),
  methodOverride = require('method-override');

const isDev = process.env.NODE_ENV === "development";

export default app => {
  /*=============================================
  =    transform req.body to json format        =
  =============================================*/
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(cookieParser('Some Secret!!!'));
  app.use(expressSession({
    store: new rs({
      host: '127.0.0.1',
      port: 6379
    }),
    secret: 'Some Secret!!!'
  }));

  /*=============================================
=    use morgan to log the GET/POST request   =
=============================================*/
  if (isDev) {
    const morgan = require("morgan");
    app.use(morgan("dev"));
    app.use(errorHandler());
  }
};