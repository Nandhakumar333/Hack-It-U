require('../models/Form');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const { ensureAuthenticated } = require("../config/auth");
const { compiler } = require('../middleware/compilerController');
const { submit } = require('../middleware/submissionController');

const User = mongoose.model('Users');
const test = mongoose.model('Testdetail');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/../views'));
app.set('views', path.join(__dirname + '/../views'));

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});

app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'userLayout', layoutsDir: 'views/layouts/', handlebars: allowInsecurePrototypeAccess(Handlebars), helpers:{
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },
    ifCond: function(x, y, opts) {
        if (x == y) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    }
} }));

app.set('view engine', 'hbs');

//Home
app.get('/', ensureAuthenticated, (req, res) => {
    if(req.user.role =='student' || req.user.role =='admin') {
        test.find().exec((err, tests) => {
            res.render('student/home.hbs', {title: req.user.role, username: req.user.fullName, test: tests, message: req.flash('message')});
        });
    }
    else {
        res.redirect('/faculty');
    }
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err, docs) => {
        res.render('student/profile.hbs', {username: req.user.fullName, user: docs[0], message: req.flash('message')});
    });
});

//Tests
var testC = require('../middleware/testSController');

app.use('/viewTest',ensureAuthenticated, testC.testAvail);

app.get('/:title',ensureAuthenticated, testC.paginatedResults);

//Results
var results = require('../middleware/resultsController');
app.get('/:title/results', ensureAuthenticated, results.getResults);

app.post('/compile', compiler, submit, (req, res) => {
    let pass = req.app.get('passed');
    res.send({pass});
});

//Compiler
var compilerC = require('../middleware/compilerController');
app.post('/check', compilerC.check);

//User
var sf = require('../middleware/sfController');
app.post('/update', ensureAuthenticated, sf.update);

module.exports = app;