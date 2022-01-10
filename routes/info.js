var express = require('express');
const adminController = require("../controller/adminController");
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('info');
})
router.post('/',(req,res)=>{
    adminController.updateUserAdmin(req,res);
})

module.exports = router;