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
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'userLayout', layoutsDir: 'views/layouts/', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'hbs');

app.get('/', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err,docs) => {
        if(docs[0].role=='faculty' || docs[0].role=='admin'){
            test.find({'status': 'active'}).exec((err, tests) => {
                test.find({'status': 'completed'}).exec((err, testsC) => {
                    res.render('faculty/home.hbs', {user: docs[0], test: tests, testC: testsC});
                });
            });
        }
        else{
            res.redirect('/student');
        }
    })
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err, docs) => {
        res.render('faculty/profile.hbs', {user: docs[0], message: req.flash('message')});
    });
});

var sf = require('../middleware/sfController');
app.post('/profile/update', ensureAuthenticated, sf.update);

app.get('/createTest', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err,docs) => {
        res.render('faculty/createTest.hbs', {user: docs[0]});
    });
});

var form = require('../middleware/testFController');
app.post('/create', ensureAuthenticated, form.create);

app.post('/created', (req, res) => {
    res.redirect('/faculty');
});

app.post('/:title/update', ensureAuthenticated, form.update);

app.get('/:title/view', ensureAuthenticated, form.view);

app.post('/:title/cancel', ensureAuthenticated, form.delete);

var uploads = require('../middleware/uploadController');

app.get('/viewTest', ensureAuthenticated, uploads.testAvail);

app.get('/:title', ensureAuthenticated, uploads.loadHome);

app.post('/uploadTest/upload', ensureAuthenticated, uploads.uploadFile);

app.get('/:title/viewFiles', ensureAuthenticated, uploads.viewTest);

app.post('/del/:_id', ensureAuthenticated, uploads.delete);

app.get('/view/:filename', ensureAuthenticated, uploads.testcase);

var testCase = require('../middleware/testCaseController');
app.post('/addCase', testCase.create);

app.get('/delCase/:_id', testCase.delete);

module.exports = app;