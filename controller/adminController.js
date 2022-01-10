const adminService = require('../services/adminService');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = mongoose.model('admin');
const Token = mongoose.model('token');
// const ResetLink = mongoose.model('resetlink');
require("dotenv").config();
const PAGE_SIZE = 4;
const nodemailer = require("nodemailer");
const {v4: uuidv4} = require("uuid");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASSWORD,
    }
})

transporter.transporter.verify((error,success)=>{

    if (error){
        console.log(error);

    }else {
        console.log("Ready for messages");
        console.log(success);
    }

})

exports.register = async (req, res) => {
    const {username, email, name, password, number} = req.body;
    const admin = await adminService.register(username, email, name, password, number);
    res.redirect('/admin');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/login');
}

exports.login = (req, res) => {
    const wrongPassword = req.query['wrong-password'] !== undefined;
    res.render('login', {wrongPassword});
}

exports.insertUserAdmin = async (req,res)=> {
    const admin = new Admin();
    const passwordHash = await bcrypt.hash( req.body.password, 10)

    //Admin
    admin.username = req.body.username;
    admin.email = req.body.email;
    admin.name = req.body.name;
    admin.password = passwordHash;
    admin.number = req.body.number;


    admin.save((err, doc) => {
        if (!err) {
            var token = new Token({ _userId: admin._id, token: crypto.randomBytes(16).toString('hex') });
            token.save(function (err) {
                if(err){
                    return res.status(500).send({msg:err.message});
                }

                // Send email (use credintials of SendGrid)
                var mailOptions = { from: process.env.AUTH_EMAIL ,
                                    to: admin.email,
                                    subject: 'Account Verification Link',
                                    text: 'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/forget\/' + admin.email + '\/' + token.token + '\n\nThank You!\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res.status(500).send({msg:'Technical Issue!, Please click on resend for verify your Email.'});
                    }
                    return res.status(200).send('A verification email has been sent to ' + admin.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                });
            });
            res.redirect('admin');
        } else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("register", {
                    viewTitle: 'Insert Product',
                    admin: req.body
                })
            }
            console.log("Error Insert" + err);
        }
    });

}

exports.updateUserAdmin = (req,res) => {

    Admin.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc)=>{
        if (!err){
            req.logout();
            res.redirect("login");
        }else{
            if(err.name == "ValidationError"){
                handleValidationError(err,req.body);
                res.render("register",{
                    viewTitle:'Update Admin',
                    admin:req.body
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

        Admin.find({$and : [{isBan:false},{_id:{$ne: req.user.id}}]} ,(err,docs)=>{
            if (!err){
                res.render("admin",{
                    list:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();

    }else{
        page = 1;
        var skip = (page - 1) * PAGE_SIZE;

        Admin.find({$and : [{isBan:false},{_id:{$ne: req.user.id}}]} ,(err,docs)=>{
            if (!err){
                res.render("admin",{
                    list:docs
                })
            }
        }).skip(skip).limit(PAGE_SIZE).lean();
    }
}

exports.confirmEmail = function (req, res, next) {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired
        if (!token){
            return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        }
        // if token is found then check valid user
        else{
            Admin.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user){
                    return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
                }
                // user is already verified
                else if (user.isConfirm){
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else{
                    // change isVerified to true
                    user.isConfirm = true;
                    user.save(function (err) {
                        // error occur
                        if(err){
                            return res.status(500).send({msg: err.message});
                        }
                        // account successfully verified
                        else{
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });
};

exports.forget =async (req,res) =>{

    const username= req.body.username;
    const email= req.body.email;
    Admin.findOne({$and: [{username:username},{email:email}]},function (err,user){

        if (!user){
            return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        }
        // if token is found then check valid user
        else {
            var token = new Token({_userId: user._id, token: crypto.randomBytes(16).toString('hex')});
            token.save(function (err) {
                if (err) {
                    return res.status(500).send({msg: err.message});
                }

                // Send email (use credintials of SendGrid)
                var mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: user.email,
                    subject: 'Account Verification Link',
                    text: 'Hello ' + user.email + ',\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + req.headers.host + '\/reset\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                };

                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res.status(500).send({msg: 'Technical Issue!, Please click on resend for verify your Email.'});
                    }
                    return res.status(200).send('A verification email has been sent to ' + req.body.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
                });
            });

        }
})
}

exports.resetpassword = async function (req, res, next) {

    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired
        if (!token){
            return res.status(400).send({msg:'Your verification link may have expired. Please click on resend for verify your Email.'});
        }
        // if token is found then check valid user
        else{
             Admin.findOne({ _id: token._userId, email: req.params.email }, function (err, user) {
                // not valid user
                 console.log(user);
                if (!user){
                    return res.status(401).send({msg:'We were unable to find a user for this verification. Please SignUp!'});
                }
                else{

                    res.render("resetpassword",{
                        admin:user
                    });

                    // user.isConfirm = true;
                    // user.save(function (err) {
                    //     // error occur
                    //     if(err){
                    //         return res.status(500).send({msg: err.message});
                    //     }
                    //     // account successfully verified
                    //     else{
                    //         return res.status(200).send('Your account has been successfully verified');
                    //     }
                    // });
                }
            });
        }

    });
};

exports.reset = async (req,res) =>{

    // Admin.findOneAndUpdate({_id:req.params._id,},{password:passwordHash},{new:true},(err,doc)=>{
    //
    // });

}
