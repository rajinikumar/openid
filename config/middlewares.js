import bodyParser from "body-parser";

const isDev = process.env.NODE_ENV === "development";

export default app => {
  /*=============================================
  =    transform req.body to json format        =
  =============================================*/
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /*=============================================
=    use morgan to log the GET/POST request   =
=============================================*/
  if (isDev) {
    const morgan = require("morgan");
    app.use(morgan("dev"));
  }
};
