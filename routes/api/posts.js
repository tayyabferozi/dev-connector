const express = require("express");
const router = express.Router();

// @Route GET api/users/test
// Tests  posts route
// access public

router.get("/test", (req, res) => res.json({ msg: "posts works" }));

module.exports = router;