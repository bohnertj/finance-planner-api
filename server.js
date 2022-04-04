require('rootpath')();
const express = require('express');
const app = express();
//const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());

//app.use(cors(corsOptions)) // Use this after the variable declaration
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

const invoicesRoutes = require ('./incoming/incoming.controller')
app.use('/api/v1/invoice', invoicesRoutes);


app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/index.html');
});
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
