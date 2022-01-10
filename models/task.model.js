const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    productid: {
        type : String,
        require : true
    },
    price:{
        type: String
    },
    image:{
        type:String
    },
    image1:{
        type:String
    },
    image2:{
        type:String
    },
    image3:{
        type:String
    },
    image4:{
        type:String
    },
    detail:{
        type:String
    },
    type:{
        type:String
    },
    name:{
        type:String
    },
    brand: {
        type:String
    },
    color:{
        type:String
    },
    discount:{
        type:String
    }
})

mongoose.model('product',productSchema,'product');
