const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model('user');
const PAGE_SIZE = 4;
exports.insertUser = async (req,res)=>{
    const user = new User();
    const passwordHash = await bcrypt.hash( req.body.password, 10)

    user.username = req.body.username;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.mobilephone = req.body.mobilephone;
    user.password = passwordHash;
    // user.isBan = false;


    user.save((err, doc) => {
        if (!err) {
            res.redirect('tableUser');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("tableUser", {
                    viewTitle: 'Insert Product',
                    user: req.body
                })
            }
            console.log("Error Insert" + err);
        }
    });
}

exports.updateUser = (req,res)=>{
    User.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc)=>{
        if (!err){
            res.redirect("tableUser");
        }else{

            if(err.name == "ValidationError"){
                handleValidationError(err,req.body);
                res.render("addOrEditUser",{
                    viewTitle:'Update Product',
                    user:req.body
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

        User.find({isBan:false},(err,docs)=>{
            if (!err){
                res.render("tableUser",{
                    user:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();

    }else{
        page = 1;
        var skip = (page - 1) * PAGE_SIZE;

        User.find({isBan:false},(err,docs)=>{
            if (!err){
                res.render("tableUser",{
                    user:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();
    }
}
