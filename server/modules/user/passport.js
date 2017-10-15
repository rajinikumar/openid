import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as FacebookStrategy } from "passport-facebook";

import UserModel from "./user-model";
import constants from "../../config/constants";

/** Local strategy for singup and login */
const localOpts = {
  usernameField: "email"
};

const localLogin = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return done(null, false);
      } else if (!user._comparePassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

/** JWT strategy for authorize to protect routes  */
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: constants.JWT_SECRET
};

const jwtLogin = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

/** Google OAuth strategy login*/
const googleOpts = {
  clientID: constants.GOOGLE_CLIENT_ID,
  clientSecret: constants.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/user/auth/google/callback",
  passReqToCallback: true,
  proxy: true
};

const googleLogin = new GoogleStrategy(
  googleOpts,
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      if (!req.user) {
        let user = await UserModel.findOne({ googleId: profile.id });
        /** User exist */
        if (user) {
          return done(null, user);
        }

        /** User not exist */
        /** Create a user using the profile come back from google auth */
        user = new UserModel({
          username: profile.displayName,
          googleId: profile.id
        });
        await user.save();
        done(null, user);
      } else {
        const user = await UserModel.findOne({ _id: req.user.id });
        user.googleId = profile.id;
        await user.save();
        done(null, user);
      }
    } catch (error) {
      done(error, false);
    }
  }
);

/** Facebook OAuth strategy login */
const facebookOpts = {
  clientID: constants.FACEBOOK_APP_ID,
  clientSecret: constants.FACEBOOK_APP_SECRET,
  callbackURL: "/api/user/auth/facebook/callback",
  profileFields: ["id", "emails", "photos", "displayName"],
  passReqToCallback: true,
  proxy: true
};

const facebookLogin = new FacebookStrategy(
  facebookOpts,
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      if (!req.user) {
        let user = await UserModel.findOne({
          facebookId: profile.id
        });

        /** User exist */
        if (user) {
          return done(null, user);
        }

        /** User not exist */
        /** Create a user using the profile come back from facebook */
        user = new UserModel({
          username: profile.displayName,
          facebookId: profile.id
        });
        await user.save();
        done(null, user);
      } else {
        const user = await UserModel.findOne({ _id: req.user.id });
        user.facebookId = profile.id;
        user.save();
        done(null, user);
      }
    } catch (error) {
      done(error, false);
    }
  }
);

/** Apply all login strategy */
passport.use(localLogin);
passport.use(jwtLogin);
passport.use(googleLogin);
passport.use(facebookLogin);

export const authLocal = passport.authenticate("local", { session: false });
export const authJwt = passport.authenticate("jwt", { session: false });

export const authGoogle = passport.authenticate("google", {
  scope: [
    "profile",
    "email"
  ] /** User information needed from google auth call back */
});
export const authGoogleCallback = passport.authenticate("google", {
  session: false
});

export const authFacebook = passport.authenticate("facebook", {
  scope: "email"
});
export const authFacebookCallback = passport.authenticate("facebook", {
  session: false
});
