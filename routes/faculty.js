require('../models/Form');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const User = mongoose.model('Users');
const test = mongoose.model('Testdetail');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/../views'));
app.set('views', path.join(__dirname + '/../views'));
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
    } 
} }));
app.set('view engine', 'hbs');

//Home
app.get('/', ensureAuthenticated, (req, res) => {
    if(req.user.role=='faculty' || req.user.role=='admin'){
        test.find({'status': 'active'}).exec((err, tests) => {
            test.find({'status': 'completed'}).exec((err, testsC) => {
                res.render('faculty/home.hbs', {title: req.user.role, username: req.user.fullName, test: tests, testC: testsC});
            });
        });
    }
    else {
        res.redirect('/student');
    }
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err, docs) => {
        res.render('faculty/profile.hbs', {username: req.user.fullName, user: docs[0], message: req.flash('message')});
    });
});

app.get('/newCase', (req, res) => {
    let qid = req.app.get('q_id');
    res.render('tests/addCase.hbs', {qid: qid, layout: false});
})

//User
var sf = require('../middleware/sfController');
app.post('/profile/update', ensureAuthenticated, sf.update);

app.get('/createTest', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err,docs) => {
        res.render('faculty/createTest.hbs', {user: docs[0]});
    });
});

//Results
var results = require('../middleware/resultsController');

app.get('/:title/viewResults', results.total);

app.get('/:title/viewResults/:name', results.getResults);

//Tests
var form = require('../middleware/testFController');
app.post('/create', ensureAuthenticated, form.create);

app.post('/created', (req, res) => {
    res.redirect('/faculty');
});

app.post('/:title/update', ensureAuthenticated, form.update);

app.get('/:title/view', ensureAuthenticated, form.view);

app.get('/:title/close', ensureAuthenticated, form.close);

app.post('/:title/cancel', ensureAuthenticated, form.delete);

//File Uploads
var uploads = require('../middleware/uploadController');

app.get('/viewTest', ensureAuthenticated, uploads.testAvail);

app.get('/:title', ensureAuthenticated, uploads.loadHome);

app.post('/uploadTest/upload', ensureAuthenticated, uploads.uploadFile);

app.get('/:title/viewFiles', ensureAuthenticated, uploads.viewTest);

app.post('/del/:_id', ensureAuthenticated, uploads.delete);

app.get('/view/:_id', ensureAuthenticated, uploads.testcase);

//TestCase
var testCase = require('../middleware/testCaseController');

app.post('/addCase', testCase.create);

app.post('/updateCase', testCase.update);

app.get('/viewCase/:_id', testCase.view);

app.get('/delCase/:_id', testCase.delete);

module.exports = app;