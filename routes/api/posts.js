const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post model

const Post = require("../../models/Post");

// Profile model

const Profile = require("../../models/Profile");

// Load validation Files

const validatePostInput = require("../../validation/post");

// @Route GET api/users/test
// @desc  Tests posts route
// @access public

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

// @Route  GET api/users/posts
// @desc   Create
// @access private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check isValid
    if (!isValid) {
      // If there were errors send 400
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @Route   GET api/posts
// @desc    Get posts
// @access  public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostsfound: "Posts not found" }));
});

// @Route  GET api/posts/id
// @desc   Get post by id
// @access Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(foundPost => res.json(foundPost))
    .catch(err => res.status(404).json({ nopostfound: "Post not found" }));
});

// @Route  DELETE api/posts/:id
// @desc   Delete post by id
// @access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      Post.findById(req.params.id)
        .then(foundPost => {
          if (foundPost.user.toString() !== req.user.id) {
            return res.status(401).json({ noauthorized: "User not authorize" });
          } else {
            foundPost.remove().then(() => {
              return res.json({ success: true });
            });
          }
        })
        .catch(err => res.status(404).json({ noprofile: "No Post found" }));
    });
  }
);

// @Route  POST api/posts/like/:id
// @desc   Like id
// @access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      Post.findById(req.params.id)
        .then(foundPost => {
          if (
            foundPost.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          foundPost.likes.unshift({ user: req.user.id });

          foundPost.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ noprofile: "No Post found" }));
    });
  }
);

// @Route  POST api/posts/like/:id
// @desc   Like id
// @access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      Post.findById(req.params.id)
        .then(foundPost => {
          if (
            foundPost.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          foundPost.likes.unshift({ user: req.user.id });

          foundPost.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ noprofile: "No Post found" }));
    });
  }
);

// @Route  POST api/posts/unlike/:id
// @desc   Unlike id
// @access Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(foundProfile => {
      Post.findById(req.params.id)
        .then(foundPost => {
          if (
            foundPost.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "User has not liked this post" });
          }

          const removeIndex = foundPost.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          foundPost.likes.splice(removeIndex, 1);
          foundPost.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ noprofile: "No Post found" }));
    });
  }
);

// @Route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check isValid
    if (!isValid) {
      // If there were errors send 400
      res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(foundPost => {
        const newComment = {
          text: req.body.text,
          name: req.user.name,
          avatar: req.user.avatar
        };
        // Add to comments array
        foundPost.comments.unshift(newComment);

        foundPost.save().then(post => res.json(post));
      })
      .catch(err => res.json({ postnotfound: "No post found" }));
  }
);

// @Route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete comment from post
// @access Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(foundPost => {
        if (
          foundPost.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ commentnotfound: "No comment found" });
        }
        // Remove Comment
        const removeIndex = foundPost.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        foundPost.comments.splice(removeIndex, 1);

        foundPost.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "No post was found" })
      );
  }
);

module.exports = router;
