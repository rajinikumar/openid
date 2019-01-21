import UserModel from "./user-model";
import HTTPStatus from "http-status";
import { hashSync, compareSync } from "bcrypt-nodejs";
import {
  authLocal,
  authJwt,
  authGoogle,
  authGoogleCallback,
  authFacebook,
  authFacebookCallback,
  authAmazon,
  authAmazonCallback,
} from "./passport";

import constants from "../../config/constants";

class UserServices {
  async localSignUp({ username, email, password }) {
    try {
      /* If user exist */
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return { ok: false, error: "Email is already taken!" };
      }

      /** Create new user */
      const newUser = new UserModel({
        username,
        email,
        password
      });
      /** Save new user to database */
      await newUser.save();
      return { ok: true, data: newUser };
    } catch (err) {
      throw String(err);
    }
  }

  /** Login middile using different passport strategy */
  localLoginMiddleware(req, res, next) {
    return authLocal(req, res, next);
  }

  jwtLoginMiddleware(req, res, next) {
    return authJwt(req, res, next);
  }

  googleLoginMiddleware(req, res, next) {
    return authGoogle(req, res, next);
  }

  googleLoginCallbackMiddleware(req, res, next) {
    return authGoogleCallback(req, res, next);
  }

  facebookLoginMiddleware(req, res, next) {
    return authFacebook(req, res, next);
  }

  facebookLoginCallbackMiddleware(req, res, next) {
    return authFacebookCallback(req, res, next);
  }

  amazonLoginMiddleware(req, res, next) {
    return authAmazon(req, res, next);
  }

  amazonLoginCallbackMiddleware(req, res, next) {
    return authAmazonCallback(req, res, next);
  }
}

export default new UserServices();
