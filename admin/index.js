var express = require('express');
var router = express.Router();
const passport = require("../passport");
const authController = require("../controller/adminController");
/* GET home page. */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login?wrong-password'
}));
router.get('/login', authController.login);
module.exports = router;


