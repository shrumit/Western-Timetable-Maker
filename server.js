var compression = require('compression');
var express = require('express');
var app = express();
var courses = require ('./master.json');
var search = require('./search.json');

app.use(compression());

app.use(express.static('public'));

app.get('/api/:id', function(req, res){
  res.send(courses[req.params.id]);
});

app.get('/search/:id', function(req, res){
  res.send(search[req.params.id]);
})

var port = process.argv[2] || 3000;
app.listen(port, 'localhost', function(){
  console.log("Server started at " + port);
});
