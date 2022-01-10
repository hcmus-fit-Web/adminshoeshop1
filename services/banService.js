const mongoose = require("mongoose");
const Admin = mongoose.model('admin');
const User = mongoose.model('user');

exports.dsBan = (req,res) =>{
    return new Promise((resolve,reject) => {
        console.log(req.params._id);
        Admin.find({$and: [{isBan:true},{_id :{$ne: req.user._id}}] }).then(data=>{
            resolve(data)
        }).catch(err => reject(new Error(err)))
    })
}
exports.unban = async (req,res)=>{
    await Admin.findOneAndUpdate({_id:req.params.id},{isBan:false});
}


exports.dsBanUser = (req,res) =>{
    return new Promise((resolve,reject) => {
        console.log(req.params._id);
        User.find({$and: [{isBan:true},{_id :{$ne: req.user._id}}] }).then(data=>{
            resolve(data)
        }).catch(err => reject(new Error(err)))
    })
}
exports.unbanUser = async (req,res)=>{
    await User.findOneAndUpdate({_id:req.params.id},{isBan:false});
}