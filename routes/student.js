require('../models/Form');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { compiler } = require('../middleware/compilerController');

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

app.get('/profile', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err, docs) => {
        res.render('student/profile.hbs', {user: docs[0], message: req.flash('message')});
    });
});

var testC = require('../middleware/testSController');

app.use('/viewTest',ensureAuthenticated, testC.testAvail);

app.get('/:title',ensureAuthenticated, testC.paginatedResults);

app.post('/compile', compiler, (req, res) => {
    let score = req.app.get('score');
    let pass = req.app.get('passed');
    res.send({score, pass});
});

var compilerC = require('../middleware/compilerController');
app.post('/check', compilerC.check);

app.get('/', ensureAuthenticated, (req, res) => {
    User.find({email: req.user.email}, (err,docs)=>{
        if(docs[0].role=='student' || docs[0].role=='admin'){
            test.find({'status': 'active'}).exec((err, tests) => {
                res.render('student/home.hbs', {user: docs[0], test: tests, message: req.flash('message')});
            });
        }
        else{
          res.redirect('/faculty');
          }
    });
})

var sf = require('../middleware/sfController');
app.post('/update', ensureAuthenticated, sf.update);

module.exports = app;