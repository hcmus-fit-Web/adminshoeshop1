const mongoose = require("mongoose");
const ResetLinkSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});

const ResetLink =  mongoose.model('resetlink',ResetLinkSchema,'resetpasswordconfirm');
module.exports = ResetLink;
