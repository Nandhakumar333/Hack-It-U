const mongoose = require('mongoose');
const testcase = mongoose.model('Testcase');

module.exports.create = (req, res) => {
    var t = new testcase();
    t.name = req.body.name;
    t.questionid = req.body.questionid;
    t.sample = req.body.sample;
    t.input = req.body.input;
    t.expected = req.body.expected;
    t.score = req.body.score;
    console.log(req.body.sample);
    t.save((err, doc) => {
        if(!err)
            res.redirect(`/faculty/view/${req.body.questionid}`);
        else
            console.log(err);
    });
};

module.exports.view = (req, res) => {
    testcase.findById(req.params._id, (err, doc) =>{
        if (!err) {
            res.render('tests/updateCase.hbs', {title: "Update Test Case", username: req.user.fullName, tCase: doc});
        }
        else {
            console.log(err);
        }
    });
};

module.exports.update = (req, res) => {
    testcase.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        console.log(doc)
        if (!err) {
            let _id = req.body.questionid;
            res.redirect(`/faculty/view/${_id}`)
        }
    });
}

module.exports.delete = (req, res) => {
    testcase.findByIdAndRemove(req.params._id, (err, doc) => {
        if (!err) {
            res.redirect('back');
        }
        else { console.log('Error in user delete :' + err); }
    });
};