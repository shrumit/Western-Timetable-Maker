/*
Copyright (C) Shrumit Mehta 2019

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
const { execFile } = require('child_process');

var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/compute', function(req, res) {
  // console.log('req received:'+ JSON.stringify(req.body))
  
  // let args = ''
  // args += req.body.length + ' '
  // req.body.forEach(function(coursecomp) {
  //   args += coursecomp.length + ' '
  //   coursecomp.forEach(function(section) {
  //     args += section.join(' ')
  //     args += ' '
  //   })
  // })
  // console.log(args)
  let args = []
  let numCourseComps = req.body.length
  args.push(numCourseComps)
  req.body.forEach(function(coursecomp) {
    args.push(coursecomp.length)
    coursecomp.forEach(function(section) {
      args.push(...section)
    })
  })
  // console.log(args)
  const child = execFile('./main', [...args], (error, stdout, stderr) => {
    if (error) {
      console.log('ERROR:'+error)
      console.log('STDERR:'+stderr)
      console.log('STDOUT:'+stdout)
      res = res.status(500)
      res.send(error)
    } else {
      console.log(stdout.split('\n'))
      let result = []
      let info = {}
      stdout.split('\n').forEach(function(line) {
        if (line.length == 0) return
        let lineArr = line.split(' ');
        let typeName = lineArr[0] // name of the evaluator
        if (typeName === 'info') {
          info.validCount = lineArr[1]
          return
        }
        lineArr.splice(0,2) // remove type name and number of tables
        let evalResults = []
        while (lineArr.length) {
          let table = {}
          table.score = lineArr[0]
          lineArr.splice(0,1) // remove score
          table.sections = lineArr.splice(0,numCourseComps)
          evalResults.push(table)
        }
        evalResults.sort(function(a,b) {
          return b.score - a.score
        })
        result.push({type: typeName, tables: evalResults})
      })
      res = res.status(200)
      res.send({info: info, schemes: result})
    }
  })
  
  // res = res.status(200)
  // res.send(req.body)
})

var port = process.argv[2] || 3100;
app.listen(port, 'localhost', function(){
  console.log("Compute server started at " + port);
});
