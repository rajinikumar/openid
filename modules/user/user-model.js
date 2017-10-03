import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { hashSync, compareSync } from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import { passwordReg } from "./user-validations";
import constants from "../../config/constants";

/** User Model */
const UserSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true
    },
    local: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true
      },
      email: {
        type: String,
        unique: true,
        required: [true, "Email is required!"],
        trim: true,
        lowercase: true,
        validate: {
          validator(email) {
            return validator.isEmail(email);
          },
          message: "{VALUE} is not a valid email!"
        }
      },
      password: {
        type: String,
        required: [true, "Password is required!"],
        trim: true,
        validate: {
          validator(password) {
            return passwordReg.test(password);
          },
          message: "{VALUE} is not a valid password!"
        }
      }
    },
    google: {
      id: String
    },
    facebook: {
      id: String
    }
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
    return compareSync(password, this.local.password);
  },

  /** token will send to client for authenication */
  createToken() {
    return jwt.sign(
      {
        sub: this._id,
        expiresIn: "5 days",
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
      firstName: this.local.firstName,
      lastName: this.local.lastName
    };
  }
};

/** Plugin for validation unique field in mongodb */
UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!"
});

export default mongoose.model("User", UserSchema);
