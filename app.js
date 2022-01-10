require('./models/db');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
require("dotenv").config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const bcrypt = require('bcrypt');
const loggedInUserGuard = require('./middlewares/loggedInUserGuard');

const taskController = require('./routes/taskController');

const passport = require('./passport');
const ForgetRouter = require('../adminshoeshop/routes/forget');
const authRouter = require('./admin/index');
const Admin = require('../adminshoeshop/models/task.admin');
const Token = require('../adminshoeshop/models/task.userconfirm');
require('dotenv').config();


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "super-secret-key",

}));
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
  res.locals.user = req.user
  next();
})
const adminController = require('../adminshoeshop/controller/adminController');
app.use('/' , authRouter);

app.get('/forget/:email/:token',adminController.confirmEmail);
app.post('/reset/:email/:id', async (req,res)=>{
  const password = req.body.password;
  const enpassword = req.body.enpassword;
  const {id} = req.params;
  if (password === enpassword){
    const passwordHash = await bcrypt.hash(password,10);
    await Admin.findOneAndUpdate({_id:id} ,{password:passwordHash})
    res.render('login');
  }
});

app.get('/reset/:email/:token',adminController.resetpassword);
app.use('/forget',ForgetRouter);
app.use('/', loggedInUserGuard,taskController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
