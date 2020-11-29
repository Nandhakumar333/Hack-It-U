require('../models/Form');
require('../models/Tests');

const MongoClient = require('mongodb');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage')
const mongoose = require('mongoose');

const url = "mongodb+srv://mongo:mongo@cluster0-4zn27.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "test";

const test= mongoose.model('Testdetail');
const testR = mongoose.model('TestResult');

let storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return {
      bucketName: 'uploads',       //Setting collection name, default name is fs
      filename: file.originalname     //Setting file name to original name of file
    }
  }
});

let upload = null;

storage.on('connection', (db) => {
  //Setting up upload for a single file
  upload = multer({
    storage: storage
  }).single('file1');
  
});

module.exports = {
  ensureAttempted : (req, res, next) => {
    testR.findOne({user: req.user.fullName, test: req.params.title}, (err, doc) => {
      if (err) throw err;
      if (doc.attempted == false)
        return next();
      else
        res.redirect('/student');
    });
  },

  checkUser : (req, res, next) => {
    test.find((err, tests) => {
      if (err) throw err;
      for (let check of tests) {
        testR.findOne({user: req.user.fullName, test: check.title}, (err, doc) => {
          if (doc !== null) {
            console.log('Already set!');
          }
          else {
              var r = new testR();
              r.user = req.user.fullName;
              r.test = check.title;
              r.attempted = false;
              r.save((err, doc) => {
                  if (err) throw err;
              }); 
          }
        });
      }
    });
    return next();
  }
};

module.exports.paginatedResults = async (req, res) => {
  let Title = req.params.title;
  let questions, timer;
  test.findOne({'title': `${req.params.title}`}).exec((err, docs) => {
    if (docs !== null)
    {
      questions = docs.question;
      timer = docs.duration;
    }
  });
  
  MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, client){

  if(err){
      return res.render('test.hbs', {title: Title, message: 'MongoClient Connection error', error: err.errMsg, layout: false});
  }
  const db = client.db(dbName);
  
  const collection = db.collection('uploads.files');
  const collectionChunks = db.collection('uploads.chunks');

  const page = parseInt(req.query.page)
  const limit = 1

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  req.app.set('Title', Title);

  if(page !== req.app.get('curpage')) {
    req.app.set('passed', 0);
    req.app.set('score', 0);
    req.app.set('language', '');
    req.app.set('code', '');
  }

  let lang = req.app.get('language');
  let code = req.app.get('code');
  try {
    collection.find({'filename': {$regex: `^${Title}_Q`}}).limit(limit).skip(startIndex).toArray(function(err, docs){
      if(err){
        return res.render('test.hbs', {title: Title, message: 'Error finding file', error: err.errMsg, layout: false});
      }
      if(!docs || docs.length === 0){
        return res.render('test.hbs', {title: Title, message: 'No file found', layout: false});
      }else{
      //Retrieving the chunks from the db
        collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray(function(err, chunks){
          if(err){
            return res.render('test.hbs', {title: Title, message: 'Error retrieving chunks', error: err.errmsg, layout: false});
          }
          if(!chunks || chunks.length === 0){
            //No data found
            return res.render('test.hbs', {title: Title, message: 'No data found', layout: false});
          }
          //Append Chunks
          let fileData = [];
          for(let i=0; i<chunks.length;i++){
            //This is in Binary JSON or BSON format, which is stored
            //in fileData array in base64 endocoded string format
            fileData.push(chunks[i].data.toString('base64'));
          }
          //Display the chunks using the data URI format
          let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
          req.app.set('qid', docs[0]._id);
          req.app.set('curpage', page);
          res.render('test.hbs', {title: Title, fileurl: finalFile, pages: page, total: questions, dur: encodeURIComponent(JSON.stringify(timer)), layout: false});
        });
      } 
    });
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  });
};