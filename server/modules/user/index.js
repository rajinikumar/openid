import { Router } from "express";
import passport from "passport";
import * as userController from "./user-controller";
import UserServices from "./user-services";

const routes = new Router();

/** All routes for user (Example: /api/user/signup) */
routes.post("/signup", userController.localSignUp);

/** custom callback */
routes.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.json({ ok: false, error: "You are not authorized" });
    res.json({ ok: true, data: user.toAuthJSON() });
  })(req, res, next);
});

/** Protect routes example*/
routes.get("/getuser", UserServices.jwtLoginMiddleware, userController.getUser);

/** Protect routes example*/
routes.get("/secret", UserServices.jwtLoginMiddleware, userController.secret);

/** Google authenication routes */
routes.get("/auth/google", UserServices.googleLoginMiddleware);

routes.get(
  "/auth/google/callback",
  UserServices.googleLoginCallbackMiddleware,
  userController.socialLogin
);

/** Facebook authenication routes */
routes.get("/auth/facebook", UserServices.facebookLoginMiddleware);

routes.get(
  "/auth/facebook/callback",
  UserServices.facebookLoginCallbackMiddleware,
  userController.socialLogin
);

export default routes;
