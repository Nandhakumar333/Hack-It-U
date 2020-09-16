const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

const session = require('express-session');
require('./config/passport')(passport);

//MiddleWare
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', forwardAuthenticated, (req, res) => {
    res.render('index.ejs');
});

app.get('/user',(req, res) => {
  res.send({user: req.user})
});

app.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})

//Routes

//Register
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

var userReg = require('./middleware/sfController');
app.use('/registerUser', userReg.register);

//Upload Files
var uploads = require('./routes/uploads');
app.use('/uf', ensureAuthenticated, uploads);

//Admin
var admin = require('./routes/admin.js');
app.use('/admin', admin);

//Student
var student = require('./routes/student');
app.use('/student',student);

//Faculty
var faculty = require('./routes/faculty');
app.use('/faculty',faculty);

//Port
const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => console.log(`Server started on port ${port}`));