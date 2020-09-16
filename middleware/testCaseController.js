const mongoose = require('mongoose');
const testcase = mongoose.model('Testcase');

module.exports.create = (req, res) => {
    var t = new testcase();
    t.name = req.body.name;
    t.questionid = req.body.questionid;
    t.input = req.body.input;
    t.expected = req.body.expected;
    t.score = req.body.score;

    t.save((err, doc) => {
        if(!err)
            res.redirect('back');
        else
            console.log(err);
    });
};

module.exports.delete = (req, res) => {
    testcase.findByIdAndRemove(req.params._id, (err, doc) => {
        if (!err) {
            res.redirect('back');
        }
        else { console.log('Error in user delete :' + err); }
    });
};