import HTTPStatus from "http-status";

import UserServices from "./user-services";

export const localSignUp = async (req, res) => {
  try {
    const user = await UserServices.localSignUp(req.body);

    /** return user with the token */
    return res
      .status(HTTPStatus.CREATED)
      .json({ ok: true, data: user.toAuthJSON() });
  } catch (err) {
    return res.status(HTTPStatus.BAD_REQUEST).json({ ok: false, error: err });
  }
};

/** req.user is from passport (include all user data) */
/** Depends on the method of login, return the user info (Example: google) */

export const login = (req, res, next) => {
  res.status(HTTPStatus.OK).json({ ok: true, data: req.user.toAuthJSON() });
  return next();
};

export const secret = (req, res, next) => {
  res.json({ ok: true, data: "Welcome" });
};
