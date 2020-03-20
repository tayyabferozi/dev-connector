const express = require("express");
const router = express.Router();

// @Route GET api/users/test
// Tests  profile route
// access public

router.get("/test", (req, res) => res.send({ msg: "profile works" }));

module.exports = router;