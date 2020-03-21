const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

const db = require("./config/keys").mongoURI;


// bodyParser middleware

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

// DB Config

mongoose
  .connect(db, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(() => console.log("Connected to MonogoDB"))
  .catch(err => console.log(err));

// Root route

// Passport middleware

app.use(passport.initialize());

// Passport Config

require("./config/passport")(passport);

// Routes middleware

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Handling 404

app.use((req, res) => res.json({msg: "404 Not Found"}));

// Make the server Up and running

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));