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


var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/compute', function(req, res) {

});

var port = process.argv[2] || 3100;
app.listen(port, 'localhost', function(){
  console.log("Compute server started at " + port);
});
