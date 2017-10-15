import express from "express";

import constants from "./server/config/constants";
import middlewares from "./server/config/middlewares";
import "./server/config/db";
import Routes from "./server/modules";
import path from "path";

const app = express();

/* Middleware */
middlewares(app);

/* Routers */
app.use("/api", Routes);

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
