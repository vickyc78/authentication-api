let mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

let userSchema = new Schema(
  {
    name: {
      type: String,
      index: true
    },
    accessLevel: {
      type: String,
      enum: ["User", "Admin", "Owner"],
      default: "User"
    },
    accessToken: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
module.exports = userSchema;
