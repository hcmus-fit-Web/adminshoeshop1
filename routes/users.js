var express = require('express');
const loggedInUserGuard = require("../middlewares/loggedInUserGuard");
var router = express.Router();
const userController = require('../controller/userController');

router.get('/',loggedInUserGuard,(req,res)=>{
  res.render('addOrEditUser');
})

router.post('/',(req,res)=>{
  if(req.body._id == ""){
    userController.insertUser(req,res);
  }else{
    userController.updateUser(req,res);
  }
})
module.exports = router;
