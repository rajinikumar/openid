import express from "express";
import constants from "./server/config/constants";
import middlewares from "./server/config/middlewares";
import "./server/config/db";
import Routes from "./server/modules";
import path from "path";


const app = express();

var options = {
  login_url: '/auth/login',
  consent_url: '/user/consent',
  scopes: {
    foo: 'Access to foo special resource',
    bar: 'Access to bar special resource'
  },
//when this line is enabled, user email appears in tokens sub field. By default, id is used as sub.
  models:{user:{attributes:{sub:function(){return this.email;}}}},
  app: app
};
var oidc = require('openid-connect').oidc(options);


/* Middleware */
middlewares(app);


/* Routers */
app.use("/api", Routes);


//Set Rendering Engine as Jade
app.set('views', './server/views');
app.set('view engine', 'pug');

/** Server client static file */
if (process.env.NODE_ENV === "production") {
  /** Express will serve up production assets */
  /** like our main.js file, or main.css file! */
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

/* Start Server */
app.listen(constants.PORT, err => {
  if (err) {
    throw err;
  }
  console.log("------------------------------------");
  console.log(`Server is runing on PORT: ${constants.PORT}`);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);
  console.log("------------------------------------");
});

module.exports.oidc = oidc;
