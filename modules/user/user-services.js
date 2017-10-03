import UserModel from "./user-model";
import HTTPStatus from "http-status";
import { hashSync, compareSync } from "bcrypt-nodejs";
import {
  authLocal,
  authJwt,
  authGoogle,
  authGoogleCallback,
  authFacebook,
  authFacebookCallback
} from "./passport";

import constants from "../../config/constants";

class UserServices {
  async localSignUp({ firstName, lastName, email, password }) {
    try {
      /* If user exist */
      const existingUser = await UserModel.findOne({ "local.email": email });
      if (existingUser) {
        if (compareSync(constants.TEMP_PASSWORD, existingUser.local.password)) {
          existingUser.method = "local";
          existingUser.local.firstName = firstName;
          existingUser.local.lastName = lastName;
          existingUser.local.password = password;
          await existingUser.save();
          return existingUser;
        }
        return { error: true, message: "Email is already taken!" };
      }

      /** Create new user */
      const newUser = new UserModel({
        method: "local",
        local: {
          firstName,
          lastName,
          email,
          password
        }
      });

      /** Save new user to database */
      await newUser.save();
      return newUser;
    } catch (err) {
      throw { error: true, message: String(err) };
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
}

export default new UserServices();
