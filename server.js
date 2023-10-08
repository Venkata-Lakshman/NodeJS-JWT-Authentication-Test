const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

const jwt = require("jsonwebtoken");
// const exjwt = require('express-jwt');
const { expressjwt: exjwt } = require("express-jwt");
const bodyParser = require("body-parser");
const path = require("path");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;
const SecretKey = "My super secret Key";
const jwtMW = exjwt({
  secret: SecretKey,
  algorithms: ["HS256"],
});

let users = [
  {
    id: 1,
    username: "lakshman",
    password: "123",
  },
  {
    id: 2,
    username: "nimmagadda",
    password: "456",
  },
];

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
let token;
  for (let user of users) {
    if (username == user.username && password == user.password) {
      token = jwt.sign(
        { id: user.id, username: user.username },
        SecretKey,
        { expiresIn: "180s" }
      );
      break;
    }
  }
  if (token) {
    res.json({
        success: true,
        err: null,
        token
    });
}
else {
    res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect'
    });
}
});

app.get("/api/dashboard", jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret content that only logged in people can see!!!",
  });
});

app.get('/api/settings', jwtMW, (req, res) => {
  res.json({
      success: true,
      myContent: 'Settings page works!!'
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "Username or password is incorrect 2",
    });
  } else {
    next(err);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
