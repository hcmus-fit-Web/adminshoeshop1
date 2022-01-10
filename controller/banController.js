const banService = require('../services/banService');

exports.dsBan =  async (req,res)=>{
    const users =  await banService.dsBan(req,res);
    res.render('Unban',{users});
}
exports.unban = async (req,res) => {
    await banService.unban(req,res);
    const users =  await banService.dsBan(req,res);
    res.render('Unban',{users});
}


exports.dsBanUser =  async (req,res)=>{
    const users =  await banService.dsBanUser(req,res);
    res.render('UnbanUser',{users});
}
exports.unbanUser = async (req,res) => {
    await banService.unbanUser(req,res);
    const users =  await banService.dsBanUser(req,res);
    res.render('UnbanUser',{users});
}