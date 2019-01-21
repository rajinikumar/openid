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

export const login = (err, user, info) => {
  console.log('err', err, user, info);
  res.json({ ok: true, data: req.user.toAuthJSON() });
  return next();
};

export const socialLogin = (req, res, next) => {
  const { state } = req.query;
  if (state) {
    const { returnTo } = JSON.parse(Buffer.from(state, 'base64').toString());
    if (validUrl.isUri(returnTo)) {
      res.redirect(`${returnTo}?token=JWT ${req.user.createToken()}`);
    } else {
      res.redirect(`/?token=JWT ${req.user.createToken()}`);
    }
  }
  else {
    res.redirect(`/?token=JWT ${req.user.createToken()}`);
  }
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

export const authLogin = (req, res, next) => {
  res.render('login');
  return next();
};
