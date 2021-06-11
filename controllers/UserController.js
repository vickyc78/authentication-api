let UserModel = require("../models/UserModel");

module.exports = function(router) {
  router.post("/registerUser", async (req, res, next) => {
    try {
      let registerUserData = await UserModel.registerUser(req.body);
      if (
        registerUserData == "Email is required" ||
        registerUserData ==
          "You are already register with us through with this email"
      ) {
        res.status(410).json(registerUserData);
      } else if (registerUserData == "Something went wrong") {
        res.status(500).json(registerUserData);
      } else if (registerUserData) {
        res.status(200).json(registerUserData);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.post("/loginUser", async (req, res, next) => {
    try {
      let loginUserData = await UserModel.loginUser(req.body);
      if (
        loginUserData == "No email address found" ||
        loginUserData == "Password is wrong"
      ) {
        res.status(410).json(loginUserData);
      } else if (loginUserData == "Something went wrong") {
        res.status(500).json(loginUserData);
      } else {
        res.status(200).json(loginUserData);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  });
  router.post("/getOneDetail", async (req, res) => {
    try {
      req.body.userId = req.user._id;
      let getOneDetailData = await UserModel.getOneDetail(req.body);
      console.log("getOneDetailData getOneDetailData", getOneDetailData);
      if (getOneDetailData == "No user found") {
        res.status(422).json(getOneDetailData);
      } else if (getOneDetailData) {
        res.status(200).send(getOneDetailData);
      }
    } catch (error) {}
  });

  router.post("/forgetPassword", async (req, res) => {
    try {
      let forgetPasswordData = await UserModel.forgetPassword(req.body);
      console.log("forgetPasswordData forgetPasswordData", forgetPasswordData);
      if (forgetPasswordData == "No email address exist") {
        res.status(422).json(forgetPasswordData);
      } else if (forgetPasswordData == "Password set successfully") {
        res.status(200).send(forgetPasswordData);
      } else if (forgetPasswordData == "Something went wrong") {
        res.status(500).send(forgetPasswordData);
      }
    } catch (error) {}
  });
};
