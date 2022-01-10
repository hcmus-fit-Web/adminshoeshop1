const  mongoose = require('mongoose');
// const slugify = require('slugify');


const userSchema = mongoose.Schema({

    username: {
        type : String,
        require : true
    },
    password:{
        type: String
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    phone:{
        type:String
    },
    isBan :{
        type:Boolean
    },
    isConfirm:{
        type: Boolean,
        default : false
    }
})

const User = mongoose.model('user',userSchema,'user');
module.exports = User;


