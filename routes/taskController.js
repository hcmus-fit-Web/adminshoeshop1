const express = require('express');

const mongoose = require('mongoose');
const Admin = mongoose.model('admin');
const User = mongoose.model('user');
const Product = mongoose.model('product');
const authController = require("../controller/adminController");
const userController = require("../controller/userController");

const router = express.Router();
const tableAdminRouter = require('../routes/tableAdmin');
const tableRouter = require('./table');
const tableUserRouter = require('./tableUser');
const loggedInUserGuard = require('../middlewares/loggedInUserGuard');
const indexRouter = require('../routes/addOrEdit');
const usersRouter = require('../routes/users');
const adminRouter = require('../routes/admin');
const infoRouter = require('../routes/info');
const UnbanRouter = require('./Unban');
const UnbanUserRouter = require('./Unbanser');


router.use("/",indexRouter);
router.get('/logout', authController.logout);

router.use('/users',usersRouter);
router.use('/register',adminRouter);

// router.post("/register" ,loggedInUserGuard,authController.register);
router.use('/table',loggedInUserGuard,tableRouter);

router.use('/admin',loggedInUserGuard,tableAdminRouter);

router.use('/tableUser',loggedInUserGuard,tableUserRouter);
router.use('/info',infoRouter);


//
// router.get('/Unban/:id',banController.unban);
// router.get('/Unban', banController.dsBan);

router.use('/Unban',UnbanRouter);
router.use('/UnbanUser',UnbanUserRouter);



router.get('/users/:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("addOrEditUser",{
                viewTitle:"Update Product",
                user:doc
            })
        }
    })
})

router.get('/users/delete/:id',(req,res)=>{
    User.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/tableUser')
        }else{
            console.log("An error Teh Delete "+ err);
        }
    })

})



router.get('/users/ban/:id',async (req,res)=>{
    await User.findOneAndUpdate({_id:req.params.id},{isBan:true},async (err,doc)=>{
        if(!err){
            // const users =  await banService.dsBanUser(req,res);{users}
            await userController.divpage(req,res);
        }else{
            console.log("An error Teh Delete "+ err);
        }
    })
})

router.get('/:id',(req,res)=>{
    Product.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("addOredit",{
                viewTitle:"Update Product",
                product:doc
            })
        }
    })
})

router.get('/ViewUser/:id',(req,res)=>{
    console.log(req.params.id);
    User.findOne({_id:req.params.id},(err,doc)=>{

        if(!err){
            res.render("userDetail",{
                viewTitle:"Update User",
                list:doc
            })
        }
    })
})

router.get('/View/:id',(req,res)=>{
    Product.findOne({_id:req.params.id},(err,doc)=>{
        if(!err){
            res.render("productDetail",{
                viewTitle:"Update Product",
                list:doc
            })
        }
    })
})

router.get('/delete/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/table')
        }else{
            console.log("An error Teh Delete "+ err);
        }
    })

})

router.get('/register/delete/:id',(req,res)=>{
    Admin.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err){
            res.redirect('/admin')
        }else{
            console.log("An error Teh Delete "+ err);
        }
    })

})

router.get('/register/ban/:id',async (req,res)=>{
    await Admin.findOneAndUpdate({_id:req.params.id},{isBan:true},async (err,doc)=>{
        if(!err){
            // const users =  await banService.dsBan(req,res);{users}
            await authController.divpage(req,res);
        }else{
            console.log("An error Teh Delete "+ err);
        }
    })
})

router.get('/register/:id',(req,res)=>{
    Admin.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render("register",{
                viewTitle:"Update Product",
                admin:doc
            })
        }
    })
})

module.exports = router;
