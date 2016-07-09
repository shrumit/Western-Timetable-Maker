var compression = require('compression');
var express = require('express');
var app = express();
var courses = require ('./master.json');
var search = require('./search.json');

var one_day = 86400000;

app.use('/', function(req,res,next){
  console.log(req.ip);
  next();
});

app.get('/api/:id', function(req, res){
  console.log(req.params.id);
  res.end(JSON.stringify(courses[req.params.id]));
});

app.get('/search/:id', function(req, res){
  console.log('search');
  res.end(JSON.stringify(search[req.params.id]));
})

app.use(compression());

app.use(express.static(__dirname + '/'));

app.listen(3000, function () {
  console.log("Server started at 3000");
});
