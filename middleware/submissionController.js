require('../routes/student');

const MongoClient = require('mongodb');
const { ObjectId } = require('mongodb');

const url = "mongodb+srv://mongo:mongo@cluster0-4zn27.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "test";

module.exports = {
    submit: (req, res, next) =>{
        MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true }, async (err, client) => {
            if (err) throw err;
            const db = client.db(dbName);
            let collName = req.app.get('Title');
            let flag = false;
            
            db.listCollections({name: collName}).next((err, collinfo) => {
                if (collinfo) {
                    flag = true;
                }
            });

            if (flag)
            {
                db.createCollection(collName, (err, res) => {
                    if (err) throw err;
                        console.log('Collection Created');
                });
            }

            const title = db.collection(collName);
            let qid = req.app.get('qid');
            let language = req.app.get('language');
            let code = req.app.get('code');
            let pass = req.app.get('passed');
            let score = req.app.get('score');
            
            var sub = { name: req.user.fullName, questionid: qid, languageUsed: language, code: code, passedCases: pass, score: score};
            var query = { name: req.user.fullName, questionid: qid };

            var count = await title.countDocuments(query);

            if (count > 0) {
                title.updateOne(query, {$set: sub}, (err, res) => {
                    if(!err)
                        console.log('Document Updated');
                    else
                        throw err;
                });
            }
            else {
                title.insertOne(sub, (err, res) => {
                    if (err) throw err;
                    console.log("Document inserted");
                });
            }
            return next();
        })
    }
};