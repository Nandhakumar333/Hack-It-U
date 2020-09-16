const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const test = mongoose.model('Testdetail');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { role } = require('fs');
const { loadavg } = require('os');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

var router = express.Router();

// Login Page
router.get('/home', ensureAuthenticated, (req, res) => {
    test.find({'status': 'active'}).exec((err, docs) => {
        // Check if files
        res.render('admin/home.hbs', {tests: docs});
      });
});

router.get('/', ensureAuthenticated, (req, res) => {
    res.render("admin/addOrEdit", {
        viewTitle: "Add User"
    });
});


router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            if (err) throw err;
            req.body.password = hash;
            var user = new User();
            user.fullName = req.body.fullName;
            user.email = req.body.email;
            user.phone = req.body.phone;
            user.dept = req.body.dept;
            user.rollno = req.body.rollno;
            user.password = req.body.password;
            var n=user.email;
            if(n.match(/.cse/i)){
                user.role = 'faculty';
            }
            user.save((err, doc) => {
                if (!err){
                    req.flash('success_msg', 'Registered');
                    res.redirect('admin/student');
                }
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.redirect('back');
                    }
                    else
                        console.log('Error during record insertion : ' + err);        
                }
            });
        });
    });
}

function updateRecord(req, res) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt,(err, hash) => {
            if (err) throw err;
            req.body.password = hash;
            User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
                if (!err) { res.redirect('admin/student'); }
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.render("admin/addOrEdit", {
                            viewTitle: 'Update User',
                            user: req.body
                        });
                    }
                    else
                        console.log('Error during record update : ' + err);
                }
            });
        });
    });
}


router.get('/cancel', ensureAuthenticated, (req, res) => {
    res.redirect('/admin/student');
});

router.get('/student', ensureAuthenticated, (req, res) => {
    User.find({role:'student'},(err, docs) => {
        if (!err) {
            res.render("admin/student", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});

router.get('/faculty', ensureAuthenticated, (req, res) => {
    User.find({role:'faculty'},(err, docs) => {
        if (!err) {
            res.render("admin/staff", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', ensureAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("admin/addOrEdit", {
                viewTitle: "Update User",
                user: doc
            });
        }
    }); 
});

router.get('/view/:id', ensureAuthenticated, (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("admin/viewUser", {
                user: doc
            }); 
        }
    }); 
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('back');
        }
        else { console.log('Error in user delete :' + err); }
    });
});
router.post('/login', (req, res, next) => {
    User.find({email:req.body.email},(err, docs) => {
        if(docs.length <= 0) {
            req.flash("error_msg", "You are not a registered user.");
            res.redirect('/');
        }
        else {
            if(docs[0].role == "faculty"){
                logF(req, res, next);
            }
            else if(docs[0].role == "student"){
                logS(req, res, next);
            }
            else if(docs[0].role == "admin"){
                logA(req, res, next);
            }
        } 
    });
});

function logF(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/faculty',
        failureRedirect: '/',
        failureFlash: true
      })(req, res, next);
}

function logS(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/student',
        failureRedirect: '/',
        failureFlash: true
      })(req ,res, next);
}

function logA(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/admin/home',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
}

module.exports = router;