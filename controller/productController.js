const mongoose = require("mongoose");
const productService = require('../services/productService');
const Product = mongoose.model('product');
const PAGE_SIZE = 4;

exports.insertRecord = (req,res,urls)=> {
    const product = new Product();

    //Product
    product.productid = req.body.productid;
    product.price = req.body.price;
    product.image = urls[0]['url'];
    product.image1 =  urls[1]['url'];
    product.image2 = urls[2]['url'];
    product.image3 =  urls[3]['url'];
    product.image4 = urls[4]['url'];
    product.detail = req.body.detail;
    product.type = req.body.type;
    product.name = req.body.name;
    product.brand = req.body.brand;
    product.color = req.body.color;
    product.discount = req.body.discount;

    console.log(product._id + product.name + product.price + product.image + '\n');

    if (product._id + product.name + product.price + product.image !=  "") {
        product.save((err, doc) => {
            if (!err) {
                res.redirect('table');
            } else {
                if (err.name == "ValidationError") {
                    handleValidationError(err, req.body);
                    res.render("addOredit", {
                        viewTitle: 'Insert Product',
                        product: req.body
                    })
                }
                console.log("Error Insert" + err);
            }
        });
    }


}

exports.updateRecord = (req,res)=>{
    Product.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc)=>{
        if (!err){
            res.redirect("table");
        }else{

            if(err.name == "ValidationError"){
                handleValidationError(err,req.body);
                res.render("addOredit",{
                    viewTitle:'Update Product',
                    product:req.body
                })
            }
            console.log("Error Update"+err);

        }
    })

}

exports.divpage= (req,res)=>{
    var page = req.query.page;

    if(page) {
        page = parseInt(page);
        if (page < 1){page = 1;}

        var skip = (page - 1) * PAGE_SIZE;

        Product.find((err,docs)=>{
            if (!err){
                res.render("table",{
                    list:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();

    }else{
        page = 1;
        var skip = (page - 1) * PAGE_SIZE;

        Product.find((err,docs)=>{
            if (!err){
                res.render("table",{
                    list:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();
    }
}


exports.findSearch = async (req,res)=>{
    const products = await productService.findSearch(req,res);
    res.render("table",{list:products});
}