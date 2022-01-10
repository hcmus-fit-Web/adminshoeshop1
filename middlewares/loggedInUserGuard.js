module.exports = function loggedInUserGuard(req, res, next){
    if(req.user){
        if (req.user.isBan == false && req.user.isConfirm == true){
            next();
        }else{
            res.redirect('/login');
        }
    }else{
        res.redirect('/login');
    }
};