import { Router } from "express";
import validate from "express-validation";

import * as userController from "./user-controller";
import userValidation from "./user-validations";
import UserServices from "./user-services";

const routes = new Router();

/** All routes for user (Example: /api/user/signup) */
routes.post(
  "/singup",
  validate(userValidation.localSignUp),
  userController.localSignUp
);

routes.post("/login", UserServices.localLoginMiddleware, userController.login);

/** Protect routes */
routes.get("/secret", UserServices.jwtLoginMiddleware, userController.secret);

/** Google authenication routes */
routes.get("/auth/google", UserServices.googleLoginMiddleware);

routes.get(
  "/auth/google/callback",
  UserServices.googleLoginCallbackMiddleware,
  userController.login
);

/** Facebook authenication routes */
routes.get("/auth/facebook", UserServices.facebookLoginMiddleware);

routes.get(
  "/auth/facebook/callback",
  UserServices.facebookLoginCallbackMiddleware,
  userController.login
);

export default routes;
