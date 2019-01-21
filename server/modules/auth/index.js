import {
  Router
} from "express";
import passport from "passport";
import * as authController from "./auth-controller";

import {
  oidc
} from '../../../index';

import UserServices from "./user-services";

const routes = new Router();

//Login form (I use email as user name)
routes.get('/login', function (req, res, next) {
  var head = '<head><title>Login</title></head>';
  var inputs = '<input type="text" name="email" placeholder="Enter Email"/><input type="password" name="password" placeholder="Enter Password"/>';
  var error = req.session.error ? '<div>' + req.session.error + '</div>' : '';
  var body = '<body><h1>Login</h1><form method="POST">' + inputs + '<input type="submit"/></form>' + error;
  res.send('<html>' + head + body + '</html>');
});

routes.post('/login', oidc.login(authController.validateUser), authController.afterLogin, authController.loginError);

routes.all('/logout', oidc.removetokens(), function (req, res, next) {
  req.session.destroy();
  res.redirect('/auth/login');
});


export default routes;