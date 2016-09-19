/*
Copyright (C) Shrumit Mehta 2016

This file is part of Western Timetable Maker.

Western Timetable Maker is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Western Timetable Maker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Western Timetable Maker.  If not, see <http://www.gnu.org/licenses/>.
*/

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
