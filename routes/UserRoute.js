const express = require("express");
const router = express.Router();
const Auth = require("./../Controllers/AuthController");
router.post("/signup", Auth.sginup);
router.post("/login", Auth.login);

// router.use(Auth.protect);

router.get("/Me", Auth.protect, Auth.getMe);

module.exports = router;
