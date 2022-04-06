const express = require('express');
const router = express.Router();
const Invoice = require('../incoming/incoming.model');
var MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const incomingModel = require('../incoming/incoming.model');
const invoice = express();
const incomingService = require('./incoming.service');
const { mquery } = require('mongoose');
invoice.use(bodyParser.json());
var ObjectId = require('mongodb').ObjectID;


var url = "mongodb+srv://root:example@cluster0.oltk1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

router.delete('/:_id', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  try {
    console.log('Löschung wird aufgerufen, mit id' + req.params._id)
    MongoClient.connect(url,function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("customers").deleteOne({ _id: ObjectId(req.params._id) }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log('Löschung wird aufgerufen')
    res.json({ message: err })
  }
});





//ROUTES
router.get('/', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log("Ich war hier");
  try {
    await MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      console.log("Header: " + req.headers.username);
      dbo.collection("customers").find({ username: req.headers.username }).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);

        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log("error: " + err);
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
      dbo.collection("customers").aggregate([{ $match: { username: req.headers.username } }, { $group: { _id: "$categorie", amount: { $push: "$$ROOT" } } }, {
        $addFields:
        {
          amount: { $sum: "$amount.amount" }
        }
      }]).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log("error: " + err);
    res.json({ message: err })
  }
});

router.get('/invoicebydate', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      var start = new Date("2022-03-30");
      var end = new Date("2021-03-01");
      dbo.collection("customers").aggregate([{
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
        console.log(result);
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log("error: " + err);
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
      dbo.collection("customers").aggregate([{
        $match: { // filter to limit to whatever is of importance
          "date": {
            $gte: end,
            $lte: start
          }
        }
      }, {
        $group: { // group by
          _id: {
            "month": { $month: "$date" }, // month
            "year": { $year: "$date" }
          }, // and year
           amount: { $push: "$$ROOT" }
         // "count": { $sum: 1 }  // and sum up all documents per group
        }
      }]).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log("error: " + err);
    res.json({ message: err })
  }
});

router.get('/:title', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      dbo.collection("customers").findOne({ "title": req.params.title }, function (err, result) {
        if (err) throw err;
        console.log(result);
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
  var date = new Date(rawdate);
  const invoice = new Invoice({
    title: req.body.title,
    categorie: req.body.categorie,
    amount: req.body.amount,
    username: req.body.username,
    date: date
  });
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("invoice");
    dbo.collection("customers").insertOne(invoice, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
    res.json(invoice);
  });
});

router.put('/:_id', async (req, res) => {
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("invoice");
      var myquery = { _id: ObjectId(req.params._id) };
      var rawdate = req.body.date;
      var rawamount = req.body.amount;
      console.log('RAWDATE: ' +rawdate);

      //create a new Date object
      var date = new Date(rawdate);
      date.setHours(date.getHours() + 2);
      console.log('NEWDATE: ' +date);
      var amount = parseInt(rawamount);
      var myquery = { _id: ObjectId(req.params._id) };

      //create a new Date object
      var date = new Date(rawdate)
      var newvalues = { $set: { title: req.body.title, amount: amount, categorie: req.body.categorie, date: date } };
      dbo.collection("customers").updateOne(myquery, newvalues, function (err, result) {
        if (err) throw err;
        console.log("1 document updated");
        res.json(result);
        db.close();
      });
    });
  }
  catch (err) {
    console.log('Löschung wird aufgerufen')
    res.json({ message: err })
  }
});




module.exports = router;
