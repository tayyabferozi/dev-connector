const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../../config/keys").secret;
const passport = require("passport");

// Load User Model

const User = require("../../models/User");

// Load register validator

const validateRegisterInput = require("../../validation/register");

// Load Login Validator

const validateLoginInput = require("../../validation//login");

// @Route GET api/users/test
// @desc   tests users route
// @access public

router.get("/test", (req, res) => res.json({ msg: "users works"}));

// @Route POST api/users/register
// @desc   Registers the user
// @access public

router.post("/register", (req, res) => {
  // Validate register
const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((foundUser => {
      if(foundUser){
        errors.emai = "Email already Exists!";
        return res.status(400).json(errors);
      } else{
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm"
        })

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            else{
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            }
          });
        })
      }
    }))
});

// @Route GET api/users/register
// @desc   Logging in the user / Return JWT
// @access public

router.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  // Check velidation

  if(!isValid){
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then(( foundUser => {
      if(!foundUser){
        error.email = "User not found"
        return res.status(404).json(errors);
      } else{
          bcrypt.compare(password, foundUser.password)
          .then(isMatch => {
            if(isMatch){
              // Sign Token

              const payload = {id: foundUser.id, email: foundUser.email, avatar: foundUser.avatar}

              jwt.sign(
                payload,
                secret,
                { expiresIn: 3600 }
                , (err, token) => {
                  if(!err){
                    console.log("Web token was signed to the users");
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  }
                }
                )


            } else{
              errors.password = "Password incorrect"
              return res.status(400).json(errors);
            }
          });
      }

    } ))
});

// @Route  GET api/users/current
// @desc   Returns the current Authenticated User
// @access private

router.get("/current", passport.authenticate("jwt", { session: false }),
 (req, res) => {
  res.json(req.user);
});

module.exports = router;