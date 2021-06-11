let express = require("express");

let mongoose = require("mongoose");

let bodyParser = require("body-parser");

let cors = require("cors");

const cryptoSecret = require("crypto")
  .randomBytes(64)
  .toString("hex");
console.log("cryptoSecret", cryptoSecret);

let Schema = mongoose.Schema;

let router = express.Router();

let app = express();
var env;
env = require("./config/env/development");
// env = require("./config/env/production");
console.log("process.env", env);

mongoose.connect(env.dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = process.env.PORT || env.port;
app.listen(port, function() {
  console.log(`App listing on port ${port} !`);
});

const middleware = require("./config/middleware");

let userRoutes = require("./controllers/UserController");

app.use(middleware);
app.use("/User", router);

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
  );
  next();
});

userRoutes(router);

app.get("/", function(req, res) {
  res.send("Hello Express");
});

app.get("/vicky", (req, res) => {
  res.status(200).send("Hello Express");
});
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
// app.listen(process.env.PORT);
// setInterval(() => {
//   http.get(`https://spiced-jasper-tugboat.glitch.me/`);
// }, 280000);
