var express = require("express");
var router = express.Router();
var authenticate = require("../middlewares/authenticate");

/* GET users listing. */
router.get("/", authenticate, function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
