var compression = require('compression');
var express = require('express');
var app = express();
var courses = require ('./master.json');
var search = require('./search.json');

app.use(compression());

app.use(function(req,res,next){
  //console.log(req.ip);
  //fs.appendFile('iplog.txt', req.ip)
  next();
});

app.use(express.static('public/'));

app.get('/api/:id', function(req, res){
  res.send(JSON.stringify(courses[req.params.id]));
});

app.get('/search/:id', function(req, res){
  res.send(JSON.stringify(search[req.params.id]));
})


app.listen(3000, 'localhost', function(){
  console.log("Server started at 3000");
});
