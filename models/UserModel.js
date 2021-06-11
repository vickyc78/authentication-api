let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
const User = mongoose.model("User", userSchema);
var jwt = require("jsonwebtoken");
let privateKey = "temp";
// const nodemailer = require("nodemailer");
// TOKEN_SECRET_CRYPTO=e7441379556e988ad8cd0ba41d44e0eb480c78cbfe441d5424d71832bf10c16de01f0e1259d6b608686e6139129221cef3cd5b333e056182f2be0c199272aaf1
const bcrypt = require("bcrypt");
const saltRounds = 10;

const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET_CRYPTO;

module.exports = {
  async registerUser(data) {
    if (!data.email) {
      return "Email is required";
    }
    let findOneUser = await User.findOne({ email: data.email });
    if (findOneUser) {
      return "You are already register with us through with this email";
    }

    let newUser = new User(data);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(data.password, salt);
    console.log("newUser newUser", newUser);

    let saveUserData = await newUser.save();
    console.log("saveUserData saveUserData", saveUserData);
    let token = jwt.sign(
      { secretPassword: saveUserData.password },
      process.env.TOKEN_SECRET_CRYPTO,
      {
        expiresIn: "1d"
      }
    );
    let updateData = await this.updateUser({
      userId: saveUserData._id,
      accessToken: token
    });
    console.log("v token", token);
    if (updateData == "Failed to update") {
      return "Something want wrong";
    } else {
      return { accessToken: token, accessLevel: saveUserData.accessLevel };
    }
  },
  async updateUser(data) {
    let updateUserData = await User.updateOne(
      {
        _id: data.userId
      },
      data,
      {
        new: true
      }
    );
    console.log("updateUserData updateUserData", updateUserData);
    if (updateUserData && updateUserData.nModified) {
      return "Updated Successfully";
    } else {
      return "Failed to update";
    }
  },
  async loginUser(data) {
    console.log("loginUser", data);
    //user findOne by email
    let loginData = await User.findOne({
      email: data.email
    });
    console.log("loginData", loginData);
    if (!loginData) {
      return "No email address found";
    }
    let checkPassword = await bcrypt.compare(data.password, loginData.password);
    if (!checkPassword) {
      return "Password is wrong";
    }
    let token = jwt.sign(
      { secretPassword: loginData.password },
      process.env.TOKEN_SECRET_CRYPTO,
      {
        expiresIn: "1d"
      }
    );
    let updateData = await this.updateUser({
      userId: loginData._id,
      accessToken: token
    });
    if (updateData == "Updated Successfully") {
      loginData["accessToken"] = token;
      return {
        accessToken: loginData.accessToken,
        accessLevel: loginData.accessLevel
      };
    } else {
      return "Something went wrong";
    }
  },
  async getOneDetail(data) {
    console.log("ytguyhijk", data);
    let findOne = await User.findOne({
      _id: mongoose.Types.ObjectId(data.userId)
    });
    console.log("findOne", findOne);
    if (findOne) {
      return {
        accessToken: findOne.accessToken,
        accessLevel: findOne.accessLevel
      };
    } else {
      return "No User Found";
    }
  },
  async forgetPassword(data) {
    let findOne = await User.findOne({
      email: data.email
    });
    if (!findOne) {
      return "No email address exist";
    }
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(data.password, salt);
    let updateData = await User.updateOne(
      {
        _id: findOne._id,
        email: data.email
      },
      {
        password: hashPassword
      }
    );
    if (updateData && updateData.nModified) {
      return "Password set successfully";
    } else {
      return "Something went wrong";
    }
  }
};
