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
      const user = await UserModel.findOne({ "local.email": email });
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
  proxy: true
};

const googleLogin = new GoogleStrategy(
  googleOpts,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ email: profile.email });
      /** User exist */
      if (existingUser) {
        /** Check if existingUser register using google by check google.id */
        if (existingUser.google.id) {
          /** If existing user does register by google before, just return the user */
          return done(null, existingUser);
        }
        /** Otherwise update user the google id and return the user */
        existingUser.google.id = profile.id;
        await existingUser.save();
        return done(null, existingUser);
      }

      /** User not exist */
      /** Create a user using the profile come back from google auth */
      const newUser = new UserModel({
        method: "google",
        local: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password:
            constants.TEMP_PASSWORD /** Set temp password only for social auth user (will not be used when user login using google auth)*/
        },
        google: {
          id: profile.id
        }
      });
      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
    }
  }
);

/** Facebook OAuth strategy login */
const facebookOpts = {
  clientID: constants.FACEBOOK_APP_ID,
  clientSecret: constants.FACEBOOK_APP_SECRET,
  callbackURL: "/api/user/auth/facebook/callback",
  profileFields: ["id", "emails", "photos", "name"],
  proxy: true
};

const facebookLogin = new FacebookStrategy(
  facebookOpts,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ email: profile.email });

      /** User exist */
      if (existingUser) {
        /** Check if existingUser register using facebook by check facebook.id */
        if (existingUser.facebook.id) {
          /** If existing user does register by facebook before, just return the user */
          return done(null, existingUser);
        }
        /** Otherwise update user the facebook id and return the user */
        existingUser.facebook.id = profile.id;
        await existingUser.save();
        return done(null, existingUser);
      }

      /** User not exist */
      /** Create a user using the profile come back from facebook */
      const newUser = new UserModel({
        method: "facebook",
        local: {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password:
            constants.TEMP_PASSWORD /** Set up temp password only for social auth user (will not be used when user login using social auth)*/
        },
        facebook: {
          id: profile.id
        }
      });
      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, false, error.message);
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
  session: false,
  failureRedirect:
    "/" /** Login failed, redirect user to <route> (ExampleL /login) */,
  successRedirect:
    "/" /** Login success, redirect user to <route> (Example: /dashboard) */,
  failureFlash: true
});

export const authFacebook = passport.authenticate("facebook", {
  scope: "email"
});
export const authFacebookCallback = passport.authenticate("facebook", {
  session: false,
  failureRedirect:
    "/" /** Login failed, redirect user to <route> (ExampleL /login) */,
  successRedirect:
    "/" /** Login success, redirect user to <route> (Example: /dashboard) */,
  failureFlash: true
});
