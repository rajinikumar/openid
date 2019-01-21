import AuthServices from "./auth-services";

export const validateUser = (req, res, next) => {
  delete req.session.error;
  req.model.user.findOne({
    email: req.body.email
  }, function (err, user) {
    if (!err && user && user.samePassword(req.body.password)) {
      return next(null, user);
    } else {
      var error = new Error('Username or password incorrect.');
      return next(error);
    }
  });
};

export const afterLogin = function (req, res, next) {
  res.redirect(req.param('return_url') || '/user');
};

export const loginError = function (err, req, res, next) {
  req.session.error = err.message;
  res.redirect(req.path);
};