const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

let app = express();

app.use(express.static(__dirname + '/../views'));
app.set('views', path.join(__dirname + '/../views'));
app.engine('hbs', exphbs({ extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars) }));

app.set('view engine', 'hbs');

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));

require('./uploadRoutes')(app);

module.exports = app;