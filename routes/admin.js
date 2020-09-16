require('../models/db');

const express = require('express');
const path = require('path');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const userController = require('../middleware/userController');

//MiddleWare
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../views'));
app.set('views', path.join(__dirname + '/../views'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: 'views/layouts/', handlebars: allowInsecurePrototypeAccess(Handlebars), helpers:{
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

app.use('/', userController);

module.exports = app;