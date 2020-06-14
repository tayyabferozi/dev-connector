const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load validation

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load profile model

const Profile = require("../../models/Profile");

// Load User model

const User = require("../../models/User");

// @Route GET api/profile/test
// Tests  profile route
// access public

router.get("/test", (req, res) => res.send({ msg: "profile works" }));

// @Route GET api/profile
// Tests  Get current users profile
// access private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(foundProfile => {
        if (!foundProfile) {
          errors.noprofile = "There is no profile for this user";
          console.log(errors);
          return res.status(404).json(errors);
        }
        res.json(foundProfile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @Route GET api/profile/handle/:handle
// Tests  Get profile by handle
// access public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(foundProfile => {
      if (!foundProfile) {
        errors.profile = "Profile not found for this user";
        res.sendStatus(404).json(errors);
      } else {
        res.send(foundProfile);
      }
    })
    .catch(err => console.log(err));
});

// @Route GET api/profile/user/:user_id
// Tests  Get profile by user id
// access public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(foundProfile => {
      if (!foundProfile) {
        errors.profile = "Profile not found for this user";
        res.sendStatus(404).json(errors);
      } else {
        res.send(foundProfile);
      }
    })
    .catch(err =>
      res.status(404).json({ profile: "Profile not found for the user" })
    );
});

// @Route GET api/profile/all
// Tests  Show all profiles
// access public

router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(foundProfiles => {
      if (!foundProfiles) {
        return res
          .status(404)
          .json({ profile: "There are no profiles to show" });
      } else {
        res.json(foundProfiles);
      }
    })
    .catch(err => {
      res.status(404).json({ profile: "No profiles to show" });
    });
});

// @Route POST api/profile/
// Tests  Create or edit profile
// access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Velidation
    if (!isValid) {
      // Return errors with 400 code
      res.status(400).json(errors);
    }
    // Get Fields

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      if (foundProfile) {
        console.log(profileFields);
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
          .then(foundProfile => {
            res.json(foundProfile);
          })
          .catch(err => console.log(err));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(foundHandle => {
          if (foundHandle) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          } else {
            new Profile(profileFields).save().then(profile => {
              res.json(profile);
            });
          }
        });
      }
    });
  }
);

// @Route POST api/profile/experience
// @desc  Adds the experience
// @access private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check Velidation
    if (!isValid) {
      // Return errors with 400 code
      res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array

      foundProfile.experience.unshift(newExp);

      foundProfile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log("error in catch", err));
    });
  }
);

// @Route POST api/profile/education
// @desc  Adds the experience
// @access private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return errors with 400 code
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degre,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array

      foundProfile.education.unshift(newEdu);

      foundProfile
        .save()
        .then(profile => res.json(profile))
        .catch(err => console.log(err));
    });
  }
);

// @Route  DELETE api/profile/experience/:exp_d
// @desc   Delete the experience from profile
// @access private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(foundProfile => {
        // Get remove index
        const removeIndex = foundProfile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        foundProfile.experience.splice(removeIndex, 1);

        // Save
        foundProfile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @Route  DELETE api/profile/experience/:edu_d
// @desc   Delete the experience from profile
// @access private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(foundProfile => {
        // Get remove index
        const removeIndex = foundProfile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        foundProfile.education.splice(removeIndex, 1);

        // Save
        foundProfile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @Route  DELETE api/profile
// @desc   Delete the user and profile
// @access private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: "true" });
      });
    });
  }
);

module.exports = router;
