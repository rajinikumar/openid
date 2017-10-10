import UserServices from "./user-services";

export const localSignUp = async (req, res) => {
  try {
    const result = await UserServices.localSignUp(req.body);
    if (!result.ok) {
      return res.json({ ok: false, error: result.error });
    }
    /** return user*/
    return res.json({ ok: true, data: result.data.toRegJSON() });
  } catch (err) {
    return res.json({ ok: false, error: err });
  }
};

/** req.user is from passport (include all user data) */
/** Depends on the method of login, return the user info (Example: google) */

export const login = (req, res, next) => {
  res.json({ ok: true, data: req.user.toAuthJSON() });
  return next();
};

export const socialLogin = (req, res, next) => {
  res.redirect(`/socialLogin/JWT ${req.user.createToken()}`);  
  return next();
};

export const getUser = (req, res, next) => {
  res.json({ ok: true, data: req.user.toRegJSON() });
  return next();
};

export const secret = (req, res, next) => {
  res.json({
    ok: true,
    data: `Welcome ${req.user.username} to our secret content!`
  });
};
