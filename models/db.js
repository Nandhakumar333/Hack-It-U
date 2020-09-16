const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mongo:mongo@cluster0-4zn27.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true, useCreateIndex:true, useNewUrlParser: true, useFindAndModify: false }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./User');
require('./TestCase');
require('./Form');