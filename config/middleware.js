let userSchema = require("../mongooseModel/User");
let mongoose = require("mongoose");
const User = mongoose.model("User", userSchema);

const nonSecurePaths = [
  "/",
  "/User/registerUser",
  "/User/loginUser",
  "/User/forgetPassword"
];
module.exports = async function checkUserValidity(req, res, next) {
  console.log("DRFGHBJKL", req.path, req.headers);
  if (nonSecurePaths.includes(req.path)) {
    next();
  } else {
    if (req.headers.accesstoken) {
      let findOneUser = await User.findOne({
        accessToken: req.headers.accesstoken
      });
      if (findOneUser) {
        console.log("inside if", findOneUser);
        req.user = findOneUser;
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  }
};
