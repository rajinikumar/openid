import HTTPStatus from "http-status";

import UserServices from "./user-services";

export const localSignUp = async (req, res) => {
  try {
    const result = await UserServices.localSignUp(req.body);
    if (result.error) {
      return res.status(HTTPStatus.FOUND).json(result);
    }
    /** return user with the token */
    return res.status(HTTPStatus.CREATED).json(result.toAuthJSON());
  } catch (err) {
    return res.status(HTTPStatus.BAD_REQUEST).json(err);
  }
};

/** req.user is from passport (include all user data) */
/** Depends on the method of login, return the user info (Example: google) */

export const login = (req, res, next) => {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON(req.user.method));
  return next();
};

export const secret = (req, res, next) => {
  res.json({ message: "Welcome" });
};
