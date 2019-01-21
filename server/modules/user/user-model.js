import mongoose, { Schema } from "mongoose";
import { hashSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import constants from "../../config/constants";

/** User Model */
const UserSchema = new Schema(
  {
    username: {
      type: String
    },
    name: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: String,
    googleId: String,
    facebookId: String,
    amazonId: String
  },
  { timestamps: true }
);

/** Before insert into database, hash the passowrd */
UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this._hashPassword(this.password);
  }
  return next();
});

/** User instance methods */
UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },

  _comparePassword(password) {
    return compareSync(password, this.password);
  },

  /** token will send to client for authenication */
  createToken() {
    console.log(this.email)
    return jwt.sign(
      {
        sub: this._id,
        email: this.email || '',
        expiresIn: "2 days"
      },
      constants.JWT_SECRET
    );
  },

  /** Only for singUp and login */
  /** Attach the token into responses */
  toAuthJSON() {
    return {
      ...this.toRegJSON(),
      token: `JWT ${this.createToken()}`
    };
  },

  /** Override the res.json(user) */
  /** Only return below fields (Example: password is not include) */
  toRegJSON() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email
    };
  }
};

/** Plugin for validation unique field in mongodb */
UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!"
});

export default mongoose.model("User", UserSchema);
