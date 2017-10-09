import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { hashSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import constants from "../../config/constants";

/** User Model */
const UserSchema = new Schema(
  {
    userName: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: "{VALUE} is not a valid email!"
      }
    },
    password: String,
    googleId: String,
    facebookId: String
  },
  { timestamps: true }
);

/** Before insert into database, hash the passowrd */
UserSchema.pre("save", function(next) {
  if (this.isModified("local.password")) {
    this.local.password = this._hashPassword(this.local.password);
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
    return jwt.sign(
      {
        sub: this._id,
        expiresIn: "1 days",
        issuer: "rent out"
      },
      constants.JWT_SECRET
    );
  },

  /** Only for singUp and login */
  /** Attach the token into responses */
  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: `JWT ${this.createToken()}`
    };
  },

  /** Override the res.json(user) */
  /** Only return below fields (Example: password is not include) */
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName
    };
  }
};

/** Plugin for validation unique field in mongodb */
UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!"
});

export default mongoose.model("User", UserSchema);
