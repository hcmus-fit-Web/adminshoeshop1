const mongoose = require("mongoose");

const Product = mongoose.model('product');


exports.findSearch = (req,res)=>{
    return new Promise((resolve,reject) => {
        Product.find({name:req.body.search}).then(data=>{
            resolve(data)
        }).catch(err => reject(new Error(err)))
    })
}