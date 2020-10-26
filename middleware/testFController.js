require('../models/Form');
require('../models/Tests');
require('../models/User');

const mongoose = require('mongoose');
const test = mongoose.model('Testdetail');
const testR = mongoose.model('TestResult');
const User = mongoose.model('Users');

module.exports.create = (req,res) => {
    var c = new test();
    c.title = req.body.title;
    c.dept = req.body.dept;
    c.duration = req.body.duration;
    c.question = req.body.question;
    c.marks = req.body.marks;
    c.save((err,doc)=>{
    if (!err)
        res.redirect(`/faculty/${req.body.title}`);
    else
        console.log('Error during record insertion : ' + err);
   });
};

module.exports.delete = (req, res) => {
    test.deleteOne({'title': req.params.title}, (err) => {
        if (!err) {
            req.flash('message', "Test Deleted");
            res.redirect('/faculty');
        }
        else {
            res.redirect('back');
        }
    });
};

module.exports.view = (req, res) => {
    test.findOne({'title': req.params.title}, (err, test) =>{
        if (!err) {
            res.render('faculty/testView.hbs', {message: req.flash('message'), username: req.user.fullName, title: test.title, form: test, layout: 'userLayout'});
        }
        else {
            res.redirect('back');
        }
    });
};

module.exports.update = (req, res) => {
    test.findOneAndUpdate({'title': req.params.title}, req.body, {new: true}, (err, test) => {
        if (!err) {
            req.flash('message', "Updated Successfully!");
            res.redirect('back');
        }
        else {
            req.flash('message', "Updated Failed!");
            res.redirect('back');
        }
    });
};

module.exports.close = (req, res) => {
    test.findOneAndUpdate({title: req.params.title}, {status: 'completed'}, {new: true}, (err, test) => {
        if (!err) {
            req.flash('message', "Updated Successfully!");
            res.redirect('back');
        }
        else {
            req.flash('message', "Updated Failed!");
            res.redirect('back');
        }
    });
};

module.exports.setStatus = (req, res) => {
    User.find({role: 'student'}, (err, docs) => {
        if (err) throw err;
        for (let user of docs) {
            var r = new testR();
            r.user = user.fullName;
            r.test = req.params.title;
            r.attempted = false;
            r.save((err, doc) => {
                if (err) throw err;
                console.log(doc);
            });
        }
        res.redirect('/faculty');
    });
};