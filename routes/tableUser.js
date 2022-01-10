var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const userController = require('../controller/userController');


router.get('/',userController.divpage);

module.exports = router;