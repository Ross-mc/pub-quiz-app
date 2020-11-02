var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
const url = "mongodb+srv://root:DaisyDog123@cluster0.cv47v.mongodb.net/pub-quiz-db?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;

var foundQuizzes = [];

var ObjectId = require('mongodb').ObjectId; 



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname+'/public/index.html');
});



router.post("/quizzes", (req, res) => {
  
  var userData = {
    title: req.body.title,
    username: req.body.username,
    questions: req.body.questions.split(','),
    answers: req.body.answers.split(',')
 }

  mongo.connect(url, function (err, db){
    if (err) throw err;
    console.log('Successful connection');
    const collection = db.db().collection("quizzes");
    collection.insertOne(userData, function(err, result){
      if (err) throw err;
      console.log('quiz inserted');
      db.close;
    })
  })

    res.redirect("/");

});



router.post("/search-title", (req, res, next) => {
  var usersearch = req.body.search_title;

  

  mongo.connect(url, function (err, db){
    console.log('Successful connection');
    const collection = db.db().collection("quizzes");

    
    var query = {title: usersearch}
    collection.find(query).toArray(function(err, result){
      if (err) throw err;
      db.close
      foundQuizzes = result;

      if (foundQuizzes.length === 0){
        // alert('No quizzes with that username were found')
      } else{
        var JSONdata = JSON.stringify(foundQuizzes);
        console.log(JSONdata);
        res.render('quiz-search.pug', {userTitle: `Found quizzes with title of ${usersearch}`, quizzes: foundQuizzes, data: JSONdata});

        router.get('/quiz-play', (req, res) => {

  
        
          res.send(foundQuizzes);
        

        });

      }

    })
  })
});



module.exports = router;
