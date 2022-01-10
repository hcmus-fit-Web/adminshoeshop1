var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();
const productController = require('../controller/productController');
const cloudinary = require("../uploads/cloudinary");
const fs = require("fs");
const upload = require("../uploads/multer");

/* GET home page. */
router.get("/",(req,res)=>{
    res.render("addOredit",{
        viewTitle:"Product"
    })
})

router.post("/" ,upload.array("image",5),async(req,res)=>{


    const uploader = async (path)=>await cloudinary.uploads(path,'Images')


    const urls = []

    const  files = req.files

    for (const file of files){
        const {path} = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
    }

    if(req.body._id == ""){
        productController.insertRecord(req,res,urls);
    }else{
        productController.updateRecord(req,res,urls);
    }
})

//Product
router.get('/table',productController.divpage);

module.exports = router;