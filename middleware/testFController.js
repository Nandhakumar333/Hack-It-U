require('../routes/faculty');

const mongoose = require('mongoose');
const test = mongoose.model('Testdetail');

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
            res.render('testView.hbs', {message: req.flash('message'),form: test, layout: false});
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