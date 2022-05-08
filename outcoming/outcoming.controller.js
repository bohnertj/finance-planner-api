const express = require('express');
const router = express.Router();
const Salary = require('../outcoming/outcoming.model');
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const outcomingModel = require('../outcoming/outcoming.model');
const salary = express();
const outcomingService = require('./outcoming.service');
const { mquery } = require('mongoose');
salary.use(bodyParser.json());
var ObjectId = require('mongodb').ObjectID;


var url = "mongodb+srv://root:example@cluster0.oltk1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

router.delete('/:_id', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    console.log('Löschung wird aufgerufen, mit id: ' + req.params._id)
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("salary").deleteOne({ _id: ObjectId(req.params._id) }, function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});


//ROUTES
router.get('/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    await MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("salary").find({ username: req.headers.username }).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});

router.get('/categories', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("salary").aggregate([{ $match: { username: req.headers.username } }, { $group: { _id: "$categorie", amount: { $push: "$$ROOT" } } }, {
        $addFields:
        {
          amount: { $sum: "$amount.amount" }
        }
      }]).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});

router.get('/salarybydate', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      var start = new Date("2022-03-30");
      var end = new Date("2021-03-01");
      dbo.collection("salary").aggregate([{
        $match: { username: req.headers.username }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          }, amount: { $push: "$$ROOT" }
        }
      }, {
        $addFields:
        {
          amount: { $sum: "$amount.amount" }
        }
      }]).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});



router.get('/test', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      var start = new Date("2022-03-30");
      var end = new Date("2020-02-01");
      dbo.collection("salary").aggregate([{
        $match: { // filter to limit to whatever is of importance
          "date": {
            $gte: end,
            $lte: start
          }
        }
      }, {
        $group: { // group by
          _id: {
            "month": { $month: "$date" },
            "year": { $year: "$date" }
          },
          amount: { $push: "$$ROOT" }
        }
      }]).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});

router.get('/:title', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("salary").findOne({ "title": req.params.title }, function (err, result) {
        if (err) throw err;
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});

router.post('/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var rawdate = req.body.date;
  //create a new Date object
  var germanDate = new Date(rawdate);
  germanDate.setHours(germanDate.getHours() + 2);
  const salary = new Salary({
    title: req.body.title,
    categorie: req.body.categorie,
    amount: req.body.amount,
    username: req.body.username,
    date: germanDate
  });
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("invoice");
    dbo.collection("salary").insertOne(salary, function (err, res) {
      if (err) throw err;
      console.log("Neuer Eintrag hinzugefügt");
      db.close();
    });
    res.json(salary);
  });
});

router.put('/:_id', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      var myquery = { _id: ObjectId(req.params._id) };
      var rawdate = req.body.date;
      var rawamount = req.body.amount;
      //create a new Date object
      var germanDate = new Date(rawdate);
      germanDate.setHours(germanDate.getHours() + 2);
      var amount = parseInt(rawamount);
      var newvalues = { $set: { title: req.body.title, amount: amount, categorie: req.body.categorie, date: germanDate } };
      dbo.collection("salary").updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        console.log("Eintrag geupdated");
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    res.json({ message: err })
  }
});

module.exports = router;