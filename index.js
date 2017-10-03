import express from "express";

import constants from "./config/constants";
import middlewares from "./config/middlewares";
import "./config/db";
import Routes from "./modules";

const app = express();

/* Middleware */
middlewares(app);

/* Routers */
app.use("/api", Routes);

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
