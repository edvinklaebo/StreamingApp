var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


app.get('/chat', function(req, res) {
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/chat/*', function(req, res) {
  res.json({success: 'get call succeed!', url: req.url});
});

app.post('/chat', function(req, res) {
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/chat/*', function(req, res) {
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.put('/chat', function(req, res) {
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/chat/*', function(req, res) {
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.delete('/chat', function(req, res) {
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/chat/*', function(req, res) {
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

module.exports = app
