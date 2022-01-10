const mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    username: {
        type : String,
        require : true
    },
    email: {
        type : String,
    },
    name:{
        type: String
    },
    password:{
        type: String
    },
    number:{
        type:String
    },
    isBan: {
        type: Boolean,
        default : false
    },
    isConfirm:{
        type: Boolean,
        default : false
    },
    resetLink:{
        type:String,
        default: ''
    }
})

const Admin = mongoose.model('admin',adminSchema,"admin");
module.exports = Admin
