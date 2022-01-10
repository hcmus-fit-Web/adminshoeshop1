var express = require('express');
const loggedInUserGuard = require("../middlewares/loggedInUserGuard");
const mongoose = require("mongoose");
var router = express.Router();
const adminController = require('../controller/adminController');


router.get('/',loggedInUserGuard,(req,res)=>{
    res.render('register');
})

router.post('/',(req,res)=>{
    console.log(req.body._id);
    if(req.body._id == ""){
        adminController.insertUserAdmin(req,res);
    }else{
        adminController.updateUserAdmin(req,res);
    }
})
module.exports = router;
