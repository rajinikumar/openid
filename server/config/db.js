import mongoose from "mongoose";
import constants from "./constants";

mongoose.Promise = global.Promise;

try {
  mongoose.connect(constants.DB_URL, {
    useMongoClient: true
  });
} catch (err) {
  mongoose.createConnection(constants.DB_URL, {
    useMongoClient: true
  });
}

mongoose.connection
  .once("open", () => {
    console.log("------------------------------------");
    console.log("MongoDB is running");
    console.log("------------------------------------");
  })
  .on("error", err => {
    throw err;
  });
