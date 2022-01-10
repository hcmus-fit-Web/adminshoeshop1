var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
const adminController = require('../controller/adminController');
/* GET home page. */
//Admin


router.get('/',adminController.divpage);

module.exports = router;