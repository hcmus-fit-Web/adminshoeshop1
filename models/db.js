const mongoose = require('mongoose');
require("dotenv").config();

const url  = process.env.MONGODB;

mongoose.connect(url,{useNewUrlParser:true},(err)=>{

    if(!err){
        console.log("Success");
    }else{console.log("Fail");}


})

require('./task.model');
require('./task.admin');
require('./task.user');
require('./task.userconfirm');
require('./task.resetconfirm');


