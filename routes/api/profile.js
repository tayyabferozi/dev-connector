const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load profile model

const Profile = require("../../models/Profile");

// Load profile model

const User = require("../../models/User")

// @Route GET api/profile/test
// Tests  profile route
// access public

router.get("/test", (req, res) => res.send({ msg: "profile works" }));

// @Route GET api/profile
// Tests  Get current users profile
// access private

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {}

  Profile.findOne({ user: req.user.id })
  .then(foundProfile => {
    if(!foundProfile){
      errors.noprofile = "There is no profile for this user";
      console.log(errors);
      return res.status(404).json(errors);
    }
      res.json(foundProfile);
  })
  .catch(err => res.status(404).json(err));
});

// @Route GET api/profile
// Tests  Get current users profile
// access private

router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {

  // Get Fields

  const profileFields = {};
  profileField.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  
  if(typeof req.body.skills !== "undefined") {
    profile.skills = req.body.skills.split(",");

  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  }
});

module.exports = router;